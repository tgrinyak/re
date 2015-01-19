var Gtm;
(function (Gtm) {
    (function (Application) {

        var _userName;
        var _contentDiv;
        var _userNameElem;
        var _passwordElem;

        var LoginPage = (function () {

            function LoginPage() {
                console.log("test from Gtm.Application.LoginPage()");
                _userName = "";
                _contentDiv = undefined;
                _userNameElem = undefined;
                _passwordElem = undefined;
            }

            LoginPage.getPageContent = function (userName) {
                if ($.isInvalid(userName)) {
                    _userName = "";
                } else {
                    _userName = userName;
                }
                                
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                return _contentDiv;
            };

            function _buildContentDiv() {
                _contentDiv = $("<div style='width:100%'/>");

                //var loginDiv = $("<div style='margin:auto'/>").appendTo(_contentDiv);
                var loginTable = $("<table style='margin:auto'/>").appendTo(_contentDiv);
                var row = $("<tr/>").appendTo(loginTable);
                var cell = $("<td/>").appendTo(row);
                $("<div style='margin:auto'>Welcome!</div>").appendTo(cell);

                row = $("<tr/>").appendTo(loginTable);
                cell = $("<td/>").appendTo(row);
                _userNameElem = $("<input type='text'>" + _userName + "</input>").appendTo(cell);

                row = $("<tr/>").appendTo(loginTable);
                cell = $("<td/>").appendTo(row);
                _passwordElem = $("<input type='password'/>").appendTo(cell);

                row = $("<tr/>").appendTo(loginTable);
                cell = $("<td/>").appendTo(row);
                // login submite button
                var loginSubmitButtonDiv = $("<button style='width:100%'>sign in</button>").appendTo(cell)
                    .button()
                    .click(function (event) {
                        console.log("loginSubmitButton clicked!");
                        var userName = _userNameElem.val();
                        var password = _passwordElem.val();
                        _passwordElem.val("");
                        console.log("un: " + userName + ", pw: " + password);
                    });
            }

            function _resetContentDiv() {
                _userNameElem.val(_userName);
                _passwordElem.val("");
            }

            LoginPage();
            return LoginPage;
        })();
        Application.LoginPage = LoginPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));