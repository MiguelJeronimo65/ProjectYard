using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

/// <summary>Pesquisa global (paleta ⌘K) — projetos, tarefas, clientes, entregáveis e documentos do workspace.</summary>
public class SearchController : Controller
{
    private readonly AppDbContext _db;
    public SearchController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Query(string? q)
    {
        q = (q ?? "").Trim();
        if (q.Length < 2) return Json(new { groups = Array.Empty<object>() });

        object G(string label, IEnumerable<object> items) => new { label, items };

        var projetos = await _db.Projects
            .Where(p => p.Name.Contains(q) || p.Code.Contains(q))
            .OrderBy(p => p.Code).Take(5)
            .Select(p => new { text = p.Name, sub = p.Code, url = "/Projects/Details/" + p.Id, icon = "folder" })
            .ToListAsync();

        var tarefas = await _db.Tasks.Include(t => t.Project)
            .Where(t => t.Title.Contains(q))
            .OrderByDescending(t => t.CreatedAt).Take(5)
            .Select(t => new { text = t.Title, sub = t.Project.Code ?? "", url = "/Tasks/Details/" + t.Id, icon = "checkSquare" })
            .ToListAsync();

        var clientes = await _db.Clients
            .Where(c => c.Company.Contains(q))
            .OrderBy(c => c.Company).Take(5)
            .Select(c => new { text = c.Company, sub = c.City ?? "Cliente", url = "/Clients", icon = "users" })
            .ToListAsync();

        var entregaveis = await _db.Deliverables.Include(d => d.Project)
            .Where(d => d.Name.Contains(q))
            .OrderBy(d => d.Name).Take(5)
            .Select(d => new { text = d.Name, sub = (d.Project.Code ?? "") + " · " + (d.Version ?? ""), url = "/Deliverables", icon = "layers" })
            .ToListAsync();

        var documentos = await _db.Documents
            .Where(d => d.Name.Contains(q))
            .OrderByDescending(d => d.UploadedAt).Take(5)
            .Select(d => new { text = d.Name, sub = d.Folder ?? "Documento", url = "/Documents", icon = "fileText" })
            .ToListAsync();

        var groups = new List<object>();
        if (projetos.Count > 0) groups.Add(G("Projetos", projetos));
        if (tarefas.Count > 0) groups.Add(G("Tarefas", tarefas));
        if (clientes.Count > 0) groups.Add(G("Clientes", clientes));
        if (entregaveis.Count > 0) groups.Add(G("Entregáveis", entregaveis));
        if (documentos.Count > 0) groups.Add(G("Documentos", documentos));
        return Json(new { groups });
    }
}
