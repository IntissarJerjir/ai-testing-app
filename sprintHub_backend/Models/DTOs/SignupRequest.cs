using System.ComponentModel.DataAnnotations;

namespace sprintHub.Models.DTOs
{
    public class SignupRequest
    {
   
        [Required]
        public string Name { get; set; } = default!;

        [Required, EmailAddress]
        public string Email { get; set; } = default!;

        [Required, MinLength(6)]
        public string Password { get; set; } = default!;

        [Required]
        public string Role { get; set; } = default!;
    }
}
