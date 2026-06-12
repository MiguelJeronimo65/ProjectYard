using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class TasksController : Controller
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(long? assignee, string? prio, long? project, string? view)
    {
        var tasks = await _db.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Project)
            .Where(t =>
                (assignee == null || t.AssigneeId == assignee) &&
                (string.IsNullOrEmpty(prio) || t.Priority == prio) &&
                (project == null || t.ProjectId == project))
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        ViewBag.People = await _db.Users
            .Where(u => u.TenantId == _db.CurrentTenantId)
            .OrderBy(u => u.Name)
            .Select(u => new { u.Id, u.Name })
            .ToListAsync();
        ViewBag.Projects = await _db.Projects.OrderBy(p => p.Code)
            .Select(p => new { p.Id, p.Code, p.Name }).ToListAsync();
        ViewBag.FAssignee = assignee;
        ViewBag.FPrio = prio;
        ViewBag.FProject = project;
        ViewBag.View = view == "list" ? "list" : "kanban";
        return View(tasks);
    }

    /// <summary>Drag &amp; drop do Kanban: move a tarefa para outra coluna (persistido).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Move(long id, string state)
    {
        var allowed = new[] { "todo", "doing", "review", "done" };
        if (!allowed.Contains(state)) return BadRequest();
        var t = await _db.Tasks.FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        t.State = state;
        if (state == "done") t.Overdue = false;
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(string title, string state, string priority, long? projectId, long? assigneeId, DateOnly? dueDate)
    {
        if (string.IsNullOrWhiteSpace(title) || projectId is null)
        {
            TempData["ok"] = "Indica o título e o projeto da tarefa.";
            return RedirectToAction(nameof(Index));
        }
        var allowed = new[] { "todo", "doing", "review", "done" };
        _db.Tasks.Add(new ProjectYard.Data.Entities.Task
        {
            TenantId = _db.CurrentTenantId ?? 0,
            ProjectId = projectId.Value,
            Title = title.Trim(),
            State = allowed.Contains(state) ? state : "todo",
            Priority = new[] { "Alta", "Média", "Baixa" }.Contains(priority) ? priority : "Média",
            AssigneeId = assigneeId,
            DueDate = dueDate,
            CreatedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        TempData["ok"] = "Tarefa criada.";
        return RedirectToAction(nameof(Index));
    }
}
