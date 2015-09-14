/*
 * Developer : Morgan
 * Date : 19/5/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("adventureDetail", function($rootScope, $timeout){
    return {
        restrict: "A",
        scope:{adventure: '='},
        templateUrl: 'app/views/adventureDetail.html',
        link: function(scope, element, attrs){
            //var classOnSign = "sign-on";
            //console.log('adventureDetail', scope.adventure);
            if(typeof scope.adventure != 'undefined'){


                scope.members = [];
                scope.invitedEmailMembers = {};

                $rootScope.transferIO.getDetailAdventure(scope.adventure.id, function(data){
                    console.log(data);
                    if(data.error == null){
                        scope.$apply(function(){
                            scope.members = data.result.memberList;
                            
                            scope.invitedEmailMembers = data.result.memberInvitedEmailList;

                        });
                    }
                });



                scope.joinAdventure = function(adventure){
                    $rootScope.eventGotoaAdventure(adventure);
                };

                scope.close_detail_adventure = function () {
                    $rootScope.adventure_detail_list = '';
                };

                scope.gotoCurrentPageOfMember = function(member){

                    $rootScope.goToAdventureWithStartPagePositionMember(scope.adventure.id, member.uid);

                    $rootScope.closeAllBoxesToolbar();
                };

                $(element).find('.scoll-box-ad').mCustomScrollbar();

                scope.$on('$destroy',function(){
                    $(element).find('.scoll-box-ad').mCustomScrollbar('destroy');
                });

            }
        }
    };
});