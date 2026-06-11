using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class ApprovalsController : Controller
{
    private readonly AppDbContext _db;
    public ApprovalsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.Approvals.Include(a => a.Project).Include(a => a.RequestedByUser)
            .OrderByDescending(a => a.CreatedAt).ToListAsync());
}
