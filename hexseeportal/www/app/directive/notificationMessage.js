HexseePortalApp.directive("notificationMessage", function ($rootScope, $location,$timeout) {
    return {
        restrict: "AC",
        scope: {
            notification: '='
        },
        templateUrl: 'app/views/notificationMessage.html',
        link: function (scope, element, attrs) {
            scope.isRemoved = false;


            $(element).find('.messagwd').bind('click', function () {
//                $timeout(function () {
//                    $location.path('/timeline');
//                });
            });

            scope.replyMessageNotification = function () {
				
                $rootScope.willReplyMessageNotification = [scope.notification];

            };
        }
    };
});