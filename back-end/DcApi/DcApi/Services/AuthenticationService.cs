using DcApi.Exceptions;
using DcApi.Logic;
using DcApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IPasswordValidatorService passwordValidator;
        private readonly IJwtService jwtService;

        public AuthenticationService(UserManager<IdentityUser> uman, SignInManager<IdentityUser> sman, RoleManager<IdentityRole> rman, IPasswordValidatorService passwordVal, IJwtService jwt)
        {
            userManager = uman;
            signInManager = sman;
            roleManager = rman;
            passwordValidator = passwordVal;
            jwtService = jwt;
        }

        public async Task<SignInResponse> SignUpAsync(SignUpModel model)
        {
            var validationResult = passwordValidator.ValidateRegisterPassword(model.Password, model.ConfirmPassword);
            if (!validationResult.IsSuccessful)
            {
                throw new PasswordValidationException(validationResult.Message);
            }

            IdentityUser user = new()
            {
                Email = model.Email,
                UserName = model.Username,
            };

            if (await userManager.FindByEmailAsync(model.Email) != null)
            {
                throw new EmailTakenException("An account with this email already exists");
            }

            if (await userManager.FindByNameAsync(model.Username) != null)
            {
                throw new UsernameTakenException("An account with this username already exists");
            }

            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var currentUser = await userManager.FindByNameAsync(model.Username);
                if (!await roleManager.RoleExistsAsync("Reader"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Reader"));
                }

                await userManager.AddToRoleAsync(currentUser, "Reader");
                var token = jwtService.GenerateJwt(currentUser, await userManager.GetRolesAsync(user));
                return new SignInResponse() { Success = true, Token = token };
            }
            else
            {
                throw new Exception();
            }
        }

        public async Task<SignInResponse> SignInAsync(SignInModel model)
        {
            IdentityUser user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                throw new BadLoginException("Incorrect Password/Email");
            }

            var result = await signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (result.Succeeded)
            {
                var roles = await userManager.GetRolesAsync(user);
                var token = jwtService.GenerateJwt(user, roles);
                return new SignInResponse()
                {
                    Success = true,
                    Token = token,
                };
            }
            else
            {
                throw new BadLoginException("Incorrect Password/Email");
            }
        }

        public async Task<List<User>> GetUsers()
        {
            List<User> users = new List<User>();
            var admins = await userManager.GetUsersInRoleAsync("Admin");
            foreach (var admin in admins)
            {
                var user = new User();
                user.Email = admin.Email;
                user.Username = admin.UserName;
                user.Role = "Admin";
                users.Add(user);
            }
            var writers = await userManager.GetUsersInRoleAsync("Writer");
            foreach (var writer in writers)
            {
                var user = new User();
                user.Email = writer.Email;
                user.Username = writer.UserName;
                user.Role = "Admin";
                users.Add(user);
            }
            var readers = await userManager.GetUsersInRoleAsync("Reader");
            foreach (var reader in readers)
            {
                var user = new User();
                user.Email = reader.Email;
                user.Username = reader.UserName;
                user.Role = "Admin";
                users.Add(user);
            }
            return users;
        }
    }
}
