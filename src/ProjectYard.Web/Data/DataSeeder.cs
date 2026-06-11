using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Identity;
using E = ProjectYard.Data.Entities;

namespace ProjectYard.Web.Data;

/// <summary>
/// Seed de dados de exemplo (Fase 4), fiel a prototype/data.jsx.
/// Passwords semeadas via UserManager => HASHEADAS pelo Identity (nunca texto simples).
/// Idempotente: não faz nada se já existirem tenants.
/// </summary>
public static class DataSeeder
{
    // Passwords conhecidas para testar o login na Fase 5.
    public const string SuperadminPassword = "Miguel#2026";
    public const string DefaultPassword = "Equipa#2026";

    private static readonly DateTime Now = new(2026, 6, 8, 9, 0, 0); // "hoje" do protótipo (~8 Jun 2026)
    private static readonly string[] PtMon = { "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" };

    public static async Task SeedAsync(IServiceProvider sp)
    {
        var db = sp.GetRequiredService<AppDbContext>();
        var users = sp.GetRequiredService<UserManager<ApplicationUser>>();
        var roles = sp.GetRequiredService<RoleManager<ApplicationRole>>();

        if (await db.Tenants.AnyAsync())
        {
            Console.WriteLine("Seed: já existem tenants — nada a fazer (idempotente).");
            await PrintCounts(db);
            return;
        }

        // ---- Papéis (Identity) ----
        foreach (var r in new[] { "Superadmin", "Owner", "Administrador", "Gestor", "Membro", "Cliente" })
            if (!await roles.RoleExistsAsync(r))
                await roles.CreateAsync(new ApplicationRole { Name = r });

        // ---- Tenants (consola de plataforma) ----
        var tenants = new[]
        {
            new E.Tenant { Name = "Atelier Norte", Slug = "atelier-norte", Plan = "Pro",        Status = "Ativo",    PrimaryColor = "#6a5af9", CreatedAt = Now },
            new E.Tenant { Name = "EngForma Lda",  Slug = "engforma",      Plan = "Starter",    Status = "Trial",    PrimaryColor = "#18b07b", TrialEndsAt = new DateOnly(2026, 6, 30), CreatedAt = Now },
            new E.Tenant { Name = "Studio Praça",  Slug = "studio-praca",  Plan = "Enterprise", Status = "Ativo",    PrimaryColor = "#f5a524", CreatedAt = Now },
            new E.Tenant { Name = "Forma & Betão", Slug = "forma-betao",   Plan = "Pro",        Status = "Ativo",    PrimaryColor = "#e8526b", CreatedAt = Now },
            new E.Tenant { Name = "Risco Studio",  Slug = "risco-studio",  Plan = "Starter",    Status = "Suspenso", PrimaryColor = "#21a8c4", CreatedAt = Now },
        };
        db.Tenants.AddRange(tenants);
        await db.SaveChangesAsync();
        var tn = tenants.ToDictionary(t => t.Slug);
        long atelier = tn["atelier-norte"].Id;

        // ---- Utilizadores ----
        // Plataforma
        var miguel = await NewUser(users, "Miguel Jerónimo", "migueljeronimo@netcabo.pt", "Superadmin", 45m,
            tenantId: null, userType: "platform", role: "Superadmin", isSuper: true, isTenantAdmin: false, SuperadminPassword);
        await NewUser(users, "Helena Cruz", "helena.cruz@projectyard.pt", "Encarregada de Proteção de Dados (DPO)", null,
            tenantId: null, userType: "platform", role: "Administrador", isSuper: false, isTenantAdmin: false, DefaultPassword);

        // Equipa do Atelier Norte (7 pessoas do protótipo)
        var ana   = await NewUser(users, "Ana Moreira",  "ana.moreira@atelier-norte.pt",  "Gestora de Projeto", 32m, atelier, "tenant", "Owner",  false, true,  DefaultPassword);
        var rui   = await NewUser(users, "Rui Cardoso",  "rui.cardoso@atelier-norte.pt",  "Arquiteto Sénior",   38m, atelier, "tenant", "Gestor", false, false, DefaultPassword);
        var joana = await NewUser(users, "Joana Faria",  "joana.faria@atelier-norte.pt",  "Eng.ª Estruturas",   35m, atelier, "tenant", "Membro", false, false, DefaultPassword);
        var sofia = await NewUser(users, "Sofia Lemos",  "sofia.lemos@atelier-norte.pt",  "Arquiteta",          28m, atelier, "tenant", "Gestor", false, false, DefaultPassword);
        var tiago = await NewUser(users, "Tiago Pinto",  "tiago.pinto@atelier-norte.pt",  "Eng. MEP",           34m, atelier, "tenant", "Membro", false, false, DefaultPassword);
        var mnunes= await NewUser(users, "Miguel Nunes", "miguel.nunes@atelier-norte.pt", "Coordenador BIM",    36m, atelier, "tenant", "Membro", false, false, DefaultPassword);
        var pedro = await NewUser(users, "Pedro Dias",   "pedro.dias@atelier-norte.pt",   "Desenhador",         24m, atelier, "tenant", "Membro", false, false, DefaultPassword);

        // Owners dos restantes tenants
        var carlos = await NewUser(users, "Carlos Bento", "carlos.bento@engforma.pt",    "Gerente",        null, tn["engforma"].Id,     "tenant", "Owner", false, true, DefaultPassword);
        var rita   = await NewUser(users, "Rita Salgado", "rita.salgado@studio-praca.pt","Sócia-gerente",  null, tn["studio-praca"].Id, "tenant", "Owner", false, true, DefaultPassword);
        var joaoV  = await NewUser(users, "João Vaz",     "joao.vaz@forma-betao.pt",     "Diretor técnico",null, tn["forma-betao"].Id,  "tenant", "Owner", false, true, DefaultPassword);
        var marta  = await NewUser(users, "Marta Lima",   "marta.lima@risco-studio.pt",  "Fundadora",      null, tn["risco-studio"].Id, "tenant", "Owner", false, true, DefaultPassword);

        // Owners dos tenants
        tn["atelier-norte"].OwnerUserId = ana.Id;
        tn["engforma"].OwnerUserId = carlos.Id;
        tn["studio-praca"].OwnerUserId = rita.Id;
        tn["forma-betao"].OwnerUserId = joaoV.Id;
        tn["risco-studio"].OwnerUserId = marta.Id;
        await db.SaveChangesAsync();

        // ---- Clientes (Atelier Norte) ----
        E.Client Cli(string company, string status) { var c = new E.Client { TenantId = atelier, Company = company, Status = status, CreatedAt = Now }; db.Clients.Add(c); return c; }
        var cAtlantico = Cli("Imobiliária Atlântico", "Ativo");
        var cAlbuquerque = Cli("Família Albuquerque", "Ativo");
        var cVertice = Cli("Grupo Vértice SA", "Ativo");
        var cCamara = Cli("Câmara Municipal", "Ativo");
        var cNordeste = Cli("Nordeste Retail", "Concluído");
        var cTrans = Cli("TransIbérica", "Lead");
        await db.SaveChangesAsync();

        // ---- Projetos ----
        E.Project Prj(string code, string name, E.Client client, ApplicationUser pm, string type, string status, string health,
                      string phase, string? start, string end, decimal fees, decimal budget, decimal spent)
        {
            var p = new E.Project
            {
                TenantId = atelier, Code = code, Name = name, ClientId = client.Id, ManagerUserId = pm.Id,
                Type = type, Status = status, Health = health, Priority = "Média", PhaseCurrent = phase,
                StartPlanned = D(start), EndPlanned = D(end), Fees = fees, Budget = budget, Spent = spent, CreatedAt = Now,
            };
            db.Projects.Add(p);
            return p;
        }
        var py118 = Prj("PY-118", "Edifício Marquês — Reabilitação", cAtlantico, ana, "Reabilitação urbana", "Em curso", "green", "Projeto de Execução", "2026-01-12", "2026-09-30", 248000, 192000, 121400);
        var py117 = Prj("PY-117", "Quinta do Lago — Moradia V4", cAlbuquerque, rui, "Habitação unifamiliar", "Em curso", "amber", "Licenciamento", "2026-03-03", "2026-11-15", 86000, 64000, 38900);
        var py115 = Prj("PY-115", "Sede Nova — Grupo Vértice", cVertice, ana, "Edifício de serviços", "Em curso", "green", "Assistência Técnica", "2025-09-08", "2026-07-20", 410000, 320000, 251000);
        var py112 = Prj("PY-112", "Mercado do Bolhão — Quiosques", cCamara, sofia, "Espaço público", "Em risco", "red", "Projeto Base", "2025-10-21", "2026-02-28", 134000, 110000, 72500);
        var py109 = Prj("PY-109", "Loja Flagship — Avenida", cNordeste, rui, "Comercial / Interiores", "Concluído", "green", "Encerrado", "2025-06-02", "2025-12-18", 58000, 42000, 41200);
        var py120 = Prj("PY-120", "Parque Logístico — Maia", cTrans, ana, "Industrial", "Proposta", "amber", "Proposta enviada", null, "2027-05-02", 295000, 0, 0);
        await db.SaveChangesAsync();
        var prj = new Dictionary<string, E.Project> { ["PY-118"] = py118, ["PY-117"] = py117, ["PY-115"] = py115, ["PY-112"] = py112, ["PY-109"] = py109, ["PY-120"] = py120 };

        // ---- Membros dos projetos ----
        void Members(E.Project p, params ApplicationUser[] us) { foreach (var u in us) db.Add(new E.ProjectMember { ProjectId = p.Id, UserId = u.Id }); }
        Members(py118, ana, rui, joana, mnunes, pedro);
        Members(py117, rui, sofia, tiago);
        Members(py115, ana, joana, tiago, mnunes);
        Members(py112, sofia, pedro, rui);
        Members(py109, rui, sofia);
        Members(py120, ana, mnunes);
        await db.SaveChangesAsync();

        // ---- Fases (5 por projeto) ----
        var phaseData = new Dictionary<string, (string name, string status, int pct)[]>
        {
            ["PY-118"] = new[] { ("Estudo Prévio", "Concluída", 100), ("Projeto Base", "Concluída", 100), ("Licenciamento", "Concluída", 100), ("Projeto de Execução", "Em curso", 45), ("Assistência Técnica", "Por iniciar", 0) },
            ["PY-117"] = new[] { ("Estudo Prévio", "Concluída", 100), ("Projeto Base", "Concluída", 100), ("Licenciamento", "Em curso", 55), ("Projeto de Execução", "Por iniciar", 0), ("Assistência Técnica", "Por iniciar", 0) },
            ["PY-115"] = new[] { ("Estudo Prévio", "Concluída", 100), ("Projeto Base", "Concluída", 100), ("Licenciamento", "Concluída", 100), ("Projeto de Execução", "Concluída", 100), ("Assistência Técnica", "Em curso", 60) },
            ["PY-112"] = new[] { ("Estudo Prévio", "Concluída", 100), ("Projeto Base", "Em curso", 45), ("Licenciamento", "Por iniciar", 0), ("Projeto de Execução", "Por iniciar", 0), ("Assistência Técnica", "Por iniciar", 0) },
            ["PY-109"] = new[] { ("Estudo Prévio", "Concluída", 100), ("Projeto Base", "Concluída", 100), ("Licenciamento", "Concluída", 100), ("Projeto de Execução", "Concluída", 100), ("Assistência Técnica", "Concluída", 100) },
            ["PY-120"] = new[] { ("Estudo Prévio", "Em curso", 12), ("Projeto Base", "Por iniciar", 0), ("Licenciamento", "Por iniciar", 0), ("Projeto de Execução", "Por iniciar", 0), ("Assistência Técnica", "Por iniciar", 0) },
        };
        foreach (var (code, phases) in phaseData)
            for (int i = 0; i < phases.Length; i++)
                db.ProjectPhases.Add(new E.ProjectPhase
                {
                    TenantId = atelier, ProjectId = prj[code].Id, Code = $"{code}.{i + 1}", Name = phases[i].name,
                    Status = phases[i].status, CompletionPct = phases[i].pct, SortOrder = i,
                });
        await db.SaveChangesAsync();

        // ---- Tarefas (Kanban) ----
        void Task(string pid, string col, string title, string phase, string prio, ApplicationUser who, string due, bool overdue = false)
            => db.Tasks.Add(new E.Task { TenantId = atelier, ProjectId = prj[pid].Id, Title = title, State = col, Priority = prio, AssigneeId = who.Id, DueDate = D(due), Overdue = overdue, CreatedAt = Now });
        Task("PY-118", "todo", "Levantamento topográfico do lote", "Projeto de Execução", "Alta", pedro, "12 Jun");
        Task("PY-118", "todo", "Definir paleta de materiais — fachada", "Arquitetura", "Média", sofia, "18 Jun");
        Task("PY-118", "todo", "Pedido de elementos à Câmara", "Licenciamento", "Baixa", ana, "24 Jun");
        Task("PY-118", "doing", "Cálculo estrutural — piso 2 e 3", "Estruturas", "Alta", joana, "10 Jun");
        Task("PY-118", "doing", "Modelo BIM — coordenação MEP", "Coordenação", "Alta", mnunes, "09 Jun");
        Task("PY-118", "doing", "Mapa de acabamentos interiores", "Arquitetura", "Média", rui, "14 Jun");
        Task("PY-118", "review", "Memória descritiva — Arquitetura", "Projeto Base", "Alta", rui, "06 Jun", overdue: true);
        Task("PY-118", "review", "Pormenores construtivos — cobertura", "Execução", "Média", pedro, "07 Jun");
        Task("PY-118", "done", "Plantas de implantação", "Projeto Base", "Média", sofia, "28 Mai");
        Task("PY-118", "done", "Estudo de insolação", "Arquitetura", "Baixa", mnunes, "22 Mai");
        Task("PY-118", "done", "Reunião de arranque com cliente", "Gestão", "Média", ana, "15 Mai");
        Task("PY-117", "todo", "Compatibilização Arq./Estabilidade", "Licenciamento", "Alta", tiago, "20 Jun");
        Task("PY-117", "doing", "Pedido de elementos à Câmara", "Licenciamento", "Alta", sofia, "11 Jun", overdue: true);
        Task("PY-117", "doing", "Projeto de águas e esgotos", "Especialidades", "Média", tiago, "24 Jun");
        Task("PY-117", "done", "Levantamento do terreno", "Projeto Base", "Média", rui, "02 Jun");
        Task("PY-115", "todo", "Mapa de acabamentos — pisos técnicos", "Assistência Técnica", "Média", joana, "18 Jun");
        Task("PY-115", "doing", "Apoio a obra — fachada ventilada", "Obra", "Alta", mnunes, "12 Jun");
        Task("PY-115", "review", "Telas finais — instalações", "Assistência Técnica", "Média", tiago, "09 Jun");
        Task("PY-112", "todo", "Revisão do Projeto Base — quiosques", "Projeto Base", "Alta", pedro, "15 Jun");
        Task("PY-112", "doing", "Resposta a parecer camarário", "Licenciamento", "Alta", sofia, "07 Jun", overdue: true);
        Task("PY-112", "doing", "Plano de acessibilidades", "Projeto Base", "Média", rui, "21 Jun");
        Task("PY-112", "review", "Estimativa orçamental revista", "Gestão", "Alta", sofia, "06 Jun", overdue: true);
        Task("PY-120", "todo", "Preparar proposta técnica", "Gestão", "Alta", ana, "28 Jun");
        Task("PY-120", "doing", "Estudo de implantação preliminar", "Estudo Prévio", "Média", mnunes, "30 Jun");
        await db.SaveChangesAsync();

        // ---- Entregáveis ----
        void Deliv(string code, string name, string phase, string type, string ver, string status, string due, ApplicationUser owner, int files, bool req)
            => db.Deliverables.Add(new E.Deliverable { TenantId = atelier, ProjectId = prj[code].Id, Name = name, Phase = phase, Type = type, Version = ver, Status = status, DueDate = D(due), OwnerId = owner.Id, FilesCount = files, Required = req });
        Deliv("PY-118", "Projeto de Arquitetura — Licenciamento", "Licenciamento", "Conjunto de peças", "v3", "Aprovado", "28 Mai 2026", rui, 12, true);
        Deliv("PY-118", "Projeto de Estabilidade", "Especialidades", "Especialidade", "v2", "Em aprovação", "14 Jun 2026", joana, 8, true);
        Deliv("PY-118", "Projeto de Águas e Esgotos", "Especialidades", "Especialidade", "v1", "Em revisão", "20 Jun 2026", tiago, 5, true);
        Deliv("PY-118", "Caderno de Encargos", "Execução", "Documento", "v1", "Rascunho", "02 Jul 2026", ana, 2, false);
        Deliv("PY-118", "Mapa de Quantidades", "Execução", "Documento", "v2", "Precisa revisão", "05 Jun 2026", pedro, 3, true);
        Deliv("PY-117", "Projeto de Arquitetura — Licenciamento", "Licenciamento", "Conjunto de peças", "v2", "Em revisão", "24 Jun 2026", rui, 7, true);
        Deliv("PY-117", "Projeto de Águas e Esgotos", "Especialidades", "Especialidade", "v1", "Rascunho", "02 Jul 2026", tiago, 2, true);
        Deliv("PY-115", "Telas Finais — Arquitetura", "Assistência Técnica", "Conjunto de peças", "v1", "Em aprovação", "16 Jun 2026", joana, 9, true);
        Deliv("PY-115", "Mapa de Acabamentos", "Execução", "Documento", "v3", "Aprovado", "30 Mai 2026", tiago, 4, false);
        Deliv("PY-112", "Projeto Base — Quiosques", "Projeto Base", "Conjunto de peças", "v2", "Precisa revisão", "12 Jun 2026", pedro, 5, true);
        Deliv("PY-112", "Estimativa Orçamental", "Gestão", "Documento", "v1", "Em revisão", "19 Jun 2026", sofia, 1, false);
        Deliv("PY-120", "Proposta Técnica", "Proposta", "Documento", "v1", "Rascunho", "30 Jun 2026", ana, 1, true);
        await db.SaveChangesAsync();

        // ---- Milestones de pagamento (PY-118) ----
        void Ms(string name, decimal pct, decimal amount, string status, string trigger)
            => db.PaymentMilestones.Add(new E.PaymentMilestone { TenantId = atelier, ProjectId = py118.Id, Name = name, Pct = pct, Amount = amount, Status = status, TriggerType = trigger });
        Ms("Estudo Prévio aprovado", 15, 37200, "Faturado", "Aprovação de fase");
        Ms("Licenciamento submetido", 10, 24800, "Atingido", "Entrega de entregável");
        Ms("Projeto de Execução 100%", 40, 99200, "Por atingir", "Conclusão de fase");
        Ms("Assistência Técnica", 35, 86800, "Por atingir", "Marco temporal");
        await db.SaveChangesAsync();

        // ---- Faturas ----
        void Inv(string number, string code, string milestoneTxt, decimal amount, string status, string issued, string due)
            => db.Invoices.Add(new E.Invoice { TenantId = atelier, ProjectId = prj[code].Id, Number = number, MilestoneTxt = milestoneTxt, Amount = amount, Status = status, IssuedAt = D(issued), DueAt = D(due) });
        Inv("FT 2026/041", "PY-118", "Entrega Lic. Arquitetura", 37200, "Pago", "12 Mai 2026", "26 Mai 2026");
        Inv("FT 2026/047", "PY-115", "Projeto de Execução 50%", 61500, "Pago", "20 Mai 2026", "03 Jun 2026");
        Inv("FT 2026/052", "PY-118", "Especialidades — 1ª fase", 24800, "Pendente", "02 Jun 2026", "16 Jun 2026");
        Inv("FT 2026/039", "PY-117", "Estudo Prévio", 12900, "Vencido", "08 Abr 2026", "22 Abr 2026");
        Inv("FT 2026/055", "PY-112", "Projeto Base", 18600, "Pendente", "05 Jun 2026", "19 Jun 2026");
        await db.SaveChangesAsync();

        // ---- Riscos ----
        void Risk(string title, string code, string cat, sbyte prob, sbyte impact, ApplicationUser owner, string status, string mitig)
            => db.Risks.Add(new E.Risk { TenantId = atelier, ProjectId = prj[code].Id, Title = title, Category = cat, Probability = prob, Impact = impact, OwnerId = owner.Id, Status = status, Mitigation = mitig, CreatedAt = Now });
        Risk("Atraso na aprovação camarária", "PY-112", "Licenciamento", 4, 5, sofia, "Aberto", "Reuniões quinzenais com a autarquia e submissão antecipada de elementos.");
        Risk("Sondagens geotécnicas em falta", "PY-117", "Técnico", 3, 4, tiago, "Aberto", "Contratação de empresa de sondagens; orçamento adicional em aprovação.");
        Risk("Derrapagem de custos — estruturas", "PY-112", "Financeiro", 3, 5, ana, "Aberto", "Revisão do mapa de quantidades e renegociação com fornecedores.");
        Risk("Indisponibilidade do coordenador BIM", "PY-118", "Recursos", 2, 4, ana, "Mitigado", "Segundo modelador formado e com acesso ao modelo central.");
        Risk("Alterações de programa pelo cliente", "PY-115", "Âmbito", 3, 3, rui, "Aberto", "Registo formal de change requests com impacto em prazo e custo.");
        Risk("Conflitos de compatibilização MEP", "PY-118", "Técnico", 2, 3, mnunes, "Monitorizado", "Deteção de colisões semanal no modelo federado.");
        await db.SaveChangesAsync();

        // ---- Registo de horas (semana 8–14 Jun 2026, Ana Moreira) ----
        var ts = new (string code, string phase, string tipo, bool billable, double[] hours)[]
        {
            ("PY-118", "Projeto de Execução", "Produção",      true,  new[] { 2d, 3, 2, 3, 1, 0, 0 }),
            ("PY-118", "Coordenação BIM/MEP", "Coordenação",   true,  new[] { 1d, 1, 0.5, 1, 1, 0, 0 }),
            ("PY-115", "Assistência Técnica", "Assistência",   true,  new[] { 2d, 1, 2, 0, 1, 0, 0 }),
            ("PY-117", "Licenciamento",       "Licenciamento", true,  new[] { 0d, 1.5, 1, 1.5, 0, 0, 0 }),
            ("PY-112", "Projeto Base",        "Produção",      true,  new[] { 1d, 0, 1.5, 0, 2, 0, 0 }),
            ("",       "Gestão & reuniões",   "Reunião",       false, new[] { 1.5d, 0.5, 1, 0.5, 1, 0, 0 }),
        };
        foreach (var row in ts)
            for (int day = 0; day < 7; day++)
                if (row.hours[day] > 0)
                    db.TimeEntries.Add(new E.TimeEntry
                    {
                        TenantId = atelier, EntryDate = new DateOnly(2026, 6, 8 + day), UserId = ana.Id,
                        ProjectId = row.code == "" ? null : prj[row.code].Id, Hours = (decimal)row.hours[day],
                        Type = row.tipo, Billable = row.billable, Description = row.phase, Cost = (decimal)row.hours[day] * 32m, CreatedAt = Now,
                    });
        await db.SaveChangesAsync();

        // ---- Chat (Atelier Norte) ----
        var chMarques = new E.ChatChannel { TenantId = atelier, Type = "channel", Name = "marques-geral", ProjectId = py118.Id, RetentionMonths = 12, CreatedAt = Now };
        var chDireta = new E.ChatChannel { TenantId = atelier, Type = "direct", ProjectId = null, RetentionMonths = 12, CreatedAt = Now };
        db.ChatChannels.AddRange(chMarques, chDireta);
        await db.SaveChangesAsync();
        foreach (var u in new[] { ana, rui, joana, mnunes, pedro }) db.Add(new E.ChatChannelMember { ChannelId = chMarques.Id, UserId = u.Id });
        foreach (var u in new[] { ana, joana }) db.Add(new E.ChatChannelMember { ChannelId = chDireta.Id, UserId = u.Id });
        db.ChatMessages.AddRange(
            new E.ChatMessage { TenantId = atelier, ChannelId = chMarques.Id, SenderId = ana.Id, Body = "Bom dia — foco no Projeto de Execução esta semana.", CreatedAt = Now },
            new E.ChatMessage { TenantId = atelier, ChannelId = chMarques.Id, SenderId = joana.Id, Body = "Submeti o Projeto de Estabilidade v2 para aprovação.", CreatedAt = Now.AddHours(1) },
            new E.ChatMessage { TenantId = atelier, ChannelId = chMarques.Id, SenderId = mnunes.Id, Body = "Modelo BIM atualizado — coordenação MEP pronta para revisão.", CreatedAt = Now.AddHours(2) });
        await db.SaveChangesAsync();

        // ---- RGPD: trilho de auditoria de acessos a conteúdo (plataforma) ----
        void Ccal(string @ref, ApplicationUser by, string tenantSlug, string basis, string basisRef, string reason, string scope, string state)
            => db.ChatComplianceAccessLogs.Add(new E.ChatComplianceAccessLog { Ref = @ref, AccessedByUserId = by.Id, TargetTenantId = tn[tenantSlug].Id, LegalBasis = basis, LegalBasisRef = basisRef, Reason = reason, Scope = scope, State = state, CreatedAt = Now });
        var helena = await users.FindByEmailAsync("helena.cruz@projectyard.pt");
        Ccal("CCAL-2026-0048", helena!, "forma-betao", "Investigação de abuso ou segurança", "Interesse legítimo · Art. 6.º/1-f", "Denúncia interna de conduta imprópria. Acesso restrito ao período 1–5 Jun, conforme âmbito autorizado pela DPO.", "Conteúdo · 28 mensagens", "Concluído");
        Ccal("CCAL-2026-0041", miguel, "studio-praca", "Ordem judicial / autoridade competente", "Obrigação legal · Art. 6.º/1-c", "Pedido de preservação de prova — Proc. 142/26.4. Retenção colocada em suspensão (legal hold).", "Conteúdo · preservação integral", "Ativo");
        Ccal("CCAL-2026-0037", helena!, "atelier-norte", "Pedido do titular dos dados", "RGPD Art. 15.º — direito de acesso", "Exercício do direito de acesso pelo titular. Exportação fornecida ao próprio em formato legível.", "Conteúdo · 54 mensagens", "Concluído");
        Ccal("CCAL-2026-0033", miguel, "engforma", "Auditoria de conformidade", "Obrigação legal · Art. 6.º/1-c", "Auditoria trimestral de retenção de dados. Amostragem de conformidade sem extração de conteúdo.", "Metadados + amostra", "Concluído");
        await db.SaveChangesAsync();

        Console.WriteLine("Seed concluído:");
        await PrintCounts(db);
    }

    /// <summary>Seed adicional (aprovações + documentos), idempotente por tabela. `dotnet run -- seed-extras`.</summary>
    public static async Task SeedExtrasAsync(IServiceProvider sp)
    {
        var db = sp.GetRequiredService<AppDbContext>();
        db.BypassTenantFilter = true;
        var atelier = await db.Tenants.Where(t => t.Slug == "atelier-norte").Select(t => t.Id).FirstAsync();
        var proj = await db.Projects.Where(p => p.TenantId == atelier).ToDictionaryAsync(p => p.Code, p => p);
        var usr = await db.Users.Where(u => u.TenantId == atelier).ToDictionaryAsync(u => u.Email!, u => u);
        long? U(string email) => usr.TryGetValue(email, out var u) ? u.Id : null;
        long P(string code) => proj[code].Id;

        if (!await db.Approvals.AnyAsync())
        {
            var a1 = new E.Approval { TenantId = atelier, ProjectId = P("PY-118"), Title = "Projeto de Estabilidade v2", Type = "Entregável", RequestedBy = U("joana.faria@atelier-norte.pt"), Priority = "Alta", Status = "Aberta", CreatedAt = Now };
            var a2 = new E.Approval { TenantId = atelier, ProjectId = P("PY-117"), Title = "Orçamento adicional — sondagens", Type = "Change Request", RequestedBy = U("rui.cardoso@atelier-norte.pt"), Amount = 4200, Priority = "Média", Status = "Aberta", CreatedAt = Now };
            var a3 = new E.Approval { TenantId = atelier, ProjectId = P("PY-115"), Title = "Pagamento milestone — Execução 50%", Type = "Pagamento", RequestedBy = U("ana.moreira@atelier-norte.pt"), Amount = 61500, Priority = "Alta", Status = "Aprovada", CreatedAt = Now };
            db.Approvals.AddRange(a1, a2, a3);
            await db.SaveChangesAsync();
            db.AddRange(
                new E.ApprovalStep { ApprovalId = a1.Id, UserId = U("ana.moreira@atelier-norte.pt"), RoleLabel = "Gestora de Projeto", State = "current", SortOrder = 0 },
                new E.ApprovalStep { ApprovalId = a1.Id, RoleLabel = "Cliente", State = "pending", SortOrder = 1 },
                new E.ApprovalStep { ApprovalId = a3.Id, UserId = U("ana.moreira@atelier-norte.pt"), RoleLabel = "Gestora", State = "done", SortOrder = 0 });
            await db.SaveChangesAsync();
        }

        if (!await db.Documents.AnyAsync())
        {
            void Doc(string code, string name, string ext, string folder, string email)
                => db.Documents.Add(new E.Document { TenantId = atelier, ProjectId = P(code), Name = name, Ext = ext, Folder = folder, UploadedBy = U(email), UploadedAt = Now });
            Doc("PY-118", "PE_Arquitetura_Pranchas.pdf", "PDF", "Arquitetura", "rui.cardoso@atelier-norte.pt");
            Doc("PY-118", "Modelo_BIM_Coordenacao.ifc", "IFC", "Especialidades MEP", "miguel.nunes@atelier-norte.pt");
            Doc("PY-118", "Calculo_Estrutural_P2-P3.xlsx", "XLS", "Estruturas", "joana.faria@atelier-norte.pt");
            Doc("PY-118", "Memoria_Descritiva_Arq.docx", "DOC", "Licenciamento", "rui.cardoso@atelier-norte.pt");
            Doc("PY-117", "Levantamento_Topografico.dwg", "DWG", "Licenciamento", "pedro.dias@atelier-norte.pt");
            Doc("PY-118", "Render_Fachada_Norte.jpg", "JPG", "Arquitetura", "sofia.lemos@atelier-norte.pt");
            await db.SaveChangesAsync();
        }
        Console.WriteLine($"seed-extras: approvals={await db.Approvals.CountAsync()} documents={await db.Documents.CountAsync()}");
    }

    private static async Task PrintCounts(AppDbContext db)
    {
        Console.WriteLine($"  tenants={await db.Tenants.CountAsync()}  users={await db.Users.CountAsync()}  clients={await db.Clients.CountAsync()}");
        Console.WriteLine($"  projects={await db.Projects.CountAsync()}  phases={await db.ProjectPhases.CountAsync()}  tasks={await db.Tasks.CountAsync()}");
        Console.WriteLine($"  deliverables={await db.Deliverables.CountAsync()}  invoices={await db.Invoices.CountAsync()}  milestones={await db.PaymentMilestones.CountAsync()}  risks={await db.Risks.CountAsync()}");
        Console.WriteLine($"  time_entries={await db.TimeEntries.CountAsync()}  chat_channels={await db.ChatChannels.CountAsync()}  chat_messages={await db.ChatMessages.CountAsync()}  ccal={await db.ChatComplianceAccessLogs.CountAsync()}");
        Console.WriteLine($"  Superadmin: migueljeronimo@netcabo.pt / {SuperadminPassword}");
    }

    private static async Task<ApplicationUser> NewUser(UserManager<ApplicationUser> users, string name, string email, string funcao,
        decimal? cost, long? tenantId, string userType, string role, bool isSuper, bool isTenantAdmin, string password)
    {
        var u = new ApplicationUser
        {
            UserName = email, Email = email, EmailConfirmed = true, Name = name, Funcao = funcao, CostHour = cost,
            TenantId = tenantId, UserType = userType, Role = role, IsSuperadmin = isSuper, IsTenantAdmin = isTenantAdmin,
            Status = "Ativo", Active = true, CreatedAt = Now,
        };
        var res = await users.CreateAsync(u, password);
        if (!res.Succeeded)
            throw new Exception($"Falha a criar {name}: {string.Join("; ", res.Errors.Select(e => e.Description))}");
        await users.AddToRoleAsync(u, role);
        return u;
    }

    // "2026-09-30" | "28 Mai 2026" | "12 Jun" (assume 2026) | "—"/null
    private static DateOnly? D(string? s)
    {
        if (string.IsNullOrWhiteSpace(s) || s == "—") return null;
        var iso = Regex.Match(s, @"^(\d{4})-(\d{2})-(\d{2})$");
        if (iso.Success) return new DateOnly(int.Parse(iso.Groups[1].Value), int.Parse(iso.Groups[2].Value), int.Parse(iso.Groups[3].Value));
        var parts = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int mon = Array.IndexOf(PtMon, parts[1]) + 1;
        if (mon < 1) return null;
        int year = parts.Length >= 3 ? int.Parse(parts[2]) : 2026;
        return new DateOnly(year, mon, int.Parse(parts[0]));
    }
}
