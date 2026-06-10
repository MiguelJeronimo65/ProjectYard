using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ChatReaction
{
    public long MessageId { get; set; }

    public long UserId { get; set; }

    public string Emoji { get; set; } = null!;

    public virtual ChatMessage Message { get; set; } = null!;
}
