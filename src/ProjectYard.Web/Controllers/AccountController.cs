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
