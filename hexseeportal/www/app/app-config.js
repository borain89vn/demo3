/*
 * Developer : Morgan
 * Date : 8/12/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */


var appConfig = {};


//appConfig.url_api = 'https://hexsee.com:9550/';
appConfig.url_api = 'https://hexsee.com:9560/';
//appConfig.url_api = 'http://localhost:9550/';

appConfig.url_portal = window.location.href.replace(window.location.hash, '');

appConfig.max_number_member_on_adventure = 10;

appConfig.message_error = {};
appConfig.message_error.adventure = {
    limitNumberMember: 'A adventure only has ' + appConfig.max_number_member_on_adventure + ' members.',
    startSuccessfully: 'Adventure was started successfully',
    notCheckMember:'Please add one or more Friends or enter their email address to start a adventure!'
};
appConfig.message_error.edit_username = [
    'The file upload not supported ! ',
    'The file size can not exceed 3MB !',
    'The password length be longer than 6 characters ',
    'First name is min 3 characters and max 12 characters',
    'Last name is min 3 characters and max 12 characters',
    'You need confirm password !',
    'The specified email address is already in use',
    'Error ! Please try agian',
    'Please accept our license condition',
    'Please input your first name',
    'Please input your last name',
    'You may not use "Hexsee" in your first name or your last name!'
];
appConfig.message_error.password = {
    short:"The password length be longer than 6 characters"
};
appConfig.message_error.change_password = {
    not_match: 'These passwords don`t match. Try again?',
    incorrect: "The specified user account password is incorrect.",
    error:"Error changing password!"
};

appConfig.message_error.connect ={
    loseConnection: "Currently your network is problem, The Hexsee extension was temporarily pause.",
    loseServer: "The server couldn’t be contacted so the service has been temporarily paused: RC0001.",
    notsupport: "Currently, your browser is old version. Would you like upgrade new version to use our website?"
};