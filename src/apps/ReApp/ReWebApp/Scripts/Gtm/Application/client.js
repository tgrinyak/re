var Gtm;
(function (Gtm) {
    (function (Application) {

        var Client = (function () {

            var currentPage;

            function Client() {
                console.log("test from Gtm.Application.Client()");
                currentPage = "login";
            }

            Client.init = function () {
                console.log("test from Gtm.Application.Client.init()");

                if ("login" !== currentPage) {
                    currentPage = "login";
                }

            };

            Client.showPage = function () {
                var page;
                switch (currentPage) {
                    case "login":
                    default:
                        page = Gtm.Application.LoginPage.getPageContent();
                        break;
                }

                if ($.isValid(page)) {
                    var bodyElement = $(document.body);
                    bodyElement.empty();
                    bodyElement.append(page);
                }
            };

            Client();
            return Client;
        })();
        Application.Client = Client;

    })(Gtm.Application || (Gtm.Application = {}));
    var Application = Gtm.Application;
})(Gtm || (Gtm = {}));