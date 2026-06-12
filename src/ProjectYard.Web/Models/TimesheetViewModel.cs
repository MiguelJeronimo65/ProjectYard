namespace ProjectYard.Web.Models;

public class TimesheetViewModel
{
    public DateOnly Monday { get; set; }
    public DateOnly[] Days { get; set; } = Array.Empty<DateOnly>();
    public int TodayIdx { get; set; } = -1;
    public bool IsCurrentWeek { get; set; }
    public List<TimesheetRow> Rows { get; set; } = new();
    public decimal Rate { get; set; }
    public string UserFirstName { get; set; } = "";
    public string View { get; set; } = "grid";
    public List<(long Id, string Code, string Name)> Projects { get; set; } = new();

    public decimal Logged => Rows.Sum(r => r.Hours.Sum());
    public decimal Billable => Rows.Where(r => r.IsBillable).Sum(r => r.Hours.Sum());
    public decimal Cost => Logged * Rate;
    public int Util => (int)Math.Round(Logged / 40m * 100);
    public int DaysFilled => Enumerable.Range(0, 5).Count(d => Rows.Sum(r => r.Hours[d]) > 0);
    public decimal DayTotal(int d) => Rows.Sum(r => r.Hours[d]);
}

public class TimesheetRow
{
    public long? ProjectId { get; set; }
    public string ProjectName { get; set; } = "Interno";
    public string ProjectCode { get; set; } = "—";
    public string Phase { get; set; } = "";
    public string Tipo { get; set; } = "";
    public bool IsBillable { get; set; } = true;
    public decimal[] Hours { get; set; } = new decimal[7];
}
