using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class TimeEntry
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public DateOnly EntryDate { get; set; }

    public long? ProjectId { get; set; }

    public long? PhaseId { get; set; }

    public long UserId { get; set; }

    public decimal Hours { get; set; }

    public string? Type { get; set; }

    public bool? Billable { get; set; }

    public string? Description { get; set; }

    public decimal? Cost { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ProjectPhase? Phase { get; set; }

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
