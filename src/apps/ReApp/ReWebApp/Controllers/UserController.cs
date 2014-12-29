using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Models;

namespace Gtm.ReWebApp.Controllers
{
    public class UserController : AbstractController
    {
        // GET: User
        public ActionResult Index()
        {
            if (ClientRoleEnum.User == (base.ClientSession.Role & ClientRoleEnum.User))
            {
                return View();
            }
            else
            {
                return Redirect("Error/Index");
            }
        }
    }
}