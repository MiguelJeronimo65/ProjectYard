using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Controllers;

/// <summary>SMS bidirecional — threads por cliente, envio real (registado em sms_messages).</summary>
public class SmsController : Controller
{
    public static readonly (string Name, string Body)[] Templates =
    {
        ("Pedido de aprovação", "O entregável \"{entregavel}\" aguarda aprovação. Responda APROVO ou REJEITO."),
        ("Lembrete de reunião", "Lembrete: reunião de {projeto} marcada para {data} às {hora}."),
        ("Fatura emitida", "A fatura {numero} ({valor}) foi emitida. Vencimento a {vencimento}."),
        ("Aviso de prazo", "O prazo do entregável \"{entregavel}\" termina a {data}."),
    };

    private readonly AppDbContext _db;
    public SmsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(long? c)
    {
        var all = await _db.SmsMessages.Include(m => m.Client).Include(m => m.Project)
            .OrderBy(m => m.CreatedAt).ToListAsync();
        var threads = all.Where(m => m.ClientId != null)
            .GroupBy(m => m.ClientId!.Value)
            .Select(g => new
            {
                ClientId = g.Key,
                Client = g.First().Client!,
                Project = g.Select(m => m.Project).FirstOrDefault(p => p != null),
                Phone = g.Last().Phone,
                Last = g.Last(),
                Msgs = g.ToList(),
            })
            .OrderByDescending(t => t.Last.CreatedAt)
            .ToList();

        var monthStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        ViewBag.Enviadas = all.Count(m => m.Direction == "out" && m.CreatedAt >= monthStart.AddMonths(-1));
        ViewBag.Inbound = all.Count(m => m.Direction == "in");
        ViewBag.Threads = threads;
        ViewBag.Selected = threads.FirstOrDefault(t => t.ClientId == c) ?? threads.FirstOrDefault();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.Authorization.Authorize(Policy = "EnviarSms")]
    public async Task<IActionResult> Send(long clientId, string body)
    {
        var lastForClient = await _db.SmsMessages.Where(m => m.ClientId == clientId)
            .OrderByDescending(m => m.CreatedAt).FirstOrDefaultAsync();
        if (lastForClient is null || string.IsNullOrWhiteSpace(body))
            return RedirectToAction(nameof(Index), new { c = clientId });
        _db.SmsMessages.Add(new SmsMessage
        {
            TenantId = lastForClient.TenantId,
            ClientId = clientId,
            ProjectId = lastForClient.ProjectId,
            Direction = "out",
            Phone = lastForClient.Phone,
            Body = body.Trim().Length > 480 ? body.Trim()[..480] : body.Trim(),
            IsAuto = false,
            CreatedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        TempData["ok"] = "SMS enviado.";
        return RedirectToAction(nameof(Index), new { c = clientId });
    }
}
