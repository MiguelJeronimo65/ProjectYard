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
        var lastMsgs = await _db.ChatMessages.Where(m => ids.Contains(m.ChannelId))
            .GroupBy(m => m.ChannelId)
            .Select(g => new { g.Key, Last = g.Max(m => m.CreatedAt) })
            .ToDictionaryAsync(x => x.Key, x => x.Last);
        var previews = await _db.ChatMessages.Include(m => m.Sender)
            .Where(m => ids.Contains(m.ChannelId))
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
                Unread = _db.ChatMessages.Count(m => m.ChannelId == ch.Id && m.SenderId != me && m.CreatedAt > lastRead),
            };
        }).OrderByDescending(t => t.LastAt).ToList();

        var selected = threads.FirstOrDefault(t => t.Channel.Id == c) ?? threads.FirstOrDefault();
        List<ChatMessage> msgs = new();
        if (selected != null)
        {
            msgs = await _db.ChatMessages.Include(m => m.Sender)
                .Where(m => m.ChannelId == selected.Channel.Id)
                .OrderBy(m => m.CreatedAt).ToListAsync();
            // Marcar como lida (não-lidas reais via last_read_at).
            var mm = await _db.Set<ChatChannelMember>().FirstAsync(m => m.ChannelId == selected.Channel.Id && m.UserId == me);
            mm.LastReadAt = DateTime.Now;
            await _db.SaveChangesAsync();
            selected.Unread = 0;
        }

        ViewBag.Threads = threads;
        ViewBag.Selected = selected;
        ViewBag.Messages = msgs;
        ViewBag.Me = me;
        return View();
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
