using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sprintHub.Data;
using sprintHub.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace sprintHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestCaseController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _dbContext;

        public TestCaseController(IHttpClientFactory httpClientFactory, ApplicationDbContext dbContext)
        {
            _httpClient = httpClientFactory.CreateClient("FastAPI");
            _httpClient.BaseAddress = new Uri("http://localhost:8000"); // FastAPI server URL
            _dbContext = dbContext;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateTestCase([FromBody] GenerateTestCaseRequest request)
        {
            // Validate ProjectTaskId
            if (request.ProjectTaskId <= 0)
            {
                return BadRequest("Valid ProjectTaskId is required.");
            }

            // Fetch ProjectTask
            var projectTask = await _dbContext.Tasks
                .FirstOrDefaultAsync(pt => pt.Id == request.ProjectTaskId);
            if (projectTask == null)
            {
                return NotFound("Task not found.");
            }

            // Use ProjectTask.Description as the user story
            string story = projectTask.Description;


            // Log the story for debugging
            Console.WriteLine($"Sending to FastAPI: {story}");

            // Call FastAPI to generate test case
            var content = new StringContent(
                JsonSerializer.Serialize(new { user_story = story }),
                Encoding.UTF8,
                "application/json"
            );

            try
            {
                var response = await _httpClient.PostAsync("/generate-gherkin/", content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<TestCaseResponse>(responseContent);

                if (string.IsNullOrEmpty(result?.Gherkin))
                {
                    return StatusCode(500, "FastAPI returned an invalid response.");
                }

                // Save test case to database
                var testCase = new TestCase
                {
                    ProjectTaskId = request.ProjectTaskId,
                    Gherkin = result.TestCase
                };
                _dbContext.TestCases.Add(testCase);
                await _dbContext.SaveChangesAsync();

                return Ok(new { TestCaseId = testCase.Id, Gherkin = testCase.Gherkin });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error contacting FastAPI: {ex.Message}");
            }
            catch (JsonException ex)
            {
                return StatusCode(500, $"Error parsing FastAPI response: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating test case: {ex.Message}");
            }
        }
    }

    public class GenerateTestCaseRequest
    {
        public required int ProjectTaskId { get; set; }
    }

    public class TestCaseResponse
    {
        [JsonPropertyName("gherkin")]  
        public string Gherkin { get; set; } 
        public string TestCase => Gherkin;
    }

}