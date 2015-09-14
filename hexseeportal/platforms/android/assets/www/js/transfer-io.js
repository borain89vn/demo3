function transfer_io(url_socket){
    var self = this;

    self.idCon = null;

    self.url_socket = url_socket;
    self.num_req = 0;

    self.authData = null;
    self.token = null;
    self.appData = {};

    self.configSocket = {reconnectionDelay:200, reconnectionDelayMax:300};

    self.initSocket = function(){
        self.socket = io(self.url_socket, self.configSocket);

        self.socket.on('connect', function(){
            self.idCon = self.socket.id;
            console.log('connect');

            self.applyListener('connect');
        });

        self.socket.on('disconnect', function(){
            console.log('disconnect', self.socket);
            self.idCon = null;


            self.applyListener('disconnect');
        });

        self.listenTheAppData();
    };

    self.listernerList = {};
    self.addListener = function(listener_name, listener_fnc){
        if(typeof listener_fnc == 'function') {
            if (Array.isArray(self.listernerList[listener_name])) {
                self.listernerList[listener_name].push(listener_fnc);
            } else {
                self.listernerList[listener_name] = [listener_fnc];
            }
        }
    };

    self.removeListener = function(listener_name, listener_fnc){

        if(typeof listener_name != 'string'){
            self.listernerList = {};
            return;
        }

        if(typeof listener_fnc == 'function'){
            if(Array.isArray(self.listernerList[listener_name])){
                for(var i = 0, length = self.listernerList[listener_name].length; i < length; ++i){
                    if(self.listernerList[listener_name][i] == listener_fnc){
                        self.listernerList[listener_name].remove(i);
                    }
                }
            }
        }else{
            self.listernerList[listener_name] = [];
        }
    };

    self.applyListener = function(listener_name, result){
        if (Array.isArray(self.listernerList[listener_name])) {
            for(var i = 0, length = self.listernerList[listener_name].length; i < length; ++i){
                self.listernerList[listener_name][i](result);
            }
        }
    };

    self.listenTheAppData = function(){
        var listen_addedAdventure = function(result) {

            //console.log('listenTheAppData', 'addedAdventureList');

            if (result.status == 'child_added') {
                self.appData.addedAdventureList.unshift(result.data);
            } else if (result.status == 'child_removed') {
                for (var i = 0, length = self.appData.addedAdventureList.length; i < length; ++i) {
                    if (self.appData.addedAdventureList[i].id == result.data.id) {
                        self.appData.addedAdventureList.remove(i);
                        break;
                    }
                }
            }

            self.applyListener('addedAdventureList', result);
        };

        //self.track_fnc_receiveList('addedAdventureList', listen_addedAdventure, function(){});

        self.socket.on('addedAdventureList', listen_addedAdventure);

        var listen_joinedAdventure = function(result){
            if(result.status == 'child_added'){
                self.appData.joinedAdventureList.unshift(result.data);
            }

            self.applyListener('joinedAdventureList', result);
        };

        //self.track_fnc_receiveList('joinedAdventureList', listen_joinedAdventure, function(){});
        self.socket.on('joinedAdventureList', listen_joinedAdventure);

        var listen_FriendList = function(result){
            if(result.status == 'child_added'){
                self.appData.friendList.unshift(result.data);
            }

            self.applyListener('friendList', result);
        };

        //self.track_fnc_receiveList('friendList', listen_joinedAdventure, function(){});

        self.socket.on('friendList', listen_FriendList, function(){});

        var listen_receivedMessageList = function(result){
            if(result.status == 'child_added'){
                self.appData.receivedMessageList.unshift(result.data);
            }

            self.applyListener('receivedMessageList', result);
        };

        //self.track_fnc_receiveList('receivedMessageList', listen_receivedMessageList, function(){});

        self.socket.on('receivedMessageList', listen_receivedMessageList);
    };

    self.fnc_receiveList = {};
    self.track_fnc_receiveList = function(nameEvent,fnc_receive, callback, req){
        if(typeof self.fnc_receiveList[nameEvent] == 'undefined'){
            self.fnc_receiveList[nameEvent] = [];
        }
        self.fnc_receiveList[nameEvent].push({fnc_receive:fnc_receive, callback:callback, req:req});
    };
    self.untrack_fnc_receiveList = function(nameEvent, callback){

        if(Array.isArray(self.fnc_receiveList[nameEvent])){
            for(var i = 0, length = self.fnc_receiveList[nameEvent].length; i < length; ++i){
                if(typeof callback == 'function'){
                    if(self.fnc_receiveList[nameEvent][i].callback == callback){
                        self.socket.removeListener(nameEvent, self.fnc_receiveList[nameEvent][i].fnc_receive.fnc);
                        self.fnc_receiveList[nameEvent].remove(i);
                        break;
                    }
                }else{
                    if(typeof self.fnc_receiveList[nameEvent][i] == 'object'){
                        self.socket.removeListener(nameEvent, self.fnc_receiveList[nameEvent][i].fnc_receive.fnc);
                        self.fnc_receiveList[nameEvent].remove(i);
                    }

                }
            }
        }

    };
    self.untrack_fnc_receiveList_with_fnc_receive = function(nameEvent, fnc_receive){

        for(var i = 0, length = self.fnc_receiveList[nameEvent].length; i < length; ++i){
            if(typeof callback == 'function'){
                if(self.fnc_receiveList[nameEvent][i].fnc_receive.fnc == fnc_receive.fnc){
                    self.socket.removeListener(nameEvent, self.fnc_receiveList[nameEvent][i].fnc_receive.fnc);
                    self.fnc_receiveList[nameEvent].remove(i);
                    break;
                }
            }else{
                //console.log('untrack_fnc_receiveList', self.fnc_receiveList[nameEvent][i], nameEvent, i);
                if(typeof self.fnc_receiveList[nameEvent][i] == 'object'){
                    self.socket.removeListener(nameEvent, self.fnc_receiveList[nameEvent][i].fnc_receive.fnc);
                    self.fnc_receiveList[nameEvent].remove(i);
                }

            }
        }
    };

    self.clearAllReceivedFnc = function(){
        console.log('call clearAllReceivedFnc');
        for(var name in self.fnc_receiveList){
            if(typeof self.fnc_receiveList[name] != 'undefined'){
                for(var i = 0; i < self.fnc_receiveList[name].length;++i){
                    var receivefnc = self.fnc_receiveList[name][i];
                    if(typeof receivefnc.fnc_receive == 'object' &&
                        typeof receivefnc.fnc_receive.fnc == 'function'){
                        //console.log('clearAllReceivedFnc', name);
                        self.socket.removeListener(name, receivefnc.fnc_receive.fnc);
                    }
                }
            }
        }

        self.fnc_receiveList = {};
    };

    self.connectOnAgain = function(){
        console.log('fnc_receiveList', self.fnc_receiveList);
        for(var name in self.fnc_receiveList){
            console.log('connectOnAgain', name, self.fnc_receiveList[name]);
            if(self.fnc_receiveList[name].length > 0){
                for(var i = 0; i < self.fnc_receiveList[name].length;++i){
                    var receivefnc = self.fnc_receiveList[name][i];

                    if(typeof receivefnc.fnc_receive.fnc == 'function')
                        self.socket.removeListener(name, receivefnc.fnc_receive.fnc);

                    if(typeof receivefnc.req == 'object'){
                        receivefnc.req.id_transfer = receivefnc.fnc_receive.id_transfer;
                        self.socket.emit(name, receivefnc.req);
                    }


                    self.socket.on(name, receivefnc.fnc_receive.fnc);
                }
            }
        }
    };

    var _postTransfer = function(nameEvent, data , callbacks, isON, id_transfer){
        if(self.socket.connected && self.idCon != null) {

            var req = {data:data, id_transfer:id_transfer};

            self.socket.emit(nameEvent, req);

            if(isON != null){
                self.num_req++;
                var fnc_receive = {fnc: function (resp) {
                    if (resp.id_transfer == fnc_receive.id_transfer) {
                        if(!isON){
                            self.socket.removeListener(nameEvent, fnc_receive);
                            self.untrack_fnc_receiveList_with_fnc_receive(nameEvent, fnc_receive);
                        }
                        if(typeof callbacks == 'function')
                            callbacks(resp.data);

                    }
                },
                    id_transfer: id_transfer
                };

                self.track_fnc_receiveList(nameEvent, fnc_receive, callbacks, req);


                self.socket.on(nameEvent, fnc_receive.fnc);

                /*
                 if (isON){
                 self.socket.on(nameEvent, fnc_receive);
                 }else{
                 self.socket.once(nameEvent, fnc_receive);
                 }*/
            }

        }
    };

    /**
     *
     * @param [string] nameEvent
     * @param [object] data
     * @param [function] callbacks
     * @param [boolean] isON
     * @returns {*}
     */
    self.postTransfer = function(nameEvent, data , callbacks, isON){
        if(self.socket.connected && self.idCon != null) {
            var id_transfer = self.idCon+self.num_req;

            _postTransfer(nameEvent, data , callbacks, isON, id_transfer);

            return id_transfer;
        }

        return null;

    };

    self.createPortIO = function(nameEventMain, data , callbacks, isON){
        var id_transfer = self.postTransfer(nameEventMain, data , callbacks, isON);

        if(id_transfer != null){
            var portIO = {
                id_transfer: id_transfer,
                on: function(nameEvent, data , callbacks){
                    _postTransfer(nameEvent, data , callbacks, true, id_transfer);
                    trackEventPort(nameEvent);
                },
                once: function(nameEvent, data , callbacks){
                    _postTransfer(nameEvent, data , callbacks, false, id_transfer);

                    trackEventPort(nameEvent);
                },
                listen: function(nameEvent, callbacks){
                    var fnc_receive = function (resp) {
                        if (resp.id_transfer == id_transfer) {
                            callbacks(resp.data);
                        }
                    };

                    self.track_fnc_receiveList(nameEvent, fnc_receive, callbacks);


                    trackEventPort(nameEvent);

                    self.socket.on(nameEvent, fnc_receive);
                },
                close: function(){
                    for(var i = 0, length = Listenerlist.length; i < length; ++i){
                        self.untrack_fnc_receiveList(Listenerlist[i]);
                    }
                }
            };

            var Listenerlist = [];

            var trackEventPort = function(nameEvent){
                Listenerlist.push(nameEvent);
            };

            return portIO;
        }

        return null;
    };

    self.on = function(nameEvent, data , callbacks){
        self.postTransfer(nameEvent, data , callbacks, true);
    };

    self.once = function(nameEvent, data , callbacks){
        self.postTransfer(nameEvent, data , callbacks, false);
    };

    self.off = function(nameEvent, fnc){
        self.socket.removeListener(nameEvent, fnc);
    };

    self.resendConfirmationEmail = function(callback){
        console.log('resendConfirmationEmail', callback);
        self.once('resendConfirmationEmail', {}, callback);
    };

    self.register = function(registerData, callback){

        /*
         registerData {
         userData: $scope.register,
         soloAdventure: {namePage: window.document.title, uriPage: window.location.href}
         }
         * */

        if(typeof registerData == 'object'){
            self.once('registerApp', registerData, function(result){
                callback(result);
            });
        }
    };

    self.authWithPassword = function(email, password, callback){

        /*self.once('loginApp',{email:email, password:password}, function(data){
         self.authData = data.authData;
         self.token = data.authData.token;
         self.appData = data.appData;

         callback(data);
         });
         */

        self.once('loginApp',{email:email, password:password},function(data){
            //console.log('loginApp',JSON.stringify(data),JSON.stringify({email:email, password:password}));

            if(data.error == null){
                if(data.authData == null){

                    window.location.reload();
                    return;
                }
                self.authData = data.authData;
                self.token = data.authData.token;
                self.appData = data.appData;

                localStorage.setItem('token', self.token);

                //delete data.authData;
                //delete data.appData;

                self.applyListener('LoginSuccessfully');
            }
            callback(data);
        });
    };

    self.authWithCustomToken = function(token, callback){
        self.once('authWithToken',token, function(data){
            if(data.error == null){
                self.authData = data.authData;
                self.token = data.authData.token;
                self.appData = data.appData;

                self.applyListener('LoginSuccessfully');
            }

            callback(data);
        });
    };

    self.logout = function(callback){
        localStorage.removeItem('token');

        self.once('logout',{},callback);
    };

    self.forgotPassword = function(email,callback){
        self.once('forgotPassword',{email:email},callback);
    };

    self.updateUserInfo = function(data, callback){
        /* data: {firstname: '', lastname: ''} */

        self.once('changeInfoUser',data,callback);
    };

    self.updateAvatarUser = function(avatar, callback){

        self.once('changeAvatarUser',avatar,callback);
    };

    self.changePassword = function(old_password, new_password, callback){

        self.once('changePassword',{old_pass: old_password, new_pass: new_password},callback);
    };

    self.getUserInfo = function(user_id, callback){
        self.once('getInfoUser',user_id,callback);
    };

    self.getAvatarUser = function(user_id, callback){
        self.once('getUserAvatar',user_id,callback);
    };

    self.watchAvatarUser = function(user_id, callback){
        self.on('watchUserAvatar',user_id, callback);
    };

    self.watchUserInfo = function(user_id, callback){
        self.on('watchInfoUser',user_id, callback);
    };

    self.startNewAdventure = function(invitedEmails, invitedUsers, page_name, page_uri, adventure_name, callback){
        /*
         {invitedEmails:invitedEmails,invitedUsers:[],
         page:{name:window.document.title, uri:window.location.href}, adventure:{name:$scope.nameAdventure}}
         */

        var data = {invitedEmails:invitedEmails,invitedUsers:invitedUsers,
            page:{name:page_name, uri:page_uri}, adventure:{name:adventure_name}};

        self.once('startNewAdventure', data, callback);
    };

    self.addMemberToCurrentAdventure = function(invitedEmails, invitedUsers, page_id, adventure_id, callback){
        /*
         {invitedEmails:invitedEmails,invitedUsers:[],
         page_id:$scope.newAdventureData.page_id, adventure_id:$scope.newAdventureData.adventure_id}
         */

        var data = {invitedEmails:invitedEmails,invitedUsers:invitedUsers,
            page_id:page_id, adventure_id:adventure_id};

        self.once('addMemberToCurrentAdventure', data, callback);
    };

    self.initTab = function(adventure_id, title, url, callback){

        /* data : {adventure_id:'' , url:'', title:''} */

        var data = {adventure_id:adventure_id, url: url, title:title};

        return self.createPortIO('initTab',data,callback, false );
    };

    self.watchMembersOfAdventure = function(adventure_id, callback){
        self.on('watchMemberIntoAdventure', {adventure_id:adventure_id},function(result){
            if(result.adventure_id == adventure_id){
                callback(result);
            }
        });
    };

    self.watchthreadMessageList = function(page_id, callback){
        self.on('watchThreadMessageOfPage', {page_id:page_id},function(result){
            if(result.page_id == page_id){
                callback(result);
            }
        });
    };

    self.create_thread_message = function(port, content_message, type_message, pageX, pageY, callback){
        /* data : position {pageX, pageY},
         content_message, type_message */
        var data = {position:{pageX:pageX, pageY:pageY}, content_message:content_message, type_message:type_message};

        port.once('createThreadMessage', data, callback);
    };

    self.create_thread_message_in_page = function(adventure_id, page_id, uri, content_message, type_message, pageX, pageY, callback){
        /* data : adventure_id, page_id, uri ,position {pageX, pageY},
         content_message, type_message */
        var data = {adventure_id:adventure_id, page_id:page_id,uri:uri,position:{pageX:pageX, pageY:pageY}, content_message:content_message, type_message:type_message};

        self.once('createThreadMessageInPage', data, callback);
    };

    self.post_message = function(threadmessage_id, content, type, callback){
        /* data :  content_message, type_message */
        var data = {threadmessage_id:threadmessage_id,content:content, type:type};

        self.once('postMessageToThreadMessage', data, callback);
    };

    self.watchMessagesByThreadMessage = function(threadmessage_id, callback){
        /* data :  content_message, type_message */
        var data = {threadmessage_id:threadmessage_id};

        self.on('watchMessagesByThreadMessage', data, function(message){
            if(message.threadmessage_id == threadmessage_id){
                callback(message);
            }
        });
    };

    self.getMessagesByThreadMessage = function(port, threadmessage_id, callback){
        /* data :  content_message, type_message */
        var data = {threadmessage_id:threadmessage_id};

        console.log('getMessagesByThreadMessage', threadmessage_id);

        port.once('getMessagesByThreadMessage', data, function(result){
            console.log('getMessagesByThreadMessage result', result,threadmessage_id);
            if(result.threadmessage_id == threadmessage_id){
                callback(result);
            }
        });
    };

    self.getCurrentTime = function(callback){
        self.once('current_time',{},callback);
    };

    self.updateMemberData = function(adventure_id, uid,typeData, value){

        if(typeData == 'status'){
            console.log('update memeber data', adventure_id, value);
        }

        _postTransfer('updateMemberData', {adventure_id:adventure_id,
            typeData:typeData,value:value, uid:uid}, null,null, 'id');
    };

    self.getOneAdventure = function(adventure_id, callback){
        self.once('getOneAdventure', {adventure_id:adventure_id}, callback);
    };

    self.getPositionAndCurrentPageOfMember = function(adventure_id, uid, callback){
        self.once('getPositionAndCurrentPageOfMember', {adventure_id: adventure_id, uid:uid}, callback);
    };

    self.getDetailAdventure = function(adventure_id, callback){
        self.once('getDetailAdventure', {adventure_id:adventure_id}, callback);
    };

    self.getPositionAndCurrentPageOfLeaderAdventure = function(adventure_id, callback){
        self.once('getPositionAndCurrentPageOfLeaderAdventure', {adventure_id:adventure_id}, callback);
    };

    self.activatedTab = function(adventure_id, callback){
        self.once('activatedTab', {adventure_id:adventure_id}, callback);
    };

    self.clearingActivatedTab = function(callback){
        self.once('clearingActivatedTab', {}, callback);
    };

    self.getJournalTimeline = function(callback){
        return self.createPortIO('getJournalTimeline',{},callback, false );
    };

    self.watchThreadMessagesByPageIs = function(port,callback){
        port.listen('watchThreadMessagesByPageIs', callback);
    };

    self.getOneAdventureTimeline = function(adventure_id, callback){
        self.once('getOneAdventureTimeline', {adventure_id:adventure_id},callback);
    };

    self.getOneAdventureMessageTimeline = function(adventure_id, callback){
        self.once('getOneAdventureMessageTimeline', {adventure_id:adventure_id},callback);
    };

    self.watchPagesOfAdventure = function(adventure_id, callback){
        self.untrack_fnc_receiveList('watchPagesOfAdventure', callback);
        self.on('watchPagesOfAdventure', {adventure_id:adventure_id},callback);
    };

    self.watchMessagesOfAdventure = function(adventure_id, callback){
        self.untrack_fnc_receiveList('watchMessagesOfAdventure', callback);
        self.on('watchMessagesOfAdventure', {adventure_id:adventure_id},callback);
    };

    self.watchThreadMessageOfAdventure = function(adventure_id, callback){
        self.on('watchThreadMessageOfAdventure', {adventure_id:adventure_id},callback);
    };

    self.createPageIntoAdventure = function(adventure_id, url, name, callback){
        self.once('createPageIntoAdventure', {adventure_id:adventure_id, url:url, name:name},callback);
    };

    self.getMoreAdventureList = function(type_list, callback){
        //data {type_list:'added', 'joined', create_time_old_item}

        self.once('getMoreAdventureList', {type_list:type_list}, callback);
    };

    self.registerDevice = function(deviceType, deviceId, installationId, appVersion, osVersion, callback){
        //data {deviceType:'', deviceId:'', installationId:'', appVersion:'', osVersion:''}

        self.once('registerDevice', {deviceType:deviceType, deviceId:deviceId,
            installationId:installationId, appVersion:appVersion, osVersion:osVersion}, callback);
    };

    self.removeDevice = function(installationId, callback){
        //data {deviceType:'', deviceId:'', installationId:'', appVersion:'', osVersion:''}

        self.once('removeDevice', {installationId:installationId}, callback);
    }
}