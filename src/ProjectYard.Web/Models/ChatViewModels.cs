using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class ChatThreadVm
{
    public ChatChannel Channel { get; set; } = null!;
    public List<string> OtherNames { get; set; } = new();
    public List<string> AllNames { get; set; } = new();
    public DateTime? LastAt { get; set; }
    public string Preview { get; set; } = "";
    public int Unread { get; set; }

    public string DisplayName => Channel.Type == "channel" ? "#" + Channel.Name : (OtherNames.FirstOrDefault() ?? "Conversa direta");
}
