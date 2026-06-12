using Microsoft.AspNetCore.Mvc;

namespace neo_backend.Controllers;

[ApiController]
[Route("api")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    [HttpGet("health")]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Message = "API 運作正常，已與前端成功代理連線！",
            Platform = ".NET 10.0",
            Modules = new[] { "home", "introduction", "privacy" }
        });
    }
}
