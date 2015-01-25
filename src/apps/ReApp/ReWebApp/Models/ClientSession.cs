using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models
{
    public class ClientSession
    {
        #region properties
        public string SessionGuid { get; private set; }
        public string Localization { get; set; }
        public string UserName { get; set; }
        public ClientRoleEnum Role { get; set; }
        #endregion

        #region constructors
        public ClientSession()
        {
            this.SessionGuid = Guid.NewGuid().ToString();
            this.Localization = "en";
            this.Role = ClientRoleEnum.Undefined;
            this.UserName = string.Empty;
        }
        #endregion
    }
}