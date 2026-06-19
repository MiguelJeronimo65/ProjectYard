-- ProjectYard — DELTA de esquema · 2026-06-19
-- Correr UMA VEZ no DBeaver sobre a BD existente (db_aca76c_prjyard).
-- Cofre de credenciais de portais (logins de câmaras/entidades p/ licenciamento).
-- As passwords ficam CIFRADAS na app (ASP.NET Data Protection) antes de gravar — a coluna guarda o blob cifrado.

SET NAMES utf8mb4;

CREATE TABLE portal_credentials (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id    BIGINT NOT NULL,
  name         VARCHAR(160) NOT NULL,          -- ex.: "Germano Centro — HOMECEL"
  proc_number  VARCHAR(40)  NULL,              -- Nº de processo
  portal       VARCHAR(160) NULL,              -- entidade/site, ex.: "CMLisboa"
  url          VARCHAR(255) NULL,
  username     VARCHAR(160) NULL,
  password_enc TEXT NULL,                      -- password CIFRADA (não guardar em claro)
  notes        VARCHAR(500) NULL,
  project_id   BIGINT NULL,
  created_by   BIGINT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_pc_tenant (tenant_id),
  CONSTRAINT fk_pc_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants(id),
  CONSTRAINT fk_pc_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_pc_user    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
