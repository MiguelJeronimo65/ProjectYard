using System.ComponentModel.DataAnnotations;

namespace ProjectYard.Web.Models;

public class CreateWorkspaceViewModel
{
    [Required(ErrorMessage = "Indica o nome do workspace.")]
    [Display(Name = "Nome do workspace")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Indica o slug.")]
    [RegularExpression("^[a-z0-9-]+$", ErrorMessage = "Slug só com minúsculas, números e hífen.")]
    [Display(Name = "Slug (projectyard.app/…)")]
    public string Slug { get; set; } = "";

    [Display(Name = "Plano")]
    public string Plan { get; set; } = "Starter";

    [Display(Name = "Trial de 30 dias")]
    public bool IsTrial { get; set; } = true;

    [Required(ErrorMessage = "Indica o nome do Owner.")]
    [Display(Name = "Nome do Owner")]
    public string OwnerName { get; set; } = "";

    [Required(ErrorMessage = "Indica o email do Owner.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    [Display(Name = "Email do Owner")]
    public string OwnerEmail { get; set; } = "";
}
