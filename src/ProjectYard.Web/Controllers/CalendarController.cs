using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class CalEvent
{
    public DateOnly Date { get; set; }
    public string Title { get; set; } = "";
    public string Cat { get; set; } = "prazo";
    public string? Project { get; set; }
    public long? Id { get; set; }              // preenchido só para eventos manuais (events)
    public TimeOnly? Time { get; set; }
}

/// <summary>Calendário — eventos derivados (tarefas, entregáveis, faturas, aprovações, fases) + eventos manuais (reuniões, visitas de obra, pessoais).</summary>
public class CalendarController : Controller
{
    // Manuais (criáveis) primeiro; derivados a seguir. Cores distintas no legend.
    public static readonly (string Id, string Label, string Color, bool Manual)[] Cats =
    {
        ("reuniao", "Reuniões", "#6a5af9", true),
        ("obra", "Visitas de obra", "#e0922a", true),
        ("pessoal", "Pessoal", "#1f9d6b", true),
        ("prazo", "Prazos", "#d65151", false),
        ("entregavel", "Entregáveis", "#9b59f5", false),
        ("faturacao", "Faturação", "#21a8c4", false),
        ("aprovacao", "Aprovações", "#2a7fb8", false),
        ("fase", "Fim de fase", "#8a949e", false),
    };

    private readonly AppDbContext _db;
    public CalendarController(AppDbContext db) => _db = db;

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    public async Task<IActionResult> Index(string? m)
    {
        var month = DateOnly.TryParse(m + "-01", out var d) ? d : new DateOnly(DateTime.Today.Year, DateTime.Today.Month, 1);

        var events = new List<CalEvent>();
        // Derivados
        events.AddRange(await _db.Tasks.Include(t => t.Project).Where(t => t.DueDate != null && t.State != "done")
            .Select(t => new CalEvent { Date = t.DueDate!.Value, Title = t.Title, Cat = "prazo", Project = t.Project.Name }).ToListAsync());
        events.AddRange(await _db.Deliverables.Include(x => x.Project).Where(x => x.DueDate != null && x.Status != "Aprovado")
            .Select(x => new CalEvent { Date = x.DueDate!.Value, Title = "Entrega: " + x.Name, Cat = "entregavel", Project = x.Project.Name }).ToListAsync());
        events.AddRange(await _db.Invoices.Include(i => i.Project).Where(i => i.DueAt != null && i.Status != "Pago")
            .Select(i => new CalEvent { Date = i.DueAt!.Value, Title = "Vencimento " + i.Number, Cat = "faturacao", Project = i.Project!.Name }).ToListAsync());
        events.AddRange((await _db.Approvals.Include(a => a.Project).Where(a => a.Status == "Aberta").ToListAsync())
            .Select(a => new CalEvent { Date = DateOnly.FromDateTime(a.CreatedAt).AddDays(7), Title = "Decisão: " + a.Title, Cat = "aprovacao", Project = a.Project?.Name }));
        events.AddRange(await _db.ProjectPhases.Include(p => p.Project).Where(p => p.EndPlanned != null && p.Status == "Em curso")
            .Select(p => new CalEvent { Date = p.EndPlanned!.Value, Title = "Fim de fase: " + p.Name, Cat = "fase", Project = p.Project.Name }).ToListAsync());
        // Manuais (tabela events)
        events.AddRange(await _db.Events.Include(e => e.Project)
            .Select(e => new CalEvent { Id = e.Id, Date = e.EventDate, Title = e.Title, Cat = e.Category, Project = e.Project != null ? e.Project.Name : null, Time = e.StartTime }).ToListAsync());

        ViewBag.Month = month;
        ViewBag.Events = events;
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code).Select(p => new { p.Id, p.Code, p.Name }).ToListAsync();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirTarefas")]
    public async Task<IActionResult> Create(string category, string title, DateOnly eventDate, TimeOnly? startTime, TimeOnly? endTime, long? projectId, string? location, string? notes)
    {
        var manual = Cats.Where(c => c.Manual).Select(c => c.Id).ToArray();
        if (string.IsNullOrWhiteSpace(title) || !manual.Contains(category) || _db.CurrentTenantId is not { } tid)
        {
            TempData["ok"] = "Indica um título e uma categoria válida (Reunião, Visita de obra ou Pessoal).";
            return RedirectToAction(nameof(Index), new { m = eventDate.ToString("yyyy-MM") });
        }
        _db.Events.Add(new Event
        {
            TenantId = tid,
            ProjectId = projectId,
            Category = category,
            Title = title.Trim(),
            EventDate = eventDate,
            StartTime = startTime,
            EndTime = endTime,
            Location = string.IsNullOrWhiteSpace(location) ? null : location.Trim(),
            Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim(),
            OwnerUserId = CurrentUserId(),
            CreatedBy = CurrentUserId(),
            CreatedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        TempData["ok"] = "Evento criado.";
        return RedirectToAction(nameof(Index), new { m = eventDate.ToString("yyyy-MM") });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirTarefas")]
    public async Task<IActionResult> Delete(long id, string? m)
    {
        var e = await _db.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (e is not null) { _db.Events.Remove(e); await _db.SaveChangesAsync(); TempData["ok"] = "Evento eliminado."; }
        return RedirectToAction(nameof(Index), new { m });
    }
}
