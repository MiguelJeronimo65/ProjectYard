using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class RisksController : Controller
{
    private readonly AppDbContext _db;
    public RisksController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var risks = await _db.Risks
            .Include(r => r.Project)
            .Include(r => r.Owner)
            .OrderByDescending(r => r.Probability * r.Impact)
            .ToListAsync();
        return View(risks);
    }
}
