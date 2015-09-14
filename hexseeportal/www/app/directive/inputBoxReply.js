/*
 * Developer : Morgan
 * Date : 6/3/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("inputBoxReply", function ($rootScope, $timeout) {
	return {
		restrict: "A",
		scope: {
			repliedmessage: '='
		},
		templateUrl: 'app/views/inputBoxReply.html',
		link: function (scope, element, attrs) {

			//console.log('scope.repliedmessage', scope.repliedmessage);

			scope.inputMessage = function ($event) {
				if ($event.keyCode == 13) {
					$event.preventDefault();
					var _v = $(element).find('input').val();
					if (_v) {
						$timeout(function () {
							$rootScope.transferIO.post_message(scope.repliedmessage.threadmessage_id, _v, 'text', function (respone) {
								console.log(respone);
								if (respone.message_id) {
									console.log("successful");
									//$('.main-scroll-timeline').scrollTop({})
									$timeout(function () {
										$(".main-scroll-timeline").animate({
											scrollTop: $('.main-scroll-timeline').find('ul').height()
										}, "slow");
									},0)
								}
							});
						}, 0)
					}
					scope.message = '';
					scope.$emit('inputCompleteMessage');
				} else if ($event.keyCode == 27) {
					scope.$emit('inputCompleteMessage');
				}


			};

			scope.sendMesssageReal = function () {
				console.log(scope.repliedmessage.threadmessage_id);
				scope.inputMessage({
					keyCode: 13,
					preventDefault: function () {}
				});
			};

			$(element).find('input[name="message"]').focus();
		}
	};
});