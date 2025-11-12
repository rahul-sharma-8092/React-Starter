namespace eClaims.Models
{
    public class EmailMsg
    {
        public string? FromName { get; set; }
        public string? From { get; set; }
        public string? To { get; set; }
        public string? CC { get; set; }
        public string? BCC { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public IFormFile? Attachment { get; set; }
        public bool IsHtml { get; set; }
        public bool IsSent { get; set; }
        public string? Tags { get; set; }
    }
}
