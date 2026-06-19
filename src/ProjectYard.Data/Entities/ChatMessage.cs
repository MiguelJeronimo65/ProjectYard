using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ChatMessage
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public long ChannelId { get; set; }

    public long SenderId { get; set; }

    public string? Body { get; set; }

    public long? AttachmentDocumentId { get; set; }

    public bool Pinned { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? EditedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual Document? AttachmentDocument { get; set; }

    public virtual ChatChannel Channel { get; set; } = null!;

    public virtual ICollection<ChatReaction> ChatReactions { get; set; } = new List<ChatReaction>();

    public virtual Tenant Tenant { get; set; } = null!;
}
