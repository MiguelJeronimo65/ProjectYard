using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class TimesheetsController : Controller
{
    private readonly AppDbContext _db;
    public TimesheetsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.TimeEntries.Include(t => t.Project).Include(t => t.User)
            .OrderByDescending(t => t.EntryDate).ThenBy(t => t.Id).ToListAsync());

    [HttpGet]
    public async Task<IActionResult> Create()
    {
        await Selects();
        return View(new TimeEntry
        {
            EntryDate = DateOnly.FromDateTime(DateTime.Today),
            UserId = CurrentUserId(),
            Billable = true,
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(TimeEntry input)
    {
        ModelState.Remove(nameof(TimeEntry.Tenant));
        ModelState.Remove(nameof(TimeEntry.Project));
        ModelState.Remove(nameof(TimeEntry.Phase));
        ModelState.Remove(nameof(TimeEntry.User));
        if (!ModelState.IsValid) { await Selects(); return View(input); }
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        var rate = await _db.Users.Where(u => u.Id == input.UserId).Select(u => u.CostHour).FirstOrDefaultAsync();
        input.Cost = rate is { } r ? input.Hours * r : null;
        _db.TimeEntries.Add(input);
        await _db.SaveChangesAsync();
        TempData["ok"] = "Registo de horas criado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(long id)
    {
        var t = await _db.TimeEntries.FirstOrDefaultAsync(x => x.Id == id);
        if (t is not null) { _db.TimeEntries.Remove(t); await _db.SaveChangesAsync(); TempData["ok"] = "Registo eliminado."; }
        return RedirectToAction(nameof(Index));
    }

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    private async System.Threading.Tasks.Task Selects()
    {
        var tid = _db.CurrentTenantId;
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code)
            .Select(p => new SelectListItem($"{p.Code} — {p.Name}", p.Id.ToString())).ToListAsync();
        ViewBag.Users = await _db.Users.Where(u => u.TenantId == tid).OrderBy(u => u.Name)
            .Select(u => new SelectListItem(u.Name, u.Id.ToString())).ToListAsync();
    }
}
