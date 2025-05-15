namespace Barber_Shop.DTOs
{
    public class AppointmentCreateDTO
    {
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string BarberId { get; set; }
    }

}
