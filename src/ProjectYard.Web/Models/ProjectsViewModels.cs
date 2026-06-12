using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class ProjectsListViewModel
{
    public List<ProjectListItem> Items { get; set; } = new();
    public int Total { get; set; }
    public int EmCurso { get; set; }
    public int EmRisco { get; set; }
    public string Filter { get; set; } = "Todos";
    public string? FHealth { get; set; }
    public long? FPm { get; set; }
    public string View { get; set; } = "grid";
    public List<(long Id, string Name)> Gestores { get; set; } = new();
}

public class ProjectListItem
{
    public Project Project { get; set; } = null!;
    public int Progress { get; set; }
    public int OpenTasks { get; set; }
    public int Overdue { get; set; }
    public int Deliverables { get; set; }
    public int Approvals { get; set; }
    public List<string> Team { get; set; } = new();
}

public class TeamMemberVm
{
    public string Name { get; set; } = "";
    public string Funcao { get; set; } = "";
    public decimal? Rate { get; set; }
    public bool IsPm { get; set; }
}
