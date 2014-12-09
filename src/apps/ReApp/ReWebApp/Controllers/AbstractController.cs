using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Models.JsonResponses;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.CustomTypeSerializers;

namespace Gtm.ReWebApp.Controllers
{
    [ClientSessionFilter(Order=0)]
    public abstract class AbstractController : Controller
    {
        #region properties
        public ClientSession ClientSession { get; set; }
        #endregion

        #region methods

        #region public
        public JsonResult NotAuthenticated(string request = "")
        {
            var csid = base.Request[ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME];

            if (!string.IsNullOrEmpty(csid))
            {
                // provide some additional info
            }

            // [TMP]
            return this.CreateJsonResult(new ErrorJsonResponse(new
                {
                    message = "Not authenticated",
                }),
                null,
                null);
        }
        #endregion

        #region protected
        protected JsonResult CreateJsonResult(AbstractJsonResponse jsonResponseObject, string contentType, System.Text.Encoding encoding)
        {
            return new NewtonsoftJsonResult()
            {
                Data = jsonResponseObject,
                ContentType = contentType,
                ContentEncoding = encoding,
            };
        }
        #endregion

        #endregion
    }
}