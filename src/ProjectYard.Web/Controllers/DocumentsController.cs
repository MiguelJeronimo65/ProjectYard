using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class DocumentsController : Controller
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public DocumentsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public async Task<IActionResult> Index(string? pasta)
    {
        var all = await _db.Documents.Include(d => d.Project).Include(d => d.Uploader)
            .OrderByDescending(d => d.UploadedAt).ToListAsync();
        ViewBag.All = all;
        ViewBag.Pasta = pasta;
        ViewBag.Folders = all.Select(d => d.Folder).Where(f => !string.IsNullOrEmpty(f)).Distinct().OrderBy(f => f).ToList();
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code).Select(p => new { p.Id, p.Code, p.Name }).ToListAsync();
        ViewBag.Shown = string.IsNullOrEmpty(pasta) ? all : all.Where(d => d.Folder == pasta).ToList();
        return View();
    }

    /// <summary>Upload real: grava o ficheiro em wwwroot/uploads e regista o documento (v1).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    [RequestSizeLimit(100_000_000)]
    public async Task<IActionResult> Upload(IFormFile? file, string? folder, long? projectId)
    {
        if (file is null || file.Length == 0)
        {
            TempData["ok"] = "Seleciona um ficheiro.";
            return RedirectToAction(nameof(Index));
        }
        var safeName = Path.GetFileName(file.FileName);
        var ext = Path.GetExtension(safeName).TrimStart('.').ToUpperInvariant();
        var doc = new Document
        {
            TenantId = _db.CurrentTenantId ?? 0,
            ProjectId = projectId,
            Name = safeName,
            Ext = ext.Length > 12 ? ext[..12] : ext,
            SizeBytes = file.Length,
            Version = "v1",
            Folder = string.IsNullOrWhiteSpace(folder) ? null : folder.Trim(),
            UploadedBy = long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : null,
            UploadedAt = DateTime.Now,
        };
        _db.Documents.Add(doc);
        await _db.SaveChangesAsync();

        var dir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(dir);
        var path = Path.Combine(dir, $"{doc.Id}_{safeName}");
        await using (var fs = System.IO.File.Create(path))
            await file.CopyToAsync(fs);

        TempData["ok"] = $"Carregado · {safeName} (v1)";
        return RedirectToAction(nameof(Index), new { pasta = folder });
    }

    public async Task<IActionResult> Download(long id)
    {
        var doc = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id);
        if (doc is null) return NotFound();
        var path = Path.Combine(_env.WebRootPath, "uploads", $"{doc.Id}_{doc.Name}");
        if (!System.IO.File.Exists(path))
        {
            TempData["ok"] = "Este documento de exemplo não tem ficheiro físico.";
            return RedirectToAction(nameof(Index));
        }
        return PhysicalFile(path, "application/octet-stream", doc.Name);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> NewVersion(long id)
    {
        var doc = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id);
        if (doc is null) return NotFound();
        var n = int.TryParse((doc.Version ?? "v1").TrimStart('v'), out var v) ? v : 1;
        doc.Version = "v" + (n + 1);
        doc.UploadedAt = DateTime.Now;
        await _db.SaveChangesAsync();
        TempData["ok"] = $"Nova versão de {doc.Name} · {doc.Version}";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(long id)
    {
        var doc = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id);
        if (doc is not null)
        {
            _db.Documents.Remove(doc);
            await _db.SaveChangesAsync();
            var path = Path.Combine(_env.WebRootPath, "uploads", $"{doc.Id}_{doc.Name}");
            if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
            TempData["ok"] = $"Documento eliminado · {doc.Name}";
        }
        return RedirectToAction(nameof(Index));
    }
}
