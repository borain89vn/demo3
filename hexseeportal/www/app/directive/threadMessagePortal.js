HexseePortalApp.directive("threadMessagePortal", function($rootScope, $timeout, $interval){
    return {
        restrict: "A",
        scope:{thread: '='},
        templateUrl: 'app/views/boxChatReal.html',
        link: function(scope, element, attrs){
            scope.authData = $rootScope.authData;
            
            scope.message_real_scrollbar = $(element).find('.message-real-SrollBar').mCustomScrollbar();
            scope.inputMessage = function($event){
                
                if($event.keyCode == 13){
                    $event.preventDefault();
                    if(scope.message.trim() != ''){
                        $rootScope.transferIO.post_message(scope.thread.id, scope.message,'text', function(){
                            console.log('success');
                        });

                    }

                    scope.message = '';
                }
            };

            scope.sendMesssageReal = function(){
                scope.inputMessage({keyCode:13,preventDefault:function(){}});
            };



            scope.messages = scope.thread.messages;
            
			

            scope.numberChange = 0;

            scope.scrollBottom = function(){
               
                //console.log('scope.scrollBottom', scope.numberChange);
                if (scope.numberChange <= 10) {
                    scope.message_real_scrollbar.mCustomScrollbar('scrollTo', 'bottom', {timeout: 1});
                    scope.numberChange++;
                } else {
                    scope.numberChange = 0;

                    $interval.cancel(scope.timerBottom);
                }
            };

            $rootScope.transferIO.watchMessagesByThreadMessage(scope.thread.id, function(data){
                scope.$apply(function(){
                    scope.messages.push(data);
                });
                scope.scrollBottom();

                scope.loadedThread = true;
            });


            scope.loaded = function(){
                $(element).find('.message-real-SrollBar').mCustomScrollbar('scrollTo','bottom');
                scope.loadedThread = true;

                $interval.cancel(scope.timerBottom);
                scope.timerBottom = $interval(scope.scrollBottom, 100);
            };

            scope.opacity = 0.9;

            scope.$on('$destroy',function(){
                scope.message_real_scrollbar.mCustomScrollbar('destroy');
            });
            scope.loaded();
        }
    };
});