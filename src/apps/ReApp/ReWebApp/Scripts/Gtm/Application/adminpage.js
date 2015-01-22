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

            function AdminPage() {
                console.log("test from Gtm.Application.AdminPage()");
                _contentDiv = undefined;
                _titleDiv = undefined;
                _newButton = undefined;
                _searchKeyElem = undefined;
                //_searchSettingsButton = undefined;
                _searchButton = undefined;
                _logoutButton = undefined;
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
                _titleDiv = $("<div style='width:100%;display:block;'/>").appendTo(_contentDiv);
                _titleDiv.text(_pageTitle());
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
            }

            AdminPage();
            return AdminPage;
        })();
        Application.AdminPage = AdminPage;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));