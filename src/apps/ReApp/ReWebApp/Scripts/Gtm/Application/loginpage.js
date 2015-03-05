var Gtm;
(function (Gtm) {
    (function (Application) {

        var LoginPage = (function () {

            var _contentDiv;
            var _userNameElem;
            var _passwordElem;
            var _signinButton;
            var _errorDiv;

            var _texts;

            function LoginPage() {
                console.log("test from Gtm.Application.LoginPage()");

                _contentDiv = undefined;
                _userNameElem = undefined;
                _passwordElem = undefined;
                _signinButton = undefined;
                _errorDiv = undefined;

                _texts = {
                    welcomeText: { en: "Welcome!", jp: "ようこそ！" },
                    loginText: { en: "log in", jp: "ログイン" }
                };
            }

            LoginPage.showPage = function (parentElement) {
                console.log("test from Gtm.Application.LoginPage.showPage()");

                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                parentElement.empty();
                parentElement.append(_contentDiv);
            };

            function _buildContentDiv() {
                console.log("test from Gtm.Application.LoginPage_buildContentDiv()");

                _contentDiv = $("<div class='container'/>");

                // login sub-content
                var loginSubContentDiv = $("<div class='row'/>").appendTo(_contentDiv);
                var containerDiv = $("<div class='col-md-2 col-md-offset-5 re-bordered'/>").appendTo(loginSubContentDiv);
                var rowDiv = $("<div class='row'/>").appendTo(containerDiv);
                var loginTitle = $("<div class='re-title re-title-lg'>" + Application.Client.getText(_texts.welcomeText) + "</div>").appendTo(rowDiv);

                rowDiv = $("<div class='row re-form-row'/>").appendTo(containerDiv);
                _userNameElem = $("<input class='form-control' type='text'>" + Application.Client.userName() + "</input>").appendTo(rowDiv);

                rowDiv = $("<div class='row re-form-row'/>").appendTo(containerDiv);
                _passwordElem = $("<input class='form-control' type='password'/>").appendTo(rowDiv);

                rowDiv = $("<div class='row re-form-row'/>").appendTo(containerDiv);
                _signinButton = $("<button class='btn btn-default btn-block'>" + Application.Client.getText(_texts.loginText) + "</button>").appendTo(rowDiv)
                    .button()
                    .on("click", _onClickSubmit);

                _errorDiv = $("<div class='row text-center re-error' style='display:none;margin:auto;'/>").appendTo(_contentDiv);
            }

            function _resetContentDiv() {
                _userNameElem.val(Application.Client.userName());
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
                                if ($.isValid(responseData.Param.sqlQuery)) {
                                    console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                                    $("<p>" + responseData.Param.sqlQuery + "</p>").appendTo(_errorDiv);
                                }
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

            function _onPostLoadComplete(responseData) {
                console.log("Load complete");

            }

            LoginPage();
            return LoginPage;
        })();
        Application.LoginPage = LoginPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));