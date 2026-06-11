using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

/// <summary>Cronograma (DHTMLX Gantt) — fases dos projetos do tenant, previsto vs real + dependências FS.</summary>
public class GanttController : Controller
{
    private readonly AppDbContext _db;
    public GanttController(AppDbContext db) => _db = db;

    public IActionResult Index() => View();

    [HttpGet]
    public async Task<IActionResult> Data()
    {
        var projects = await _db.Projects.OrderBy(p => p.Code).ToListAsync();
        var phases = await _db.ProjectPhases.Where(ph => ph.StartPlanned != null)
            .OrderBy(ph => ph.SortOrder).ToListAsync();
        var byProject = phases.GroupBy(ph => ph.ProjectId)
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.SortOrder).ToList());

        static string? F(DateOnly? d) => d?.ToString("yyyy-MM-dd");
        static string Color(string s) => s switch { "Concluída" => "#1f9d6b", "Em curso" => "#2a7fb8", _ => "#8a949e" };

        var data = new List<object>();
        var links = new List<object>();
        var lid = 1;
        foreach (var p in projects)
        {
            if (!byProject.TryGetValue(p.Id, out var phs) || phs.Count == 0) continue;
            data.Add(new { id = p.Code, text = p.Name, type = "project", open = true, progress = 0.0 });
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
                    color = Color(ph.Status),
                });
                if (prev != null) links.Add(new { id = lid++, source = prev, target = ph.Code, type = "0" });
                prev = ph.Code;
            }
        }
        return Json(new { data, links });
    }
}
