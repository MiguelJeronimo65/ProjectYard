using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class ClientsController : Controller
{
    public static readonly (string Id, string Label, string Color)[] Stages =
    {
        ("contacto", "Contacto inicial", "#8a949e"),
        ("proposta", "Proposta enviada", "#2a7fb8"),
        ("negociacao", "Em negociação", "#e0922a"),
        ("adjudicado", "Adjudicado", "#6a5af9"),
        ("execucao", "Em execução", "#d9a32a"),
        ("concluido", "Concluído", "#1f9d6b"),
    };

    private readonly AppDbContext _db;
    public ClientsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? view)
    {
        var clients = await _db.Clients.OrderBy(c => c.Company).ToListAsync();
        // Fase derivada do estado quando ainda não definida (sem persistir).
        foreach (var c in clients.Where(c => string.IsNullOrEmpty(c.Stage)))
            c.Stage = c.Status switch { "Ativo" => "execucao", "Concluído" => "concluido", "Em risco" => "negociacao", _ => "contacto" };

        var ids = clients.Select(c => c.Id).ToList();
        ViewBag.ProjectsByClient = await _db.Projects.Where(p => p.ClientId != null && ids.Contains(p.ClientId.Value))
            .GroupBy(p => p.ClientId!.Value).Select(g => new { g.Key, C = g.Count() }).ToDictionaryAsync(x => x.Key, x => x.C);
        ViewBag.BilledByClient = await _db.Invoices.Where(i => i.Project != null && i.Project.ClientId != null)
            .GroupBy(i => i.Project!.ClientId!.Value).Select(g => new { g.Key, S = g.Sum(i => i.Amount) }).ToDictionaryAsync(x => x.Key, x => x.S);
        ViewBag.FeesByClient = await _db.Projects.Where(p => p.ClientId != null)
            .GroupBy(p => p.ClientId!.Value).Select(g => new { g.Key, S = g.Sum(p => p.Fees ?? 0) }).ToDictionaryAsync(x => x.Key, x => x.S);
        ViewBag.View = view == "lista" ? "lista" : "pipeline";
        return View(clients);
    }

    /// <summary>Drag &amp; drop do pipeline CRM: move o cliente de fase (persistido).</summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> MoveStage(long id, string stage)
    {
        if (!Stages.Any(s => s.Id == stage)) return BadRequest();
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        c.Stage = stage;
        if (stage == "concluido" && c.Status != "Concluído") c.Status = "Concluído";
        if (stage is "adjudicado" or "execucao" && c.Status == "Lead") c.Status = "Ativo";
        await _db.SaveChangesAsync();
        return Ok(new { ok = true });
    }

    [HttpGet]
    public IActionResult Create() => View("Form", new Client { Status = "Lead", Stage = "contacto" });

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Create(Client input)
    {
        ModelState.Remove(nameof(Client.Tenant));
        if (!ModelState.IsValid) return View("Form", input);
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        _db.Clients.Add(input);
        await _db.SaveChangesAsync();
        TempData["ok"] = $"Cliente criado · {input.Company}";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(long id)
    {
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        return c is null ? NotFound() : View("Form", c);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Edit(long id, Client input)
    {
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        ModelState.Remove(nameof(Client.Tenant));
        if (!ModelState.IsValid) return View("Form", input);
        c.Company = input.Company; c.Nif = input.Nif; c.Contact = input.Contact; c.ContactRole = input.ContactRole;
        c.Email = input.Email; c.Phone = input.Phone; c.City = input.City; c.Stage = input.Stage; c.Status = input.Status;
        await _db.SaveChangesAsync();
        TempData["ok"] = "Cliente atualizado.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "GerirProjetos")]
    public async Task<IActionResult> Delete(long id)
    {
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (c is not null) { _db.Clients.Remove(c); await _db.SaveChangesAsync(); TempData["ok"] = $"Cliente removido · {c.Company}"; }
        return RedirectToAction(nameof(Index));
    }
}
