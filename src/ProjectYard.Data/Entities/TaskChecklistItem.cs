using System;

namespace ProjectYard.Data.Entities;

/// <summary>Item de checklist de uma tarefa do Kanban.</summary>
public partial class TaskChecklistItem
{
    public long Id { get; set; }

    public long TaskId { get; set; }

    public string Title { get; set; } = null!;

    public bool Done { get; set; }

    public int SortOrder { get; set; }

    public virtual Task Task { get; set; } = null!;
}
