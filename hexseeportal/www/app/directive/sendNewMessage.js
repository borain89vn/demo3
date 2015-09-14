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
						console.log(111);
                     $rootScope.SendMessageFirstTime(text , scope.page.id, scope.page.uri);
                     } else{
						console.log(222);
						 $rootScope.SendMessageFirstTime(text,false,false);
                     }
//                    if(text != ''){
//                        $rootScope.transferIO.create_thread_message_in_page(scope.adventure.id, scope.page.id, scope.page.uri, text, 'text', 0, 0, function (respone) {
//                            console.log('done', respone);
//                        });
//                    }
                }
            }
			
			$(element).on('keypress', keypress);

            $(element).find('.button-send').on('click', function(){
				
                keypress({keyCode:13});
            });
		}
	};
});