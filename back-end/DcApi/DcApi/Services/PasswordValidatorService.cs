using DcApi.Logic;
using DcApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Services
{
    public class PasswordValidatorService : IPasswordValidatorService
    {
        private List<char[]> AllCharacters { get; set; } = new List<char[]>()
        {
            "!@#$%^&*()-=_+<>/?,.:;[]{}|".ToCharArray(),
            "1234567890".ToCharArray(),
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray(),
            "abcdefghijklmnopqrstuvwxyz".ToCharArray()
        };

        public Result ValidateRegisterPassword(string password, string passwordConfirm)
        {
            if (password.Length < 8)
            {
                return new Result() { IsSuccessful = false, Message = "Password has to be longer than 8 characters" };
            }

            if (password != passwordConfirm)
            {
                return new Result() { IsSuccessful = false, Message = "Passwords do not match" };
            }

            foreach (var item in AllCharacters)
            {
                bool contains = false;
                foreach (var character in item)
                {
                    if (password.Contains(character))
                    {
                        contains = true;
                        break;
                    }
                }

                if (!contains)
                {
                    return new Result() { IsSuccessful = false, Message = "Your password has to include at least: a number, a special character and both upper and lower case letters." };
                }
            }

            return new Result() { IsSuccessful = true };
        }
    }
}
