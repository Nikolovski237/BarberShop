using Barber_Shop.DTOs;
using Barber_Shop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Barber_Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(UserManager<ApplicationUser> userManager, IConfiguration config, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _config = config;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);
            await _userManager.AddToRoleAsync(user, "Customer");
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials");

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
            Console.WriteLine("🔐 Signing JWT with: " + _config["JwtSettings:Key"]);
            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            Console.WriteLine("📥 [DEBUG] /api/account/me called");

            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine("🧾 Token user ID: " + id);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                Console.WriteLine("❌ FindByIdAsync returned null for ID: " + id);
                return Unauthorized("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Roles = roles
            });
        }


        [HttpGet("me-raw")]
        [Authorize]
        public IActionResult MeRaw()
        {
            return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _userManager.Users.Select(u => new
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FullName
            }).ToList();

            return Ok(users);
        }

        [HttpPost("promote")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PromoteUser(ChangeRoleDTO dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null) return NotFound("User not found.");

            var validRoles = new[] { "Admin", "Barber", "Customer" };
            if (!validRoles.Contains(dto.Role)) return BadRequest("Invalid role.");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok($"User promoted to {dto.Role}.");
        }
    }
}
