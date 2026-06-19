using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Identity;

namespace ProjectYard.Web.Tenancy;

/// <summary>
/// Define o tenant atual no AppDbContext a partir do utilizador autenticado:
///  - utilizador de tenant  => CurrentTenantId = o seu tenant; query filters ativos.
///  - superadmin (plataforma) => por omissão BypassTenantFilter = true (consola, atravessa tudo);
///    se "abriu" um workspace (sessão ViewTenantKey), passa a ver SÓ esse tenant — modo de apoio,
///    COM registo de auditoria.
/// </summary>
public class TenantMiddleware
{
    public const string ViewTenantKey = "py.view_tenant";

    private readonly RequestDelegate _next;
    private readonly ILogger<TenantMiddleware> _logger;

    public TenantMiddleware(RequestDelegate next, ILogger<TenantMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        var user = context.User;
        if (user?.Identity?.IsAuthenticated == true)
        {
            var isSuperadmin = user.FindFirstValue(AppUserClaimsPrincipalFactory.IsSuperadmin) == "true";
            if (isSuperadmin)
            {
                var viewTenant = context.Session.GetString(ViewTenantKey);
                if (!long.TryParse(viewTenant, out var vt))
                {
                    // Como no protótipo, o superadmin opera sempre "a ver" um workspace (modo plataforma).
                    // Sem escolha em sessão (1.º acesso ou sessão expirada), seleciona o workspace por omissão.
                    db.BypassTenantFilter = true;
                    vt = await db.Tenants.Where(t => t.Status != "Suspenso")
                        .OrderByDescending(t => t.Slug == "atelier-norte").ThenBy(t => t.Id)
                        .Select(t => t.Id).FirstOrDefaultAsync();
                    if (vt > 0) context.Session.SetString(ViewTenantKey, vt.ToString());
                }
                if (vt > 0)
                {
                    // Modo plataforma: a ver um workspace específico (apoio), auditado.
                    // As consolas (Workspaces/Conformidade) sobrepõem isto com BypassTenantFilter=true.
                    db.BypassTenantFilter = false;
                    db.CurrentTenantId = vt;
                    _logger.LogInformation(
                        "AUDITORIA plataforma: superadmin {User} a ver tenant {TenantId} — {Method} {Path}",
                        user.FindFirstValue(ClaimTypes.NameIdentifier), vt, context.Request.Method, context.Request.Path);
                }
                else
                {
                    db.BypassTenantFilter = true;
                    db.CurrentTenantId = null;
                }
            }
            else if (long.TryParse(user.FindFirstValue(AppUserClaimsPrincipalFactory.TenantId), out var tenantId))
            {
                db.BypassTenantFilter = false;
                db.CurrentTenantId = tenantId;
            }
            else
            {
                db.BypassTenantFilter = false;
                db.CurrentTenantId = null;
            }
        }

        await _next(context);
    }
}
