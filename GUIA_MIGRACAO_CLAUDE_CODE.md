# Guia de Migração para Claude Code — ProjectYard

Playbook sequencial para transformar o protótipo (React/mock) no produto real
**ASP.NET MVC + EF Core + MySQL**, usando o Claude Code. Segue as fases pela ordem.
Cada fase tem um **prompt pronto a colar** e um **critério de aceitação** (✓) antes de avançar.

> Regra de ouro: **uma fase de cada vez.** Não peças "faz a app toda". Faz, revê, confirma, avança.

---

## Fase 0 — Pré-requisitos (no teu PC)
- [x] **.NET SDK 10** instalado — confirmado `10.0.300` (alvo dos projetos: `net10.0`)
- [x] **MySQL 8.0** — SmarterASP.NET (`db_aca76c_prjyard`), **8.0.41**, charset **utf8mb4** ✅ (ver secção "Base de dados")
- [x] **Claude Code** a abrir a pasta do repo (com `README_HANDOFF.md`, `GUIA_MIGRACAO_CLAUDE_CODE.md`, `handoff/`, `Docs/` e a pasta `prototype/`)
- [x] **Git** iniciado na pasta + ligado ao GitHub (`MiguelJeronimo65/ProjectYard`)

---

## Fase 1 — Orientação (sem escrever código)
**Prompt:**
> Lê `README_HANDOFF.md`, `handoff/db-schema-mysql.sql` e `Docs/ProjectYard_Master_Specification_v1.md`.
> NÃO escrevas código ainda. Resume: (1) a arquitetura que vais seguir, (2) o modelo de dados, (3) o plano de
> implementação por módulos seguindo o MVP do README. Lista as decisões que precisas que eu confirme.

**✓ Aceitação:** ele descreve a arquitetura e o plano e faz-te perguntas, sem ter tocado em ficheiros.

---

## Fase 2 — Scaffold do projeto
**Prompt:**
> Cria uma solução ASP.NET MVC (**.NET 10**, alvo `net10.0`) chamada `ProjectYard`, com EF Core e o provider **Pomelo MySQL**
> (`Pomelo.EntityFrameworkCore.MySql`, na versão compatível com **EF Core 10**). Estrutura: projeto Web (MVC) + camada de dados.
> Coloca a solução numa pasta `src/` para não misturar com `prototype/` e `Docs/`. Configura a connection string para o MySQL
> do **SmarterASP.NET** (base `db_aca76c_prjyard`) em `appsettings.Development.json` (ver secção "Base de dados"). Mostra-me a estrutura de pastas antes de continuares.

**Comandos que ele deve correr (confirma):** `dotnet new mvc` (já cria com `net10.0`), `dotnet add package Pomelo.EntityFrameworkCore.MySql` (versão p/ EF Core 10).
**✓ Aceitação:** `dotnet build` passa; a app arranca em branco.

---

## Fase 3 — Base de dados + modelos (**database-first, SEM migrations**)

> ⚠️ **Decisão firme:** as tabelas são criadas **à mão**, correndo o `.sql` diretamente. **Não se usam EF Migrations** —
> o EF Core apenas **mapeia/lê** uma base que já existe. Nunca correr `Add-Migration` / `dotnet ef migrations` / `database update`.

**Passo 1 — criar o esquema (tu, no DBeaver):**
Abre `handoff/db-schema-mysql.sql` no DBeaver, liga à base `db_aca76c_prjyard` e **executa o script** (cria as ~25 tabelas).

**Passo 2 — gerar as entidades a partir da base (prompt ao Claude Code):**
> A base `db_aca76c_prjyard` (SmarterASP.NET) **já tem as tabelas criadas** (corri o `handoff/db-schema-mysql.sql` à mão).
> Faz *scaffold* **database-first** das entidades EF Core e do `DbContext` a partir da base existente
> (`dotnet ef dbcontext scaffold "<connection>" Pomelo.EntityFrameworkCore.MySql -o Data/Entities -c AppDbContext`).
> **NÃO geres nem corras migrations** — o EF só mapeia o que já existe. Mantém os nomes das tabelas/colunas do SQL.

**Importante:** sempre que eu mudar o esquema, **edito o `.sql` e corro-o no DBeaver**; depois peço-te para **refazer o scaffold**. O `.sql` é a única fonte de verdade do esquema — nunca o EF.
**✓ Aceitação:** as ~25 tabelas existem no MySQL (criadas pelo `.sql`) e o `DbContext` gerado por scaffold compila — **sem pasta `Migrations/`**.

---

## Fase 4 — Seed (dados de exemplo)
**Prompt:**
> Usa `prototype/data.jsx` como fonte dos dados de exemplo. Gera os dados como **INSERTs SQL** (um script
> `handoff/seed.sql` que eu corro no DBeaver) **ou** um seeder em C# que corre no arranque — **sem migrations**.
> Popula: tenants, users (incl. o superadmin `Miguel Jerónimo`), clients, projects, project_phases,
> time_entries, deliverables, invoices, milestones, risks e os canais/mensagens de chat. Os valores devem bater com o protótipo.

**✓ Aceitação:** a BD tem os mesmos projetos/pessoas que vês no protótipo (sem ter sido criada nenhuma migration).

---

## Fase 5 — Fundações transversais
**Prompt:**
> Implementa: (1) **multi-tenancy** — todas as queries de domínio filtram por `tenant_id`; o superadmin
> (`user_type=platform`) atravessa tenants COM registo de auditoria. (2) **Auth** com ASP.NET Identity,
> distinguindo platform vs tenant e os papéis (Owner/Administrador/Gestor/Membro/Cliente). (3) Layout base
> (sidebar + topbar) a condizer com o protótipo (`prototype/ui.jsx`, `prototype/styles.css`).

**✓ Aceitação:** login funciona; um utilizador de tenant só vê dados do seu tenant; o superadmin vê a consola.

---

## Fase 6 — Módulos (um a um, pela ordem do MVP)
Para **cada** módulo, usa este molde de prompt:
> Implementa o módulo **<NOME>** (controller + views + ações). Abre o ecrã correspondente do protótipo
> (`prototype/screens-<x>.jsx`) e replica o **fluxo, os campos e a copy PT-PT**. Liga aos dados reais via EF.
> Não avances para outro módulo antes de eu validar este.

Ordem sugerida (MVP):
1. **Consola de Plataforma** — `prototype/screens-platform.jsx` (criar workspace + convidar users; ver `Docs/Ajuda - Workspaces e Utilizadores.html`)
2. **Projetos + Fases** — `prototype/screens-projects.jsx`
3. **Registo de horas** — `prototype/screens-timesheets.jsx`
4. **Entregáveis / Documentos** — `prototype/screens-deliverables.jsx`
5. **Financeiro** — `prototype/screens-payments.jsx`
6. **Dashboard** — `prototype/screens-dashboard.jsx`

**✓ Aceitação (por módulo):** o ecrã real faz o mesmo que o do protótipo, com dados da BD.

---

## Fase 7 — Cronograma (DHTMLX Gantt)
**Prompt:**
> Integra o **DHTMLX Gantt** no módulo Cronograma usando a pasta `handoff/`: gera os dados no formato de
> `gantt-data.js` a partir de `project_phases` + `phase_dependencies`, aplica `gantt-init.js` e `gantt.css`,
> e segue `dhtmlx-gantt.md` (escalas de zoom, baseline previsto-vs-real, marcador "hoje", caminho crítico).

**✓ Aceitação:** o Gantt mostra os projetos multi-ano com previsto vs real, como no protótipo.

---

## Fase 8 — Fases seguintes (depois do MVP)
Aprovações · Riscos · Relatórios · CRM Clientes · Chat + **Conformidade RGPD** (`prototype/screens-compliance.jsx` —
metadados + `chat_compliance_access_log`) · SMS/Email · Trial/Billing da subscrição.

---

## Como trabalhar com o Claude Code (durante todo o processo)
- **Commits pequenos** por fase/módulo (pede-lhe para fazer commit ao fim de cada um).
- **Compara sempre com o protótipo** — "abre `prototype/screens-X.jsx` e confirma que bate certo".
- Se ele divergir do modelo de dados, **manda-o reler `handoff/db-schema-mysql.sql`**.
- Mantém o **PT-PT** na UI (labels, estados, mensagens).
- Corre `dotnet build` / a app a cada fase antes de avançar.
- **SQL portável:** pede-lhe para usar **só EF Core + Pomelo** — nada de SQL específico de um fornecedor.
- **SEM migrations:** o esquema é criado correndo `handoff/db-schema-mysql.sql` à mão (DBeaver). O EF é **database-first** (scaffold) e **só lê** a base. Nunca deixes o Claude Code gerar/correr migrations.

## Base de dados — SmarterASP.NET (já configurada ✅)
A base de produção **já existe e está validada** no SmarterASP.NET — vais desenvolver **diretamente contra ela** (sem MySQL local).

**Estado confirmado:**
- Servidor: `MYSQL9001.site4now.net` · Base: `db_aca76c_prjyard`
- MySQL **8.0.41** ✅ · Charset **utf8mb4 / utf8mb4_unicode_ci** ✅
- Permissões: CREATE/ALTER/DROP/INDEX/REFERENCES… ✅ (as *migrations* do EF funcionam)

**Connection string** (em `appsettings.Development.json` — **não** comitar a password; o `.gitignore` já ignora este ficheiro):
```
Server=MYSQL9001.site4now.net;Port=3306;Database=db_aca76c_prjyard;User=aca76c_prjyard;Password=***;CharSet=utf8mb4;
```

**Notas:**
- Desenvolver contra o remoto é mais simples mas mais **lento** (cada migration/query vai à net) — normal.
- **SQL portável / database-first:** o esquema vive em `handoff/db-schema-mysql.sql` e é corrido à mão. **Sem EF Migrations.** Se mudares de alojamento, corres o `.sql` no novo servidor e refazes o *scaffold* — trocas só a connection string.
- Tabelas nascem em `utf8mb4` (o `handoff/db-schema-mysql.sql` já o força por tabela).

## Estrutura do repositório
```
ProjectYard/                 (= G:\ProjectYard, raiz do repo)
├─ README_HANDOFF.md          ← índice; começa aqui
├─ GUIA_MIGRACAO_CLAUDE_CODE.md (este ficheiro)
├─ handoff/                  ← schema MySQL + integração DHTMLX Gantt
├─ prototype/                ← protótipo React (referência visual/funcional)
│   ├─ index.html, app.jsx, data.jsx, ui.jsx, styles.css
│   ├─ screens-*.jsx, modals.jsx, login.jsx, tweaks-panel.jsx
│   └─ assets/
├─ Docs/                     ← ajuda do utilizador + spec do cliente
│   ├─ Ajuda - Workspaces e Utilizadores.html
│   └─ ProjectYard_Master_Specification_v1.md
└─ src/                      ← (vazio) a solução ASP.NET MVC vai aqui (Fase 2)
```

## Checklist final
- [ ] Multi-tenant isola dados; superadmin auditado
- [ ] Criar workspace cria o Owner; convites por email/SMS funcionam
- [ ] Previsto vs real (datas/horas) guardado em projetos e fases
- [ ] Coerência financeira (faturado = recebido + a receber; fases reconciliam com projeto)
- [ ] RGPD: só metadados por omissão; acesso a conteúdo regista no log
- [ ] Cada ecrã condiz com o protótipo (fluxo + copy)
