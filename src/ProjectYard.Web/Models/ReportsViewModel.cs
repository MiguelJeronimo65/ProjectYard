namespace ProjectYard.Web.Models;

public class ReportsViewModel
{
    public Dictionary<string, int> ProjectsByStatus { get; set; } = new();
    public Dictionary<string, int> DeliverablesByStatus { get; set; } = new();
    public List<HoursRow> HoursByProject { get; set; } = new();
    public decimal Pago { get; set; }
    public decimal Pendente { get; set; }
    public decimal Vencido { get; set; }
    public decimal Honorarios { get; set; }
    public decimal HorasTotais { get; set; }
}

public class HoursRow
{
    public string Code { get; set; } = "";
    public decimal Hours { get; set; }
    public decimal Cost { get; set; }
}
