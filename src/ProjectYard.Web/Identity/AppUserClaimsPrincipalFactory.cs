using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ProjectYard.Data.Data;
using ProjectYard.Data.Identity;

namespace ProjectYard.Web.Identity;

/// <summary>
/// Acrescenta ao cookie de autenticação os claims de domínio: tenant_id, user_type, is_superadmin, nome.
/// Assim o middleware de tenant e as views não precisam de ir à BD a cada pedido.
/// </summary>
public class AppUserClaimsPrincipalFactory
    : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
{
    public const string TenantId = "tenant_id";
    public const string UserType = "user_type";
    public const string IsSuperadmin = "is_superadmin";
    public const string DisplayName = "display_name";

    public AppUserClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IOptions<IdentityOptions> options)
        : base(userManager, roleManager, options)
    {
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var id = await base.GenerateClaimsAsync(user); // inclui id, username e papéis (user_roles)
        if (user.TenantId is { } t) id.AddClaim(new Claim(TenantId, t.ToString()));
        id.AddClaim(new Claim(UserType, user.UserType));
        id.AddClaim(new Claim(IsSuperadmin, user.IsSuperadmin ? "true" : "false"));
        id.AddClaim(new Claim(DisplayName, user.Name));
        return id;
    }
}
