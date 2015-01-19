var Gtm;
(function (Gtm) {
    var System = (function () {

        function System() {
            console.log("test from Gtm.System()");

            if (System.isInvalid($.isInvalid)) {
                $.isInvalid = System.isInvalid;
            }

            if (System.isInvalid($.isValid)) {
                $.isValid = System.isValid;
            }
        }

        //System.init = function (pagename) {
        //    console.log("test from Gtm.Application.Client.init()");
        //};

        System.isInvalid = function (obj) {
            if (obj === undefined) {
                return true;
            }
            if (obj === null) {
                return true;
            }
            return false;
        };

        System.isValid = function (obj) {
            return !this.isInvalid(obj);
        };

        System();
        return System;
    })();
    var System = Gtm.System;
})(Gtm || (Gtm = {}));