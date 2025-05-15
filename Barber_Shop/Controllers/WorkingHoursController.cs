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
    [Authorize(Roles = "Admin,Barber")]
    public class WorkingHoursController : ControllerBase
    {
        private readonly IWorkingHourService _service;
        private readonly UserManager<ApplicationUser> _userManager;

        public WorkingHoursController(IWorkingHourService service, UserManager<ApplicationUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);
            string? barberId = roles.Contains("Barber") ? user.Id : null;
            var hours = await _service.GetHoursAsync(barberId);
            return Ok(hours);
        }

        [HttpPost]
        public async Task<IActionResult> Set(List<WorkingHourDTO> dtos)
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);
            string? barberId = roles.Contains("Barber") ? user.Id : null;
            await _service.SetHoursAsync(dtos, barberId);
            return Ok();
        }
    }


}
