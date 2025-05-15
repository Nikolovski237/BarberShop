using Barber_Shop.Models;

public enum AppointmentStatus { Pending, Confirmed, Cancelled, Completed }

public class Appointment
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string CustomerPhone { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    public string BarberId { get; set; }
    public ApplicationUser Barber { get; set; }

    public string CreatedByUserId { get; set; }
    public ApplicationUser CreatedByUser { get; set; }
}
