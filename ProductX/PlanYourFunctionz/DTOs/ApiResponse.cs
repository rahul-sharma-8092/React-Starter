namespace eClaims.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public T Data { get; set; } = default!;
        public object? Errors { get; set; } = null;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow.AddHours(5).AddMinutes(30);
    }
}
