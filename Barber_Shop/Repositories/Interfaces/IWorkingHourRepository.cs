using Barber_Shop.Models;

namespace Barber_Shop.Repositories.Interfaces
{
    public interface IWorkingHourRepository
    {
        Task<List<WorkingHour>> GetByBarberIdAsync(string? barberId);
        Task SaveAsync(List<WorkingHour> hours);
    }

}
