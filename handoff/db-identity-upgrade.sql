-- ProjectYard — Upgrade incremental: ASP.NET Identity sobre a tabela `users` existente
-- Correr UMA vez no DBeaver, na base db_aca76c_prjyard, DEPOIS de já teres corrido db-schema-mysql.sql.
-- Reutiliza as colunas já existentes (password_hash, failed_attempts, locked_until) e acrescenta
-- as restantes que o Identity exige + cria as tabelas de papéis/claims/logins/tokens.
-- Idempotência: este script assume que ainda NÃO foi aplicado. Se já o correste, não voltes a correr.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---- 1) Colunas Identity em falta na tabela users ----
ALTER TABLE users
  ADD COLUMN user_name              VARCHAR(256) NULL              AFTER name,
  ADD COLUMN normalized_user_name   VARCHAR(256) NULL              AFTER user_name,
  ADD COLUMN normalized_email       VARCHAR(190) NULL              AFTER email,
  ADD COLUMN email_confirmed        TINYINT(1) NOT NULL DEFAULT 0  AFTER normalized_email,
  ADD COLUMN security_stamp         VARCHAR(255) NULL              AFTER password_hash,
  ADD COLUMN concurrency_stamp      VARCHAR(255) NULL              AFTER security_stamp,
  ADD COLUMN phone_number_confirmed TINYINT(1) NOT NULL DEFAULT 0  AFTER phone,
  ADD COLUMN two_factor_enabled     TINYINT(1) NOT NULL DEFAULT 0  AFTER phone_number_confirmed,
  ADD COLUMN lockout_enabled        TINYINT(1) NOT NULL DEFAULT 1  AFTER failed_attempts,
  MODIFY COLUMN locked_until        DATETIME(6) NULL,                          -- LockoutEnd (precisão de frações)
  ADD INDEX ix_user_norm_username (normalized_user_name),
  ADD INDEX ix_user_norm_email (normalized_email);

-- ---- 2) Tabelas de papéis / claims / logins / tokens do Identity ----
CREATE TABLE roles (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(256) NULL,
  normalized_name   VARCHAR(256) NULL,
  concurrency_stamp VARCHAR(255) NULL,
  UNIQUE KEY uq_role_normalized_name (normalized_name)
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

SET FOREIGN_KEY_CHECKS = 1;

-- Próximo passo (no seed / Fase 4): inserir os 6 papéis em `roles`
-- (Superadmin, Owner, Administrador, Gestor, Membro, Cliente) e ligar utilizadores via `user_roles`.
