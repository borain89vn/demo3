HexseePortalApp.directive("userStatus", function ($rootScope) {
    return {
        restrict: "A",
        scope: {
            uid: '='
        },
        link: function (scope, element, attrs) {

            scope.updateClass = function(){
                if(typeof scope.user.status == 'string'){
                    if(scope.user.status == 'online'){
                        element.removeClass('offline-user');
                        element.addClass('online-user');
                    }else{
                        element.removeClass('online-user');
                        element.addClass('offline-user');
                    }
                }
            };

            $rootScope.loadDataUsersWithObject(scope.uid).then(function(dataUser_ob){

                scope.user = dataUser_ob.data;
                scope.updateClass();
            });

            scope.$on('change_userData_'+scope.uid, function(event, userData){
                console.log('receive well,', userData);
                scope.$apply(function(){
                    scope.user = userData.data;
                    scope.updateClass();
                });

            });

        }
    }
});