
/*通用js*/

$(document).ready(function(){
    TA.init();
});

var TA = {
    apiPath:"http://dbapi.iyoho.mobi",
    init:function(){
        this.mobile();
    },
    mobile:function(){
        //移动端跳转
        var ua = navigator.userAgent.replace(/\s/g, '');
        if (/AppleWebKit.*Mobile/i.test(ua) || /Android.*Mobile/i.test(ua) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(ua)) || (/Mozilla\/.*(X\d+;U;Linuxi\d+;zh-CN;rv:.*)Gecko/i.test(ua))) {
            window.location.href = "http://m.iyoho.mobi";
        }
    },

}

var common={};

/**
 * cookieg处理工具对象
 */
common.cookies = {
    // 创建cookie
    create : function(name, value, minutes) {
        var expires = "";
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    // 读取cookie
    read : function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for ( var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length),
                    "UTF-8");
        }
        return null;
    },
    // 删除cookie
    remove : function(name) {
        common.cookies.create(name, "", -1);
    }
};

/**
 * 键盘监听工具
 */
common.keyboard = {
    tempoldcallback : null,
    keydownmap : new Map(),
    // 监听回调
    keydownCallback : function(key) {
        var callback = common.keyboard.keydownmap.get(key);
        if (undefined != callback) {
            callback();
        }
    },
    // 监听回调方法注册,如果没传callback参数 代表删除该key的监听
    keydownRegisterOrRemoveCallback : function(key, callback) {
        var oldcallback = common.keyboard.keydownmap.get(key);
        if (undefined != callback) {
            common.keyboard.keydownmap.put(key, callback);
        } else {
            common.keyboard.keydownmap.remove(key);
        }
        if (undefined != oldcallback) {
            return oldcallback;
        }
    }
};

/*工具*/
String.prototype.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};
Array.prototype.contains = function(item){
    return RegExp(item).test(this);
};

var RequestUtil = {

    credent:function(type, url, data, success){

        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: success
        });
    },

}
