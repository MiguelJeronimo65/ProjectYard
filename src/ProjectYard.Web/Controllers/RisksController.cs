using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class RisksController : Controller
{
    private readonly AppDbContext _db;
    public RisksController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.Risks.Include(r => r.Project).Include(r => r.Owner)
            .OrderByDescending(r => r.Probability * r.Impact).ToListAsync());

    [HttpGet]
    public async Task<IActionResult> Create()
    {
        await Selects();
        return View("Form", new Risk { Status = "Aberto", Probability = 3, Impact = 3 });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Risk input)
    {
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        _db.Risks.Add(input);
        await _db.SaveChangesAsync();
        TempData["ok"] = "Risco criado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(long id)
    {
        var r = await _db.Risks.FirstOrDefaultAsync(x => x.Id == id);
        if (r is null) return NotFound();
        await Selects();
        return View("Form", r);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(long id, Risk input)
    {
        var r = await _db.Risks.FirstOrDefaultAsync(x => x.Id == id);
        if (r is null) return NotFound();
        Clean();
        if (!ModelState.IsValid) { await Selects(); return View("Form", input); }
        r.Title = input.Title; r.ProjectId = input.ProjectId; r.Category = input.Category;
        r.Probability = input.Probability; r.Impact = input.Impact; r.OwnerId = input.OwnerId;
        r.Status = input.Status; r.Mitigation = input.Mitigation;
        await _db.SaveChangesAsync();
        TempData["ok"] = "Risco atualizado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(long id)
    {
        var r = await _db.Risks.FirstOrDefaultAsync(x => x.Id == id);
        if (r is not null) { _db.Risks.Remove(r); await _db.SaveChangesAsync(); TempData["ok"] = "Risco eliminado."; }
        return RedirectToAction(nameof(Index));
    }

    private void Clean()
    {
        ModelState.Remove(nameof(Risk.Tenant));
        ModelState.Remove(nameof(Risk.Project));
        ModelState.Remove(nameof(Risk.Owner));
    }

    private async System.Threading.Tasks.Task Selects()
    {
        var tid = _db.CurrentTenantId;
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code)
            .Select(p => new SelectListItem($"{p.Code} — {p.Name}", p.Id.ToString())).ToListAsync();
        ViewBag.Users = await _db.Users.Where(u => u.TenantId == tid).OrderBy(u => u.Name)
            .Select(u => new SelectListItem(u.Name, u.Id.ToString())).ToListAsync();
    }
}
