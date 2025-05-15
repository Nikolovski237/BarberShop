using Barber_Shop.Data;
using Barber_Shop.Models;
using Barber_Shop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barber_Shop.Repositories.Implementations
{
    public class WorkingHourRepository : IWorkingHourRepository
    {
        private readonly ApplicationDbContext _context;

        public WorkingHourRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkingHour>> GetByBarberIdAsync(string? barberId)
        {
            return await _context.WorkingHours
                .Where(w => w.BarberId == barberId)
                .ToListAsync();
        }

        public async Task SaveAsync(List<WorkingHour> hours)
        {
            var barberId = hours.First().BarberId;
            var existing = _context.WorkingHours.Where(w => w.BarberId == barberId);
            _context.WorkingHours.RemoveRange(existing);
            await _context.WorkingHours.AddRangeAsync(hours);
            await _context.SaveChangesAsync();
        }
    }

}
