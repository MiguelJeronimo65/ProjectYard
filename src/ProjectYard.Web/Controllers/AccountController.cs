using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectYard.Data.Identity;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class AccountController : Controller
{
    private readonly SignInManager<ApplicationUser> _signIn;
    private readonly UserManager<ApplicationUser> _users;

    public AccountController(SignInManager<ApplicationUser> signIn, UserManager<ApplicationUser> users)
    {
        _signIn = signIn;
        _users = users;
    }

    [AllowAnonymous]
    [HttpGet("/conta/entrar")]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
            return RedirectToAction("Index", "Home");
        return View(new LoginViewModel { ReturnUrl = returnUrl });
    }

    [AllowAnonymous]
    [HttpPost("/conta/entrar")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel vm)
    {
        if (!ModelState.IsValid)
            return View(vm);

        var user = await _users.FindByEmailAsync(vm.Email);
        if (user is null || !user.Active)
        {
            ModelState.AddModelError(string.Empty, "Credenciais inválidas.");
            return View(vm);
        }

        var result = await _signIn.PasswordSignInAsync(user, vm.Password, vm.RememberMe, lockoutOnFailure: true);
        if (result.Succeeded)
        {
            // Primeiro acesso de um convidado ativa a conta; regista última atividade (coluna da Equipa).
            if (user.Status == "Pendente") user.Status = "Ativo";
            user.LastActiveAt = DateTime.Now;
            await _users.UpdateAsync(user);
            if (Url.IsLocalUrl(vm.ReturnUrl))
                return Redirect(vm.ReturnUrl!);
            return RedirectToAction("Index", "Home");
        }
        if (result.IsLockedOut)
            ModelState.AddModelError(string.Empty, "Conta temporariamente bloqueada por tentativas falhadas. Tenta mais tarde.");
        else
            ModelState.AddModelError(string.Empty, "Credenciais inválidas.");
        return View(vm);
    }

    /// <summary>Impersonate: o superadmin entra como outro utilizador (vê o que ele vê). Auditável via claims.</summary>
    [HttpPost("/conta/entrar-como/{id:long}")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Impersonate(long id)
    {
        var me = await _users.GetUserAsync(User);
        if (me is null || !me.IsSuperadmin) return Forbid();
        var target = await _users.FindByIdAsync(id.ToString());
        if (target is null || !target.Active || target.Id == me.Id) return RedirectToAction("Index", "Settings", new { s = "equipa" });

        await _signIn.SignOutAsync();
        await _signIn.SignInWithClaimsAsync(target, isPersistent: false, additionalClaims: new[]
        {
            new System.Security.Claims.Claim("impersonator_id", me.Id.ToString()),
            new System.Security.Claims.Claim("impersonator_name", me.Name),
        });
        TempData["ok"] = $"A ver a aplicação como {target.Name} ({target.Role}). Usa “Voltar à minha conta” no topo quando terminares.";
        return RedirectToAction("Index", "Home");
    }

    /// <summary>Termina o impersonate e volta à conta original.</summary>
    [HttpPost("/conta/voltar-a-mim")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> StopImpersonation()
    {
        var origId = User.FindFirst("impersonator_id")?.Value;
        if (origId is null) return RedirectToAction("Index", "Home");
        var orig = await _users.FindByIdAsync(origId);
        await _signIn.SignOutAsync();
        if (orig is not null)
        {
            await _signIn.SignInAsync(orig, isPersistent: false);
            TempData["ok"] = "De volta à tua conta.";
            return RedirectToAction("Index", "Settings", new { s = "equipa" });
        }
        return RedirectToAction("Login");
    }

    [HttpPost("/conta/sair")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _signIn.SignOutAsync();
        return RedirectToAction("Login");
    }

    [AllowAnonymous]
    [HttpGet("/conta/sem-acesso")]
    public IActionResult AccessDenied() => View();
}
