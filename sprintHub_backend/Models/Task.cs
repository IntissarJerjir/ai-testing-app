using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sprintHub.Models
{
    public class ProjectTask
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = default!;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = default!;

        [Required]
        public string Status { get; set; } = default!; 

        [Required]
        public string Priority { get; set; } = default!; 

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueDate { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; } = default!;

    

        public ICollection<User> Assignees { get; set; } = new List<User>();

        public List<string> Labels { get; set; } = new(); 
    }
}
