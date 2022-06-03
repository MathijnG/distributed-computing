using DcApi.Logic;

namespace DcApi.Services.Interfaces
{
    public interface IPasswordValidatorService
    {
        Result ValidateRegisterPassword(string password, string passwordConfirm);
    }
}