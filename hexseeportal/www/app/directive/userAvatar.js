HexseePortalApp.directive("userAvatar", function($rootScope){
    return {
        restrict: "A",
        scope:{uid: '=', width:'='},
        template: '<img ng-src="{{image}}" width="{{width}}"/>',
        link: function(scope, element, attrs){
            //console.log('userAvatar', scope.uid);

            if(typeof scope.uid != 'undefined'){
                /**
                 * if user not avatar then load default avatar
                 * @param {object} avatar
                 */
                scope.loadImage = function(avatar){

                    if(avatar == null){
                        scope.image =  Helpers.avatarDefault;
                        return;
                    }

                    if(jQuery.trim(avatar) == ''){
                        scope.image = Helpers.avatarDefault;
                        return;
                    }

                    scope.image = jQuery.trim(avatar);
                };

                $rootScope.loadAvatarUsersWithObject(scope.uid).then(function(avatar){
                    //console.log('userAvatar directive uid', scope.uid, avatar);
                    scope.loadImage(avatar.data);
                });

                scope.$on('change_avataruser_'+scope.uid, function(event, avatar){
                    //console.log('receive image well,', avatar);
                    scope.$apply(function(){
                        scope.loadImage(avatar.data);
                    });
                });
            }


        }
    };
});