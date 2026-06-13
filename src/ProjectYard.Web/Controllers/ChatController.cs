using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Entities;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

/// <summary>Chat de equipa — canais + mensagens diretas, isolado por workspace. Envio e não-lidas reais.</summary>
public class ChatController : Controller
{
    private readonly AppDbContext _db;
    public ChatController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(long? c)
    {
        var me = CurrentUserId();
        var myChannels = await _db.ChatChannels
            .Include(ch => ch.Project)
            .Where(ch => _db.Set<ChatChannelMember>().Any(m => m.ChannelId == ch.Id && m.UserId == me))
            .ToListAsync();
        var ids = myChannels.Select(ch => ch.Id).ToList();
        var members = await _db.Set<ChatChannelMember>().Include(m => m.User)
            .Where(m => ids.Contains(m.ChannelId)).ToListAsync();
        var lastMsgs = await _db.ChatMessages.Where(m => ids.Contains(m.ChannelId) && m.DeletedAt == null)
            .GroupBy(m => m.ChannelId)
            .Select(g => new { g.Key, Last = g.Max(m => m.CreatedAt) })
            .ToDictionaryAsync(x => x.Key, x => x.Last);
        var previews = await _db.ChatMessages.Include(m => m.Sender)
            .Where(m => ids.Contains(m.ChannelId) && m.DeletedAt == null)
            .GroupBy(m => m.ChannelId)
            .Select(g => g.OrderByDescending(m => m.CreatedAt).First())
            .ToListAsync();

        var threads = myChannels.Select(ch =>
        {
            var myMember = members.First(m => m.ChannelId == ch.Id && m.UserId == me);
            var lastRead = myMember.LastReadAt ?? DateTime.MinValue;
            var others = members.Where(m => m.ChannelId == ch.Id && m.UserId != me).Select(m => m.User.Name).ToList();
            var preview = previews.FirstOrDefault(p => p.ChannelId == ch.Id);
            return new ChatThreadVm
            {
                Channel = ch,
                OtherNames = others,
                AllNames = members.Where(m => m.ChannelId == ch.Id).Select(m => m.User.Name).ToList(),
                LastAt = lastMsgs.GetValueOrDefault(ch.Id),
                Preview = preview is null ? "" : (preview.SenderId == me ? "Tu: " : preview.Sender.Name.Split(' ')[0] + ": ") + (preview.Body ?? ""),
                Unread = _db.ChatMessages.Count(m => m.ChannelId == ch.Id && m.SenderId != me && m.CreatedAt > lastRead && m.DeletedAt == null),
            };
        }).OrderByDescending(t => t.LastAt).ToList();

        var selected = threads.FirstOrDefault(t => t.Channel.Id == c) ?? threads.FirstOrDefault();
        List<ChatMessage> msgs = new();
        var reactions = new Dictionary<long, List<ChatReactionVm>>();
        long? firstUnreadId = null;
        if (selected != null)
        {
            msgs = await _db.ChatMessages.Include(m => m.Sender)
                .Where(m => m.ChannelId == selected.Channel.Id)
                .OrderBy(m => m.CreatedAt).ToListAsync();

            // Divisor "Novas mensagens": 1.ª mensagem de outro acima do meu last_read (antes de marcar lida).
            var mm = await _db.Set<ChatChannelMember>().FirstAsync(m => m.ChannelId == selected.Channel.Id && m.UserId == me);
            var lastRead = mm.LastReadAt ?? DateTime.MinValue;
            firstUnreadId = msgs.FirstOrDefault(m => m.SenderId != me && m.CreatedAt > lastRead)?.Id;

            // Reações agregadas das mensagens visíveis.
            var msgIds = msgs.Select(m => m.Id).ToList();
            var raw = await _db.ChatReactions.Where(r => msgIds.Contains(r.MessageId)).ToListAsync();
            if (raw.Count > 0)
            {
                var userNames = await _db.Users.Where(u => raw.Select(r => r.UserId).Contains(u.Id))
                    .ToDictionaryAsync(u => u.Id, u => u.Name);
                reactions = raw.GroupBy(r => r.MessageId).ToDictionary(g => g.Key, g =>
                    g.GroupBy(r => r.Emoji).Select(eg => new ChatReactionVm
                    {
                        Emoji = eg.Key,
                        Count = eg.Count(),
                        Mine = eg.Any(r => r.UserId == me),
                        Names = eg.Select(r => userNames.GetValueOrDefault(r.UserId, "—")).ToList(),
                    }).ToList());
            }

            // Estado de entrega das minhas mensagens: "lido" quando TODOS os outros já leram acima da data.
            var othersReads = members.Where(m => m.ChannelId == selected.Channel.Id && m.UserId != me)
                .Select(m => m.LastReadAt ?? DateTime.MinValue).ToList();
            ViewBag.ReadByOthersAt = othersReads.Count > 0 ? othersReads.Min() : (DateTime?)null;

            // Marcar como lida (não-lidas reais via last_read_at).
            mm.LastReadAt = DateTime.Now;
            await _db.SaveChangesAsync();
            selected.Unread = 0;
        }

        ViewBag.Threads = threads;
        ViewBag.Selected = selected;
        ViewBag.Messages = msgs;
        ViewBag.Reactions = reactions;
        ViewBag.FirstUnreadId = firstUnreadId;
        ViewBag.PinnedMessages = msgs.Where(m => m.Pinned && m.DeletedAt == null).ToList();
        ViewBag.Me = me;
        return View();
    }

    private static readonly string[] AllowedEmoji = { "👍", "❤️", "✅", "🎉", "👀", "🙌" };

    /// <summary>Membro do canal? (guarda comum a todas as ações.)</summary>
    private Task<bool> IsMember(long channelId, long me)
        => _db.Set<ChatChannelMember>().AnyAsync(m => m.ChannelId == channelId && m.UserId == me);

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> React(long channelId, long messageId, string emoji)
    {
        var me = CurrentUserId();
        if (await IsMember(channelId, me) && AllowedEmoji.Contains(emoji))
        {
            var msg = await _db.ChatMessages.FirstOrDefaultAsync(m => m.Id == messageId && m.ChannelId == channelId);
            if (msg != null)
            {
                var existing = await _db.ChatReactions.FirstOrDefaultAsync(r => r.MessageId == messageId && r.UserId == me && r.Emoji == emoji);
                if (existing != null) _db.ChatReactions.Remove(existing);
                else _db.ChatReactions.Add(new ChatReaction { MessageId = messageId, UserId = me, Emoji = emoji });
                await _db.SaveChangesAsync();
            }
        }
        return RedirectToAction(nameof(Index), new { c = channelId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> TogglePin(long channelId, long messageId)
    {
        var me = CurrentUserId();
        if (await IsMember(channelId, me))
        {
            var msg = await _db.ChatMessages.FirstOrDefaultAsync(m => m.Id == messageId && m.ChannelId == channelId && m.DeletedAt == null);
            if (msg != null) { msg.Pinned = !msg.Pinned; await _db.SaveChangesAsync(); }
        }
        return RedirectToAction(nameof(Index), new { c = channelId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditMessage(long channelId, long messageId, string body)
    {
        var me = CurrentUserId();
        if (!string.IsNullOrWhiteSpace(body))
        {
            // Só o autor edita o seu texto.
            var msg = await _db.ChatMessages.FirstOrDefaultAsync(m => m.Id == messageId && m.ChannelId == channelId && m.SenderId == me && m.DeletedAt == null);
            if (msg != null) { msg.Body = body.Trim(); msg.EditedAt = DateTime.Now; await _db.SaveChangesAsync(); }
        }
        return RedirectToAction(nameof(Index), new { c = channelId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteMessage(long channelId, long messageId)
    {
        var me = CurrentUserId();
        // Soft-delete: só o autor; preserva o registo (auditoria/RGPD).
        var msg = await _db.ChatMessages.FirstOrDefaultAsync(m => m.Id == messageId && m.ChannelId == channelId && m.SenderId == me && m.DeletedAt == null);
        if (msg != null) { msg.DeletedAt = DateTime.Now; msg.Pinned = false; await _db.SaveChangesAsync(); }
        return RedirectToAction(nameof(Index), new { c = channelId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Send(long channelId, string body)
    {
        var me = CurrentUserId();
        var isMember = await _db.Set<ChatChannelMember>().AnyAsync(m => m.ChannelId == channelId && m.UserId == me);
        if (!isMember || string.IsNullOrWhiteSpace(body)) return RedirectToAction(nameof(Index), new { c = channelId });
        var ch = await _db.ChatChannels.FirstAsync(x => x.Id == channelId);
        _db.ChatMessages.Add(new ChatMessage
        {
            TenantId = ch.TenantId,
            ChannelId = channelId,
            SenderId = me,
            Body = body.Trim(),
            CreatedAt = DateTime.Now,
        });
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index), new { c = channelId });
    }

    private long CurrentUserId() => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;
}
