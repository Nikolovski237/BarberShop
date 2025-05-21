using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barber_Shop.Data;
using Barber_Shop.Models;
using Barber_Shop.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class AppointmentRepositoryTests
{
    [Fact]
    public async Task GetAllAppointmentsAsync_ReturnsAppointments()
    {
        var dbName = "TestDb_" + Guid.NewGuid();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(dbName)
            .EnableSensitiveDataLogging()
            .Options;

        // Seed data
        using (var context = new ApplicationDbContext(options))
        {
            context.Users.Add(new ApplicationUser
            {
                Id = "barber1",
                UserName = "Test Barber"
            });

            context.Appointments.Add(new Appointment
            {
                Id = 1,
                BarberId = "barber1",
                CreatedByUserId = "user1",
                CustomerName = "Jane Doe",
                CustomerPhone = "1234567890",
                AppointmentDateTime = DateTime.UtcNow,
                Status = AppointmentStatus.Pending
            });

            var saved = await context.SaveChangesAsync();
            Console.WriteLine("🔍 Saved changes: " + saved);
            var count = await context.Appointments.CountAsync();
            Console.WriteLine("📦 Count after save: " + count);
            Assert.Equal(1, count); // Confirm save worked
        }


        // Run test
        using (var context = new ApplicationDbContext(options))
        {
            var repo = new AppointmentRepository(context);
            var result = await repo.GetAllAsync();

            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
        }
    }

}
