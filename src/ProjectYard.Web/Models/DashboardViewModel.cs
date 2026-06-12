using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class DashboardViewModel
{
    public string TenantName { get; set; } = "";
    public string FirstName { get; set; } = "";

    // KPIs (band executiva)
    public int ProjetosAtivos { get; set; }
    public int AIniciar { get; set; }
    public int EmRisco { get; set; }
    public decimal FaturadoAno { get; set; }
    public decimal Recebido { get; set; }
    public decimal Pendente { get; set; }
    public decimal Vencido { get; set; }
    public decimal AReceber => Pendente + Vencido;
    public int FaturasEmitidas { get; set; }
    public int PagoPct { get; set; }
    public int PendentePct { get; set; }
    public int VencidoPct { get; set; }

    public List<(string M, double V)> Revenue { get; set; } = new();
    public List<(string M, double V)> RevenueTri { get; set; } = new();
    public List<(string M, double V)> RevenueAno { get; set; } = new();
    public List<FocusProject> Focus { get; set; } = new();
    public List<WorkloadRow> Workload { get; set; } = new();
    public List<Approval> Approvals { get; set; } = new();
}

public class FocusProject
{
    public Project Project { get; set; } = null!;
    public int OpenTasks { get; set; }
    public int Overdue { get; set; }
    public int Deliverables { get; set; }
    public int Progress { get; set; }
    public List<string> Team { get; set; } = new();
}

public class WorkloadRow
{
    public string Name { get; set; } = "";
    public int Tasks { get; set; }
    public int Pct { get; set; }
}
