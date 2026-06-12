using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class CalEvent
{
    public DateOnly Date { get; set; }
    public string Title { get; set; } = "";
    public string Cat { get; set; } = "prazo";
    public string? Project { get; set; }
}

/// <summary>Calendário — eventos reais derivados de tarefas, entregáveis, faturas, aprovações e fases.</summary>
public class CalendarController : Controller
{
    public static readonly (string Id, string Label, string Color)[] Cats =
    {
        ("prazo", "Prazos", "#d65151"),
        ("entregavel", "Entregáveis", "#6a5af9"),
        ("faturacao", "Faturação", "#1f9d6b"),
        ("aprovacao", "Aprovações", "#2a7fb8"),
        ("fase", "Fim de fase", "#e0922a"),
    };

    private readonly AppDbContext _db;
    public CalendarController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? m)
    {
        var month = DateOnly.TryParse(m + "-01", out var d) ? d : new DateOnly(DateTime.Today.Year, DateTime.Today.Month, 1);

        var events = new List<CalEvent>();
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

        ViewBag.Month = month;
        ViewBag.Events = events;
        return View();
    }
}
