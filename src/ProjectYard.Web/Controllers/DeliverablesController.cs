using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class DeliverablesController : Controller
{
    private readonly AppDbContext _db;
    public DeliverablesController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? estado)
    {
        var all = await _db.Deliverables
            .Include(d => d.Project).ThenInclude(p => p!.Client)
            .Include(d => d.Owner)
            .OrderBy(d => d.DueDate).ToListAsync();
        ViewBag.All = all;
        ViewBag.Estado = string.IsNullOrEmpty(estado) ? "Todos" : estado;
        var list = ViewBag.Estado == "Todos" ? all : all.Where(d => d.Status == (string)ViewBag.Estado).ToList();
        return View(list);
    }

    /// <summary>Aprovar um entregável em aprovação.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(long id)
    {
        var d = await _db.Deliverables.FirstOrDefaultAsync(x => x.Id == id);
        if (d is null) return NotFound();
        d.Status = "Aprovado";
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{d.Name}” aprovado.";
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Submeter para aprovação (rascunho/revisão → em aprovação).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Submit(long id)
    {
        var d = await _db.Deliverables.FirstOrDefaultAsync(x => x.Id == id);
        if (d is null) return NotFound();
        d.Status = "Em aprovação";
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{d.Name}” submetido para aprovação.";
        return RedirectToAction(nameof(Index));
    }
}
