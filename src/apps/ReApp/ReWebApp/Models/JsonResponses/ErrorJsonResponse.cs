using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models.JsonResponses
{
    public class ErrorJsonResponse : AbstractJsonResponse
    {
        public ErrorJsonResponse(object param)
            :base("error", param)
        { 
        }
    }
}