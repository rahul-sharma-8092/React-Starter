using CorrelationId;
using CorrelationId.DependencyInjection;
using eClaims.AppSettings;
using eClaims.Common;
using eClaims.Infrastructure;
using eClaims.Repositories;
using eClaims.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------
// Get log root folder from appsettings
// ------------------------------------
var logRootPath = builder.Configuration.GetValue<string>("ConfigKey:LogFilePath");

// ----------------------
// Serilog configuration
// ----------------------
#region Serilog configuration
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithCorrelationIdHeader()

    // HTTP Request logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Properties.ContainsKey("LogType") && evt.Properties["LogType"].ToString() == "\"HttpRequest\"")
        .WriteTo.File($"{logRootPath}\\HttpRequest\\http-request-.txt", rollingInterval: RollingInterval.Day,
                      outputTemplate: "[{Timestamp:dd-MM-yyyy HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}"))

    // HTTP Response logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Properties.ContainsKey("LogType") && evt.Properties["LogType"].ToString() == "\"HttpResponse\"")
        .WriteTo.File($"{logRootPath}\\HttpResponse\\http-response-.txt", rollingInterval: RollingInterval.Day,
                      outputTemplate: "[{Timestamp:dd-MM-yyyy HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}"))

    // Invalid Request logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Properties.ContainsKey("LogType") && evt.Properties["LogType"].ToString() == "\"InvalidRequest\"")
        .WriteTo.File($"{logRootPath}\\InvalidRequest\\invalid-request-.txt", rollingInterval: RollingInterval.Day,
                      outputTemplate: "[{Timestamp:dd-MM-yyyy HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}"))

    // Exception logs
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Properties.ContainsKey("LogType") && evt.Properties["LogType"].ToString() == "\"Exception\"")
        .WriteTo.File($"{logRootPath}\\Exception\\exception-.txt", rollingInterval: RollingInterval.Day,
                      outputTemplate: "[{Timestamp:dd-MM-yyyy HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}"))

    .CreateLogger();

builder.Host.UseSerilog();

// ------------------------
// CorrelationId middleware
// ------------------------
builder.Services.AddDefaultCorrelationId(options =>
{
    options.IncludeInResponse = true;
    options.UpdateTraceIdentifier = true;
    options.RequestHeader = "x-Correlation-Id";
});
#endregion

// -------------------------
// Add controllers & filters
// -------------------------
builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new RoutePrefixConvention("api/v1"));
});

builder.Services.AddRouting(o =>
{
    o.LowercaseUrls = true;
    o.LowercaseQueryStrings = true;
});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ---------------------
// Configure AppSettings
// ---------------------
builder.Services.AddOptions<ConnectionStrings>().Bind(builder.Configuration.GetSection("ConnectionStrings")).ValidateDataAnnotations().ValidateOnStart();
builder.Services.AddOptions<JwtSettings>().Bind(builder.Configuration.GetSection("JwtSettings")).ValidateDataAnnotations().ValidateOnStart();
builder.Services.AddOptions<EmailSettings>().Bind(builder.Configuration.GetSection("Email")).ValidateDataAnnotations().ValidateOnStart();
builder.Services.AddOptions<ConfigKey>().Bind(builder.Configuration.GetSection("ConfigKey")).ValidateDataAnnotations().ValidateOnStart();

// -----------------------------------
// JWT Configuration
// -----------------------------------
#region JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(0),
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        RoleClaimType = ClaimTypes.Role,
    };
});

// Authorization
builder.Services.AddAuthorization(options =>
{
    // Admin only
    options.AddPolicy(AppAuthorization.Policies.RequireAdmin,
policy => policy.RequireRole(AppAuthorization.Roles.Admin));

    // Admin or User
    options.AddPolicy(AppAuthorization.Policies.RequireUser,
        policy => policy.RequireRole(AppAuthorization.Roles.Admin, AppAuthorization.Roles.User));
});
#endregion

// -----------------------------------
// Configure Cors Policy - Allow frontend app
// -----------------------------------
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? Array.Empty<string>()).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

// -----------------------------------
// Dependency Injection - Repositories
// -----------------------------------
builder.Services.AddScoped<BaseSQL>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtRepository, JwtRepository>();

// -------------------------------
// Dependency Injection - Services
// -------------------------------
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IUserService, UserService>();

ErrorLogToFolder.Init(builder.Configuration);

var app = builder.Build();

// -------------------
// Middleware pipeline
// -------------------
app.UseHttpsRedirection();
app.UseCors("AllowFrontendApp");
app.UseCorrelationId();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
