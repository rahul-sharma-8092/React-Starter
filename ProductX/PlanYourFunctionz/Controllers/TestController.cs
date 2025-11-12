using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using eClaims.Common;
using System.Globalization;

namespace eClaims.Controllers
{
    [ApiController]
    [Route("")]
    public class TestController : ControllerBase
    {

        private static readonly DateTime serverStartTimeUtc = DateTime.UtcNow;

        [HttpGet("/")]
        public IActionResult GetHealth()
        {
            TimeZoneInfo indiaTimeZone;
            try
            {
                indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
            }

            DateTime indiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone);

            // Calculate uptime
            TimeSpan uptime = DateTime.UtcNow - serverStartTimeUtc;
            string formattedUptime = $"{uptime.Days}d {uptime.Hours:D2}h {uptime.Minutes:D2}m {uptime.Seconds:D2}s";

            var response = new
            {
                service = "Rahul Web API",
                status = "OK",
                message = "Server is running smoothly.",
                timestamp = indiaTime.ToString("dd/MM/yyyy hh:mm:ss tt", CultureInfo.InvariantCulture),
                timezone = indiaTimeZone.Id,
                uptime = formattedUptime
            };

            return Ok(response);
        }

        [HttpGet("ping")]
        public IActionResult PublicPing() => Ok("Public endpoint is accessible.");

        [Authorize]
        [HttpGet("auth/ping")]
        public IActionResult AuthPing() => Ok("Authenticated endpoint is accessible.");

        [HttpGet("user/ping")]
        [Authorize(Policy = AppAuthorization.Policies.RequireUser)]
        public IActionResult UserPing() => Ok("User endpoint is accessible.");

        [HttpGet("admin/ping")]
        [Authorize(Policy = AppAuthorization.Policies.RequireAdmin)]
        public IActionResult AdminPing() => Ok("Admin endpoint is accessible.");
    }
}
