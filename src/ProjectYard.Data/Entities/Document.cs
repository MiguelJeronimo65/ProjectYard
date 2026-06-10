using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class Document
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long? ProjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Ext { get; set; }

    public long? SizeBytes { get; set; }

    public string? Version { get; set; }

    public string? Folder { get; set; }

    public long? UploadedBy { get; set; }

    public DateTime UploadedAt { get; set; }

    public string? LinkType { get; set; }

    public long? LinkRefId { get; set; }

    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();

    public virtual Project? Project { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}
