var Gtm;
(function (Gtm) {
    (function (Application) {

        var AdminPage = (function () {

            var _USERS_COUNT = 10;
            var _contentDiv;
            var _titleDiv;
            var _newButton;
            var _searchKeyElem;
            //var _searchSettingsButton;
            var _searchButton;
            var _logoutButton;
            var _userListDiv;
            //var _userListTable;
            //var _userListStorage;
            var _userMeta;

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
                _titleDiv = undefined;
                _newButton = undefined;
                _searchKeyElem = undefined;
                //_searchSettingsButton = undefined;
                _searchButton = undefined;
                _logoutButton = undefined;
                _userListDiv = undefined;
                //_userListTable = undefined;
                //_userListStorage = [];
                _userMeta = [
                    { name: "", dataName: "email" },
                    { name: "", dataName: "role" },
                    { name: "", dataName: "first_name" },
                    { name: "", dataName: "first_name_furigana" },
                    { name: "", dataName: "last_name" },
                    { name: "", dataName: "last_name_furigana" },
                    { name: "", dataName: "date_of_birth" },
                    { name: "", dataName: "sex" },
                    { name: "", dataName: "contact_information" },
                    { name: "", dataName: "post_number" },
                    { name: "", dataName: "address" },
                    { name: "", dataName: "registrated_service" },
                    { name: "", dataName: "loan_payment_period" },
                    { name: "", dataName: "loan_value" }
                ];
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

            AdminPage.getPageContent = function () {
                if ($.isInvalid(_contentDiv)) {
                    _buildContentDiv();
                } else {
                    _resetContentDiv();
                }

                return _contentDiv;
            };

            function _buildContentDiv() {
                _contentDiv = $("<div style='text-align:center;width:80%;margin:auto'/>");

                // title
                _titleDiv = $("<div style='width:100%;display:block;'/>").appendTo(_contentDiv);
                _titleDiv.text(_pageTitle());

                // menu
                var menuDiv = $("<div style='width:100%;display:block;text-align:left'/>").appendTo(_contentDiv);
                _newButton = $("<button>new</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickNew);
                _searchKeyElem = $("<input type='text'/>").appendTo(menuDiv);
                //_searchSettingsButton = $("<button>[]</button>").appendTo(menuDiv)
                //    .button()
                //    .on("click", _onClickSearchSettings);
                _searchButton = $("<button>search</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickSearch);
                _logoutButton = $("<button>log out</button>").appendTo(menuDiv)
                    .button()
                    .on("click", _onClickLogout);

                // user list
                //_userListDiv = $("<div style='overflow-x:scroll;overflow-y:scroll;'/>").appendTo(_contentDiv);
                _userListDiv = $("<div style='text-align:left;overflow-x:scroll;'/>").appendTo(_contentDiv);

                // temp
                $("<h2>Admin page</h2><div>Hi there!</div>").appendTo(_contentDiv);
            }

            function _resetContentDiv() {
                _titleDiv.text(_pageTitle());
                _newButton
                    .on("click", _onClickNew);
                //_searchSettingsButton
                //    .on("click", _onClickSearchSettings);
                _searchButton
                    .on("click", _onClickSearch);
                _logoutButton
                    .on("click", _onClickLogout);
            }

            function _pageTitle()
            {
                return Application.Client.userName() + ":" + Application.Client.userRole();
            }

            function _onClickNew(event) {
                console.log("New clicked");

                // implement new
                // ..
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

            function _onPostLoadComplete(responseData) {
                console.log("Load complete");

                // user list
                var users = responseData.Param.users;
                var userListTable = $("<table class='re-bordered'/>").appendTo(_userListDiv);
                for (var i = 0; i < users.length; ++i) {
                    var row = $("<tr class='re-bordered'/>").appendTo(userListTable);
                    for (var j = 0; j < _userMeta.length; ++j) {
                        var cell = $("<td class='re-bordered'/>").appendTo(row);
                        var cellValue = users[i][_userMeta[j].dataName];
                        if ($.isValid(cellValue)) {
                            cell.text(cellValue);
                        }
                    }
                    row.appendTo(userListTable);
                }

                _userListDiv.empty();
                _userListDiv.append(userListTable);
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));