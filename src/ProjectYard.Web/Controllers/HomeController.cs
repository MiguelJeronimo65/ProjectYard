using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Web.Identity;
using ProjectYard.Web.Models;

namespace ProjectYard.Web.Controllers;

public class HomeController : Controller
{
    private readonly AppDbContext _db;
    public HomeController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        // Superadmin sem workspace aberto → consola; com workspace aberto (modo plataforma) vê o dashboard desse tenant.
        if (User.FindFirstValue(AppUserClaimsPrincipalFactory.IsSuperadmin) == "true" && _db.CurrentTenantId is null)
            return RedirectToAction("Index", "Workspaces");

        var projects = await _db.Projects.Include(p => p.Client).OrderBy(p => p.Code).ToListAsync();
        var invoices = await _db.Invoices.ToListAsync();
        var faturado = invoices.Sum(i => i.Amount);
        var recebido = invoices.Where(i => i.Status == "Pago").Sum(i => i.Amount);
        var pendente = invoices.Where(i => i.Status == "Pendente").Sum(i => i.Amount);
        var vencido = invoices.Where(i => i.Status == "Vencido").Sum(i => i.Amount);
        int Pct(decimal n) => faturado <= 0 ? 0 : (int)Math.Round(n / faturado * 100);

        // Badges de tendência da banda executiva (protótipo: "+3", "+18%", "1 vencida")
        var inicioMes = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        var novosProjetos = projects.Count(p => p.CreatedAt >= inicioMes);
        var anoAtual = DateTime.Today.Year;
        var fatAnoAtual = invoices.Where(i => i.IssuedAt?.Year == anoAtual).Sum(i => i.Amount);
        var fatAnoAnterior = invoices.Where(i => i.IssuedAt?.Year == anoAtual - 1).Sum(i => i.Amount);
        int? faturadoTrendPct = fatAnoAnterior > 0 ? (int)Math.Round((fatAnoAtual - fatAnoAnterior) / fatAnoAnterior * 100) : null;
        var vencidasCount = invoices.Count(i => i.Status == "Vencido");

        // Receita por mês / trimestre / ano (k€) a partir das faturas emitidas — alimenta o toggle do gráfico.
        var months = new[] { "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" };
        var dated = invoices.Where(i => i.IssuedAt != null).ToList();
        var revenue = dated
            .GroupBy(i => new { i.IssuedAt!.Value.Year, i.IssuedAt!.Value.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => (M: months[g.Key.Month - 1], V: (double)(g.Sum(x => x.Amount) / 1000m)))
            .ToList();
        var revenueTri = dated
            .GroupBy(i => new { i.IssuedAt!.Value.Year, Q = (i.IssuedAt!.Value.Month - 1) / 3 + 1 })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Q)
            .Select(g => (M: "T" + g.Key.Q, V: (double)(g.Sum(x => x.Amount) / 1000m)))
            .ToList();
        var revenueAno = dated
            .GroupBy(i => i.IssuedAt!.Value.Year)
            .OrderBy(g => g.Key)
            .Select(g => (M: g.Key.ToString(), V: (double)(g.Sum(x => x.Amount) / 1000m)))
            .ToList();

        // Projetos em foco (Em curso / Em risco) com contagens reais
        var focusProjects = projects.Where(p => p.Status == "Em curso" || p.Status == "Em risco")
            .OrderByDescending(p => p.Code).Take(4).ToList();
        var focus = new List<FocusProject>();
        foreach (var p in focusProjects)
        {
            var team = await _db.ProjectMembers
                .Where(m => m.ProjectId == p.Id).Include(m => m.User)
                .Select(m => m.User.Name).ToListAsync();
            focus.Add(new FocusProject
            {
                Project = p,
                OpenTasks = await _db.Tasks.CountAsync(t => t.ProjectId == p.Id && t.State != "done"),
                Overdue = await _db.Tasks.CountAsync(t => t.ProjectId == p.Id && t.Overdue),
                Deliverables = await _db.Deliverables.CountAsync(d => d.ProjectId == p.Id),
                Progress = (int)Math.Round(await _db.ProjectPhases.Where(ph => ph.ProjectId == p.Id).AverageAsync(ph => (double?)ph.CompletionPct) ?? 0),
                Team = team,
            });
        }

        // Carga da equipa: tarefas ativas por colaborador
        var workload = await _db.Tasks.Where(t => t.State != "done" && t.Assignee != null)
            .GroupBy(t => t.Assignee!.Name)
            .Select(g => new WorkloadRow { Name = g.Key, Tasks = g.Count() })
            .OrderByDescending(w => w.Tasks).Take(5).ToListAsync();
        var maxTasks = workload.Count == 0 ? 1 : Math.Max(1, workload.Max(w => w.Tasks));
        foreach (var w in workload) w.Pct = (int)Math.Round(w.Tasks / (double)maxTasks * 100);

        var approvals = await _db.Approvals.Include(a => a.Project).Include(a => a.RequestedByUser)
            .Where(a => a.Status == "Aberta").OrderByDescending(a => a.CreatedAt).Take(3).ToListAsync();

        var name = User.FindFirstValue(AppUserClaimsPrincipalFactory.DisplayName) ?? "";
        var vm = new DashboardViewModel
        {
            TenantName = _db.CurrentTenantId is { } tid ? (await _db.Tenants.FindAsync(tid))?.Name ?? "—" : "—",
            FirstName = name.Split(' ').FirstOrDefault() ?? name,
            ProjetosAtivos = projects.Count(p => p.Status == "Em curso" || p.Status == "Em risco"),
            AIniciar = projects.Count(p => p.Status == "Proposta"),
            EmRisco = projects.Count(p => p.Status == "Em risco"),
            FaturadoAno = faturado,
            Recebido = recebido,
            Pendente = pendente,
            Vencido = vencido,
            FaturasEmitidas = invoices.Count,
            NovosProjetos = novosProjetos,
            FaturadoTrendPct = faturadoTrendPct,
            VencidasCount = vencidasCount,
            PagoPct = Pct(recebido),
            PendentePct = Pct(pendente),
            VencidoPct = Pct(vencido),
            Revenue = revenue,
            RevenueTri = revenueTri,
            RevenueAno = revenueAno,
            Focus = focus,
            Workload = workload,
            Approvals = approvals,
        };
        return View(vm);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
        => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
