using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class ReportsController : Controller
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var vm = new ReportsViewModel
        {
            ProjectsByStatus = await _db.Projects.GroupBy(p => p.Status)
                .Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C),
            DeliverablesByStatus = await _db.Deliverables.GroupBy(d => d.Status)
                .Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C),
            HoursByProject = await _db.TimeEntries.Where(t => t.ProjectId != null)
                .GroupBy(t => t.Project!.Code)
                .Select(g => new HoursRow { Code = g.Key, Hours = g.Sum(x => x.Hours), Cost = g.Sum(x => x.Cost ?? 0) })
                .OrderByDescending(x => x.Hours).ToListAsync(),
            Pago = await _db.Invoices.Where(i => i.Status == "Pago").SumAsync(i => (decimal?)i.Amount) ?? 0,
            Pendente = await _db.Invoices.Where(i => i.Status == "Pendente").SumAsync(i => (decimal?)i.Amount) ?? 0,
            Vencido = await _db.Invoices.Where(i => i.Status == "Vencido").SumAsync(i => (decimal?)i.Amount) ?? 0,
            Honorarios = await _db.Projects.SumAsync(p => p.Fees ?? 0),
            HorasTotais = await _db.TimeEntries.SumAsync(t => (decimal?)t.Hours) ?? 0,
        };
        return View(vm);
    }
}
