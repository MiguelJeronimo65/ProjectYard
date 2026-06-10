using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Risk
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ProjectId { get; set; }

    public string Title { get; set; } = null!;

    public string? Category { get; set; }

    public sbyte Probability { get; set; }

    public sbyte Impact { get; set; }

    public long? OwnerId { get; set; }

    public string Status { get; set; } = null!;

    public string? Mitigation { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual Tenant Tenant { get; set; } = null!;
}
