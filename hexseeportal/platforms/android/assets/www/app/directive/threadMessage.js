/*
 * Developer : Morgan
 * Date : 6/3/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("threadMessage", function($rootScope, $timeout, $compile){
    return {
        restrict: "A",
        scope:{thread: '=',page: '=', adventure:'='},
        templateUrl: 'app/views/threadMessage.html',
        link: function(scope, element, attrs){
            scope.messages = {};

            var messages = [];
            var i = 0;


            angular.forEach(scope.thread.messages, function(message){


                message.page_id = scope.page.id;
                message.threadmessage_id = scope.thread.id;
                message.uri_page = scope.page.uri;
                message.adventure_id = scope.adventure.id;
                message.position = scope.thread.position;

                if(i > 0){
                    message.new = false;
                    messages.push(message);
                }else{
                    scope.firstmessage = message;
                    //console.log('scope.firstmessage.author', scope.firstmessage.author);
                }

                i++;
            });


            //console.log('scope.firstmessage', scope.firstmessage, scope.thread, scope.page);

            scope.messages = messages;

            $rootScope.transferIO.watchMessagesByThreadMessage(scope.thread.id, function (message) {

                if(scope.messages.length > 0){
                    scope.messages[scope.messages.length - 1].new = false;
                }

                message.page_id = scope.page.id;
                message.threadmessage_id = scope.thread.id;
                message.uri_page = scope.page.uri;
                message.adventure_id = scope.adventure.id;
                message.position = scope.thread.position;
                message.new = true;

                scope.$apply(function(){
                    messages.push(message);
                });


            });


            scope.loaded = function(){
                console.log('loaded repeat!');
                scope.loadedThread = true;
            };

            scope.clickReply = function(){
                jQuery('.container-input-box-reply').css('display', 'none');
                element.find('.container-input-box-reply').slideDown().find('input[name="message"]').focus();
            };


            scope.$on('inputCompleteMessage', function(){
                jQuery('.container-input-box-reply').css('display', 'none');
            });




            var el = angular.element('<div class="container-input-box-reply" style="display:none" input-box-reply repliedmessage="firstmessage"></div>');

            var compiled = $compile(el);

            element.append(el);
            compiled(scope);

            var author_el = angular.element('<div class="name-thread"><span user-name uid="firstmessage.author"></span></div>');

            var compiled_author_el = $compile(author_el);

            element.find('.contentThread').prepend(author_el);

            compiled_author_el(scope);

            scope.loadedThread = true;


            /*element.bind("click", function(){
             console.log(attrs);
             alert("This is alert #"+attrs.alert);
             });*/
        }
    };
});