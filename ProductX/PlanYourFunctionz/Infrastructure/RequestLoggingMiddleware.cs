using eClaims.Common;
using Serilog;
using Serilog.Context;
using System.Diagnostics;

namespace eClaims.Infrastructure
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            // Try to read the correlation ID from header or TraceIdentifier
            var correlationId = context.TraceIdentifier;
            if (context.Request.Headers.TryGetValue("X-Correlation-ID", out var headerId))
            {
                correlationId = headerId!;
            }

            if (!string.IsNullOrEmpty(correlationId))
            {
                ErrorLogToFolder.SetCorrelationId(correlationId);
            }

            // Push into Serilog LogContext
            using (LogContext.PushProperty("CorrelationId", correlationId))
            {
                var logger = Log.ForContext<RequestLoggingMiddleware>();

                try
                {
                    // Log HTTP Request
                    logger.ForContext("LogType", "HttpRequest").Information("HTTP {Method} Request {Path}", context.Request.Method, context.Request.Path);

                    try
                    {
                        await _next(context);
                    }
                    catch (Exception ex)
                    {
                        // Log Exception
                        logger.ForContext("LogType", "Exception")
                              .Error(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
                        throw;
                    }
                }
                //catch (Exception)
                //{
                //    throw;
                //}
                finally
                {
                    stopwatch.Stop();
                    logger.ForContext("LogType", "HttpRequest")
                          .Information("HTTP {Method} Response {StatusCode} {Path} (took {Elapsed} ms)", context.Request.Method, context.Response.StatusCode, context.Request.Path, stopwatch.ElapsedMilliseconds);

                    if (context.Response.StatusCode == 401)
                    {
                        logger.ForContext("LogType", "Exception").Information("HTTP {Method} Request {Path}", context.Request.Method, context.Request.Path);
                    }
                }
            }
        }
    }
}
