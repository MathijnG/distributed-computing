using System;

namespace DcApi.Exceptions
{
    public class BadLoginException : Exception
    {
        public BadLoginException()
        {
        }

        public BadLoginException(string message) : base(message)
        {
        }

        public BadLoginException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
