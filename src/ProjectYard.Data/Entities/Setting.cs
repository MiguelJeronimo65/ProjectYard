using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Setting
{
    public long Id { get; set; }

    public long? TenantId { get; set; }

    public string Param { get; set; } = null!;

    public string? Value { get; set; }

    public string? Note { get; set; }

    public virtual Tenant? Tenant { get; set; }
}
