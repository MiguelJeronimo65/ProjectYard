using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class UserInvite
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public string Channel { get; set; } = null!;

    public string Contact { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string Token { get; set; } = null!;

    public long? InvitedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
