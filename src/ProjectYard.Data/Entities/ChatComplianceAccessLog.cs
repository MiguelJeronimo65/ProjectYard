using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ChatComplianceAccessLog
{
    public long Id { get; set; }

    public string Ref { get; set; } = null!;

    public long AccessedByUserId { get; set; }

    public long TargetTenantId { get; set; }

    public long? ChannelId { get; set; }

    public string LegalBasis { get; set; } = null!;

    public string? LegalBasisRef { get; set; }

    public string Reason { get; set; } = null!;

    public string? Scope { get; set; }

    public string State { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ChatChannel? Channel { get; set; }

    public virtual Tenant TargetTenant { get; set; } = null!;
}
