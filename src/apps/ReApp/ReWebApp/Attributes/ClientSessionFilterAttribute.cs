﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Gtm.ReWebApp.Controllers;
using Gtm.ReWebApp.Models;

namespace Gtm.ReWebApp.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ClientSessionFilterAttribute : ActionFilterAttribute
    {
        #region consts
        public const string CLIENT_SESSION_ID_ITEM_NAME = "csid";
        #endregion

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

            if( null != baseController)
            {
                var csidParam = filterContext.HttpContext.Request.Params[CLIENT_SESSION_ID_ITEM_NAME];
                baseController.ClientSession = !string.IsNullOrEmpty(csidParam) ? ClientSessionManager.Instance.GetClientSession(csidParam) : null;

                // if client session is not resolved from request parameters
                if (this.ClientSessionRequires && null == baseController.ClientSession)
                {
                    filterContext.Result = baseController.NotAuthenticated(filterContext.HttpContext.Request.RawUrl);
                    return;
                }
            }

            base.OnActionExecuting(filterContext);
        }
        #endregion
    }
}