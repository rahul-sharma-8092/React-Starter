using Serilog;
using Serilog.Context;
using Serilog.Events;
using System.Collections.Concurrent;

namespace eClaims.Common
{
    public class ErrorLogToFolder
    {
        private static readonly ConcurrentDictionary<string, Serilog.ILogger> FolderLoggers = new();
        private static string _logRootPath = string.Empty;
        private static readonly AsyncLocal<string?> _correlationId = new AsyncLocal<string?>();

        public static void Init(IConfiguration configuration)
        {
            _logRootPath = configuration.GetValue<string>("ConfigKey:LogFilePath") ?? "";
            if (string.IsNullOrEmpty(_logRootPath))
            {
                throw new Exception("LogRootPath is not initialized");
            }
        }

        public static void SetCorrelationId(string correlationId)
        {
            _correlationId.Value = correlationId;
        }

        private static Serilog.ILogger GetLoggerForFolder(string folderName)
        {
            if (string.IsNullOrWhiteSpace(folderName))
                folderName = "General";

            return FolderLoggers.GetOrAdd(folderName, folder =>
            {
                var folderPath = Path.Combine(_logRootPath, folder);
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                return new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .WriteTo.Async(a => a.File(
                        path: Path.Combine(folderPath, $"{folder.ToLower()}-.txt"),
                        rollingInterval: RollingInterval.Day,
                        outputTemplate: "[{Timestamp:dd-MM-yyyy HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}"
                    ))
                    .CreateLogger();
            });
        }

        private static void Log(string message, string folderName, LogEventLevel level = LogEventLevel.Information, Exception? ex = null)
        {
            try
            {
                string correlationId = _correlationId.Value ?? Guid.NewGuid().ToString();

                using (LogContext.PushProperty("CorrelationId", correlationId))
                {
                    var logger = GetLoggerForFolder(folderName);

                    switch (level)
                    {
                        case LogEventLevel.Information:
                            logger.Information(ex, message);
                            break;
                        case LogEventLevel.Warning:
                            logger.Warning(ex, message);
                            break;
                        case LogEventLevel.Error:
                            logger.Error(ex, message);
                            break;
                        case LogEventLevel.Debug:
                            logger.Debug(ex, message);
                            break;
                        case LogEventLevel.Fatal:
                            logger.Fatal(ex, message);
                            break;
                        default:
                            logger.Information(ex, message);
                            break;
                    }
                }
            } catch { }
        }

        public static void LogInfo(string message, string folderName) => Log(message, folderName, LogEventLevel.Information);
        public static void LogWarning(string message, string folderName) => Log(message, folderName, LogEventLevel.Warning);
        public static void LogError(string message, string folderName, Exception? ex = null) => Log(message, folderName, LogEventLevel.Error, ex);
        public static void LogDebug(string message, string folderName) => Log(message, folderName, LogEventLevel.Debug);
        public static void LogFatal(string message, string folderName, Exception? ex = null) => Log(message, folderName, LogEventLevel.Fatal, ex);
    }
}
