var Gtm;
(function (Gtm) {
    (function (Application) {

        var UserPage = (function () {

            var _contentDiv;

            function UserPage() {
                console.log("test from Gtm.Application.UserPage()");
                _contentDiv = undefined;
            }

            UserPage.getPageContent = function () {
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                return _contentDiv;
            };

            function _buildContentDiv() {
                _contentDiv = $("<div style='width:100%'/>");
                $("<h2>User page</h2><div>Hi there!</div>").appendTo(_contentDiv);
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

            UserPage();
            return UserPage;
        })();
        Application.UserPage = UserPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));