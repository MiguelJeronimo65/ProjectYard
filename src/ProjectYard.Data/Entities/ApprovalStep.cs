using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ApprovalStep
{
    public long Id { get; set; }

    public long ApprovalId { get; set; }

    public long? UserId { get; set; }

    public string? RoleLabel { get; set; }

    public string State { get; set; } = null!;

    public DateTime? ActedAt { get; set; }

    public int SortOrder { get; set; }

    public virtual Approval Approval { get; set; } = null!;
}
