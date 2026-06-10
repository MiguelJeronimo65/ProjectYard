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
- **Backend:** ASP.NET MVC (C#, **.NET 10** / `net10.0`), multi-tenant por `tenant_id`, EF Core 10.
- **BD:** MySQL 8 (`utf8mb4`) via **Pomelo**, **database-first** — esquema criado a correr `handoff/db-schema-mysql.sql` à mão; **sem EF Migrations** (o EF só mapeia/lê a base).
- **Cronograma:** DHTMLX Gantt (ver `handoff/`).
- **Auth:** ASP.NET Identity; `UserType` distingue plataforma vs tenant.
- **Integrações:** gateway SMS + Email (convites, aprovações por SMS), storage de documentos.

## 6. Regras estruturais a respeitar
- **Isolamento por tenant:** todas as queries filtram por `tenant_id`; o **superadmin** (`UserType=platform`)
  é a exceção e atravessa tenants **com auditoria**.
- **Criar workspace cria o Owner** (1.º utilizador). Ver `Docs/Ajuda - Workspaces e Utilizadores.html`.
- **RGPD/Chat:** por omissão só **metadados**; aceder a conteúdo exige base legal + justificação e **regista**
  em `chat_compliance_access_log` (minimização de dados).
- **Previsto vs Real** em fases/projetos: guardar ambos (datas, horas) para medir desvio/produtividade.
- **Coerência financeira:** `faturado = recebido + a_receber`; honorários por fase reconciliam com o projeto.

## 7. MVP vs. fases seguintes *(proposta — a confirmar)*
**MVP (1.ª entrega):** Auth + multi-tenant, Consola de Plataforma (criar workspace + users), Projetos +
Fases, Registo de horas, Entregáveis/Documentos, Financeiro (faturas + milestones), Dashboard.
**Fase 2:** Cronograma (DHTMLX), Aprovações, Riscos, Relatórios, CRM Clientes.
**Fase 3:** Chat + Conformidade RGPD, SMS/Email, Notificações, Trial/Billing da própria subscrição.

---
*Protótipo = referência. Spec do cliente + este README + `handoff/` = o que implementar.*
