using System;

namespace ProjectYard.Data.Entities;

/// <summary>Histórico de mudanças de estado de um projeto (data do evento + observação opcional + autor).</summary>
public partial class ProjectStatusHistory
{
    public long Id { get; set; }

    public long ProjectId { get; set; }

    public string Status { get; set; } = null!;

    public string? Note { get; set; }

    public long? ChangedBy { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual Project Project { get; set; } = null!;
}
