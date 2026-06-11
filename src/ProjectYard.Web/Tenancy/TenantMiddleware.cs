using System.Security.Claims;
using ProjectYard.Data.Data;
using ProjectYard.Web.Identity;

namespace ProjectYard.Web.Tenancy;

/// <summary>
/// Define o tenant atual no AppDbContext a partir do utilizador autenticado:
///  - utilizador de tenant  => CurrentTenantId = o seu tenant; query filters ativos.
///  - superadmin (plataforma) => BypassTenantFilter = true; atravessa todos os tenants COM auditoria.
/// </summary>
public class TenantMiddleware
{
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
                db.BypassTenantFilter = true;
                db.CurrentTenantId = null;
                // Auditoria: acesso transversal a tenants pelo superadmin.
                _logger.LogInformation("Acesso de plataforma (superadmin {User}) a {Method} {Path} — atravessa tenants.",
                    user.FindFirstValue(ClaimTypes.NameIdentifier), context.Request.Method, context.Request.Path);
            }
            else if (long.TryParse(user.FindFirstValue(AppUserClaimsPrincipalFactory.TenantId), out var tenantId))
            {
                db.BypassTenantFilter = false;
                db.CurrentTenantId = tenantId;
            }
            else
            {
                // Sem tenant e sem ser superadmin: não vê dados de domínio.
                db.BypassTenantFilter = false;
                db.CurrentTenantId = null;
            }
        }

        await _next(context);
    }
}
