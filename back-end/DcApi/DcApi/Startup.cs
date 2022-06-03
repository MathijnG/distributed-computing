using DcApi.Persistency;
using DcApi.Services;
using DcApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System;
using System.Text;

namespace DcApi
{
    public class Startup
    {
        private string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "DcApi", Version = "v1" });
            });
            services.AddCors(
                options =>
                {
                    options.AddPolicy(
                        "CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
                });

            services.AddDbContext<ApplicationDbContext>(
                    options => options.UseMySql(
                         connectionString,
                          mysqlOptions =>
                         {
                                mysqlOptions.ServerVersion(new Version(10, 4, 8), ServerType.MariaDb);
                                 mysqlOptions.DisableBackslashEscaping();
                         }));

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                /// Password must be atleast 8 characters long
                /// must contain a digit, uppercase and 1 special character
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredUniqueChars = 1;
                options.Password.RequireLowercase = true;
            }).AddEntityFrameworkStores<ApplicationDbContext>()
               .AddDefaultTokenProviders()
                 .AddUserManager<UserManager<IdentityUser>>()
                 .AddSignInManager<SignInManager<IdentityUser>>();

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
              .AddJwtBearer(options =>
              {
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = Configuration.GetSection("JwtIssuer").Value,
                      ValidAudience = Configuration.GetSection("JwtIssuer").Value,
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("JwtKey").Value))
                  };
              });

            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IPasswordValidatorService, PasswordValidatorService>();
            services.AddSingleton<IJwtService, JwtService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DcApi v1"));
            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
