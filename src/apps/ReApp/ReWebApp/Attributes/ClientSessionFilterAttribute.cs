using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Controllers;

namespace Gtm.ReWebApp.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ClientSessionFilterAttribute : ActionFilterAttribute
    {
        #region properties
        public bool ClientSessionRequires { get; set; }
        #endregion

        #region constructors
        public ClientSessionFilterAttribute()
        {
            this.ClientSessionRequires = true;
        }
        #endregion

        #region methods
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var baseController = filterContext.Controller as AbstractController;

            // TODO: implement behaviour
            // ..

            base.OnActionExecuting(filterContext);
        }
        #endregion
    }
}