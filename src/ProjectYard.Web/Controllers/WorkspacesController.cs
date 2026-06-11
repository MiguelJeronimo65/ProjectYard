using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Data.Identity;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

/// <summary>Consola de plataforma — só superadmin. Atravessa todos os tenants (BypassTenantFilter).</summary>
[Authorize(Roles = "Superadmin")]
public class WorkspacesController : Controller
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _users;

    public WorkspacesController(AppDbContext db, UserManager<ApplicationUser> users)
    {
        _db = db;
        _users = users;
    }

    public async Task<IActionResult> Index()
    {
        var tenants = await _db.Tenants.OrderBy(t => t.Name).ToListAsync();
        ViewBag.ProjectsByTenant = await _db.Projects.GroupBy(p => p.TenantId)
            .Select(g => new { TenantId = g.Key, Count = g.Count() }).ToDictionaryAsync(x => x.TenantId, x => x.Count);
        ViewBag.UsersByTenant = await _db.Users.Where(u => u.TenantId != null)
            .GroupBy(u => u.TenantId!.Value).Select(g => new { TenantId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.TenantId, x => x.Count);
        return View(tenants);
    }

    [HttpGet]
    public IActionResult Create() => View(new CreateWorkspaceViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateWorkspaceViewModel vm)
    {
        if (await _db.Tenants.AnyAsync(t => t.Slug == vm.Slug))
            ModelState.AddModelError(nameof(vm.Slug), "Já existe um workspace com este slug.");
        if (await _users.FindByEmailAsync(vm.OwnerEmail) is not null)
            ModelState.AddModelError(nameof(vm.OwnerEmail), "Já existe um utilizador com este email.");
        if (!ModelState.IsValid) return View(vm);

        // 1) Criar o tenant.
        var tenant = new Tenant
        {
            Name = vm.Name,
            Slug = vm.Slug,
            Plan = vm.Plan,
            Status = vm.IsTrial ? "Trial" : "Ativo",
            TrialEndsAt = vm.IsTrial ? DateOnly.FromDateTime(DateTime.Today.AddDays(30)) : null,
            CreatedAt = DateTime.Now,
        };
        _db.Tenants.Add(tenant);
        await _db.SaveChangesAsync();

        // 2) Criar o Owner (1.º utilizador do workspace) com password temporária.
        var tempPassword = "Py#" + Guid.NewGuid().ToString("N")[..6] + "A9";
        var owner = new ApplicationUser
        {
            UserName = vm.OwnerEmail,
            Email = vm.OwnerEmail,
            EmailConfirmed = true,
            Name = vm.OwnerName,
            TenantId = tenant.Id,
            UserType = "tenant",
            Role = "Owner",
            IsTenantAdmin = true,
            Status = "Ativo",
            Active = true,
            CreatedAt = DateTime.Now,
        };
        var res = await _users.CreateAsync(owner, tempPassword);
        if (!res.Succeeded)
        {
            // Reverter o tenant para não deixar lixo.
            _db.Tenants.Remove(tenant);
            await _db.SaveChangesAsync();
            foreach (var e in res.Errors) ModelState.AddModelError(string.Empty, e.Description);
            return View(vm);
        }
        await _users.AddToRoleAsync(owner, "Owner");

        // 3) Ligar o owner ao tenant.
        tenant.OwnerUserId = owner.Id;
        await _db.SaveChangesAsync();

        TempData["ok"] = $"Workspace “{tenant.Name}” criado. Owner: {owner.Email} · password temporária: {tempPassword}";
        return RedirectToAction(nameof(Index));
    }
}
