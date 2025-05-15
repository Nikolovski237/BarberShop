using AutoMapper;
using Barber_Shop.DTOs;
using Barber_Shop.Models;
using Barber_Shop.Repositories.Interfaces;
using Barber_Shop.Services.Interfaces;


namespace Barber_Shop.Services.Implementations
{
    public class WorkingHourService : IWorkingHourService
    {
        private readonly IWorkingHourRepository _repo;
        private readonly IMapper _mapper;

        public WorkingHourService(IWorkingHourRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<WorkingHourDTO>> GetHoursAsync(string? barberId)
        {
            var data = await _repo.GetByBarberIdAsync(barberId);
            return _mapper.Map<List<WorkingHourDTO>>(data);
        }

        public async Task<bool> SetHoursAsync(List<WorkingHourDTO> dtos, string? barberId)
        {
            var hours = _mapper.Map<List<WorkingHour>>(dtos);
            foreach (var h in hours)
            {
                h.BarberId = barberId;
            }
            await _repo.SaveAsync(hours);
            return true;
        }
    }

}
