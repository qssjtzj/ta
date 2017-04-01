var debug = false;
var ielog = false;

var rclog = function() {
    if (debug && console && console.log) {
         console.log.apply(console, arguments);
    }
};

var ielog = function() {
 	var ie10 = navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/MSIE/, '')) < 11;
	
    if (!ie10 && console && console.log) {
         console.log.apply(console, arguments);
    }
};
window.anchor_id = 0;
window.WebRC = (function() {
    function type(source) {
        if (source === undefined) {
            return 'undefined';
        } else if (source === null) {
            return 'null';
        } else {
            return Object.prototype.toString.call(source).match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
        }
    }
    function inArray(value, arr) {
        if (arr.indexOf) {
            return arr.indexOf(value);
        } else {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === value) {
                    return i;
                }
            }
            return -1;
        }
    }
    function extend(target, obj) {
        if (type(target) == 'object' && type(obj) == 'object') {
            for (var key in obj) {
                if (obj[key]) {
                    target[key] = obj[key];
                }
            }
        }
        return target;
    }
	
    var eventListener = {};
    var eventList = [];
    eventList.push('data', 'set'); //Custom javascript event
    eventList.push('ready', 'connect', 'init', 'setting', 'close', 'log', 'alert', 'error', 'call', 'status'); //Global event
    //eventList.push('sns.invite', 'sns.share'); //Invite and share event
    eventList.push('broadcast.push','notice.msg'); //Chat broadcast message event
    eventList.push('msg.push', 'msg.send'); //Chat user message event
    //eventList.push('user.init', 'user.enter', 'user.leave', 'user.kick', 'user.change', 'user.login', 'user.logout', 'user.follow'); //Chat users event
	eventList.push('memberList.update');
	eventList.push('DJDetailedInfo');
    eventList.push('gift.send', 'flower.send','follow.update','flower.update','showCar' );//,'flower.send.result'); //Flower users event
    //eventList.push('gift.get'); //Gift users event
    eventList.push('guardButton.click', 'applyToBuyGuard.response','getAvailableToBuyGuardInfo.response','getGuardList.response','guardBuySuccessBroadcast');//Guard action
	//'guard.login', 
	eventList.push('vipUsers.update','guardUsers.update','showSwf','showGift','href.pay','href.exchange','guradUser.enterChannel'); 
	eventList.push('common.debugInfo'); //程序日志
	eventList.push('inited.succeeded','common.follow','common.rankLists','common.giftNews','setsingerinfo');
	eventList.push('userLogin.succeeded','userLogin.failed', 'channel.loginSucceeded','channel.loginFailed','channel.chatText','userLogin.beKickedOff'); //Flower users event
    //
    //Setup flash -> Flash ready event -> Auto connect server -> Flash connect event -> Flash API event
    //Flash API: this.movie.connect(opts)   this.movie.close()   this.movie.setData(command,args)
    var WebRC = function(opts) {
        this.conf = extend({
            sid: 0,
            cid: 0,
            uid: 0,
            param: '',
            guid: '',
            host: '',
            port: ''
        }, opts);
        this.target = '';
        this.swf = 'flash/STShow-w.swf';
        this.movie = null;
		this.giftswf = null;
        this.connected = false;
    };
    WebRC.prototype.setup = function(target, swf) {
		
        if (typeof swfobject == 'undefined') {
            throw 'SWFObject plugin is not found! Please download from http://code.google.com/p/swfobject/';
        } else if (!target) {
            throw 'Flash setup target element id is undefined';
        } else if (this.target) {
            throw 'Can only call setup on a WebRC Object once';
        }
        this.target = target;
        
        var path = (swf || this.swf); //+ '?' + new Date().getTime();
        var vars = {};
        var params = {
            //menu: 'false',
           // quality: 'high',
            wmode: 'transparent',//'opaque', //'window',//transparent
            allowScriptAccess: 'sameDomain',//'always',
            //allowNetworking: 'all',
            allowFullScreen: 'true'
            //bgcolor: '#FFFFFF'
        };
        var attrs = {};
		
		/*if(window.location.href.indexOf("/live/v.html")>0){
			return swfobject.embedSWF(path, target, '100%', lastFlashHeight, '10.1', 'js/expressInstall.swf', vars, params, attrs);
			
		}*/
		
		//if(window.location.href.indexOf("/live/t.html")>0){
			return swfobject.embedSWF(path, target, '600', lastFlashHeight, '10.1', 'js/expressInstall.swf', vars, params, attrs);
			
		//}
		
		//return swfobject.embedSWF(path, target, '600', '722', '10.1', 'js/expressInstall.swf', vars, params, attrs);
        
    };
	 WebRC.prototype.initGift = function(target, swf) {
        var vars = {};
        var attrs = {};
		swfobject.embedSWF("/live/flash/demo.swf", target, '100%', '100%', '10.1', 'js/expressInstall.swf', vars, {wmode: "transparent"}, attrs);
		this.giftswf = document.getElementById(this.target);
    };
   /* WebRC.prototype.connect = function(opts) {
		rclog("connect");
        if (this.movie) {
            if (this.connected) {
                this.close();
            }
            this.movie.connect(extend(this.conf, opts));
        }
    };
    WebRC.prototype.close = function() {
        this.connected = false;
        if (this.movie && this.movie.close) {
            this.movie.close();
        }
    };
    WebRC.prototype.onData = function(command, args) { //Flash Callback
		
        command = command.toString().toLowerCase();
		rclog("WebRC.prototype.onData",command);
        if (command == 'ready') {
            this.movie = document.getElementById(this.target);
            this.connect();
        } else if (command == 'connect') {
            this.connected = true;
        }
        this.fire('data', command, args);
        this.fire(command, args);
    };
	*/
    WebRC.prototype.setData = function(command, args) {
        var ret;
        if (this.movie && this.connected && command && typeof command == 'string') {
            ret = this.movie.setData(command.toLowerCase(), args);
        }
        this.fire('set', command, args);
        return ret;
    };
	/***********************************************20140912*/
	WebRC.prototype.initType = function( ) {
		if(this.movie==null){
			this.movie = document.getElementById(this.target);
		}
		//{"liveType":0|1} //0-娱乐直播，1-游戏直播 
		var type = 0;
		var json = {};
		var href = window.location.href;
		if(href.indexOf("v.html")>0){
			type=1;
		}
		json.liveType = type;
		json.screenType = nowFlashType;
		lastFlashType = nowFlashType; 
		
		//表情
		var list = WEB_RC.smiles.loadJsonSmile();

		list.liveType=type;
		list.screenType=nowFlashType;

		var obj = JSON.stringify(list);
		this.movie.init(obj);
    };
	WebRC.prototype.initScreenType = function( stype) {
		//rclog("initScreenType",stype);//0 大分辨率， 1 小分辨率
		var arr = {};
		arr.type = stype;
		var obj = JSON.stringify(arr);
		this.movie.chgScreenType(obj);
	};
	WebRC.prototype.ready = function() {
		if(this.movie==null){
			this.movie = document.getElementById(this.target);
		}
		
		//登陆认证
		//this.login(account,pwd);
		this.loginByToken();
    };
	WebRC.prototype.loginByToken = function() {
		rclog("--loginByToken");
		if(this.connected){
			this.logout();
			WEB_RC.conf.guest = true;
		}
		var uid = 0;//7024663;//
		var token = "";
		var account = "";
		if(opencyou.cookies.read('_open_uuid')!=null){
			uid=opencyou.cookies.read('_open_uuid');
		}
		if(opencyou.cookies.read('_open_stoken')!=null){
			token = opencyou.cookies.read('_open_stoken');//"MDEwMcLt0jL3ChjGCLpZqNUpt7YI7y31ab5OOZiXvhd8EWE27zb7\/IxnNFm1oPaLqaJuV8KJAOKI7tKn";
		}
		if(opencyou.cookies.read('_open_saccount')!=null){
			 account = opencyou.cookies.read('_open_saccount');
		}
		rclog(uid,account,token);
		this.movie.loginByToken(uid, account, 2, 'link', token);
		
    };
	
	WebRC.prototype.logout = function() {
		this.movie.logout();
		this.connected=false;
    };
	WebRC.prototype.login = function(ac,pwd) {
		this.movie.login(ac, pwd);
    };
	WebRC.prototype.enterChannel = function(args) {
		this.movie.enterChannel(parseInt(args),1);
    };
	WebRC.prototype.sendMsg = function(command, effects, color, height, msg ,uid) {
		if(WEB_RC.conf.uid == uid){
			//rclog(" 不能发送私聊信息给自己~ ");
			WEB_RC.msg.addTips(' 不能发送私聊信息给自己~ ');
			return false;
		}
        var ret;
        if (this.movie && this.connected && command && typeof command == 'string') {
			rclog("-sendMsg",command, effects, color, height, msg,uid );
            //ret = this.movie.setData(command.toLowerCase(), args);
			ret = this.movie.setData(command, "SimSun", effects, color, height, msg ,uid);
        }
				
        this.fire('set', command,  effects, color, height, msg);
        return ret;
    };
	WebRC.prototype.setModifier = function(multip, add) {
		//console.log("--setModifier--",multip,add);
        this.movie.setData("online.count.modifier", multip, add);
        
    };
	WebRC.prototype.getAvailableToBuyGuardInfo = function() {
		rclog("--getAvailableToBuyGuardInfo--");
        this.movie.getAvailableToBuyGuardInfo();
        
    };
	WebRC.prototype.applyToBuyGuard = function(duration) {
		rclog("--applyToBuyGuard--");
        this.movie.applyToBuyGuard(duration);
        
    };
	WebRC.prototype.getGuardList = function(duration) {
		rclog("--getGuardList--");
        this.movie.getGuardList();
        
    };
	/*WebRC.prototype.sendMsg = function(command, args){//effects, color, height, msg) {
		
        var ret;
        if (this.movie && this.connected && command && typeof command == 'string') {
			rclog("-sendMsg",command,args);
            //ret = this.movie.setData(command.toLowerCase(), args);
			this.movie.setData(command, args);
        }
        this.fire('set', command, args);
        return ret;
    };*/
	/************************************************/
	
    WebRC.prototype.on = function(command, callback) {
        //If you need to cancel have subscribed events later, do not use anonymous functions
        if (typeof command == 'string' && command !== '' && typeof callback == 'function' && inArray(command, eventList) != -1) {
            command = command.toLowerCase();
            if (eventListener[command]) {
                eventListener[command].push(callback);
            } else {
                eventListener[command] = [callback];
            }
        }
    };
    WebRC.prototype.off = function(command, callback) {
        if (typeof command == 'string' && typeof callback == 'function' && eventListener[command]) {
            command = command.toLowerCase();
            var callbacks = eventListener[command];
            var arr = [];
            for (var i = 0, len = callbacks.length; i < len; i++) {
                if (callbacks[i] !== callback) {
                    arr.push(callbacks[i]);
                }
            }
            eventListener[command] = arr;
        }
    };
    WebRC.prototype.fire = function(command, args) { //webRC.fire(command, arg1, arg2..) -> callback(arg1, arg2.., command)
        //Fire user subscribed events
		
        if (typeof command == 'string') {
            command = command.toLowerCase();
            var callbacks = eventListener[command];
            if (callbacks) {
                var params = Array.prototype.slice.call(arguments);
                params.push(params.shift());
                for (var i = 0, len = callbacks.length; i < len; i++) {
                    callbacks[i].apply(this, params);
                }
            }
        }
    };
    
    return WebRC;
})();

window.WEB_RC = (function() {
    var loadSmile = function() {
		//rclog("--loadSmail--");
        var obj = {};
        $.get('pic/smiles/cfg.xml', function(xml) {
            $(xml).find('face').each(function() {
                var item = $(this);
                obj[item.text()] = 'pic/smiles/' + item.attr('file');
            });
        }, 'xml');
        $.get('pic/vipemotions/cfg.xml', function(xml) {
            $(xml).find('face').each(function() {
                var item = $(this);
                obj[item.text()] = 'pic/vipemotions/' + item.attr('file');
            });
        }, 'xml');
        window.setTimeout(function() {
            var arr = [];
            for (var key in obj) {
                arr.push('"' + key.replace('"', "\\\"") + '":"' + obj[key] + '"');
            }
            rclog('{' + arr.join(',') + '}');
        }, 2000);
    };
	
    var SMILES = {
        "/{:)": "pic/smiles/1.gif",
        "/{:D": "pic/smiles/2.gif",
        "/{;)": "pic/smiles/3.gif",
        "/{:O": "pic/smiles/4.gif",
        "/{:P": "pic/smiles/5.gif",
        "/{:@": "pic/smiles/6.gif",
        "/{:s": "pic/smiles/7.gif",
        "/{:$": "pic/smiles/8.gif",
        "/{:(": "pic/smiles/9.gif",
        "/{;(": "pic/smiles/10.gif",
        "/{:|": "pic/smiles/11.gif",
        "/{|-)": "pic/smiles/12.gif",
        "/{rofl": "pic/smiles/13.gif",
        "/{:*": "pic/smiles/14.gif",
        "/{inlove": "pic/smiles/15.gif",
        "/{sweat": "pic/smiles/16.gif",
        "/{drooling": "pic/smiles/17.gif",
        "/{puke": "pic/smiles/18.gif",
        "/{?": "pic/smiles/19.gif",
        "/{:-#": "pic/smiles/20.gif",
        "/{:x": "pic/smiles/21.gif",
        "/{:!": "pic/smiles/22.gif",
        "/{>:)": "pic/smiles/23.gif",
        "/{o.o": "pic/smiles/24.gif",
        "/{:><:": "pic/smiles/25.gif",
        "/{O.o": "pic/smiles/26.gif",
        "/{^.^": "pic/smiles/27.gif",
        "/{@.@": "pic/smiles/29.gif",
        "/{nose": "pic/smiles/30.gif",
        "/{>D": "pic/smiles/31.gif",
        "/{clap": "pic/smiles/32.gif",
        "/{blush": "pic/smiles/33.gif",
        "/{>.<": "pic/smiles/34.gif",
        "/{kiss": "pic/smiles/35.gif",
        "/{;_;": "pic/smiles/36.gif",
        "/{giggle": "pic/smiles/37.gif",
        "/{rose": "pic/smiles/38.gif",
        "/{-.-\"": "pic/smiles/39.gif",
        "/{wave": "pic/smiles/40.gif",
        "/{eh": "pic/smiles/41.gif",
        "/{dance": "pic/smiles/42.gif",
        "/{joy": "pic/smiles/43.gif",
        "/{D<": "pic/smiles/44.gif",
        "/{cool": "pic/smiles/45.gif",
        "/{sympathy": "pic/smiles/46.gif",
        "/{<3": "pic/smiles/47.gif",
        "/{thumbsdown": "pic/smiles/48.gif",
        "/{thumbsup": "pic/smiles/49.gif",
        "/{shake": "pic/smiles/50.gif",
        "/{shit": "pic/smiles/51.gif",
        "/{heading": "pic/smiles/52.gif",
        "/{type": "pic/smiles/53.gif",
        "/{scriptures": "pic/smiles/54.gif",
        "/{flowers": "pic/smiles/55.gif",
        "/{beverage": "pic/smiles/56.gif",
        "/{watermelon": "pic/smiles/57.gif",
        "/{gift": "pic/smiles/58.gif",
        "/{music": "pic/smiles/59.gif",
        "/{clock": "pic/smiles/60.gif",
        "/{knif": "pic/smiles/61.gif",
		"/{vv_1": "pic/vipemotions/1.gif",
		"/{vv_2": "pic/vipemotions/2.gif",
		"/{vv_3": "pic/vipemotions/3.gif",
		"/{vv_4": "pic/vipemotions/4.gif",
		/*
        "/{v_smile": "pic/vipemotions/smile.png",
        "/{v_blush": "pic/vipemotions/blush.png",
        "/{v_relaxed": "pic/vipemotions/relaxed.png",
        "/{v_wink": "pic/vipemotions/wink.png",
        "/{v_heart_eyes": "pic/vipemotions/heart_eyes.png",
        "/{v_kissing_heart": "pic/vipemotions/kissing_heart.png",
        "/{v_stuck_out_tongue_winking_eye": "pic/vipemotions/stuck_out_tongue_winking_eye.png",
        "/{v_stuck_out_tongue_closed_eyes": "pic/vipemotions/stuck_out_tongue_closed_eyes.png",
        "/{v_grin": "pic/vipemotions/grin.png",
        "/{v_pensive": "pic/vipemotions/pensive.png",
        "/{v_relieved": "pic/vipemotions/relieved.png",
        "/{v_disappointed": "pic/vipemotions/disappointed.png",
        "/{v_sob": "pic/vipemotions/sob.png",
        "/{v_sleepy": "pic/vipemotions/sleepy.png",
        "/{v_cold_sweat": "pic/vipemotions/cold_sweat.png",
        "/{v_weary": "pic/vipemotions/weary.png",
        "/{v_fearful": "pic/vipemotions/fearful.png",
        "/{v_scream": "pic/vipemotions/scream.png",
        "/{v_angry": "pic/vipemotions/angry.png",
        "/{v_rage": "pic/vipemotions/rage.png",
        "/{v_mask": "pic/vipemotions/mask.png",
        "/{v_sunglasses": "pic/vipemotions/sunglasses.png",
        "/{v_sleeping": "pic/vipemotions/sleeping.png",
        "/{v_smirk": "pic/vipemotions/smirk.png",
        "/{v_anguished": "pic/vipemotions/anguished.png",
        "/{v_imp": "pic/vipemotions/imp.png",
        "/{v_boy": "pic/vipemotions/boy.png",
        "/{v_girl": "pic/vipemotions/girl.png",
        "/{v_man": "pic/vipemotions/man.png",
        "/{v_woman": "pic/vipemotions/woman.png",
        "/{v_older_man": "pic/vipemotions/older_man.png",
        "/{v_older_woman": "pic/vipemotions/older_woman.png",
        "/{v_baby": "pic/vipemotions/baby.png",
        "/{v_angel": "pic/vipemotions/angel.png",
        "/{v_anger": "pic/vipemotions/anger.png",
        "/{v_dash": "pic/vipemotions/dash.png",
        "/{v_ear": "pic/vipemotions/ear.png",
        "/{v_eyes": "pic/vipemotions/eyes.png",
        "/{v_tongue": "pic/vipemotions/tongue.png",
        "/{v_lips": "pic/vipemotions/lips.png",
        "/{v_nose": "pic/vipemotions/nose.png",
        "/{v_muscle": "pic/vipemotions/muscle.png",
        "/{v_facepunch": "pic/vipemotions/facepunch.png",
        "/{v_hand": "pic/vipemotions/hand.png",
        "/{v_clap": "pic/vipemotions/clap.png",
        "/{v_-1": "pic/vipemotions/-1.png",
        "/{v_+1": "pic/vipemotions/+1.png",
        "/{v_ok_hand": "pic/vipemotions/ok_hand.png",
        "/{v_v": "pic/vipemotions/v.png",
        "/{v_pray": "pic/vipemotions/pray.png",
        "/{v_bride_with_veil": "pic/vipemotions/bride_with_veil.png",
        "/{v_family": "pic/vipemotions/family.png",
        "/{v_couple": "pic/vipemotions/couple.png",
        "/{v_massage": "pic/vipemotions/massage.png",
        "/{v_raising_hand": "pic/vipemotions/raising_hand.png",
        "/{v_heart": "pic/vipemotions/heart.png",
        "/{v_cupid": "pic/vipemotions/cupid.png",
        "/{v_gift_heart": "pic/vipemotions/gift_heart.png",
        "/{v_heartbeat": "pic/vipemotions/heartbeat.png",
        "/{v_broken_heart": "pic/vipemotions/broken_heart.png",
        
        "/{v_be_applaud": "pic/BigEmoji/applaud.gif",
        "/{v_be_bigkiss": "pic/BigEmoji/bigkiss.gif",
        "/{v_be_claphands": "pic/BigEmoji/claphands.gif",
        "/{v_be_sendflowers": "pic/BigEmoji/sendflowers.gif",
		*/
    };
	
    var toPaddedString = function(num, len) {
        num = num.toString();
        if (num.length < len) {
            var str = '';
            for (var i = 0; i < len - num.length; i++) {
                str += '0';
            }
            num = str + num;
        }
        return num;
    };
    var scrollToBottm = function(container) {
        var elem = container.get(0);
        if (elem) {
            elem.scrollTop = elem.scrollHeight ;
        }
		
    };
    
    var reHttpUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var reWwwUrl = /(^|[^\/f])(www\.[\S]+(\b|$))/ig;
    var hideUrl = function(url) {
        var arr = [];
        if (typeof url == 'string') {
            for (var i = 0, len = url.length; i < len; i++) {
                arr.push('*');
            }
        }
        return arr.join('');
    };
    var url2link = function(text, hide) {
		return text;
		/*
        return text.replace(reHttpUrl, hide ? hideUrl : '<a class="chatMsgLink" target="_blank" href="$1">$1</a>').replace(reWwwUrl, hide ? hideUrl : '$1<a class="chatMsgLink" target="_blank" href="http://$2">$2</a>');*/
    };
    var urllink = function(text, hide) {
        return text.replace(reHttpUrl, hide ? hideUrl : '<a class="chatMsgLink" target="_blank" href="$1">$1</a>').replace(reWwwUrl, hide ? hideUrl : '$1<a class="chatMsgLink" target="_blank" href="http://$2">$2</a>');
    };
    var parseSmile = function(name) {
		
        //pic/smiles/cfg.xml
        //pic/vipemotions/cfg.xml
        name = name.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
        return SMILES[name] || 'pic/smiles/1.gif';
    };
	 var parseVipSmile = function(name) {
		 rclog(name);
		//<img style="max-width:64px; vertical-align:middle; margin:0 1px" src="http://www.showoo.cc/PubImgSour/vip/1414305650631_200_100.jpg" name="/{1414305650631_200_100">
        name = name.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');
		
		var src= opencyou.imageurl+"/PubImgSour/vip/"+name.substring(3)+""; 
		return src;
        //return SMILES[name] || 'pic/smiles/1.gif';
    };
	
    var smile2html = function(text) {
		//rclog("111>>>>>>>>>>>>>>",text);
        if (text && typeof text == 'string') {
            text = text.replace(/\u0009/g, '&#91;').replace(/\u0010/g, '&#93;');
            text = text.replace(/\[cp/ig, '[').replace(/\[\/cp/ig, '[\/'); //Parse VIP smiles
            return text.replace(/\[smile=([^\]]+)\]\[\/smile\]/ig, function() {
                if (arguments.length >= 2) {
                    var src = "";
					
					if(arguments[1].indexOf("/v{")==0){
						src = parseVipSmile(arguments[1]);
					}else{
						src = parseSmile(arguments[1]);
					}
					
                    return src ? '<img style="max-width:64px; vertical-align:middle; margin:0 1px"  src="' + src + '" name="' + arguments[1] + '" />' : '';
                }
            });
        }
		
        return text;
    };
    var html2smile = function(html) {
		//rclog("<<<<<<<<<<<<",name);
        if (html && typeof html == 'string') {
            html = html.replace(/&nbsp;/ig, ' '); //在編輯器內連續輸入兩個空格，第二個空格會被轉成&nbsp;
            html = html.replace(/<\/?(p|div|font)>/ig, '').replace(/<br\s*\/?>/ig, '');
            html = html.replace(/\[/g, '\u0009').replace(/\]/g, '\u0010');
            html = html.replace(/<img[^>]*>/ig, function() {
                var div = document.createElement('div');
				arguments[0] = arguments[0].replace('lt;','<').replace('gt;','>');
                div.innerHTML = arguments[0];
                var name = div.childNodes[0].name;
                return name ? '[smile=' + name.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>') + '][/smile]' : ''; //在編輯器插入圖片name屬性包含的<>會被轉義
            });
            html = html.replace(/<span class="Apple-tab-span" style="white-space:pre">(\t+)<\/span>/i, function() {
                var spaces = [];
                var tabLen = arguments[1].length;
                for (var i = 0; i < tabLen; i++) {
                    spaces.push('    ');
                }
                return spaces.join('');
            });
            html = html.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>').replace(/&amp;/ig, '&');
            return html;
        }
        return html;
    };
    
    var htmlChars = function(html) {
        return (html + '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    var titleChars = function(html) {
        return (html + '').replace(/'/g, '&acute;').replace(/"/g, '&quot;');
    };
    
    var api = {};
    
    api.tools = {
        htmlChars: htmlChars,
        titleChars: titleChars
    };
    
    api.webrc = null;
    api.timeLimit = {
        login: 0,
        lastSpeak: 0,
        lastText: ''
    };
    
    api.conf = {
        uid: 0,
        nick: '',
        role: -1,
        guest: true,
        wait: 0,
        interval: 0,
        speakLimit: 0,
        userLimit: 0
    };
    api.updateConf = function(conf) {
        if ($.isPlainObject(conf)) {
            for (var key in conf) {
                api.conf[key] = conf[key];
            }
        }
		//rclog("ok",api.conf.speakLimit);
    };
    api.smiles = {
		loadJsonSmile : function() {
			//rclog("--loadJsonSmile--");
			var arr = {
				host:"http://www.showoo.cc/live/",
				viphost:"http://www.showoo.cc/PubImgSour/vip/",
				smileList:[]
			};
			
			for (var key in SMILES) {
				 //console.log(key.replace('"', "\\\""),SMILES[key]);
				 var obj={};
				 obj.name = key;
				 obj.value = SMILES[key];
				 //arr.push('"' + key.replace('"', "\\\"") + '":"' + SMILES[key] + '"');
				 arr.smileList.push(obj);
			}
			return arr;
		}
	};
    api.msg = {
        container: $('#chatMsg'),
		mycontainer: $('#chat_private'),
        maxMsgSize: 100,
        getItemHtml: function(obj) {
            //http://blog.163.com/cjd_cd/blog/static/461155652012630665455/ 有無符號整數轉換
            //http://www.w3school.com.cn/js/pro_js_operators_bitwise.asp
            obj.height = Math.min(Math.abs(obj.height << 0), 24);
            var html = '';
            html += '<div class="chatMsgItem">';
            html += '<div class="chatMsgTitle">';
            if (obj.vip) {
                html += '<span class="chatMsgIcon"><img src="pic/vip/' + obj.vip + '.png" /></span>';
            }
            var meCls = obj.from == api.conf.uid ? ' chatMsgNameMe' : '';
            var date = new Date();
            var time = toPaddedString(date.getHours(), 2) + ':' + toPaddedString(date.getMinutes(), 2) ;//+ ':' + toPaddedString(date.getSeconds(), 2);
            html += '<span class="chatMsgName' + meCls + '">' + htmlChars(obj.nick) + '</span><span class="chatMsgTime">' + time + '</span></div>';
            html += '<div class="chatMsgContent" style="color:#' + obj.color.toString(16) + ';font-size:' + obj.height + 'px">' + url2link(smile2html(htmlChars(obj.text)), api.conf.speakLimit == 1) + '</div>';
            html += '</div>';
            return html;
        },
		/*
        initItem: function(arr) {
            var html = '';
            for (var i = 0, len = arr.length; i < len; i++) {
                html += this.getItemHtml(arr[i]);
            }
            this.container.empty().append(html);
            scrollToBottm(this.container);
        },*/
		/**************************************************/
		getArrayHtml: function(data) {
            //http://blog.163.com/cjd_cd/blog/static/461155652012630665455/ 有無符號整數轉換
            //http://www.w3school.com.cn/js/pro_js_operators_bitwise.asp
			//webRC.fire( 'channel.chatText',{"cmd":"channel.chatText", "effects":1, "color":333333, "height":12, "msg":'大家好，我是小辉', "sd":12, "uid":9, "nick":'xiaomei', "guardLevel":1, "vipLevel":1, "toUid":0, "toNick":''} );
			var obj={};
			
			obj.height = data.height;
			//obj.size = data.size;
			obj.from = data.uid;
			obj.nick = data.nick;//+"("+data.uid+")";
			obj.text = "";
			obj.color =  parseInt(data.color).toString(16);
			obj.date = data.sd;
			obj.vip = data.vipLevel;
			obj.guard = data.guardLevel;
            obj.tuid = data.toUid;
			obj.tnick = data.toNick;
			
			var tag = utf8to16(base64encode("◇"));
			var index = data.msg.indexOf(tag);
			if(index>=0){
				
				var user_data = data.msg.substring(0,index);
				//user_data = utf16to8(base64decode(user_data));
				
				var udatas = user_data.split(";");
				
				obj.b_uid= udatas[0];
				obj.b_nick = udatas[1];
				obj.text = data.msg.substring(index+tag.length);
			}else{
				obj.text = data.msg;
			}
			
			if(obj.color.length<6){
				obj.color = "0"+obj.color;
			}
            var html = '';
            html += '<div class="chatMsgItem">';
            html += '<div class="chatMsgTitle">';
            if (obj.guard) {
                html += '<span class="chatMsgIcon"><img src="../imgs/icon_guard2.png" /></span>';
            }
			var bolds="";
			if(obj.guard){
				bolds = "bold";
			}
            var meCls = obj.from == api.conf.uid ? ' chatMsgNameMe' : '';
            var date = new Date();
            var time = toPaddedString(date.getHours(), 2) + ':' + toPaddedString(date.getMinutes(), 2);// + ':' + toPaddedString(date.getSeconds(), 2);
			
			//私聊
			if(obj.tuid!='undefined' && obj.tuid!='' && obj.tuid>0 ){
				html += '<var class="chatMsgName say_pri" u="'+obj.from+'"><span class=" colorjs say_pri">'+ WEB_RC.tools.htmlChars(obj.nick) + '</span></var><span>对你说：</span>';
			}else{
				if(obj.b_uid!='undefined' && obj.b_uid!='' && obj.b_uid>0){
					html += '<span class="chatMsgTime">' + time + '</span><var class="chatMsgName say_pri' + meCls + '" u="'+obj.from+'">' + htmlChars(obj.nick) 
						+ '</var><span> 对 </span><var class="chatMsgName say_pri" u="'+obj.b_uid+'">' + htmlChars(obj.b_nick) + '</var><span> 说：</span>';
				}else{
					html += '<span class="chatMsgTime">' + time + '</span><var class="chatMsgName say_pri' + meCls + '" u="'+obj.from+'">' + htmlChars(obj.nick) + '</var> : ';
				}
			}
			
            html += '<span class="chatMsgContent '+bolds+'" style="color:#' + obj.color 
				+ ';font-size:' + obj.height + 'px">' + url2link(smile2html(htmlChars(obj.text)), api.conf.speakLimit == 1) + '</span>';
            html += '</div></div>';
			/*
			<div class="chatMsgItem"><div class="chatMsgTitle"><span class="chatMsgTime">19:01</span><var class="chatMsgName say_pri" u="9">❥゛岁月静好❥゛ : </var>45645 adfadshfkjashd asdhfkjasdhfasdfsadf asdfqaewr5q1wetrf kdfhnger45 632456345 a asdfqwerqw etqr we </div></div>
			*/
            return html;
        },
		
		addArrayItem: function(obj) {
			//rclog("addArrayItem",obj);
			if(obj.toUid!=0){
				this.mycontainer.append(this.getArrayHtml(obj));
				scrollToBottm(this.mycontainer);
			}else{
				//this.container.append(this.getArrayHtml(obj));
				$("#chatMsgContent").append(this.getArrayHtml(obj));
				scrollToBottm(this.container);
			}
			
			//图片滚屏问题
			var img= this.container.find(".chatMsgItem:last-child img");
            if(img){
				var newImg = new Image();
				newImg.onload = function(){
					var width = newImg.width;
					var height=newImg.height;
					if(width>64){
						var pos = width/64;
						var hos =  Math.round(height/pos);
						//console.log("====",width,pos,height,height/pos,hos);
						scrollToBottm(WEB_RC.msg.container);
					}
					
				}
				newImg.src = img.attr("src");	
			}
			
			scrollReload();
			
			//删除部分聊天记录
			if( this.container.find(".chatMsgItem").length>800){
				
				var len = 100;
				$(".chatMsgItem").each(function(){
					if(--len>0){$(this).remove();}
				});
			}
			
        },
		addPMItem: function(obj) {
			var html = '';
			var col = obj.color.substring(2);
            html += '<div class="chatMsgItem">';
            html += '<div class="chatMsgTitle">';
			html += '对<var class="chatMsgName say_pri" u="'+obj.uid+'"> <span class=" colorjs say_pri">'+ WEB_RC.tools.htmlChars(obj.name) + '</span></var><span>说：</span>';
			html += '<span class="chatMsgContent" style="color:#' + col + ';font-size:' + obj.height + 'px">' + url2link(smile2html(htmlChars(obj.msg)), api.conf.speakLimit == 1) + '</span>';
            html += '</div></div>';
			
            this.mycontainer.append(html);
            scrollToBottm(this.mycontainer);
			scrollReload();
        },
		/**************************************************/
        addItem: function(obj) {
			$("#chatMsgContent").append(this.getItemHtml(obj));
            //this.container.append(this.getItemHtml(obj));
            scrollToBottm(this.container);
        },
        addBroadcastItem: function(obj) {
            //{"type": 1, "desc": "禁言", "text":"您已被管理員禁止發送文字訊息"}
            if (obj.text) {
                this.addTips(obj.text);
            } else if (typeof obj.type != 'undefined') {
                if (obj.type == 1) {
                    this.addTips('您已被管理員禁止發送文字訊息');
                }
            }
        },
        /*removeTopItem: function() {
            if (this.container.children().size() > this.maxMsgSize) {
                this.container.first().remove();
                scrollToBottm(this.container);
            }
        },*/
        addCustomItem: function(html, unwrap) {
            if (html && typeof html == 'string') {
                if (unwrap === true) {
					$("#chatMsgContent").append(html);
                   // this.container.append(html);
                } else {
                    //this.container.append('<div class="chatMsgItem">' + html + '</div>');
					$("#chatMsgContent").append('<div class="chatMsgItem">' + html + '</div>');
                }
                scrollToBottm(this.container);
            }
			scrollReload();
        },
        addTips: function(html) {
            if (html) {
                this.addCustomItem('<div class="chatMsgTips">' + html + '</div>');
            }
        }
    };
    api.car = {
		CARLIST:{},
		carlistContent:$("#carUserList"),
		container: $('#seatList'),
        elemCarCount: $('.chatCarCount'),
		updateCarCount: function() {
			this.elemCarCount.text(this.container.children().size());
			
        },
		initCarList : function(){
			var channel = opencyou.utils.getParamFromUrl("s");
			
			$.ajax({
					type : "get",
					url : opencyou.url + "/business/car/freecarlist",
					data : {type:"1,2,3,4,5"},
					dataType : "json",
					success : function(data) {
						if (data != null && data.success != null && data.success == true) {
							api.car.CARLIST = data.list;
						}else{
							api.car.CARLIST = {};
						}
					}
				});
				
			$.ajax({
					type : "get",
					url : opencyou.url + "/business/car/channelcar",
					data : {sid:channel},
					dataType : "json",
					success : function(data) {
						if (data != null && data.success != null && data.success == true) {
							var usercar = data.data;
							//api.car.USERCARLIST = data.data;
							var div='';
							for(var i in usercar){
								div+='<li id="cul_'+usercar[i].uid+'" cid="'+usercar[i].carid+'" cnum="'+usercar[i].carnum+'" ></li>';
							}
							$("#carUserList").html(div);
							
						}else{
							$("#carUserList").html("");
						}
					}
				});	
				
		},
		getItemHtml: function(obj) {
			//var num = obj.number.substring(3);
			//console.log("getItemHtml",obj);
			//console.log("getItemHtml----"+obj.id,obj.icon,obj.image,obj.name,obj.price,obj.uid,obj.nick,obj.number,obj.level);
			
			var div = '<li  id="chatCarItem_'+obj.uid+'" l="'+obj.level+'" r="'+obj.role+'" class="carUserItem "><a href="javascript:;">	'
						+'<span class="clogo"><img src="'+obj.icon+'" class=" radius15_noborder"></span>	'
						+'<span class="title">'+obj.name+'</span>'
						+'<span class="pic"><img src="'+obj.image+'" width="130" style="max-height: 85px;"></span>'
						+'<span class="number">'+obj.number+'</span><span class="name">'+obj.nick+'</span></a> </li>';
			return  div;
        },
		addItemOrder: function(obj) {
			
			this.removeItem(obj);
			var insert = false;
			
			var car = null;
			
			var cars = WEB_RC.car.CARLIST;
			for(var i in cars){
				//rclog("----"+cars[i].id,cars[i].icon,cars[i].image,cars[i].name,cars[i].price , obj.cid, obj.cname);
				if(cars[i].id == obj.cid || obj.cname == cars[i].name){
					car = cars[i]; break;
				}
			}
			
			if(car){
				obj.id = car.id;
				obj.icon = car.icon;
				obj.image = car.image;
				obj.name = car.name;
				obj.price = car.price;
				
				obj.role = car.price;
				if(obj.number==null || obj.number=='null'){
					obj.level = "10000000";
					obj.number = "tmp license";
				}else{
					obj.level = obj.number.substring(3);
					var p = obj.number.substring(0,1);
					if(p=='G'){
						obj.role  = obj.price + 2 ;
					}else if(p=='V'){
						obj.role  = obj.price + 1 ;
					}
				}
				$("#seatList li").each(function(){
					
					var id = $(this).attr("id");
					var role = $(this).attr("r");
					var level = $(this).attr("l");
					
					if(obj.role >= role){
						//同价位
						if(obj.role == role){
							if(obj.level < level){
								insert=true;
								$("#"+id).before(api.car.getItemHtml(obj));
								return false;
							}
							
						//没有同角色时
						}else if(obj.role > role){
							insert=true;
							$("#"+id).before(api.car.getItemHtml(obj));
							return false;
						}
					}
					
				});
			}else{
				
				this.initCarList();
			}
			if(!insert){
            	this.container.append(api.car.getItemHtml(obj));
			}
			this.updateCarCount();
			
        },
		removeItem: function(obj) {
            $('#chatCarItem_' + obj.uid).remove();
            //this.updateCarCount();
			this.updateCarCount();
        }
		
	}
    api.user = {
        container: $('#chatUser'),
        elemUserCount: $('.chatUserCount'),
		
        updateUserCount: function(cnt) {
            //this.elemUserCount.text("Viewers:"+ (this.container.children().size()+parseInt(cnt)));
			
			this.elemUserCount.text((this.container.children().size()+parseInt(cnt)));
			//this.elemUserCount.text(parseInt(cnt));
        },
        /*getItemHtml: function(obj) {
            var title = obj.sign ? ' title="' + titleChars(obj.sign) + '"' : '';
            return '<li id="chatUserItem_' + obj.uid + '" class="chatUserItem"' + title + '><a href="javascript:;"><img class="chatUserIcon" src="pic/vip/' + (obj.vip || 0) + '.png" /><span class="chatUserName">' + htmlChars(obj.nick) + '</span></a></li>';
        },*/
		getItemHtml: function(obj) {
            //var title = obj.sign ? ' title="' + titleChars(obj.sign) + '"' : '';
            var div = '<li id="chatUserItem_' + obj.fake + "_" + obj.uid + '" r="' +obj.role+ '" l="'+ obj.level +'" rich="'+ obj.rich +'" n="'+obj.nick
				+'" class="chatUserItem say_pri">';
				if(obj.level==0 ){
				
					div+='<a href="javascript:;" style=" cursor: default; ">';
					div+='<img class="chatUserIcon icon_head " src="../imgs/icon1.jpg"';
					div+=' onerror="this.src=\'../imgs/icon1.jpg\'" width="40" height="40" border="0" /> '
						//+'<img class="chatUserLevel say_pri" src="pic/level/'+obj.level+'.png" width="15" height="15"/>'
						+'<span class="chatUserName say_pri">' + htmlChars(obj.nick) 
						+'<div class=" chatUserName_right say_pri" >';
				}else{
					div+='<a href="javascript:;">';
					div+='<img class="chatUserIcon icon_head say_pri" src="'+opencyou.url+'/PubImgSour/'+obj.uid+'.png" ';
					div+=' onerror="this.src=\'../imgs/icon.png\'" width="40" height="40" border="0" /> '
						//+'<img class="chatUserLevel say_pri" src="pic/level/'+obj.level+'.png" width="15" height="15"/>'
						+'<span class="chatUserName say_pri"><span style="" class="chatUserName_name say_pri" > '
						+'<img src="pic/lvl/'+obj.level+'.png" height="16" class="img_level say_pri"/><span class="say_pri">'
						+ htmlChars(obj.nick) +'</span></span>'
						//+ '' //+ htmlChars(obj.nick) 
						+'<div class=" chatUserName_right say_pri" >';
				}
				
				if(obj.guardLevel>0){
					div+='<img src="../imgs/icon_guard2.png" width="14" height="33" class="img_guard say_pri" style=" margin-right:7px;">';
				}
				//console.log("===========",obj.rich);
				if(obj.rich>0){
					div+='<img src="pic/rich/'+obj.rich+'.png" class="img_rich say_pri"><span class="icon_star"></span>';
				}
				if(obj.vipLevel>0){
					div+='<img src="../imgs/icon_vip_15.png" width="15" height="15" class="img_vip1 say_pri" >';
				}
						
				div+= '</div></span></a></li>';
					
			return  div;
        },
		initItemArray: function(obj) {
			//webRC.fire('memberList.update',{cmd:'memberList.update',totalCnt:123,remainCnt:0,
			//adds:[       {uid:15, nick:'hehe12', role:1, jiFen:1,fake:0,anonymous:0,vipLevel:0,guardLevel:1}
			//,{uid:16, nick:'张碧晨6', role:2,  jiFen:1,fake:0,anonymous:0,vipLevel:1,guardLevel:0}]}); 
			
			var adds = obj.adds;
			var removes = obj.removes;
			if(removes){
				for (var i = 0, len = removes.length; i < len; i++) {
					//rclog(removes[i]);
					this.removeItem(removes[i]);
					api.car.removeItem(removes[i]);
				}
			}
			//rclog("initItemArray==========",adds.length);
			if(adds){
				var users = "0";
				for (var i = 0, len = adds.length; i < len; i++) {
					this.addItemOrder(adds[i]);
					
					if(adds[i].anonymous == 0){
						users += ","+adds[i].uid;
					}
				}
				
				this.getChannelUserlist(users);
			}
			scrollReload();
			
			var cnt = 0;
            this.updateUserCount(cnt);
			
        },
		getChannelUserlist:function(users){
			rclog("getChannelUserlist",users);
			var channel = opencyou.utils.getParamFromUrl("s");
			$.ajax({
					type : "get",
					url : opencyou.url + "/business/channel/inituserlist",
					data : {
						sid:channel,
						users:users
					},
					dataType : "json",
					success : function(data) {
						
						if (data != null && data.success != null && data.success == true) {
							var list = data.list;
							api.user.updateUsersLvL(list);
						}
					}
				});		
		},
        initItem: function(arr) {
            var html = '';
            for (var i = 0, len = arr.length; i < len; i++) {
                html += this.getItemHtml(arr[i]);
            }
            this.container.empty().append(html);
            //this.updateUserCount();
        },
        addItem: function(obj) {
            this.removeItem(obj.fake,obj.uid);
            this.container.prepend(this.getItemHtml(obj));
            //this.updateUserCount();
			
        },
		getLevel:function(jifen){
			//获取用户等级
			var rank = [-1,0,1,4,13,30,57,97,152,224,317,431,571,737,933,1161,1424,1723,2061,2441,2864,3334,3853,4422,5046,5725,6463,7261,8122,9049,10044,11109,12247,13460,14750,16121,17573,19111,20735,22449,24255,26156,28153,30249,32447,34748,37156,39673,42301,45042,47899,50875,53971,57190,60535,64008,67611,71347,75218,79226,83375,87665];
			var max_rank = 0;
			var id= 0;
			
			for( var i in rank){
				var lev = rank[i];
				if(jifen == lev){
					max_rank=id;
					break;
				}else if(jifen<lev){
					max_rank=id-1;
					break;
				}
				max_rank=id;
				id++;
			}
			
			return max_rank;
    
		},
		addItemOrder: function(obj) {
			
			this.removeItem(obj);
			var insert = false;
			
			//不分等级
			//obj.level = 1;//this.getLevel(obj.jiFen);
			if(obj.jiFen>=0){
				obj.level = this.getLevel(obj.jiFen);
			}
			
			if(obj.level>0){
			}else{
				obj.level=0;
			}
			if( obj.rich>0){
			}else{
				 obj.rich=0;
			}
			
			//虚拟游客
			if(obj.role==0 && obj.fake==1){
				//obj.nick="Viewer";
				obj.level = 0;
			
			//真实游客
			}else if(obj.role==0 && obj.anonymous==1){ 
				obj.level = 0;
				
			//非游客，排序
			}else{
				//主播255》守护+VIP》守护》VIP》登录用户》guest
				if(obj.role!=255 ){
					obj.role = 0; //超级管理员位置
				}
				if( obj.role!=255 && obj.guardLevel>0 ){
					obj.role = 88;
				}
				if( obj.role!=255 && obj.vipLevel>0){
					obj.role = obj.role + 77;
				}
				
				$("#chatUser li").each(function(){
					var id = $(this).attr("id");
					var role = $(this).attr("r");
					var level = $(this).attr("l");
					
					if(obj.role >= role){
						//同角色
						if(obj.role == role){
							if(obj.level > level){
								insert=true;
								$("#"+id).before(api.user.getItemHtml(obj));
								return false;
							}
							
						//没有同角色时
						}else if(obj.role > role){
							insert=true;
							$("#"+id).before(api.user.getItemHtml(obj));
							return false;
						}
					}
					
				});
			}
			if(!insert){
            	this.container.append(this.getItemHtml(obj));
			}
			
			
			//加载车信息
			//obj={uid:16, nick:'张碧晨6', role:2,  jiFen:1,fake:0,anonymous:0,vipLevel:1,guardLevel:0}
			var user=null;
			var length = $("#carUserList").find('#cul_' + obj.uid).length;
			
			if(length>0){
				var cul = $('#cul_' + obj.uid);
				
				var obj1 = {};
				obj1.uid = obj.uid;
				obj1.nick = obj.nick;
				obj1.cid = cul.attr("cid");
				obj1.number = cul.attr("cnum");
				api.car.addItemOrder(obj1);
			}
			
        },
        removeItem: function(obj) {
            $('#chatUserItem_' + obj.fake + "_" + obj.uid).remove();
            //this.updateUserCount();
        },
        updateItem: function(obj) {
            var elemOld = $('#chatUserItem_' + obj.fake + "_" + obj.uid);
            elemOld.after(this.getItemHtml(obj));
            elemOld.remove();
			
        }, 
		updateVipUsers: function(obj) {
			//console.log("updateVipUsers---------------",obj);
			var list = obj.list;
			for(var i in list){
				
				var elemOld = $('#chatUserItem_0_'+ list[i].uid);
				var elem = document.getElementById('chatUserItem_0_'+ list[i].uid);
				
				if(elemOld){
					list[i].anonymous=0;
					list[i].fake=0;
					list[i].jiFen=1;
					list[i].level=elemOld.attr("l");
					list[i].nick=elemOld.attr("n");
					list[i].rich=elemOld.attr("rich");
					list[i].vipLevel=1;
					if(elemOld.attr("r")=='255'){
						list[i].role=255;
					}
					if(elemOld.find(".img_guard").length>0){
						list[i].guardLevel=1;
					}
					
					this.removeItem(list[i]);
					this.addItemOrder(list[i]);
					
				}
			}
			scrollReload();
		}, 
		updateGuardUsers: function(obj) {
			rclog("updateGuardUsers---------------",obj);
			var list = obj.list;
			for(var i in list){
				
				var elemOld = $('#chatUserItem_0_' + list[i].uid);
				if(elemOld.length > 0){
					list[i].anonymous=0;
					list[i].fake=0;
					list[i].jiFen=1;
					list[i].level=elemOld.attr("l");
					list[i].nick=elemOld.attr("n");
					list[i].rich=elemOld.attr("rich");
					list[i].guardLevel=1;
					
					if(elemOld.attr("r")=='255'){
						list[i].role=255;
					}
					
					if(elemOld.find(".img_vip1").length>0){
						list[i].vipLevel=1;
					}
					
					this.addItemOrder(list[i]);
					
				}
			}
			scrollReload();
		},
		updateUsersLvL: function(obj) {
			rclog("updateUsersLvL---------------",obj);
			
			var list = obj;
			for(var i in list){
				////uid:9,explvl:1,richlvl:2
				console.log("-------------2---------",list[i].uid,list[i].richlvl,list[i].explvl);
				var elemOld = $('#chatUserItem_0_' + list[i].uid);
				
				if(elemOld.length > 0){
					
					list[i].anonymous=0;
					list[i].fake=0;
					list[i].jiFen=1;
					list[i].role=0;
					
					//list[i].level=list[i].explvl;
					list[i].level=elemOld.attr("l");
					list[i].rich=list[i].richlvl;
					list[i].nick=elemOld.attr("n");
					
					if(elemOld.attr("r")=='255'){
						list[i].role=255;
					}
					if(elemOld.find(".img_guard").length>0){
						list[i].guardLevel=1;
					}
					
					if(elemOld.find(".img_vip1").length>0){
						list[i].vipLevel=1;
					}
					
					this.addItemOrder(list[i]);
					
				}
			}
			scrollReload();
		},
		updateUsersLvL_temp: function(obj) {
			rclog("updateUsersLvL_temp",obj);
			//uid:9,explvl:1,richlvl:2
			var elemOld = $('#chatUserItem_0_' + obj.uid);
			if(elemOld){
					var div1 = elemOld.find(".chatUserName_right");
					if(div1.find(".img_vip1").length<=0){
						div1.append('<img src="../imgs/icon_vip_15.png" width="15" height="15" class="img_vip1 say_pri" >');
					}
					
			}
			
			
		}, 
		updateGuardUsers_temp: function(obj) {
			
			rclog("updateGuardUsers",obj);
			var list = obj.list;
			for(var i in list){
				var elemOld = $('#chatUserItem_0_' + list[i].uid);
				if(elemOld){
					var div1 = elemOld.find(".chatUserName_right");
					if(div1.find(".img_guard").length<=0){
						
						if(div1.find(".img_vip").length>0){
							div1.find("img").before('<img src="../imgs/icon_guard2.png" width="14" height="33" class="img_guard say_pri" style="">');
						}else{
							div1.append('<img src="../imgs/icon_guard2.png" width="14" height="33" class="img_guard say_pri" style=" margin-right:7px;">');
						}
					}
					
				}
			}
		}
    };
    
	api.guard = {
		guest:false,//是否点击开通守护
		isrenew:false,//是否续费
        container: $('#chatGuard'),
		elemGuardDialog:$("#guardDialog"),
		elemCloseGuard:$("#guard_close"),
		elemGuardStep1:$("#guard_step1"),
		elemGuardStep2:$("#guard_step2"),
		
		elemBtnGuardNext:$("#btn_guard_next"),
		elemBtnGuardKt:$("#btn_guard_kt"),
		
		elemUserAccount:$("#user_account"),
		elemSingerAccount:$("#singer_account"),
		elemGuardPrice:$("#guard_price"),
		elemGuardLangList:$("#guard_lang_list"),
		elemCornValue:$("#corn_value"),
		
		alertDialog:function(msg){
			//rclog("---alertDialog--");
			var div_dialog="<div class='defaultDialog'><div class='login_close'><img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div><p class=' mt10 fts20'>"+msg+"</p><div class=' tc mt30'> <a class='close_tag btn_80x30 bc ' href='javascript:;' titel='Confirm'> Confirm </a></div> </div>";
			scroll(0,0);
			$.popbox(div_dialog);
			
			// 弹窗关闭按钮
			$(".close_tag").click( function() {
				$("#zxxBlank").remove();
				$(this).parents(".wrap_out").remove();
			});
		},
		ktGuardSuccess:function(obj){
			//rclog("---ktGuardSuccess--",obj);
			
			////{"cmd":"applyToBuyGuard.response","coinBalance":999864999,"result":0, "authTime":1413800555 , "endTime":1413800555 }
			var div_dialog="<div class='defaultDialog'><div class='login_close'>"
				+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div>"
				+"<p class=' mt10 fts20'>Congratulations! You have become the Guardian, Thanks for your support! &nbsp; </p> "
				+"<p class=' mt10 fts14'>Guardian's Duration <i class=' colorred1'>（"+Date.prototype.TimeStamp2Date(obj.authTime)+"-"+Date.prototype.TimeStamp2Date(obj.endTime)+"）</i></p> "
				+"<div class=' tc mt10'><a class='close_tag btn_80x30 bc ' href='javascript:window.guardActive();' titel='Confirm'> Confirm </a></div> </div>";
			scroll(0,0);
			$.popbox(div_dialog);
			
			// 弹窗关闭按钮
			$(".close_tag").click( function() {
				$("#zxxBlank").remove();
				$(this).parents(".wrap_out").remove();
			});
		},
		chongGuard:function(obj){
			//rclog("---chongGard--");
			var div_dialog="<div class='defaultDialog'><div class='login_close'>"
				+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div>"
				+"<p class=' mt10 fts20'>Sorry，your balance is not enough. &nbsp;  </p> "
				+"<div class=' tc mt30'><a class='close_tag btn_red bc ' href='"+opencyou.url +"/pay/paycharge.html' titel='Recharge' target='_blank'> Recharge </a>"
				+"<a class='close_tag btn_grey bc ml20' href='javascript:;' titel='Cancel'> Cancel </a>"
				+"</div> </div>";
			scroll(0,0);
			$.popbox(div_dialog);
			
			// 弹窗关闭按钮
			$(".close_tag").click( function() {
				$("#zxxBlank").remove();
				$(this).parents(".wrap_out").remove();
			});
		},
		renewGard:function(obj){
			//rclog("---renewGard--");
			//{"authTime":1413800555,"badge":false,"closeLevel":1,"closeValue":1,"dayLeft":28,"endTime":1416392555,"nick":"zhangaa","uid":7024661}
			var div_dialog="<div class='defaultDialog'><div class='login_close'>"
				+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div>"
				+"<p class=' mt10 fts20'>You are already a guardian, renew now? &nbsp; </p> "
				+"<p class=' mt10 fts14'>Guardian Expiry Date<i class=' colorred1'>（"+Date.prototype.TimeStamp2Date(obj.endTime)+"）</i></p> "
				+"<div class=' tc mt30'><a class='close_tag btn_red bc ' href='javascript:WEB_RC.webrc.getAvailableToBuyGuardInfo();' titel='Confirm'> Confirm </a>"
				+"<a class='close_tag btn_grey bc ml20' href='javascript:;' titel='Cancel'> Cancel </a>"
				+"</div> </div>";
			scroll(0,0);
			$.popbox(div_dialog);
			
			// 弹窗关闭按钮
			$(".close_tag").click( function() {
				$("#zxxBlank").remove();
				$(this).parents(".wrap_out").remove();
			});
		},
		renewGuardSuccess:function(obj){
			//rclog("---renewGuardSuccess--");
			var div_dialog="<div class='defaultDialog'><div class='login_close'>"
				+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div>"
				+"<p class=' mt10 fts20'>Congratulations！The guardian's renewal is succeeded. &nbsp; </p> "
				+"<p class=' mt10 fts14'>Guardian's Duration<i class=' colorred1'>（"+Date.prototype.TimeStamp2Date(obj.authTime)+"-"+Date.prototype.TimeStamp2Date(obj.endTime)+"）</i></p> "
				+"<div class=' tc mt10'><a class='close_tag btn_80x30 bc ' href='javascript:window.guardActive();;' titel='Confirm'> Confirm </a></div> </div>";
			scroll(0,0);
			$.popbox(div_dialog);
			
			// 弹窗关闭按钮
			$(".close_tag").click( function() {
				$("#zxxBlank").remove();
				$(this).parents(".wrap_out").remove();
			});
		},
		
		closeGuard:function(){
			this.elemGuardDialog.hide();
		},
		clickGuard:function(obj,tab){
			//rclog("--clickGuard--",tab,obj,tab==1)
			
			this.elemGuardDialog.show();
			this.elemCloseGuard.click( function(){
				api.guard.elemGuardDialog.hide();
			});
			
			if(tab==1){
				//{"cmd":"guardButton.click", "singerUid":singerUid, "userUid":userUid}
				this.elemGuardStep2.hide();
				this.elemGuardStep1.show();
				
				this.elemBtnGuardNext.click( function(){
					//调用getAvailableToBuyGuardInfo();
					api.webrc.getAvailableToBuyGuardInfo();
					
					//api.guard.renewGard();//测试调用续费
					//api.guard.chongGard();
				});
			}else if(tab==2){
				this.elemGuardStep1.hide();
				//init2
				
				var data = obj.data;
				var info = obj.info;
				this.elemUserAccount.html(data.userAccount);
				this.elemSingerAccount.html(data.singerNick);
				
				this.elemGuardLangList.html("");
				for(var i in info){
					var div="";
					
					if(i==0){
						div='<li><input type="radio" id="radio_'+info[i].duration+'" value="'+info[i].duration+'" name="guard_radio" class="" checked="checked" price="'+info[i].price
							+'" > Activate for <i class="colorred1 fts20">'+parseInt(info[i].duration)*30+'</i> Days';	
						this.elemCornValue.html(info[i].price);
						
						this.elemGuardPrice.html(info[i].price+"RC Coin/"+ parseInt(info[i].duration)*30 +"Days/Performer");
					}else{
						div='<li><input type="radio" id="radio_'+info[i].duration+'" value="'+info[i].duration+'" name="guard_radio" class="" price="'+info[i].price
							+'" > Activate for <i class="colorred1 fts20">'+parseInt(info[i].duration)*30+'</i> Days';
					}
					if(info[i].discount!=""){
						var cos = 100-info[i].discount*10;
						div+='(Dis. '+cos+'% off)</li>';
					}
					this.elemGuardLangList.append(div);
				}
				
				this.elemGuardStep2.show();
				
				$(".guard_lang li input").click(function(){
					var value = $("#"+this.id).attr("price");
					api.guard.elemCornValue.html(value);
				});
				
				this.elemBtnGuardKt.unbind('click');
				
				this.elemBtnGuardKt.click( function(){
					//调用applyToBuyGuard();
					//rclog("=================elemBtnGuardKt click==============");
					var duration = $("input[name='guard_radio']:checked").val(); //开通守护时长(月)
					api.webrc.applyToBuyGuard(duration);
					
				});
				
				
			}
		},
		getGuardList:function(){
			api.webrc.getGuardList();
		},
		checkGuard:function(obj){
			//rclog("--checkGuard--",obj);
			//判断是否是守护
			//{"authTime":1413800555,"badge":false,"closeLevel":1,"closeValue":1,"dayLeft":28,"endTime":1416392555,"nick":"zhangaa","uid":7024661}
			var list = obj.list;
			for( var i in list){
				//alert(list[i].uid+","+api.conf.uid);
				if(list[i].uid == api.conf.uid){
					this.renewGard(list[i]);
					this.isrenew = true;
					return ;
				}
			}
			//测试已经是守护续费
			/*if(debug){
				this.renewGard();
				this.isrenew = true;
				return ;
			}*/
			
			this.isrenew = false;
			this.clickGuard(obj,1); 
		}
		
	};
	api.rank = {
        containerDay: $('#rankList1'),
        containerWeek: $('#rankList2'),
		containerMon: $('#rankList3'),
		getItemHtml: function(obj) {
            //coin: 1746390,guardLevel: 1,imgUrl: "http://api2.showoo.cc/user/getimg.php?uid=19460030&type=100,"nick: "sssss,"uid: 19460030,vipLevel: 1
           	var rid = obj.rid;
			if(rid<=3){
				rid = ' &nbsp;';
			}
			var div = '<li><span class="fl rank_num num'+obj.rid+'">'+rid
						+' </span> <img class="fl rank_img" src="'+ obj.imgUrl
						+' " width="40" height="40" border="1" onerror="this.src=\'../imgs/icon.png\'"/> ';
			if(obj.guardLevel!='' && obj.guardLevel>0){
				div+=' <img class="rank_guaid" src="img/icon/icon_guard1.png" width="12" height="32" border="0"/>';		
			}
                       
            div+= '<div class="fl rank_count"><div class="name">';
			if(obj.vipLevel!='' && obj.vipLevel>0){
				div+=' <img class="fl rank_vip" src="../imgs/icon_vip.png" width="16" height="15" border="0"/>';		
			}				
			div+= ' <span>'+ obj.nick+'</span></div><div class="count"><span>'+ obj.coin +'</span> Tokens</div></div> </li>';
				
			return  div;
        },
		initArrayItem: function(obj) {
            var dayRankList = obj.data.dayRankList;
			var monthRankList = obj.data.monthRankList;
			var weekRankList = obj.data.weekRankList;
			
			if(dayRankList && dayRankList.length>0){
				var html="";
				for (var i = 0, len = dayRankList.length; i < len; i++) {
					dayRankList[i].rid=i+1;
					html += this.getItemHtml(dayRankList[i]);
				}
				this.containerDay.empty().append(html);
			}else{
				$("#rankList1").html($("#rankList_none").html());
			}
			
			if(weekRankList && weekRankList.length>0){
				var html="";
				for (var i = 0, len = weekRankList.length; i < len; i++) {
					weekRankList[i].rid=i+1;
					html += this.getItemHtml(weekRankList[i]);
				}
				this.containerWeek.empty().append(html);
			}else{
				$("#rankList2").html($("#rankList_none").html());
			}
			
			if(monthRankList && monthRankList.length>0){
				var html="";
				for (var i = 0, len = monthRankList.length; i < len; i++) {
					monthRankList[i].rid=i+1;
					html += this.getItemHtml(monthRankList[i]);
				}
				this.containerMon.empty().append(html);
			}else{
				$("#rankList3").html($("#rankList_none").html());
			}
        }
	};
	
    api.form = {
        editor: null,
        elemText: $('#chatFormText'),
        elemTextBtn: $('#chatFormShowSmile'),
		elemTabSmileBtn: $('#chatFormTab_smail'),
		elemTabSmileVipBtn: $('#chatFormTab_vip'),
        elemSetting: $('#chatFormSetting'),
        elemFont: $('#chatFormFontSize'),
        elemColor: $('#chatFormFontColor'),
        elemSmiles: $('#chatFormSmile'),
		elemChannelFollow: $('#channelFollow'),
		stype:1,
		elemSmilesVip: $('#chatFormSmileVip'),
		elemVipIconAdd: $('#vipIconAdd'),
		elemPrivCheckbox:$("#privCheckbox"),
		elemFlashTips: $('#flashTips'),
        elemFlower: $('#chatFormFlower'),
        elemFlowerTips: $('#flowerTips'),
        elemSubmit: $('#chatFormEnter'),
		elemSelect: $('#to_select_chat'),
		elemSelectUid: $('#to_select_uid'),
        elemMsgContainer: api.msg.container,
		limitSize:80,
        getMsgSize: function() {
            return this.editor.getHTML().replace(/\[smile=([^\]]+)\]\[\/smile\]/ig, '12345678').length;
        },
        isCanSpeak: function() {
            if (api.conf.guest ) {
                api.msg.addTips(' You are a visitor, please login~ ');
                //if (RC) {
                //    RC.login();
                //}
				//登陆框
				//var div_dialog=$("#dialog_login").html();
				//$.popbox(div_dialog);
				
                return false;
            }
            //rclog(api.conf.speakLimit ,api.conf.uid);
            if (api.conf.userLimit == 1) {
                api.msg.addTips('您已被管理員禁止發送文字訊息');
                return false;
            }
            
            var tickTime = 1 * 1000;
            var someTextTime = 10 * 1000;
            var canSpeak = true;
            var now = new Date().getTime();
            var text = this.editor.getHTML();
            
            if (this.getMsgSize() === 0) {
                //api.msg.addTips('請輸入信息');
                canSpeak = false;
            }/* else if (this.getMsgSize()>limitSize){
				api.msg.addTips('您发送的信息太长了，不要超过'+limitSize+'个字符!');
                canSpeak = false;
			}*/ else if (now - api.timeLimit.lastSpeak < tickTime) {
                api.msg.addTips('您发信息太快了，喝杯咖啡休息会吧');
                canSpeak = false;
            } else if (now - api.timeLimit.lastSpeak < someTextTime && text == api.timeLimit.lastText) {
                api.msg.addTips('Please don\'t send the same messages within a few seconds.');
                canSpeak = false;
            } else {
                //speakLimit => 0：沒有限制，1：不允许游客發送包含URL的信息，2：不允许游客发言，4：遊客和會員不能發言
                if (api.conf.speakLimit === 0 || api.conf.speakLimit == 1) {
                    //遊客可以發言
                    if (api.conf.wait && now - api.timeLimit.login < api.conf.wait * 1000) {
                        api.msg.addTips('遊客登錄發言等待時間未到');
                        canSpeak = false;
                    } else if (api.conf.interval && now - api.timeLimit.lastSpeak < api.conf.interval * 1000) {
                        api.msg.addTips('遊客發言間隔限制時間未到');
                        canSpeak = false;
                    }
                    else if (api.conf.speakLimit == 1 && /(http|https|ftp):\/\/.+/ig.test(text)) {
                        api.msg.addTips('遊客不能發送包含URL的信息');
                        canSpeak = false;
                    }
                } else {
                    //遊客不可以發言
                    if (api.conf.speakLimit == 2) {
                        api.msg.addTips('游客不可以发言');
                        canSpeak = false;
                    } else if (api.conf.speakLimit == 4 && api.conf.role <= 100) {
                        api.msg.addTips('遊客和會員不可以發言');
                        canSpeak = false;
                    }
                }
            }
            
            return canSpeak;
        },
        init: function() {
			
            //init smile list
            var smileCount = 0;
            var smileHtml = '';
			var v_smileHtml = '';
			
            for (var name in SMILES) {
				++smileCount ;
				var name1 = name.replace('<', 'lt;').replace('>', 'gt;');
                
				if(smileCount > 64){
					break;
				}else if (smileCount > 60 && smileCount<=64) {
					v_smileHtml+='<a href="javascript:;" hidefocus="true" class="zhuan"><img src="' + SMILES[name] + '" name="' + name1 + '" /></a>';
                    
                }else{
					smileHtml += '<a href="javascript:;" hidefocus="true"><img src="' + SMILES[name] + '" name="' + name1 + '" /></a>';
				}
            }
            this.elemSmiles.html(smileHtml);
			//VIP专属
			this.elemSmilesVip.html(v_smileHtml);
			
			var addHtml = '<span class="vipIconAdd" id="vipIconAdd"><input type="file" name="customSmile" id="customSmile" onclick="return WEB_RC.form.checkLimit();" hidefocus="true" '
						+' onchange="WEB_RC.form.onSmileFileValueChange(this)"/><div id="vip_tip" class="vip_tip" '
						+' style=" display:none;"> 支持GIF，JPEG和PNG文件格式，最大为4M</div></span>';
			this.elemSmilesVip.append(addHtml);
			this.elemVipIconAdd = $("#vipIconAdd");
				
			this.elemVipIconAdd.mouseover(function(event) {
				$("#vip_tip").show();
			});	
			this.elemVipIconAdd.mouseout(function(event) {
				$("#vip_tip").hide();
			});	
			
			//VIP自定义
			var cookies_Vvip = opencyou.cookies.read('_open_vip');
			if( cookies_Vvip != null && cookies_Vvip >0){
				this.onLoadVipSmile();
				
				this.elemSmilesVip.find('img').click(function() {
					api.form.editor.insertHTML('<img style="width:45px; vertical-align:middle; margin:0 1px" src="' + this.src + '" name="' + this.name + '" />');
					
				});
			
			}else{
				this.showNoVipDialog();
				//屏蔽事件
				$(".chatFormSmileVip *").click(function(e) {
					//rclog("++++++++++++++++++++++++++++++++++");
					return false;
				});
			}
			
            //editor init
            this.editor = new RcEditor();
            this.editor.disableEditControl = true;
            this.editor.removePasteStyle = '<img>';
            this.editor.setFilter = smile2html;
            this.editor.getFilter = html2smile;
            this.editor.css = {
                //paddingTop: '5px',
                fontSize: '12px',
                wordBreak: 'break-all',
				color:'#ffffff',
                lineHeight: '20px'
				
                //background: !$.support.leadingWhitespace ? '#ededed' : 'none'
            };
            this.editor.init(this.elemText.get(0).id);
			
            var edit = $("#chatFormInput").find(".RcEditor");
			edit.css('height',$("#chatFormInput").height() );
			
            //show smiles button event bind
			/*
            this.elemTextBtn.click(function() {
                if (api.form.elemSetting.is(':hidden')) {
                    api.form.elemSetting.show();
					
					api.form.elemSmiles.show();
					api.form.elemSmilesVip.hide();
					api.form.elemTabSmileBtn.addClass("on");
					api.form.elemTabSmileVipBtn.removeClass("on");
					
					api.form.elemTabSmileBtn.click(function(){
						 api.form.elemSmiles.show();
						 api.form.elemSmilesVip.hide();
						 api.form.elemTabSmileBtn.addClass("on");
						 api.form.elemTabSmileVipBtn.removeClass("on");
					});
					api.form.elemTabSmileVipBtn.click(function(){
						 api.form.elemSmilesVip.show();
						 api.form.elemSmiles.hide();
						 api.form.elemTabSmileVipBtn.addClass("on");
						 api.form.elemTabSmileBtn.removeClass("on");
					});
                } else {
                    api.form.elemSetting.hide();
                }
            });
			*/
			this.elemTabSmileBtn.click(function(){
				
				if (api.form.elemSetting.is(':hidden') || api.form.elemSetting.attr("tid")!=1) {
                    api.form.elemSetting.show();
					api.form.elemSmiles.show();
					api.form.elemSmilesVip.hide();
					api.form.elemSetting.css("left",113);
					api.form.elemSetting.attr("tid",1);
				} else {
                    api.form.elemSetting.hide();
                }
			});
			
			this.elemTabSmileVipBtn.click(function(){
				
				if (api.form.elemSetting.is(':hidden') || api.form.elemSetting.attr("tid")!=2) {
                    api.form.elemSetting.show();
					api.form.elemSmiles.hide();
					api.form.elemSmilesVip.show();
					api.form.elemSetting.css("left",146);
					api.form.elemSetting.attr("tid",2);
				} else {
                    api.form.elemSetting.hide();
                }
			});
			
            $(document.body).click(function(e) {
                if (api.form.elemSetting.is(':visible')) {
                    var target = $(e.target);
                    var inPanel = api.form.elemSetting.find(target).length > 0 || api.form.elemSetting.filter(target).length > 0;
                    var tagName = e.target.tagName.toLowerCase();
                    if ((inPanel && tagName == 'img') || (!inPanel && !target.hasClass('chatFormShowSmile'))) {
                        api.form.elemSetting.hide();
                    }
                }
            });
            this.editor.on('click', function() {
                api.form.elemSetting.hide();
            });
            
            //fontSize and fontColor change event bind
            this.elemFont.change(function() {
                api.form.editor.setStyle({
                    fontSize: this.value
                });
            }).trigger('change');
            this.elemColor.change(function() {
                var color = '#' + this.value.replace('0x', '');
                api.form.editor.setStyle({
                    color: color
                });
                $(this).css('backgroundColor', color);
            }).trigger('change');
            
			
            //set a smile event bind
            this.elemSmiles.find('img').click(function() {
                api.form.editor.insertHTML('<img style="width:19px; vertical-align:middle; margin:0 1px" src="' + this.src + '" name="' + this.name + '" />');
            });
            
			
			/**************************送花**************************/
            //send a flower event bind
	   	 	this.elemChannelFollow.click(function(e) {
				//var elem = $(this);
				if ($(event.target).hasClass("ing")  ) {
					api.webrc.setData('unfollow.click');
				}else{
					api.webrc.setData('follow.click');
				}
				
			});
			
			/*
            this.elemFlower.click(function(e) {
				
                var elem = $(this);
				//rclog(elem.hasClass('active'),api.conf.guest);
				if(api.conf.guest){
					api.msg.addTips('You are a visitor, please login~ ');
					return false;
				}
				
                if (elem.hasClass('active')) {
                    api.webrc.setData('flower.send');
                    
					var font = elem.find('font');
                    var text = font.text();
                    var count = parseInt(text, 10);
                    if (!isNaN(count) && count > 1) {
                        font.text(count - 1);
                    } else {
                        font.text('0');
                       // elem.removeClass('active');
                        elem.data('tips', true);
                    }
					
                }/ * else if (RC && elem.hasClass('logout') ) {
                    RC.login();
                }* /
				
				//api.form.elemFlowerTips.show();
                if (api.form.elemFlowerTips.data('tips')) {
                    api.form.elemFlowerTips.hide().fadeIn(500).delay(500).fadeOut(500);
                }
            });
			*/
            /**************************end 送花***************************/
			
			
            //submit message event bind
            this.elemSubmit.click(function() {
				//rclog("click",api.form.isCanSpeak());
                if (api.form.isCanSpeak()) {
                    var height = api.form.elemFont.val();
                    var color = api.form.elemColor.val();
                    var text = api.form.editor.getHTML();
					var name = api.form.elemSelect.val();
					var uid = api.form.elemSelectUid.val();
					
					if (uid<=0 && api.form.getMsgSize()>api.form.limitSize){
						api.msg.addTips('您发送的信息太长了，不要超过'+api.form.limitSize+'个字符!');
						return false;
					}
					
					if(!$("#privCheckbox").prop("checked")){ 
					 	var tnick = api.form.elemSelect.val();
						var tuid = uid;
						uid=0;
						
						var data=tuid+";"+tnick;
						var tag = utf8to16(base64encode("◇"));
						text = data+tag+ text;
					}
					var r = api.webrc.sendMsg('msg.send', 0, color, height, text ,uid);
					
					if(r!=false){
						if(uid!='undefined' && uid>0){
							api.msg.addPMItem({uid:uid,name:name,height: height,color: color,msg: text});
						}
					}
                    api.form.editor.setHTML('');
                    api.timeLimit.lastSpeak = new Date().getTime();
                    api.timeLimit.lastText = text;
					
                }
            });
            $(api.form.editor._doc).keydown(function(e) {
                //Ctrl + Enter
                //if (e.ctrlKey && e.keyCode == 13) {
                if (e.keyCode == 13) {
                    api.form.elemSubmit.trigger('click');
                    return false;
                }
            });
        },
		checkLimit:function(){
			//rclog("-----checkLimit",this.elemSmilesVip.find("a").length );
			//this.elemSmilesVip.find('img')
			if(this.elemSmilesVip.find("a").length >=14){
				this.showTipDialog('limit','您的自定义表情已达到10张 请删除其他表情后方可上传');
				return false;
			}
			return true;
		},
		reloadClick:function(){
			
			$(".chatFormSmileVip a.isdel").mouseover(function(event){
					$(this).find('span').show();
			});
			$(".chatFormSmileVip a.isdel").mouseout(function(event){
				$(this).find('span').hide();
			});
				
			$(".chatFormSmileVip a.isdel span").click(function(event){
				//rclog($(this).attr("id"));
				var d_id=$(this).attr("id"); 
				api.form.delVipSmileItem(d_id);
					
			});
				
			this.elemSmilesVip.find('img').unbind('click');
			this.elemSmilesVip.find('img').click(function() {
				api.form.editor.insertHTML('<img style="width:45px; vertical-align:middle; margin:0 1px" src="' + this.src + '" name="' + this.name + '" />');
				
			});
		},
		showNoVipDialog:function(){
			var div='<div class="tip_novip">您尚未开通VIP，暂不能使用此功能 <span onclick="window.open(\''+opencyou.url+'/center/mallVip.html\');" >Become a VIP now</span></div>';
			
			this.elemSmilesVip.append(div);
		},
		showTipDialog:function(id, msg){
			var div='<div class="tip_novip" id="tip_limit">'+msg+'</div>';
			this.elemSmilesVip.append(div);
			
			setTimeout(function(){
				//rclog("remove",$("#tip_limit"));
				$("#tip_limit").remove();	
			},2000);
			
		},
		checkFile:function(id){
		
			var filename =  $('#'+id).val();
			
			if(filename==""){
				this.showTipDialog('limit','Required.');
				//rcopen.checkInput.showTip(id,"Required.");
			}else{
				
				var pos = filename.lastIndexOf(".");  
				var str = filename.substring(pos, filename.length);  
				var str1 = str.toLowerCase();
				
				if (str1 == '.jpg' ||str1 == '.jpeg' || str1 == '.gif' || str1 == '.png') { 
					return true;
				} else{
					this.showTipDialog('limit',' 支持GIF，JPEG和PNG文件格式.');
				}	
				
			}	
			return false;
		},
		onSmileFileValueChange: function(obj) {
			//rclog("--onSmileFileValueChange--",obj);
			//return false;
			var fileId = obj.id;
			var fileVal = obj.value;
			
			if(!this.checkFile(fileId)){
				return false;
			}
			
			var uid = opencyou.cookies.read('_open_uuid');
			//rclog(fileId,fileVal,uid);
			
			if( uid==null || uid==''){
				return false;
			}
			
			var api = opencyou.imageurl+"/photo/add?uid=" + uid +"&type="+this.stype;
			//rclog(api);
			ajaxUpLoad(api, fileId, function(d){
				rclog(d);
				//{"success":false,"error":"image amount more than 10 pics."} 
				var data = eval('(' + d + ')');
				
				if(data.success == false){
					var id = "limit";
					WEB_RC.form.showTipDialog(id,data.error);
					//api.form.showTipDialog(id,'您的自定义表情已达到10张 请删除其他表情后方可上传');
					/*setTimeout(function(){
						WEB_RC.form.elemSmilesVip.remove($("#tip_"+id));
						
					},2000);*/
				}else if(data.success == true){
					//api.form.onLoadVipSmile();
					var list = data.uri;
					//rclog(list);
					for( var i in list){
						var id = list[i].id;
						var imguri = list[i].imguri;
						
						var name="/v{"+imguri.substring(imguri.lastIndexOf('/')+1);
						
						name = name.replace('"', "\\\"");
						//SMILES[name]=imguri;
						
						var v_smileHtml = WEB_RC.form.getSmileHtml(id,imguri,name );
					
						WEB_RC.form.elemVipIconAdd.before(v_smileHtml);
						
						WEB_RC.form.reloadClick();
					}
					
				}
				
			}, "");
			
			/*
			setTimeout(function(){
				WEB_RC.form.onLoadVipSmile();
			},2000);
			*/
		},
		
		delVipSmileItem:function(id){
			
			var url = opencyou.imageurl+'/photo/del?id=' + id ;
			//rclog(url);
			opencyou.utils.getJsonData(url,function(data){
				
				var success = data.success;
				if(success == true){
					
					$(".chatFormSmileVip #VIPIMG_"+id).remove();
					
				}
			});
		},
		getSmileHtml:function(id,imguri,name){
			var name1 = name.replace('<', 'lt;').replace('>', 'gt;');
			var v_smileHtml='<a id="VIPIMG_'+id+'" href="javascript:;" hidefocus="true" class="isdel" >'
					+'<img src="' + imguri + '" name="' + name1 + '" /><span class="vip_close" id="'+id+'"></span></a>';
             return v_smileHtml;
		},
		onLoadVipSmile:function(){
			var uid = opencyou.cookies.read('_open_uuid');
			
			var url = opencyou.imageurl+'/photo/listJsonp?timestamp='+jQuery.now()+'&uid=' + uid +'&type='+this.stype;
			//rclog(url);
			opencyou.utils.getJsonData(url ,function(data){
				rclog("--onLoadVipSmile--",data);
				var success = data.success;
				if(success!=true){ rclog(success); }
				
				var list = data.list;
				var v_smileHtml = "";
				
				for(var i in list){
					var id = list[i].id;
					var imguri = list[i].imguri;
					var name="/v{"+imguri.substring(imguri.lastIndexOf('/')+1 );
					
					name = name.replace('"', "\\\"");
					//SMILES[name]=imguri;
					//WEB_RC.SMILES.c_custom_1('"' + name.replace('"', "\\\"") + '":"' + imguri + '"');
					//rclog(SMILES);
					v_smileHtml+=api.form.getSmileHtml(id,imguri,name );
					
				}
				
				api.form.elemVipIconAdd.before(v_smileHtml);
				
				api.form.reloadClick();
			});
			
		}

    };
    
    return api;
})();

$(function() {
    var topNavHeight = 40;
    //var tabNavHeight = 31;
    var msgPaddingTop = 30;
    var formTextHeight = 127;
    var flashHeightList = [540,660,722];//, 573, 673, 773];
    window.lastFlashHeight = 0;
	window.lastFlashType = 0; //0大分辨率，1中分辨率,2小分辨率
	window.nowFlashType = 0;
    var jQbody = $(document.body);
    var jQwin = $(window);
    jQwin.on('flash.resize', function(e) {
        //rclog('flash.resize', e);
		
        var size = flashHeightList[0];
        var wh = jQwin.height();
		
		var rh = wh - topNavHeight - 10;
		
		if (wh > flashHeightList[2] + topNavHeight + 20) {
			size = flashHeightList[2];
		} else if (wh > flashHeightList[1] + topNavHeight + 20) {
			size = flashHeightList[1];
		} else  {
			size = flashHeightList[0];
		}
			/*
			if (wh < flashHeightList[0] + topNavHeight) {
			 	jQbody.css('overflow-y', 'auto');
			} else {
			 	jQbody.css('overflow-y', 'hidden');
			}*/
			
		//娱乐页布局
		//if (size != lastFlashHeight  && window.location.href.indexOf("/live/t.html")>0) {
			//size = 772;
			var elemFlash = $('object#flashBox');
			var elemMsg = $('#chat_scroll');
            var tabContents = $('#tab-contents');
			var elemCarCont = $("#carContent");
			var elemViewerCont = $("#viewerContent");
			var elemRankContent = $("#rank_content");
			var elemMsg1 = $('#chatMsg');
			var elemMsg2 = $('#chat_private');
            var slide = $('#watch_chat_slideBar');
			//var chatUser = $('#chatUser');
			var elemCFI = $("#chatFormInput");
			var elemCF = $("#chatForm");
			var s_size = size - 50 ;
			//var scroller_size = 120;
			var private_size = 90;
			var cfi_size =64;
			var cf_size =64;
            if (elemFlash.length && elemMsg.length ) {
				
				lastFlashHeight = size;
				formTextHeight= 127;
				if(lastFlashHeight == flashHeightList[0] ){
					nowFlashType = 2;
					private_size = 40;
					
					formTextHeight= 95;
					cfi_size = 32 ;
					cf_size = 78 ;
				}else if(lastFlashHeight == flashHeightList[1] ){
					nowFlashType = 1;
					
					formTextHeight= 127;
					cfi_size = 64 ;
					cf_size = 110 ;
				}else{
					nowFlashType = 0;
					
					formTextHeight= 127;
					cfi_size = 64 ;
					cf_size = 110 ;
				}
				
                elemFlash.attr('height', size );
				tabContents.css('height', s_size );
				
                elemMsg.css('height', s_size -36 - formTextHeight);
				elemCarCont.css('height', s_size -36);
				elemViewerCont.css('height', s_size -36);
				
				elemRankContent.css('height', size- 252 );
				
				elemMsg2.css('height', private_size);
				elemMsg1.css('height', s_size  - formTextHeight - elemMsg2.height() - 86 );
				slide.css('top', elemMsg1.height() + msgPaddingTop - 9);
				
				elemCF.css('height', cf_size);
				elemCFI.css('height', cfi_size );
				var edit = $("#chatFormInput").find(".RcEditor");
				edit.css('height',cfi_size);
				
				var boy = $("#chatFormInput").find(".RcEditor body");
				console.log("=====================",boy.css('color'));
				boy.css('color','#fff');
				//chatUser.css('height', size );
            }
			
		//}
		/*
		var tvContent = $('#tv_content');
		var chatUser = $('#chatUser');
		var rankCont = $("#channel_rank_cont");
		var anchorCont = $("#anchorInfo");
		
		rankCont.css('width', chatUser.width());
		anchorCont.css('width', tvContent.width() - chatUser.width() -12);
		*/
		
		//游戏页布局
		/*size = rh;
		if (size != lastFlashHeight  && window.location.href.indexOf("/live/v.html")>0) {
			
            var elemFlash = $('object#flashBox');
            var elemMsg = $('#chat_scroll');
			var elemMsg1 = $('#chatMsg');
			var elemMsg2 = $('#chat_private');
            var slide = $('#watch_chat_slideBar');
            if (elemFlash.length && elemMsg.length ) {
                elemFlash.attr('height', size);
                elemMsg.css('height', size  - formTextHeight);
				
				elemMsg2.css('height', 80);
				elemMsg1.css('height', size  - formTextHeight - elemMsg2.height()- 20 - msgPaddingTop );
				slide.css('bottom', 105);
				//slide.css('top', elemMsg1.height() + msgPaddingTop);
				
                lastFlashHeight = size;
            }
        }*/
    }).trigger('flash.resize');
	
    jQwin.on('resize', function() {
        jQwin.trigger('flash.resize');
		
		if(lastFlashHeight == flashHeightList[0] && lastFlashType != 2 ){
			lastFlashType = 2; 
			webRC.initScreenType(lastFlashType);
		}else if( lastFlashHeight == flashHeightList[1] && lastFlashType != 1 ){
			lastFlashType = 1;
			webRC.initScreenType(lastFlashType);
		}else if( lastFlashHeight == flashHeightList[2] && lastFlashType != 0 ){
			lastFlashType = 0;
			webRC.initScreenType(lastFlashType);
		}
		
    });
	
    window.webRC = new WebRC({
       /* sid: serverData.sid,
        cid: serverData.cid,
        uid: serverData.uid,
        param: serverData.param,
        guid: serverData.uuid*/
    });
    
    //global config
    WEB_RC.webrc = webRC;
    //msg config
    WEB_RC.msg.container = $('#chatMsg');
    WEB_RC.msg.maxMsgSize = 100;
    //user config
    
	WEB_RC.user.container = $('#chatUser');
   // WEB_RC.user.elemUserCount = $('.elemUserCount');
	
    //form config
    WEB_RC.form.elemText = $('#chatFormText');
    WEB_RC.form.elemTextBtn = $('#chatFormShowSmile');
    WEB_RC.form.elemSetting = $('#chatFormSetting');
    WEB_RC.form.elemFont = $('#chatFormFontSize');
    WEB_RC.form.elemColor = $('#chatFormFontColor');
    WEB_RC.form.elemSmiles = $('#chatFormSmile');
    WEB_RC.form.elemFlower = $('#chatFormFlower');
	WEB_RC.form.elemChannelFollow= $('#channelFollow');
	WEB_RC.form.elemChannelFlower = $('#channelFlower');
	WEB_RC.form.elemFlashTips = $('#flashTips');
    WEB_RC.form.elemFlowerTips = $('#flowerTips');
    WEB_RC.form.elemSubmit = $('#chatFormEnter');
    WEB_RC.form.elemMsgContainer = WEB_RC.msg.container;
    //form init
    WEB_RC.form.init();
	
    WebScroll.gift.init();
	
    //all flash callback event
    webRC.on('log', function(txt) {
        rclog('log', txt);
    });
    webRC.on('alert', function(txt) {
        alert(txt);
    });
    webRC.on('set', function(command, args) {
        rclog('webRC.setData', command, args);
    });
    webRC.on('data', function(command, args) {
        rclog('webRC.onData', command, args);
    });
    webRC.on('setting', function(obj) {
        rclog('setting', obj);
        WEB_RC.updateConf(obj);
        //Setting changed handle here
    });
    webRC.on('ready', function() {
        rclog('flash ready -> flash.resize');
        webRC.setData('init', serverData.flash);
        $(window).trigger('flash.resize');
    });
    webRC.on('connect', function() {
        WEB_RC.timeLimit.login = WEB_RC.timeLimit.lastSpeak = new Date().getTime();
    });
    webRC.on('close', function() {
        WEB_RC.msg.addTips('與服務器斷開連接　<a href="javascript:;" onclick="webRC.connect()" style="color:blue">重新連接服務器</a>');
    });
    webRC.on('msg.push', function(obj) {
		rclog("-msg.push",obj);
        WEB_RC.msg.addItem(obj);
    });
    webRC.on('broadcast.push', function(obj) {
        WEB_RC.msg.addBroadcastItem(obj);
    });
	/*
    webRC.on('user.init', function(arr) {
        WEB_RC.user.initItem(arr);
    });
    webRC.on('user.enter', function(obj) {
        WEB_RC.user.addItem(obj);
    });
    webRC.on('user.leave', function(uid) {
        WEB_RC.user.removeItem(uid);
    });
    webRC.on('user.kick', function(uid) {
        WEB_RC.user.removeItem(uid);
    });
    webRC.on('user.change', function(obj) {
        WEB_RC.user.updateItem(obj);
    });
	
    webRC.on('user.login', function(obj) {
        RC.login();
    });
    webRC.on('user.logout', function(obj) {
        RC.logout();
    });
	
    webRC.on('user.follow', function() {
        rclog('user.follow');
        if (FB) {
            FB.ui({
                method: 'feed',
                link: 'http://rcshow.tv/live/julge530'
            });
        }
    });
	*/
	/****************************************************/
	webRC.on('inited.succeeded', function(obj) {
        rclog("inited.succeeded",obj);
		webRC.initType();
		
		rcInit();
		
    });
	webRC.on('userLogin.succeeded', function(obj) {
        rclog("userLogin.succeeded",obj);
		
		var channel = opencyou.utils.getParamFromUrl("s");
		webRC.enterChannel(channel);
		
		if(obj.anonymous=='0'){//非游客
			WEB_RC.conf.guest = false;
			elemFlowerTips.html("");
			elemFlowerTips.hide();
		}
		
		WEB_RC.conf.uid = obj.uid;
    });
	webRC.on('userLogin.failed', function(obj) {
        rclog("userLogin.failed",obj);
		
		webRC.movie.loginByToken(0, "", 2, 'link', "");
    });
	webRC.on('channel.loginSucceeded', function(obj) {
        rclog("channel.loginSucceeded",obj);
		webRC.connected = true;
		
		var add = opencyou.cookies.read('_open_add');
		var multip = opencyou.cookies.read('_open_multip');
		
		rclog(" online.count.modifier",multip,add);
		webRC.setModifier(parseInt(multip), parseInt(add));
		//webRC.movie.setData("online.count.modifier", parseInt(multip), parseInt(add));
    	
	});
	webRC.on('channel.loginFailed', function(obj) {
        rclog("channel.loginFailed",obj);
    });
	webRC.on('userLogin.beKickedOff', function(obj) {
        rclog("userLogin.beKickedOff",obj);
		//{"cmd":"userLogin.beKickedOff"} );
		WEB_RC.msg.addTips(' 您被迫下线，账号在其它地方重复登陆了~ ');
		
		WEB_RC.conf.guest = true;
		
		window.location.href=opencyou.url+"/index.html";
    });
	webRC.on('channel.chatText', function(obj) {
		rclog("channel.chatText",obj);
		WEB_RC.msg.addArrayItem(obj);
    });
	webRC.on('common.debugInfo', function(obj) {
		rclog("common.debugInfo",obj);
    });
	webRC.on('msg.send.result', function(obj) {
		rclog("msg.send.result",obj);
    });
	webRC.on('href.pay', function(obj) {
		rclog("href.pay",obj);
		window.open( opencyou.url+"/pay/paycharge.html");
    });
	webRC.on('href.exchange', function(obj) {
		rclog("href.exchange",obj);
		//window.open( opencyou.url+"/pay/payconvert.html");
		window.open( opencyou.url+"/pay/paycharge.html");
    });
	webRC.on('common.follow', function(obj) {
		
		opencyou.account.loadRecord();
    });
	webRC.on('memberList.update', function(obj) {
		rclog("memberList.update",obj);
		
		WEB_RC.user.initItemArray(obj);
    });
	
	webRC.on('DJDetailedInfo', function(obj) {
		
		if(obj.show == 1){
			$("#userInfoDialog").fadeIn() 
			//document.getElementById("userInfoDialog").style.visibility = "visible";
		}else{
			$("#userInfoDialog").fadeOut() 
			//document.getElementById("userInfoDialog").style.visibility = "hidden";
		}
		
    });
	webRC.on('common.rankLists', function(obj) {
		//rclog('common.rankLists',obj);
		WEB_RC.rank.initArrayItem(obj);
    });
	webRC.on('setsingerinfo', function(obj) {
		rclog('setsingerinfo',obj);
		//{"cmd":"setsingerinfo","uid":19460166,"singerLevel":34} 
		$("#channel_exp").html('<img src="pic/exp/'+obj.singerLevel+'.png" height="27" /><object type="application/x-shockwave-flash" data="pic/flash.swf" width="57" height="27" ><param name="wmode" value="transparent"></object>');//<span class="icon_star_exp"></span>
		
    });
	/****************************************************/
	
    var flowerRemainTime = 0;
    var flowerRemainTimer = null;
	var elemFlashTips = WEB_RC.form.elemFlashTips;
    var elemFlowerTips = WEB_RC.form.elemFlowerTips;
    var elemChatFormFlower = WEB_RC.form.elemFlower;
    webRC.on('flower.update', function(obj) {
        
		$("#channelFlowerNum").html(obj.num);
        //elemChatFormFlower.removeClass('active');
        /*if (obj.num) {
            elemChatFormFlower.addClass('active').find('font').text(obj.num);
        } else {
            elemChatFormFlower.find('font').text('0');
        }
        window.clearInterval(flowerRemainTimer);
        elemFlowerTips.data('tips', false);
        if (obj.remainTime && !obj.num && !WEB_RC.conf.guest) {
            flowerRemainTime = obj.remainTime;
            elemFlowerTips.data('tips', true);
            flowerRemainTimer = window.setInterval(function() {
                flowerRemainTime--;
                elemFlowerTips.html('<font>' + flowerRemainTime + '</font>sec to get your next flower');
                if (flowerRemainTime <= 0) {
                    window.clearInterval(flowerRemainTimer);
                    elemFlowerTips.data('tips', false);
                }
            }, 1000);
        }*/
    });
	webRC.on('follow.update', function(obj) {
    	rclog("--follow.update",obj);
		if(obj.status==1){
			
			$("#channelFollow").addClass("ing");
			$("#channelFollow").html("following");
		}else{
			$("#channelFollow").removeClass("ing");
			$("#channelFollow").html("+follow");
		}
       
    });
	webRC.on('gift.send', function(obj) {
		
		rclog('gift.send',obj);
		//{"receivernick":"apple3","users":{"isflash":"0","sender_uid":19460148,"number":1,"giftimg":"http://www.xiuktv.com/live/images/2015012322113301.png","time":10,"sendnick":"apple","vipLevel":1},"cmd":"gift.send","ruid":19460166} 
	    var html = '';
		var user = obj.users;
        //for (var i = 0, len = obj.users.length; i < len; i++) {
		
        var time = Date.prototype.getTimeMmSs();
			
        html += '<div class="chatMsgItem"><div class="chatMsgFlower say_pri"><span class="chatMsgTime">'+time+'</span><var u="'+user.sender_uid+'" class="say_pri">' + WEB_RC.tools.htmlChars(user.sendnick) + '</var><span> gives </span><var class="say_pri" u="'+obj.ruid+'">' + WEB_RC.tools.htmlChars(obj.receivernick) +'</var><img src="'+user.giftimg+'" width="40" height="40" border="0"/> X '+ user.number+'</div></div>';
			
        //}
		
        WEB_RC.msg.addCustomItem(html, true);
		
		//{"num":100,url":"http://www.xiuktv.com/live/images/2014101815102701.png"} 
		if(user.isflash==0){
			var data ={};
			data.num=user.number;
			data.url= user.giftimg;
			data.time = user.time;
			webRC.fire('showGift',data); 
		}
    });
	
	webRC.on('showCar', function(obj) {
		rclog('showCar',obj);
		//onFlashData {"carimg":"/PubImgSour/car/02.jpg","vipLevel":1,"nick":"apple1","carname":"布加迪威航","resource":"/PubImgSour/car/resource_1421818278835.jpg","sd":1422001020,"carnumber":"P-0000047","cmd":"showCar","uid":19460163,"caricon":"/PubImgSour/car/icon_02.jpg","guardLevel":1} 
	    var html = '';
        var time = Date.prototype.getTimeMmSs();
		var carnumber = obj.carnumber;
		
		if(obj.carnumber==null || obj.carnumber=='null'){
			carnumber = "tmp license";
		}
		
		html += '<div class="chatMsgItem"><div class="chatMsgTitle"><span class="chatMsgTime">'+time+'</span>欢迎 <var class="chatMsgName say_pri " u="'+obj.uid+'">'
				+obj.nick+'</var> 大驾光临</div> <div class="chatCarContent"><div class="charCarImg">';
		if( obj.carimg.indexOf(".swf")>0){
			html += '<object type="application/x-shockwave-flash" data="'+opencyou.url+obj.carimg
					+'" width="130" style="max-height: 85px;" ><param name="wmode" value="transparent"></object>'	
		}else{	
			html += '<img src="'+opencyou.url+obj.carimg+'" width="130" style="max-height: 85px;" />';
		}
		html += '</div><div class="charCarRight"><div class="charCarName"><img src="'+opencyou.url+obj.caricon+'" height="24" />'
				+'<span class="">'+obj.carname+'</span></div><span class="chatCarNumber">'+carnumber+'</span>'
                +'</div> </div></div>';
        WEB_RC.msg.addCustomItem(html, true);
		
		//显示特效
		var length = $("#effectDiv").find("object").length;
		
		var d = new Date().getTime();
		var html ='<div id="carEffect_'+d+'" style="pointer-events:none; position: absolute; left: 20px; top: 20px;" class="effectflash" ></div>';
        $("#effectDiv").append(html);
		
		var path = opencyou.url+obj.resource;//opencyou.imageurl+"/PubImgSour/m.swf"//"http://220.181.142.210/live/images/2014102910543902.swf"; //
		var vars = {removeDiv:d };
		var params = {wmode:"transparent"};
		var attrs={};
		swfobject.embedSWF(path, "carEffect_"+d, '1148', '610', '10.1', 'js/expressInstall.swf', vars, params, attrs);
		
		$("#carEffect_"+d).css("position","absolute").css("left",length*20+"px").css("top",length*20+"px");
		
        setTimeout(function(){
        	$("#carEffect_"+d).remove();
        },8000); 
		
		
		var obj1 = {};
		obj1.uid = obj.uid;
		obj1.nick = obj.nick;
		obj1.number = obj.carnumber;
		obj1.cname = obj.carname;
		WEB_RC.car.addItemOrder(obj1);
		
    });
	
	/*webRC.on('showCar', function(obj) {
        console.log('showCar', obj);
		
		var d = new Date().getTime();
		var html ='<div id="carEffect_'+d+'" style="pointer-events:none; position: absolute; left: 20px; top: 20px;" class="effectflash" ></div>';
        $("#giftDiv").append(html);
		
		var path = "http://www.xiuktv.com/live/flash/demo.swf";//obj.url;//opencyou.imageurl+"/PubImgSour/m.swf"//"http://220.181.142.210/live/images/2014102910543902.swf"; //
		var vars = {imgurl:obj.url,num:obj.num,id:d };
		var params = {wmode:"transparent"};
		var attrs={};
		swfobject.embedSWF(path, "carEffect_"+d, '1100', '600', '10.1', 'js/expressInstall.swf', vars, params, attrs);
		
		$("#carEffect_"+d).css("position","absolute").css("left","0px").css("top","0px");
		
        setTimeout(function(){
			
        	$("#carEffect_"+d).remove();
        },18000); 
        
    });*/
	
    webRC.on('flower.send', function(obj) {
		//console.log("flower.send",obj);
        //Send flower response
        var createFlower = function(count) {
            count = typeof count == 'number' && count > 0 ? parseInt(count, 10) : 1;
            var html = '';
            for (var i = 0; i < count; i++) {
                html += '<img src="img/icon/flower.png" />';
            }
            return html;
        };
        var html = '';
        for (var i = 0, len = obj.users.length; i < len; i++) {
            html += '<div class="chatMsgItem"><div class="chatMsgFlower say_pri"><var u="'+obj.users[i].suid+'" class="say_pri">' + WEB_RC.tools.htmlChars(obj.users[i].sendernick) + '</var><span> gives </span><var class="say_pri" u="'+obj.ruid+'">' + WEB_RC.tools.htmlChars(obj.receivernick) +'</var>'+ createFlower(obj.users[i].number) + '</div></div>';
        }
		
        WEB_RC.msg.addCustomItem(html, true);
		
    });
	webRC.on('flower.send.result', function(obj) {
        rclog("flower.send.result",obj);
		//console.log("flower.send.result",obj);
		window.clearInterval(flowerRemainTimer);
       	elemFlowerTips.data('tips', false);
		elemFlowerTips.html('');
		
       	var result = obj.result;
		//rclog("--",result);
		if(result=="succeeded"){
			//rclog("成功",result);
		}else if(result=="cannot_send_to_yourself"){
			//rclog("不能送花给自己",result);
			elemFlowerTips.html('不能送花给自己');
			elemFlowerTips.data('tips', true);
		}else if(result=="cannot_send_to_nobody"){
			//rclog("麦序上没人,不能送花",result);
			elemFlowerTips.html('麦序上没人,不能送花');
			elemFlowerTips.data('tips', true);
		}else if(result=="wait_to_send"){
			//rclog("您還有秒才可以送",obj.remainSeconds);
			
			flowerRemainTime = obj.remainSeconds;
			elemFlowerTips.html('<font>' + flowerRemainTime + '</font>sec to get your next flower');
			elemFlowerTips.data('tips', true);
			/*
            flowerRemainTimer = window.setInterval(function() {
                flowerRemainTime--;
                elemFlowerTips.html('您還有<font>' + flowerRemainTime + '</font>秒才可以送花~');
                if (flowerRemainTime <= 0) {
                    window.clearInterval(flowerRemainTimer);
                    elemFlowerTips.data('tips', false);
                }
            }, 1000);*/
		}else if(result=="login_required"){
			//rclog("需要登陆",result);
			elemFlowerTips.html('You can obtain free gifts by login~');
			elemFlowerTips.data('tips', true);
		}else{
			//rclog("失败",result);
			elemFlowerTips.html('稍后再试');
			elemFlowerTips.data('tips', true);
		}
		
    });
	webRC.on('notice.msg', function(obj) {
        rclog('notice.msg', obj);
       
	   	elemFlashTips.html(obj.msg);
		//elemFlowerTips.data('tips', true);
		elemFlashTips.hide().fadeIn(500).delay(500).fadeOut(500);
        //WEB_RC.guard.alertDialog(obj.msg);
		
    });
	/* guard*/
	webRC.on('guard.login', function(obj) {
        rclog('guard.login', obj);
       
        WEB_RC.guard.alertDialog("Please login !");
		
    });
	webRC.on('guardButton.click', function(obj) {
        rclog('guardButton.click', obj);
       	
	   	if( !WEB_RC.conf.guest /*|| debug*/){
			WEB_RC.guard.guest = true;
			//判断是否已经是守护
			WEB_RC.guard.getGuardList();
			
		}else{
       	 	WEB_RC.guard.alertDialog("Please login !");
		}
    });
	webRC.on('applyToBuyGuard.response', function(obj) {
        rclog('applyToBuyGuard.response', obj);
       	////151没有主播ID，152不能申请自己的守护，148已经有一条没审核的申请暂时不能提交，149没有对应的价格信息，150秀币余额不足，无法购买守护

		var msgDict = {
            "148": "已经有一条没审核的申请暂时不能提交",
            "149": "没有对应的价格信息",
            "150": "Sorry，your balance is not enough.",
            "151": "没有主播ID",
            "152": "You can not be the Guardian yourself！",
            "153": "订单不存在活已审核通过"
        };
		//rclog(msgDict[obj.result]);
		
		//WEB_RC.guard.ktGuardSuccess(obj);
		//return false;
		
		if(obj.result == 150){
			WEB_RC.guard.chongGuard();
			
		}else if (obj.result && msgDict[obj.result]) {
            WEB_RC.guard.alertDialog(msgDict[obj.result]);
			
        } else if(obj.result == 0){
			
			if(WEB_RC.guard.isrenew){
				WEB_RC.guard.renewGuardSuccess(obj);
			}else{
           	 	WEB_RC.guard.ktGuardSuccess(obj);
			}
           	//关闭窗口
			WEB_RC.guard.closeGuard();
			
			//送车
			//window.guardActive();
        }
		
    });
	webRC.on('getAvailableToBuyGuardInfo.response', function(obj) {
        rclog('getAvailableToBuyGuardInfo.response', obj);
       
        WEB_RC.guard.clickGuard(obj,2);
		
    });
	webRC.on('getGuardList.response', function(obj) {
        rclog('getGuardList.response', obj);
        
		if( /*!WEB_RC.conf.guest &&*/ WEB_RC.guard.guest){
			WEB_RC.guard.checkGuard(obj);
			WEB_RC.guard.guest = false;
		}
        
    });
	
	//开通守护广播
	webRC.on('guardBuySuccessBroadcast', function(obj) {
		
        rclog('guardBuySuccessBroadcast', obj);
		
		var uid = obj.uid;
		var nick = obj.nick ;
		var Max = 500;
		var Min = 200;
			var Range = Max - Min;
			var Rand = Math.random();
			var top = Min + Math.round(Rand * Range); 

			var div='<MARQUEE  id="GBC_'+uid+'" style="top:'+top+'px; z-index:99; pointer-events:none; " scrollAmount="6" scrollDelay="1" direction="left" width="100%" align="center" loop="1" slide="1" class="marqueestyledarea">Congratulations! "'+nick+'" has become the Guardian, Thanks for your support!</MARQUEE>';
			//<!--onmouseover="this.stop()" onmouseout="this.start()"-->
			//rclog(div);
			$("#tv_content").append(div);
			
			//移除
			setTimeout(function(){
				$("#GBC_"+uid).remove();
				
			},20000);
        
    });
	
	webRC.on('guradUser.enterChannel', function(obj) {
		//void onFlashData( {"cmd":"guradUser.enterChannel", "list":[{"guardUid":gurdUid, "guardNick":guardNick, "guardLevel":gardLevel}, ...] } );
        rclog('guradUser.enterChannel', obj);
		var list = obj.list;
		for(var i in list){
			
			var Max = 500;
			var Min = 200;
			var Range = Max - Min;   
			var Rand = Math.random();   
			var top = Min + Math.round(Rand * Range); 

			var div='<MARQUEE  id="marquee_'+list[i].gurdUid+'" style=" top:'+top+'px; z-index:99; pointer-events:none; " scrollAmount="6" scrollDelay="1" direction="left" width="100%" align="center" loop="1" slide="1"  class="marqueestyledarea">Welcome Guardian "'+list[i].guardNick+'" to this room !</MARQUEE>';
			//onmouseover="this.stop()" onmouseout="this.start()"
			$("#tv_content").append(div);
			
			//移除
			setTimeout(function(){
				$("#marquee_"+list[i].gurdUid).remove();
				
			},20000);
			
		}
		
    });


	webRC.on('showSwf', function(obj) {
        rclog('showSwf', obj);
				 
		var d=obj.data;
		var data=utf8to16(base64decode(d));
		
		//{"num":1,"price":5000,"receiver_nick":"shmilydd","receiver_uid":853,"sender_nick":"❥゛岁月静好❥゛","gift_name":"Ferris wheel","sender_uid":9} 
		var obj1 = JSON.parse(data);
		
		//var left =  Math.round(Math.random() * 50); 
		var length = $("#effectDiv").find("object").length;
		if(length>10){length=0;}
		var d = new Date().getTime();
		var html ='<div id="flashEffect_'+d+'" style="pointer-events:none; position: absolute; left: 20px; top: 20px;" class="effectflash" ></div>';
        $("#effectDiv").append(html);
		
		var type= obj1.type;
		var width=800;
		var height=400;
		var t=5000;
		var left=0;
		if(type==12 || type==13){
			width=350; 
			height=350;
			left=130;
			t=5000;
		}else if( type==14 ){
			t=15000;
		}else if( type==15){
			t=25000;
		}else if( type==16){
			t=22000;
		}
		var reciever = obj1.receiver_nick;
		var sender =  obj1.sender_nick;
		var path = obj.url;//opencyou.imageurl+"/PubImgSour/m.swf"//"http://220.181.142.210/live/images/2014102910543902.swf"; //
		var vars = {removeDiv:d };//zhuBoName:reciever,senderName:sender,
		var params = {wmode:"transparent"};
		var attrs={};
		swfobject.embedSWF(path, "flashEffect_"+d, width, height, '10.1', 'js/expressInstall.swf', vars, params, attrs);
		
		$("#flashEffect_"+d).css("position","absolute").css("left",left+200+length*20+"px").css("top",200+length*20+"px");
		
        setTimeout(function(){
			
        	$("#flashEffect_"+d).remove();
        },t); 
        
    });
	
	webRC.on('showGift', function(obj) {
        rclog('showGift', obj);
		//{"num":100,url":"http://www.xiuktv.com/live/images/2014101815102701.png",time:10} 
		
		var d = new Date().getTime();
		var html ='<div id="giftEffect_'+d+'" style="pointer-events:none; position: absolute; left: 20px; top: 20px;" class="effectflash" ></div>';
        $("#giftDiv").append(html);
		
		var time = 12;
		if(obj.time!=null && obj.time!=''){
			time=obj.time;
		}
		var length = $("#giftDiv").find("object").length;
		if(length>10){length=0;}
		var path = opencyou.url+"/live/flash/demo.swf";//obj.url;//opencyou.imageurl+"/PubImgSour/m.swf"//"http://220.181.142.210/live/images/2014102910543902.swf"; //
		var vars = {imgurl:obj.url,num:obj.num,id:d };
		var params = {wmode:"transparent"};
		var attrs={};
		swfobject.embedSWF(path, "giftEffect_"+d, '1300', '670', '10.1', 'js/expressInstall.swf', vars, params, attrs);
		
		$("#giftEffect_"+d).css("position","absolute").css("left",length*20+"px").css("top",length*20+"px");
		
        setTimeout(function(){
			
        	$("#giftEffect_"+d).remove();
        },time*1000); 
        
    });
	
	////房间内成员的守护更新通告
	webRC.on('guardUsers.update', function(obj) {
        rclog('guardUsers.update', obj);
        
        WEB_RC.user.updateGuardUsers(obj);
    });
	
	//房间内成员的vip更新通告
	webRC.on('vipUsers.update', function(obj) {
        rclog('vipUsers.update', obj);
        
		WEB_RC.user.updateVipUsers(obj);
    });
	
	webRC.on('common.giftNews', function(obj) {
        rclog('common.giftNews', obj);
		//{"cmd":"common.giftNews","data":{"receiverNick":"freedom","num":999,"sender":19460148,"senderNick":"apple","sid":100836,"type":12,"id":196,"receiver":19460144,"gift_name":"Music Note","richManTitle":"3富","resource":"2014101815102702.png","vip":0,"icon":"2014101815102701.png","richManLevel":3,"ts":1420297671,"richManStart":0}} 
		
	//webRC.fire( 'common.giftNews',{"cmd":"common.giftNews", data:[{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:1},{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:0},{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:0}]} );
		var data = obj.data;
		if(data){
			//$("#Scroller_static").html("");
			//for (var i = 0, len = data.length; i < len; i++) {
				obj = data;
				var d = new Date().getTime();
				var time ="";
				if(obj.ts!='' && obj.ts != 'undefined'){
					time = Date.prototype.TimeStamp2DateTime(obj.ts);
				}
				
				/*变速跑马灯*/	
				var div='<div id="animate_'+d+'" class="broadcast" sid="'+obj.sid+'" n="'+obj.receiverNick +'">'
							+'<span>'+ Date.prototype.TimeStamp2DateTime(obj.ts) +' &nbsp; </span><span class="colorfef9b0">'+ obj.senderNick 
							+'</span><span> &nbsp; gave &nbsp; </span><span class="colorfef9b0">'+obj.receiverNick+'</span><span> &nbsp; </span>'
							+'<img class="giftimg" src="'+opencyou.url+'/live/images/'+ obj.icon +'" width="25px" height="25px" border="0"/> '
							+'<span>X</span><b>'+ obj.num +'&nbsp;</b><span> in Room'+obj.sid+' !</span></div>';
					
					WebScroll.gift.clearIntervals();
					//$("#Scroller").html("");
					$("#Scroller").append(div);
					
					WebScroll.gift.initScroll("Scroller", "animate_"+d);
					
					
				/*
				}else{
					var div='<div id="animate_'+d+'" class="animate" sid="'+obj.sid+'" >'
							+'<span>'+ Date.prototype.TimeStamp2DateTime(obj.ts) +' &nbsp; </span><span class="colorfef9b0">'+ obj.senderNick 
							+'</span><span> &nbsp; gave &nbsp; </span><span class="colorfef9b0">'+obj.receiverNick+'</span><span> &nbsp; </span>'
							+'<img class="giftimg" src="http://www.showoo.cc/live/images/'+ obj.icon +'" width="25px" height="25px" border="0"/> '
							+'<span>X</span><b>'+ obj.num +'&nbsp;</b><span> in Room'+obj.sid+' !</span></div>';
							
					$("#Scroller_static").append(div);
				}
				*/
					//点击跑马灯事件
				$("#animate_"+d).click(function(){
					var sid = $(this).attr("sid");
					var channel = opencyou.utils.getParamFromUrl("s");
					if(sid==channel){ return ;}	//本直播室不提示
					var div_dialog="<div class='defaultDialog'><div class='login_close'><img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div><p class=' tc mt10 fts20'>确定离开本直播室，进入<font color='#ea821c'>"+obj.receiverNick+"</font>的直播室吗？ &nbsp; </p><div class=' tc mt30'>"
							
							+"<a class='close_tag btn_red bc ' href='javascript:window.location.href=\""+opencyou.url+"/live/t.html?s="+sid+"\"' titel='Confirm'> Confirm </a>"
							+"<a class='close_tag btn_grey bc ml30' href='javascript:;' titel='Cancel'> Cancel </a>"
							+"</div>  </div>";
					scroll(0,0);
					$.popbox(div_dialog);
						
						// 弹窗关闭按钮
					$(".close_tag").click( function() {
						$("#zxxBlank").remove();
						$(this).parents(".wrap_out").remove();
					});
						
				});
		}
		
    });
	
	webRC.on('common.giftNews3', function(obj) {
        rclog('common.giftNews', obj);
		
	//webRC.fire( 'common.giftNews',{"cmd":"common.giftNews", data:[{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:1},{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:0},{ts:1420007930,sid:100084,senderNick:'aaa',receiverNick:'bbb',icon:'12342.png',num:10,loop:0}]} );
		var data = obj.data;
		if(data){
			$("#Scroller_static").html("");
			for (var i = 0, len = data.length; i < len; i++) {
				obj = data[i];
				var d = new Date().getTime();
				var time ="";
				if(obj.ts!='' && obj.ts != 'undefined'){
					time = Date.prototype.TimeStamp2DateTime(obj.ts);
				}
				
				if(obj.loop==1){
					/*变速跑马灯*/	
					var div='<div id="animate_'+d+'" class="broadcast" sid="'+obj.sid+'" >'
							+'<span>'+ Date.prototype.TimeStamp2DateTime(obj.ts) +' &nbsp; </span><span class="colorfef9b0">'+ obj.senderNick 
							+'</span><span> &nbsp; gave &nbsp; </span><span class="colorfef9b0">'+obj.receiverNick+'</span><span> &nbsp; </span>'
							+'<img class="giftimg" src="http://www.showoo.cc/live/images/'+ obj.icon +'" width="25px" height="25px" border="0"/> '
							+'<span>X</span><b>'+ obj.num +'&nbsp;</b><span> in Room'+obj.sid+' !</span></div>';
					
					WebScroll.gift.clearIntervals();
					//$("#Scroller").html("");
					$("#Scroller").append(div);
					
					WebScroll.gift.initScroll("Scroller", "animate_"+d);
					
		
				}else{
					var div='<div id="animate_'+d+'" class="animate" sid="'+obj.sid+'" >'
							+'<span>'+ Date.prototype.TimeStamp2DateTime(obj.ts) +' &nbsp; </span><span class="colorfef9b0">'+ obj.senderNick 
							+'</span><span> &nbsp; gave &nbsp; </span><span class="colorfef9b0">'+obj.receiverNick+'</span><span> &nbsp; </span>'
							+'<img class="giftimg" src="http://www.showoo.cc/live/images/'+ obj.icon +'" width="25px" height="25px" border="0"/> '
							+'<span>X</span><b>'+ obj.num +'&nbsp;</b><span> in Room'+obj.sid+' !</span></div>';
							
					$("#Scroller_static").append(div);
				}
				
					//点击跑马灯事件
					$("#animate_"+d).click(function(){
						var sid = $(this).attr("sid");
						
						var div_dialog="<div class='defaultDialog'><div class='login_close'><img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div><p class=' tc mt10 fts20'>确定离开本直播室，进入<font color='#ea821c'>"+obj.receiverNick+"</font>的直播室吗？ &nbsp; </p><div class=' tc mt30'>"
							
							+"<a class='close_tag btn_red bc ' href='javascript:window.location.href=\""+opencyou.url+"/live/t.html?s="+sid+"\"' titel='Confirm'> Confirm </a>"
							+"<a class='close_tag btn_grey bc ml30' href='javascript:;' titel='Cancel'> Cancel </a>"
							+"</div>  </div>";
						scroll(0,0);
						$.popbox(div_dialog);
						
						// 弹窗关闭按钮
						$(".close_tag").click( function() {
							$("#zxxBlank").remove();
							$(this).parents(".wrap_out").remove();
						});
						
					});
			}
		}
			
		
		
    });
	
	
	/*
    webRC.on('sns.invite', function(obj) {
        $('<div/>').overlay({
            target: '#widget-invite',
            load: true,
            closeOnClick: false,
            mask: {
                color: '#000',
                opacity: 0.5
            }
        });
        rcInviteInit();
    });
    webRC.on('sns.share', function(obj) {
        $('#widget-flash').toggle();
    });
	
    webRC.on('guard.result', function(obj) {
        rclog('guard.result', obj);
        var msgDict = {
            "148": "已經有一條沒審核的申請，暫時不能提交",
            "149": "沒有對應的價格信息",
            "150": "秀幣餘額不足，無法購買守護",
            "151": "沒有主播id",
            "152": "不能申請自己的守護",
            "153": "訂單不存在或已審核通過"
        };
        if (obj.result && msgDict[obj.result]) {
            alert(msgDict[obj.result]);
        } else {
            alert('您成功開通守護');
            $('a.guard-close').trigger('click');
        }
    });
    */
    //start setup flash
    webRC.setup('flashBox');
	webRC.initGift('giftflash');
	
	//flash callback
	window.onFlashData = function(data){
		rclog("onFlashData",data);
		var obj = JSON.parse(data);
		if(obj){
			var command = obj.cmd ;
			webRC.fire(command, obj);
		}
	};
	window.removeDiv = function(data){
		var div = $("#flashEffect_"+data);
		if(div.length>0){
			div.remove();
		}
	};
	
	window.rcInit = function(){
       /* var elemFlower = WEB_RC.form.elemFlower;
        var elemTips = WEB_RC.form.elemFlowerTips;
        var txtGet = 'You can obtain free gifts by login~';
		*/
		var url = opencyou.url + "/account/member/gettoken";
		var channel = opencyou.utils.getParamFromUrl("s");
		$.ajax({
				type : "post",
				url : url,
				data : {cid:channel},
				dataType : "json",
				success : function(data) {
					
					if (data != null && data.user_success == true) {
						//opencyou.cookies.create('_open_uuid',"0",3);
					}else {
						opencyou.cookies.create('_open_uuid',"0",3);
						//opencyou.cookies.remove("_open_uuid");
						opencyou.cookies.remove("_open_saccount");
						opencyou.cookies.remove("_open_stoken");
					}
					webRC.ready();
				}
			});
			
		loadAnchor();
		loadFollow();
		WEB_RC.car.initCarList();
		/*定时更新
		window.setInterval(function(){
			//ielog("================================",anchor_id);
			var uid = opencyou.cookies.read('_open_uuid');
			var url2 = "http://capi.showoo.cc/msg/getNotice";
			$.ajax({
				type : "get",
				url : url2,
				data : {
					uid : uid
				},
				dataType : "jsonp",
				jsonp: "callback",
				success : function(data) {
					
					if( data.retCode == 1){
						
						for(var i in data.data){
							if(data.data[i].event=='anchorInfoUpdate' && data.data[i].anchorId == anchor_id ){
								loadAnchor();
							}else if(data.data[i].event == 'focusListUpdate'){
								loadRecord(data.data[i].body);
							}
						}
						
					}
				}
			});
		},15000);
		*/
		window.setInterval(function(){
			
			var uid = opencyou.cookies.read('_open_uuid');
			$.ajax({
				type : "get",
				url : opencyou.url+"/business/channel/update",
				data : {
					sid : channel,
					userid:uid
				},
				dataType : "json",
				//jsonp: "callback",
				success : function(data) {
					rclog("upload channel uinfo:",data.success);
				}
			});
		},60000);
	}
	
	window.loadRecord = function(obj){
		
		obj = JSON.parse(obj);
		var div="";
			
					if(obj=='[]' || obj.length==0){
						div+="<div class='option m10 line18 fts12 color999'> You haven't followed anyone yet！ </div>";
					}else{
						for(var i in obj){
							var sid= obj[i].sid;
							var uid= obj[i].uid;
							var pep= obj[i].follow;
							var type= obj[i].type;
							var name=obj[i] .name;//a.sid,a. uid ,a.start_time ,num , a.type ,b.name
							
							var page = "t";//type==0? "v":"g";
							div+="<li class='option'> <div class='on_list_li option'>"
										+"<img class='icon_head radius5 option' id='sidImg'  src='"+opencyou.url+"/PubImgSour/"+uid+".png"+"' onerror=\"this.src='../imgs/icon.png'\"  width='40' height='40' border='0' /> "
										+"<a href='"+opencyou.url+"/live/"+page+".html?s="+sid+"' class='option'>"+name+"</a>";
							if(pep=='notlive'){
								div+="<span class='option'> 未开播</span></div></li>";
							}else{
								div+="<span class='option'>Popularity："+pep+"</span></div></li>";	
							}
							
						}
					}
					$("#record_list").html(div);
					
					$(".login_record *").mouseover(function(event) {
						$("#on_login_list").show();
						$(".login_record").css('background','#666666');
					});
					$(document).mouseover(function(event) {
						if (!$(event.target).hasClass("option")  ) {
							$("#on_login_list").hide();
							$(".login_record").css('background','none');
						}
					});
		
		
	}
	window.loadAnchor = function(){
		//主播资料
		var channel = opencyou.utils.getParamFromUrl("s");
		var url1 = opencyou.url + "/account/member/getAnchorInfo";
		
		$.ajax({
				type : "post",
				url : url1,
				data : {sid:channel},
				dataType : "json",
				success : function(data) {
				
					if (data != null && data.user_success == true) {
						rclog(data);
						
						var u = data.userInfo;
						window.anchor_id = u.uid;
						
						var puimg=document.getElementById("channel_header");
						if( puimg!= null){
							puimg.src=opencyou.url+"/PubImgSour/"+u.uid+".png";
						}
						var name='';
						if(data.vip>0){
							name+='<img class="fl rank_vip" src="../imgs/icon_vip.png" width="16" height="15" border="0"> ';
						}
						name+=u.nick;
						
						$("#channel_name").html(name);
						$("#channel_id").html(channel);
						
						$("#followNum").html(data.followme+'人关注');
						
						//opencyou.account.showPhotoGallery();
						
					}else {
					}
				}
			});
		
	};
	window.loadFollow = function(){ 
		var url = opencyou.url + "/account/member/recordlist";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					
					if(data.list.length>0){
						for(var i in data.list){
							var sid= data.list[i][0];
							var uid= data.list[i][1];
							
							var channel = opencyou.utils.getParamFromUrl("s");
							if(uid == window.anchor_id || channel == sid){
								
								$("#channelFollow").addClass("ing");
								$("#channelFollow").html("following");
								
							}
						}
					}
				}
			}
		});
	};
	window.guardActive = function(){
		var url= opencyou.url + "/business/car/carlist";
			$.ajax({
				type : "get",
				url : url,
				data : {type:5},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success == true) {
						if(data.list.length>0){
							window.sendCar();
						}
					}
				}
			});
		
	}
	window.sendCar = function(){
		var channel = opencyou.utils.getParamFromUrl("s");
		var url = opencyou.url + "/account/info/guardactive";
		
		$.ajax({
				type : "post",
				url : url,
				data : {channel:channel},
				dataType : "json",
				success : function(data) {
					
					if (data != null && data.user_success == true) {
						var car = data.car;
						var div_dialog='<div class="carDialog" ><div class="carContent"><div class="car_close"><img src="'+ opencyou.url
							+'/imgs/close_16x16.png" align="right" class="close_tag" style="cursor: pointer"></div>'
							+'<div class="carBg"><div class="car_title"></div><p class=" fts18">Has been cool car '+car.name+'!</p> '
                    		+'<img src="'+opencyou.url+car.image+'" width="450" class=" mt20"/></div>'
                    
							+'<p class=" mt10 fts14">Effective date: <i class=" colorred1">'+Date.prototype.TimeStamp2Date(data.etime)+'</i></p> '
							+'<p class=" mt10 fts14">Please go to the <a href="'+opencyou.url+'/center/userCar.html" target="_blank" '
								+'class=" color36b">my account - my car</a> in the query.</p> ';
							
							if(data.carnumber==null || data.carnumber==''){
								div_dialog+='<div class=" tc mt30"> <a class="close_tag btn_red bc fts12" href="javascript:rcmall.car.chooseCarBarn(3);" titel="Confirm"> 选则车牌 </a></div>';
							}
							
						    div_dialog+='</div></div>';
							
							scroll(0,0);
							$.popbox(div_dialog);
							
							// 弹窗关闭按钮
							$(".close_tag").click( function() {
								$("#zxxBlank").remove();
								$(this).parents(".wrap_out").remove();
							});
							
					}else {
						
					}
				}
			});
	}
	
});
