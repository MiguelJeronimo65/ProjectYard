using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

/// <summary>
/// Conformidade RGPD — Chat (plataforma, só superadmin). Por omissão só metadados;
/// aceder a conteúdo exige base legal + justificação e regista em chat_compliance_access_log.
/// </summary>
[Authorize(Roles = "Superadmin")]
public class ComplianceController : Controller
{
    public static readonly (string Id, string Label, string Ref)[] Bases =
    {
        ("titular", "Pedido do titular dos dados", "RGPD Art. 15.º — direito de acesso"),
        ("judicial", "Ordem judicial / autoridade competente", "Obrigação legal · Art. 6.º/1-c"),
        ("abuso", "Investigação de abuso ou segurança", "Interesse legítimo · Art. 6.º/1-f"),
        ("auditoria", "Auditoria de conformidade", "Obrigação legal · Art. 6.º/1-c"),
    };

    private readonly AppDbContext _db;
    private readonly ILogger<ComplianceController> _logger;

    public ComplianceController(AppDbContext db, ILogger<ComplianceController> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IActionResult> Index(string? ws, string? tab, long? reveal)
    {
        // Supervisão transversal: atravessa sempre todos os tenants (auditado pelo middleware).
        _db.BypassTenantFilter = true;
        _db.CurrentTenantId = null;

        var cutoff = DateTime.Now.AddDays(-30);
        var channels = await _db.ChatChannels.Include(c => c.Tenant).Include(c => c.Project).ToListAsync();
        var members = await _db.Set<ChatChannelMember>().Include(m => m.User).ToListAsync();
        var stats = await _db.ChatMessages
            .GroupBy(m => m.ChannelId)
            .Select(g => new
            {
                g.Key,
                Msgs30 = g.Count(m => m.CreatedAt >= cutoff),
                Att = g.Count(m => m.AttachmentDocumentId != null),
                Last = (DateTime?)g.Max(m => m.CreatedAt),
            })
            .ToDictionaryAsync(x => x.Key);

        var convos = channels.Select(c => new ComplianceConvo
        {
            Id = c.Id,
            TenantName = c.Tenant.Name,
            TenantColor = c.Tenant.PrimaryColor,
            Type = c.Type,
            Name = c.Name,
            ProjectName = c.Project?.Name,
            RetentionMonths = c.RetentionMonths,
            LegalHold = c.LegalHold,
            Participants = members.Where(m => m.ChannelId == c.Id).Select(m => m.User.Name).ToList(),
            Msgs30 = stats.TryGetValue(c.Id, out var s) ? s.Msgs30 : 0,
            Attachments = stats.TryGetValue(c.Id, out var s2) ? s2.Att : 0,
            LastActivity = stats.TryGetValue(c.Id, out var s3) ? s3.Last : null,
        }).OrderByDescending(c => c.LastActivity).ToList();

        var vm = new ComplianceViewModel
        {
            Convos = string.IsNullOrEmpty(ws) || ws == "Todos" ? convos : convos.Where(c => c.TenantName == ws).ToList(),
            Log = await _db.ChatComplianceAccessLogs.Include(l => l.AccessedByUser).Include(l => l.TargetTenant)
                .OrderByDescending(l => l.CreatedAt).ToListAsync(),
            Ws = string.IsNullOrEmpty(ws) ? "Todos" : ws,
            Tab = tab == "acessos" ? "acessos" : "metadados",
            Tenants = convos.Select(c => c.TenantName).Distinct().OrderBy(t => t).ToList(),
        };

        // Conteúdo revelado após acesso justificado (mostra as mensagens REAIS do canal).
        if (reveal is { } rid)
        {
            var entry = vm.Log.FirstOrDefault(l => l.Id == rid);
            if (entry?.ChannelId is { } chId)
            {
                vm.RevealEntry = entry;
                vm.Reveal = convos.FirstOrDefault(c => c.Id == chId);
                vm.RevealMessages = await _db.ChatMessages.Include(m => m.Sender)
                    .Where(m => m.ChannelId == chId)
                    .OrderBy(m => m.CreatedAt).Take(30).ToListAsync();
            }
        }
        return View(vm);
    }

    /// <summary>Aceder a conteúdo privado: exige base legal + justificação; regista no trilho imutável.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Access(long channelId, string basis, string reason)
    {
        _db.BypassTenantFilter = true;
        _db.CurrentTenantId = null;

        var b = Bases.FirstOrDefault(x => x.Id == basis);
        if (b.Id is null || string.IsNullOrWhiteSpace(reason) || reason.Trim().Length < 12)
        {
            TempData["ok"] = "Indica a base legal e uma justificação com pelo menos 12 caracteres.";
            return RedirectToAction(nameof(Index));
        }
        var channel = await _db.ChatChannels.Include(c => c.Tenant).FirstOrDefaultAsync(c => c.Id == channelId);
        if (channel is null) return NotFound();

        var year = DateTime.Today.Year;
        var prefix = $"CCAL-{year}-";
        var existing = await _db.ChatComplianceAccessLogs.Where(l => l.Ref.StartsWith(prefix)).Select(l => l.Ref).ToListAsync();
        var seq = existing.Select(r => int.TryParse(r.Split('-').LastOrDefault(), out var n) ? n : 0).DefaultIfEmpty(0).Max() + 1;

        var msgs = await _db.ChatMessages.CountAsync(m => m.ChannelId == channelId);
        var entry = new ChatComplianceAccessLog
        {
            Ref = prefix + seq.ToString("0000"),
            AccessedByUserId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            TargetTenantId = channel.TenantId,
            ChannelId = channel.Id,
            LegalBasis = b.Label,
            LegalBasisRef = b.Ref,
            Reason = reason.Trim(),
            Scope = $"Conteúdo · {msgs} mensagens",
            State = "Ativo",
            CreatedAt = DateTime.Now,
        };
        _db.ChatComplianceAccessLogs.Add(entry);
        await _db.SaveChangesAsync();

        _logger.LogWarning("AUDITORIA RGPD: {Ref} — superadmin {User} acedeu a conteúdo do canal {Channel} (tenant {Tenant}). Base: {Base}.",
            entry.Ref, User.Identity?.Name, channel.Id, channel.Tenant.Name, b.Label);

        TempData["ok"] = $"Acesso registado · {entry.Ref}";
        return RedirectToAction(nameof(Index), new { reveal = entry.Id });
    }
}
