var Gtm;
(function (Gtm) {
    (function (app) {
        app.controller("appController", ["$scope", function ($scope) {
            var app = {};

            (function () {
                app.visiblePage = "login";

                $scope.app = app;
            })();

        }]);

        app.controller("loginController", ["$scope", function ($scope) {
            console.log("loginController");
        }]);

        // angular initialization
        // ..
    })(Gtm.app || (Gtm.app = angular.module("Gtm.app", [])));
    var app = Gtm.app;
})(Gtm || (Gtm = {}));