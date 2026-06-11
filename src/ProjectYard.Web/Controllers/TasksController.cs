using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class TasksController : Controller
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var tasks = await _db.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Project)
            .OrderBy(t => t.DueDate)
            .ToListAsync();
        return View(tasks);
    }
}
