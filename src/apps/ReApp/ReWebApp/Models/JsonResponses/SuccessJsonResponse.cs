using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models.JsonResponses
{
    public class SuccessJsonResponse :AbstractJsonResponse
    {
        public SuccessJsonResponse(object param)
            :base("success", param)
        {
        }

        public SuccessJsonResponse()
            : base("success", new object())
        {
        }
    }
}