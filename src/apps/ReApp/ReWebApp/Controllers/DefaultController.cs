using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.Models;

namespace Gtm.ReWebApp.Controllers
{
    public class DefaultController : AbstractController
    {
        // GET: Default
        [ClientSessionFilter(ClientSessionRequires=false)]
        public ActionResult Index()
        {
            // [temp]
            //base.ClientSession = ClientSessionManager.Instance.CreateClientSession();
            //base.ClientSession.Role = ClientRoleEnum.Admin;
            if (null == base.ClientSession)
            {
                //return RedirectToAction("");
                return base.Redirect("Login/Index");
            }
            else
            {
                if (ClientRoleEnum.Admin == (base.ClientSession.Role & ClientRoleEnum.Admin))
                {
                    return Redirect("Admin/Index?"
                                    + ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME
                                    + "="
                                    + base.ClientSession.SessionGuid);
                }
                else if(ClientRoleEnum.User == (base.ClientSession.Role & ClientRoleEnum.User))
                {
                    return Redirect("User/Index?"
                                    + ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME
                                    + "="
                                    + base.ClientSession.SessionGuid);
                }
                else
                {
                    return Redirect("Login/Index");
                }
            }
        }
    }
}