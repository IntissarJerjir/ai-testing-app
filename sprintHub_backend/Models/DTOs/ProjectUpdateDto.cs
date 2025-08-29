namespace sprintHub.Models
{
    public class ProjectUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int? Progress { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public int? UserIdToAdd { get; set; } 
    }
}