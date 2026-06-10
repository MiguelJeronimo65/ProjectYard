# ProjectYard — Handoff para desenvolvimento

Ponto de entrada para implementar o ProjectYard no stack final. **Lê isto primeiro.**

---

## 1. O que é este repositório
Um **protótipo de alta fidelidade** do ProjectYard (em `prototype/`) — plataforma SaaS **multi-tenant** (PT-PT) de gestão de
projetos para ateliers de arquitetura/engenharia. Construído em **React + Babel no browser** (sem build),
serve de **referência visual e funcional** (a "spec viva"). A app real vai para `src/`.

> ⚠️ **Não portar linha-a-linha.** O alvo é **ASP.NET MVC (.NET 10) + MySQL**. Trata o HTML/JSX como *o que* construir
> (ecrãs, fluxos, regras, copy PT-PT), não *como* construir.

## 2. Como ler o protótipo (pasta `prototype/`)
- `prototype/index.html` carrega, por ordem: `data.jsx` (dados mock + ícones) → `ui.jsx` (componentes partilhados) →
  `screens-*.jsx` (um ficheiro por módulo) → `app.jsx` (routing).
- **Cada `prototype/screens-*.jsx` = um módulo/ecrã.** O estado é mockado em memória (sem backend).
- `prototype/data.jsx` é a **fonte única dos dados** — usar como base para o *seed* da BD.

## 3. Mapa: ecrã do protótipo → módulo / entidades
| Ficheiro | Módulo | Entidades principais |
|---|---|---|
| `screens-dashboard.jsx` | Dashboard | (agregados) |
| `screens-projects.jsx` | Projetos + detalhe | Project, ProjectPhase, ProjectMember |
| `screens-tasks.jsx` | Tarefas (Kanban) | Task |
| `screens-timesheets.jsx` | Registo de horas | TimeEntry |
| `screens-gantt.jsx` / `screens-cronograma.jsx` | Cronograma / Cronograma Global | ProjectPhase, PhaseDependency |
| `screens-deliverables.jsx` | Entregáveis + Documentos | Deliverable, Document |
| `screens-payments.jsx` | Financeiro | Invoice, PaymentMilestone |
| `screens-approvals.jsx` | Aprovações | Approval, ApprovalStep |
| `screens-clients.jsx` | Clientes (CRM) | Client |
| `screens-chat.jsx` | Chat | ChatChannel, ChatMessage, ChatReaction, ChatAttachment |
| `screens-compliance.jsx` | Conformidade RGPD | ChatComplianceAccessLog |
| `screens-sms.jsx` / `screens-email.jsx` | SMS / Correio | SmsMessage |
| `screens-risks.jsx` | Riscos | Risk |
| `screens-reports.jsx` | Relatórios | (agregados de horas/custo/faturação) |
| `screens-settings.jsx` | Definições | User, Role, Lookup, NotificationPref |
| `screens-platform.jsx` | Consola de Plataforma | Tenant, User (superadmin) |

## 4. Onde está cada coisa
| Pasta / ficheiro | Conteúdo |
|---|---|
| `GUIA_MIGRACAO_CLAUDE_CODE.md` | **Playbook fase-a-fase** para o Claude Code — segue este para construir. |
| `handoff/db-schema-mysql.sql` | **Esquema MySQL** (DDL) do domínio — começa por aqui na BD. |
| `handoff/gantt-data.js`, `gantt-init.js`, `gantt.css`, `dhtmlx-gantt.md` | Integração do **Cronograma com DHTMLX Gantt** (dados, config, skin, guia). |
| `Docs/Ajuda - Workspaces e Utilizadores.html` | Documentação do **utilizador final** (comportamento esperado). |
| `Docs/ProjectYard_Master_Specification_v1.md` | Spec original do cliente (entidades, módulos, roadmap). |
| `prototype/data.jsx` | Dados mock = base para o *seed*. |
| `prototype/screens-*.jsx` | Um ecrã/módulo por ficheiro (referência de fluxo + copy). |

## 5. Stack alvo (sugerido)
- **Backend:** ASP.NET MVC (C#, **.NET 10** / `net10.0`), multi-tenant por `tenant_id`.
- **ORM:** EF Core **9.x** + **Pomelo** `9.0.0` (Pomelo/EF Core 10 ainda não publicados — corre no runtime .NET 10). Bump quando saírem as versões 10.
- **BD:** MySQL 8 (`utf8mb4`) via Pomelo, **database-first** — esquema criado a correr `handoff/db-schema-mysql.sql` à mão; **sem EF Migrations** (o EF só mapeia/lê a base).
- **Cronograma:** DHTMLX Gantt (ver `handoff/`).
- **Auth:** **ASP.NET Identity** com a tabela **`users` como store** (`ToTable("users")`, `ApplicationUser : IdentityUser<long>`, chave **BIGINT**). Tabelas de papéis (`roles`, `user_roles`, …) criadas **por SQL à mão**, sem migrations. `user_type` distingue plataforma vs tenant; autorização por **papéis do Identity**.
- **Integrações:** gateway SMS + Email (convites, aprovações por SMS), storage de documentos.

## 6. Regras estruturais a respeitar
- **Isolamento por tenant:** todas as queries filtram por `tenant_id`; o **superadmin** (`UserType=platform`)
  é a exceção e atravessa tenants **com auditoria**.
- **Criar workspace cria o Owner** (1.º utilizador). Ver `Docs/Ajuda - Workspaces e Utilizadores.html`.
- **RGPD/Chat:** por omissão só **metadados**; aceder a conteúdo exige base legal + justificação e **regista**
  em `chat_compliance_access_log` (minimização de dados).
- **Previsto vs Real** em fases/projetos: guardar ambos (datas, horas) para medir desvio/produtividade.
- **Coerência financeira:** `faturado = recebido + a_receber`; honorários por fase reconciliam com o projeto.

## 7. Decisões de arquitetura (fechadas)
> Confirmadas com o Miguel (jun. 2026). **Em caso de conflito entre documentos, estas mandam.**

1. **Fonte de verdade.** `GUIA_MIGRACAO_CLAUDE_CODE.md` + este `README_HANDOFF.md` + `handoff/db-schema-mysql.sql` mandam. A `Docs/ProjectYard_Master_Specification_v1.md` é **visão/roadmap** — não implementar à letra (ignorar: Clean Architecture de 6 projetos, Finbuckle, 2 BDs, Materio, Hangfire, ~80 tabelas e migrations dela).
2. **Autenticação — ASP.NET Identity com `users` como store.** `ApplicationUser : IdentityUser<long>` mapeado a `users` (`ToTable("users")`, chave **BIGINT**) — uma só tabela de utilizadores, FKs intactas. As tabelas de papéis (`roles`, `user_roles`, `role_claims`, `user_claims`, `user_logins`, `user_tokens`, em snake_case) são criadas **por SQL à mão** — **sem migrations**. Autorização por **papéis do Identity** (`[Authorize(Roles=…)]` via `user_roles`).
3. **Base de dados — database-first, sem EF Migrations.** Esquema em `handoff/db-schema-mysql.sql` (única fonte de verdade), corrido à mão no DBeaver. O EF só **mapeia/lê** (scaffold). Nunca `Add-Migration`/`database update`.
4. **UI — replicar o protótipo.** Razor fiel a `prototype/styles.css` + `prototype/ui.jsx`. **Sem** template Materio.
5. **Estrutura da solução — 2 projetos.** `ProjectYard.Web` (MVC) + `ProjectYard.Data` (camada de dados) em `src/`. **Não** Clean Architecture de 6 projetos.
6. **Stack EF — 9.x sobre `net10.0`.** `Pomelo.EntityFrameworkCore.MySql 9.0.0` + EF Core 9 (Pomelo/EF Core 10 ainda não publicados; correm no runtime .NET 10). Bump quando saírem as versões 10.

## 8. MVP vs. fases seguintes *(proposta — a confirmar)*
**MVP (1.ª entrega):** Auth + multi-tenant, Consola de Plataforma (criar workspace + users), Projetos +
Fases, Registo de horas, Entregáveis/Documentos, Financeiro (faturas + milestones), Dashboard.
**Fase 2:** Cronograma (DHTMLX), Aprovações, Riscos, Relatórios, CRM Clientes.
**Fase 3:** Chat + Conformidade RGPD, SMS/Email, Notificações, Trial/Billing da própria subscrição.

---
*Protótipo = referência. Spec do cliente + este README + `handoff/` = o que implementar.*
