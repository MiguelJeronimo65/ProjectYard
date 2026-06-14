using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

/// <summary>
/// Cronograma (DHTMLX Gantt). Dois ecrãs: por projeto (Index) e portfólio (Global).
/// Previsto (baseline) vs real (barra), atrasos a vermelho, fases críticas, marcador "hoje".
/// </summary>
public class GanttController : Controller
{
    private readonly AppDbContext _db;
    public GanttController(AppDbContext db) => _db = db;

    private static bool IsLate(ProjectPhase ph)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        if (ph.Status == "Concluída")
            return ph.EndReal is { } er && ph.EndPlanned is { } ep && er > ep;
        return ph.EndPlanned is { } e && e < today && ph.Status != "Concluída";
    }

    /// <summary>Cronograma por projeto (com seletor de projeto).</summary>
    public async Task<IActionResult> Index(long? project)
    {
        var projects = await _db.Projects
            .Where(p => _db.ProjectPhases.Any(ph => ph.ProjectId == p.Id && ph.StartPlanned != null))
            .OrderBy(p => p.Code).ToListAsync();
        var selected = projects.FirstOrDefault(p => p.Id == project) ?? projects.FirstOrDefault();
        ViewBag.Projects = projects;
        ViewBag.Selected = selected;
        return View();
    }

    /// <summary>Cronograma global (portfólio multi-ano, previsto vs real).</summary>
    public async Task<IActionResult> Global()
    {
        var phases = await _db.ProjectPhases.Where(ph => ph.StartPlanned != null).ToListAsync();
        ViewBag.NProjetos = phases.Select(p => p.ProjectId).Distinct().Count();
        ViewBag.NFases = phases.Count;
        ViewBag.NCriticas = phases.Count(p => p.Critical);
        ViewBag.NAtraso = phases.Count(IsLate);
        ViewBag.NConcluidas = phases.Count(p => p.Status == "Concluída");
        ViewBag.NCurso = phases.Count(p => p.Status == "Em curso");
        ViewBag.NInit = phases.Count(p => p.Status == "Por iniciar");
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> Data(long? project)
    {
        var projects = await _db.Projects.OrderBy(p => p.Code).ToListAsync();
        var phasesQ = _db.ProjectPhases.Where(ph => ph.StartPlanned != null);
        if (project is { } pid) phasesQ = phasesQ.Where(ph => ph.ProjectId == pid);
        var phases = await phasesQ.OrderBy(ph => ph.SortOrder).ToListAsync();
        var byProject = phases.GroupBy(ph => ph.ProjectId)
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.SortOrder).ToList());

        static string? F(DateOnly? d) => d?.ToString("yyyy-MM-dd");
        static string Color(ProjectPhase ph) => IsLate(ph) ? "#d65151"
            : ph.Status switch { "Concluída" => "#1f9d6b", "Em curso" => "#2a7fb8", _ => "#8a949e" };

        var data = new List<object>();
        var links = new List<object>();
        var lid = 1;
        foreach (var p in projects)
        {
            if (!byProject.TryGetValue(p.Id, out var phs) || phs.Count == 0) continue;
            data.Add(new { id = p.Code, text = p.Name, type = "project", open = true, progress = 0.0, health = p.Health });
            string? prev = null;
            foreach (var ph in phs)
            {
                data.Add(new
                {
                    id = ph.Code,
                    text = ph.Name,
                    parent = p.Code,
                    start_date = F(ph.StartReal ?? ph.StartPlanned),
                    end_date = F(ph.EndReal ?? ph.EndPlanned),
                    planned_start = F(ph.StartPlanned),
                    planned_end = F(ph.EndPlanned),
                    progress = (double)(ph.CompletionPct ?? 0) / 100.0,
                    status = ph.Status,
                    critica = ph.Critical,
                    late = IsLate(ph),
                    color = Color(ph),
                });
                if (prev != null) links.Add(new { id = lid++, source = prev, target = ph.Code, type = "0" });
                prev = ph.Code;
            }
        }
        return Json(new { data, links });
    }
}
