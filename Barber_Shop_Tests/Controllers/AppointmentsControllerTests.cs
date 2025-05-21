using Xunit;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Barber_Shop.Controllers;
using Barber_Shop.Services.Interfaces;
using Barber_Shop.DTOs;
using Barber_Shop.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

public class AppointmentsControllerTests
{
    [Fact]
    public async Task Get_ReturnsAppointmentsForCustomer()
    {
        var mockService = new Mock<IAppointmentService>();
        var mockUserManager = MockUserManager();

        var user = new ApplicationUser { Id = "1", UserName = "testuser" };
        var roles = new List<string> { "Customer" };

        mockUserManager.Setup(m => m.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                       .ReturnsAsync(user);
        mockUserManager.Setup(m => m.GetRolesAsync(user)).ReturnsAsync(roles);

        mockService.Setup(s => s.GetAppointmentsAsync("Customer", "1"))
                   .ReturnsAsync(new List<AppointmentDTO> {
                       new AppointmentDTO { Id = 1, BarberName = "Barber Bob" }
                   });

        var controller = new AppointmentsController(mockService.Object, mockUserManager.Object);

        var result = await controller.Get();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var appointments = Assert.IsType<List<AppointmentDTO>>(okResult.Value);
        Assert.Single(appointments);
        Assert.Equal(1, appointments.First().Id);
    }

    private Mock<UserManager<ApplicationUser>> MockUserManager()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        return new Mock<UserManager<ApplicationUser>>(
            store.Object, null, null, null, null, null, null, null, null);
    }
}
