using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Models;

namespace Gtm.ReWebApp.Controllers
{
    public class AdminController : AbstractController
    {
        // GET: Admin
        public ActionResult Index()
        {
            if (ClientRoleEnum.Admin == (base.ClientSession.Role & ClientRoleEnum.Admin))
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