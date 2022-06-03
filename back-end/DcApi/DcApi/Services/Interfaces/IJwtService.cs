using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace DcApi.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwt(IdentityUser user, IList<string> roles = null);
        bool ValidateToken(string token);
    }
}