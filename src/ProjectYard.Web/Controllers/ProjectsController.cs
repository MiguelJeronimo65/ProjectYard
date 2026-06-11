using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class ProjectsController : Controller
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var projects = await _db.Projects
            .Include(p => p.Client)
            .Include(p => p.Manager)
            .OrderBy(p => p.Code)
            .ToListAsync();
        return View(projects);
    }

    public async Task<IActionResult> Details(long id)
    {
        var project = await _db.Projects
            .Include(p => p.Client)
            .Include(p => p.Manager)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();

        var vm = new ProjectDetailsViewModel
        {
            Project = project,
            Phases = await _db.ProjectPhases.Where(p => p.ProjectId == id).OrderBy(p => p.SortOrder).ToListAsync(),
            Tasks = await _db.Tasks.Include(t => t.Assignee).Where(t => t.ProjectId == id).ToListAsync(),
            Deliverables = await _db.Deliverables.Include(d => d.Owner).Where(d => d.ProjectId == id).ToListAsync(),
            Milestones = await _db.PaymentMilestones.Where(m => m.ProjectId == id).ToListAsync(),
            Risks = await _db.Risks.Include(r => r.Owner).Where(r => r.ProjectId == id).ToListAsync(),
        };
        return View(vm);
    }
}
