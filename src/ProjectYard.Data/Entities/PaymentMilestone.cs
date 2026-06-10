using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class PaymentMilestone
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ProjectId { get; set; }

    public string Name { get; set; } = null!;

    public decimal? Pct { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = null!;

    public string? TriggerType { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual Project Project { get; set; } = null!;

    public virtual Tenant Tenant { get; set; } = null!;
}
