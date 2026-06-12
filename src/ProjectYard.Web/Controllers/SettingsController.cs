using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Identity;

namespace ProjectYard.Web.Controllers;

/// <summary>Definições — Conta (real), Segurança (mudar password real), Plano, Equipa (real), Listas (real), Notificações.</summary>
public class SettingsController : Controller
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _users;

    public SettingsController(AppDbContext db, UserManager<ApplicationUser> users)
    {
        _db = db;
        _users = users;
    }

    public async Task<IActionResult> Index(string? s)
    {
        var me = await _users.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ViewBag.Me = me;
        ViewBag.Section = s ?? "conta";
        ViewBag.Tenant = _db.CurrentTenantId is { } tid ? await _db.Tenants.FindAsync(tid) : null;
        ViewBag.Team = await _db.Users.Where(u => u.TenantId == _db.CurrentTenantId)
            .OrderByDescending(u => u.Role == "Owner").ThenBy(u => u.Name).ToListAsync();
        ViewBag.Lookups = await _db.Lookups.Where(l => l.TenantId == _db.CurrentTenantId || l.TenantId == null)
            .OrderBy(l => l.Kind).ThenBy(l => l.SortOrder).ToListAsync();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateProfile(string name, string? funcao)
    {
        var me = await _users.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (me is null || string.IsNullOrWhiteSpace(name)) return RedirectToAction(nameof(Index));
        me.Name = name.Trim();
        me.Funcao = string.IsNullOrWhiteSpace(funcao) ? null : funcao.Trim();
        await _users.UpdateAsync(me);
        TempData["ok"] = "Perfil atualizado. (O nome no topo atualiza no próximo início de sessão.)";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangePassword(string current, string nova, string confirmar)
    {
        if (nova != confirmar)
        {
            TempData["ok"] = "A confirmação não coincide com a nova palavra-passe.";
            return RedirectToAction(nameof(Index), new { s = "seguranca" });
        }
        var me = await _users.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var res = await _users.ChangePasswordAsync(me!, current, nova);
        TempData["ok"] = res.Succeeded
            ? "Palavra-passe alterada."
            : "Erro: " + string.Join("; ", res.Errors.Select(e => e.Description));
        return RedirectToAction(nameof(Index), new { s = "seguranca" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddLookup(string kind, string value)
    {
        if (!string.IsNullOrWhiteSpace(kind) && !string.IsNullOrWhiteSpace(value))
        {
            var max = await _db.Lookups.Where(l => l.Kind == kind && l.TenantId == _db.CurrentTenantId).MaxAsync(l => (int?)l.SortOrder) ?? 0;
            _db.Lookups.Add(new ProjectYard.Data.Entities.Lookup
            {
                TenantId = _db.CurrentTenantId,
                Kind = kind.Trim(),
                Value = value.Trim(),
                SortOrder = max + 1,
                Active = true,
            });
            await _db.SaveChangesAsync();
            TempData["ok"] = $"Adicionado a “{kind}”: {value}";
        }
        return RedirectToAction(nameof(Index), new { s = "lookups" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteLookup(long id)
    {
        var l = await _db.Lookups.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == _db.CurrentTenantId);
        if (l is not null) { _db.Lookups.Remove(l); await _db.SaveChangesAsync(); TempData["ok"] = "Valor removido."; }
        return RedirectToAction(nameof(Index), new { s = "lookups" });
    }
}
