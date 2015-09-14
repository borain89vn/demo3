/*
 * Developer : Morgan
 * Date : 15/5/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


HexseePortalApp.directive("lostPassword", function ($rootScope) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).click(function () {
                var object_Box = "#box-lost-password";
                var object_lose = ".lose-button";
                $(object_Box).find('form').off('submit');
                $(object_Box).find('form').on('submit', function () {
                    var email = $(object_Box).find('.email').val();
                    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
                    if (email == '' || !re.test(email)) {
                       $(object_Box).find('.error').html("Sorry, we can't find you - try again or register as New User");
                        return false;
                    }
                    HexseePortalApp.showHideLoading(true);
                    $rootScope.transferIO.forgotPassword(email, function (result) {
                        console.log(result);
                        var error = result.error;
                        if (error != null) {
                            switch (error.code) {
                            case "INVALID_USER":
                                //bootbox.alert({title:"The specified user account does not exist.",
                                //    message:' ', container:HexseeApplication.$div_app, closeButton:false});
                                $(object_Box).find('.error').html("The specified user account does not exist.");
                                console.log("The specified user account does not exist.");
                                break;
                            default:
                                $(object_Box).find('.error').html("Error resetting password!");
                                //bootbox.alert({title:"Error resetting password!",
                                //    message:' ', container:HexseeApplication.$div_app, closeButton:false});
                                console.log("Error resetting password:", error);
                            }
                        } else {
                            $rootScope.closebpopup();
                            $('.b-modal').removeAttr('style');
                            bootbox.alert({
                                title: "Password reset email sent successfully!",
                                message: ' ',
                                container: 'body',
                                closeButton: false
                            });
                            console.log("Password reset email sent successfully!");
                            $(object_Box).find('.error').html('');
                            $(object_Box).find('.email').val('');
                        }

                        HexseePortalApp.showHideLoading(false);
                    });
                });
            })
        }
    };
});