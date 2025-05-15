namespace Barber_Shop.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string Entity { get; set; }
        public string Action { get; set; }
        public string PerformedByUserId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Changes { get; set; }
    }

}
