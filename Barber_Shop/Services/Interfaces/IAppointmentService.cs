using Barber_Shop.DTOs;

namespace Barber_Shop.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsAsync(string role, string userId);
        Task<List<string>> GetAvailableSlotsAsync(string barberId, DateOnly date);
        Task<bool> CreateAppointmentAsync(AppointmentCreateDTO dto, string userId);
        Task<bool> UpdateStatusAsync(int id, AppointmentStatus status);
        Task<bool> DeleteAppointmentAsync(int id);
    }

}
