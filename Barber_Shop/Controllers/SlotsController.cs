using Barber_Shop.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Barber_Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SlotsController : ControllerBase
    {
        private readonly IAppointmentService _service;

        public SlotsController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSlots([FromQuery] string barberId, [FromQuery] DateTime date)
        {
            if (date.Date < DateTime.UtcNow.Date)
                return BadRequest("Cannot book in the past.");

            var result = await _service.GetAvailableSlotsAsync(barberId, DateOnly.FromDateTime(date));
            return Ok(result);
        }
    }

}
