using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class ProjectDetailsViewModel
{
    public Project Project { get; set; } = null!;
    public List<ProjectPhase> Phases { get; set; } = new();
    public List<ProjectYard.Data.Entities.Task> Tasks { get; set; } = new();
    public List<Deliverable> Deliverables { get; set; } = new();
    public List<PaymentMilestone> Milestones { get; set; } = new();
    public List<Risk> Risks { get; set; } = new();
    public List<Invoice> Invoices { get; set; } = new();
    public List<TeamMemberVm> Team { get; set; } = new();
    public int Progress { get; set; }
}
