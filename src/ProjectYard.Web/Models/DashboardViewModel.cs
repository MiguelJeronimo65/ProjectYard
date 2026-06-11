using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class DashboardViewModel
{
    public string TenantName { get; set; } = "";
    public List<Project> Projects { get; set; } = new();
    public int ProjetosAtivos { get; set; }
    public int EntregaveisPendentes { get; set; }
    public int FaturasAbertas { get; set; }
    public int RiscosAbertos { get; set; }
    public decimal Faturado { get; set; }
}
