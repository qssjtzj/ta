$(document).ready(function() {

});

/**
 * open全局名称空间对象,全局参数
 */
var openutil = {};

/**
 * open工具类
 */
openutil.utils = {
		// 毫秒时间转本地时间
		getLocalTime : function(nS) {     
			return new Date(parseInt(nS)).format("yyyy-MM-dd hh:mm:ss");     
		},
		getLocalDate : function(nS) {     
			return new Date(parseInt(nS)).format("yyyy-MM-dd");     
		},
		// 从url中获取参数
		getParamFromUrl : function(sArgName){
			var sHref = window.location.href;
			var args = sHref.split("?");
			var retval = ""; 
			if(args[0] == sHref) {  /* 参数为空 */
				return retval; /* 无需做任何处理 */ 
			} 
			var str = args[1]; 
			args = str.split("&"); 
			for(var i = 0; i < args.length; i++ ){ 
				str = args[i]; 
				var arg = str.split("="); 
				if(arg.length <= 1) continue; 
				if(arg[0] == sArgName) retval = arg[1]; 
			} 
			return retval;
		}
}


/**
 * 键盘监听工具
 */
opencyou.keyboard = {
	tempoldcallback : null,
	keydownmap : new Map(),
	// 监听回调
	keydownCallback : function(key) {
		var callback = opencyou.keyboard.keydownmap.get(key);
		if (undefined != callback) {
			callback();
		}
	},
	// 监听回调方法注册,如果没传callback参数 代表删除该key的监听
	keydownRegisterOrRemoveCallback : function(key, callback) {
		var oldcallback = opencyou.keyboard.keydownmap.get(key);
		if (undefined != callback) {
			opencyou.keyboard.keydownmap.put(key, callback);
		} else {
			opencyou.keyboard.keydownmap.remove(key);
		}
		if (undefined != oldcallback) {
			return oldcallback;
		}
	}
}

/**
 * 通用基础类Map
 */
function Map() {
	this.container = new Object();
}
Map.prototype.put = function(key, value) {
	this.container[key] = value;
}
Map.prototype.get = function(key) {
	return this.container[key];
}
Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for ( var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		keyset[count] = key;
		count++;
	}
	return keyset;
}
Map.prototype.size = function() {
	var count = 0;
	for ( var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		count++;
	}
	return count;
}
Map.prototype.remove = function(key) {
	delete this.container[key];
}
Map.prototype.toString = function() {
	var str = "";
	for ( var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
		str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
	}
	return str;
}
Date.prototype.format = function(format){
	var o = {
	"M+" : this.getMonth()+1, // month
	"d+" : this.getDate(), // day
	"h+" : this.getHours(), // hour
	"m+" : this.getMinutes(), // minute
	"s+" : this.getSeconds(), // second
	"q+" : Math.floor((this.getMonth()+3)/3), // quarter
	"S" : this.getMilliseconds() // millisecond
	};
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};
/**
 * 字符串去空格函数
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
