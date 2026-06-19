using System.ComponentModel.DataAnnotations;

namespace ProjectYard.Web.Models;

public class LoginViewModel
{
    [Required(ErrorMessage = "Indica o email.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    [Display(Name = "Email")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Indica a palavra-passe.")]
    [DataType(DataType.Password)]
    [Display(Name = "Palavra-passe")]
    public string Password { get; set; } = "";

    [Display(Name = "Manter sessão iniciada")]
    public bool RememberMe { get; set; } = true;

    public string? ReturnUrl { get; set; }
}
