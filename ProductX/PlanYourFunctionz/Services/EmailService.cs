using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using eClaims.AppSettings;
using eClaims.Models;


namespace eClaims.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _emailSettings = options.Value;
        }

        public async Task<bool> SendEmailAsync(EmailMsg obj)
        {
            if (obj == null || string.IsNullOrWhiteSpace(obj.To))
                return false;

            try
            {
                using var message = new MimeMessage();

                // From
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));

                // To
                foreach (var address in obj.To.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                    message.To.Add(MailboxAddress.Parse(address.Trim()));

                // CC
                if (!string.IsNullOrWhiteSpace(obj.CC))
                {
                    foreach (var cc in obj.CC.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                        message.Cc.Add(MailboxAddress.Parse(cc.Trim()));
                }

                // BCC
                if (!string.IsNullOrWhiteSpace(obj.BCC))
                {
                    foreach (var bcc in obj.BCC.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                        message.Bcc.Add(MailboxAddress.Parse(bcc.Trim()));
                }

                // Subject
                message.Subject = obj.Subject ?? "(No Subject)";

                // Body
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = obj.IsHtml ? obj.Body : null,
                    TextBody = !obj.IsHtml ? obj.Body : null
                };

                // Attachment
                if (obj.Attachment != null && obj.Attachment.Length > 0)
                {
                    var fileName = Path.GetFileName(obj.Attachment.FileName);
                    using (var stream = new MemoryStream())
                    {
                        await obj.Attachment.CopyToAsync(stream);
                        stream.Position = 0;
                        bodyBuilder.Attachments.Add(fileName, stream.ToArray());
                    }
                }

                message.Body = bodyBuilder.ToMessageBody();

                // SMTP send
                using var client = new SmtpClient();

                obj.IsSent = true;
                return true;

                client.SslProtocols = System.Security.Authentication.SslProtocols.Tls12;
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, SecureSocketOptions.StartTls);
                
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                obj.IsSent = true;
                return true;
            }
            catch (Exception ex)
            {
                // Common.Logger.WriteLog("EmailService", "SendEmailAsync", ex);
                obj.IsSent = false;
                return false;
            }
        }
    }
}
