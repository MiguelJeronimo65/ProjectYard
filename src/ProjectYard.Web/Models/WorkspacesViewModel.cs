using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class WorkspacesViewModel
{
    public List<WorkspaceCard> Cards { get; set; } = new();
    public int Total => Cards.Count;
    public int Trials => Cards.Count(c => c.Tenant.Status == "Trial");
    public int Suspensos => Cards.Count(c => c.Tenant.Status == "Suspenso");
    public int Ativos => Total - Trials - Suspensos;
    public int ProjetosTotais => Cards.Sum(c => c.Projetos);
    public decimal FaturadoTotal => Cards.Sum(c => c.Faturado);
}

public class WorkspaceCard
{
    public Tenant Tenant { get; set; } = null!;
    public int Projetos { get; set; }
    public int Membros { get; set; }
    public decimal Faturado { get; set; }
    public string OwnerName { get; set; } = "—";
}
