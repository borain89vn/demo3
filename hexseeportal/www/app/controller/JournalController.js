HexseePortalApp.controller('JournalController', function ($scope, $rootScope, $timeout, $location, $q, $routeParams) {

	console.log('JournalController', $rootScope.is_login, HexseePortalApp.is_login);
	$rootScope.adventureId_url = $routeParams.adventureId;

	if (typeof $rootScope.adventureId_url == 'undefined') {
		if (HexseePortalApp.is_login) {
			$location.path('/journal');
		} else {
			$location.path('/');
		}
	}


	$scope.classloadList = 'repeat-animation';

	$rootScope.objectColor = {};

	$rootScope.listColor = [
        '#ffc', '#F5F5F3', '#FFE5E5', '#E0FBEB', '#E9F9FF', '#EDE9FF', '#EFECFF', '#D5FF9E', '#A7E5E6'
    ];
	$rootScope.randomNumber = function () {
		var min = 0;
		var max = $rootScope.listColor.length;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


	$rootScope.AdventureJournalDevice = function (idAdventure) { // MobileTimline
		var def = $q.defer();

		$scope.messageIds = {};

		$rootScope.transferIO.getOneAdventureMessageTimeline(idAdventure, function (respon) {
			if (respon.error == null) {
				$timeout(function () {

					$rootScope.current_adventure = respon.result;
					$rootScope.ResultAdventureJounrnalDevice = respon.result;
					console.log("listenerUser-1:", $rootScope.ResultAdventureJounrnalDevice);
					$rootScope.numberAdventureJounrnalDevice = respon.result.length;

					for (var i = 0; i < $rootScope.ResultAdventureJounrnalDevice.messages.length; i++) {
						var _message = $rootScope.ResultAdventureJounrnalDevice.messages[i];
						if (typeof $rootScope.objectColor[_message.page_id] == 'undefined') {
							var _number = $rootScope.randomNumber();
							if ($rootScope.listColor[_number] == undefined) {
								_number = 0;
							}
							$rootScope.objectColor[_message.page_id] = $rootScope.listColor[_number];
						}

						$scope.messageIds[_message.id] == true;
					}

					$rootScope.heightScrollTimeLineDevice();
					$('.flexslider').flexslider({
						animation: "slide",
						animationLoop: false,
						slideshow: false,
						itemWidth: 55,
						itemMargin: 5,
						minItems: 2,
						maxItems: 4
					});
				}, 0);
			}


			def.resolve(true);

		});


		$rootScope.transferIO.untrack_fnc_receiveList('watchMessagesOfAdventure');
		$rootScope.transferIO.watchMessagesOfAdventure(idAdventure, function (respon) {
			console.log("listenerUser-2:", respon);
			if (respon) {
				if (respon.result != null && typeof $scope.messageIds[respon.result.id] == 'undefined') {
					$scope.messageIds[respon.result.id] = true;

					$timeout(function () {
						$rootScope.ResultAdventureJounrnalDevice.messages.push(respon.result);
						for (var i = 0; i < $rootScope.ResultAdventureJounrnalDevice.messages.length; i++) {
							var _message = $rootScope.ResultAdventureJounrnalDevice.messages[i];
							if (typeof $rootScope.objectColor[_message.page_id] == 'undefined') {
								var _number = $rootScope.randomNumber();
								if ($rootScope.listColor[_number] == undefined) {
									_number = 0;
								}
								$rootScope.objectColor[_message.page_id] = $rootScope.listColor[_number];
							}

							$scope.messageIds[_message.id] == true;
						}
						$rootScope.heightScrollTimeLineDevice();
					}, 1);
				}

			}
		});

		return def.promise;
	};



	$rootScope.AdventureJournal = function (idAdventure) { // DesktopTimline
		var def = $q.defer();

		$scope.memberIds = {};
		$scope.threadIds = {};

		$rootScope.transferIO.getOneAdventureTimeline(idAdventure, function (respon) {
			console.log('AdventureJournal', respon);
			if (respon.error == null) {
				$timeout(function () {
					$rootScope.current_adventure = respon.result;
					$rootScope.ResultAdventureJounrnal = respon.result;
					console.log("Desktop:", $rootScope.ResultAdventureJounrnal);
					$rootScope.nameRsAv = respon.result.name;
					$rootScope.idRsAv = respon.result.id;
					$rootScope.MemberMessageJounrnal = respon.result.members;
					//$('.main-scroll-timeline').mCustomScrollbar();
					$('.flexslider').flexslider({
						animation: "slide",
						animationLoop: false,
						slideshow: false,
						itemWidth: 55,
						itemMargin: 5,
						minItems: 2,
						maxItems: 4
					});
				}, 0);

				for (var i = 0; i < respon.result.members.length; ++i) {
					$scope.memberIds[respon.result.members[i].uid] = true;
				}

				for (var page_id in $rootScope.ResultAdventureJounrnal.pages) {
					var page = $rootScope.ResultAdventureJounrnal.pages[page_id];

					for (var j = 0; j < page.threadmessages.length; ++j) {
						$scope.threadIds[page.threadmessages.id] = true;
					}

				}
			}
			$rootScope.transferIO.untrack_fnc_receiveList('watchPagesOfAdventure');
			$rootScope.transferIO.watchPagesOfAdventure(idAdventure, function (respon) {
				if (respon.error == null) {
					if (typeof $rootScope.ResultAdventureJounrnal.pages[respon.result.id] == 'undefined') {
                        $timeout(function () {
							$rootScope.ResultAdventureJounrnal.pages[respon.result.id] = respon.result;
						}, 0)
					}
				}
			});

			$rootScope.transferIO.untrack_fnc_receiveList('watchMemberIntoAdventure');
			$rootScope.transferIO.watchMembersOfAdventure(idAdventure, function (member) {
				if (typeof $scope.memberIds[member.uid] == 'undefined') {
					$scope.memberIds[member.uid] = true;
                    $timeout(function () {
						$rootScope.MemberMessageJounrnal.push(member);
					}, 0)
				}

			});

			$rootScope.transferIO.untrack_fnc_receiveList('watchThreadMessageOfAdventure');
			$rootScope.transferIO.watchThreadMessageOfAdventure(idAdventure, function (respon) {
				var threadmessage = respon;
				if (typeof $rootScope.ResultAdventureJounrnal.pages[threadmessage.page_id] != 'undefined' && typeof $scope.threadIds[threadmessage.id] == 'undefined') {
					$scope.threadIds[threadmessage.id] = true;
                    $timeout(function () {
						$rootScope.ResultAdventureJounrnal.pages[threadmessage.page_id].threadmessages.unshift(threadmessage);
					}, 0)
				}
			});

			def.resolve(true);
		});


		return def.promise;
	};

	$rootScope.goToAMessageAdventure = function (message, isLarform) {
		/*console.log("click", message);

		if (isLarform == "desktop") {
			$rootScope.AdventureJournal(message.adventure_id);
		} else {
			$rootScope.AdventureJournalDevice(message.adventure_id);
			$rootScope.boxR = '';
		}
		$rootScope.current_adventure_name = message.adventure_name;*/

		$rootScope.eventGotoaAdventure({
			id: message.adventure_id,
			name: message.adventure_name
		});
	};

	$rootScope.heightScrollTimeLineDevice = function () {
		var _object = $('.ms_scrollMessageTimelineDevice');
		var height_screen = parseInt($(window).height());
		var height_tmp = parseInt(height_screen - 283);
		$(_object).css({
			height: height_tmp + 'px'
		});
		$timeout(function () {
			var height_need_scrool = $('.ms_scrollMessageTimelineDevice').find('ul').height() + 150;
			$(".ms_scrollMessageTimelineDevice").animate({
				scrollTop: height_need_scrool
			}, "slow");
			//$('.ms_scrollMessageTimelineDevice').scrollTop(height_need_scrool);
		}, 500)

	};


	$rootScope.number_notifications_receivedMessage = 0;

	$rootScope.authData = HexseePortalApp.authData;
	$rootScope.appData = HexseePortalApp.appData;
	// receivedMessageList // joinedAdventureList //addedAdventureList //friendList ///receivedMessageList
	$rootScope.friendList = HexseePortalApp.appData.friendList;

	$rootScope.receivedMessageList = HexseePortalApp.appData.receivedMessageList;
	$rootScope.list_joinedAdventure = HexseePortalApp.appData.joinedAdventureList;

	$rootScope.list_addedAdventure = HexseePortalApp.appData.addedAdventureList;



	$rootScope.emailUser = HexseePortalApp.appData.userData.email;
	$rootScope.idUser = HexseePortalApp.appData.userData.id;
	$rootScope.nameUser = HexseePortalApp.appData.userData.firstname + ' ' + HexseePortalApp.appData.userData.lastname;

	$rootScope.userData = HexseePortalApp.appData.userData;

	if (HexseePortalApp.appData.receivedMessageList.length > 0) {
		$rootScope.notifications_receivedMessage = [HexseePortalApp.appData.receivedMessageList[0]];
		$rootScope.tmp_nofication = $rootScope.receivedMessageList[0];
	} else {
		$rootScope.notifications_receivedMessage = [];
	}

	if ($rootScope.tmp_nofication != undefined) {
		$rootScope.number_notification_message = $rootScope.notifications_receivedMessage.length
	} else {
		$rootScope.number_notification_message = 0;
	}

	$rootScope.number_list_addedAdventure = HexseePortalApp.appData.addedAdventureList.length;
	$rootScope.number_list_joinedAdventure = HexseePortalApp.appData.joinedAdventureList.length;


	$rootScope.current_adventure = $rootScope.list_joinedAdventure[0];
	console.log("current:", $rootScope.current_adventure);
	$rootScope.current_adventure_name = $rootScope.current_adventure.name;

	var current_AdventureNet = '';
	if (typeof $rootScope.adventureId_url == 'undefined') {
		current_AdventureNet = $rootScope.current_adventure.id;
	} else {
		current_AdventureNet = $rootScope.adventureId_url;
	}
	console.log("xx:",$rootScope.current_adventure);
	$rootScope.createPageIntoAdventure(current_AdventureNet).then(function () {
		
		$q.when({
				AdventureJournal: $rootScope.AdventureJournal(current_AdventureNet), // DesktopTimline
				AdventureJournalDevice: $rootScope.AdventureJournalDevice(current_AdventureNet)
			}, //DeviceTimeline;
			function () {
				setTimeout(function () {
					HexseePortalApp.showHideLoading(false);
				}, 300);
			});
		
		
	});




	/* Listening  */
	$rootScope.transferIO.removeListener('receivedMessageList');
	$rootScope.transferIO.addListener('receivedMessageList', function (result) {
		if (result.status == 'child_added') {
			$timeout(function () {
				$rootScope.notifications_receivedMessage = [result.data];
				$rootScope.number_notifications_receivedMessage++;
				$rootScope.number_notification_message++;
			}, 0);
		}
	});
	$rootScope.transferIO.removeListener('addedAdventureList');
	$rootScope.transferIO.addListener('addedAdventureList', function (result) {
		console.log('watch added adventure list', result);
		if (result.status == 'child_added') {
            $timeout(function () {
				$rootScope.notifications_addedAdventure = [result.data];
				$rootScope.number_list_addedAdventure++;
				$rootScope.number_notifications_addedAdventure++;
			}, 0);
		} else if (result.status == 'child_removed') {
			for (var i = 0, length = $rootScope.list_addedAdventure.length; i < length; ++i) {
				if ($rootScope.list_addedAdventure[i].id == result.data.id) {
                    $timeout(function () {
						$rootScope.list_addedAdventure.remove(i);
					}, 0);
					break;
				}
			}
            $timeout(function () {
				$rootScope.number_list_addedAdventure--;
			}, 0);
		}
	});

	$rootScope.SendMessageFirstTime = function (_v, page, uri) {
		var currentAvID = '';
		var pageId = '';
		var _uri = '';

		if ($rootScope.newidAventure == null || $rootScope.newidAventure == '') {
			currentAvID = $rootScope.current_adventure.id;
		} else {
			currentAvID = $rootScope.newidAventure;
		}

		if (page == false) {

			pageId = $rootScope.current_page_id;

		} else {
			pageId = page;
		}

		if (uri == false) {
			_uri = appConfig.url_portal;

		} else {
			_uri = uri;
		}

		if (_v != null || _v != "" || _v != undefined) {
			console.log(currentAvID);
			console.log(pageId);
			console.log(_uri);
			console.log(_v);
			$timeout(function () {
				$rootScope.transferIO.create_thread_message_in_page(currentAvID, pageId, _uri, _v, 'text', 0, 0, function (respone) {
					console.log(respone);
					if (respone.threadMessage_id) {
						$rootScope.threadMessageidFirst = respone.threadMessage_id;
					}
				})
			}, 1);
		}
	}
});