using System.Text;
using API.Data;
using API.Extensions;
using API.Intefaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var config =builder.Configuration;
// Add services to the container.
builder.Services.AddApplicationServices(config);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddIdentityServices(config);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// app.UseRouting();

app.UseCors(
    policy =>  policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                             ); 

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

//IDE Changes
//added prefix _ for the private fields in settings, search 'prefix'
//removed prefix this for the private fields in settings, search 'Use this for ctor'