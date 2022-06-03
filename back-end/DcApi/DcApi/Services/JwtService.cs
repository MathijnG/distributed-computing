using DcApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DcApi.Services
{
    public class JwtService : IJwtService
    {
        private const double JwtExpireDays = 7;
        private readonly string jwtKey = string.Empty;
        private readonly string jwtIssuer = string.Empty;

        public JwtService()
        {
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);

            var root = configurationBuilder.Build();
            jwtKey = root.GetSection("JwtKey").Value;
            jwtIssuer = root.GetSection("JwtIssuer").Value;
        }

        /// <summary>
        /// Generates a JWT token based of an identity user that can be used for authentication
        /// </summary>
        /// <param name="user"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public string GenerateJwt(IdentityUser user, IList<string> roles = null)
        {
            var userClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, new Guid().ToString()),
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim("username", user.UserName),
                new Claim("email", user.Email)
            };

            if (roles != null)
            {
                foreach (var role in roles)
                {
                    userClaims.Add(new Claim("role", role));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(JwtExpireDays);
            var token = new JwtSecurityToken(
                jwtIssuer,
                jwtIssuer,
                userClaims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return false;
            }

            var validationParameters = new TokenValidationParameters()
            {
                ValidIssuer = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                ValidateLifetime = true,
                ValidateAudience = true,
                ValidAudience = jwtIssuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken = null;
            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
            }
            catch (SecurityTokenException)
            {
                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return false;
            }

            return validatedToken != null;
        }
    }
}
