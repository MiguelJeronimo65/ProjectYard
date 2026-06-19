using ProjectYard.Data.Identity;

namespace ProjectYard.Data.Entities;

// Navegações das entidades de domínio para o utilizador do Identity (ApplicationUser).
// O scaffold database-first omite estes FKs porque a tabela `users` é excluída (definida em código);
// re-adicionamo-los aqui como partial classes (sobrevivem a um novo scaffold) e configuramos as
// relações em AppDbContext.OnModelCreatingPartial. Obrigatórias (= null!) onde a coluna é NOT NULL.

public partial class Tenant
{
    /// <summary>Owner do workspace (1.º utilizador). FK: fk_tenant_owner.</summary>
    public virtual ApplicationUser? OwnerUser { get; set; }
}

public partial class UserInvite
{
    public virtual ApplicationUser? InvitedByUser { get; set; }
}

public partial class Project
{
    /// <summary>Gestor do projeto. FK: fk_project_manager.</summary>
    public virtual ApplicationUser? Manager { get; set; }
}

public partial class ProjectMember
{
    public virtual ApplicationUser User { get; set; } = null!;
}

public partial class ProjectPhase
{
    public virtual ApplicationUser? Responsible { get; set; }
}

public partial class Task
{
    public virtual ApplicationUser? Assignee { get; set; }
}

public partial class TimeEntry
{
    public virtual ApplicationUser User { get; set; } = null!;
}

public partial class Deliverable
{
    public virtual ApplicationUser? Owner { get; set; }
}

public partial class Document
{
    public virtual ApplicationUser? Uploader { get; set; }
}

public partial class Approval
{
    public virtual ApplicationUser? RequestedByUser { get; set; }
}

public partial class ApprovalStep
{
    public virtual ApplicationUser? User { get; set; }
}

public partial class Risk
{
    public virtual ApplicationUser? Owner { get; set; }
}

public partial class ChatChannelMember
{
    public virtual ApplicationUser User { get; set; } = null!;
}

public partial class ChatMessage
{
    public virtual ApplicationUser Sender { get; set; } = null!;
}

public partial class ChatReaction
{
    public virtual ApplicationUser User { get; set; } = null!;
}

public partial class ChatComplianceAccessLog
{
    public virtual ApplicationUser AccessedByUser { get; set; } = null!;
}
