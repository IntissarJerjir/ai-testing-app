using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace sprintHub.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = default!;

        [Required, EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string PasswordHash { get; set; } = default!;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = default!;

        public void HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<User>();
            PasswordHash = passwordHasher.HashPassword(this, password);
        }
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
