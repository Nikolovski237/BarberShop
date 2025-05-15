namespace Barber_Shop.DTOs
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string BarberName { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string Status { get; set; }
    }

}
