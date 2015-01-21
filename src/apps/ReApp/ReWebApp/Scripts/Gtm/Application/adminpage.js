﻿var Gtm;
(function (Gtm) {
    (function (Application) {

        var AdminPage = (function () {

            var _contentDiv;

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
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
                $("<button>log out</button>").appendTo(_contentDiv)
                    .button()
                    .on("click", function (event) {
                        console.log("'log out' clicked!");
                        var self = $(this);
                        self.prop("disabled", true);
                        $.postJson("Login/logout", {}, function (responseData) {
                            console.log("logout accomplished, ResponseType: " + responseData.ResponseType);
                            Application.Client.logoutComplete();
                            self.prop("disabled", false);
                        });
                    });
            }

            function _resetContentDiv() {
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));