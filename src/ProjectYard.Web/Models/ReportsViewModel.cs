namespace ProjectYard.Web.Models;

public class ReportsViewModel
{
    public List<ProjReportRow> Projects { get; set; } = new();
    public List<ColReportRow> People { get; set; } = new();
    public decimal HorasReais { get; set; }
    public decimal CustoProducao { get; set; }
    public decimal Honorarios { get; set; }
    public decimal Faturado { get; set; }
    public decimal Recebido { get; set; }
    public string Tab { get; set; } = "projeto";

    public decimal MargemPrev => Honorarios - CustoProducao;
    public int MargemPct => Honorarios > 0 ? (int)Math.Round(MargemPrev / Honorarios * 100) : 0;
}

public class ProjReportRow
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Status { get; set; } = "";
    public decimal Horas { get; set; }
    public decimal Custo { get; set; }
    public decimal Honorarios { get; set; }
    public decimal Faturado { get; set; }
    public decimal Recebido { get; set; }
}

public class ColReportRow
{
    public string Name { get; set; } = "";
    public string Funcao { get; set; } = "";
    public decimal Horas { get; set; }
    public decimal Faturaveis { get; set; }
    public decimal Custo { get; set; }
}
