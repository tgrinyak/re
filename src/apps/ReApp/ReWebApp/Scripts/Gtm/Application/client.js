var Gtm;
(function (Gtm) {
    (function (Application) {

        var Client = (function () {

            function Client() {
            }

            Client.init = function () {
                console.log("test from Gtm.Application.Client.init()");
            };

            return Client;
        })();
        Application.Client = Client;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));