using System;

namespace ProjectYard.Data.Entities;

/// <summary>Comentário numa tarefa do Kanban.</summary>
public partial class TaskComment
{
    public long Id { get; set; }

    public long TaskId { get; set; }

    public long UserId { get; set; }

    public string Body { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Task Task { get; set; } = null!;
}
