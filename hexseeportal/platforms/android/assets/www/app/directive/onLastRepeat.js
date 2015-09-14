HexseePortalApp.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
        	scope.$eval(attrs.onLastRepeat);

        }, 1);
    };
})

