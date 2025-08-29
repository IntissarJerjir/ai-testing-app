using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using sprintHub.Data;
using sprintHub.Models;
using sprintHub.Models.DTOs;
using System.Threading.Tasks;
using sprintHub.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;


namespace sprintHub.Controllers

{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest(new { message = "Email already in use." });

            var user = new User
            {

                Name = model.Name,
                Email = model.Email,
                Role = model.Role
            };

            user.HashPassword(model.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("signout")]
        [Authorize]
        public IActionResult Signout([FromServices] JwtTokenService jwtTokenService)
        {
            try
            {
                // Get token from Authorization header
                var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader))
                {
                    return BadRequest(new { message = "No authorization token provided." });
                }

                var token = authHeader.Replace("Bearer ", "");

                // Invalidate the token
                jwtTokenService.InvalidateToken(token);

                return Ok(new
                {
                    success = true,
                    message = "Logout successful. Token has been invalidated."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred during logout.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest model)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.Name = model.Name ?? user.Name;
            user.Email = model.Email ?? user.Email;
            user.Role = model.Role;

            if (!string.IsNullOrEmpty(model.Password))
                user.HashPassword(model.Password);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully!" });
        }

        [HttpDelete("delete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users

                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }
              
                if (user.Projects.Any() || user.Tasks.Any())
                {
                    return BadRequest(new
                    {
                        message = "Cannot delete user with associated projects or tasks.",
                        projectsCount = user.Projects.Count,
                        tasksCount = user.Tasks.Count
                    });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting user.",
                    error = ex.Message
                });
            }
        }
        [HttpPost("signin")]
        public async Task<IActionResult> Signin([FromBody] SigninRequest model, [FromServices] JwtTokenService jwtTokenService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid credentials" });

            bool rememberMe = model.RememberMe;

            var token = jwtTokenService.GenerateToken(user, rememberMe);

            return Ok(new { token, user = new { user.Id, user.Name, user.Email, user.Role } });
        }

        [HttpGet("users/{id}/projects")]
        public async Task<IActionResult> GetUserProjects(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Projects)
                    .ThenInclude(p => p.Tasks)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null) return NotFound();
                var projects = user.Projects.Select(p => new {
                    p.Id,
                    p.Name,
                    TaskCount = p.Tasks.Count,
                    MemberCount = p.Team.Count
                }).ToList();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("users/{id}/tasks")]
        public async Task<IActionResult> GetUserTasks(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tasks)
                    .ThenInclude(t => t.Assignees) 
                    .Include(u => u.Tasks)
                    .ThenInclude(t => t.Project) 
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null) return NotFound();

                var tasks = user.Tasks.Select(t => new {
                    t.Id,
                    t.Title,
                    ProjectName = t.Project.Name,
                    Assignees = t.Assignees.Select(a => a.Name)
                }).ToList();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("tasks/assign")]
        public async Task<IActionResult> AssignUserTask([FromBody] AssignUserTaskRequest request)
        {
            try
            {
                var task = await _context.Tasks
                    .Include(t => t.Assignees)
                    .FirstOrDefaultAsync(t => t.Id == request.TaskId);

                if (task == null)
                    return NotFound(new { message = "Task not found." });

                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                    return NotFound(new { message = "User not found." });

                if (task.Assignees.Any(u => u.Id == request.UserId))
                    return BadRequest(new { message = "User is already assigned to this task." });

                task.Assignees.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "User assigned to task successfully!",
                    taskId = task.Id,
                    userId = user.Id,
                    userName = user.Name
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
    }

}
