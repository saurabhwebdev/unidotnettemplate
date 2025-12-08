using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UniTemplate.Core.Configuration;
using UniTemplate.Data;

var builder = WebApplication.CreateBuilder(args);

// Add configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Configure JWT Settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Configure CORS Settings
var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings();
builder.Services.Configure<CorsSettings>(builder.Configuration.GetSection("Cors"));

// Configure Microsoft Auth Settings
var microsoftAuthSettings = builder.Configuration.GetSection("MicrosoftAuth").Get<MicrosoftAuthSettings>() ?? new MicrosoftAuthSettings();
builder.Services.Configure<MicrosoftAuthSettings>(builder.Configuration.GetSection("MicrosoftAuth"));

// Configure Email Settings
var emailSettings = builder.Configuration.GetSection("EmailSettings").Get<EmailSettings>() ?? new EmailSettings();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// Add Services
builder.Services.AddScoped<UniTemplate.Core.Interfaces.ITokenService, UniTemplate.Data.Services.TokenService>();
builder.Services.AddScoped<UniTemplate.Core.Interfaces.IAuthService, UniTemplate.Data.Services.AuthService>();
builder.Services.AddScoped<UniTemplate.Core.Interfaces.IRoleService, UniTemplate.Data.Services.RoleService>();
builder.Services.AddScoped<UniTemplate.Core.Interfaces.IUserService, UniTemplate.Data.Services.UserService>();
builder.Services.AddScoped<UniTemplate.Core.Interfaces.IAuditLogService, UniTemplate.Data.Services.AuditLogService>();

// Add Email Service based on provider
if (emailSettings.Provider.Equals("MicrosoftGraph", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddScoped<UniTemplate.Core.Interfaces.IEmailService, UniTemplate.Data.Services.MicrosoftGraphEmailService>();
}
else
{
    builder.Services.AddScoped<UniTemplate.Core.Interfaces.IEmailService, UniTemplate.Data.Services.SmtpEmailService>();
}

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.WithOrigins(corsSettings.AllowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Add Controllers
builder.Services.AddControllers();

// Add API Explorer and OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("DefaultPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
