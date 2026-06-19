using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Entities;

namespace ProjectYard.Data.Data;

// Entidades acrescentadas à mão (database-first) que não vêm do scaffold base.
// O mapeamento vai em OnModelCreatingPartial (AppDbContext.Identity.cs) — ver ConfigureCustom.
public partial class AppDbContext
{
    public virtual DbSet<ProjectStatusHistory> ProjectStatusHistories { get; set; }

    public virtual DbSet<TaskChecklistItem> TaskChecklistItems { get; set; }

    public virtual DbSet<TaskComment> TaskComments { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<DeliverableVersion> DeliverableVersions { get; set; }

    public virtual DbSet<PortalCredential> PortalCredentials { get; set; }

    private static void ConfigureCustom(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PortalCredential>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("portal_credentials").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => e.TenantId, "ix_pc_tenant");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Name).HasMaxLength(160).HasColumnName("name");
            entity.Property(e => e.ProcNumber).HasMaxLength(40).HasColumnName("proc_number");
            entity.Property(e => e.Portal).HasMaxLength(160).HasColumnName("portal");
            entity.Property(e => e.Url).HasMaxLength(255).HasColumnName("url");
            entity.Property(e => e.Username).HasMaxLength(160).HasColumnName("username");
            entity.Property(e => e.PasswordEnc).HasColumnType("text").HasColumnName("password_enc");
            entity.Property(e => e.Notes).HasMaxLength(500).HasColumnName("notes");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("datetime").HasColumnName("created_at");
            entity.HasOne(d => d.Project).WithMany().HasForeignKey(d => d.ProjectId).HasConstraintName("fk_pc_project");
        });
        modelBuilder.Entity<PortalCredential>().HasOne<Identity.ApplicationUser>().WithMany()
            .HasForeignKey(e => e.CreatedBy).HasConstraintName("fk_pc_user").OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<DeliverableVersion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("deliverable_versions").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => e.DeliverableId, "ix_dv_deliv");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DeliverableId).HasColumnName("deliverable_id");
            entity.Property(e => e.Version).HasMaxLength(12).HasColumnName("version");
            entity.Property(e => e.Status).HasMaxLength(40).HasColumnName("status");
            entity.Property(e => e.Note).HasMaxLength(255).HasColumnName("note");
            entity.Property(e => e.DocumentId).HasColumnName("document_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("datetime").HasColumnName("created_at");
            entity.HasOne(d => d.Deliverable).WithMany().HasForeignKey(d => d.DeliverableId).HasConstraintName("fk_dv_deliv");
        });
        modelBuilder.Entity<DeliverableVersion>().HasOne<Identity.ApplicationUser>().WithMany().HasForeignKey(e => e.CreatedBy).HasConstraintName("fk_dv_user").OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("events").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => new { e.TenantId, e.EventDate }, "ix_event_tenant_date");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Category).HasMaxLength(40).HasColumnName("category");
            entity.Property(e => e.Title).HasMaxLength(220).HasColumnName("title");
            entity.Property(e => e.EventDate).HasColumnName("event_date");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.Location).HasMaxLength(200).HasColumnName("location");
            entity.Property(e => e.Notes).HasMaxLength(255).HasColumnName("notes");
            entity.Property(e => e.OwnerUserId).HasColumnName("owner_user_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("datetime").HasColumnName("created_at");
            entity.HasOne(d => d.Project).WithMany().HasForeignKey(d => d.ProjectId).HasConstraintName("fk_event_project");
        });
        modelBuilder.Entity<Event>().HasOne<Identity.ApplicationUser>().WithMany().HasForeignKey(e => e.OwnerUserId).HasConstraintName("fk_event_owner").OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Event>().HasOne<Identity.ApplicationUser>().WithMany().HasForeignKey(e => e.CreatedBy).HasConstraintName("fk_event_creator").OnDelete(DeleteBehavior.NoAction);

        // tasks.tags (coluna acrescentada pelo delta 06-12)
        modelBuilder.Entity<Entities.Task>().Property(e => e.Tags).HasMaxLength(200).HasColumnName("tags");

        // approvals: return_reason + decided_at (delta 06-12)
        modelBuilder.Entity<Approval>().Property(e => e.ReturnReason).HasMaxLength(160).HasColumnName("return_reason");
        modelBuilder.Entity<Approval>().Property(e => e.DecidedAt).HasColumnType("datetime").HasColumnName("decided_at");

        modelBuilder.Entity<TaskChecklistItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("task_checklist_items").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => e.TaskId, "ix_tci_task");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TaskId).HasColumnName("task_id");
            entity.Property(e => e.Title).HasMaxLength(220).HasColumnName("title");
            entity.Property(e => e.Done).HasColumnName("done");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
            entity.HasOne(d => d.Task).WithMany().HasForeignKey(d => d.TaskId).HasConstraintName("fk_tci_task");
        });

        modelBuilder.Entity<TaskComment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("task_comments").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => e.TaskId, "ix_tc_task");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TaskId).HasColumnName("task_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Body).HasColumnType("text").HasColumnName("body");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("datetime").HasColumnName("created_at");
            entity.HasOne(d => d.Task).WithMany().HasForeignKey(d => d.TaskId).HasConstraintName("fk_tc_task");
        });
        modelBuilder.Entity<TaskComment>().HasOne<Identity.ApplicationUser>().WithMany()
            .HasForeignKey(e => e.UserId).HasConstraintName("fk_tc_user").OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<ProjectStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("project_status_history").UseCollation("utf8mb4_0900_ai_ci");
            entity.HasIndex(e => new { e.ProjectId, e.ChangedAt }, "ix_psh_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.Note).HasMaxLength(500).HasColumnName("note");
            entity.Property(e => e.ChangedBy).HasColumnName("changed_by");
            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("changed_at");

            entity.HasOne(d => d.Project).WithMany()
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_psh_project");
        });

        // changed_by -> users (sem cascade, como na BD; sem coleção inversa).
        modelBuilder.Entity<ProjectStatusHistory>()
            .HasOne<Identity.ApplicationUser>().WithMany()
            .HasForeignKey(e => e.ChangedBy)
            .HasConstraintName("fk_psh_user")
            .OnDelete(DeleteBehavior.NoAction);
    }
}
