using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

public class ClientsController : Controller
{
    private readonly AppDbContext _db;
    public ClientsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.Clients.OrderBy(c => c.Company).ToListAsync());

    [HttpGet]
    public IActionResult Create() => View("Form", new Client { Status = "Lead" });

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Client input)
    {
        ModelState.Remove(nameof(Client.Tenant));
        if (!ModelState.IsValid) return View("Form", input);
        input.Id = 0;
        input.TenantId = _db.CurrentTenantId ?? 0;
        input.CreatedAt = DateTime.Now;
        _db.Clients.Add(input);
        await _db.SaveChangesAsync();
        TempData["ok"] = "Cliente criado.";
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
    public async Task<IActionResult> Delete(long id)
    {
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (c is not null) { _db.Clients.Remove(c); await _db.SaveChangesAsync(); TempData["ok"] = "Cliente eliminado."; }
        return RedirectToAction(nameof(Index));
    }
}
