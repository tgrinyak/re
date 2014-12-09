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
        #endregion

        #region constructors
        public ClientSession()
        {
            this.SessionGuid = Guid.NewGuid().ToString();
        }
        #endregion
    }
}