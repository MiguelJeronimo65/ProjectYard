using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class DeliverablesController : Controller
{
    private readonly AppDbContext _db;
    public DeliverablesController(AppDbContext db) => _db = db;

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    private static string NextVersion(string? current)
    {
        if (string.IsNullOrWhiteSpace(current)) return "v1";
        var digits = new string(current.Where(char.IsDigit).ToArray());
        return int.TryParse(digits, out var n) ? "v" + (n + 1) : "v2";
    }

    private async System.Threading.Tasks.Task LogVersion(Deliverable d, string status, string? note)
    {
        _db.DeliverableVersions.Add(new DeliverableVersion
        {
            DeliverableId = d.Id,
            Version = d.Version ?? "v1",
            Status = status,
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim(),
            CreatedBy = CurrentUserId(),
            CreatedAt = DateTime.Now,
        });
    }

    public async Task<IActionResult> Index(string? estado)
    {
        var all = await _db.Deliverables
            .Include(d => d.Project).ThenInclude(p => p!.Client)
            .Include(d => d.Owner)
            .OrderBy(d => d.DueDate).ToListAsync();
        ViewBag.All = all;
        ViewBag.Estado = string.IsNullOrEmpty(estado) ? "Todos" : estado;
        var list = ViewBag.Estado == "Todos" ? all : all.Where(d => d.Status == (string)ViewBag.Estado).ToList();

        // Histórico de versões do entregável em foco (o 1.º em aprovação).
        var fluxo = all.FirstOrDefault(d => d.Status == "Em aprovação");
        if (fluxo != null)
        {
            var versions = await _db.DeliverableVersions.Where(v => v.DeliverableId == fluxo.Id)
                .OrderByDescending(v => v.CreatedAt).ThenByDescending(v => v.Id).ToListAsync();
            var authorIds = versions.Where(v => v.CreatedBy != null).Select(v => v.CreatedBy!.Value).Distinct().ToList();
            ViewBag.VersionAuthors = await _db.Users.Where(u => authorIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => u.Name);
            ViewBag.Versions = versions;
        }
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
        await LogVersion(d, "Aprovado", null);
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{d.Name}” aprovado.";
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Submeter para aprovação (rascunho/revisão → em aprovação), com bump de versão se vinha de revisão.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Submit(long id)
    {
        var d = await _db.Deliverables.FirstOrDefaultAsync(x => x.Id == id);
        if (d is null) return NotFound();
        if (d.Status == "Precisa revisão") d.Version = NextVersion(d.Version); // nova revisão = nova versão
        d.Status = "Em aprovação";
        await LogVersion(d, "Submetido para aprovação", null);
        await _db.SaveChangesAsync();
        TempData["ok"] = $"“{d.Name}” submetido para aprovação ({d.Version}).";
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Pedir alterações (em aprovação → precisa revisão), com observação no histórico de versões.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RequestChanges(long id, string? note)
    {
        var d = await _db.Deliverables.FirstOrDefaultAsync(x => x.Id == id);
        if (d is null) return NotFound();
        d.Status = "Precisa revisão";
        await LogVersion(d, "Alterações pedidas", note);
        await _db.SaveChangesAsync();
        TempData["ok"] = $"Pedidas alterações a “{d.Name}”.";
        return RedirectToAction(nameof(Index));
    }
}
