namespace Barber_Shop.DTOs
{
    public class WorkingHourDTO
    {
        public DayOfWeek Day { get; set; }
        public string? BarberId { get; set; }
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
        public bool IsClosed { get; set; }
    }

}
