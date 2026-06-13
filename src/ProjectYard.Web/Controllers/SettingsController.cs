using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Data.Identity;
using Task = System.Threading.Tasks.Task;

namespace ProjectYard.Web.Controllers;

/// <summary>
/// Definições — fiel ao prototype/screens-settings.jsx (7 secções).
/// Real: perfil, password, sessões (security stamp), equipa (cria logins Identity reais c/ password temporária),
/// lookups c/ cor/ordem/ativo, preferências (tabela settings). Visual c/ dados demo (billing pendente): cartão e faturas da subscrição.
/// </summary>
public class SettingsController : Controller
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _users;
    private readonly SignInManager<ApplicationUser> _signIn;
    private readonly IWebHostEnvironment _env;

    public SettingsController(AppDbContext db, UserManager<ApplicationUser> users, SignInManager<ApplicationUser> signIn, IWebHostEnvironment env)
    {
        _db = db;
        _users = users;
        _signIn = signIn;
        _env = env;
    }

    private async Task<ApplicationUser> Me() => (await _users.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!))!;
    private bool IsAdmin(ApplicationUser me) => me.IsSuperadmin || me.IsTenantAdmin || me.Role is "Owner" or "Administrador";

    private static readonly string[] LkPal = { "#6a5af9", "#2a7fb8", "#1f9d6b", "#d9a32a", "#e8526b", "#9b59f5", "#21a8c4", "#ef7d54", "#e0922a", "#d65151", "#8a949e", "#233140" };

    // Lookups standard do protótipo (kind -> (valor, cor)); semeados por tenant na 1.ª visita.
    private static readonly Dictionary<string, (string Value, string Color)[]> LookupDefaults = new()
    {
        ["fase"] = new[] { "Estudo Prévio", "Projeto Base", "Licenciamento", "Projeto de Execução", "Especialidades", "Estruturas", "Arquitetura", "Coordenação BIM", "Execução", "Assistência Técnica", "Obra", "Fecho", "Gestão" }
            .Select((v, i) => (v, LkPal[i % LkPal.Length])).ToArray(),
        ["prioridade"] = new[] { ("Alta", "#d65151"), ("Média", "#e0922a"), ("Baixa", "#8a949e") },
        ["estado-tarefa"] = new[] { ("Por fazer", "#8a949e"), ("Em curso", "#2a7fb8"), ("Em revisão", "#e0922a"), ("Concluído", "#1f9d6b") },
        ["tipo-hora"] = new[] { ("Produção", "#6a5af9"), ("Coordenação", "#2a7fb8"), ("Reunião", "#8a949e"), ("Licenciamento", "#e0922a"), ("Assistência", "#1f9d6b"), ("Deslocação", "#ef7d54") },
        ["tipo-evento"] = new[] { ("Reuniões", "#6a5af9"), ("Prazos", "#d65151"), ("Visitas de obra", "#e0922a"), ("Aprovações", "#2a7fb8"), ("Pessoal", "#1f9d6b") },
        ["cargo"] = new[] { ("Arquiteto", "#6a5af9"), ("Arquiteto Sénior", "#2a7fb8"), ("Engenheiro", "#1f9d6b"), ("Eng.ª Estruturas", "#d9a32a"), ("Desenhador", "#21a8c4"), ("Gestor de Projeto", "#e0922a"), ("Administrativo", "#8a949e"), ("Direção", "#233140") },
    };

    private static bool IsValidEmail(string? s) => !string.IsNullOrWhiteSpace(s) && System.Net.Mail.MailAddress.TryCreate(s.Trim(), out _);
    private static bool IsValidPhone(string? s) => !string.IsNullOrWhiteSpace(s) && System.Text.RegularExpressions.Regex.IsMatch(s.Trim(), @"^\+?[0-9 ()\-]{6,20}$");

    public async Task<IActionResult> Index(string? s)
    {
        var me = await Me();
        me.LastActiveAt = DateTime.Now;
        await _db.SaveChangesAsync();

        await EnsureLookupDefaultsAsync();

        ViewBag.Me = me;
        ViewBag.IsAdmin = IsAdmin(me);
        ViewBag.Section = s ?? "conta";
        ViewBag.Tenant = _db.CurrentTenantId is { } tid ? await _db.Tenants.FindAsync(tid) : null;
        var team = await _db.Users.Where(u => u.TenantId == _db.CurrentTenantId)
            .OrderByDescending(u => u.IsSuperadmin).ThenByDescending(u => u.Role == "Owner").ThenBy(u => u.Name).ToListAsync();
        if (team.All(u => u.Id != me.Id)) team.Insert(0, me); // superadmin de plataforma aparece no topo (protótipo)
        ViewBag.Team = team;
        ViewBag.SmsInvites = await _db.UserInvites
            .Where(i => i.Channel == "sms" && i.Status == "Pendente").OrderBy(i => i.CreatedAt).ToListAsync();
        ViewBag.Lookups = await _db.Lookups.Where(l => l.TenantId == _db.CurrentTenantId)
            .OrderBy(l => l.Kind).ThenBy(l => l.SortOrder).ToListAsync();
        ViewBag.Params = await ParamsAsync(me.Id);

        // Utilização (plano Pro: 15 utilizadores, 100 GB)
        ViewBag.UsageProjects = await _db.Projects.CountAsync(p => p.Status == "Em curso" || p.Status == "Em risco");
        ViewBag.UsageUsers = await _db.Users.CountAsync(u => u.TenantId == _db.CurrentTenantId);
        ViewBag.UsageBytes = await _db.Documents.SumAsync(d => (long?)d.SizeBytes) ?? 0;
        return View();
    }

    private async Task<Dictionary<string, string>> ParamsAsync(long meId)
    {
        var userPrefix = $"user.{meId}.";
        var rows = await _db.Settings
            .Where(x => x.TenantId == _db.CurrentTenantId && (x.Param.StartsWith("tenant.") || x.Param.StartsWith(userPrefix)))
            .ToListAsync();
        return rows.ToDictionary(x => x.Param, x => x.Value ?? "");
    }

    private async Task EnsureLookupDefaultsAsync()
    {
        if (_db.CurrentTenantId is not { } tid) return;
        var existingKinds = await _db.Lookups.Where(l => l.TenantId == tid).Select(l => l.Kind).Distinct().ToListAsync();
        var dirty = false;
        foreach (var (kind, items) in LookupDefaults)
        {
            if (existingKinds.Contains(kind)) continue;
            for (var i = 0; i < items.Length; i++)
                _db.Lookups.Add(new Lookup { TenantId = tid, Kind = kind, Value = items[i].Value, Note = items[i].Color, SortOrder = i + 1, Active = true });
            dirty = true;
        }
        if (dirty) await _db.SaveChangesAsync();
    }

    private async Task UpsertParamAsync(string key, string? value)
    {
        var row = await _db.Settings.FirstOrDefaultAsync(x => x.TenantId == _db.CurrentTenantId && x.Param == key);
        if (row is null) _db.Settings.Add(new Setting { TenantId = _db.CurrentTenantId, Param = key, Value = value });
        else row.Value = value;
        await _db.SaveChangesAsync();
    }

    // ===================== Conta =====================

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateProfile(string name, string? funcao, string? email, string? phone, string? locale, string? tz)
    {
        var me = await Me();
        if (string.IsNullOrWhiteSpace(name)) return RedirectToAction(nameof(Index));
        if (!string.IsNullOrWhiteSpace(email) && !IsValidEmail(email))
        {
            TempData["ok"] = "Email inválido — verifica o formato (ex.: nome@dominio.pt).";
            return RedirectToAction(nameof(Index));
        }
        if (!string.IsNullOrWhiteSpace(phone) && !IsValidPhone(phone))
        {
            TempData["ok"] = "Telefone inválido — só dígitos, espaços e +/()-. Ex.: +351 931 002 030.";
            return RedirectToAction(nameof(Index));
        }
        me.Name = name.Trim();
        me.Funcao = string.IsNullOrWhiteSpace(funcao) ? null : funcao.Trim();
        me.PhoneNumber = string.IsNullOrWhiteSpace(phone) ? null : phone.Trim();
        if (!string.IsNullOrWhiteSpace(email) && !string.Equals(email.Trim(), me.Email, StringComparison.OrdinalIgnoreCase))
        {
            await _users.SetEmailAsync(me, email.Trim());
            await _users.SetUserNameAsync(me, email.Trim());
            me.EmailConfirmed = true;
        }
        await _users.UpdateAsync(me);
        await UpsertParamAsync($"user.{me.Id}.locale", locale);
        await UpsertParamAsync($"user.{me.Id}.tz", tz);
        TempData["ok"] = "Perfil atualizado. (Nome e email no topo atualizam no próximo início de sessão.)";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateWorkspace(string name, string? nif, string? morada, string? website, string? area, string? billingEmail)
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        if (!string.IsNullOrWhiteSpace(billingEmail) && !IsValidEmail(billingEmail))
        {
            TempData["ok"] = "Email de faturação inválido — verifica o formato.";
            return RedirectToAction(nameof(Index));
        }
        if (_db.CurrentTenantId is { } tid && !string.IsNullOrWhiteSpace(name))
        {
            var t = await _db.Tenants.FindAsync(tid);
            if (t is not null) { t.Name = name.Trim(); await _db.SaveChangesAsync(); }
        }
        await UpsertParamAsync("tenant.nif", nif);
        await UpsertParamAsync("tenant.morada", morada);
        await UpsertParamAsync("tenant.website", website);
        await UpsertParamAsync("tenant.area", area);
        await UpsertParamAsync("tenant.billing_email", billingEmail);
        TempData["ok"] = "Dados do workspace atualizados.";
        return RedirectToAction(nameof(Index));
    }

    // ===================== Fotos / logótipo =====================

    private static readonly string[] ImgExts = { ".jpg", ".jpeg", ".png", ".webp" };

    private async Task<string?> SaveImageAsync(IFormFile file, string folder, string baseName)
    {
        if (file.Length == 0 || file.Length > 2_000_000) return null;   // máx. 2 MB
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!ImgExts.Contains(ext) || !file.ContentType.StartsWith("image/")) return null;
        var dir = Path.Combine(_env.WebRootPath, "uploads", folder);
        Directory.CreateDirectory(dir);
        foreach (var old in Directory.GetFiles(dir, baseName + ".*")) System.IO.File.Delete(old); // substitui a anterior
        var path = Path.Combine(dir, baseName + ext);
        await using var fs = System.IO.File.Create(path);
        await file.CopyToAsync(fs);
        return $"/uploads/{folder}/{baseName}{ext}";
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UploadAvatar(IFormFile? foto)
    {
        var me = await Me();
        if (foto is null) { TempData["ok"] = "Escolhe uma imagem (JPG, PNG ou WebP)."; return RedirectToAction(nameof(Index)); }
        var url = await SaveImageAsync(foto, "avatars", $"u{me.Id}");
        if (url is null) { TempData["ok"] = "Imagem inválida — JPG/PNG/WebP até 2 MB."; return RedirectToAction(nameof(Index)); }
        me.AvatarUrl = url;
        await _users.UpdateAsync(me);
        TempData["ok"] = "Foto de perfil atualizada.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RemoveAvatar()
    {
        var me = await Me();
        me.AvatarUrl = null;
        await _users.UpdateAsync(me);
        TempData["ok"] = "Foto removida — voltas às iniciais.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UploadLogo(IFormFile? logo)
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        if (logo is null || _db.CurrentTenantId is not { } tid) { TempData["ok"] = "Escolhe uma imagem (JPG, PNG ou WebP)."; return RedirectToAction(nameof(Index)); }
        var url = await SaveImageAsync(logo, "logos", $"t{tid}");
        if (url is null) { TempData["ok"] = "Imagem inválida — JPG/PNG/WebP até 2 MB."; return RedirectToAction(nameof(Index)); }
        await UpsertParamAsync("tenant.logo", url);
        TempData["ok"] = "Logótipo do workspace atualizado.";
        return RedirectToAction(nameof(Index));
    }

    // ===================== Segurança =====================

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangePassword(string current, string nova, string confirmar)
    {
        if (nova != confirmar)
        {
            TempData["ok"] = "A confirmação não coincide com a nova palavra-passe.";
            return RedirectToAction(nameof(Index), new { s = "seguranca" });
        }
        var me = await Me();
        var res = await _users.ChangePasswordAsync(me, current, nova);
        TempData["ok"] = res.Succeeded
            ? "Palavra-passe alterada."
            : "Erro: " + string.Join("; ", res.Errors.Select(e => e.Description));
        return RedirectToAction(nameof(Index), new { s = "seguranca" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> TerminateOtherSessions()
    {
        var me = await Me();
        await _users.UpdateSecurityStampAsync(me);   // invalida cookies das outras sessões
        await _signIn.RefreshSignInAsync(me);        // mantém a sessão atual válida
        TempData["ok"] = "Todas as outras sessões foram terminadas.";
        return RedirectToAction(nameof(Index), new { s = "seguranca" });
    }

    // ===================== Equipa (logins reais) =====================

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> InviteMember(string channel, string contact, string role)
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        contact = (contact ?? "").Trim();
        var allowed = new[] { "Administrador", "Gestor", "Membro", "Cliente" };
        if (contact.Length == 0 || !allowed.Contains(role) || _db.CurrentTenantId is not { } tid)
            return RedirectToAction(nameof(Index), new { s = "equipa" });

        if (channel == "email" && !IsValidEmail(contact))
        {
            TempData["ok"] = "Email do convite inválido — verifica o formato (ex.: nome@dominio.pt).";
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }
        if (channel == "sms" && !IsValidPhone(contact))
        {
            TempData["ok"] = "Telefone do convite inválido — só dígitos, espaços e +/()-.";
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }

        var seats = await _db.Users.CountAsync(u => u.TenantId == tid);
        if (seats >= 15)
        {
            TempData["ok"] = "Limite do plano Pro atingido (15 lugares). Faz upgrade para adicionar mais membros.";
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant();

        if (channel == "sms")
        {
            // Sem gateway SMS (Fase 3): fica o convite registado; o login cria-se quando o convite for aceite.
            _db.UserInvites.Add(new UserInvite { TenantId = tid, Channel = "sms", Contact = contact, Role = role, Status = "Pendente", Token = token, InvitedBy = me.Id, CreatedAt = DateTime.Now });
            await _db.SaveChangesAsync();
            TempData["ok"] = $"Convite por SMS registado para {contact} ({role}). O envio real chega com o gateway SMS (Fase 3).";
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }

        if (await _db.Users.AnyAsync(u => u.TenantId == tid && u.Email == contact))
        {
            TempData["ok"] = $"Já existe um membro com o email {contact}.";
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }

        // Email: cria já o login Identity real, com password temporária mostrada uma vez.
        var tempPassword = "Py#" + Guid.NewGuid().ToString("N")[..6] + "A9";
        var display = string.Join(' ',
            contact.Split('@')[0].Split('.', '_', '-', '+')
                .Where(p => p.Length > 0)
                .Select(p => char.ToUpperInvariant(p[0]) + p[1..]));
        var u = new ApplicationUser
        {
            UserName = contact,
            Email = contact,
            EmailConfirmed = true,
            Name = display.Length > 0 ? display : contact,
            TenantId = tid,
            UserType = "tenant",
            Role = role,
            IsTenantAdmin = role == "Administrador",
            Status = "Pendente",
            Active = true,
            CreatedAt = DateTime.Now,
        };
        var res = await _users.CreateAsync(u, tempPassword);
        if (!res.Succeeded)
        {
            TempData["ok"] = "Erro: " + string.Join("; ", res.Errors.Select(e => e.Description));
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        }
        await _users.AddToRoleAsync(u, role);
        _db.UserInvites.Add(new UserInvite { TenantId = tid, Channel = "email", Contact = contact, Role = role, Status = "Pendente", Token = token, InvitedBy = me.Id, CreatedAt = DateTime.Now });
        await _db.SaveChangesAsync();
        TempData["ok"] = $"Login criado: {contact} ({role}) · password temporária: {tempPassword} — partilha-a em segurança; fica “Pendente” até ao primeiro acesso.";
        return RedirectToAction(nameof(Index), new { s = "equipa" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CancelInvite(long? userId, long? inviteId)
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        if (inviteId is { } iid)
        {
            var inv = await _db.UserInvites.FirstOrDefaultAsync(i => i.Id == iid);
            if (inv is not null) { inv.Status = "Cancelado"; await _db.SaveChangesAsync(); TempData["ok"] = "Convite cancelado."; }
        }
        else if (userId is { } uid)
        {
            var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == uid && x.TenantId == _db.CurrentTenantId && x.Status == "Pendente");
            if (u is not null && !u.IsSuperadmin && u.Role != "Owner" && u.Id != me.Id)
            {
                foreach (var inv in _db.UserInvites.Where(i => i.Contact == u.Email && i.Status == "Pendente")) inv.Status = "Cancelado";
                await _db.SaveChangesAsync();
                await _users.DeleteAsync(u);
                TempData["ok"] = "Convite cancelado e login removido.";
            }
        }
        return RedirectToAction(nameof(Index), new { s = "equipa" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangeMemberRole(long userId, string role)
    {
        var me = await Me();
        var allowed = new[] { "Administrador", "Gestor", "Membro", "Cliente" };
        if (!IsAdmin(me) || !allowed.Contains(role)) return Forbid();
        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.TenantId == _db.CurrentTenantId);
        if (u is null || u.IsSuperadmin || u.Role == "Owner" || u.Id == me.Id)
            return RedirectToAction(nameof(Index), new { s = "equipa" });
        var old = await _users.GetRolesAsync(u);
        if (old.Count > 0) await _users.RemoveFromRolesAsync(u, old);
        await _users.AddToRoleAsync(u, role);
        u.Role = role;
        u.IsTenantAdmin = role == "Administrador";
        await _users.UpdateAsync(u);
        TempData["ok"] = $"{u.Name} é agora {role}.";
        return RedirectToAction(nameof(Index), new { s = "equipa" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeactivateMember(long userId)
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.TenantId == _db.CurrentTenantId);
        if (u is not null && !u.IsSuperadmin && u.Role != "Owner" && u.Id != me.Id)
        {
            u.Active = !u.Active;
            u.Status = u.Active ? "Ativo" : "Inativo";
            await _db.SaveChangesAsync();
            TempData["ok"] = u.Active ? $"{u.Name} reativado." : $"{u.Name} desativado — deixa de poder iniciar sessão.";
        }
        return RedirectToAction(nameof(Index), new { s = "equipa" });
    }

    // ===================== Listas & lookups =====================

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddLookup(string kind, string value, string? color)
    {
        if (!string.IsNullOrWhiteSpace(kind) && !string.IsNullOrWhiteSpace(value))
        {
            var max = await _db.Lookups.Where(l => l.Kind == kind && l.TenantId == _db.CurrentTenantId).MaxAsync(l => (int?)l.SortOrder) ?? 0;
            _db.Lookups.Add(new Lookup
            {
                TenantId = _db.CurrentTenantId,
                Kind = kind.Trim(),
                Value = value.Trim(),
                Note = string.IsNullOrWhiteSpace(color) ? LkPal[0] : color,
                SortOrder = max + 1,
                Active = true,
            });
            await _db.SaveChangesAsync();
            TempData["ok"] = $"“{value.Trim()}” adicionado.";
        }
        return RedirectToAction(nameof(Index), new { s = "lookups" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RenameLookup(long id, string value)
    {
        var l = await _db.Lookups.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == _db.CurrentTenantId);
        if (l is not null && !string.IsNullOrWhiteSpace(value)) { l.Value = value.Trim(); await _db.SaveChangesAsync(); }
        return Ok();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RecolorLookup(long id, string color)
    {
        var l = await _db.Lookups.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == _db.CurrentTenantId);
        if (l is not null && LkPal.Contains(color)) { l.Note = color; await _db.SaveChangesAsync(); }
        return Ok();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleLookup(long id)
    {
        var l = await _db.Lookups.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == _db.CurrentTenantId);
        if (l is not null) { l.Active = !(l.Active ?? true); await _db.SaveChangesAsync(); }
        return Ok();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteLookup(long id)
    {
        var l = await _db.Lookups.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == _db.CurrentTenantId);
        if (l is not null) { _db.Lookups.Remove(l); await _db.SaveChangesAsync(); TempData["ok"] = $"“{l.Value}” removido."; }
        return RedirectToAction(nameof(Index), new { s = "lookups" });
    }

    // ===================== Preferências / Integrações =====================

    /// <summary>Guarda um parâmetro (whitelist: prefixo do próprio utilizador; "tenant.*" só para admins).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetParam(string key, string? value)
    {
        var me = await Me();
        var ownPrefix = $"user.{me.Id}.";
        var allowed = key.StartsWith(ownPrefix) || (IsAdmin(me) && key.StartsWith("tenant."));
        if (!allowed || key.Length > 120) return Forbid();
        await UpsertParamAsync(key, value);
        return Ok();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RegenerateApiKey()
    {
        var me = await Me();
        if (!IsAdmin(me)) return Forbid();
        var key = "py_live_" + Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant();
        await UpsertParamAsync("tenant.apikey", key);
        TempData["ok"] = "Chave de API regenerada.";
        return RedirectToAction(nameof(Index), new { s = "integracoes" });
    }
}
