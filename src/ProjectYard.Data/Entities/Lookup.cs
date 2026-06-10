using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Lookup
{
    public long Id { get; set; }

    public long? TenantId { get; set; }

    public string Kind { get; set; } = null!;

    public string Value { get; set; } = null!;

    public string? Note { get; set; }

    public int SortOrder { get; set; }

    public bool? Active { get; set; }

    public virtual Tenant? Tenant { get; set; }
}
