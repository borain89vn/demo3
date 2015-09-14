HexseePortalApp.controller('RootController', function ($scope, $location, $rootScope, $timeout, $q, $routeParams) {

	$scope.objectMessage = '.error';
	appConfig.max_number_member_on_adventure = 10;
	$rootScope.number_notifications_receivedMessage = 0;
	$rootScope.number_notifications_addedAdventure = 0;
	$scope.last_id_messsageReplybox = '';
	$rootScope.number_list_joinedAdventure = 0;
	$rootScope.threadMessageList = [];
	$rootScope.ResultAdventureJounrnal = [];
	$rootScope.ResultMessageJounrnal = [];
	$rootScope.MemberMessageJounrnal = [];
	$rootScope.isLatform = '';
	$rootScope.newidAventure = '';
	$rootScope.boxReplyDevice = '';
	$rootScope.threadMessageidFirst = '';
	$rootScope.initialAdventure = {
		name: document.title + ' ',
		url: window.location.href
	};
	$scope.dataInvitedEmail = {
		emails: ''
	};
	$scope.invitedFriends = {};

	if ($(window).width() <= Helpers.screen) {
		$rootScope.isLatform = 'device';
	} else {
		$rootScope.isLatform = 'desktop';
	}


	$rootScope.transferIO = HexseePortalApp.transferIO;

	/*============================== */


	$scope.objectMain = HexseePortalApp.jq_el_hexsee_application;

	$scope.classloadList = 'repeat-animation';
	$rootScope.boxR = null;
	$scope.boxHTML = function (flag, box) {
		if (box == 'term_of_use') {
			$rootScope.boxTerm = "app/views/boxs/" + box + ".html";
			$('.page_term_ofUse ').fadeIn('slow');
		} else {
			if ($rootScope.boxR != "app/views/boxs/" + box + ".html") {
				if (box != undefined) {
					$rootScope.boxR = "app/views/boxs/" + box + ".html";

					if (box == 'messageList') {
						$rootScope.number_notifications_receivedMessage = 0;
					} else if (box == 'adventureList') {
						$rootScope.number_notifications_addedAdventure = 0;
					}
				} else {
					$rootScope.boxR = "";
				}
			} else {
				$rootScope.boxR = '';
			}
		}
	};

	$scope.OpenBox = function (_objectID) {
		$scope.bPopup = $('#' + _objectID).bPopup({
			easing: 'easeOutBack',
			speed: 700,
			transition: 'slideDown'
		});

		if (_objectID == 'EditYourName') {
			var box_eidt_your_name_jq = $("#box-edit-your-name");
			box_eidt_your_name_jq.find('.firstname_edit').val($rootScope.userData.firstname);
			box_eidt_your_name_jq.find('.lastname_edit').val($rootScope.userData.lastname);
		} else if (_objectID == 'ChangePassword') {
			$scope.bPopup.find('.change-button').off('click');
			$scope.bPopup.find('.change-button').on('click', function () {
				$scope.changePassword();
			});
		} else if (_objectID == 'MyLogOut') {
			$scope.bPopup.find('.cancel-button').off('click');
			$scope.bPopup.find('.cancel-button').on('click', function () {
				$scope.closebpopup();
			});
			$scope.bPopup.find('.yes-button').off('click');
			$scope.bPopup.find('.yes-button').on('click', function () {
				$scope.logoutMain();
			});
			$scope.bPopup.find('.lose-button').off('click');
			$scope.bPopup.find('.lose-button').on('click', function () {
				$scope.closebpopup();
			});
		}
	};

	$scope.logoutMain = function () {

		HexseePortalApp.showHideLoading(true);
		$timeout(function () {
			$rootScope.is_login = false;
			localStorage.clear();
			$rootScope.closeAllBoxesToolbar();
		})

		//if (!$rootScope.$$phase) $rootScope.$apply();

		$rootScope.transferIO.logout(function () {
			HexseePortalApp.transferIO.socket.disconnect();
			HexseePortalApp.authData = null;
			HexseePortalApp.appData = null;

			HexseePortalApp.ManagementTimer.timeout(function () {
				HexseePortalApp.transferIO.socket.connect();
				HexseePortalApp.ManagementTimer.clearAll();
			}, 300);
			$timeout(function () {
				$location.path('/');
			}, 0);
		});
		$scope.closebpopup(function () {});
	};

	$rootScope.closebpopup = function (callback) {
		$scope.bPopup.close();
		$('.error').html('');
		$('.user-edit-Avatar').hide();
		$('#box-change-avatar').find('.part-button').hide();
		$("#load-image-edit").attr('src', '');
		if (callback) {
			callback();
		}
	};



	$scope.changePassword = function () {
		var _object = $("#box-change-password");
		var oldpassword = _object.find('#oldpassword').val();
		var newpassword = _object.find('#new_pass').val();
		var renew_pass = _object.find('#renew_pass').val();

		if (newpassword != renew_pass) {
			_object.find('.error').html(appConfig.message_error.change_password.not_match);

		} else {
			if (newpassword.length < 6 || renew_pass.length < 6) {

				_object.find('.error').html(appConfig.message_error.password.short);
			} else {

				HexseePortalApp.showHideLoading(true);
				$rootScope.transferIO.changePassword(oldpassword, newpassword, function (result) {
					console.log(result);
					var error = result.error;
					if (error != null) {
						switch (error.code) {
						case "INVALID_PASSWORD":
							console.log("The specified user account password is incorrect.");
							_object.find('.error').html(appConfig.message_error.change_password.incorrect);
							break;
						default:
							console.log("Error changing password:", error);
							_object.find('.error').html(appConfig.message_error.change_password.error);
						}
					} else {
						$rootScope.closebpopup();
						_object.find('.b-modal').removeAttr('style');
						console.log("User password changed successfully!");
						_object.find('.error').html('');
						_object.find('#oldpassword').val('');
						_object.find('#new_pass').val('');
						_object.find('#renew_pass').val('');
					}

					HexseePortalApp.showHideLoading(false);
				});
			}
		}

	};



	$scope.eventEditName = function () {

		var _object = $("#box-edit-your-name");
		var firstname = _object.find('.firstname_edit').val();
		var lastname = _object.find('.lastname_edit').val();

		if (firstname == '') {

			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[9]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else if (lastname == '') {

			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[10]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else if (firstname.length < 3) {

			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[3]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else if (firstname.length > 12) {

			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[3]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});

		} else if (lastname.length < 3) {
			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[4]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else if (lastname.length > 12) {
			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[4]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else if (lastname.search(/hexsee*/i) != -1 || firstname.search(/hexsee*/i) != -1) {
			_object.find($scope.objectMessage).text(appConfig.message_error.edit_username[11]);
			_object.find($scope.objectMessage).css({
				"display": "block"
			});
		} else {
			HexseePortalApp.showHideLoading(true);
			var data = {
				firstname: firstname,
				lastname: lastname
			};
			$rootScope.transferIO.updateUserInfo(data, function (result) {
				if (result.error == null) {
					$rootScope.closebpopup();
					_object.find('.error').text('');
					_object.find('.b-modal').removeAttr('style');
				}
				HexseePortalApp.showHideLoading(false);

			});
		}
	};



	$scope.eventChangeAvatar = function () {
		var _object = $("#box-change-avatar");
		var imageDataBase64 = '';

		_object.find('.change-button').click(function () {
			_object.find('.user-edit-Avatar').removeAttr('style');
			_object.find('.hidewhenCLickboxOthers').removeAttr('style');


			HexseePortalApp.showHideLoading(true);
			$rootScope.transferIO.updateAvatarUser(imageDataBase64, function (result) {
				console.log(result);
				if (result.error == null) {
					$rootScope.closebpopup();
					_object.find('.user-edit-Avatar').removeClass('block');
					_object.find('.hidewhenCLickboxOthers').removeClass('block');
					_object.find("#load-image-edit").attr('src', '');
					_object.find('.b-modal').removeAttr('style');
					$("#box-preferences").find('.avatrs-i').attr('src', imageDataBase64);
				}


				HexseePortalApp.showHideLoading(false);
			})

		});

		_object.find('#edit-avatar-user').change(function (e) {

			var file = e.target.files[0];
			if (file.size > 1024 * 1024 * 3)
			//$scope.MessageRegister(1);
				if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
					//$scope.MessageRegister(0);
				}
			canvasResize(file, {
				width: 150,
				height: 150,
				crop: true,
				quality: 90,
				callback: function (data, width, height) {
					//console.log('apply new avatar');
					imageDataBase64 = data;
					$(".user-edit-Avatar").show();
					$('.part-button').show();
					_object.find("#load-image-edit").attr('src', data);
					//_object.find(".user-edit-Avatar").addClass('block');
					//$rootScope.current_user.avatar = data;
				}
			});
		});
	};

	$scope.show_detail_adventure = function (adventure_id) {
		if (typeof $rootScope.adventure_detail_list != 'undefined' && typeof $rootScope.adventure_detail_list[0] != 'undefined' && $rootScope.adventure_detail_list[0] == adventure_id) $rootScope.adventure_detail_list = [];
		else {
			$rootScope.adventure_detail_list = [];
			$rootScope.adventure_detail_list.push(adventure_id);
		}
	};

	$rootScope.openFriendBox = function () {
		$timeout(function () {
			$rootScope.adventure_detail_list = [];
			$rootScope.boxR = 'app/views/boxs/friendList.html';
		}, 1);
	};




	/**
	 * @return [array] email
	 */

	$rootScope.keyupEmailField = function ($event) {

		if (typeof $scope.dataInvitedEmail != 'undefined' && $scope.dataInvitedEmail.emails != '') {
			$scope.dataInvitedEmail.confirmInviteEmail = true;
		}

	};

	$rootScope.ValidateEmail = function (email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}

		return false;
	}

	$scope.parseStringInvitedEmail = function () {
		var emails = {};
		var emailsArray = [];
		if (typeof $scope.dataInvitedEmail != 'undefined' && $scope.dataInvitedEmail.confirmInviteEmail) {
			//filter email again.
			var string_emails = jQuery.trim($scope.dataInvitedEmail.emails);



			if (string_emails != '') {
				var emailList = string_emails.split(',');
				angular.forEach(emailList, function (item) {
					if ($rootScope.ValidateEmail(item)) {
						emails[item] = true;
					}
				});
			}
		}

		angular.forEach(emails, function (item, email) {
			emailsArray.push(email);
		});

		return emailsArray;
	};

	$rootScope.keydownEmailField = function ($event) {
		if ($event.keyCode == 32) { // without backspace
			$event.preventDefault();
			return;
		}
	};

	$scope.showPopover = function (flag) {
		if (flag) {
			$('#popover-invite-email').fadeIn();
		} else {
			$('#popover-invite-email').hide();
		}
	};
	$rootScope.eventStartAdventure = function () {

		var emails = $scope.parseStringInvitedEmail();

		var name_adventure = jQuery.trim($scope.initialAdventure.name);

		if (name_adventure == '') {
			name_adventure = document.title + ' ' + window.location.href;
		}

		if (jQuery.trim(name_adventure) == '') {
			name_adventure = window.location.href;
		}
		console.log(name_adventure);

		HexseePortalApp.showHideLoading(true);
		$rootScope.startNewAdventure(name_adventure, $scope.initialAdventure.url, emails, $scope.invitedFriends).then(function () {

			$rootScope.closeAllBoxesToolbar();
			HexseePortalApp.showHideLoading(false);
			$rootScope.invitedGroups = {};
			$rootScope.invitedFriends = {};
		});

		//$rootScope.closeAllBoxesToolbar();
	};

	$rootScope.closeAllBoxesToolbar = function () {
		$rootScope.adventure_detail_list = [];
		$rootScope.boxR = '';
	};

	$rootScope.startNewAdventure = function (name, url, emails, invitedFriends) {

		var deferred = $q.defer();

		var invited_friend = [];

		var length_not_invited_member = 0;

		var index_email_into_list = emails.indexOf($rootScope.emailUser);

		if (index_email_into_list != -1) {
			emails.remove(index_email_into_list);
		}

		var length_not_invited_email = emails.length;


		angular.forEach(invitedFriends, function (item, uid) {
			if (item === true) {
				invited_friend.push(uid);
				length_not_invited_member++;
			}
		});


		if (length_not_invited_member == 0 && length_not_invited_email == 0) {

			deferred.resolve(true);
			bootbox.alert(appConfig.message_error.adventure.notCheckMember);
			return deferred.promise;
		}


		if (length_not_invited_member + length_not_invited_email > appConfig.max_number_member_on_adventure) {


			deferred.resolve(true);
			bootbox.alert(appConfig.message_error.adventure.limitNumberMember);
			return deferred.promise;
		}


		// trackUserActionWithGA(7, $rootScope.userData.email, name); //start new adventure


		var name_page = jQuery.trim('Hexsee Portal');
		var url_ = appConfig.url_portal;

		$rootScope.transferIO.startNewAdventure(emails, invited_friend, name_page, url_, name, function (data) {
			if (data.error == null) {

				bootbox.alert(appConfig.message_error.adventure.startSuccessfully, function () {
					$rootScope.eventGotoaAdventure({
						id: data.result.adventure_id,
						name: name
					});
				});

			} else {
				if (data.error.code == 'FULL') {

					bootbox.alert(appConfig.message_error.adventure.limitNumberMember);
					return deferred.promise;
				}
			}


			deferred.resolve(true);
		});


		return deferred.promise;
	};


	/**

	*/

	var cacheDataUser = {};
	var cacheAvatarUser = {};
	var cacheDataUserCallBackList = {};
	var cacheAvatarUserCallBackList = {};
	$rootScope.loadAvatarUsersWithObject = function (uid) {

		var deferred = $q.defer();

		if (typeof cacheAvatarUser[uid] != 'undefined') {
			//callback(cacheDataUser[uid]);
			deferred.resolve(cacheAvatarUser[uid]);
		} else {

			if (typeof cacheAvatarUserCallBackList[uid] == 'undefined') {
				cacheAvatarUserCallBackList[uid] = [deferred];
			} else {
				cacheAvatarUserCallBackList[uid].push(deferred);
				return deferred.promise;
			}

			$rootScope.transferIO.watchAvatarUser(uid, function (avatar) {
				if (typeof cacheAvatarUser[uid] != 'undefined') {
					cacheAvatarUser[uid] = avatar;
					$rootScope.$broadcast('change_avataruser_' + uid, cacheAvatarUser[uid]);
				} else {
					cacheAvatarUser[uid] = avatar;
					var len = cacheAvatarUserCallBackList[uid].length;
					for (var i = 0; i < len; ++i) {
						cacheAvatarUserCallBackList[uid][i].resolve(cacheAvatarUser[uid]);
					}
				}
			});

		}

		return deferred.promise;

	};

	$rootScope.loadDataUsersWithObject = function (uid) {

		var deferred = $q.defer();

		if (typeof cacheDataUser[uid] != 'undefined') {
			//callback(cacheDataUser[uid]);
			deferred.resolve(cacheDataUser[uid]);
		} else {

			if (typeof cacheDataUserCallBackList[uid] == 'undefined') {
				cacheDataUserCallBackList[uid] = [deferred];
			} else {
				cacheDataUserCallBackList[uid].push(deferred);
				return deferred.promise;
			}

			$rootScope.transferIO.watchUserInfo(uid, function (userData) {

				//console.log('watch user info', userData, uid);

				if (userData.uid == uid) {
					if (typeof cacheDataUser[uid] != 'undefined') {
						cacheDataUser[uid] = userData;
						$rootScope.$broadcast('change_userData_' + uid, cacheDataUser[uid]);

						if (userData.uid == $rootScope.idUser) {
							$scope.$apply(function () {
								$rootScope.userData.firstname = userData.data.firstname;
								$rootScope.userData.lastname = userData.data.lastname;
							});
						}

					} else {
						cacheDataUser[uid] = userData;
						var len = cacheDataUserCallBackList[uid].length;
						for (var i = 0; i < len; ++i) {
							cacheDataUserCallBackList[uid][i].resolve(cacheDataUser[uid]);
						}
					}
				}

			});
		}
		return deferred.promise;
	};



	$rootScope.eventGotoaAdventure = function (adventure) {
		console.log("click eventGotoaAdventure", adventure);
		HexseePortalApp.showHideLoading(true);

		$rootScope.closeAllBoxesToolbar();

		$rootScope.createPageIntoAdventure(adventure.id).then(function () {
			console.log('goto', adventure.id);
			$rootScope.newidAventure = adventure.id;
			$q.when({
					AdventureJournal: $rootScope.AdventureJournal(adventure.id), // DesktopTimline
					AdventureJournalDevice: $rootScope.AdventureJournalDevice(adventure.id)

				}, //DeviceTimeline;
				function () {
					HexseePortalApp.showHideLoading(false);

					$rootScope.transferIO.updateMemberData(adventure.id, $rootScope.authData.uid, 'status', 'inactivated');
				});
		});


		$timeout(function () {
			$rootScope.current_adventure_name = adventure.name;
		}, 1);

	};

	$rootScope.createPageIntoAdventure = function (adventure_id) {
		var def = $q.defer();
		$rootScope.transferIO.createPageIntoAdventure(adventure_id, appConfig.url_portal, document.title, function (data) {

			console.log('createPageIntoAdventure', data);

			if (data.error == null)
				$timeout(function () {
					$rootScope.current_page_id = data.result;
				}, 0);

			def.resolve(true);
		});

		return def.promise;
	};

	$rootScope.loadMoreAdventureList = function (type) {
		if (type == 'added') {
			$rootScope.transferIO.getMoreAdventureList('added', function (data) {
				if (data.error == null && data.result.length > 0) {
					$timeout(function () {
						$rootScope.list_addedAdventure = $rootScope.list_addedAdventure.concat(data.result);
					}, 0);
				}
			});
		} else if (type == 'joined') {
			$rootScope.transferIO.getMoreAdventureList('joined', function (data) {
				console.log('getMoreAdventureList', data);
				if (data.error == null && data.result.length > 0) {
					$timeout(function () {
						$rootScope.list_joinedAdventure = $rootScope.list_joinedAdventure.concat(data.result);
					}, 0);
				}
			});
		}
	};



	$scope.clickReply = function (index, message_id) {
		if ($scope.last_id_messsageReplybox != '') {
			$($scope.last_id_messsageReplybox).css('display', 'none');
		}
		if ($(window).width() > Helpers.screen) {
			$('#messageReplyBox' + index).slideDown().find('input[name="message"]').focus();
			$scope.last_id_messsageReplybox = '#messageReplyBox' + index;
		} else {
			$rootScope.boxReplyDevice = 'app/views/device/message_popup.html';

			if (typeof message_id == 'undefined') {
				message_id = $rootScope.threadMessageidFirst;
			}
			$('.bopChatPublic').fadeIn('fast', function () {
				$('.bopChatPublic').find('input').focus();
				$timeout(function () {
					$rootScope.SendBoxMessageDevice(message_id);


				}, 0)
				return false;
			});
		}
	};
	$scope.$on('inputCompleteMessage', function () {
		if ($scope.last_id_messsageReplybox != '') {
			$($scope.last_id_messsageReplybox).css('display', 'none');
		}
	});

	$rootScope.gotoTimeline = function () {
		$location.path('/timeline');
	};


	//		if (HexseePortalApp.is_login) {
	//			//var adventureId = $routeParams.adventureId;
	//	
	//				$location.path('/journal');
	//		} else {
	//			$location.path('/');
	//		}

	$rootScope.closeTermOfUse = function () {
		$('.page_term_ofUse ').fadeOut('slow', function () {
			$rootScope.boxTerm = '';
		})
	};

	$rootScope.PageDataDevice = {
		id: false,
		uri: false
	}


	$rootScope.SendBoxMessageDevice = function (message_id) {
		$('.bopChatPublic').find('button').unbind('click');
		$('.bopChatPublic').find('input').unbind('keypress');
		$('.bopChatPublic').find('button').bind('click', function () {
			$rootScope.submitSendBoxMessageDevice(message_id);
		})
		$('.bopChatPublic').find('input').bind('keypress', function (event) {
			if (event.keyCode == 13) {
				//$rootScope.submitSendBoxMessageDevice(message_id);
			}
		})
	}
	$rootScope.submitSendBoxMessageDevice = function (message_id) {
		var _v = $('.bopChatPublic').find('input').val();
		if (_v != '') {
			$rootScope.transferIO.post_message(message_id, _v, 'text', function (respone) {

				if (respone.message_id) {
					$('.bopChatPublic').find('input').val('');
					$('.bopChatPublic').fadeOut('slow', function () {
						$rootScope.boxReplyDevice = '';
					});
					$timeout(function () {
						$(".ms_scrollMessageTimelineDevice").animate({
							scrollTop: $('.ms_scrollMessageTimelineDevice').find('ul').height()
						}, "slow");
					}, 100);
					//					$(window).resize(function () {
					//						$(".main-scroll-timeline").animate({
					//							scrollTop: $('.main-scroll-timeline').find('ul').height()
					//						}, "slow");
					//					})


				} else {
					$('.bopChatPublic').find('input').val('');
					$('.bopChatPublic').fadeOut('slow');
				}
			});
		}
		$('.bopChatPublic').find('a').click(function () {
			$('.bopChatPublic').fadeOut('slow');
		})
	};

});