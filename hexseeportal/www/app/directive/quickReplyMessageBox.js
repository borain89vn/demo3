/*
 * Developer : Morgan
 * Date : 6/2/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("quickReplyMessageBox", function($rootScope){
    return {
        restrict: "A",
        scope:{notification: '=', uid:'@', firstname:'@',lastname:'@'},
        templateUrl: 'app/views/quickReplyMessage.html',
        link: function(scope, element, attrs){

            console.log('quickReplyMessageBox', scope.notification);

            scope.closeQuickBoxReply = function(){
                $rootScope.willReplyMessageNotification = [];
            };

            scope.$on('inputCompleteMessage', function(){
                scope.closeQuickBoxReply();
            });
        }
    };
});