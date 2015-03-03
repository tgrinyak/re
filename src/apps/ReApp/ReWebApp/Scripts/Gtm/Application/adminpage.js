var Gtm;
(function (Gtm) {
    (function (Application) {

        var AdminPage = (function () {

            var _USERS_COUNT = 10;
            var _contentDiv;
            var _titleDiv;
            var _userListMenuDiv;
            var _newButton;
            var _searchKeyElem;
            //var _searchSettingsButton;
            var _searchButton;
            var _logoutButton;

            // user list
            var _userListDiv;
            var _userListMeta;

            // new user
            var _newUserDiv;
            var _newUserSubmit;
            var _newUserCancel;
            var _newUserInputElements;
            var _newUserMeta;

            // edit user
            var _editUserDiv;
            var _editUserSubmit;
            var _editUserCancel;
            var _editUserInputElements;
            var _editUserMeta;

            var _texts;

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
                _titleDiv = undefined;
                _userListMenuDiv = undefined;
                _newButton = undefined;
                _searchKeyElem = undefined;
                //_searchSettingsButton = undefined;
                _searchButton = undefined;
                _logoutButton = undefined;
                _userListDiv = undefined;
                _userListMeta = [];

                // new user
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

                // edit user
                _editUserDiv = undefined;
                _editUserSubmit = undefined;
                _editUserCancel = undefined;
                _editUserInputElements = {};
                _editUserMeta = [
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

                _texts = {
                    buttonNewText: { en: "new", jp: "新規" },
                    buttonSearchText: { en: "search", jp: "検索" },
                    buttonLogoutText: { en: "logout", jp: "ログアウト" },
                    buttonUserListRemoveText: { en: "remove", jp: "削除" },
                    removeConfirmMessageText: { en: "remove user?", jp: "ユーザーを削除しますか？" },
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
                //_contentDiv = $("<div class='re-content' style='text-align:center;width:80%;height:80%;margin:auto;padding-top:10px;padding-bottom:20px'/>");
                _contentDiv = $("<div class='re-content-wide'/>");

                // title
                //_titleDiv = $("<div class='re-content-title' style='width:100%;display:block;'/>").appendTo(_contentDiv);
                _titleDiv = $("<div class='re-content-title-wide'/>").appendTo(_contentDiv);
                _titleDiv.text(_pageTitle());

                // menu
                var menuDiv = $("<div style='width:100%;display:block;text-align:left'/>").appendTo(_contentDiv);
                _userListMenuDiv = $("<div style='display:none;text-align:left'/>").appendTo(menuDiv);
                _newButton = $("<button>" + Application.Client.getText(_texts.buttonNewText) + "</button>").appendTo(_userListMenuDiv)
                    .button()
                    .on("click", _onClickNew);
                _searchKeyElem = $("<input type='text'/>").appendTo(_userListMenuDiv);
                //_searchSettingsButton = $("<button>[]</button>").appendTo(_userListMenuDiv)
                //    .button()
                //    .on("click", _onClickSearchSettings);
                _searchButton = $("<button>" + Application.Client.getText(_texts.buttonSearchText) + "</button>").appendTo(_userListMenuDiv)
                    .button()
                    .on("click", _onClickSearch);
                _logoutButton = $("<button style='display:inline;text-align:right'>" + Application.Client.getText(_texts.buttonLogoutText) + "</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickLogout);

                // user list
                _userListDiv = $("<div style='text-align:left;overflow-x:scroll;display:none;'/>").appendTo(_contentDiv);

                // new user
                _newUserDiv = $("<div style='text-align:left;display:none;'/>").appendTo(_contentDiv);

                // edit user
                _editUserDiv = $("<div style='text-align:left;display:none;'/>").appendTo(_contentDiv);
            }

            function _resetContentDiv() {
                _titleDiv.text(_pageTitle());
                //_userListMenuDiv.css("display", "inline");
                _newButton
                    .on("click", _onClickNew);
                //_searchSettingsButton
                //    .on("click", _onClickSearchSettings);
                _searchButton
                    .on("click", _onClickSearch);
                _logoutButton
                    .on("click", _onClickLogout);
                _userListMenuDiv.css("display", "none");
                _userListDiv.css("display", "none");
                _newUserDiv.css("display", "none");
                _editUserDiv.css("display", "none");
            }

            function _pageTitle()
            {
                return Application.Client.userNameText() + ":" + Application.Client.userRoleText();
            }

            function _getSearchKey() {
                return _userListMeta[0];
            }

            function _onClickNew(event) {
                console.log("New clicked");

                _newUserDiv.empty();
                var table = $("<table class='re-bordered' style='margin:left;'/>").appendTo(_newUserDiv);
                for (var i = 0; i < _newUserMeta.length; ++i) {
                    var row = $("<tr class='re-bordered'/>").appendTo(table);
                    var cell = $("<td class='re-bordered'>" + Application.Client.getText(_texts.metaTexts[_newUserMeta[i]]) + "</div>").appendTo(row);
                    cell = $("<td class='re-bordered'/>").appendTo(row);
                    var input;
                    switch (_newUserMeta[i]) {
                        case "password":
                            input = $("<input type='password'/>").appendTo(cell);
                            break;
                        case "password_confirm":
                            input = $("<input type='password'/>").appendTo(cell);
                            break;
                        default:
                            input = $("<input type='text'/>").appendTo(cell);
                            break;
                    }
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
                _userListMenuDiv.css("display", "none");
                _newUserDiv.css("display", "inherit");
            }

            function _onClickSearch(event) {
                console.log("Search clicked");

                var searchKey = _searchKeyElem.val();

                if ($.isValid(searchKey) && "" !== searchKey) {
                    $.postJson("Admin/Search",
                        {
                            userCount: _USERS_COUNT,
                            key: _getSearchKey(),
                            pattern: searchKey
                        },
                        _onPostLoadComplete);
                }
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

            function _onClickEditUserSubmit(event) {

                if (_editUserInputElements.password.val() !== _editUserInputElements.password_confirm.val()) {
                    console.log("password and confirm password are not equal");
                    return;
                }

                user = {};
                for (var i = 0; i < _editUserMeta.length; ++i) {
                    if ("password_confirm" !== _editUserMeta[i]) {
                        var value = _editUserInputElements[_editUserMeta[i]].val();
                        if ($.isValid(value) && "" !== value) {
                            user[_editUserMeta[i]] = value;
                        }
                    }
                }

                var param = {
                    jsonUser: JSON.stringify(user)
                };
                _editUserDiv.css("display", "none");
                $.postJson("Admin/EditSubmit",
                           param,
                           _onPostEditUserSubmitComplete);
            }

            function _onClickEditUserCancel(event) {
                _editUserDiv.css("display", "none");
                $.postJson("Admin/Load",
                    {
                        userCount: _USERS_COUNT
                    },
                    _onPostLoadComplete);
            }

            function _onPostLoadComplete(responseData) {
                console.log("Load complete");

                switch (responseData.ResponseType) {
                    case "success":
                        _userListDiv.empty();
                        _userListMeta = responseData.Param.meta;
                        var users = responseData.Param.users;
                        var userListTable = $("<table class='re-bordered' style='margin:left;'/>").appendTo(_userListDiv);
                        var headerRow = $("<tr class='re-bordered'/>").appendTo(userListTable);
                        $("<th class='re-bordered'>" + "</th>").appendTo(headerRow);
                        $("<th class='re-bordered'>" + "</th>").appendTo(headerRow);
                        for (var i = 0; i < _userListMeta.length; ++i) {
                            var cell = $("<th class='re-bordered'>" + Application.Client.getText(_texts.metaTexts[_userListMeta[i]]) + "</th>").appendTo(headerRow);
                        }
                        for (var i = 0; i < users.length; ++i) {
                            var row = $("<tr class='re-bordered'/>").appendTo(userListTable);
                            var cell = $("<td class='re-bordered'/>").appendTo(row);
                            var email = users.email;
                            $("<button id='edit-" + users[i].email + "'>" + Application.Client.getText(_texts.buttonUserListEditText) + "</button>").appendTo(cell)
                                .button()
                                .on("click", function (event) {
                                    _editUser($(this)[0].id.split("-")[1]);
                                });
                            cell = $("<td class='re-bordered'/>").appendTo(row);
                            $("<button id='remove-" + users[i].email + "'>" + Application.Client.getText(_texts.buttonUserListRemoveText) + "</button>").appendTo(cell)
                                .button()
                                .on("click", function (event) {
                                    var un = $(this)[0].id.split("-")[1];
                                    if (confirm(Application.Client.getText(_texts.removeConfirmMessageText))) {
                                        _removeUser(un);
                                    }
                                });
                            for (var j = 0; j < _userListMeta.length; ++j) {
                                cell = $("<td class='re-bordered'/>").appendTo(row);
                                var cellValue = users[i][_userListMeta[j]];
                                if ($.isValid(cellValue)) {
                                    cell.text(cellValue);
                                }
                            }
                            row.appendTo(userListTable);
                        }

                        _userListDiv.append(userListTable);
                        _userListDiv.css("display", "inherit");
                        _userListMenuDiv.css("display", "inline");
                        break;
                    case "error":
                        console.log("[error]: responseData.Param.message: " + responseData.Param.message);
                        //$("<p>" + responseData.Param.message + "</p>").appendTo(_errorDiv);
                        if ($.isValid(responseData.Param.exceptionMessage)) {
                            if ($.isValid(responseData.Param.sqlQuery)) {
                                console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                            }
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
                            if ($.isValid(responseData.Param.sqlQuery)) {
                                console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                            }
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

            function _onPostEditLoadComplete(responseData) {
                console.log("EditLoad complete");

                switch (responseData.ResponseType) {
                    case "success":
                        var user = responseData.Param.user;
                        _editUserDiv.empty();
                        var table = $("<table class='re-bordered' style='margin:left;'/>").appendTo(_editUserDiv);
                        for (var i = 0; i < _editUserMeta.length; ++i) {
                            var row = $("<tr class='re-bordered'/>").appendTo(table);
                            var cell = $("<td class='re-bordered'>" + Application.Client.getText(_texts.metaTexts[_editUserMeta[i]]) + "</div>").appendTo(row);
                            cell = $("<td class='re-bordered'/>").appendTo(row);
                            var input;
                            switch (_editUserMeta[i]) {
                                case "email":
                                    input = $("<input type='text' readonly/>").appendTo(cell);
                                    break;
                                case "password":
                                    input = $("<input type='password'/>").appendTo(cell);
                                    break;
                                case "password_confirm":
                                    input = $("<input type='password'/>").appendTo(cell);
                                    break;
                                default:
                                    input = $("<input type='text'/>").appendTo(cell);
                                    break;
                            }
                            var value = user[_editUserMeta[i]];
                            if ($.isValid(value)) {
                                input.val(value);
                            }
                            _editUserInputElements[_editUserMeta[i]] = input;
                        }

                        var footer = $("<div style='margin:auto;text-align:center'/>").appendTo(_editUserDiv);
                        _editUserSubmit = $("<button style='display:inline'>" + Application.Client.getText(_texts.buttonNewUserSubmitText) + "</button>").appendTo(footer)
                            .button()
                            .on("click", _onClickEditUserSubmit);
                        _editUserSubmit = $("<button style='display:inline'>" + Application.Client.getText(_texts.buttonNewUserCancelText) + "</button>").appendTo(footer)
                            .button()
                            .on("click", _onClickEditUserCancel);

                        _userListDiv.css("display", "none");
                        _userListMenuDiv.css("display", "none");
                        _editUserDiv.css("display", "inherit");
                        break;
                    case "error":
                        console.log("[error]: responseData.Param.message: " + responseData.Param.message);
                        //$("<p>" + responseData.Param.message + "</p>").appendTo(_errorDiv);
                        if ($.isValid(responseData.Param.exceptionMessage)) {
                            if ($.isValid(responseData.Param.sqlQuery)) {
                                console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                            }
                            console.log("[error]: responseData.Param.exceptionMessage: " + responseData.Param.exceptionMessage);
                            console.log("[error]: responseData.Param.exceptionType: " + responseData.Param.exceptionType);
                            console.log("[error]: responseData.Param.exceptionStackTrace: " + responseData.Param.exceptionStackTrace);
                            //$("<p>" + responseData.Param.exceptionMessage + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionType + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionStackTrace + "</p>").appendTo(_errorDiv);
                        }
                        break;
                    default:
                        console.log("[warn]: unexpected responseData.ResponseType: " + responseData.ResponseType);
                        break;
                }
            }

            function _onPostEditUserSubmitComplete(responseData) {
                console.log("EditSubmit complete");

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
                            if ($.isValid(responseData.Param.sqlQuery)) {
                                console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                            }
                            console.log("[error]: responseData.Param.exceptionMessage: " + responseData.Param.exceptionMessage);
                            console.log("[error]: responseData.Param.exceptionType: " + responseData.Param.exceptionType);
                            console.log("[error]: responseData.Param.exceptionStackTrace: " + responseData.Param.exceptionStackTrace);
                            //$("<p>" + responseData.Param.exceptionMessage + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionType + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionStackTrace + "</p>").appendTo(_errorDiv);
                        }
                        _editUserDiv.css("display", "inherit");
                        break;
                    default:
                        console.log("[warn]: unexpected responseData.ResponseType: " + responseData.ResponseType);
                        break;
                }
            }

            function _onPostRemoveComplete(responseData) {
                console.log("Remove complete");

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
                            if ($.isValid(responseData.Param.sqlQuery)) {
                                console.log("[error]: responseData.Param.sqlQuery: " + responseData.Param.sqlQuery);
                            }
                            console.log("[error]: responseData.Param.exceptionMessage: " + responseData.Param.exceptionMessage);
                            console.log("[error]: responseData.Param.exceptionType: " + responseData.Param.exceptionType);
                            console.log("[error]: responseData.Param.exceptionStackTrace: " + responseData.Param.exceptionStackTrace);
                            //$("<p>" + responseData.Param.exceptionMessage + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionType + "</p>").appendTo(_errorDiv);
                            //$("<p>" + responseData.Param.exceptionStackTrace + "</p>").appendTo(_errorDiv);
                        }
                        break;
                    default:
                        console.log("[warn]: unexpected responseData.ResponseType: " + responseData.ResponseType);
                        break;
                }
            }

            function _editUser(email) {
                console.log("_editUser: email: " + email);

                $.postJson("Admin/EditLoad",
                    {
                        userName: email
                    },
                    _onPostEditLoadComplete);
            }

            function _removeUser(email) {
                console.log("_removeUser: email: " + email);

                $.postJson("Admin/Remove",
                    {
                        userName: email
                    },
                    _onPostRemoveComplete);
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));