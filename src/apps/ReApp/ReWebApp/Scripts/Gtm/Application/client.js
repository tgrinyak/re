var Gtm;
(function (Gtm) {
    (function (Application) {

        var Client = (function () {

            var _currentPage;
            var _csid;
            var _userRole;

            function Client() {
                console.log("test from Gtm.Application.Client()");
                _currentPage = "login";
                _csid = undefined;
                _userRole = undefined;
            }

            Client.init = function () {
                console.log("test from Gtm.Application.Client.init()");

                if ("login" !== _currentPage) {
                    _currentPage = "login";
                }

            };

            Client.showPage = function () {
                var page;
                switch (_currentPage) {
                    case "admin":
                        page = Gtm.Application.AdminPage.getPageContent();
                        break;
                    case "user":
                        page = Gtm.Application.UserPage.getPageContent();
                        break;
                    case "login":
                    default:
                        page = Gtm.Application.LoginPage.getPageContent();
                        break;
                }

                if ($.isValid(page)) {
                    var bodyElement = $(document.body);
                    bodyElement.empty();
                    bodyElement.append(page);
                }
            };

            Client.loginComplete = function (csid, role) {
                Client.csid(csid);
                Client.userRole(role);
            };

            Client.logoutComplete = function () {
                Client.userRole("undefined");
                _csid = undefined;
            };

            Client.csid = function (val) {
                if ($.isValid(val)) {
                    _csid = val;
                }
                return _csid;
            };

            Client.userRole = function (val) {
                if ($.isValid(val)) {
                    if (_userRole !== val) {
                        _userRole = val;
                        switch (_userRole) {
                            case "admin":
                                _currentPage = "admin";
                                break;
                            case "user":
                                _currentPage = "user";
                                break;
                            case "undefined":
                                _currentPage = "login";
                                break;
                            default:
                                console.log("[warn]: unexpected userRole: " + _userRole);
                                _currentPage = "login";
                                break;
                        }
                        Client.showPage();
                    }
                }
                return _userRole;
            };

            Client();
            return Client;
        })();
        Application.Client = Client;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));