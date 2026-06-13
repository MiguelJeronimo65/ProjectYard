using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Entities;

namespace ProjectYard.Data.Data;

// Entidades acrescentadas à mão (database-first) que não vêm do scaffold base.
// O mapeamento vai em OnModelCreatingPartial (AppDbContext.Identity.cs) — ver ConfigureCustom.
public partial class AppDbContext
{
    public virtual DbSet<ProjectStatusHistory> ProjectStatusHistories { get; set; }

    private static void ConfigureCustom(ModelBuilder modelBuilder)
    {
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
