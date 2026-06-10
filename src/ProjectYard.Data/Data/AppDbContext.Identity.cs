using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Entities;
using ProjectYard.Data.Identity;

namespace ProjectYard.Data.Data;

public partial class AppDbContext
{
    // Implementação do hook gerado pelo scaffold (chamado no fim de OnModelCreating).
    // Aqui: (1) corre a configuração base do Identity, (2) remapeia as entidades Identity para as
    // tabelas/colunas snake_case do nosso esquema, (3) liga as navegações de domínio -> ApplicationUser.
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        // (1) Configuração base do ASP.NET Identity (relações user/role/claims/logins/tokens).
        base.OnModelCreating(modelBuilder);

        // (2) Mapeamento das entidades Identity para o esquema existente (database-first).
        modelBuilder.Entity<ApplicationUser>(b =>
        {
            b.ToTable("users");
            b.Property(e => e.Id).HasColumnName("id");
            b.Property(e => e.UserName).HasColumnName("user_name").HasMaxLength(256);
            b.Property(e => e.NormalizedUserName).HasColumnName("normalized_user_name").HasMaxLength(256);
            b.Property(e => e.Email).HasColumnName("email").HasMaxLength(190);
            b.Property(e => e.NormalizedEmail).HasColumnName("normalized_email").HasMaxLength(190);
            b.Property(e => e.EmailConfirmed).HasColumnName("email_confirmed");
            b.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(255);
            b.Property(e => e.SecurityStamp).HasColumnName("security_stamp").HasMaxLength(255);
            b.Property(e => e.ConcurrencyStamp).HasColumnName("concurrency_stamp").HasMaxLength(255).IsConcurrencyToken();
            b.Property(e => e.PhoneNumber).HasColumnName("phone").HasMaxLength(40);
            b.Property(e => e.PhoneNumberConfirmed).HasColumnName("phone_number_confirmed");
            b.Property(e => e.TwoFactorEnabled).HasColumnName("two_factor_enabled");
            b.Property(e => e.LockoutEnd).HasColumnName("locked_until").HasColumnType("datetime(6)");
            b.Property(e => e.LockoutEnabled).HasColumnName("lockout_enabled");
            b.Property(e => e.AccessFailedCount).HasColumnName("failed_attempts");
            // Campos de domínio
            b.Property(e => e.TenantId).HasColumnName("tenant_id");
            b.Property(e => e.Name).HasColumnName("name").HasMaxLength(160);
            b.Property(e => e.UserType).HasColumnName("user_type").HasColumnType("enum('platform','tenant')");
            b.Property(e => e.Role).HasColumnName("role").HasColumnType("enum('Superadmin','Owner','Administrador','Gestor','Membro','Cliente')");
            b.Property(e => e.IsSuperadmin).HasColumnName("is_superadmin");
            b.Property(e => e.IsTenantAdmin).HasColumnName("is_tenant_admin");
            b.Property(e => e.Funcao).HasColumnName("funcao").HasMaxLength(120);
            b.Property(e => e.CostHour).HasColumnName("cost_hour").HasPrecision(8, 2);
            b.Property(e => e.Status).HasColumnName("status").HasColumnType("enum('Ativo','Pendente','Inativo')");
            b.Property(e => e.Active).HasColumnName("active");
            b.Property(e => e.AvatarUrl).HasColumnName("avatar_url").HasMaxLength(255);
            b.Property(e => e.LastActiveAt).HasColumnName("last_active_at").HasColumnType("datetime");
            b.Property(e => e.CreatedAt).HasColumnName("created_at").HasColumnType("datetime").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Índices: o nosso esquema usa username NÃO-único (email único por tenant via uq_user_email).
            b.HasIndex(e => e.NormalizedUserName).HasDatabaseName("ix_user_norm_username").IsUnique(false);
            b.HasIndex(e => e.NormalizedEmail).HasDatabaseName("ix_user_norm_email");
        });

        modelBuilder.Entity<ApplicationRole>(b =>
        {
            b.ToTable("roles");
            b.Property(e => e.Id).HasColumnName("id");
            b.Property(e => e.Name).HasColumnName("name").HasMaxLength(256);
            b.Property(e => e.NormalizedName).HasColumnName("normalized_name").HasMaxLength(256);
            b.Property(e => e.ConcurrencyStamp).HasColumnName("concurrency_stamp").HasMaxLength(255).IsConcurrencyToken();
            b.HasIndex(e => e.NormalizedName).HasDatabaseName("uq_role_normalized_name").IsUnique();
        });

        modelBuilder.Entity<IdentityUserRole<long>>(b =>
        {
            b.ToTable("user_roles");
            b.Property(e => e.UserId).HasColumnName("user_id");
            b.Property(e => e.RoleId).HasColumnName("role_id");
        });

        modelBuilder.Entity<IdentityRoleClaim<long>>(b =>
        {
            b.ToTable("role_claims");
            b.Property(e => e.Id).HasColumnName("id");
            b.Property(e => e.RoleId).HasColumnName("role_id");
            b.Property(e => e.ClaimType).HasColumnName("claim_type").HasMaxLength(255);
            b.Property(e => e.ClaimValue).HasColumnName("claim_value").HasMaxLength(255);
        });

        modelBuilder.Entity<IdentityUserClaim<long>>(b =>
        {
            b.ToTable("user_claims");
            b.Property(e => e.Id).HasColumnName("id");
            b.Property(e => e.UserId).HasColumnName("user_id");
            b.Property(e => e.ClaimType).HasColumnName("claim_type").HasMaxLength(255);
            b.Property(e => e.ClaimValue).HasColumnName("claim_value").HasMaxLength(255);
        });

        modelBuilder.Entity<IdentityUserLogin<long>>(b =>
        {
            b.ToTable("user_logins");
            b.Property(e => e.LoginProvider).HasColumnName("login_provider").HasMaxLength(128);
            b.Property(e => e.ProviderKey).HasColumnName("provider_key").HasMaxLength(128);
            b.Property(e => e.ProviderDisplayName).HasColumnName("provider_display_name").HasMaxLength(255);
            b.Property(e => e.UserId).HasColumnName("user_id");
        });

        modelBuilder.Entity<IdentityUserToken<long>>(b =>
        {
            b.ToTable("user_tokens");
            b.Property(e => e.UserId).HasColumnName("user_id");
            b.Property(e => e.LoginProvider).HasColumnName("login_provider").HasMaxLength(128);
            b.Property(e => e.Name).HasColumnName("name").HasMaxLength(128);
            b.Property(e => e.Value).HasColumnName("value").HasColumnType("text");
        });

        // (3) Navegações de domínio -> ApplicationUser (FKs que o scaffold omitiu por excluir `users`).
        //     WithMany() sem coleção inversa, para manter ApplicationUser limpo. NoAction = sem cascade (como na BD).
        modelBuilder.Entity<Tenant>().HasOne(e => e.OwnerUser).WithMany().HasForeignKey(e => e.OwnerUserId).HasConstraintName("fk_tenant_owner").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<UserInvite>().HasOne(e => e.InvitedByUser).WithMany().HasForeignKey(e => e.InvitedBy).HasConstraintName("fk_invite_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Project>().HasOne(e => e.Manager).WithMany().HasForeignKey(e => e.ManagerUserId).HasConstraintName("fk_project_manager").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ProjectMember>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_pm_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ProjectPhase>().HasOne(e => e.Responsible).WithMany().HasForeignKey(e => e.ResponsibleUserId).HasConstraintName("fk_phase_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Entities.Task>().HasOne(e => e.Assignee).WithMany().HasForeignKey(e => e.AssigneeId).HasConstraintName("fk_task_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<TimeEntry>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_time_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Deliverable>().HasOne(e => e.Owner).WithMany().HasForeignKey(e => e.OwnerId).HasConstraintName("fk_deliv_owner").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Document>().HasOne(e => e.Uploader).WithMany().HasForeignKey(e => e.UploadedBy).HasConstraintName("fk_doc_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Approval>().HasOne(e => e.RequestedByUser).WithMany().HasForeignKey(e => e.RequestedBy).HasConstraintName("fk_appr_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ApprovalStep>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_step_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Risk>().HasOne(e => e.Owner).WithMany().HasForeignKey(e => e.OwnerId).HasConstraintName("fk_risk_owner").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ChatChannelMember>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_ccm_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ChatMessage>().HasOne(e => e.Sender).WithMany().HasForeignKey(e => e.SenderId).HasConstraintName("fk_msg_sender").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ChatReaction>().HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_react_user").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<ChatComplianceAccessLog>().HasOne(e => e.AccessedByUser).WithMany().HasForeignKey(e => e.AccessedByUserId).HasConstraintName("fk_ccal_user").OnDelete(DeleteBehavior.NoAction);
    }
}
