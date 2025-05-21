using Barber_Shop.DTOs;

namespace Barber_Shop.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsAsync(string role, string userId);
        Task<List<string>> GetAvailableSlotsAsync(string barberId, DateOnly date);
        Task<AppointmentDTO> CreateAppointmentAsync(AppointmentCreateDTO dto, string userId);
        Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
        Task<bool> UpdateStatusAsync(int id, AppointmentStatus status);
        Task<bool> DeleteAppointmentAsync(int id);
    }

}
