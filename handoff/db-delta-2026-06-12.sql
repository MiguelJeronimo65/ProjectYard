-- ProjectYard — DELTA de esquema · 2026-06-12
-- Para correr UMA VEZ no DBeaver sobre a BD existente (db_aca76c_prjyard).
-- Reflete as alterações já incorporadas no db-schema-mysql.sql canónico.
-- Suporta: tags/checklist/comentários nas tasks, devolução+data de decisão nas
-- aprovações, versões de entregáveis, última atividade do cliente, não-lidas
-- de SMS e tabela de eventos do Calendário.
-- NOTA: o Chat NÃO precisa de alterações — pinned/edited_at/deleted_at/chat_reactions já existem.

SET NAMES utf8mb4;

-- ---- CRM / Clientes -------------------------------------------------------
ALTER TABLE clients
  ADD COLUMN last_activity    VARCHAR(200) NULL AFTER status,
  ADD COLUMN last_activity_at DATETIME NULL AFTER last_activity;

-- ---- Tarefas ---------------------------------------------------------------
ALTER TABLE tasks
  ADD COLUMN tags VARCHAR(200) NULL AFTER overdue;

CREATE TABLE task_checklist_items (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id    BIGINT NOT NULL,
  title      VARCHAR(220) NOT NULL,
  done       TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  KEY ix_tci_task (task_id),
  CONSTRAINT fk_tci_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- ---- Aprovações ------------------------------------------------------------
ALTER TABLE approvals
  ADD COLUMN return_reason VARCHAR(160) NULL AFTER note,
  ADD COLUMN decided_at    DATETIME NULL AFTER return_reason;

-- Backfill razoável: decisões antigas ficam com a data de criação
UPDATE approvals SET decided_at = created_at WHERE status <> 'Aberta' AND decided_at IS NULL;

-- ---- Entregáveis -----------------------------------------------------------
CREATE TABLE deliverable_versions (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  deliverable_id BIGINT NOT NULL,
  version        VARCHAR(12) NOT NULL,
  status         VARCHAR(40) NULL,
  note           VARCHAR(255) NULL,
  document_id    BIGINT NULL,
  created_by     BIGINT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_dv_deliv (deliverable_id),
  CONSTRAINT fk_dv_deliv FOREIGN KEY (deliverable_id) REFERENCES deliverables(id) ON DELETE CASCADE,
  CONSTRAINT fk_dv_doc   FOREIGN KEY (document_id)    REFERENCES documents(id),
  CONSTRAINT fk_dv_user  FOREIGN KEY (created_by)     REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Backfill: cada entregável existente ganha a sua versão atual como 1.º registo
INSERT INTO deliverable_versions (deliverable_id, version, status, created_by, created_at)
SELECT id, COALESCE(version, 'v1'), status, owner_id, NOW() FROM deliverables;

-- ---- SMS -------------------------------------------------------------------
ALTER TABLE sms_messages
  ADD COLUMN read_at DATETIME NULL AFTER is_auto;

-- Backfill: mensagens recebidas antigas ficam marcadas como lidas
UPDATE sms_messages SET read_at = created_at WHERE direction = 'in' AND read_at IS NULL;

-- ---- Calendário ------------------------------------------------------------
CREATE TABLE events (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id     BIGINT NOT NULL,
  project_id    BIGINT NULL,
  category      VARCHAR(40) NOT NULL,
  title         VARCHAR(220) NOT NULL,
  event_date    DATE NOT NULL,
  start_time    TIME NULL,
  end_time      TIME NULL,
  location      VARCHAR(200) NULL,
  notes         VARCHAR(255) NULL,
  owner_user_id BIGINT NULL,
  created_by    BIGINT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_event_tenant_date (tenant_id, event_date),
  CONSTRAINT fk_event_tenant  FOREIGN KEY (tenant_id)     REFERENCES tenants(id),
  CONSTRAINT fk_event_project FOREIGN KEY (project_id)    REFERENCES projects(id),
  CONSTRAINT fk_event_owner   FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT fk_event_creator FOREIGN KEY (created_by)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
