using System;

namespace ProjectYard.Data.Entities;

/// <summary>Evento manual do calendário (reunião, visita de obra, pessoal). Os prazos/entregáveis/faturação/aprovações são derivados.</summary>
public partial class Event
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long? ProjectId { get; set; }

    public string Category { get; set; } = null!;

    public string Title { get; set; } = null!;

    public DateOnly EventDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }

    public long? OwnerUserId { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Project? Project { get; set; }
}
