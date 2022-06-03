using DcApi.Persistency;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Polly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            CreateDatabase(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args).ConfigureWebHost(x => x.UseUrls("https://*:5001","http://*:5000"))
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static void CreateDatabase(IHost host)
        {
            var policy = Policy.Handle<Exception>()
                .WaitAndRetry(10, retryCount =>
                        TimeSpan.FromSeconds(Math.Pow(2, retryCount)),
                        (exception, timeSpan, context) =>
                        {
                            Console.WriteLine($"Failed to connect to database, retrying. \n Retrying in {timeSpan}");
                        }
                       );


            using (var serviceScope = host.Services.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                policy.Execute(() => context.Database.Migrate());
            }
        }
    }
}
