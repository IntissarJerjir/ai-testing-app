using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sprintHub.Models
{
    public class TestCase


    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectTaskId { get; set; }

        [ForeignKey("ProjectTaskId")]
        public ProjectTask ProjectTask { get; set; } = default!;

        [Required]
        public string Gherkin { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}