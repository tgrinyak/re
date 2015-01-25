var Gtm;
(function (Gtm) {
    (function (Application) {

        var Client = (function () {

            var _currentPage;
            var _csid;
            var _name;
            var _role;
            var _localization;
            var _roleTexts;

            function Client() {
                console.log("test from Gtm.Application.Client()");
                _currentPage = "login";
                _csid = undefined;
                _localization = "jp";
                _name = "";
                _role = "unknown";
                _roleTexts = {
                    admin: { en: "admin", jp: "管理者" },
                    user: { en: "user", jp: "ユーザー" },
                    unknown: { en: "unknown", jp: "不明" }
                };
            };

            Client.showPage = function () {
                var page;
                switch (_currentPage) {
                    case "admin":
                        Gtm.Application.AdminPage.showPage($(document.body));
                        break;
                    case "user":
                        Gtm.Application.UserPage.showPage($(document.body));
                        break;
                    case "login":
                    default:
                        Gtm.Application.LoginPage.showPage($(document.body));
                        break;
                }

                if ($.isValid(page)) {
                    var bodyElement = $(document.body);
                    bodyElement.empty();
                    bodyElement.append(page);
                }
            };

            Client.loginComplete = function (csid, userName, role) {
                Client.csid(csid);
                Client.userName(userName);
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

            Client.localization = function (val) {
                if ($.isValid(val)) {
                    _localization = val;
                }
                return _localization;
            };

            Client.userName = function (val) {
                if ($.isValid(val)) {
                    _name = val;
                }
                return _name;
            };

            Client.userNameText = function () {
                return Client.userName();
            };

            Client.userRole = function (val) {
                if ($.isValid(val)) {
                    if (_role !== val) {
                        // we switch page
                        _role = val;
                        switch (_role) {
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
                                console.log("[warn]: unexpected userRole: " + _role);
                                _currentPage = "login";
                                break;
                        }
                        Client.showPage();
                    }
                }
                return _role;
            };

            Client.userRoleText = function () {
                return _roleTexts[_role][_localization];
            };

            Client.getText = function (param) {
                return param[_localization];
            };

            Client();
            return Client;
        })();
        Application.Client = Client;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));