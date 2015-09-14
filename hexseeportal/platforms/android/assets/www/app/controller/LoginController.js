HexseePortalApp.controller('LoginController', function ($scope, $location, $rootScope, $timeout) {
	$rootScope.isLoginPage = 'isLogin';
    if (HexseePortalApp.is_login) {
        $location.path('/journal');

        return;
    }
	
	$scope.Login = function () {
		var _ob_device = $('.error_message_device');
		var _object_message_device = $('.error_message_device').find('.message_for_device');
		var emailUser = $scope.emailUser
		var passUser = $scope.passwordUser;
		var checkTerm = $scope.check_termn_login;
		
		$scope.listErrorMessage = [
            'Please enter full your email and password!',
            'Please accept Terms of Use',
            "Sorry, we can't find you - try again or register as New User",
            'Server is error, Please try again!',
            'Account is not yet activated. Please click confirmation link from your registered email, or <a href="javascript:void(0)" id="button_resend_email">Resend email</a>',
            'Please enter a valid email address',
            'Your password is wrong !'
        ];

		if (emailUser == "" || emailUser == undefined || passUser == "" || passUser == undefined) {
			console.log(1);
			//return false;
		} else {
			console.log(2);
			var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
			if (emailUser == '' || !re.test(emailUser)) {
				$scope.message = $scope.listErrorMessage[0];
				$scope.animateLoadmessage($scope.message);
				$(_object_message_device).html($scope.message);
				$(_ob_device).fadeIn('slow');
				return false;
			}
			if (checkTerm == false || checkTerm == undefined) {
				$scope.message = $scope.listErrorMessage[1];
				$scope.animateLoadmessage($scope.message);
				$(_object_message_device).html($scope.message);
				$(_ob_device).fadeIn('slow');
				return false;
			} else {
                HexseePortalApp.showHideLoading(true);
				$(_ob_device).fadeOut('slow');
				$('#mLo').html('');
				$('.loading-box-login').fadeIn('slow');
				$rootScope.transferIO.authWithPassword(emailUser, passUser, function (responData) {
					console.log(responData);
					if (responData) {
						if (responData.error == null) {
							ga('send', 'event', 'Login', 'Click', emailUser);
                            var login_successful = function(){
                                localStorage.setItem('inforUserCurrent_token', responData.authData.token);
                                //localStorage.setItem('emailUser', responData.authData.email);
                                //localStorage.setItem('inforUserID', responData.authData.uid);

                                HexseePortalApp.authData = responData.authData;
                                HexseePortalApp.appData = responData.appData;

                                $timeout(function () {
                                    HexseePortalApp.is_login = $rootScope.is_login = true;
                                    $location.path('/journal');
                                }, 100);
                            };

                            if(typeof navigator == 'undefined' || typeof navigator.splashscreen == 'undefined' || typeof navigator.splashscreen.getPreferences == 'undefined'){
                                login_successful()
                            }else{
                                console.log('is device app');
                                navigator.splashscreen.getPreferences(function(data){
                                    if(typeof data != 'undefined'){
                                        try{
                                            data = JSON.parse(data);

                                            if(typeof data != 'undefined' &&
                                                typeof data.deviceType != 'undefined' &&
                                                typeof data.deviceId != 'undefined' &&
                                                typeof data.installationId != 'undefined' &&
                                                typeof data.appVersion != 'undefined' &&
                                                typeof data.osVersion != 'undefined'){
                                                console.log('registerDevice', data);
                                                $rootScope.transferIO.registerDevice(data.deviceType,
                                                    data.deviceId, data.installationId, data.appVersion, data.osVersion, function(){
                                                        localStorage.setItem('installationId', data.installationId);
                                                        login_successful();
                                                    });
                                            }
                                        }catch(e){
                                            console.log('error data', e);
                                        }

                                    }

                                });

                            }


						} else {
                            HexseePortalApp.showHideLoading(false);
							if (responData.error != null) {
								$(_ob_device).fadeIn('slow');
								switch (responData.error.code) {
								case 'INVALID_USER':
									$scope.message = $scope.listErrorMessage[2];
									$(_object_message_device).html($scope.message);
									break;
								case 'INVALID_EMAIL':
									$scope.message = $scope.listErrorMessage[2];
									$(_object_message_device).html($scope.message);
									break;
								case 'INVALID_PASSWORD':
									$scope.message = $scope.listErrorMessage[6];
									$(_object_message_device).html($scope.message);
									break;
								case 'NOT_CONFORMATION':
									$scope.animateLoadmessage('');
									$scope.message = $scope.listErrorMessage[4];
									$(_object_message_device).html($scope.message);
									$('.contentMessage').css({
										'width': '800px'
									});

									setTimeout(function () {

										$('#button_resend_email').bind('click', function () {
											$rootScope.transferIO.resendConfirmationEmail(function () {
												$('.messageClass').css({
													'bottom': '14px'
												});
											});
										})
										$(".message_for_device").find('a').click(function () {
											$rootScope.transferIO.resendConfirmationEmail(function () {
												$('.messageClass').css({
													'bottom': '14px'
												});
											});
										})
									}, 1000);
									break;
								default:
									$scope.message = $scope.listErrorMessage[3];
								}
								$scope.animateLoadmessage($scope.message);

							}
						}
					} else {

					}
				});
			}
		}
	};
	$scope.closeBox = function () {
		$("#loginBox").fadeOut('fast');
	};
	$scope.animateLoadmessage = function (mess) {
		$('.message').html(mess)
		var optionAnimate = {

			speedLoad: 1000,

			timeOut: 90000,

			bottomPositionBegin: 0,

			bottomPositionAfter: 52
		};

		$('.messageClass').stop().animate({

			bottom: optionAnimate.bottomPositionAfter,

			'z-index': 1

		}, optionAnimate.speedLoad);

		setTimeout(function () {

			$('.messageClass').css({
				'z-index': -1
			})

			$('.messageClass').stop().animate({

				bottom: optionAnimate.bottomPositionBegin

			}, optionAnimate.speedLoad);

		}, optionAnimate.timeOut);
	};

	$scope.openEula = function () {
		window.open(Helpers.mainUrl + 'terms-of-use');
	};

	$rootScope.openTermtoUser = function () {

	}
	HexseePortalApp.showHideLoading(false);
});