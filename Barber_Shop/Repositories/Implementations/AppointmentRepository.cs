using Barber_Shop.Data;
using Barber_Shop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barber_Shop.Repositories.Implementations
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public AppointmentRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<Appointment>> GetAllAsync() =>
            await _context.Appointments.Include(a => a.Barber).ToListAsync();

        public async Task<IEnumerable<Appointment>> GetByBarberIdAsync(string barberId) =>
            await _context.Appointments.Include(a => a.Barber).Where(a => a.BarberId == barberId).ToListAsync();

        public async Task<bool> IsBarberBookedAsync(string barberId, DateTime dateTime)
        {
            return await _context.Appointments
                .AnyAsync(a => a.BarberId == barberId && a.AppointmentDateTime == dateTime);
        }

        public async Task<Appointment?> GetByIdAsync(int id) =>
            await _context.Appointments.Include(a => a.Barber).FirstOrDefaultAsync(a => a.Id == id);

        public async Task AddAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Appointment appointment)
        {
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

    }

}
