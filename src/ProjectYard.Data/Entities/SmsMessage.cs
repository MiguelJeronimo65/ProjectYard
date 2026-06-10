using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class SmsMessage
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long? ClientId { get; set; }

    public long? ProjectId { get; set; }

    public string Direction { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Body { get; set; } = null!;

    public bool IsAuto { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
