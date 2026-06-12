using System.Security.Claims;
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
                if (long.TryParse(viewTenant, out var vt))
                {
                    // Modo plataforma: a ver um workspace específico (apoio), auditado.
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
                    _logger.LogInformation(
                        "AUDITORIA plataforma: superadmin {User} em consola (atravessa tenants) — {Method} {Path}",
                        user.FindFirstValue(ClaimTypes.NameIdentifier), context.Request.Method, context.Request.Path);
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
