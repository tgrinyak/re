using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models.Exceptions
{
    public class UserInfoVerificationException : Exception
    {
        public string FieldName { get; private set; }

        public UserInfoVerificationException(string message, string fieldName)
            : this(message, fieldName, null)
        {
        }

        public UserInfoVerificationException(string message, string fieldName, Exception innerException)
            : base(message, innerException)
        {
            this.FieldName = fieldName;
        }
    }
}