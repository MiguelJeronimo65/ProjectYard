using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ProjectPhase
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ProjectId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Type { get; set; }

    public long? ResponsibleUserId { get; set; }

    public string Status { get; set; } = null!;

    public bool Critical { get; set; }

    public DateOnly? StartPlanned { get; set; }

    public DateOnly? EndPlanned { get; set; }

    public DateOnly? StartReal { get; set; }

    public DateOnly? EndReal { get; set; }

    public decimal? HoursPlanned { get; set; }

    public decimal? HoursReal { get; set; }

    public decimal? Fees { get; set; }

    public decimal? Billed { get; set; }

    public decimal? Received { get; set; }

    public decimal? CompletionPct { get; set; }

    public decimal? SchedulePct { get; set; }

    public string? Notes { get; set; }

    public int SortOrder { get; set; }

    public virtual ICollection<PhaseDependency> PhaseDependencySourcePhases { get; set; } = new List<PhaseDependency>();

    public virtual ICollection<PhaseDependency> PhaseDependencyTargetPhases { get; set; } = new List<PhaseDependency>();

    public virtual Project Project { get; set; } = null!;

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual Tenant Tenant { get; set; } = null!;

    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
}
