using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Persistency
{
    public static class RoleData
    {
        private static readonly string[] Roles = new string[] { "Admin", "Reader", "Writer" };

        public static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                    var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                IdentityUser user = new IdentityUser()
                {
                    Email = "admin@admin.com",
                    UserName = "admin",
                };
                var admin = await userManager.FindByNameAsync("admin");
                if(admin == null)
                {
                    await userManager.CreateAsync(user, "admin");
                }
                    foreach (var role in Roles)
                    {
                        if (!await roleManager.RoleExistsAsync(role))
                        {
                            await roleManager.CreateAsync(new IdentityRole(role));
                        }
                    }
            }
        }
    }
}
