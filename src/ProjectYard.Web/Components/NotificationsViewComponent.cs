using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;

namespace ProjectYard.Web.Components;

/// <summary>Sino de notificações — feed derivado de dados reais do workspace (sem tabela própria).</summary>
public class NotificationsViewComponent : ViewComponent
{
    private readonly AppDbContext _db;
    public NotificationsViewComponent(AppDbContext db) => _db = db;

    public class Item
    {
        public string Icon = "bell";
        public string Color = "var(--text-2)";
        public string Bg = "var(--surface-2)";
        public string Text = "";
        public string Sub = "";
        public string Url = "#";
        public DateTime When;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var items = new List<Item>();
        long me = long.TryParse(((ClaimsPrincipal)User).FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

        try
        {
            // Aprovações pendentes de decisão
            var apprs = await _db.Approvals.Include(a => a.Project)
                .Where(a => a.Status == "Aberta").OrderByDescending(a => a.CreatedAt).Take(6).ToListAsync();
            foreach (var a in apprs)
                items.Add(new Item { Icon = "shield", Color = "var(--warning)", Bg = "var(--warning-soft)",
                    Text = "Aprovação pendente", Sub = a.Title, Url = "/Approvals", When = a.CreatedAt });

            // Entregáveis em aprovação
            var delivs = await _db.Deliverables
                .Where(d => d.Status == "Em aprovação").Take(6).ToListAsync();
            foreach (var d in delivs)
                items.Add(new Item { Icon = "layers", Color = "var(--primary)", Bg = "var(--primary-soft)",
                    Text = "Entregável em aprovação", Sub = d.Name, Url = "/Deliverables", When = DateTime.Now });

            // Tarefas em atraso
            var lateTasks = await _db.Tasks.Where(t => t.Overdue && t.State != "done")
                .OrderBy(t => t.DueDate).Take(6).ToListAsync();
            foreach (var t in lateTasks)
                items.Add(new Item { Icon = "alert", Color = "var(--danger)", Bg = "var(--danger-soft)",
                    Text = "Tarefa em atraso", Sub = t.Title, Url = "/Tasks", When = DateTime.Now });

            // Faturas vencidas
            var overdueInv = await _db.Invoices.Where(i => i.Status == "Vencido").Take(6).ToListAsync();
            foreach (var i in overdueInv)
                items.Add(new Item { Icon = "euro", Color = "var(--danger)", Bg = "var(--danger-soft)",
                    Text = "Fatura vencida", Sub = i.Number, Url = "/Payments", When = DateTime.Now });

            // Mensagens de chat por ler (agregado)
            var myChannels = await _db.Set<ProjectYard.Data.Entities.ChatChannelMember>()
                .Where(m => m.UserId == me).ToListAsync();
            var unread = 0;
            foreach (var m in myChannels)
            {
                var last = m.LastReadAt ?? DateTime.MinValue;
                unread += await _db.ChatMessages.CountAsync(x => x.ChannelId == m.ChannelId && x.SenderId != me && x.DeletedAt == null && x.CreatedAt > last);
            }
            if (unread > 0)
                items.Insert(0, new Item { Icon = "message", Color = "var(--info)", Bg = "var(--info-soft)",
                    Text = $"{unread} {(unread == 1 ? "mensagem por ler" : "mensagens por ler")}", Sub = "Chat da equipa", Url = "/Chat", When = DateTime.Now });
        }
        catch { /* sem BD/contexto: sino vazio */ }

        var ordered = items.OrderByDescending(i => i.When).Take(8).ToList();
        ViewBag.Count = items.Count;
        return View(ordered);
    }
}
