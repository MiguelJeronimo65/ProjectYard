using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Identity;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class HomeController : Controller
{
    private readonly AppDbContext _db;

    public HomeController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        // Superadmin de plataforma → consola de workspaces.
        if (User.FindFirstValue(AppUserClaimsPrincipalFactory.IsSuperadmin) == "true")
            return RedirectToAction("Index", "Workspaces");

        // Utilizador de tenant → dashboard do seu tenant (dados isolados pelos query filters).
        var projects = await _db.Projects
            .Include(p => p.Client)
            .OrderBy(p => p.Code)
            .ToListAsync();

        var tenantName = _db.CurrentTenantId is { } tid
            ? (await _db.Tenants.FindAsync(tid))?.Name ?? "—"
            : "—";

        var vm = new DashboardViewModel
        {
            TenantName = tenantName,
            Projects = projects,
            ProjetosAtivos = projects.Count(p => p.Status == "Em curso" || p.Status == "Em risco"),
            EntregaveisPendentes = await _db.Deliverables.CountAsync(d => d.Status != "Aprovado"),
            FaturasAbertas = await _db.Invoices.CountAsync(i => i.Status == "Pendente" || i.Status == "Vencido"),
            RiscosAbertos = await _db.Risks.CountAsync(r => r.Status == "Aberto" || r.Status == "Monitorizado"),
            Faturado = await _db.Invoices.Where(i => i.Status == "Pago").SumAsync(i => (decimal?)i.Amount) ?? 0m,
        };
        return View(vm);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
        => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
