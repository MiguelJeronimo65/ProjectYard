using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Entities;

namespace ProjectYard.Data.Data;

// NOTA (database-first): após um novo `dotnet ef dbcontext scaffold --force`, repor esta linha de base
// (IdentityDbContext em vez de DbContext) — é a única alteração ao ficheiro gerado. O resto do Identity
// vive em AppDbContext.Identity.cs (OnModelCreatingPartial) e em Identity/Application{User,Role}.cs.
public partial class AppDbContext : Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityDbContext<ProjectYard.Data.Identity.ApplicationUser, ProjectYard.Data.Identity.ApplicationRole, long>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Approval> Approvals { get; set; }

    public virtual DbSet<ApprovalStep> ApprovalSteps { get; set; }

    public virtual DbSet<ChatChannel> ChatChannels { get; set; }

    public virtual DbSet<ChatChannelMember> ChatChannelMembers { get; set; }

    public virtual DbSet<ChatComplianceAccessLog> ChatComplianceAccessLogs { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<ChatReaction> ChatReactions { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Deliverable> Deliverables { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<Lookup> Lookups { get; set; }

    public virtual DbSet<PaymentMilestone> PaymentMilestones { get; set; }

    public virtual DbSet<PhaseDependency> PhaseDependencies { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ProjectMember> ProjectMembers { get; set; }

    public virtual DbSet<ProjectPhase> ProjectPhases { get; set; }

    public virtual DbSet<Risk> Risks { get; set; }

    public virtual DbSet<Setting> Settings { get; set; }

    public virtual DbSet<SmsMessage> SmsMessages { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<Tenant> Tenants { get; set; }

    public virtual DbSet<TimeEntry> TimeEntries { get; set; }

    public virtual DbSet<UserInvite> UserInvites { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Approval>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("approvals")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ProjectId, "fk_appr_project");

            entity.HasIndex(e => e.RequestedBy, "fk_appr_user");

            entity.HasIndex(e => e.TenantId, "ix_appr_tenant");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(12, 2)
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Note)
                .HasColumnType("text")
                .HasColumnName("note");
            entity.Property(e => e.Priority)
                .HasDefaultValueSql("'Média'")
                .HasColumnType("enum('Alta','Média','Baixa')")
                .HasColumnName("priority");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.RequestedBy).HasColumnName("requested_by");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Aberta'")
                .HasColumnType("enum('Aberta','Aprovada','Devolvida')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Title)
                .HasMaxLength(220)
                .HasColumnName("title");
            entity.Property(e => e.Type)
                .HasColumnType("enum('Entregável','Change Request','Pagamento')")
                .HasColumnName("type");

            entity.HasOne(d => d.Project).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_appr_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_appr_tenant");
        });

        modelBuilder.Entity<ApprovalStep>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("approval_steps")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ApprovalId, "fk_step_appr");

            entity.HasIndex(e => e.UserId, "fk_step_user");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ActedAt)
                .HasColumnType("datetime")
                .HasColumnName("acted_at");
            entity.Property(e => e.ApprovalId).HasColumnName("approval_id");
            entity.Property(e => e.RoleLabel)
                .HasMaxLength(120)
                .HasColumnName("role_label");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
            entity.Property(e => e.State)
                .HasDefaultValueSql("'pending'")
                .HasColumnType("enum('done','current','pending')")
                .HasColumnName("state");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Approval).WithMany(p => p.ApprovalSteps)
                .HasForeignKey(d => d.ApprovalId)
                .HasConstraintName("fk_step_appr");
        });

        modelBuilder.Entity<ChatChannel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("chat_channels")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ProjectId, "fk_chan_project");

            entity.HasIndex(e => e.TenantId, "ix_chan_tenant");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.LegalHold).HasColumnName("legal_hold");
            entity.Property(e => e.Name)
                .HasMaxLength(120)
                .HasColumnName("name");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.RetentionMonths).HasColumnName("retention_months");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Type)
                .HasColumnType("enum('channel','direct')")
                .HasColumnName("type");

            entity.HasOne(d => d.Project).WithMany(p => p.ChatChannels)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_chan_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.ChatChannels)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_chan_tenant");
        });

        modelBuilder.Entity<ChatChannelMember>(entity =>
        {
            entity.HasKey(e => new { e.ChannelId, e.UserId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("chat_channel_members")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.UserId, "fk_ccm_user");

            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.LastReadAt)
                .HasColumnType("datetime")
                .HasColumnName("last_read_at");

            entity.HasOne(d => d.Channel).WithMany(p => p.ChatChannelMembers)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("fk_ccm_chan");
        });

        modelBuilder.Entity<ChatComplianceAccessLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("chat_compliance_access_log")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ChannelId, "fk_ccal_chan");

            entity.HasIndex(e => e.AccessedByUserId, "fk_ccal_user");

            entity.HasIndex(e => e.TargetTenantId, "ix_ccal_tenant");

            entity.HasIndex(e => e.Ref, "uq_ccal_ref").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccessedByUserId).HasColumnName("accessed_by_user_id");
            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.LegalBasis)
                .HasMaxLength(120)
                .HasColumnName("legal_basis");
            entity.Property(e => e.LegalBasisRef)
                .HasMaxLength(120)
                .HasColumnName("legal_basis_ref");
            entity.Property(e => e.Reason)
                .HasColumnType("text")
                .HasColumnName("reason");
            entity.Property(e => e.Ref)
                .HasMaxLength(24)
                .HasColumnName("ref");
            entity.Property(e => e.Scope)
                .HasMaxLength(160)
                .HasColumnName("scope");
            entity.Property(e => e.State)
                .HasDefaultValueSql("'Ativo'")
                .HasColumnType("enum('Ativo','Concluído','Revogado')")
                .HasColumnName("state");
            entity.Property(e => e.TargetTenantId).HasColumnName("target_tenant_id");

            entity.HasOne(d => d.Channel).WithMany(p => p.ChatComplianceAccessLogs)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("fk_ccal_chan");

            entity.HasOne(d => d.TargetTenant).WithMany(p => p.ChatComplianceAccessLogs)
                .HasForeignKey(d => d.TargetTenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ccal_tenant");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("chat_messages")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.AttachmentDocumentId, "fk_msg_doc");

            entity.HasIndex(e => e.SenderId, "fk_msg_sender");

            entity.HasIndex(e => e.TenantId, "fk_msg_tenant");

            entity.HasIndex(e => new { e.ChannelId, e.CreatedAt }, "ix_msg_channel");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttachmentDocumentId).HasColumnName("attachment_document_id");
            entity.Property(e => e.Body)
                .HasColumnType("text")
                .HasColumnName("body");
            entity.Property(e => e.ChannelId).HasColumnName("channel_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DeletedAt)
                .HasColumnType("datetime")
                .HasColumnName("deleted_at");
            entity.Property(e => e.EditedAt)
                .HasColumnType("datetime")
                .HasColumnName("edited_at");
            entity.Property(e => e.Pinned).HasColumnName("pinned");
            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");

            entity.HasOne(d => d.AttachmentDocument).WithMany(p => p.ChatMessages)
                .HasForeignKey(d => d.AttachmentDocumentId)
                .HasConstraintName("fk_msg_doc");

            entity.HasOne(d => d.Channel).WithMany(p => p.ChatMessages)
                .HasForeignKey(d => d.ChannelId)
                .HasConstraintName("fk_msg_channel");

            entity.HasOne(d => d.Tenant).WithMany(p => p.ChatMessages)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_msg_tenant");
        });

        modelBuilder.Entity<ChatReaction>(entity =>
        {
            entity.HasKey(e => new { e.MessageId, e.UserId, e.Emoji })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

            entity
                .ToTable("chat_reactions")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.UserId, "fk_react_user");

            entity.Property(e => e.MessageId).HasColumnName("message_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Emoji)
                .HasMaxLength(16)
                .HasColumnName("emoji");

            entity.HasOne(d => d.Message).WithMany(p => p.ChatReactions)
                .HasForeignKey(d => d.MessageId)
                .HasConstraintName("fk_react_msg");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("clients")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.TenantId, "ix_client_tenant");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(120)
                .HasColumnName("city");
            entity.Property(e => e.Company)
                .HasMaxLength(180)
                .HasColumnName("company");
            entity.Property(e => e.Contact)
                .HasMaxLength(160)
                .HasColumnName("contact");
            entity.Property(e => e.ContactRole)
                .HasMaxLength(120)
                .HasColumnName("contact_role");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(190)
                .HasColumnName("email");
            entity.Property(e => e.Nif)
                .HasMaxLength(20)
                .HasColumnName("nif");
            entity.Property(e => e.Phone)
                .HasMaxLength(40)
                .HasColumnName("phone");
            entity.Property(e => e.Stage)
                .HasMaxLength(40)
                .HasColumnName("stage");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Lead'")
                .HasColumnType("enum('Lead','Ativo','Em risco','Concluído')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Clients)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_client_tenant");
        });

        modelBuilder.Entity<Deliverable>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("deliverables")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.OwnerId, "fk_deliv_owner");

            entity.HasIndex(e => e.TenantId, "fk_deliv_tenant");

            entity.HasIndex(e => e.ProjectId, "ix_deliv_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.FilesCount).HasColumnName("files_count");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.OwnerId).HasColumnName("owner_id");
            entity.Property(e => e.Phase)
                .HasMaxLength(80)
                .HasColumnName("phase");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Required)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("required");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Rascunho'")
                .HasColumnType("enum('Rascunho','Em revisão','Em aprovação','Aprovado','Precisa revisão')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Type)
                .HasMaxLength(80)
                .HasColumnName("type");
            entity.Property(e => e.Version)
                .HasMaxLength(12)
                .HasColumnName("version");

            entity.HasOne(d => d.Project).WithMany(p => p.Deliverables)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_deliv_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Deliverables)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_deliv_tenant");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("documents")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.TenantId, "fk_doc_tenant");

            entity.HasIndex(e => e.UploadedBy, "fk_doc_user");

            entity.HasIndex(e => e.ProjectId, "ix_doc_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Ext)
                .HasMaxLength(12)
                .HasColumnName("ext");
            entity.Property(e => e.Folder)
                .HasMaxLength(120)
                .HasColumnName("folder");
            entity.Property(e => e.LinkRefId).HasColumnName("link_ref_id");
            entity.Property(e => e.LinkType)
                .HasMaxLength(40)
                .HasColumnName("link_type");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.SizeBytes).HasColumnName("size_bytes");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("uploaded_at");
            entity.Property(e => e.UploadedBy).HasColumnName("uploaded_by");
            entity.Property(e => e.Version)
                .HasMaxLength(12)
                .HasColumnName("version");

            entity.HasOne(d => d.Project).WithMany(p => p.Documents)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_doc_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Documents)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doc_tenant");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("invoices")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.MilestoneId, "fk_inv_ms");

            entity.HasIndex(e => e.ProjectId, "ix_inv_project");

            entity.HasIndex(e => new { e.TenantId, e.Number }, "uq_invoice_number").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(12, 2)
                .HasColumnName("amount");
            entity.Property(e => e.DueAt).HasColumnName("due_at");
            entity.Property(e => e.IssuedAt).HasColumnName("issued_at");
            entity.Property(e => e.MilestoneId).HasColumnName("milestone_id");
            entity.Property(e => e.MilestoneTxt)
                .HasMaxLength(200)
                .HasColumnName("milestone_txt");
            entity.Property(e => e.Number)
                .HasMaxLength(40)
                .HasColumnName("number");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Pendente'")
                .HasColumnType("enum('Pendente','Pago','Vencido','Anulado')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");

            entity.HasOne(d => d.Milestone).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.MilestoneId)
                .HasConstraintName("fk_inv_ms");

            entity.HasOne(d => d.Project).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_inv_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_inv_tenant");
        });

        modelBuilder.Entity<Lookup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("lookups")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => new { e.TenantId, e.Kind }, "ix_lookup");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("active");
            entity.Property(e => e.Kind)
                .HasMaxLength(40)
                .HasColumnName("kind");
            entity.Property(e => e.Note)
                .HasMaxLength(200)
                .HasColumnName("note");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Value)
                .HasMaxLength(120)
                .HasColumnName("value");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Lookups)
                .HasForeignKey(d => d.TenantId)
                .HasConstraintName("fk_lookup_tenant");
        });

        modelBuilder.Entity<PaymentMilestone>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("payment_milestones")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.TenantId, "fk_ms_tenant");

            entity.HasIndex(e => e.ProjectId, "ix_ms_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(12, 2)
                .HasColumnName("amount");
            entity.Property(e => e.Name)
                .HasMaxLength(180)
                .HasColumnName("name");
            entity.Property(e => e.Pct)
                .HasPrecision(5, 2)
                .HasColumnName("pct");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Por atingir'")
                .HasColumnType("enum('Por atingir','Atingido','Faturado','Pago')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.TriggerType)
                .HasMaxLength(80)
                .HasColumnName("trigger_type");

            entity.HasOne(d => d.Project).WithMany(p => p.PaymentMilestones)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_ms_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.PaymentMilestones)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ms_tenant");
        });

        modelBuilder.Entity<PhaseDependency>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("phase_dependencies")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.SourcePhaseId, "fk_dep_src");

            entity.HasIndex(e => e.TargetPhaseId, "fk_dep_tgt");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DepType)
                .HasDefaultValueSql("'0'")
                .HasColumnType("enum('0','1','2','3')")
                .HasColumnName("dep_type");
            entity.Property(e => e.SourcePhaseId).HasColumnName("source_phase_id");
            entity.Property(e => e.TargetPhaseId).HasColumnName("target_phase_id");

            entity.HasOne(d => d.SourcePhase).WithMany(p => p.PhaseDependencySourcePhases)
                .HasForeignKey(d => d.SourcePhaseId)
                .HasConstraintName("fk_dep_src");

            entity.HasOne(d => d.TargetPhase).WithMany(p => p.PhaseDependencyTargetPhases)
                .HasForeignKey(d => d.TargetPhaseId)
                .HasConstraintName("fk_dep_tgt");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("projects")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ClientId, "fk_project_client");

            entity.HasIndex(e => e.ManagerUserId, "fk_project_manager");

            entity.HasIndex(e => e.TenantId, "ix_project_tenant");

            entity.HasIndex(e => new { e.TenantId, e.Code }, "uq_project_code").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Billed)
                .HasPrecision(12, 2)
                .HasColumnName("billed");
            entity.Property(e => e.Budget)
                .HasPrecision(12, 2)
                .HasColumnName("budget");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.Code)
                .HasMaxLength(20)
                .HasColumnName("code");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DeviationDays).HasColumnName("deviation_days");
            entity.Property(e => e.EndPlanned).HasColumnName("end_planned");
            entity.Property(e => e.EndReal).HasColumnName("end_real");
            entity.Property(e => e.Fees)
                .HasPrecision(12, 2)
                .HasColumnName("fees");
            entity.Property(e => e.Health)
                .HasDefaultValueSql("'green'")
                .HasColumnType("enum('green','amber','red')")
                .HasColumnName("health");
            entity.Property(e => e.HoursPlanned)
                .HasPrecision(10, 2)
                .HasColumnName("hours_planned");
            entity.Property(e => e.HoursReal)
                .HasPrecision(10, 2)
                .HasColumnName("hours_real");
            entity.Property(e => e.ManagerUserId).HasColumnName("manager_user_id");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Notes)
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.PhaseCurrent)
                .HasMaxLength(80)
                .HasColumnName("phase_current");
            entity.Property(e => e.Priority)
                .HasDefaultValueSql("'Média'")
                .HasColumnType("enum('Alta','Média','Baixa')")
                .HasColumnName("priority");
            entity.Property(e => e.ProductivityPct)
                .HasPrecision(5, 2)
                .HasColumnName("productivity_pct");
            entity.Property(e => e.Received)
                .HasPrecision(12, 2)
                .HasColumnName("received");
            entity.Property(e => e.SchedulePct)
                .HasPrecision(5, 2)
                .HasColumnName("schedule_pct");
            entity.Property(e => e.Spent)
                .HasPrecision(12, 2)
                .HasColumnName("spent");
            entity.Property(e => e.StartPlanned).HasColumnName("start_planned");
            entity.Property(e => e.StartReal).HasColumnName("start_real");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Em curso'")
                .HasColumnType("enum('Proposta','Em curso','Em risco','Concluído','Suspenso','Cancelado')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Type)
                .HasMaxLength(80)
                .HasColumnName("type");

            entity.HasOne(d => d.Client).WithMany(p => p.Projects)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("fk_project_client");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Projects)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_project_tenant");
        });

        modelBuilder.Entity<ProjectMember>(entity =>
        {
            entity.HasKey(e => new { e.ProjectId, e.UserId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("project_members")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.UserId, "fk_pm_user");

            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectMembers)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_pm_project");
        });

        modelBuilder.Entity<ProjectPhase>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("project_phases")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ResponsibleUserId, "fk_phase_user");

            entity.HasIndex(e => e.ProjectId, "ix_phase_project");

            entity.HasIndex(e => new { e.TenantId, e.Code }, "uq_phase_code").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Billed)
                .HasPrecision(12, 2)
                .HasColumnName("billed");
            entity.Property(e => e.Code)
                .HasMaxLength(24)
                .HasColumnName("code");
            entity.Property(e => e.CompletionPct)
                .HasPrecision(5, 2)
                .HasColumnName("completion_pct");
            entity.Property(e => e.Critical).HasColumnName("critical");
            entity.Property(e => e.EndPlanned).HasColumnName("end_planned");
            entity.Property(e => e.EndReal).HasColumnName("end_real");
            entity.Property(e => e.Fees)
                .HasPrecision(12, 2)
                .HasColumnName("fees");
            entity.Property(e => e.HoursPlanned)
                .HasPrecision(10, 2)
                .HasColumnName("hours_planned");
            entity.Property(e => e.HoursReal)
                .HasPrecision(10, 2)
                .HasColumnName("hours_real");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.Notes)
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Received)
                .HasPrecision(12, 2)
                .HasColumnName("received");
            entity.Property(e => e.ResponsibleUserId).HasColumnName("responsible_user_id");
            entity.Property(e => e.SchedulePct)
                .HasPrecision(5, 2)
                .HasColumnName("schedule_pct");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
            entity.Property(e => e.StartPlanned).HasColumnName("start_planned");
            entity.Property(e => e.StartReal).HasColumnName("start_real");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Por iniciar'")
                .HasColumnType("enum('Por iniciar','Em curso','Concluída','Suspensa')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Type)
                .HasMaxLength(60)
                .HasColumnName("type");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectPhases)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_phase_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.ProjectPhases)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_phase_tenant");
        });

        modelBuilder.Entity<Risk>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("risks")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.OwnerId, "fk_risk_owner");

            entity.HasIndex(e => e.TenantId, "fk_risk_tenant");

            entity.HasIndex(e => e.ProjectId, "ix_risk_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Category)
                .HasMaxLength(80)
                .HasColumnName("category");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Impact).HasColumnName("impact");
            entity.Property(e => e.Mitigation)
                .HasColumnType("text")
                .HasColumnName("mitigation");
            entity.Property(e => e.OwnerId).HasColumnName("owner_id");
            entity.Property(e => e.Probability).HasColumnName("probability");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Aberto'")
                .HasColumnType("enum('Aberto','Monitorizado','Mitigado','Fechado')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Title)
                .HasMaxLength(220)
                .HasColumnName("title");

            entity.HasOne(d => d.Project).WithMany(p => p.Risks)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_risk_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Risks)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_risk_tenant");
        });

        modelBuilder.Entity<Setting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("settings")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => new { e.TenantId, e.Param }, "uq_setting").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Note)
                .HasMaxLength(255)
                .HasColumnName("note");
            entity.Property(e => e.Param)
                .HasMaxLength(120)
                .HasColumnName("param");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Value)
                .HasMaxLength(255)
                .HasColumnName("value");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Settings)
                .HasForeignKey(d => d.TenantId)
                .HasConstraintName("fk_setting_tenant");
        });

        modelBuilder.Entity<SmsMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("sms_messages")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.ClientId, "fk_sms_client");

            entity.HasIndex(e => e.ProjectId, "fk_sms_project");

            entity.HasIndex(e => e.TenantId, "ix_sms_tenant");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Body)
                .HasMaxLength(480)
                .HasColumnName("body");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Direction)
                .HasColumnType("enum('out','in')")
                .HasColumnName("direction");
            entity.Property(e => e.IsAuto).HasColumnName("is_auto");
            entity.Property(e => e.Phone)
                .HasMaxLength(40)
                .HasColumnName("phone");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");

            entity.HasOne(d => d.Client).WithMany(p => p.SmsMessages)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("fk_sms_client");

            entity.HasOne(d => d.Project).WithMany(p => p.SmsMessages)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_sms_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.SmsMessages)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_sms_tenant");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("tasks")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.PhaseId, "fk_task_phase");

            entity.HasIndex(e => e.TenantId, "fk_task_tenant");

            entity.HasIndex(e => e.AssigneeId, "fk_task_user");

            entity.HasIndex(e => e.ProjectId, "ix_task_project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AssigneeId).HasColumnName("assignee_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.Overdue).HasColumnName("overdue");
            entity.Property(e => e.PhaseId).HasColumnName("phase_id");
            entity.Property(e => e.Priority)
                .HasDefaultValueSql("'Média'")
                .HasColumnType("enum('Alta','Média','Baixa')")
                .HasColumnName("priority");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.State)
                .HasDefaultValueSql("'todo'")
                .HasColumnType("enum('todo','doing','review','done')")
                .HasColumnName("state");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Title)
                .HasMaxLength(220)
                .HasColumnName("title");

            entity.HasOne(d => d.Phase).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.PhaseId)
                .HasConstraintName("fk_task_phase");

            entity.HasOne(d => d.Project).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_task_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_task_tenant");
        });

        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("tenants")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.OwnerUserId, "fk_tenant_owner");

            entity.HasIndex(e => e.Slug, "uq_tenant_slug").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Name)
                .HasMaxLength(160)
                .HasColumnName("name");
            entity.Property(e => e.OwnerUserId).HasColumnName("owner_user_id");
            entity.Property(e => e.Plan)
                .HasDefaultValueSql("'Starter'")
                .HasColumnType("enum('Starter','Pro','Enterprise')")
                .HasColumnName("plan");
            entity.Property(e => e.PrimaryColor)
                .HasMaxLength(7)
                .IsFixedLength()
                .HasColumnName("primary_color");
            entity.Property(e => e.Slug)
                .HasMaxLength(80)
                .HasColumnName("slug");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Trial'")
                .HasColumnType("enum('Trial','Ativo','Suspenso','Cancelado')")
                .HasColumnName("status");
            entity.Property(e => e.TrialEndsAt).HasColumnName("trial_ends_at");
        });

        modelBuilder.Entity<TimeEntry>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("time_entries")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.PhaseId, "fk_time_phase");

            entity.HasIndex(e => e.ProjectId, "fk_time_project");

            entity.HasIndex(e => e.TenantId, "ix_time_tenant");

            entity.HasIndex(e => new { e.UserId, e.EntryDate }, "ix_time_user_date");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Billable)
                .IsRequired()
                .HasDefaultValueSql("'1'")
                .HasColumnName("billable");
            entity.Property(e => e.Cost)
                .HasPrecision(10, 2)
                .HasColumnName("cost");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.EntryDate).HasColumnName("entry_date");
            entity.Property(e => e.Hours)
                .HasPrecision(6, 2)
                .HasColumnName("hours");
            entity.Property(e => e.PhaseId).HasColumnName("phase_id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Type)
                .HasMaxLength(60)
                .HasColumnName("type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Phase).WithMany(p => p.TimeEntries)
                .HasForeignKey(d => d.PhaseId)
                .HasConstraintName("fk_time_phase");

            entity.HasOne(d => d.Project).WithMany(p => p.TimeEntries)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("fk_time_project");

            entity.HasOne(d => d.Tenant).WithMany(p => p.TimeEntries)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_time_tenant");
        });

        modelBuilder.Entity<UserInvite>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("user_invites")
                .UseCollation("utf8mb4_0900_ai_ci");

            entity.HasIndex(e => e.InvitedBy, "fk_invite_user");

            entity.HasIndex(e => e.TenantId, "ix_invite_tenant");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Channel)
                .HasDefaultValueSql("'email'")
                .HasColumnType("enum('email','sms')")
                .HasColumnName("channel");
            entity.Property(e => e.Contact)
                .HasMaxLength(190)
                .HasColumnName("contact");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.InvitedBy).HasColumnName("invited_by");
            entity.Property(e => e.Role)
                .HasDefaultValueSql("'Membro'")
                .HasColumnType("enum('Administrador','Gestor','Membro','Cliente')")
                .HasColumnName("role");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Pendente'")
                .HasColumnType("enum('Pendente','Aceite','Cancelado','Expirado')")
                .HasColumnName("status");
            entity.Property(e => e.TenantId).HasColumnName("tenant_id");
            entity.Property(e => e.Token)
                .HasMaxLength(64)
                .IsFixedLength()
                .HasColumnName("token");

            entity.HasOne(d => d.Tenant).WithMany(p => p.UserInvites)
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_invite_tenant");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
