using System.Security.Claims;
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

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

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
        // Metadados dos cartões: progresso de checklist (feitos/total) e nº de comentários.
        var ids = tasks.Select(t => t.Id).ToList();
        var checklist = await _db.TaskChecklistItems.Where(c => ids.Contains(c.TaskId))
            .GroupBy(c => c.TaskId)
            .Select(g => new { g.Key, Total = g.Count(), Done = g.Count(x => x.Done) })
            .ToDictionaryAsync(x => x.Key, x => (x.Done, x.Total));
        var comments = await _db.TaskComments.Where(c => ids.Contains(c.TaskId))
            .GroupBy(c => c.TaskId).Select(g => new { g.Key, C = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.C);

        ViewBag.Checklist = checklist;
        ViewBag.Comments = comments;
        ViewBag.FAssignee = assignee;
        ViewBag.FPrio = prio;
        ViewBag.FProject = project;
        ViewBag.View = view == "list" ? "list" : "kanban";
        return View(tasks);
    }

    public async Task<IActionResult> Details(long id)
    {
        var t = await _db.Tasks.Include(x => x.Assignee).Include(x => x.Project).Include(x => x.Phase)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        ViewBag.ChecklistItems = await _db.TaskChecklistItems.Where(c => c.TaskId == id)
            .OrderBy(c => c.SortOrder).ThenBy(c => c.Id).ToListAsync();
        var comments = await _db.TaskComments.Where(c => c.TaskId == id).OrderBy(c => c.CreatedAt).ToListAsync();
        var authorIds = comments.Select(c => c.UserId).Distinct().ToList();
        ViewBag.CommentAuthors = await _db.Users.Where(u => authorIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => u.Name);
        ViewBag.Comments = comments;
        ViewBag.People = await _db.Users.Where(u => u.TenantId == _db.CurrentTenantId).OrderBy(u => u.Name)
            .Select(u => new { u.Id, u.Name }).ToListAsync();
        return View(t);
    }

    private async Task<bool> InTenant(long taskId)
        => await _db.Tasks.AnyAsync(t => t.Id == taskId && t.TenantId == _db.CurrentTenantId);

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddChecklistItem(long taskId, string title)
    {
        if (!string.IsNullOrWhiteSpace(title) && await InTenant(taskId))
        {
            var max = await _db.TaskChecklistItems.Where(c => c.TaskId == taskId).MaxAsync(c => (int?)c.SortOrder) ?? 0;
            _db.TaskChecklistItems.Add(new TaskChecklistItem { TaskId = taskId, Title = title.Trim(), Done = false, SortOrder = max + 1 });
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Details), new { id = taskId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleChecklistItem(long id)
    {
        var c = await _db.TaskChecklistItems.Include(x => x.Task).FirstOrDefaultAsync(x => x.Id == id);
        if (c is not null && c.Task.TenantId == _db.CurrentTenantId)
        {
            c.Done = !c.Done;
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Details), new { id = c?.TaskId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteChecklistItem(long id)
    {
        var c = await _db.TaskChecklistItems.Include(x => x.Task).FirstOrDefaultAsync(x => x.Id == id);
        if (c is not null && c.Task.TenantId == _db.CurrentTenantId)
        {
            var tid = c.TaskId;
            _db.TaskChecklistItems.Remove(c);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Details), new { id = tid });
        }
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddComment(long taskId, string body)
    {
        if (!string.IsNullOrWhiteSpace(body) && await InTenant(taskId))
        {
            _db.TaskComments.Add(new TaskComment { TaskId = taskId, UserId = CurrentUserId(), Body = body.Trim(), CreatedAt = DateTime.Now });
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Details), new { id = taskId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateTask(long taskId, string? tags, string? priority, long? assigneeId, DateOnly? dueDate)
    {
        var t = await _db.Tasks.FirstOrDefaultAsync(x => x.Id == taskId && x.TenantId == _db.CurrentTenantId);
        if (t is not null)
        {
            t.Tags = string.IsNullOrWhiteSpace(tags) ? null :
                string.Join(",", tags.Split(',').Select(s => s.Trim()).Where(s => s.Length > 0));
            if (new[] { "Alta", "Média", "Baixa" }.Contains(priority)) t.Priority = priority!;
            t.AssigneeId = assigneeId;
            t.DueDate = dueDate;
            await _db.SaveChangesAsync();
            TempData["ok"] = "Tarefa atualizada.";
        }
        return RedirectToAction(nameof(Details), new { id = taskId });
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
