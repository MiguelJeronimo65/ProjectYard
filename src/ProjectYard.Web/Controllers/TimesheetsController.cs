using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class TimesheetsController : Controller
{
    private readonly AppDbContext _db;
    public TimesheetsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var entries = await _db.TimeEntries
            .Include(t => t.Project)
            .Include(t => t.User)
            .OrderByDescending(t => t.EntryDate)
            .ThenBy(t => t.Id)
            .ToListAsync();
        return View(entries);
    }
}
