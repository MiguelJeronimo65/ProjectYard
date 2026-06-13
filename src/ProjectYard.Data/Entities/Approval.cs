using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Approval
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long? ProjectId { get; set; }

    public string Title { get; set; } = null!;

    public string Type { get; set; } = null!;

    public long? RequestedBy { get; set; }

    public decimal? Amount { get; set; }

    public string Priority { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? Note { get; set; }

    public string? ReturnReason { get; set; }   // motivo da devolução (dropdown)

    public DateTime? DecidedAt { get; set; }     // data da decisão (KPI "aprovadas na semana")

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ApprovalStep> ApprovalSteps { get; set; } = new List<ApprovalStep>();

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
