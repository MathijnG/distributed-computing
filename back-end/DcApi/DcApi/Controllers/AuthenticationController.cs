using DcApi.Exceptions;
using DcApi.Logic;
using DcApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService authService;
        private readonly IJwtService jwtService;

        public AuthenticationController(IAuthenticationService auth, IJwtService jwt)
        {
            authService = auth;
            jwtService = jwt;
        }

        [HttpPost("signin")]
        public async Task<SignInResponse> SignInAsync([FromBody] SignInModel model)
        {
            try
            {
                return await authService.SignInAsync(model);
            }
            catch (BadLoginException)
            {
                return new SignInResponse()
                {
                    Success = false,
                    Token = null,
                    Message = "incorrect Password/Email",
                };
            }
        }

        [HttpPost("signup")]
        [Authorize (Roles = "Admin")]
        public async Task<SignInResponse> SignUpAsync([FromBody] SignUpModel model)
        {
            try
            {
                return await authService.SignUpAsync(model);
            }
            catch (Exception e) when (e is UsernameTakenException || e is EmailTakenException || e is PasswordValidationException)
            {
                return new SignInResponse()
                {
                    Success = false,
                    Message = e.Message,
                    Token = null,
                };
            }
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public Task<List<User>> GetUsers()
        {
            try
            {
                return authService.GetUsers();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("updaterole")]
        [Authorize(Roles = "Admin")]
        public IActionResult updaterole([FromBody] UpdateUserRole model)
        {
            if (authService.UpdateRole(model).Result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("roles")]
        [Authorize(Roles = "Admin")]
        public List<string> getroles()
        {
            return authService.GetRoles();
        }



        [HttpPost("validate")]
        public JwtValidation ValidateJwt([FromBody] TokenContainer token)
        {
            if (jwtService.ValidateToken(token.Token))
            {
                return new JwtValidation() { isValid = true };
            }
            return new JwtValidation() { isValid = false };
        }
    }
}
