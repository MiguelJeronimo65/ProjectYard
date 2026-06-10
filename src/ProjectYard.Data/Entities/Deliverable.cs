using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Deliverable
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ProjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Phase { get; set; }

    public string? Type { get; set; }

    public string? Version { get; set; }

    public string Status { get; set; } = null!;

    public DateOnly? DueDate { get; set; }

    public long? OwnerId { get; set; }

    public int FilesCount { get; set; }

    public bool? Required { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual Tenant Tenant { get; set; } = null!;
}
