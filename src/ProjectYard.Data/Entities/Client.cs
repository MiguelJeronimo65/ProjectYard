using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Client
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public string Company { get; set; } = null!;

    public string? Nif { get; set; }

    public string? Contact { get; set; }

    public string? ContactRole { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? City { get; set; }

    public string? Stage { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<SmsMessage> SmsMessages { get; set; } = new List<SmsMessage>();

    public virtual Tenant Tenant { get; set; } = null!;
}
