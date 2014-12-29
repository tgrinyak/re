using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Attributes;

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

        public ActionResult Temp()
        {
            return View();
        }
    }
}