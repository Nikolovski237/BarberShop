﻿namespace Barber_Shop.Repositories.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<IEnumerable<Appointment>> GetByBarberIdAsync(string barberId);
        Task<bool> IsBarberBookedAsync(string barberId, DateTime dateTime);
        Task<Appointment?> GetByIdAsync(int id);
        Task AddAsync(Appointment appointment);
        Task UpdateAsync(Appointment appointment);
        Task DeleteAsync(Appointment appointment);
        Task SaveAsync();

    }

}
