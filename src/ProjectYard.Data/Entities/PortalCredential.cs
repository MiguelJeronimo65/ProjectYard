using System;

namespace ProjectYard.Data.Entities;

/// <summary>Credencial de um portal (câmara/entidade) para licenciamento. Password guardada cifrada (password_enc).</summary>
public partial class PortalCredential
{
    public long Id { get; set; }

    public long TenantId { get; set; }

    public string Name { get; set; } = null!;

    public string? ProcNumber { get; set; }

    public string? Portal { get; set; }

    public string? Url { get; set; }

    public string? Username { get; set; }

    /// <summary>Password CIFRADA (ASP.NET Data Protection). Nunca em claro.</summary>
    public string? PasswordEnc { get; set; }

    public string? Notes { get; set; }

    public long? ProjectId { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Project? Project { get; set; }
}
