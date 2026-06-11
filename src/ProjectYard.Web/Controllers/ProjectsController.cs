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

    public async Task<IActionResult> Index()
        => View(await _db.Projects.Include(p => p.Client).Include(p => p.Manager).OrderBy(p => p.Code).ToListAsync());

    public async Task<IActionResult> Details(long id)
    {
        var project = await _db.Projects.Include(p => p.Client).Include(p => p.Manager).FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();
        var vm = new ProjectDetailsViewModel
        {
            Project = project,
            Phases = await _db.ProjectPhases.Where(p => p.ProjectId == id).OrderBy(p => p.SortOrder).ToListAsync(),
            Tasks = await _db.Tasks.Include(t => t.Assignee).Where(t => t.ProjectId == id).ToListAsync(),
            Deliverables = await _db.Deliverables.Include(d => d.Owner).Where(d => d.ProjectId == id).ToListAsync(),
            Milestones = await _db.PaymentMilestones.Where(m => m.ProjectId == id).ToListAsync(),
            Risks = await _db.Risks.Include(r => r.Owner).Where(r => r.ProjectId == id).ToListAsync(),
        };
        return View(vm);
    }

    [HttpGet]
    public async Task<IActionResult> Create()
    {
        await Selects();
        return View("Form", new Project { Status = "Em curso", Priority = "Média", Health = "green" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Project input)
    {
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        _db.Projects.Add(input);
        await _db.SaveChangesAsync();
        TempData["ok"] = "Projeto criado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(long id)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (p is null) return NotFound();
        await Selects();
        return View("Form", p);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(long id, Project input)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (p is null) return NotFound();
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        p.Code = input.Code; p.Name = input.Name; p.ClientId = input.ClientId; p.ManagerUserId = input.ManagerUserId;
        p.Type = input.Type; p.Status = input.Status; p.Priority = input.Priority; p.Health = input.Health;
        p.PhaseCurrent = input.PhaseCurrent; p.StartPlanned = input.StartPlanned; p.EndPlanned = input.EndPlanned;
        p.Fees = input.Fees; p.Budget = input.Budget; p.Spent = input.Spent; p.Notes = input.Notes;
        await _db.SaveChangesAsync();
        TempData["ok"] = "Projeto atualizado.";
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
