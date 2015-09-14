var HexseePortalApp = angular.module('HexseePortalApp', ['angular-gestures','hmTouchEvents','ngRoute', 'ngAnimate']);

HexseePortalApp.is_login = false;
HexseePortalApp.ManagementTimer =  new ManagementTimer();
HexseePortalApp.$rootScope = null;


HexseePortalApp.el_loading = null;
HexseePortalApp.el_hexsee_application = null;
HexseePortalApp.jq_el_hexsee_application = null;
HexseePortalApp.el_hexsee_application_alone = null;

HexseePortalApp.installationId = null;
HexseePortalApp.deviceId = null;
HexseePortalApp.deviceType = null;


HexseePortalApp.run(['$rootScope',function($rootScope){

    HexseePortalApp.$rootScope = $rootScope;

    $rootScope.idUser = localStorage.getItem('inforUserID');

    $rootScope.is_login = HexseePortalApp.is_login;

    var check_disconnect_server = function(){

        HexseePortalApp.ManagementTimer.timeout(function(){
            HexseePortalApp.showAlertLoseServer(function(){
                HexseePortalApp.showHideLoading(true);
                HexseePortalApp.destroyApp();
            });
        }, 1000);


        var check_connect_server = function(){

            HexseePortalApp.showHideLoading(true);

            HexseePortalApp.transferIO.clearAllReceivedFnc();
            HexseePortalApp.transferIO.removeListener();

            HexseePortalApp.destroyApp();

            HexseePortalApp.initElHtml();

            HexseePortalApp.initApp();

            HexseePortalApp.transferIO.removeListener('disconnect', check_disconnect_server);
        };

        HexseePortalApp.transferIO.addListener('connect', check_connect_server);
    };

    window.onbeforeunload = function (e) {
        HexseePortalApp.ManagementTimer.clearAll();

        HexseePortalApp.transferIO.removeListener('disconnect', check_disconnect_server);
    };

    HexseePortalApp.transferIO.addListener('disconnect', check_disconnect_server);

}]);


HexseePortalApp.config( function ($compileProvider, $sceDelegateProvider, $sceProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^s*(https?|ftp|file)|data:image/);

    $sceProvider.enabled(false);
});


HexseePortalApp.animation('.boxToolbar', function ($timeout, $rootScope) {
    return {
        enter: function (element, done) {
            var boxs = element.find('.boxs');
            boxs.removeClass('bounceInUp');
            boxs.removeClass('fadeOutDown');
            boxs.addClass('animated bounceInUp ');
            /*element.find('.scoll-box-ad').mCustomScrollbar({
                callback:{
                    onTotalScroll: function(ev){
                        console.log(ev)
                    },
                    onScroll:function(){
                        console.log(this);
                    },
                    onTotalScrollOffset:100
                }
            });*/


            if(element.find('#box-new-adventure').length > 0){
                element.find('.scoll-box-ad').each(function(index,list_el){

                    list_el.scrollTop = 0;

                    list_el.addEventListener('scroll', function(){
                        if((list_el.scrollTop + list_el.clientHeight) + 100 > list_el.scrollHeight){
                            if(list_el.className.search('added-list') != -1){
                                $rootScope.loadMoreAdventureList('added');
                            }else if(list_el.className.search('joined-list') != -1){
                                $rootScope.loadMoreAdventureList('joined');
                            }
                        }
                    });
                });
            }


            boxs.css({
                'opacity': 1,
                'display': 'block'
            });
        },
        leave: function (element, done) {
            var boxs = element.find('.boxs');
            $rootScope.adventure_detail_list = [];
            $timeout(function () {
                boxs.addClass('fadeOutDown');
                if ($('.load-spec').length) {
                    console.log(11);
                    boxs.addClass('fadeOutDown');
                }
            });
            $timeout(function () {
                element.remove();
            }, 1000);
        }
    }
});

HexseePortalApp.animation('.boxAdventureDetail', function () {
    var _left = isMobileDevice();
    return {
        enter: function (element, done) {
            // Run animation
            element.find('#box-new-adventure-detail').animate({
                left: _left.enter,
                display: 'block'
            }, _left.delay, function () {
                $(this).css({
                    "display": "block"
                });
                $(this).addClass('sign-on');
            });

            return function (cancelled) {

            }
        },
        leave: function (element, done) {
            element.find('#box-new-adventure-detail').animate({
                left: _left.leave
            }, _left.delay, function () {
                $(this).css({
                    'display': 'none'
                });
                $(this).remove();
            })
        }
    }
});

isMobileDevice = function () {
    var $ = jQuery;
    var _left = {
        enter: '',
        leave: ''
    };
    if ($(window).width() < Helpers.screen) {
        _left.enter = 0;
        _left.leave = 0;
        _left.delay = 0;
    } else {
        _left.enter = 700;
        _left.leave = 328;
        _left.delay = 800;
    }
    return _left;
};

function WebSocketTest()
{
    //console.log("typeof WebSocket == 'function'",typeof WebSocket == 'function');

    if (typeof WebSocket == 'function' || typeof WebSocket == 'object')
    {
        return true;
    }
    else
    {
        return false;
    }
}

HexseePortalApp.showHideLoading = function(flag){
    if(flag){
        HexseePortalApp.el_loading.style.display = 'block';
    }else{
        HexseePortalApp.el_loading.style.display = 'none';
    }
};

/**
 *
 * @param [function] callback
 */
HexseePortalApp.showAlertLoseServer = function(callback){
    bootbox.alert(appConfig.message_error.connect.loseServer, callback);
};

HexseePortalApp.destroyApp = function(){

    if(typeof HexseeApplication.$rootScope == 'object' && typeof HexseeApplication.$rootScope.$destroy == 'function')
        HexseeApplication.$rootScope.$destroy();

    HexseePortalApp.$rootScope = null;

    HexseePortalApp.is_login = false;

    if(HexseePortalApp.el_hexsee_application instanceof HTMLElement)
        document.body.removeChild(HexseePortalApp.el_hexsee_application);

    HexseePortalApp.el_hexsee_application = null;
    HexseePortalApp.jq_el_hexsee_application = null;

    HexseePortalApp.showHideLoading(false);
};

HexseePortalApp.initApp = function(){
    var token = localStorage.getItem('inforUserCurrent_token');

    if(token != null){
        HexseePortalApp.transferIO.authWithCustomToken(token, function(result){

            if(result.error == null){
                HexseePortalApp.is_login = true;

                HexseePortalApp.authData = result.authData;
                HexseePortalApp.appData = result.appData;
            }else{
                HexseePortalApp.is_login = false;
                HexseePortalApp.authData = null;
                HexseePortalApp.appData = null;
            }

            HexseePortalApp.ManagementTimer.clearAll();

            bootbox.hideAll();

            angular.bootstrap(HexseePortalApp.el_hexsee_application, ['HexseePortalApp']);

            HexseePortalApp.checkDomOfExtension();

        });
    }else{

        HexseePortalApp.is_login = false;
        HexseePortalApp.authData = null;
        HexseePortalApp.appData = null;

        HexseePortalApp.ManagementTimer.clearAll();

        bootbox.hideAll();

        angular.bootstrap(HexseePortalApp.el_hexsee_application, ['HexseePortalApp']);

        HexseePortalApp.checkDomOfExtension();
    }
};

HexseePortalApp.initElHtml = function(){
    if(HexseePortalApp.el_hexsee_application_alone != null){

        HexseePortalApp.el_hexsee_application = HexseePortalApp.el_hexsee_application_alone.cloneNode(true);
        HexseePortalApp.jq_el_hexsee_application = $(HexseePortalApp.el_hexsee_application);
        document.body.appendChild(HexseePortalApp.el_hexsee_application);
    }
};

HexseePortalApp.checkDomOfExtension = function(){
    HexseePortalApp.ManagementTimer.interval(function(){
        if(document.getElementById('HexseeExtension') != null){
            HexseePortalApp.destroyApp();

            // reset url page.
            window.location = window.location.href.replace(window.location.hash, '');
        }
    }, 1000);
};

function setInstallationId(installationId, deviceId, deviceType){
    HexseePortalApp.installationId = installationId;
    HexseePortalApp.deviceId = deviceId;
    HexseePortalApp.deviceType = deviceType;
};

$(document).ready(function(){

    if(WebSocketTest()){
        HexseePortalApp.el_loading = document.getElementById('loading');
        HexseePortalApp.el_hexsee_application = document.getElementById('HexseeApplication');
        HexseePortalApp.jq_el_hexsee_application = $(HexseePortalApp.el_hexsee_application);
        HexseePortalApp.el_hexsee_application_alone = HexseePortalApp.el_hexsee_application.cloneNode(true);

        HexseePortalApp.transferIO = new transfer_io(appConfig.url_api);

        HexseePortalApp.ManagementTimer.timeout(function(){
            HexseePortalApp.showAlertLoseServer(function(){
                HexseePortalApp.showHideLoading(true);
            });
        }, 30 * 1000); // 0.5 min

        var check_connect_server = function(){

            HexseePortalApp.ManagementTimer.timeout(function(){
                if(document.getElementById('HexseeExtension') == null){
                    HexseePortalApp.initApp();
                }else{
                    HexseePortalApp.ManagementTimer.clearAll();
                    HexseePortalApp.showHideLoading(false);
                }
            }, 300);


            HexseePortalApp.transferIO.removeListener('connect', check_connect_server);
        };

        HexseePortalApp.transferIO.addListener('connect', check_connect_server);

        HexseePortalApp.transferIO.initSocket();
    }else{
        alert(appConfig.message_error.connect.notsupport);
    }


});