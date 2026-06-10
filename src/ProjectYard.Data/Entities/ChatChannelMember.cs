using System;
using System.Collections.Generic;

namespace ProjectYard.Data.Entities;

public partial class ChatChannelMember
{
    public long ChannelId { get; set; }

    public long UserId { get; set; }

    public DateTime? LastReadAt { get; set; }

    public virtual ChatChannel Channel { get; set; } = null!;
}
