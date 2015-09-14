HexseePortalApp.directive("sendNewMessage", function ($rootScope) {
	return {
		restrict: "A",
		scope: {
            adventure:'=',
			page: '='
		},
        template:'<input class="inputChat" page="page" placeholder="Type a message here to create a new thread" type="text" ng-model="message" />' +
        '<div class="fl"> <button class="button-send"></button> </div>',
		link: function (scope, element, attrs) {
            scope.message = '';

            var keypress = function ($event) {
				
                if ($event.keyCode == 13) {
					
                    var text = jQuery.trim(scope.message);
					
                     if (typeof scope.page != 'undefined') {
                     $rootScope.SendMessageFirstTime(text , scope.page.id, scope.page.uri);
                     } else{

						 $rootScope.SendMessageFirstTime(text,false,false);
                     }

                }
            }
			
			$(element).on('keypress', keypress);

            $(element).find('.button-send').on('click', function(){
				
                keypress({keyCode:13});
            });
		}
	};
});