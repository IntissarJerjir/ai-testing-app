using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using sprintHub.Data;
using sprintHub.Models;
using System.Linq;
using System.Text.Json;
using Newtonsoft.Json;  
namespace sprintHub.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project project)
        {
            project.StartDate = project.StartDate.ToUniversalTime();
            if (project.EndDate.HasValue)
            {
                project.EndDate = project.EndDate.Value.ToUniversalTime();
            }
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Team)
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            var json = JsonConvert.SerializeObject(project, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetAllProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Team)
                .Include(p => p.Tasks)
                .ToListAsync();

            var json = JsonConvert.SerializeObject(projects, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Content(json, "application/json"); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectUpdateDto projectUpdate)
        {
            var project = await _context.Projects
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            // Update basic project properties
            project.Name = projectUpdate.Name ?? project.Name;
            project.Description = projectUpdate.Description ?? project.Description;
            project.Status = projectUpdate.Status ?? project.Status;
            project.Progress = projectUpdate.Progress ?? project.Progress;

            if (projectUpdate.StartDate.HasValue)
            {
                project.StartDate = projectUpdate.StartDate.Value.ToUniversalTime();
            }

            if (projectUpdate.EndDate.HasValue)
            {
                project.EndDate = projectUpdate.EndDate.Value.ToUniversalTime();
            }

            if (projectUpdate.UserIdToAdd.HasValue)
            {
                var user = await _context.Users.FindAsync(projectUpdate.UserIdToAdd.Value);
                if (user == null)
                {
                    return NotFound("User to add not found.");
                }

                if (!project.Team.Contains(user))
                {
                    project.Team.Add(user);
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }





        [HttpPost("{projectId}/add-member/{userId}")]
        public async Task<IActionResult> AddMember(int projectId, int userId)
        {
            var project = await _context.Projects.Include(p => p.Team).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
                return NotFound("Projet non trouvé.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Utilisateur non trouvé.");

            if (!project.Team.Contains(user))
            {
                project.Team.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound("Projet non trouvé.");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();  
        }
    }
}
