/*
 * Developer : Morgan
 * Date : 20/4/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("notificationAdventure", function ($rootScope, $timeout) {

    return {
        restrict: "AC",
        scope: {
            notification: '='
        },
        templateUrl: 'app/views/notificationAdventure.html',
        link: function (scope, element, attrs) {
            scope.isRemoved = false;

            scope.removeNotification = function () {
                $rootScope.notifications_addedAdventure = [];
            };

            // 15 seconds, off notification
            $timeout(function () {
                if (!scope.isRemoved) {
                    scope.$apply(function () {
                        scope.removeNotification();
                    });
                    if ($rootScope.number_notifications_addedAdventure > 0) {
                        $rootScope.number_notifications_addedAdventure--;
                    }
                    /*$(element).fadeOut('slow', function () {
                        $(element).remove();
                    })*/
                }

            }, 15000);


            $(element).find('.aybt-btn').bind('click', function () {

                $rootScope.eventGotoaAdventure(scope.notification);

                $timeout(function(){
                    scope.removeNotification();

                    if ($rootScope.number_notifications_addedAdventure > 0) {
                        $rootScope.number_notifications_addedAdventure--;
                    }
                }, 0);


                /*$(element).fadeOut('slow', function () {
                    $(element).remove();
                });*/
            });

            $(element).find('.lose-button').bind('click', function () {
                $timeout(function(){
                    scope.removeNotification();

                    if ($rootScope.number_notifications_addedAdventure > 0) {
                        $rootScope.number_notifications_addedAdventure--;
                    }
                }, 0);

                /*$(element).fadeOut('slow', function () {
                    $(element).remove();
                });*/

                /*if ($rootScope.number_notifications_addedAdventure > 0) {
                    $rootScope.number_notifications_addedAdventure--;

                }*/
            })
        }
    };
});