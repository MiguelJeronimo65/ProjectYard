using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ProjectMember
{
    public long ProjectId { get; set; }

    public long UserId { get; set; }

    public virtual Project Project { get; set; } = null!;
}
