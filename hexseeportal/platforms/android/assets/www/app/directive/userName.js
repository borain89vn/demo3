HexseePortalApp.directive("userName", function($rootScope, $timeout){
    return {
        restrict: "A",
        scope:{uid: '='},
        template: "<span class='firstname-text'>{{user.firstname}}</span> <span class='lastname-text'>{{user.lastname}}</span>",
        link: function(scope, element, attrs){
            //console.log('userData directive uid load done', scope.uid);

            $rootScope.loadDataUsersWithObject(scope.uid).then(function(dataUser_ob){
                //console.log('userData directive uid load done', scope.uid, dataUser_ob);
                $timeout(function(){
                    scope.user = dataUser_ob.data;
                }, 0);
            });

            scope.$on('change_userData_'+scope.uid, function(event, userDataNew){
                //console.log('receive well,', userDataNew);
                $timeout(function(){
                    scope.user = userDataNew.data;
                }, 0);
            });
        }
    };
});