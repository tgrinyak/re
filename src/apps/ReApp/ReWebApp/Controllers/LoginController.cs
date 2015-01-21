using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Models.JsonResponses;

namespace Gtm.ReWebApp.Controllers
{
    public class LoginController : AbstractController
    {
        // GET: Login
        [ClientSessionFilter(ClientSessionRequires = false)]
        public ActionResult Index()
        {
            return View();
        }

        [ClientSessionFilter(ClientSessionRequires = false)]
        public ActionResult login(string un, string pw)
        {
            if (null == base.ClientSession)
            {
                base.ClientSession = ClientSessionManager.Instance.CreateClientSession();
            }

            // here we query db for to verify credentials
            // ..

            // temp
            base.ClientSession.Role = ClientRoleEnum.Admin;

            Dictionary<string, object> responseParam = new Dictionary<string, object>();

            // success behaviour
            responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
            responseParam.Add("uRole", base.ClientSession.Role.ToString("F"));

            // temp
            System.Threading.Thread.Sleep(2000);

            return Json(new SuccessJsonResponse(responseParam));
        }

        public ActionResult Temp()
        {
            return View();
        }
    }
}