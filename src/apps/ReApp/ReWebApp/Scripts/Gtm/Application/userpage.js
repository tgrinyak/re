var Gtm;
(function (Gtm) {
    (function (Application) {

        var UserPage = (function () {

            var _contentDiv;
            var _logoutButton;
            var _userInfoDiv;
            var _errorDiv;
            var _errorTextDiv;
            var _backToLoginButton;

            var _userMeta;
            var _texts;

            function UserPage() {
                console.log("test from Gtm.Application.UserPage()");

                _contentDiv = undefined;
                _logoutButton = undefined;
                _userInfoDiv = undefined;
                _errorDiv = undefined;
                _errorTextDiv = undefined;
                _backToLoginButton = undefined;

                _userMeta = [
                    { name: "row0", dataName: "email" },
                    { name: "row1", dataName: "role" },
                    { name: "row2", dataName: "first_name" },
                    { name: "row3", dataName: "first_name_furigana" },
                    { name: "row4", dataName: "last_name" },
                    { name: "row5", dataName: "last_name_furigana" },
                    { name: "row6", dataName: "date_of_birth" },
                    { name: "row7", dataName: "sex" },
                    { name: "row8", dataName: "contact_information" },
                    { name: "row9", dataName: "post_number" },
                    { name: "row10", dataName: "address" },
                    { name: "row11", dataName: "registrated_service" },
                    { name: "row12", dataName: "loan_payment_period" },
                    { name: "row13", dataName: "loan_value" }
                ];
                _texts = {
                    buttonLogoutText: { en: "logout", jp: "ログアウト" },
                    buttonBackToLoginText: { en: "back to login", jp: "ログインに戻る"},
                    userInfoRowTexts: [
                        { en: "e-mail", jp: "メール" },
                        { en: "role", jp: "ユーザー区別" },
                        { en: "first name", jp: "姓" },
                        { en: "first name furigana", jp: "姓（フリガナ）" },
                        { en: "last name", jp: "名" },
                        { en: "last name furigana", jp: "名（フリガナ）" },
                        { en: "date og birth", jp: "生年月日" },
                        { en: "sex", jp: "性別" },
                        { en: "contact information", jp: "連絡先" },
                        { en: "post number", jp: "郵便番号" },
                        { en: "address", jp: "住所" },
                        { en: "registrated service", jp: "登録サービス" },
                        { en: "loan payment period", jp: "ローン支払期間" },
                        { en: "loan value", jp: "ローン支払い金額" }
                    ]
                };
            }

            UserPage.showPage = function (parentElement) {
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                parentElement.empty();
                parentElement.append(_contentDiv);
                $.postJson("User/Load",
                    { userName: Application.Client.userName() },
                    _onPostLoadComplete);
            };

            function _buildContentDiv() {
                //_contentDiv = $("<div style='text-align:center;width:80%;margin:auto'/>");
                _contentDiv = $("<div class='re-content' style='text-align:center;width:80%;height:80%;margin:auto;padding-top:10px;padding-bottom:20px'/>");
                
                // title
                _titleDiv = $("<div class='re-content-title' style='width:100%;display:block;'/>").appendTo(_contentDiv);
                _titleDiv.text(_pageTitle());

                // menu
                var menuDiv = $("<div style='width:100%;display:block;text-align:left'/>").appendTo(_contentDiv);
                _logoutButton = $("<button>" + Application.Client.getText(_texts.buttonLogoutText) + "</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickLogout);

                // user info
                _userInfoDiv = $("<div style='text-align:left;display:none;'/>").appendTo(_contentDiv);

                // error
                _errorDiv = $("<div style='display:none;'/>").appendTo(_contentDiv);
                _errorTextDiv = $("<div style='max-width:640;margin:auto;color:red;'/>").appendTo(_errorDiv);
                _backToLoginButton = $("<button>" + Application.Client.getText(_texts.buttonBackToLoginText) + "</button>").appendTo(_errorDiv)
                    .button()
                    .on("click", _onClickBackToLogin);
            }

            function _resetContentDiv() {
                _logoutButton
                    .on("click", _onClickLogout);
                _userInfoDiv.css("display", "none");
                _errorDiv.css("display", "none");
                _backToLoginButton
                    .on("click", _onClickBackToLogin);
            }

            function _pageTitle() {
                return Application.Client.userNameText() + ":" + Application.Client.userRoleText();
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

            function _onClickBackToLogin(event) {
                console.log("'back to log in' clicked!");

            }

            function _onPostLoadComplete(responseData) {
                console.log("Load complete");

                switch (responseData.ResponseType) {
                    case "success":
                        var user = responseData.Param.user;

                        _userInfoDiv.empty();
                        var userTable = $("<table class='re-bordered'/>").appendTo(_userInfoDiv);
                        for (var i = 0; i < _userMeta.length; ++i) {
                            var row = $("<tr class='re-bordered'/>").appendTo(userTable);
                            var cell = $("<td class='re-bordered'>" + Application.Client.getText(_texts.userInfoRowTexts[i]) + "</td>").appendTo(row);
                            cell = $("<td class='re-bordered'/>").appendTo(row);
                            var rowValue = user[_userMeta[i].dataName];
                            if ($.isValid(rowValue)) {
                                cell.text(rowValue);
                            }
                        }

                        _userInfoDiv.css("display", "block");
                        break;
                    case "error":
                        console.log("[error]: responseData.Param.message: " + responseData.Param.message);
                        $("<p>" + responseData.Param.message + "</p>").appendTo(_errorTextDiv);
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
                //// user list
                //var users = responseData.Param.users;
                //var userListTable = $("<table class='re-bordered'/>").appendTo(_userListDiv);
                //for (var i = 0; i < users.length; ++i) {
                //    var row = $("<tr class='re-bordered'/>").appendTo(userListTable);
                //    for (var j = 0; j < _userMeta.length; ++j) {
                //        var cell = $("<td class='re-bordered'/>").appendTo(row);
                //        var cellValue = users[i][_userMeta[j].dataName];
                //        if ($.isValid(cellValue)) {
                //            cell.text(cellValue);
                //        }
                //    }
                //    row.appendTo(userListTable);
                //}

                //_userListDiv.empty();
                //_userListDiv.append(userListTable);
            }

            UserPage();
            return UserPage;
        })();
        Application.UserPage = UserPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));