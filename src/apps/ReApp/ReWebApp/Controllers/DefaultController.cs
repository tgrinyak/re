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
        public ActionResult Load()
        {
            return View();
        }
    }
}