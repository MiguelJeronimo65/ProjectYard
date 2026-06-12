using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

/// <summary>Registo de horas — grelha semanal pessoal (editável e persistida), fiel ao protótipo.</summary>
public class TimesheetsController : Controller
{
    private readonly AppDbContext _db;
    public TimesheetsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? w, string? view)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var monday = ParseMonday(w) ?? Monday(today);
        var days = Enumerable.Range(0, 7).Select(i => monday.AddDays(i)).ToArray();
        var userId = CurrentUserId();

        var entries = await _db.TimeEntries
            .Include(t => t.Project)
            .Where(t => t.UserId == userId && t.EntryDate >= days[0] && t.EntryDate <= days[6])
            .ToListAsync();

        var rows = entries
            .GroupBy(t => new { t.ProjectId, Phase = t.Description ?? "", Tipo = t.Type ?? "", Billable = t.Billable == true })
            .Select(g =>
            {
                var row = new TimesheetRow
                {
                    ProjectId = g.Key.ProjectId,
                    ProjectName = g.First().Project?.Name ?? "Interno",
                    ProjectCode = g.First().Project?.Code ?? "—",
                    Phase = g.Key.Phase,
                    Tipo = g.Key.Tipo,
                    IsBillable = g.Key.Billable,
                };
                foreach (var e in g)
                    row.Hours[e.EntryDate.DayNumber - days[0].DayNumber] += e.Hours;
                return row;
            })
            .OrderBy(r => r.ProjectCode == "—").ThenBy(r => r.ProjectCode)
            .ToList();

        var rate = await _db.Users.Where(u => u.Id == userId).Select(u => u.CostHour).FirstOrDefaultAsync() ?? 0m;
        var name = User.FindFirstValue(Identity.AppUserClaimsPrincipalFactory.DisplayName) ?? "";

        var vm = new TimesheetViewModel
        {
            Monday = monday,
            Days = days,
            TodayIdx = (today >= days[0] && today <= days[6]) ? today.DayNumber - days[0].DayNumber : -1,
            IsCurrentWeek = monday == Monday(today),
            Rows = rows,
            Rate = rate,
            UserFirstName = name.Split(' ').FirstOrDefault() ?? name,
            View = view == "project" ? "project" : "grid",
            Projects = await _db.Projects.OrderBy(p => p.Code).Select(p => ValueTuple.Create(p.Id, p.Code, p.Name)).ToListAsync(),
        };
        return View(vm);
    }

    /// <summary>Edição inline de uma célula da grelha (upsert/remoção do registo desse dia).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetCell(long? projectId, string? phase, string? tipo, bool billable, string date, decimal hours)
    {
        if (!DateOnly.TryParse(date, out var d)) return BadRequest();
        if (hours is < 0 or > 24) return BadRequest();
        var userId = CurrentUserId();

        var entry = await _db.TimeEntries.FirstOrDefaultAsync(t =>
            t.UserId == userId && t.EntryDate == d && t.ProjectId == projectId &&
            (t.Description ?? "") == (phase ?? "") && (t.Type ?? "") == (tipo ?? ""));

        var rate = await _db.Users.Where(u => u.Id == userId).Select(u => u.CostHour).FirstOrDefaultAsync();
        if (entry is null)
        {
            if (hours == 0) return Ok(new { ok = true });
            _db.TimeEntries.Add(new TimeEntry
            {
                TenantId = _db.CurrentTenantId ?? 0,
                EntryDate = d,
                UserId = userId,
                ProjectId = projectId,
                Hours = hours,
                Type = string.IsNullOrEmpty(tipo) ? null : tipo,
                Billable = billable,
                Description = string.IsNullOrEmpty(phase) ? null : phase,
                Cost = rate is { } r ? hours * r : null,
                CreatedAt = DateTime.Now,
            });
        }
        else if (hours == 0)
        {
            _db.TimeEntries.Remove(entry);
        }
        else
        {
            entry.Hours = hours;
            entry.Cost = rate is { } r ? hours * r : null;
        }
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    /// <summary>Adicionar uma linha (projeto/fase/tipo) à grelha da semana — cria um registo no 1.º dia útil.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddRow(long? projectId, string? phase, string? tipo, bool billable, string monday)
    {
        if (!DateOnly.TryParse(monday, out var mon)) return RedirectToAction(nameof(Index));
        var userId = CurrentUserId();
        var rate = await _db.Users.Where(u => u.Id == userId).Select(u => u.CostHour).FirstOrDefaultAsync();
        _db.TimeEntries.Add(new TimeEntry
        {
            TenantId = _db.CurrentTenantId ?? 0,
            EntryDate = mon,
            UserId = userId,
            ProjectId = projectId,
            Hours = 1,
            Type = string.IsNullOrEmpty(tipo) ? "Produção" : tipo,
            Billable = billable,
            Description = string.IsNullOrEmpty(phase) ? null : phase,
            Cost = rate is { } r ? 1 * r : null,
            CreatedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        TempData["ok"] = "Linha adicionada à semana.";
        return RedirectToAction(nameof(Index), new { w = mon.ToString("yyyy-MM-dd") });
    }

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;
    private static DateOnly Monday(DateOnly d) => d.AddDays(-(((int)d.DayOfWeek + 6) % 7));
    private static DateOnly? ParseMonday(string? w) => DateOnly.TryParse(w, out var d) ? Monday(d) : null;
}
