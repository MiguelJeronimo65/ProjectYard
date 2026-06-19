using System;
using Microsoft.AspNetCore.Identity;

namespace ProjectYard.Data.Identity;

/// <summary>
/// Utilizador do ASP.NET Identity. A tabela `users` é o store (ToTable("users"), chave BIGINT).
/// As colunas do Identity (UserName, Email, PasswordHash, LockoutEnd, etc.) são mapeadas para
/// colunas snake_case no AppDbContext. As propriedades abaixo são os campos de domínio do ProjectYard.
/// </summary>
public partial class ApplicationUser : IdentityUser<long>
{
    /// <summary>Tenant a que o utilizador pertence. NULL = utilizador de plataforma.</summary>
    public long? TenantId { get; set; }

    /// <summary>Nome a mostrar (DisplayName).</summary>
    public string Name { get; set; } = null!;

    /// <summary>'platform' ou 'tenant'.</summary>
    public string UserType { get; set; } = "tenant";

    /// <summary>Papel denormalizado (Superadmin/Owner/Administrador/Gestor/Membro/Cliente). Autorização efetiva via user_roles.</summary>
    public string Role { get; set; } = "Membro";

    public bool IsSuperadmin { get; set; }

    public bool IsTenantAdmin { get; set; }

    /// <summary>Cargo (ex.: Arquiteto Sénior).</summary>
    public string? Funcao { get; set; }

    /// <summary>Custo Hora (€).</summary>
    public decimal? CostHour { get; set; }

    /// <summary>'Ativo' / 'Pendente' / 'Inativo'.</summary>
    public string Status { get; set; } = "Pendente";

    public bool Active { get; set; } = true;

    public string? AvatarUrl { get; set; }

    public DateTime? LastActiveAt { get; set; }

    public DateTime CreatedAt { get; set; }
}
