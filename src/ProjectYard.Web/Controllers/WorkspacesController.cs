using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

/// <summary>Consola de plataforma — só superadmin. Atravessa todos os tenants (BypassTenantFilter).</summary>
[Authorize(Roles = "Superadmin")]
public class WorkspacesController : Controller
{
    private readonly AppDbContext _db;

    public WorkspacesController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        // Agregados por tenant (projetos/utilizadores). BypassTenantFilter=true para superadmin.
        var tenants = await _db.Tenants.OrderBy(t => t.Name).ToListAsync();
        var projectsByTenant = await _db.Projects
            .GroupBy(p => p.TenantId)
            .Select(g => new { TenantId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.TenantId, x => x.Count);
        var usersByTenant = await _db.Users
            .Where(u => u.TenantId != null)
            .GroupBy(u => u.TenantId!.Value)
            .Select(g => new { TenantId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.TenantId, x => x.Count);

        ViewBag.ProjectsByTenant = projectsByTenant;
        ViewBag.UsersByTenant = usersByTenant;
        return View(tenants);
    }
}
