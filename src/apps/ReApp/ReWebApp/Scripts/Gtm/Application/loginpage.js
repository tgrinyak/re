var Gtm;
(function (Gtm) {
    (function (Application) {

        var LoginPage = (function () {

            var _userName;
            var _contentDiv;
            var _userNameElem;
            var _passwordElem;
            var _signinButton;
            var _errorDiv;

            function LoginPage() {
                console.log("test from Gtm.Application.LoginPage()");
                _userName = "";
                _contentDiv = undefined;
                _userNameElem = undefined;
                _passwordElem = undefined;
                _signinButton = undefined;
                _errorDiv = undefined;
            }

            LoginPage.getPageContent = function (userName) {
                if ($.isInvalid(userName)) {
                    //_userName = "";
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
                _contentDiv = $("<div style='text-align:center;width:100%'/>");

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
                _signinButton = $("<button style='width:100%'>sign in</button>").appendTo(cell).button()
                    .on("click", _onClickSubmit);

                _errorDiv = $("<div style='display:none;max-width:640;margin:auto;color:red'/>").appendTo(_contentDiv);
            }

            function _resetContentDiv() {
                _userNameElem.val(_userName);
                _passwordElem.val("");
                _signinButton
                    .on("click", _onClickSubmit);
            }

            function _onClickSubmit(event) {
                var self = $(this);
                self.prop("disabled", true);
                console.log("'sign in' clicked!");
                var userName = _userNameElem.val();
                var password = _passwordElem.val();
                _passwordElem.val("");
                console.log("un: " + userName + ", pw: " + password);
                var param = {
                    un: userName,
                    pw: password
                };
                $.postJson("Login/login", param, function (responseData) {
                    console.log("login accomplished, ResponseType: " + responseData.ResponseType);
                    _errorDiv.css("display", "none");
                    _errorDiv.empty();
                    switch (responseData.ResponseType) {
                        case "success":
                            Gtm.Application.Client.loginComplete(responseData.Param.csid,
                                                                 responseData.Param.uName,
                                                                 responseData.Param.uRole.toLowerCase());
                            break;
                        case "error":
                            console.log("[error]: responseData.Param.message: " + responseData.Param.message);
                            $("<p>" + responseData.Param.message + "</p>").appendTo(_errorDiv);
                            if ($.isValid(responseData.Param.exceptionMessage)) {
                                console.log("[error]: responseData.Param.exceptionMessage: " + responseData.Param.exceptionMessage);
                                console.log("[error]: responseData.Param.exceptionType: " + responseData.Param.exceptionType);
                                console.log("[error]: responseData.Param.exceptionStackTrace: " + responseData.Param.exceptionStackTrace);
                                $("<p>" + responseData.Param.exceptionMessage + "</p>").appendTo(_errorDiv);
                                $("<p>" + responseData.Param.exceptionType + "</p>").appendTo(_errorDiv);
                                $("<p>" + responseData.Param.exceptionStackTrace + "</p>").appendTo(_errorDiv);
                            }
                            _errorDiv.css("display", "block");
                            break;
                        default:
                            console.log("[warn]: unexpected responseData.ResponseType: " + responseData.ResponseType);
                            break;
                    }
                    self.prop("disabled", false);
                });
            }

            LoginPage();
            return LoginPage;
        })();
        Application.LoginPage = LoginPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));