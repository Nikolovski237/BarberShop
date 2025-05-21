using AutoMapper;
using Barber_Shop.Data;
using Barber_Shop.DTOs;
using Barber_Shop.Repositories.Implementations;
using Barber_Shop.Repositories.Interfaces;
using Barber_Shop.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barber_Shop.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAppointmentRepository _repo;

        public AppointmentService(
            IAppointmentRepository repo,
            IMapper mapper,
            ApplicationDbContext context)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }
        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsAsync(string role, string userId)
        {
            var data = role switch
            {
                "Admin" => await _repo.GetAllAsync(),
                "Barber" => await _repo.GetByBarberIdAsync(userId),
                _ => (await _repo.GetAllAsync()).Where(a => a.CreatedByUserId == userId)
            };

            return _mapper.Map<IEnumerable<AppointmentDTO>>(data);
        }

        public async Task<AppointmentDTO> CreateAppointmentAsync(AppointmentCreateDTO dto, string userId)
        {
            bool isDoubleBooked = await _repo
                .IsBarberBookedAsync(dto.BarberId, dto.AppointmentDateTime);

            if (isDoubleBooked)
                throw new InvalidOperationException("This time slot is already booked.");

            var appointment = _mapper.Map<Appointment>(dto);
            appointment.CreatedByUserId = userId;

            await _repo.AddAsync(appointment);
            await _repo.SaveAsync();

            return _mapper.Map<AppointmentDTO>(appointment);
        }


        public async Task<bool> UpdateStatusAsync(int id, AppointmentStatus status)
        {
            var app = await _repo.GetByIdAsync(id);
            if (app == null) return false;
            app.Status = status;
            await _repo.UpdateAsync(app);
            return true;
        }
        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var all = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<AppointmentDTO>>(all);
        }


        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var app = await _repo.GetByIdAsync(id);
            if (app == null) return false;
            await _repo.DeleteAsync(app);
            return true;
        }

        public async Task<List<string>> GetAvailableSlotsAsync(string barberId, DateOnly date)
        {
            var isToday = date == DateOnly.FromDateTime(DateTime.UtcNow.Date);
            var weekday = date.DayOfWeek;

            var hours = await _context.WorkingHours
                .Where(w => w.BarberId == barberId && w.Day == weekday || (w.BarberId == null && w.Day == weekday))
                .OrderByDescending(w => w.BarberId)
                .FirstOrDefaultAsync();

            if (hours == null || hours.IsClosed)
                return new List<string>();

            var start = hours.OpenTime;
            var end = hours.CloseTime;
            var now = DateTime.UtcNow;

            var booked = await _context.Appointments
                .Where(a => a.BarberId == barberId && DateOnly.FromDateTime(a.AppointmentDateTime) == date)
                .Select(a => a.AppointmentDateTime.TimeOfDay)
                .ToListAsync();

            var slots = new List<string>();
            for (var time = start; time < end; time = time.Add(TimeSpan.FromMinutes(20)))
            {
                var fullDate = date.ToDateTime(TimeOnly.FromTimeSpan(time));
                if (isToday && fullDate < now) continue;
                if (!booked.Contains(time))
                    slots.Add(time.ToString(@"hh\:mm"));
            }

            return slots;
        }
    }

}
