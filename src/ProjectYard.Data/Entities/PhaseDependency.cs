using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class PhaseDependency
{
    public long Id { get; set; }

    public long SourcePhaseId { get; set; }

    public long TargetPhaseId { get; set; }

    public string DepType { get; set; } = null!;

    public virtual ProjectPhase SourcePhase { get; set; } = null!;

    public virtual ProjectPhase TargetPhase { get; set; } = null!;
}
