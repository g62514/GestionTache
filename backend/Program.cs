using Microsoft.EntityFrameworkCore;
using backend.Models;
using OfficeOpenXml;

var builder = WebApplication.CreateBuilder(args);
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Frontend React
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseCors(); 
app.Run();
