HexseePortalApp.directive("messagePopup", function ($rootScope, $timeout) {
	return {
		restrict: "A",
		scope: {
			repliedmessagedevice: '='
		},
		//templateUrl :'app/views/device/message_popup.html',
		link: function (scope, element, attrs) {

			var _object = $('.bopChatPublic');

			scope.inputMessage = function ($event) {

				var _v = $('.bopChatPublic').find('input').val();
				if (_v) {
					$timeout(function () {
//						$rootScope.transferIO.post_message(scope.message.threadmessage_id, _v, 'text', function (respone) {
//							if (respone.message_id) {
//								$('.bopChatPublic').find('input').val('');
//								$('.bopChatPublic').fadeOut('slow', function () {
//									$rootScope.boxReplyDevice = '';
//								});
//								$timeout(function () {
//									$(".main-scroll-timeline").animate({
//										scrollTop: $('.main-scroll-timeline').find('ul').height()
//									}, "slow");
//								}, 0)
//							} else {
//								$('.bopChatPublic').find('input').val('');
//								$('.bopChatPublic').fadeOut('slow');
//							}
//						});
					}, 0)
				}
			};


			$(element).find('input[name="message_device"]').focus();
			$(_object).find('button').on('click', function () {
				console.log(scope.repliedmessagedevice.threadmessage_id);
				return false;
				scope.inputMessage({
					keyCode: 13,
					preventDefault: function () {}
				});
				
			});
			
			

			$("#_object").find('a').on('click', function () {
				$(element).find('.bopChatPublic').fadeOut();
			});


		}
	};
});