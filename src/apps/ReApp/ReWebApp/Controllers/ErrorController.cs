using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Gtm.ReWebApp.Controllers
{
    public class ErrorController : AbstractController
    {
        // GET: Error
        public ActionResult Index()
        {
            return View();
        }
    }
}