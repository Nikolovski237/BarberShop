using Barber_Shop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Barber_Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersByRole([FromQuery] string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return BadRequest("Role is required");

            var users = _userManager.Users.ToList();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains(role, StringComparer.OrdinalIgnoreCase))
                {
                    result.Add(new
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email
                    });
                }
            }

            return Ok(result);
        }
    }
}
