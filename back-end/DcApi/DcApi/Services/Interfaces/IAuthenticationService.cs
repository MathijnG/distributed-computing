using DcApi.Logic;
using System.Threading.Tasks;

namespace DcApi.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<SignInResponse> SignInAsync(SignInModel model);
        Task<SignInResponse> SignUpAsync(SignUpModel model);
    }
}