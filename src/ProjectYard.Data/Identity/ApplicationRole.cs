using Microsoft.AspNetCore.Identity;

namespace ProjectYard.Data.Identity;

/// <summary>
/// Papel do ASP.NET Identity. Mapeado para a tabela `roles` (chave BIGINT) no AppDbContext.
/// Os papéis são globais à plataforma (Superadmin/Owner/Administrador/Gestor/Membro/Cliente).
/// </summary>
public partial class ApplicationRole : IdentityRole<long>
{
}
