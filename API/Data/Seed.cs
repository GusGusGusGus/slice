using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        //this originally used DataContext as a parameter
        public static async Task SeedUsers(
            UserManager<AppUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData); 
            if(users == null) return;
            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                // using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("azaz"));
                // user.PasswordSalt = hmac.Key;

                var result = await userManager.CreateAsync(user, "azazaz");
                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Member");
                }
            }

            var admin = new AppUser
            {
                UserName = "admin",
                City = "New York",
                Country = "USA",
                DateOfBirth = new DateTime(1984, 03, 15),
                KnownAs = "Admin",
                Gender = "male"
            };

            var resultAdmin = await userManager.CreateAsync(admin, "azazaz");
            var resultAdminRole = await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
            //new userManager implementation does this
            // await context.SaveChangesAsync();
        }
    }
}