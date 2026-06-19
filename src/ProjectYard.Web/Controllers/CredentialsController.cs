using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

/// <summary>
/// Cofre de acessos a portais (câmaras/entidades) para licenciamento.
/// Passwords CIFRADAS com ASP.NET Data Protection. Restrito a quem gere projetos.
/// </summary>
[Authorize(Policy = "GerirProjetos")]
public class CredentialsController : Controller
{
    private readonly AppDbContext _db;
    private readonly IDataProtector _protector;

    public CredentialsController(AppDbContext db, IDataProtectionProvider dp)
    {
        _db = db;
        _protector = dp.CreateProtector("ProjectYard.PortalCredentials.v1");
    }

    private long? CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    private string? Protect(string? plain) => string.IsNullOrEmpty(plain) ? null : _protector.Protect(plain);
    private string? Unprotect(string? enc)
    {
        if (string.IsNullOrEmpty(enc)) return null;
        try { return _protector.Unprotect(enc); }
        catch { return null; } // chave de proteção mudou/perdeu-se → não revela (sinaliza no ecrã)
    }

    public async Task<IActionResult> Index(string? q)
    {
        var list = await _db.PortalCredentials.Include(c => c.Project)
            .OrderBy(c => c.Name).ToListAsync();
        if (!string.IsNullOrWhiteSpace(q))
            list = list.Where(c => (c.Name + " " + c.Portal + " " + c.Username + " " + c.ProcNumber)
                .Contains(q, StringComparison.OrdinalIgnoreCase)).ToList();
        ViewBag.Q = q;
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code)
            .Select(p => new SelectListItem(p.Code + " — " + p.Name, p.Id.ToString())).ToListAsync();
        return View(list);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Save(long id, string name, string? procNumber, string? portal, string? url, string? username, string? password, string? notes, long? projectId)
    {
        if (string.IsNullOrWhiteSpace(name) || _db.CurrentTenantId is not { } tid)
        {
            TempData["ok"] = "Indica pelo menos o nome do acesso.";
            return RedirectToAction(nameof(Index));
        }
        PortalCredential c;
        if (id > 0)
        {
            c = await _db.PortalCredentials.FirstOrDefaultAsync(x => x.Id == id) ?? new PortalCredential();
            if (c.Id == 0) return RedirectToAction(nameof(Index));
        }
        else
        {
            c = new PortalCredential { TenantId = tid, CreatedBy = CurrentUserId(), CreatedAt = DateTime.Now };
            _db.PortalCredentials.Add(c);
        }
        c.Name = name.Trim();
        c.ProcNumber = procNumber?.Trim();
        c.Portal = portal?.Trim();
        c.Url = url?.Trim();
        c.Username = username?.Trim();
        c.Notes = notes?.Trim();
        c.ProjectId = projectId;
        // Só atualiza a password se foi escrita (vazio = manter a atual).
        if (!string.IsNullOrEmpty(password)) c.PasswordEnc = Protect(password);
        await _db.SaveChangesAsync();
        TempData["ok"] = id > 0 ? "Acesso atualizado." : "Acesso guardado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(long id)
    {
        var c = await _db.PortalCredentials.FirstOrDefaultAsync(x => x.Id == id);
        if (c is not null) { _db.PortalCredentials.Remove(c); await _db.SaveChangesAsync(); TempData["ok"] = "Acesso removido."; }
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Devolve a password decifrada (para o botão "mostrar"). Só admin/gestor (política da classe).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reveal(long id)
    {
        var c = await _db.PortalCredentials.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        var pw = Unprotect(c.PasswordEnc);
        return Json(new { ok = pw != null, password = pw ?? "" });
    }
}
