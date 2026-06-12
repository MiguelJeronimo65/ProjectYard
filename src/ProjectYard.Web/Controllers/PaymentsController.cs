using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class PaymentsController : Controller
{
    private readonly AppDbContext _db;
    public PaymentsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? estado, string? tab)
    {
        var invoices = await _db.Invoices.Include(i => i.Project)
            .OrderByDescending(i => i.IssuedAt).ToListAsync();
        ViewBag.AllCount = invoices.Count;
        ViewBag.Estado = string.IsNullOrEmpty(estado) ? "Todos" : estado;
        ViewBag.Invoices = ViewBag.Estado == "Todos" ? invoices : invoices.Where(i => i.Status == (string)ViewBag.Estado).ToList();
        ViewBag.Tab = tab == "plano" ? "plano" : "faturas";

        ViewBag.Faturado = invoices.Sum(i => i.Amount);
        ViewBag.Recebido = invoices.Where(i => i.Status == "Pago").Sum(i => i.Amount);
        ViewBag.Pendente = invoices.Where(i => i.Status == "Pendente").Sum(i => i.Amount);
        ViewBag.Vencido = invoices.Where(i => i.Status == "Vencido").Sum(i => i.Amount);
        ViewBag.Abertas = invoices.Count(i => i.Status is "Pendente" or "Vencido");
        ViewBag.Vencidas = invoices.Where(i => i.Status == "Vencido").ToList();

        ViewBag.Revenue = invoices.Where(i => i.IssuedAt != null)
            .GroupBy(i => new { i.IssuedAt!.Value.Year, i.IssuedAt!.Value.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => (M: new[] { "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" }[g.Key.Month - 1],
                          V: (double)(g.Sum(x => x.Amount) / 1000m)))
            .ToList();

        ViewBag.MilestonesByProject = (await _db.PaymentMilestones.Include(m => m.Project).ToListAsync())
            .GroupBy(m => m.Project)
            .OrderBy(g => g.Key?.Code)
            .ToList();
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code).Select(p => new { p.Id, p.Code, p.Name }).ToListAsync();
        return View();
    }

    /// <summary>Registar pagamento de uma fatura (passa a Pago).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Pay(long id)
    {
        var inv = await _db.Invoices.FirstOrDefaultAsync(i => i.Id == id);
        if (inv is null) return NotFound();
        if (inv.Status != "Pago")
        {
            inv.Status = "Pago";
            await _db.SaveChangesAsync();
            TempData["ok"] = $"Pagamento de {inv.Amount:#,##0} € registado · {inv.Number}";
        }
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Emitir uma nova fatura (pendente).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateInvoice(long projectId, string? milestone, decimal amount, DateOnly? due)
    {
        if (amount <= 0)
        {
            TempData["ok"] = "Indica um valor válido.";
            return RedirectToAction(nameof(Index));
        }
        var year = DateTime.Today.Year;
        var prefix = $"FT {year}/";
        var existing = await _db.Invoices.Where(i => i.Number.StartsWith(prefix)).Select(i => i.Number).ToListAsync();
        var max = existing.Select(n => int.TryParse(n.Split('/').LastOrDefault(), out var v) ? v : 0).DefaultIfEmpty(0).Max();
        var inv = new Invoice
        {
            TenantId = _db.CurrentTenantId ?? 0,
            ProjectId = projectId,
            Number = prefix + (max + 1).ToString("000"),
            MilestoneTxt = string.IsNullOrWhiteSpace(milestone) ? null : milestone.Trim(),
            Amount = amount,
            Status = "Pendente",
            IssuedAt = DateOnly.FromDateTime(DateTime.Today),
            DueAt = due,
        };
        _db.Invoices.Add(inv);
        await _db.SaveChangesAsync();
        TempData["ok"] = $"Fatura {inv.Number} criada · pendente";
        return RedirectToAction(nameof(Index));
    }
}
