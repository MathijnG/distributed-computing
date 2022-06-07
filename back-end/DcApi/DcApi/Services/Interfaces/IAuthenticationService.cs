using DcApi.Logic;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DcApi.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<SignInResponse> SignInAsync(SignInModel model);
        Task<SignInResponse> SignUpAsync(SignUpModel model);

        Task<List<User>> GetUsers();

        Task<bool> UpdateRole(UpdateUserRole model);

        List<string> GetRoles();
    }
}