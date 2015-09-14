/*
 * Developer : Morgan
 * Date : 8/13/2015
 * All code (c)2015 Groupsurfing inc. all rights reserved
 */

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};



function str_replace(search, replace, subject, count) {
    //  discuss at: http://phpjs.org/functions/str_replace/

    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp)
                .split(f[j])
                .join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
}


/**
 Management timeout and interval
 */

function ManagementTimer(){
    var self = this;
    self.timeoutList = [];
    self.intervalList = [];

    self.timeout = function(fnc, time){
        var timer = window.setTimeout(fnc, time);
        self.timeoutList.push(timer);

        return timer;
    };

    self.interval = function(fnc, time){
        var timer = window.setInterval(fnc, time);
        self.intervalList.push(timer);

        return timer;
    };

    self.clearAllTimeoutList = function(){
        for(var i = 0, length = self.timeoutList.length; i < length; ++i){
            window.clearTimeout(self.timeoutList[i]);
        }

        self.timeoutList = [];
    };

    self.clearAllIntervalList = function(){
        for(var i = 0, length = self.intervalList.length; i < length; ++i){
            window.clearInterval(self.intervalList[i]);
        }

        self.intervalList = [];
    };

    self.clearAll = function(){
        self.clearAllTimeoutList();
        self.clearAllIntervalList();
    }
}