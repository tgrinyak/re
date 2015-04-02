var Gtm;
(function (Gtm) {
    (function (app) {

        // services
        app.service("shareService", ["$rootScope", function ($rootScope) {
            this._session = {};

            this.session = function () {
                return this._session;
            }
            this.resetSession = function () {
                this._session = {
                    _csid: "",
                    csid: function (newCsid) {
                        if (undefined !== newCsid && null !== newCsid) {
                            this._csid = newCsid;
                            //$rootScope.$broadcast('ss_onChannelListChanged');
                        }
                        return this._csid;
                    },

                    _localization: "jp",
                    localization: function (newLocalization) {
                        if (undefined !== newLocalization && null !== newLocalization) {
                            this._localization = newLocalization;
                        }
                        return this._localization;
                    },

                    _userName: "",
                    userName: function (newUserName) {
                        if (undefined !== newUserName && null !== newUserName) {
                            this._userName = newUserName;
                        }
                        return this._userName;
                    },

                    _userRole: "unknown",
                    userRole: function (newUserRole) {
                        if (undefined !== newUserRole && null !== newUserRole) {
                            this._userRole = newUserRole;
                        }
                        return this._userRole;
                    }
                };
            };

            (function (self) {
                self.resetSession();
            })(this);
        }]);

        app.service("gtmHttp", ["$http", "shareService", function ($http, shareService) {
            this.get = function (url, data) {
                return $http({ method: "GET", url: this.getUrl(url), data: data })
            };

            this.post = function (url, data) {
                return $http({ method: "POST", url: this.getUrl(url), data: data })
            };

            this.getUrl = function (url) {
                var csid = shareService.session().csid();
                if (undefined !== csid) {
                    var splittedUtl = url.split("?");
                    if (1 === splittedUtl.length) {
                        url += "?csid=" + csid;
                    } else {
                        url += "&csid=" + csid;
                    }
                }
                var localization = shareService.session().localization();
                if (undefined !== localization) {
                    var splittedUtl = url.split("?");
                    if (1 === splittedUtl.length) {
                        url += "?localization=" + localization;
                    } else {
                        url += "&localization=" + localization;
                    }
                }
                return url;
            };
        }]);

        // controllers
        app.controller("appController", ["$scope", "$rootScope", "shareService", function ($scope, $rootScope, shareService) {
            var app = {
                visiblePage: "login",
                getVisiblePage: function () {
                    return this.visiblePage;
                }
            };

            (function () {
                $scope.app = app;

                $scope.$on('lc_onLoginSucceed', function (event, arg) {
                    console.log('lc_onLoginSucceed(' + arg + ')');
                    var session = shareService.session();
                    session.csid(arg.csid);
                    session.userName(arg.uName);
                    session.userRole(arg.uRole.toLowerCase());
                    $scope.app.visiblePage = session.userRole();
                    $rootScope.$broadcast("ac_onLoginSucceed", session.userRole());
                });

                $scope.$on('ac_onLogout', function (event, arg) {
                    console.log('ac_onLogout(' + arg + ')');
                    var session = shareService.resetSession();
                    $scope.app.visiblePage = "login";
                });

                $scope.$on('uc_onLogout', function (event, arg) {
                    console.log('ac_onLogout(' + arg + ')');
                    var session = shareService.resetSession();
                    $scope.app.visiblePage = "login";
                });

            })();

        }]);

        app.controller("loginController", ["$scope", "$rootScope", "gtmHttp", "shareService", function ($scope, $rootScope, gtmHttp, shareService) {

            var texts = {
                welcomText: "ようこそ！",
                loginText: "ログイン"
            };

            var credentials = {
                userName: "",
                password: ""
            };

            var error = undefined;

            var funcs = {
                loginClickAction: function () {
                    console.log("loginClickAction()");
                    if (undefined !== $scope.error) {
                        $scope.error = undefined;
                    }

                    var param = {
                        un: $scope.credentials.userName,
                        pw: $scope.credentials.password
                    };
                    $scope.credentials.password = "";

                    gtmHttp.post("Login/login", param)
                        .success(function (data, status, headers, config) {
                            console.log("loginClickAction(): login succeed, ResponseType: " + data.ResponseType);
                            switch (data.ResponseType) {
                                case "success":
                                    $rootScope.$broadcast("lc_onLoginSucceed", data.Param);
                                    break;
                                case "error":
                                    $scope.error = data.Param;
                                    break;
                            }
                        })
                        .error(function (data, status, headers, config) {
                            console.log("loginClickAction(): post error, status: " + status);
                        });
                }
            };

            (function () {
                $scope.texts = texts;
                $scope.credentials = credentials;
                $scope.error = error;
                $scope.funcs = funcs;
            })();
        }]);

        app.controller("adminController", ["$scope", "$rootScope", "gtmHttp", "shareService", function ($scope, $rootScope, gtmHttp, shareService) {

            var _roleTexts = {
                admin: "管理者",
                user: "ユーザー",
                unknown: "不明"
            };

            var texts = {
                buttonNewText: "新規",
                buttonSearchText: "検索",
                buttonLogoutText: "ログアウト",
                buttonUserListRemoveText: "削除",
                removeConfirmMessageText: "ユーザーを削除しますか？",
                buttonUserListEditText: "編集",
                buttonNewUserSubmitText: "登録",
                buttonNewUserCancelText: "キャンセル"
            };

            var isActionsDisabled = false;
            var error = undefined;

            var funcs = {
                title: function () {
                    var session = shareService.session();
                    var userName = session.userName();
                    var userRole = session.userRole();
                    return ((undefined !== userName) ? userName : "")
                        + " - "
                        + ((undefined !== userRole) ? _roleTexts[userRole] : _roleTexts["unknown"]);
                },

                logoutAction: function () {
                    if (!isActionsDisabled) {
                        console.log("'log out' clicked!");
                        isActionsDisabled = true;
                        if (undefined !== $scope.error) {
                            $scope.error = undefined;
                        }

                        gtmHttp.post("Login/logout", {})
                            .success(function (data, status, headers, config) {
                                console.log("logoutAction(): logout succeed, ResponseType: " + data.ResponseType);
                                $rootScope.$broadcast("ac_onLogout", data.Param);
                                isActionsDisabled = false;
                            })
                            .error(function (data, status, headers, config) {
                                console.log("logoutAction(): loginClick() post error, status: " + status);
                                $rootScope.$broadcast("ac_onLogout", data);
                                isActionsDisabled = false;
                            });
                    }
                }
            };

            (function () {
                $scope.texts = texts;
                $scope.error = error;
                $scope.funcs = funcs;
            })();
        }]);

        app.controller("userController", ["$scope", "$rootScope", "gtmHttp", "shareService", function ($scope, $rootScope, gtmHttp, shareService) {

            var _roleTexts = {
                admin: "管理者",
                user: "ユーザー",
                unknown: "不明"
            };

            var texts = {
                buttonLogoutText: "ログアウト",
                buttonBackToLoginText: "ログインに戻る"
            };

            var isActionsDisabled = false;
            var error = undefined;

            var metas = [];
            var user = {};

            var funcs = {
                title: function () {
                    var session = shareService.session();
                    var userName = session.userName();
                    var userRole = session.userRole();
                    return ((undefined !== userName) ? userName : "")
                        + " - "
                        + ((undefined !== userRole) ? _roleTexts[userRole] : _roleTexts["unknown"]);
                },

                logoutAction: function () {
                    if (!isActionsDisabled) {
                        console.log("'log out' clicked!");
                        isActionsDisabled = true;
                        $scope.metas = [];
                        $scope.user = {};
                        if (undefined !== $scope.error) {
                            $scope.error = undefined;
                        }

                        gtmHttp.post("Login/logout", {})
                            .success(function (data, status, headers, config) {
                                console.log("logoutAction(): logout succeed, ResponseType: " + data.ResponseType);
                                $rootScope.$broadcast("uc_onLogout", data.Param);
                                isActionsDisabled = false;
                            })
                            .error(function (data, status, headers, config) {
                                console.log("logoutAction(): loginClick() post error, status: " + status);
                                $rootScope.$broadcast("uc_onLogout", data);
                                isActionsDisabled = false;
                            });
                    }
                },

                load: function () {
                    console.log("userController.load()");

                    var session = shareService.session();
                    isActionsDisabled = true;
                    if (undefined !== $scope.error) {
                        $scope.error = undefined;
                    }

                    gtmHttp.post("User/Load", {userName: session.userName()})
                        .success(function (data, status, headers, config) {
                            console.log("loadAction(): load succeed, ResponseType: " + data.ResponseType);
                            switch (data.ResponseType) {
                                case "success":
                                    $scope.metas = data.Param.metas;
                                    $scope.user = data.Param.user;
                                    break;
                                case "error":
                                    $scope.error = data.Param;
                                    break;
                            }
                            isActionsDisabled = false;
                        })
                        .error(function (data, status, headers, config) {
                            console.log("loadAction(): load post error, status: " + status);
                            isActionsDisabled = false;
                        });
                }
            };

            (function () {
                $scope.texts = texts;
                $scope.error = error;
                $scope.metas = metas;
                $scope.user = user;
                $scope.funcs = funcs;

                $scope.$on('ac_onLoginSucceed', function (event, arg) {
                    console.log('userController.ac_onLoginSucceed(' + arg + ')');
                    if ('user' !== arg) {
                        return;
                    }

                    $scope.funcs.load();
                });


            })();
        }]);

        // angular initialization
        // ..
    })(Gtm.app || (Gtm.app = angular.module("Gtm.app", [])));
    var app = Gtm.app;
})(Gtm || (Gtm = {}));