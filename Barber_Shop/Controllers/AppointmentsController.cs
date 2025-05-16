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
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppointmentsController(IAppointmentService service, UserManager<ApplicationUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized("Could not resolve user.");

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "Customer";

                var result = await _service.GetAppointmentsAsync(role, user.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ GET /appointments failed: " + ex.Message);
                return StatusCode(500, "Failed to retrieve appointments.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Create(AppointmentCreateDTO dto)
        {
            Console.WriteLine("📥 Create appointment hit");

            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized("Could not resolve user.");

                foreach (var prop in dto.GetType().GetProperties())
                    Console.WriteLine($"🧾 {prop.Name} = {prop.GetValue(dto)}");

                var result = await _service.CreateAppointmentAsync(dto, user.Id);
                return result ? Ok("Appointment booked!") : BadRequest("Could not create appointment.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ EXCEPTION in Create: " + ex.Message);
                return StatusCode(500, "Error creating appointment.");
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Barber")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            if (!Enum.TryParse<AppointmentStatus>(status, true, out var parsed))
                return BadRequest("Invalid status.");

            try
            {
                var result = await _service.UpdateStatusAsync(id, parsed);
                return result ? Ok("Status updated.") : NotFound("Appointment not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ UpdateStatus exception: " + ex.Message);
                return StatusCode(500, "Could not update status.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteAppointmentAsync(id);
                return result ? NoContent() : NotFound("Appointment not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Delete exception: " + ex.Message);
                return StatusCode(500, "Failed to delete appointment.");
            }
        }
    }
}
