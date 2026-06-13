using System;

namespace ProjectYard.Data.Entities;

/// <summary>Entrada do histórico de versões de um entregável (v1/v2…, estado, nota, autor).</summary>
public partial class DeliverableVersion
{
    public long Id { get; set; }

    public long DeliverableId { get; set; }

    public string Version { get; set; } = null!;

    public string? Status { get; set; }

    public string? Note { get; set; }

    public long? DocumentId { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Deliverable Deliverable { get; set; } = null!;
}
