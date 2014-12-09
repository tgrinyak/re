using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models.JsonResponses
{
    public abstract class AbstractJsonResponse
    {
        public string ResponseType { get; private set; }
        public object Param { get; private set; }

        public AbstractJsonResponse(string responseType, object param)
        {
            this.ResponseType = responseType;
            this.Param = param;
        }
    }
}