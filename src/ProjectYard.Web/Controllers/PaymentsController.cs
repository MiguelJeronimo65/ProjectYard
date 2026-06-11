using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class PaymentsController : Controller
{
    private readonly AppDbContext _db;
    public PaymentsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        ViewBag.Invoices = await _db.Invoices
            .Include(i => i.Project)
            .OrderByDescending(i => i.IssuedAt)
            .ToListAsync();
        ViewBag.Milestones = await _db.PaymentMilestones
            .Include(m => m.Project)
            .OrderBy(m => m.ProjectId)
            .ToListAsync();
        return View();
    }
}
