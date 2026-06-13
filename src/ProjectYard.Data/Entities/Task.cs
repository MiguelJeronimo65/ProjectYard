using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Task
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ProjectId { get; set; }

    public long? PhaseId { get; set; }

    public string Title { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Priority { get; set; } = null!;

    public long? AssigneeId { get; set; }

    public DateOnly? DueDate { get; set; }

    public bool Overdue { get; set; }

    public string? Tags { get; set; }   // etiquetas separadas por vírgula

    public DateTime CreatedAt { get; set; }

    public virtual ProjectPhase? Phase { get; set; }

    public virtual Project Project { get; set; } = null!;

    public virtual Tenant Tenant { get; set; } = null!;
}
