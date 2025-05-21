using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Barber_Shop.Data;
using Barber_Shop.DTOs;
using Barber_Shop.Models;
using Barber_Shop.Repositories.Interfaces;
using Barber_Shop.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Barber_Shop.Tests.Services
{
    public class AppointmentServiceTests
    {
        [Fact]
        public async Task GetAppointmentsAsync_AsAdmin_ReturnsMappedAppointments()
        {
            var mockRepo = new Mock<IAppointmentRepository>();
            var mockMapper = new Mock<IMapper>();
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("BarberShopTestDb_Admin")
                .Options;

            var dbContext = new ApplicationDbContext(options);


            var fakeAppointments = new List<Appointment>
            {
                new Appointment { Id = 1, CreatedByUserId = "admin123", BarberId = "b1" }
            };

            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(fakeAppointments);

            mockMapper.Setup(m => m.Map<IEnumerable<AppointmentDTO>>(It.IsAny<IEnumerable<Appointment>>()))
                      .Returns(new List<AppointmentDTO>
                      {
                          new AppointmentDTO { Id = 1 }
                      });


            var service = new AppointmentService(mockRepo.Object, mockMapper.Object, dbContext);


            var result = await service.GetAppointmentsAsync("Admin", "admin123");

            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
        }
    }
}
