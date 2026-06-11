using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Entities;

namespace ProjectYard.Data.Data;

public partial class AppDbContext
{
    /// <summary>Tenant atual (definido por pedido pelo TenantMiddleware). Usado pelos query filters.</summary>
    public long? CurrentTenantId { get; set; }

    /// <summary>Quando true (superadmin de plataforma), os query filters de tenant são ignorados.</summary>
    public bool BypassTenantFilter { get; set; }

    /// <summary>
    /// Aplica o isolamento multi-tenant via global query filters às entidades com tenant_id.
    /// Chamado a partir de OnModelCreatingPartial. O superadmin (BypassTenantFilter) atravessa todos os tenants.
    /// </summary>
    private void ApplyTenantFilters(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Approval>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<ChatChannel>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<ChatMessage>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Client>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Deliverable>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Document>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Invoice>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<PaymentMilestone>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Project>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<ProjectPhase>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Risk>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<SmsMessage>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<Task>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<TimeEntry>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        modelBuilder.Entity<UserInvite>().HasQueryFilter(e => BypassTenantFilter || e.TenantId == CurrentTenantId);
        // Nota: lookups/settings têm tenant_id NULL (globais) e ficam fora do filtro; chat_compliance_access_log
        // é trilho de plataforma (só superadmin). Tabelas filhas sem tenant_id são acedidas via os pais filtrados.
    }
}
