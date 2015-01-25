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
        #region members
        protected static readonly Dictionary<string, string> OPEN_DB_FAILED_MESSAGE_TEXT;
        protected static readonly Dictionary<string, string> EXECUTE_DB_QUERY_MESSAGE_TEXT;
        #endregion

        #region properties
        public ClientSession ClientSession { get; set; }
        #endregion

        #region constructors
        static AbstractController()
        {
            OPEN_DB_FAILED_MESSAGE_TEXT = new Dictionary<string, string>();
            OPEN_DB_FAILED_MESSAGE_TEXT.Add("en", "execute database request failed");
            OPEN_DB_FAILED_MESSAGE_TEXT.Add("jp", "データベース要求失敗しました");

            EXECUTE_DB_QUERY_MESSAGE_TEXT = new Dictionary<string, string>();
            EXECUTE_DB_QUERY_MESSAGE_TEXT.Add("en", "open database connection failed");
            EXECUTE_DB_QUERY_MESSAGE_TEXT.Add("jp", "データベース接続失敗しました");
        }

        protected AbstractController()
        {
            this.ClientSession = null;
        }
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