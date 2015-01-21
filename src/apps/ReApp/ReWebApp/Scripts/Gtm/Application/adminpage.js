var Gtm;
(function (Gtm) {
    (function (Application) {

        var AdminPage = (function () {

            var _contentDiv;
            var _logoutButton;

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
                _logoutButton = undefined;
            }

            AdminPage.getPageContent = function () {
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                return _contentDiv;
            };

            function _buildContentDiv() {
                _contentDiv = $("<div style='width:100%'/>");
                $("<h2>Admin page</h2><div>Hi there!</div>").appendTo(_contentDiv);
                _logoutButton = $("<button>log out</button>").appendTo(_contentDiv)
                    .button()
                    .on("click", _onClickLogout);
            }

            function _resetContentDiv() {
                _logoutButton
                    .on("click", _onClickLogout);
            }

            function _onClickLogout(event) {
                console.log("'log out' clicked!");
                var self = $(this);
                self.prop("disabled", true);
                $.postJson("Login/logout", {}, function (responseData) {
                    console.log("logout accomplished, ResponseType: " + responseData.ResponseType);
                    Application.Client.logoutComplete();
                    self.prop("disabled", false);
                });
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));