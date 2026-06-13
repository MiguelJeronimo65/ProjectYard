-- ProjectYard — Esquema de base de dados (MySQL 8)
-- Domínio multi-tenant. Gerado a partir do modelo do protótipo + tabelas do cliente.
-- Convenções: InnoDB · utf8mb4 · chaves UUID (CHAR(36)) ou BIGINT AUTO_INCREMENT (à escolha).
-- Aqui usa-se BIGINT AUTO_INCREMENT por simplicidade; ajustar para UUID se preferido.
-- Todas as tabelas de domínio têm tenant_id (isolamento), exceto users de plataforma.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================ PLATAFORMA

CREATE TABLE tenants (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  slug          VARCHAR(80)  NOT NULL,
  plan          ENUM('Starter','Pro','Enterprise') NOT NULL DEFAULT 'Starter',
  status        ENUM('Trial','Ativo','Suspenso','Cancelado') NOT NULL DEFAULT 'Trial',
  trial_ends_at DATE NULL,
  owner_user_id BIGINT NULL,
  primary_color CHAR(7) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tenant_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- A tabela `users` é o STORE de utilizadores do ASP.NET Identity (mapeada via ToTable("users"), chave BIGINT).
-- Colunas Identity em snake_case (mapeadas no DbContext). Colunas de domínio ProjectYard mantidas.
CREATE TABLE users (
  id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id              BIGINT NULL,                       -- NULL = utilizador de plataforma
  name                   VARCHAR(160) NOT NULL,             -- nome a mostrar (não é do Identity)
  -- ---- ASP.NET Identity (IdentityUser<long>) ----
  user_name              VARCHAR(256) NULL,                 -- UserName
  normalized_user_name   VARCHAR(256) NULL,                 -- NormalizedUserName
  email                  VARCHAR(190) NOT NULL,             -- Email
  normalized_email       VARCHAR(190) NULL,                 -- NormalizedEmail
  email_confirmed        TINYINT(1) NOT NULL DEFAULT 0,     -- EmailConfirmed
  password_hash          VARCHAR(255) NULL,                 -- PasswordHash (NULL enquanto convite pendente)
  security_stamp         VARCHAR(255) NULL,                 -- SecurityStamp
  concurrency_stamp      VARCHAR(255) NULL,                 -- ConcurrencyStamp (token de concorrência)
  phone                  VARCHAR(40)  NULL,                 -- PhoneNumber
  phone_number_confirmed TINYINT(1) NOT NULL DEFAULT 0,     -- PhoneNumberConfirmed
  two_factor_enabled     TINYINT(1) NOT NULL DEFAULT 0,     -- TwoFactorEnabled
  lockout_enabled        TINYINT(1) NOT NULL DEFAULT 1,     -- LockoutEnabled
  locked_until           DATETIME(6) NULL,                  -- LockoutEnd (DateTimeOffset)
  failed_attempts        INT NOT NULL DEFAULT 0,            -- AccessFailedCount
  -- ---- Domínio ProjectYard ----
  user_type              ENUM('platform','tenant') NOT NULL DEFAULT 'tenant',
  role                   ENUM('Superadmin','Owner','Administrador','Gestor','Membro','Cliente') NOT NULL DEFAULT 'Membro', -- denormalizado; autorização efetiva via user_roles
  is_superadmin          TINYINT(1) NOT NULL DEFAULT 0,
  is_tenant_admin        TINYINT(1) NOT NULL DEFAULT 0,
  funcao                 VARCHAR(120) NULL,                 -- cargo (ex.: Arquiteto Sénior)
  cost_hour              DECIMAL(8,2) NULL,                 -- Custo Hora (€)
  status                 ENUM('Ativo','Pendente','Inativo') NOT NULL DEFAULT 'Pendente',
  active                 TINYINT(1) NOT NULL DEFAULT 1,
  avatar_url             VARCHAR(255) NULL,
  last_active_at         DATETIME NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_email (tenant_id, email),               -- email único por tenant (regra multi-tenant)
  KEY ix_user_tenant (tenant_id),
  KEY ix_user_norm_username (normalized_user_name),          -- lookup do Identity (NÃO único: ver nota multi-tenant)
  KEY ix_user_norm_email (normalized_email),
  CONSTRAINT fk_user_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE tenants
  ADD CONSTRAINT fk_tenant_owner FOREIGN KEY (owner_user_id) REFERENCES users(id);

-- Convites pendentes (criação/convite de utilizadores por email/SMS)
CREATE TABLE user_invites (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  channel     ENUM('email','sms') NOT NULL DEFAULT 'email',
  contact     VARCHAR(190) NOT NULL,                 -- email ou telefone
  role        ENUM('Administrador','Gestor','Membro','Cliente') NOT NULL DEFAULT 'Membro',
  status      ENUM('Pendente','Aceite','Cancelado','Expirado') NOT NULL DEFAULT 'Pendente',
  token       CHAR(64) NOT NULL,
  invited_by  BIGINT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_invite_tenant (tenant_id),
  CONSTRAINT fk_invite_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_invite_user FOREIGN KEY (invited_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ ASP.NET IDENTITY (papéis / claims / logins / tokens)
-- A tabela `users` (acima) é o store de utilizadores. Estas completam o modelo Identity.
-- Chaves BIGINT para alinhar com users.id. Nomes em snake_case (mapeados no DbContext via ToTable/HasColumnName).

CREATE TABLE roles (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(256) NULL,                 -- Name (ex.: Owner, Gestor)
  normalized_name   VARCHAR(256) NULL,                 -- NormalizedName
  concurrency_stamp VARCHAR(255) NULL,
  UNIQUE KEY uq_role_normalized_name (normalized_name)  -- RoleNameIndex (papéis são globais à plataforma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  KEY ix_user_roles_role (role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_claims (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id     BIGINT NOT NULL,
  claim_type  VARCHAR(255) NULL,
  claim_value VARCHAR(255) NULL,
  KEY ix_role_claims_role (role_id),
  CONSTRAINT fk_rc_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_claims (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  claim_type  VARCHAR(255) NULL,
  claim_value VARCHAR(255) NULL,
  KEY ix_user_claims_user (user_id),
  CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_logins (
  login_provider        VARCHAR(128) NOT NULL,
  provider_key          VARCHAR(128) NOT NULL,
  provider_display_name VARCHAR(255) NULL,
  user_id               BIGINT NOT NULL,
  PRIMARY KEY (login_provider, provider_key),
  KEY ix_user_logins_user (user_id),
  CONSTRAINT fk_ul_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_tokens (
  user_id        BIGINT NOT NULL,
  login_provider VARCHAR(128) NOT NULL,
  name           VARCHAR(128) NOT NULL,
  value          TEXT NULL,
  PRIMARY KEY (user_id, login_provider, name),
  CONSTRAINT fk_ut_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ CRM / CLIENTES

CREATE TABLE clients (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  company     VARCHAR(180) NOT NULL,
  nif         VARCHAR(20)  NULL,                     -- NIF / TaxNumber
  contact     VARCHAR(160) NULL,                     -- pessoa de contacto
  contact_role VARCHAR(120) NULL,
  email       VARCHAR(190) NULL,
  phone       VARCHAR(40)  NULL,
  city        VARCHAR(120) NULL,
  stage       VARCHAR(40)  NULL,                     -- funil CRM
  status      ENUM('Lead','Ativo','Em risco','Concluído') NOT NULL DEFAULT 'Lead',
  last_activity    VARCHAR(200) NULL,                -- última atividade (ex.: "Aprovou Arquitetura")
  last_activity_at DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_client_tenant (tenant_id),
  CONSTRAINT fk_client_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ PROJETOS

CREATE TABLE projects (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id        BIGINT NOT NULL,
  code             VARCHAR(20) NOT NULL,             -- ex.: PY-118
  name             VARCHAR(200) NOT NULL,
  client_id        BIGINT NULL,
  manager_user_id  BIGINT NULL,                      -- Gestor
  type             VARCHAR(80) NULL,
  status           ENUM('Proposta','Em curso','Em risco','Concluído','Suspenso','Cancelado') NOT NULL DEFAULT 'Em curso',
  priority         ENUM('Alta','Média','Baixa') NOT NULL DEFAULT 'Média',
  health           ENUM('green','amber','red') NOT NULL DEFAULT 'green',
  phase_current    VARCHAR(80) NULL,
  start_planned    DATE NULL,
  end_planned      DATE NULL,
  start_real       DATE NULL,
  end_real         DATE NULL,
  hours_planned    DECIMAL(10,2) NULL,
  hours_real       DECIMAL(10,2) NULL,
  fees             DECIMAL(12,2) NULL,               -- Honorários Propostos
  budget           DECIMAL(12,2) NULL,
  spent            DECIMAL(12,2) NULL,
  billed           DECIMAL(12,2) NULL,               -- Faturado
  received         DECIMAL(12,2) NULL,               -- Recebido
  productivity_pct DECIMAL(5,2) NULL,
  schedule_pct     DECIMAL(5,2) NULL,                -- Prazo %
  deviation_days   INT NULL,                         -- Desvio Prazo (dias)
  notes            TEXT NULL,                        -- Observações
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_code (tenant_id, code),
  KEY ix_project_tenant (tenant_id),
  CONSTRAINT fk_project_tenant  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_project_client  FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_project_manager FOREIGN KEY (manager_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Histórico de mudanças de estado do projeto (data do evento + observação opcional + autor).
-- Cada mudança de estado (incl. Cancelado) acrescenta uma linha — não substitui.
CREATE TABLE project_status_history (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id  BIGINT NOT NULL,
  status      VARCHAR(20) NOT NULL,                  -- estado para que mudou
  note        VARCHAR(500) NULL,                     -- observação (não obrigatória)
  changed_by  BIGINT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_psh_project (project_id, changed_at),
  CONSTRAINT fk_psh_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_psh_user    FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE project_members (
  project_id BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user    FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Fases_Projetos (detalhe por fase: prazos, horas, financeiro, conclusão)
CREATE TABLE project_phases (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id          BIGINT NOT NULL,
  project_id         BIGINT NOT NULL,
  code               VARCHAR(24) NOT NULL,           -- Código Fase (ex.: PY-118.3)
  name               VARCHAR(160) NOT NULL,
  type               VARCHAR(60) NULL,               -- Tipo (Produção, Licenciamento, …)
  responsible_user_id BIGINT NULL,
  status             ENUM('Por iniciar','Em curso','Concluída','Suspensa') NOT NULL DEFAULT 'Por iniciar',
  critical           TINYINT(1) NOT NULL DEFAULT 0,  -- Crítica
  start_planned      DATE NULL,
  end_planned        DATE NULL,
  start_real         DATE NULL,
  end_real           DATE NULL,
  hours_planned      DECIMAL(10,2) NULL,
  hours_real         DECIMAL(10,2) NULL,
  fees               DECIMAL(12,2) NULL,             -- Honorários Propostos
  billed             DECIMAL(12,2) NULL,
  received           DECIMAL(12,2) NULL,
  completion_pct     DECIMAL(5,2) NULL,              -- % Conclusão
  schedule_pct       DECIMAL(5,2) NULL,              -- Prazo %
  notes              TEXT NULL,                      -- Observações
  sort_order         INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_phase_code (tenant_id, code),
  KEY ix_phase_project (project_id),
  CONSTRAINT fk_phase_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_phase_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_phase_user    FOREIGN KEY (responsible_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dependências entre fases (para caminho crítico no DHTMLX)
CREATE TABLE phase_dependencies (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  source_phase_id BIGINT NOT NULL,
  target_phase_id BIGINT NOT NULL,
  dep_type        ENUM('0','1','2','3') NOT NULL DEFAULT '0', -- DHTMLX: 0=FS,1=SS,2=FF,3=SF
  CONSTRAINT fk_dep_src FOREIGN KEY (source_phase_id) REFERENCES project_phases(id) ON DELETE CASCADE,
  CONSTRAINT fk_dep_tgt FOREIGN KEY (target_phase_id) REFERENCES project_phases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ TAREFAS

CREATE TABLE tasks (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  project_id  BIGINT NOT NULL,
  phase_id    BIGINT NULL,
  title       VARCHAR(220) NOT NULL,
  state       ENUM('todo','doing','review','done') NOT NULL DEFAULT 'todo',
  priority    ENUM('Alta','Média','Baixa') NOT NULL DEFAULT 'Média',
  assignee_id BIGINT NULL,
  due_date    DATE NULL,
  overdue     TINYINT(1) NOT NULL DEFAULT 0,
  tags        VARCHAR(200) NULL,                     -- etiquetas separadas por vírgula (ex.: "Topografia,Materiais")
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_task_project (project_id),
  CONSTRAINT fk_task_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_phase   FOREIGN KEY (phase_id)   REFERENCES project_phases(id),
  CONSTRAINT fk_task_user    FOREIGN KEY (assignee_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Checklist do cartão Kanban (protótipo: "3/5" com barra de progresso)
CREATE TABLE task_checklist_items (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id    BIGINT NOT NULL,
  title      VARCHAR(220) NOT NULL,
  done       TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  KEY ix_tci_task (task_id),
  CONSTRAINT fk_tci_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comentários de tarefa (contador no cartão Kanban)
CREATE TABLE task_comments (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id    BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  body       TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_tc_task (task_id),
  CONSTRAINT fk_tc_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ REGISTO DE HORAS

CREATE TABLE time_entries (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  entry_date  DATE NOT NULL,                         -- Data
  project_id  BIGINT NULL,
  phase_id    BIGINT NULL,                           -- Código Fase
  user_id     BIGINT NOT NULL,                       -- Colaborador
  hours       DECIMAL(6,2) NOT NULL,                 -- Horas
  type        VARCHAR(60) NULL,                      -- Tipo (Produção, Coordenação, Reunião…)
  billable    TINYINT(1) NOT NULL DEFAULT 1,
  description VARCHAR(255) NULL,                      -- Descrição
  cost        DECIMAL(10,2) NULL,                    -- Custo (€) = horas * custo_hora
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_time_tenant (tenant_id),
  KEY ix_time_user_date (user_id, entry_date),
  CONSTRAINT fk_time_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_time_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_time_phase   FOREIGN KEY (phase_id)   REFERENCES project_phases(id),
  CONSTRAINT fk_time_user    FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ ENTREGÁVEIS / DOCUMENTOS

CREATE TABLE deliverables (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  project_id  BIGINT NOT NULL,
  name        VARCHAR(200) NOT NULL,
  phase       VARCHAR(80) NULL,
  type        VARCHAR(80) NULL,
  version     VARCHAR(12) NULL,
  status      ENUM('Rascunho','Em revisão','Em aprovação','Aprovado','Precisa revisão') NOT NULL DEFAULT 'Rascunho',
  due_date    DATE NULL,
  owner_id    BIGINT NULL,
  files_count INT NOT NULL DEFAULT 0,
  required    TINYINT(1) NOT NULL DEFAULT 1,
  KEY ix_deliv_project (project_id),
  CONSTRAINT fk_deliv_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_deliv_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_deliv_owner   FOREIGN KEY (owner_id)   REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Histórico de versões do entregável (protótipo: secção "Histórico de versões" v1/v2…)
CREATE TABLE deliverable_versions (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  deliverable_id BIGINT NOT NULL,
  version        VARCHAR(12) NOT NULL,               -- v1, v2…
  status         VARCHAR(40) NULL,                   -- ex.: Aprovado, Precisa revisão
  note           VARCHAR(255) NULL,
  document_id    BIGINT NULL,                        -- ficheiro associado à versão
  created_by     BIGINT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_dv_deliv (deliverable_id),
  CONSTRAINT fk_dv_deliv FOREIGN KEY (deliverable_id) REFERENCES deliverables(id) ON DELETE CASCADE,
  CONSTRAINT fk_dv_doc   FOREIGN KEY (document_id)    REFERENCES documents(id),
  CONSTRAINT fk_dv_user  FOREIGN KEY (created_by)     REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE documents (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id     BIGINT NOT NULL,
  project_id    BIGINT NULL,
  name          VARCHAR(255) NOT NULL,
  ext           VARCHAR(12) NULL,
  size_bytes    BIGINT NULL,
  version       VARCHAR(12) NULL,
  folder        VARCHAR(120) NULL,
  uploaded_by   BIGINT NULL,
  uploaded_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  link_type     VARCHAR(40) NULL,                    -- Entregável / Tarefa / Projeto
  link_ref_id   BIGINT NULL,
  KEY ix_doc_project (project_id),
  CONSTRAINT fk_doc_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_doc_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_doc_user    FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ FINANCEIRO

CREATE TABLE payment_milestones (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  project_id  BIGINT NOT NULL,
  name        VARCHAR(180) NOT NULL,
  pct         DECIMAL(5,2) NULL,
  amount      DECIMAL(12,2) NOT NULL,
  status      ENUM('Por atingir','Atingido','Faturado','Pago') NOT NULL DEFAULT 'Por atingir',
  trigger_type VARCHAR(80) NULL,
  KEY ix_ms_project (project_id),
  CONSTRAINT fk_ms_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_ms_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE invoices (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id     BIGINT NOT NULL,
  project_id    BIGINT NULL,
  number        VARCHAR(40) NOT NULL,                -- FT 2026/041
  milestone_id  BIGINT NULL,
  milestone_txt VARCHAR(200) NULL,
  amount        DECIMAL(12,2) NOT NULL,
  status        ENUM('Pendente','Pago','Vencido','Anulado') NOT NULL DEFAULT 'Pendente',
  issued_at     DATE NULL,
  due_at        DATE NULL,
  UNIQUE KEY uq_invoice_number (tenant_id, number),
  KEY ix_inv_project (project_id),
  CONSTRAINT fk_inv_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_inv_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_inv_ms      FOREIGN KEY (milestone_id) REFERENCES payment_milestones(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ APROVAÇÕES

CREATE TABLE approvals (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id    BIGINT NOT NULL,
  project_id   BIGINT NULL,
  title        VARCHAR(220) NOT NULL,
  type         ENUM('Entregável','Change Request','Pagamento') NOT NULL,
  requested_by BIGINT NULL,
  amount       DECIMAL(12,2) NULL,
  priority     ENUM('Alta','Média','Baixa') NOT NULL DEFAULT 'Média',
  status       ENUM('Aberta','Aprovada','Devolvida') NOT NULL DEFAULT 'Aberta',
  note         TEXT NULL,
  return_reason VARCHAR(160) NULL,                   -- motivo da devolução (dropdown do protótipo)
  decided_at   DATETIME NULL,                        -- data da decisão (KPI "Aprovadas (semana)")
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_appr_tenant (tenant_id),
  CONSTRAINT fk_appr_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_appr_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_appr_user    FOREIGN KEY (requested_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE approval_steps (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  approval_id BIGINT NOT NULL,
  user_id     BIGINT NULL,
  role_label  VARCHAR(120) NULL,
  state       ENUM('done','current','pending') NOT NULL DEFAULT 'pending',
  acted_at    DATETIME NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_step_appr FOREIGN KEY (approval_id) REFERENCES approvals(id) ON DELETE CASCADE,
  CONSTRAINT fk_step_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ RISCOS

CREATE TABLE risks (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  project_id  BIGINT NOT NULL,
  title       VARCHAR(220) NOT NULL,
  category    VARCHAR(80) NULL,
  probability TINYINT NOT NULL,                      -- 1..5
  impact      TINYINT NOT NULL,                      -- 1..5
  owner_id    BIGINT NULL,
  status      ENUM('Aberto','Monitorizado','Mitigado','Fechado') NOT NULL DEFAULT 'Aberto',
  mitigation  TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_risk_project (project_id),
  CONSTRAINT fk_risk_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_risk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_risk_owner   FOREIGN KEY (owner_id)   REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ CHAT

CREATE TABLE chat_channels (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  type        ENUM('channel','direct') NOT NULL,
  name        VARCHAR(120) NULL,                     -- canais: nome com #; diretas: NULL
  project_id  BIGINT NULL,                           -- canais ligados a projeto
  retention_months INT NULL,                         -- NULL = indefinida
  legal_hold  TINYINT(1) NOT NULL DEFAULT 0,         -- retenção suspensa
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_chan_tenant (tenant_id),
  CONSTRAINT fk_chan_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_chan_project FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chat_channel_members (
  channel_id BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  last_read_at DATETIME NULL,
  PRIMARY KEY (channel_id, user_id),
  CONSTRAINT fk_ccm_chan FOREIGN KEY (channel_id) REFERENCES chat_channels(id) ON DELETE CASCADE,
  CONSTRAINT fk_ccm_user FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chat_messages (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id     BIGINT NOT NULL,
  channel_id    BIGINT NOT NULL,
  sender_id     BIGINT NOT NULL,
  body          TEXT NULL,                           -- conteúdo (privado/cifrado)
  attachment_document_id BIGINT NULL,                -- ChatAttachment -> DocumentId
  pinned        TINYINT(1) NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at     DATETIME NULL,
  deleted_at    DATETIME NULL,                       -- soft-delete
  KEY ix_msg_channel (channel_id, created_at),
  CONSTRAINT fk_msg_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_msg_channel FOREIGN KEY (channel_id) REFERENCES chat_channels(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender  FOREIGN KEY (sender_id)  REFERENCES users(id),
  CONSTRAINT fk_msg_doc     FOREIGN KEY (attachment_document_id) REFERENCES documents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chat_reactions (
  message_id BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  emoji      VARCHAR(16) NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji),
  CONSTRAINT fk_react_msg  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_react_user FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- RGPD: trilho de auditoria de acessos a conteúdo privado (imutável)
CREATE TABLE chat_compliance_access_log (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  ref               VARCHAR(24) NOT NULL,            -- CCAL-2026-0049
  accessed_by_user_id BIGINT NOT NULL,               -- superadmin / DPO
  target_tenant_id  BIGINT NOT NULL,
  channel_id        BIGINT NULL,
  legal_basis       VARCHAR(120) NOT NULL,           -- base legal RGPD
  legal_basis_ref   VARCHAR(120) NULL,               -- ex.: Art. 15.º
  reason            TEXT NOT NULL,                   -- justificação
  scope             VARCHAR(160) NULL,
  state             ENUM('Ativo','Concluído','Revogado') NOT NULL DEFAULT 'Ativo',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ccal_ref (ref),
  KEY ix_ccal_tenant (target_tenant_id),
  CONSTRAINT fk_ccal_user   FOREIGN KEY (accessed_by_user_id) REFERENCES users(id),
  CONSTRAINT fk_ccal_tenant FOREIGN KEY (target_tenant_id)    REFERENCES tenants(id),
  CONSTRAINT fk_ccal_chan   FOREIGN KEY (channel_id)          REFERENCES chat_channels(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ SMS / NOTIFICAÇÕES

CREATE TABLE sms_messages (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  client_id   BIGINT NULL,
  project_id  BIGINT NULL,
  direction   ENUM('out','in') NOT NULL,
  phone       VARCHAR(40) NOT NULL,
  body        VARCHAR(480) NOT NULL,
  is_auto     TINYINT(1) NOT NULL DEFAULT 0,
  read_at     DATETIME NULL,                         -- inbound: badge de não-lidas na lista de threads
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_sms_tenant (tenant_id),
  CONSTRAINT fk_sms_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_sms_client  FOREIGN KEY (client_id)  REFERENCES clients(id),
  CONSTRAINT fk_sms_project FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ CALENDÁRIO

-- Eventos manuais do calendário (reuniões, visitas de obra, pessoal).
-- Prazos, entregáveis, faturação e aprovações continuam a ser derivados das tabelas respetivas.
CREATE TABLE events (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id     BIGINT NOT NULL,
  project_id    BIGINT NULL,
  category      VARCHAR(40) NOT NULL,                -- 'reuniao' | 'obra' | 'pessoal' (gerível via lookups)
  title         VARCHAR(220) NOT NULL,
  event_date    DATE NOT NULL,
  start_time    TIME NULL,
  end_time      TIME NULL,
  location      VARCHAR(200) NULL,
  notes         VARCHAR(255) NULL,
  owner_user_id BIGINT NULL,                         -- responsável/participante principal
  created_by    BIGINT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_event_tenant_date (tenant_id, event_date),
  CONSTRAINT fk_event_tenant  FOREIGN KEY (tenant_id)     REFERENCES tenants(id),
  CONSTRAINT fk_event_project FOREIGN KEY (project_id)    REFERENCES projects(id),
  CONSTRAINT fk_event_owner   FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT fk_event_creator FOREIGN KEY (created_by)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================ CONFIGURAÇÃO

-- Listas de lookup geridas por admin (Configurações Modelo: fases, prioridades, …)
CREATE TABLE lookups (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id  BIGINT NULL,                            -- NULL = global/plataforma
  kind       VARCHAR(40) NOT NULL,                   -- 'fase','prioridade','estado',…
  value      VARCHAR(120) NOT NULL,
  note       VARCHAR(200) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  KEY ix_lookup (tenant_id, kind),
  CONSTRAINT fk_lookup_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Parâmetros do modelo (Parâmetro / Valor / Observação) — ex.: limiares do semáforo
CREATE TABLE settings (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id  BIGINT NULL,
  param      VARCHAR(120) NOT NULL,
  value      VARCHAR(255) NULL,
  note       VARCHAR(255) NULL,
  UNIQUE KEY uq_setting (tenant_id, param),
  CONSTRAINT fk_setting_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Índices sugeridos (multi-tenant): a maioria das queries filtra por tenant_id.
-- Considerar índices compostos (tenant_id, status) em projects e (tenant_id, entry_date) em time_entries.
