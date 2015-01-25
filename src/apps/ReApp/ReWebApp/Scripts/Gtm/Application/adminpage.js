var Gtm;
(function (Gtm) {
    (function (Application) {

        var AdminPage = (function () {

            var _USERS_COUNT = 10;
            var _contentDiv;
            var _titleDiv;
            var _mainMenuDiv;
            var _newButton;
            var _searchKeyElem;
            //var _searchSettingsButton;
            var _searchButton;
            var _logoutButton;

            // user list
            var _userListDiv;

            // new user
            var _newUserDiv;
            var _newUserSubmit;
            var _newUserCancel;
            var _newUserInputElements;
            var _newUserMeta;

            var _userMeta;
            var _texts;

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
                _titleDiv = undefined;
                _mainMenuDiv = undefined;
                _newButton = undefined;
                _searchKeyElem = undefined;
                //_searchSettingsButton = undefined;
                _searchButton = undefined;
                _logoutButton = undefined;
                _userListDiv = undefined;

                _newUserDiv = undefined;
                _newUserSubmit = undefined;
                _newUserCancel = undefined;
                _newUserInputElements = {};
                _newUserMeta = [
                    "email",
                    "role",
                    "password",
                    "password_confirm",
                    "first_name",
                    "first_name_furigana",
                    "last_name",
                    "last_name_furigana",
                    "date_of_birth",
                    "sex",
                    "contact_information",
                    "post_number",
                    "address",
                    "registrated_service",
                    "loan_payment_period",
                    "loan_value"
                ];

                _userMeta = [
                    { name: "colomn1", dataName: "email" },
                    { name: "colomn2", dataName: "role" },
                    { name: "colomn3", dataName: "password" },
                    { name: "colomn4", dataName: "first_name" },
                    { name: "colomn5", dataName: "first_name_furigana" },
                    { name: "colomn6", dataName: "last_name" },
                    { name: "colomn7", dataName: "last_name_furigana" },
                    { name: "colomn8", dataName: "date_of_birth" },
                    { name: "colomn9", dataName: "sex" },
                    { name: "colomn10", dataName: "contact_information" },
                    { name: "colomn11", dataName: "post_number" },
                    { name: "colomn12", dataName: "address" },
                    { name: "colomn13", dataName: "registrated_service" },
                    { name: "colomn14", dataName: "loan_payment_period" },
                    { name: "colomn15", dataName: "loan_value" }
                ];

                _texts = {
                    buttonNewText: { en: "new", jp: "新規" },
                    buttonSearchText: { en: "search", jp: "検索" },
                    buttonLogoutText: { en: "logout", jp: "ログアウト" },
                    buttonUserListRemoveText:{en:"remove", jp:"削除"},
                    buttonUserListEditText:{en:"edit", jp:"編集"},
                    buttonNewUserSubmitText: { en: "submit", jp: "登録" },
                    buttonNewUserCancelText: { en: "cancel", jp: "キャンセル" },

                    metaTexts: {
                        email:{ en: "e-mail", jp: "メール" },
                        role:{ en: "role", jp: "ユーザー区別" },
                        password:{ en: "password", jp: "パスワード" },
                        password_confirm:{ en: "password confirm", jp: "パスワード確認" },
                        first_name:{ en: "first name", jp: "姓" },
                        first_name_furigana:{ en: "first name furigana", jp: "姓（フリガナ）" },
                        last_name:{ en: "last name", jp: "名" },
                        last_name_furigana:{ en: "last name furigana", jp: "名（フリガナ）" },
                        date_of_birth: { en: "date og birth", jp: "生年月日" },
                        sex: { en: "sex", jp: "性別" },
                        contact_information:{ en: "contact information", jp: "連絡先" },
                        post_number:{ en: "post number", jp: "郵便番号" },
                        address:{ en: "address", jp: "住所" },
                        registrated_service:{ en: "registrated service", jp: "登録サービス" },
                        loan_payment_period:{ en: "loan payment period", jp: "ローン支払期間" },
                        loan_value:{ en: "loan value", jp: "ローン支払い金額" }
                    }

                };
            }
            
            AdminPage.showPage = function (parentElement) {
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                parentElement.empty();
                parentElement.append(_contentDiv);
                $.postJson("Admin/Load",
                    {
                        userCount: _USERS_COUNT
                    },
                    _onPostLoadComplete);
            };

            function _buildContentDiv() {
                _contentDiv = $("<div style='text-align:center;width:80%;margin:auto'/>");

                // title
                _titleDiv = $("<div style='width:100%;display:block;'/>").appendTo(_contentDiv);
                _titleDiv.text(_pageTitle());

                // menu
                var menuDiv = $("<div style='width:100%;display:block;text-align:left'/>").appendTo(_contentDiv);
                _mainMenuDiv = $("<div style='display:inline;text-align:left'/>").appendTo(menuDiv);
                _newButton = $("<button>" + Application.Client.getText(_texts.buttonNewText) + "</button>").appendTo(_mainMenuDiv)
                    .button()
                    .on("click", _onClickNew);
                _searchKeyElem = $("<input type='text'/>").appendTo(_mainMenuDiv);
                //_searchSettingsButton = $("<button>[]</button>").appendTo(_mainMenuDiv)
                //    .button()
                //    .on("click", _onClickSearchSettings);
                _searchButton = $("<button>" + Application.Client.getText(_texts.buttonSearchText) + "</button>").appendTo(_mainMenuDiv)
                    .button()
                    .on("click", _onClickSearch);
                _logoutButton = $("<button style='display:inline;text-align:right'>" + Application.Client.getText(_texts.buttonLogoutText) + "</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickLogout);

                // user list
                _userListDiv = $("<div style='text-align:left;overflow-x:scroll;display:none;'/>").appendTo(_contentDiv);

                // new user
                _newUserDiv = $("<div style='text-align:left;display:none;'/>").appendTo(_contentDiv);
            }

            function _resetContentDiv() {
                _titleDiv.text(_pageTitle());
                _mainMenuDiv.css("display", "inherit");
                _newButton
                    .on("click", _onClickNew);
                //_searchSettingsButton
                //    .on("click", _onClickSearchSettings);
                _searchButton
                    .on("click", _onClickSearch);
                _logoutButton
                    .on("click", _onClickLogout);
                _userListDiv.css("display", "none");
                _newUserDiv.css("display", "none");
            }

            function _pageTitle()
            {
                return Application.Client.userNameText() + ":" + Application.Client.userRoleText();
            }

            function _onClickNew(event) {
                console.log("New clicked");

                _newUserDiv.empty();
                var table = $("<table class='re-bordered' style='display:block'/>").appendTo(_newUserDiv);
                for (var i = 0; i < _newUserMeta.length; ++i) {
                    var row = $("<tr class='re-bordered'/>").appendTo(table);
                    var cell = $("<td class='re-bordered'>" + Application.Client.getText(_texts.metaTexts[_newUserMeta[i]]) + "</div>").appendTo(row);
                    cell = $("<td class='re-bordered'/>").appendTo(row);
                    var input = $("<input type='text'/>").appendTo(cell);
                    _newUserInputElements[_newUserMeta[i]] = input;
                }

                var footer = $("<div style='margin:auto;text-align:center'/>").appendTo(_newUserDiv);
                _newUserSubmit = $("<button style='display:inline'>" + Application.Client.getText(_texts.buttonNewUserSubmitText) + "</button>").appendTo(footer)
                    .button()
                    .on("click", _onClickNewUserSubmit);
                _newUserSubmit = $("<button style='display:inline'>" + Application.Client.getText(_texts.buttonNewUserCancelText) + "</button>").appendTo(footer)
                    .button()
                    .on("click", _onClickNewUserCancel);

                _userListDiv.css("display", "none");
                _newUserDiv.css("display", "inherit");
            }

            function _onClickSearch(event) {
                console.log("Search clicked");

                var searchKey = _searchKeyElem.val();
                _searchKeyElem.val("");

                // do search
                // ..
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

            //function _onClickSearchSettings(event) {

            //}

            function _onClickNewUserSubmit(event) {
                
                if (_newUserInputElements.password.val() !== _newUserInputElements.password_confirm.val()) {
                    console.log("password and confirm password are not equal");
                    return;
                }

                user = {};
                for (var i = 0; i < _newUserMeta.length; ++i) {
                    if ("password_confirm" !== _newUserMeta[i]) {
                        var value = _newUserInputElements[_newUserMeta[i]].val();
                        if ($.isValid(value) && "" !== value) {
                            user[_newUserMeta[i]] = value;
                        }
                    }
                }

                var param = {
                    jsonUser: JSON.stringify(user)
                };
                _newUserDiv.css("display", "none");
                //_newUserDiv.empty();
                $.postJson("Admin/NewUser",
                           param,
                           _onPostNewUserComplete);
            }

            function _onClickNewUserCancel(event) {
                _newUserDiv.css("display", "none");
                $.postJson("Admin/Load",
                    {
                        userCount: _USERS_COUNT
                    },
                    _onPostLoadComplete);
            }

            function _onPostLoadComplete(responseData) {
                console.log("Load complete");

                // user list
                _userListDiv.empty();
                var meta = responseData.Param.meta;
                var users = responseData.Param.users;
                var userListTable = $("<table class='re-bordered'/>").appendTo(_userListDiv);
                var headerRow = $("<tr class='re-bordered'/>").appendTo(userListTable);
                for (var i = 0; i < meta.length; ++i) {
                    var cell = $("<th class='re-bordered'>" + Application.Client.getText(_texts.metaTexts[meta[i]]) + "</th>").appendTo(headerRow);
                }
                for (var i = 0; i < users.length; ++i) {
                    var row = $("<tr class='re-bordered'/>").appendTo(userListTable);
                    for (var j = 0; j < meta.length; ++j) {
                        var cell = $("<td class='re-bordered'/>").appendTo(row);
                        var cellValue = users[i][meta[j]];
                        if ($.isValid(cellValue)) {
                            cell.text(cellValue);
                        }
                    }
                    row.appendTo(userListTable);
                }

                _userListDiv.append(userListTable);
                _userListDiv.css("display", "inherit");
            }

            function _onPostNewUserComplete(responseData) {
                console.log("NewUser complete");

                switch (responseData.ResponseType) {
                    case "success":
                        $.postJson("Admin/Load",
                            {
                                userCount: _USERS_COUNT
                            },
                            _onPostLoadComplete);
                        break;
                    case "error":
                        console.log("[error]: responseData.Param.message: " + responseData.Param.message);
                        //$("<p>" + responseData.Param.message + "</p>").appendTo(_errorDiv);
                        if ($.isValid(responseData.Param.exceptionMessage)) {
                            console.log("[error]: responseData.Param.exceptionMessage: " + responseData.Param.exceptionMessage);
                            console.log("[error]: responseData.Param.exceptionType: " + responseData.Param.exceptionType);
                            console.log("[error]: responseData.Param.exceptionStackTrace: " + responseData.Param.exceptionStackTrace);
                            //$("<p>" + responseData.Param.exceptionMessage + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionType + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionStackTrace + "</p>").appendTo(_errorDiv);
                        }
                        _newUserDiv.css("display", "inherit");
                        break;
                    default:
                        console.log("[warn]: unexpected responseData.ResponseType: " + responseData.ResponseType);
                        break;
                }
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));