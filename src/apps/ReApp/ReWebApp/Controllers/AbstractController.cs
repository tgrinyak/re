using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Attributes;

namespace Gtm.ReWebApp.Controllers
{
    [ClientSessionFilter(Order=0)]
    public abstract class AbstractController : Controller
    {
        #region properties
        public ClientSession ClientSession { get; set; }
        #endregion
    }
}