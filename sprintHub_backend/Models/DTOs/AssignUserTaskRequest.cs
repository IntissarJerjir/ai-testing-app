using System.ComponentModel.DataAnnotations;
public class AssignUserTaskRequest
{
    [Required]
    public int TaskId { get; set; }
    public int UserId { get; set; }
}