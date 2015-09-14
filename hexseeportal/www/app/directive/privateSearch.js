HexseePortalApp.directive("privateSearch", function ($rootScope, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).keyup(function (event) {
                if (event.keyCode == 13) {
                    var _value = $(this).val();
                    if (_value == null || _value == "" || typeof _value == "undefined") {
                        return false;
                    } else {
                        window.open('https://duckduckgo.com/?q=' + _value);
                    }
                }
            })
        }
    };
});