using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Project
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public long? ClientId { get; set; }

    public long? ManagerUserId { get; set; }

    public string? Type { get; set; }

    public string Status { get; set; } = null!;

    public string Priority { get; set; } = null!;

    public string Health { get; set; } = null!;

    public string? PhaseCurrent { get; set; }

    public DateOnly? StartPlanned { get; set; }

    public DateOnly? EndPlanned { get; set; }

    public DateOnly? StartReal { get; set; }

    public DateOnly? EndReal { get; set; }

    public decimal? HoursPlanned { get; set; }

    public decimal? HoursReal { get; set; }

    public decimal? Fees { get; set; }

    public decimal? Budget { get; set; }

    public decimal? Spent { get; set; }

    public decimal? Billed { get; set; }

    public decimal? Received { get; set; }

    public decimal? ProductivityPct { get; set; }

    public decimal? SchedulePct { get; set; }

    public int? DeviationDays { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();

    public virtual ICollection<ChatChannel> ChatChannels { get; set; } = new List<ChatChannel>();

    public virtual Client? Client { get; set; }

    public virtual ICollection<Deliverable> Deliverables { get; set; } = new List<Deliverable>();

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<PaymentMilestone> PaymentMilestones { get; set; } = new List<PaymentMilestone>();

    public virtual ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();

    public virtual ICollection<ProjectPhase> ProjectPhases { get; set; } = new List<ProjectPhase>();

    public virtual ICollection<Risk> Risks { get; set; } = new List<Risk>();

    public virtual ICollection<SmsMessage> SmsMessages { get; set; } = new List<SmsMessage>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual Tenant Tenant { get; set; } = null!;

    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
}
