using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class ComplianceViewModel
{
    public List<ComplianceConvo> Convos { get; set; } = new();
    public List<ChatComplianceAccessLog> Log { get; set; } = new();
    public string Ws { get; set; } = "Todos";
    public string Tab { get; set; } = "metadados";
    public List<string> Tenants { get; set; } = new();
    public ComplianceConvo? Reveal { get; set; }
    public ChatComplianceAccessLog? RevealEntry { get; set; }
    public List<ChatMessage> RevealMessages { get; set; } = new();

    public int Channels => Convos.Count(c => c.Type == "channel");
    public int Directs => Convos.Count(c => c.Type == "direct");
    public int TotalMsgs30 => Convos.Sum(c => c.Msgs30);
    public int Holds => Convos.Count(c => c.LegalHold);
    public int ActiveAccess => Log.Count(l => l.State == "Ativo");
}

public class ComplianceConvo
{
    public long Id { get; set; }
    public string TenantName { get; set; } = "";
    public string? TenantColor { get; set; }
    public string Type { get; set; } = "channel";
    public string? Name { get; set; }
    public string? ProjectName { get; set; }
    public int? RetentionMonths { get; set; }
    public bool LegalHold { get; set; }
    public List<string> Participants { get; set; } = new();
    public int Msgs30 { get; set; }
    public int Attachments { get; set; }
    public DateTime? LastActivity { get; set; }
}
