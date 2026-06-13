-- ProjectYard — DELTA de esquema · 2026-06-13
-- Correr UMA VEZ no DBeaver sobre a BD existente (db_aca76c_prjyard).
-- Objetivo (pedido do Florindo): estado "Cancelado" distinto de "Suspenso",
-- e registo de observação (opcional) + data em cada mudança de estado do projeto.
-- Independente do db-delta-2026-06-12.sql (esse cobre tasks/entregáveis/eventos).

SET NAMES utf8mb4;

-- 1) Acrescentar "Cancelado" ao enum de estado do projeto (mantém os restantes e o default).
ALTER TABLE projects
  MODIFY COLUMN status
  ENUM('Proposta','Em curso','Em risco','Concluído','Suspenso','Cancelado')
  NOT NULL DEFAULT 'Em curso';

-- 2) Histórico de mudanças de estado (cada mudança = 1 linha; nota não obrigatória).
CREATE TABLE project_status_history (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id  BIGINT NOT NULL,
  status      VARCHAR(20) NOT NULL,
  note        VARCHAR(500) NULL,
  changed_by  BIGINT NULL,
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_psh_project (project_id, changed_at),
  CONSTRAINT fk_psh_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_psh_user    FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Backfill: registar o estado atual de cada projeto como 1.ª entrada do histórico.
INSERT INTO project_status_history (project_id, status, note, changed_by, changed_at)
SELECT id, status, NULL, manager_user_id, COALESCE(created_at, NOW()) FROM projects;
