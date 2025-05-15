namespace Barber_Shop.Models
{
    public class WorkingHour
    {
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
        public bool IsClosed { get; set; }

        public string? BarberId { get; set; }
        public ApplicationUser? Barber { get; set; }
    }


}
