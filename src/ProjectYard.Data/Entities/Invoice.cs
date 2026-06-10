using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Invoice
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long? ProjectId { get; set; }

    public string Number { get; set; } = null!;

    public long? MilestoneId { get; set; }

    public string? MilestoneTxt { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = null!;

    public DateOnly? IssuedAt { get; set; }

    public DateOnly? DueAt { get; set; }

    public virtual PaymentMilestone? Milestone { get; set; }

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
