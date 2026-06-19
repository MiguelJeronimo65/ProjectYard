using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Data.Identity;
using ProjectYard.Web.Models;
using ProjectYard.Web.Tenancy;

namespace ProjectYard.Web.Controllers;

/// <summary>Consola de plataforma — só superadmin. Atravessa todos os tenants (BypassTenantFilter).</summary>
[Authorize(Roles = "Superadmin")]
public class WorkspacesController : Controller
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _users;
    private readonly ILogger<WorkspacesController> _logger;

    public WorkspacesController(AppDbContext db, UserManager<ApplicationUser> users, ILogger<WorkspacesController> logger)
    {
        _db = db;
        _users = users;
        _logger = logger;
    }

    public async Task<IActionResult> Index()
    {
        // Na consola atravessa-se sempre tudo, mesmo que haja um workspace "aberto" em sessão.
        _db.BypassTenantFilter = true;
        _db.CurrentTenantId = null;
        return View(await BuildCards());
    }

    /// <summary>Abrir workspace (modo plataforma/apoio): passa a ver os dados desse tenant, com auditoria.</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Open(long id)
    {
        _db.BypassTenantFilter = true;
        var tenant = await _db.Tenants.FindAsync(id);
        if (tenant is null) return NotFound();
        if (tenant.Status == "Suspenso")
        {
            TempData["ok"] = $"O workspace “{tenant.Name}” está suspenso.";
            return RedirectToAction(nameof(Index));
        }
        HttpContext.Session.SetString(TenantMiddleware.ViewTenantKey, tenant.Id.ToString());
        _logger.LogWarning("AUDITORIA plataforma: superadmin {User} ABRIU o workspace {Tenant} ({Id}) em modo de apoio.",
            User.Identity?.Name, tenant.Name, tenant.Id);
        return RedirectToAction("Index", "Home");
    }

    /// <summary>Voltar à consola (sai do modo plataforma).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Close()
    {
        HttpContext.Session.Remove(TenantMiddleware.ViewTenantKey);
        _logger.LogWarning("AUDITORIA plataforma: superadmin {User} saiu do modo de apoio.", User.Identity?.Name);
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Exportar a lista de workspaces em CSV.</summary>
    public async Task<IActionResult> Export()
    {
        _db.BypassTenantFilter = true;
        _db.CurrentTenantId = null;
        var vm = await BuildCards();
        var sb = new StringBuilder("Nome;Slug;Plano;Estado;Projetos;Membros;Faturado;Proprietario\r\n");
        foreach (var c in vm.Cards)
            sb.Append($"{c.Tenant.Name};{c.Tenant.Slug};{c.Tenant.Plan};{c.Tenant.Status};{c.Projetos};{c.Membros};{c.Faturado:0.##};{c.OwnerName}\r\n");
        return File(Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray(),
            "text/csv", "projectyard-workspaces.csv");
    }

    [HttpGet]
    public IActionResult Create() => View(new CreateWorkspaceViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateWorkspaceViewModel vm)
    {
        _db.BypassTenantFilter = true;
        if (await _db.Tenants.AnyAsync(t => t.Slug == vm.Slug))
            ModelState.AddModelError(nameof(vm.Slug), "Já existe um workspace com este slug.");
        if (await _users.FindByEmailAsync(vm.OwnerEmail) is not null)
            ModelState.AddModelError(nameof(vm.OwnerEmail), "Já existe um utilizador com este email.");
        if (!ModelState.IsValid) return View(vm);

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
            _db.Tenants.Remove(tenant);
            await _db.SaveChangesAsync();
            foreach (var e in res.Errors) ModelState.AddModelError(string.Empty, e.Description);
            return View(vm);
        }
        await _users.AddToRoleAsync(owner, "Owner");

        tenant.OwnerUserId = owner.Id;
        await _db.SaveChangesAsync();

        TempData["ok"] = $"Workspace “{tenant.Name}” criado. Owner: {owner.Email} · password temporária: {tempPassword}";
        return RedirectToAction(nameof(Index));
    }

    private async Task<WorkspacesViewModel> BuildCards()
    {
        var tenants = await _db.Tenants.Include(t => t.OwnerUser).OrderBy(t => t.Name).ToListAsync();
        var projects = await _db.Projects.GroupBy(p => p.TenantId)
            .Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var members = await _db.Users.Where(u => u.TenantId != null).GroupBy(u => u.TenantId!.Value)
            .Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        var billed = await _db.Invoices.GroupBy(i => i.TenantId)
            .Select(g => new { g.Key, S = g.Sum(i => i.Amount) }).ToDictionaryAsync(x => x.Key, x => x.S);

        return new WorkspacesViewModel
        {
            Cards = tenants.Select(t => new WorkspaceCard
            {
                Tenant = t,
                Projetos = projects.GetValueOrDefault(t.Id),
                Membros = members.GetValueOrDefault(t.Id),
                Faturado = billed.GetValueOrDefault(t.Id),
                OwnerName = t.OwnerUser?.Name ?? "—",
            }).ToList(),
        };
    }
}
