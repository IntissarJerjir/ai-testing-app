using System.ComponentModel.DataAnnotations;

public class SigninRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = default!;

    [Required]
    public string Password { get; set; } = default!;
    public bool RememberMe { get; set; }
}
