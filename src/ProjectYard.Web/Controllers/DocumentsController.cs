using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Controllers;

public class DocumentsController : Controller
{
    private readonly AppDbContext _db;
    public DocumentsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.Documents.Include(d => d.Project).Include(d => d.Uploader)
            .OrderByDescending(d => d.UploadedAt).ToListAsync());
}
