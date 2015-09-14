/*
 * Developer : Morgan
 * Date : 20/4/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */



HexseePortalApp.controller('RegisterController', ['$rootScope','$scope',function ($rootScope,$scope) {
    $scope.objectMessage = '.messager_Regis';
    $scope.avatar = false;
    $scope.colorHexa = null;
    $scope.flagForm  = false;
    $scope.array_Message = [
            'The file upload not supported ! ',
            'The file size can not exceed 3MB !',
            'The password length be longer than 6 characters ',
            'First name is min 3 characters and max 12 characters',
            'Last name is min 3 characters and max 12 characters',
            'You need confirm password !',
            'The specified email address is already in use',   
            'Error ! Please try again',
            'Please accept our license condition',
            'The specified email address is invalid',
            'You may not use "Hexsee" in your first name or your last name!'
     ];

    $scope.listHexacolors = [
        {color: 'ff9800','order':'one'},
        {color: '4caf50','order':'two'},
        {color: '2196f3','order':'three'},
        {color: '9c27b0','order':'four'},
        {color: 'fbc02d','order':'five'},
        {color: '795548','order':'six'},
    ];


    $scope.MessageRegister = function(key){       
        $($scope.objectMessage).text($scope.array_Message[key]);
        $($scope.objectMessage).show('slow');
    };

    

    $rootScope.register = function(){

        $('#form-main-register').css('opacity', '0.5');
       

        var userData = {
            firstname:$scope.user.firstname,
            lastname:$scope.user.lastname,
            email:$scope.user.email,
            password:$scope.user.password
        };

        if ($scope.avatar != false) {
            userData.avatar = $scope.avatar;
        }

        if ($scope.colorHexa != null) {
            userData.typeColorHexa = $scope.colorHexa[1];
        }


        $rootScope.transferIO.register({userData:userData, soloAdventure: {namePage: window.document.title, uriPage: appConfig.url_portal}}, function(result){

            var error = result.error;
            var uid = result.data;

            if(error == null) {
                $('.form-main-register').addClass('animated fadeOutDown');
                $('.form-main-register').css({
                    'opacity':0,
                    'z-index':-1
                });
                $('.form-main-register').removeClass('sign-on');

                bootbox.alert({title:'Registration Almost Complete',
                    message:'<p>We have sent a confirmation e-mail to you at this address: '+$scope.user.email+'</p>' +
                    '<p>Please click on the link in that e-mail to confirm your account. If you have not received the confirmation email then <a href="javascript:void(0)" id="button_resend_email_in_popup">Resend email</a></p>' +
                    '<p>Thank you for using Hexsee.</p>'
                    , container:HexseeApplication.$div_app, closeButton:false,
                    callback:function(){
                        window.location.reload();
                    }
                });

                setTimeout(function(){
                    $('#button_resend_email_in_popup').on('click', function(){
                        //var temp = uid.split(':');
                        /*HexseeApplication.sendEmailConfirmation(temp[1]).then(function(){
                         $rootScope.showHideLoading(false);
                         });*/
                        $rootScope.transferIO.resendConfirmationEmail(function(){
                        });

                        return false;
                    });
                }, 2000);
            }else{
                $('#form-main-register').css('opacity', '1');
                if(!$scope.array_Message.indexOf(error.message)){
                    $scope.MessageRegister(6);
                }else{
                    if(error.code == 'EMAIL_TAKEN'){
                        $('.box-input-email input').val($scope.user.email).focus();
                        $($scope.objectMessage).text('The specified email address is already in use. Please login to start your adventure.');
                        $($scope.objectMessage).show('slow');
                    }else{
                        $($scope.objectMessage).text(error.message);
                        $($scope.objectMessage).show('slow');
                    }
                }
            }
        });
    };
    
    $scope.checkForm= function(){
	
        if($scope.MyFormRegister.firstname.$valid == false) { 
            $scope.MessageRegister(3);
        }else if($scope.MyFormRegister.lastname.$valid == false){
            $scope.MessageRegister(4);
        }else if($scope.MyFormRegister.password.$valid == false || $scope.MyFormRegister.againpassword.$valid == false ){
            $scope.MessageRegister(2);
        }else if($scope.user.password != $scope.user.againpassword) {
            $scope.MessageRegister(5);
        }else if($scope.user.term_condition==false || typeof $scope.user.term_condition=="undefined"){
            $scope.MessageRegister(8); 
        }else if(typeof $scope.user.email=="undefined" || $scope.user.email=="undefined" ||$scope.user.email==false){
            $scope.MessageRegister(9); 
        }else if($scope.user.firstname.search(/hexsee*/i) != -1 || $scope.user.lastname.search(/hexsee*/i) != -1){
            $scope.MessageRegister(10);
        }else{
            $scope.flagForm=true;
            $rootScope.register();
            
        }
        return $scope.flagForm;
    };


    $scope.uploadAvatar = function(e){
        $('input[name=avatar_regisUser]').change(function(e) {
            var file = e.target.files[0];
            if(file.size > 1024*1024*3)
                $scope.MessageRegister(1);
            if (!file.name.match(/\.(jpg|jpeg|png)$/)){
                $scope.MessageRegister(0);
            }
            canvasResize(file, {
                width: 150,
                height: 150,
                crop: true,
                quality: 90,
                callback: function(data, width, height) {
                    $scope.avatar = data;
                    $(".icon-upload-avatar").hide();
                    $("#load_image_avatar").attr('src', data);
                    $(".image-avatar-upload").fadeIn();
                }
            });
        });
    };
    $scope.myColor = function(color,order){
        var data ;
        $.each($('.list-hexagon-color li'),function(key,index){
            var obje = $(index);
            $(obje).find('.tick-icon').removeClass('tick-icon');
        });
        $('.color-hex-'+color).addClass('tick-icon');
        $scope.colorHexa = [color,order];
        return $scope.colorHexa;
    }
}]);