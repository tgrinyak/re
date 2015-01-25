var Gtm;
(function (Gtm) {
    var System = (function () {

        function System() {
            console.log("test from Gtm.System()");

            if (isInvalid($.isInvalid)) {
                $.isInvalid = isInvalid;
            }

            if (isInvalid($.isValid)) {
                $.isValid = isValid;
            }

            if (isInvalid($.postJson)) {
                $.postJson = postJson;
            }

            if (isInvalid($.getJson)) {
                $.getJson = getJson;
            }
        }

        function isInvalid(obj) {
            if (obj === undefined) {
                return true;
            }
            if (obj === null) {
                return true;
            }
            return false;
        }

        function isValid(obj) {
            return !isInvalid(obj);
        }

        function postJson(url, obj, callback) {
            _jsonCall("post", url, obj, callback);
        }

        function getJson(url, obj, callback) {
            _jsonCall("get", url, obj, callback);
        }

        function _jsonCall(method, url, obj, callback) {
            url = _embedCsidIntoUrl(url);
            try{
                return jQuery[method](
                    url,
                    obj,
                    function (successData, textStatus, jqXhr) {
                        if (callback !== undefined) {
                            callback(successData, textStatus, jqXhr);
                        }
                    },
                    "json")
                    .complete(function () {
                        // nothing to do so far
                    });
            } catch (ex) {

            }
            return undefined;
        }

        function _getCsid() {
            if (isValid(Gtm.Application) && isValid(Gtm.Application.Client)) {
                return Gtm.Application.Client.csid();
            }
            return undefined;
        }

        function _getLocalization() {
            if (isValid(Gtm.Application) && isValid(Gtm.Application.Client)) {
                return Gtm.Application.Client.localization();
            }
            return undefined;
        }

        function _embedCsidIntoUrl(url) {
            var csid = _getCsid();
            if (isValid(csid)) {
                var splittedUtl = url.split("?");
                if (1 === splittedUtl.length) {
                    url += "?csid=" + csid;
                } else {
                    url += "&csid=" + csid;
                }
            }
            var localization = _getLocalization();
            if (isValid(localization)) {
                var splittedUtl = url.split("?");
                if (1 === splittedUtl.length) {
                    url += "?localization=" + localization;
                } else {
                    url += "&localization=" + localization;
                }
            }
            return url;
        }

        System();
        return System;
    })(jQuery);
    var System = Gtm.System;
})(Gtm || (Gtm = {}));