using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class ApprovalsController : Controller
{
    private readonly AppDbContext _db;
    public ApprovalsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? tipo, long? sel)
    {
        var all = await _db.Approvals
            .Include(a => a.Project)
            .Include(a => a.RequestedByUser)
            .OrderByDescending(a => a.Status == "Aberta").ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
        ViewBag.All = all;
        ViewBag.Tipo = string.IsNullOrEmpty(tipo) ? "Todos" : tipo;
        var list = ViewBag.Tipo == "Todos" ? all : all.Where(a => a.Type == (string)ViewBag.Tipo).ToList();
        ViewBag.List = list;

        var current = list.FirstOrDefault(a => a.Id == sel) ?? list.FirstOrDefault(a => a.Status == "Aberta") ?? list.FirstOrDefault();
        ViewBag.Current = current;
        ViewBag.Steps = current is null
            ? new List<ProjectYard.Data.Entities.ApprovalStep>()
            : await _db.Set<ProjectYard.Data.Entities.ApprovalStep>()
                .Include(s => s.User)
                .Where(s => s.ApprovalId == current.Id)
                .OrderBy(s => s.SortOrder)
                .ToListAsync();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(long id)
    {
        var a = await _db.Approvals.FirstOrDefaultAsync(x => x.Id == id);
        if (a is null) return NotFound();
        a.Status = "Aprovada";
        var steps = await _db.Set<ProjectYard.Data.Entities.ApprovalStep>().Where(s => s.ApprovalId == id).ToListAsync();
        foreach (var s in steps) { s.State = "done"; s.ActedAt ??= DateTime.Now; }
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{a.Title}” aprovado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Return(long id, string? reason)
    {
        var a = await _db.Approvals.FirstOrDefaultAsync(x => x.Id == id);
        if (a is null) return NotFound();
        a.Status = "Devolvida";
        if (!string.IsNullOrWhiteSpace(reason))
            a.Note = string.IsNullOrEmpty(a.Note) ? $"Devolvido: {reason.Trim()}" : a.Note + $"\nDevolvido: {reason.Trim()}";
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{a.Title}” devolvido para alterações.";
        return RedirectToAction(nameof(Index));
    }
}
