using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class ClientsController : Controller
{
    private readonly AppDbContext _db;
    public ClientsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var clients = await _db.Clients.OrderBy(c => c.Company).ToListAsync();
        return View(clients);
    }
}
