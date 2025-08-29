using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sprintHub.Data;
using sprintHub.Models;

namespace sprintHub.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] ProjectTask task)
        {
            var project = await _context.Projects.Include(p => p.Team).FirstOrDefaultAsync(p => p.Id == task.ProjectId);
            if (project == null) return BadRequest("Projet non trouvé.");
            task.CreatedAt = task.CreatedAt.ToUniversalTime(); 
            task.DueDate = task.DueDate?.ToUniversalTime();
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var createdTask = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.Assignees)
                .FirstOrDefaultAsync(t => t.Id == task.Id);

            if (createdTask == null) return BadRequest("Erreur lors de la création de la tâche.");

            var response = new
            {
                createdTask.Id,
                createdTask.Title,
                createdTask.Description,
                createdTask.Status,
                createdTask.Priority,
                createdTask.CreatedAt,
                createdTask.DueDate,
                createdTask.ProjectId,
                ProjectName = createdTask.Project?.Name,            
                Assignees = createdTask.Assignees.Select(a => new { a.Id, a.Name }),
                createdTask.Labels
            };

            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, response);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)              
                .Include(t => t.Assignees)
                .ToListAsync();

            var response = tasks.Select(task => new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.CreatedAt,
                task.DueDate,
                ProjectName = task.Project?.Name,
                Assignees = task.Assignees.Select(a => new { a.Id, a.Name }),
                task.Labels
            });

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.Assignees)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return NotFound();

            var response = new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.CreatedAt,
                task.DueDate,
                ProjectName = task.Project?.Name,
                Assignees = task.Assignees.Select(a => new { a.Id, a.Name }),
                task.Labels
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] ProjectTask updatedTask)
        {
            var task = await _context.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return NotFound("Tâche non trouvée.");

            task.Title = updatedTask.Title ?? task.Title;
            task.Description = updatedTask.Description ?? task.Description;
            task.Status = updatedTask.Status ?? task.Status;
            task.Priority = updatedTask.Priority ?? task.Priority;
            task.DueDate = updatedTask.DueDate ?? task.DueDate;
            task.Labels = updatedTask.Labels ?? task.Labels;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return NotFound();

            task.Status = request.Status; 
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class UpdateStatusRequest
        {
            public string Status { get; set; }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound("Tâche non trouvée.");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("byProject/{projectId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetTaskByProject(int projectId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.Assignees)
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            if (tasks == null || !tasks.Any()) return NotFound("Aucune tâche trouvée pour ce projet.");

            var response = tasks.Select(task => new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.CreatedAt,
                task.DueDate,
                ProjectName = task.Project?.Name,
                Assignees = task.Assignees.Select(a => new { a.Id, a.Name }),
                task.Labels
            });

            return Ok(response);
        }

    }
}
