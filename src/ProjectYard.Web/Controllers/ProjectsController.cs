using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class ProjectsController : Controller
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) => _db = db;

    private long? CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    public async Task<IActionResult> Index(string? status, string? health, long? pm, string? view)
    {
        var all = await _db.Projects.Include(p => p.Client).Include(p => p.Manager).OrderBy(p => p.Code).ToListAsync();

        var filtered = all.Where(p =>
            (string.IsNullOrEmpty(status) || status == "Todos" || p.Status == status) &&
            (string.IsNullOrEmpty(health) || p.Health == health) &&
            (pm is null || p.ManagerUserId == pm)).ToList();

        var ids = filtered.Select(p => p.Id).ToList();
        var openTasks = await _db.Tasks.Where(t => ids.Contains(t.ProjectId) && t.State != "done")
            .GroupBy(t => t.ProjectId).Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var overdue = await _db.Tasks.Where(t => ids.Contains(t.ProjectId) && t.Overdue)
            .GroupBy(t => t.ProjectId).Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var delivs = await _db.Deliverables.Where(d => ids.Contains(d.ProjectId))
            .GroupBy(d => d.ProjectId).Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var apprs = await _db.Approvals.Where(a => a.ProjectId != null && ids.Contains(a.ProjectId.Value) && a.Status == "Aberta")
            .GroupBy(a => a.ProjectId!.Value).Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var progress = await _db.ProjectPhases.Where(ph => ids.Contains(ph.ProjectId))
            .GroupBy(ph => ph.ProjectId).Select(g => new { g.Key, P = g.Average(x => x.CompletionPct ?? 0) })
            .ToDictionaryAsync(x => x.Key, x => (int)Math.Round(x.P));
        var teams = await _db.ProjectMembers.Where(m => ids.Contains(m.ProjectId)).Include(m => m.User)
            .GroupBy(m => m.ProjectId).Select(g => new { g.Key, Names = g.Select(x => x.User.Name).ToList() })
            .ToDictionaryAsync(x => x.Key, x => x.Names);

        var vm = new ProjectsListViewModel
        {
            Total = all.Count,
            EmCurso = all.Count(p => p.Status == "Em curso"),
            EmRisco = all.Count(p => p.Status == "Em risco"),
            Filter = string.IsNullOrEmpty(status) ? "Todos" : status,
            FHealth = health,
            FPm = pm,
            View = view == "list" ? "list" : "grid",
            Gestores = all.Where(p => p.Manager != null).Select(p => (p.Manager!.Id, p.Manager!.Name)).Distinct().ToList(),
            Items = filtered.Select(p => new ProjectListItem
            {
                Project = p,
                Progress = progress.GetValueOrDefault(p.Id),
                OpenTasks = openTasks.GetValueOrDefault(p.Id),
                Overdue = overdue.GetValueOrDefault(p.Id),
                Deliverables = delivs.GetValueOrDefault(p.Id),
                Approvals = apprs.GetValueOrDefault(p.Id),
                Team = teams.GetValueOrDefault(p.Id, new List<string>()),
            }).ToList(),
        };
        return View(vm);
    }

    public async Task<IActionResult> Details(long id)
    {
        var project = await _db.Projects.Include(p => p.Client).Include(p => p.Manager).FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();

        var phases = await _db.ProjectPhases.Where(p => p.ProjectId == id).OrderBy(p => p.SortOrder).ToListAsync();
        var team = await _db.ProjectMembers.Where(m => m.ProjectId == id).Include(m => m.User)
            .Select(m => new TeamMemberVm
            {
                Name = m.User.Name,
                Funcao = m.User.Funcao ?? "",
                Rate = m.User.CostHour,
                IsPm = m.UserId == project.ManagerUserId,
            }).ToListAsync();

        var vm = new ProjectDetailsViewModel
        {
            Project = project,
            Phases = phases,
            Progress = phases.Count == 0 ? 0 : (int)Math.Round(phases.Average(p => (double)(p.CompletionPct ?? 0))),
            Tasks = await _db.Tasks.Include(t => t.Assignee).Where(t => t.ProjectId == id).ToListAsync(),
            Deliverables = await _db.Deliverables.Include(d => d.Owner).Where(d => d.ProjectId == id).OrderBy(d => d.DueDate).ToListAsync(),
            Milestones = await _db.PaymentMilestones.Where(m => m.ProjectId == id).ToListAsync(),
            Risks = await _db.Risks.Include(r => r.Owner).Where(r => r.ProjectId == id).ToListAsync(),
            Invoices = await _db.Invoices.Where(i => i.ProjectId == id).OrderByDescending(i => i.IssuedAt).ToListAsync(),
            Team = team.OrderByDescending(t => t.IsPm).ToList(),
        };

        // Histórico de estados (mais recente primeiro) + nome do autor.
        var hist = await _db.ProjectStatusHistories.Where(h => h.ProjectId == id)
            .OrderByDescending(h => h.ChangedAt).ThenByDescending(h => h.Id).ToListAsync();
        var authorIds = hist.Where(h => h.ChangedBy != null).Select(h => h.ChangedBy!.Value).Distinct().ToList();
        var authors = await _db.Users.Where(u => authorIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => u.Name);
        ViewBag.StatusHistory = hist;
        ViewBag.StatusAuthors = authors;
        return View(vm);
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Create()
    {
        await Selects();
        return View("Form", new Project { Status = "Em curso", Priority = "Média", Health = "green" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Create(Project input)
    {
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        _db.Projects.Add(input);
        await _db.SaveChangesAsync();
        // 1.ª entrada do histórico de estados.
        _db.ProjectStatusHistories.Add(new ProjectStatusHistory
        {
            ProjectId = input.Id,
            Status = input.Status,
            ChangedBy = CurrentUserId(),
            ChangedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        TempData["ok"] = "Projeto criado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Edit(long id)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (p is null) return NotFound();
        await Selects();
        return View("Form", p);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Edit(long id, Project input, string? statusNote, DateTime? statusDate)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (p is null) return NotFound();
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        var statusChanged = p.Status != input.Status;
        p.Code = input.Code; p.Name = input.Name; p.ClientId = input.ClientId; p.ManagerUserId = input.ManagerUserId;
        p.Type = input.Type; p.Status = input.Status; p.Priority = input.Priority; p.Health = input.Health;
        p.PhaseCurrent = input.PhaseCurrent; p.StartPlanned = input.StartPlanned; p.EndPlanned = input.EndPlanned;
        p.Fees = input.Fees; p.Budget = input.Budget; p.Spent = input.Spent; p.Notes = input.Notes;
        // Histórico: cada mudança de estado regista observação (opcional) + data do evento + autor.
        if (statusChanged)
        {
            _db.ProjectStatusHistories.Add(new ProjectStatusHistory
            {
                ProjectId = p.Id,
                Status = input.Status,
                Note = string.IsNullOrWhiteSpace(statusNote) ? null : statusNote.Trim(),
                ChangedBy = CurrentUserId(),
                ChangedAt = statusDate ?? DateTime.Now,
            });
        }
        await _db.SaveChangesAsync();
        TempData["ok"] = statusChanged ? $"Projeto atualizado · estado → {input.Status}." : "Projeto atualizado.";
        return RedirectToAction(nameof(Details), new { id });
    }

    private void Clean()
    {
        ModelState.Remove(nameof(Project.Tenant));
        ModelState.Remove(nameof(Project.Client));
        ModelState.Remove(nameof(Project.Manager));
    }

    private async System.Threading.Tasks.Task Selects()
    {
        var tid = _db.CurrentTenantId;
        ViewBag.Clients = await _db.Clients.OrderBy(c => c.Company)
            .Select(c => new SelectListItem(c.Company, c.Id.ToString())).ToListAsync();
        ViewBag.Managers = await _db.Users.Where(u => u.TenantId == tid).OrderBy(u => u.Name)
            .Select(u => new SelectListItem(u.Name, u.Id.ToString())).ToListAsync();
    }
}
