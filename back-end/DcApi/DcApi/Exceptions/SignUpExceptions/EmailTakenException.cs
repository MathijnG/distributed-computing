using System;

namespace DcApi.Exceptions
{
    public class EmailTakenException : Exception
    {
        public EmailTakenException()
        {
        }

        public EmailTakenException(string message) : base(message)
        {
        }

        public EmailTakenException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
