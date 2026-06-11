using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class DeliverablesController : Controller
{
    private readonly AppDbContext _db;
    public DeliverablesController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var items = await _db.Deliverables
            .Include(d => d.Project)
            .Include(d => d.Owner)
            .OrderBy(d => d.DueDate)
            .ToListAsync();
        return View(items);
    }
}
