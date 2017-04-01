
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
