using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ChatChannel
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public string Type { get; set; } = null!;

    public string? Name { get; set; }

    public long? ProjectId { get; set; }

    public int? RetentionMonths { get; set; }

    public bool LegalHold { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ChatChannelMember> ChatChannelMembers { get; set; } = new List<ChatChannelMember>();

    public virtual ICollection<ChatComplianceAccessLog> ChatComplianceAccessLogs { get; set; } = new List<ChatComplianceAccessLog>();

    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
