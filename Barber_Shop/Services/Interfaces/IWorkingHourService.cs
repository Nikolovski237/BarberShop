using Barber_Shop.DTOs;

namespace Barber_Shop.Services.Interfaces
{
    public interface IWorkingHourService
    {
        Task<List<WorkingHourDTO>> GetHoursAsync(string? barberId);
        Task<bool> SetHoursAsync(List<WorkingHourDTO> dtos, string? barberId);
    }

}
