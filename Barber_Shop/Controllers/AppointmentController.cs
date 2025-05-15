using Barber_Shop.DTOs;
using Barber_Shop.Models;
using Barber_Shop.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Barber_Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppointmentController(IAppointmentService service, UserManager<ApplicationUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? "Customer";
            var result = await _service.GetAppointmentsAsync(role, user.Id);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(AppointmentCreateDTO dto)
        {
            var user = await _userManager.GetUserAsync(User);
            var result = await _service.CreateAppointmentAsync(dto, user.Id);
            return result ? Ok() : BadRequest();
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Barber")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            if (!Enum.TryParse(status, out AppointmentStatus parsed))
                return BadRequest("Invalid status.");
            var result = await _service.UpdateStatusAsync(id, parsed);
            return result ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAppointmentAsync(id);
            return result ? NoContent() : NotFound();
        }
    }

}
