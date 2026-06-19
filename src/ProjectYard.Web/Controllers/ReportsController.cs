using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class ReportsController : Controller
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? tab)
    {
        var projects = await _db.Projects.OrderBy(p => p.Code).ToListAsync();
        var hoursByProject = await _db.TimeEntries.Where(t => t.ProjectId != null)
            .GroupBy(t => t.ProjectId!.Value)
            .Select(g => new { g.Key, H = g.Sum(x => x.Hours), C = g.Sum(x => x.Cost ?? 0) })
            .ToDictionaryAsync(x => x.Key, x => (x.H, x.C));
        var billedByProject = await _db.Invoices.Where(i => i.ProjectId != null)
            .GroupBy(i => i.ProjectId!.Value)
            .Select(g => new { g.Key, F = g.Sum(i => i.Amount), R = g.Where(i => i.Status == "Pago").Sum(i => i.Amount) })
            .ToDictionaryAsync(x => x.Key, x => (x.F, x.R));

    var people = await _db.TimeEntries.Include(t => t.User)
            .GroupBy(t => new { t.User.Name, t.User.Funcao })
            .Select(g => new ColReportRow
            {
                Name = g.Key.Name,
                Funcao = g.Key.Funcao ?? "",
                Horas = g.Sum(x => x.Hours),
                Faturaveis = g.Where(x => x.Billable == true).Sum(x => x.Hours),
                Custo = g.Sum(x => x.Cost ?? 0),
            })
            .OrderByDescending(p => p.Horas)
            .ToListAsync();

        var rows = projects.Select(p => new ProjReportRow
        {
            Code = p.Code,
            Name = p.Name,
            Status = p.Status,
            Horas = hoursByProject.GetValueOrDefault(p.Id).Item1,
            Custo = hoursByProject.GetValueOrDefault(p.Id).Item2,
            Honorarios = p.Fees ?? 0,
            Faturado = billedByProject.GetValueOrDefault(p.Id).Item1,
            Recebido = billedByProject.GetValueOrDefault(p.Id).Item2,
        }).ToList();

        var vm = new ReportsViewModel
        {
            Projects = rows,
            People = people,
            HorasReais = rows.Sum(r => r.Horas),
            CustoProducao = rows.Sum(r => r.Custo),
            Honorarios = rows.Sum(r => r.Honorarios),
            Faturado = rows.Sum(r => r.Faturado),
            Recebido = rows.Sum(r => r.Recebido),
            Tab = tab == "colaborador" ? "colaborador" : "projeto",
        };
        return View(vm);
    }
}
