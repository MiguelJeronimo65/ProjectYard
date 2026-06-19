using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Tenant
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string Plan { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateOnly? TrialEndsAt { get; set; }

    public long? OwnerUserId { get; set; }

    public string? PrimaryColor { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();

    public virtual ICollection<ChatChannel> ChatChannels { get; set; } = new List<ChatChannel>();

    public virtual ICollection<ChatComplianceAccessLog> ChatComplianceAccessLogs { get; set; } = new List<ChatComplianceAccessLog>();

    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual ICollection<Deliverable> Deliverables { get; set; } = new List<Deliverable>();

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<Lookup> Lookups { get; set; } = new List<Lookup>();

    public virtual ICollection<PaymentMilestone> PaymentMilestones { get; set; } = new List<PaymentMilestone>();

    public virtual ICollection<ProjectPhase> ProjectPhases { get; set; } = new List<ProjectPhase>();

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<Risk> Risks { get; set; } = new List<Risk>();

    public virtual ICollection<Setting> Settings { get; set; } = new List<Setting>();

    public virtual ICollection<SmsMessage> SmsMessages { get; set; } = new List<SmsMessage>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();

    public virtual ICollection<UserInvite> UserInvites { get; set; } = new List<UserInvite>();
}
