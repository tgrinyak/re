using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gtm.ReWebApp.Models
{
    [Flags()]
    public enum ClientRoleEnum
    {
        Undefined = 0,
        User = 1,
        Admin = 1 << 1,
    }
}