$(document).ready(function() {
	//去url双斜杠问题
	var url = window.location.href;
	{	
		var h_url=url.substring(0,7);
		var f_url=url.substring(7);
		var mp=f_url.indexOf('//');
		if(mp!=-1){
			while(mp!=-1){
				f_url=f_url.replace("//", "/");
				mp=f_url.indexOf('//',7);
			}
			url=h_url+f_url;
			window.location.href=url;
		}
		
	}
	
	opencyou.init();
	//language.init();
	var d = new Date();

	
});

//“说说状态”弹出的输入框 js
(function(o,v){var g=o.document,q=g.documentElement,J=function(){var p=g.body,w=!-[1,],r=w&&/msie 6/.test(navigator.userAgent.toLowerCase()),I=1,y="cache"+(+new Date+"").slice(-8),u={},d=function(){};d.prototype={getOptions:function(a){var b,c={},e={container:null,overlay:true,drag:true,fixed:true,follow:null,followX:0,followY:0,autoClose:0,lock:false,callback:null};for(b in e)c[b]=a[b]!==v?a[b]:e[b];d.data("options",c);return c},setBodyBg:function(){if(p.currentStyle.backgroundAttachment!=="fixed"){p.style.backgroundImage=
    "url(about:blank)";p.style.backgroundAttachment="fixed"}},appendIframe:function(a){a.innerHTML='<iframe style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;border:0 none;filter:alpha(opacity=0)"></iframe>'},setFollow:function(a,b,c,e){b=typeof b==="string"?g.getElementById(b):b;a=a.style;a.position="absolute";a.left=d.getOffset(b,"left")+c+"px";a.top=d.getOffset(b,"top")+e+"px"},setPosition:function(a,b){var c=a.style;c.position=r?"absolute":b?"fixed":"absolute";if(b){if(r)c.setExpression("top",
    'fuckIE6=document.documentElement.scrollTop+document.documentElement.clientHeight/2+"px"');else c.top="50%";c.left="50%"}else{r&&c.removeExpression("top");c.top=q.clientHeight/2+d.getScroll("top")+"px";c.left=q.clientWidth/2+d.getScroll("left")+"px"}},createOverlay:function(){var a=g.createElement("div"),b=a.style;b.cssText="margin:0;padding:0;border:none;width:100%;height:100%;background:#333;opacity:0.6;filter:alpha(opacity=60);z-index:9999;position:fixed;top:0;left:0;";if(r){p.style.height="100%";
    b.position="absolute";b.setExpression("top",'fuckIE6=document.documentElement.scrollTop+"px"')}a.id="overlay";return a},createDialogBox:function(){var a=g.createElement("div");a.style.cssText="margin:0;padding:0;border:none;z-index:10000;";a.id="easyDialogBox";return a},createDialogWrap:
    function(a)
    {
        var b=typeof a.yesFn==="function"?'<button class="btn_highlight" id="easyDialogYesBtn">'+(typeof a.yesText==="string"?a.yesText:"send")+"</button>":"",c=typeof a.noFn==="function"||a.noFn===false?
    '<button class="btn_normal" id="easyDialogNoBtn">'+(typeof a.noText==="string"?a.noText:"\u53d6\u6d88")+"</button>":"";
        a=['<div class="easyDialog_content">',a.header?'<h4 class="easyDialog_title" id="easyDialogTitle"><a href="javascript:void(0)" title="\u5173\u95ed\u7a97\u53e3" class="close_btn" id="closeBtn">&times;</a>'+a.header+"</h4>":"",'<textarea id="easyDialog_text" class="easyDialog_text">'+a.content+"</textarea>",b===""&&c===""?"":'<div class="easyDialog_footer">'+c+b+"</div>","</div>"].join("");b=g.getElementById("easyDialogWrapper");
    if(!b){b=g.createElement("div");b.id="easyDialogWrapper";b.className="easyDialog_wrapper"}b.innerHTML=a.replace(/<[\/]*script[\s\S]*?>/ig,"");return b}};d.data=function(a,b,c){if(typeof a==="string"){if(b!==v)u[a]=b;return u[a]}else if(typeof a==="object"){a=a===o?0:a.nodeType===9?1:a[y]?a[y]:a[y]=++I;a=u[a]?u[a]:u[a]={};if(c!==v)a[b]=c;return a[b]}};d.removeData=function(a,b){if(typeof a==="string")delete u[a];else if(typeof a==="object"){var c=a===o?0:a.nodeType===9?1:a[y];if(c!==v){var e=function(m){for(var n in m)return false;
    return true},f=function(){delete u[c];if(!(c<=1))try{delete a[y]}catch(m){a.removeAttribute(y)}};if(b){delete u[c][b];e(u[c])&&f()}else f()}}};d.event={bind:function(a,b,c){var e=d.data(a,"e"+b)||d.data(a,"e"+b,[]);e.push(c);if(e.length===1){c=this.eventHandler(a);d.data(a,b+"Handler",c);if(a.addEventListener)a.addEventListener(b,c,false);else a.attachEvent&&a.attachEvent("on"+b,c)}},unbind:function(a,b,c){var e=d.data(a,"e"+b);if(e){if(c)for(var f=e.length-1,m=e[f];f>=0;f--)m===c&&e.splice(f,1);
else e=v;if(!e||!e.length){c=d.data(a,b+"Handler");if(a.addEventListener)a.removeEventListener(b,c,false);else a.attachEvent&&a.detachEvent("on"+b,c);d.removeData(a,b+"Handler");d.removeData(a,"e"+b)}}},eventHandler:function(a){return function(b){b=d.event.fixEvent(b||o.event);for(var c=d.data(a,"e"+b.type),e=0,f;f=c[e++];)if(f.call(a,b)===false){b.preventDefault();b.stopPropagation()}}},fixEvent:function(a){if(a.target)return a;var b={},c;b.target=a.srcElement||document;b.preventDefault=function(){a.returnValue=
    false};b.stopPropagation=function(){a.cancelBubble=true};for(c in a)b[c]=a[c];return b}};d.capitalize=function(a){var b=a.charAt(0);return b.toUpperCase()+a.replace(b,"")};d.getScroll=function(a){a=this.capitalize(a);return q["scroll"+a]||p["scroll"+a]};d.getOffset=function(a,b){var c=this.capitalize(b);c=q["client"+c]||p["client"+c]||0;var e=this.getScroll(b),f=a.getBoundingClientRect();return Math.round(f[b])+e-c};d.drag=function(a,b){var c="getSelection"in o?function(){o.getSelection().removeAllRanges()}:
    function(){try{g.selection.empty()}catch(i){}},e=this,f=e.event,m=false,n=w?a:g,h=b.style.position==="fixed",j=d.data("options").fixed;f.bind(a,"mousedown",function(i){m=true;var k=e.getScroll("top"),s=e.getScroll("left"),z=h?0:s,B=h?0:k;d.data("dragData",{x:i.clientX-e.getOffset(b,"left")+(h?s:0),y:i.clientY-e.getOffset(b,"top")+(h?k:0),el:z,et:B,er:z+q.clientWidth-b.offsetWidth,eb:B+q.clientHeight-b.offsetHeight});if(w){r&&j&&b.style.removeExpression("top");a.setCapture()}f.bind(n,"mousemove",l);
    f.bind(n,"mouseup",t);w&&f.bind(a,"losecapture",t);i.stopPropagation();i.preventDefault()});var l=function(i){if(m){c();var k=d.data("dragData"),s=i.clientX-k.x,z=i.clientY-k.y,B=k.et,E=k.er,F=k.eb;k=k.el;var C=b.style;C.marginLeft=C.marginTop="0px";C.left=(s<=k?k:s>=E?E:s)+"px";C.top=(z<=B?B:z>=F?F:z)+"px";i.stopPropagation()}},t=function(i){m=false;w&&f.unbind(a,"losecapture",arguments.callee);f.unbind(n,"mousemove",l);f.unbind(n,"mouseup",arguments.callee);if(w){a.releaseCapture();if(r&&j){var k=
    parseInt(b.style.top)-e.getScroll("top");b.style.setExpression("top","fuckIE6=document.documentElement.scrollTop+"+k+'+"px"')}}i.stopPropagation()}};var x,G=function(a){a.keyCode===27&&D.close()},D={open:function(a){var b=new d,c=b.getOptions(a||{});a=d.event;var e=q.clientWidth,f=q.clientHeight,m=this,n,h,j,l;if(x){clearTimeout(x);x=v}if(c.overlay){n=g.getElementById("overlay");if(!n){n=b.createOverlay();p.appendChild(n);r&&b.appendIframe(n)}n.style.display="block"}r&&b.setBodyBg();h=g.getElementById("easyDialogBox");
    if(!h){h=b.createDialogBox();p.appendChild(h)}if(c.follow){l=function(){b.setFollow(h,c.follow,c.followX,c.followY)};l();a.bind(o,"resize",l);d.data("follow",l);if(n)n.style.display="none";c.fixed=false}else b.setPosition(h,c.fixed);h.style.display="block";j=typeof c.container==="string"?g.getElementById(c.container):b.createDialogWrap(c.container);if(l=h.getElementsByTagName("*")[0]){if(l&&j!==l){l.style.display="none";p.appendChild(l);h.appendChild(j)}}else h.appendChild(j);j.style.display="block";
    var t=j.offsetWidth,i=j.offsetHeight;l=t>e;var k=i>f;j.style.marginTop=j.style.marginRight=j.style.marginBottom=j.style.marginLeft="0px";if(c.follow)h.style.marginLeft=h.style.marginTop="0px";else{h.style.marginLeft="-"+(l?e/2:t/2)+"px";h.style.marginTop="-"+(k?f/2:i/2)+"px"}if(r&&!c.overlay){h.style.width=t+"px";h.style.height=i+"px"}e=g.getElementById("closeBtn");f=g.getElementById("easyDialogTitle");j=g.getElementById("easyDialogYesBtn");t=g.getElementById("easyDialogNoBtn");j&&a.bind(j,"click",
        function(s){c.container.yesFn.call(m,s)!==false&&m.close()});if(t){i=function(s){if(c.container.noFn===true||c.container.noFn.call(m,s)!==false)m.close()};a.bind(t,"click",i);e&&a.bind(e,"click",i)}else e&&a.bind(e,"click",m.close);c.lock||a.bind(g,"keyup",G);if(c.autoClose&&typeof c.autoClose==="number")x=setTimeout(m.close,c.autoClose);if(c.drag&&f&&!l&&!k){f.style.cursor="move";d.drag(f,h)}if(!c.follow&&!c.fixed){i=function(){b.setPosition(h,false)};!l&&!k&&a.bind(o,"resize",i);d.data("resize",
        i)}d.data("dialogElements",{overlay:n,dialogBox:h,closeBtn:e,dialogTitle:f,dialogYesBtn:j,dialogNoBtn:t})},close:function(){var a=d.data("options"),b=d.data("dialogElements"),c=d.event;if(x){clearTimeout(x);x=v}if(a.overlay&&b.overlay)b.overlay.style.display="none";b.dialogBox.style.display="none";r&&b.dialogBox.style.removeExpression("top");b.closeBtn&&c.unbind(b.closeBtn,"click");b.dialogTitle&&c.unbind(b.dialogTitle,"mousedown");b.dialogYesBtn&&c.unbind(b.dialogYesBtn,"click");b.dialogNoBtn&&c.unbind(b.dialogNoBtn,
    "click");if(!a.follow&&!a.fixed){c.unbind(o,"resize",d.data("resize"));d.removeData("resize")}if(a.follow){c.unbind(o,"resize",d.data("follow"));d.removeData("follow")}a.lock||c.unbind(g,"keyup",G);typeof a.callback==="function"&&a.callback.call(D);d.removeData("options");d.removeData("dialogElements")}};return D},A=function(){o.easyDialog=J()},H=function(){if(!g.body){try{q.doScroll("left")}catch(p){setTimeout(H,1);return}A()}};(function(){if(g.body)A();else if(g.addEventListener){g.addEventListener("DOMContentLoaded",
    function(){g.removeEventListener("DOMContentLoaded",arguments.callee,false);A()},false);o.addEventListener("load",A,false)}else if(g.attachEvent){g.attachEvent("onreadystatechange",function(){if(g.readyState==="complete"){g.detachEvent("onreadystatechange",arguments.callee);A()}});o.attachEvent("onload",A);var p=false;try{p=o.frameElement==null}catch(w){}q.doScroll&&p&&H()}})()})(window,undefined);

/**
 * open全局名称空间对象,全局参数
 */
var opencyou = {
		space:'open',
		url : '',
		imageurl : 'http://www.showoo.cc',
		init : function() {
			var url = window.location.href;
			
			var pos=url.indexOf('/'+this.space,7);
			if(pos>0){
				url=url.substring(0,pos+5);
			}else{
				pos=url.indexOf('/',7);
				if(pos>0){
					url=url.substring(0,pos);
				}
			}
			opencyou.url=url;
			imageurl = url;
			
			opencyou.topnav.writeTopmenu();
			opencyou.topnav.writeBottom();
			
			$(window).keydown(function(event) {
				opencyou.keyboard.keydownCallback(event.keyCode);
			});
			opencyou.account.checkLogin();
			
		}
};

/**
 * 账号相关功能对象
 */
opencyou.account = {
	
	openPro : function(divId) {// 打开divid
		$('#' + divId).show();
	},
	closePro : function(divId) {// 关闭divid
		$('#' + divId).hide();
	},
	commonAlert:function(msg){
			var div_dialog="<div class='commonDialog'><div class='common_close'>"
					+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
					+"<p class=' mt30 tc fts14 '>" + msg + "</p> "
					+"<div class=' bc mt30 tc'><a class='close_tag btn_red' href='javascript:;' titel='Confirm'> Confirm </a> </div> "
					+"</div>";
				$.popbox(div_dialog);
				
				// 弹窗关闭按钮
				$(".close_tag").click( function() {
					$("#zxxBlank").remove();
					$(this).parents(".wrap_out").remove();
				});
	},
	userLogin : function(tourl) {
		$("#tip_form").html("");
		var name = $("#user_name").val();
		var pwd = $("#user_pwd").val();
		var token = opencyou.cookies.read('_open_pwd');
		//var bind_fb= $("#fb_bind").val();
		
		var user_remember=0;
		
		opencyou.cookies.create('_user_name',name,7*24*60);//一周
		if(remember.checked){
			user_remember=1;
			opencyou.cookies.create('_user_pwd',"******",2*24*60);
		}else{
			opencyou.cookies.remove("_user_pwd");
		}
		
		var url = opencyou.url + "/account/member/login";
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : name,
				pwd : pwd,
				remember:user_remember,
				token:token
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					
					var backurl = opencyou.utils.getParamFromUrl("backurl");
					
					if(backurl==''){
						window.open(opencyou.url + "/index.html" ,"_self");
						//window.open(opencyou.url + "/center/userCenterInfo.html" ,"_self");
					}else{
						var href = window.location.href;
						
						backurl = href.substring(href.indexOf("backurl")+8);
						backurl = decodeURIComponent(backurl);
						//alert(backurl);
						window.open(backurl ,"_self");
					}
					
				} else {
					if(data.error_code==-2){
						opencyou.registerInput.showTip("user_name","The account is not exist!");
						//$("#tip_form").html("The account is not exist!");
					}else if(data.error_code==-3){
						$("#tip_form").html("Wrong Password!");
					}else if(data.error_code==-4){
						$("#tip_form").html("The account or password error!");
					}else{
						$("#tip_form").html("Login Failed!");
					}
				}
			}
		});
	},
	userLogout : function() {
		var url = opencyou.url + "/account/user/logout";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == false) {
					opencyou.cookies.remove("_open_sname");
					opencyou.cookies.remove("_open_uuid");
					opencyou.cookies.remove("_open_vip");
					opencyou.cookies.remove("_open_t");
					opencyou.account.closePro('login_on');
					opencyou.account.openPro('login');
					opencyou.account.openPro('regster');
					//var uri = window.location.href;
					//if (uri.indexOf('/center/') > 0) {
					//	window.location.href = opencyou.url+"/login.html";
						//window.location.reload();
					//}
					
				}
				//window.location.reload();
				//parent.location.href = opencyou.url+"/login.html";
				
				var href= encodeURIComponent(window.location.href);
				window.location.href=opencyou.url+"/login.html?backurl="+href;
				
			}
		});
		opencyou.cookies.remove("_open_sname");
		opencyou.cookies.remove("_open_uuid");
		opencyou.cookies.remove("_open_vip");
		opencyou.cookies.remove("_open_t");
		opencyou.cookies.remove('__online');
	},
	checkLogin : function(a) {
		if(!opencyou.cookies.read('__online')){
			
			var url = opencyou.url + "/account/member/online";
			
			$.ajax({
				type : "post",
				url : url,
				data : {},
				dataType : "json",
				success : function(data) {
					if (data != null && data.user_success != null && data.user_success == false) {
						opencyou.cookies.remove("_open_vip");
						opencyou.cookies.remove("_open_sname");
						opencyou.cookies.remove("_open_uuid");
						opencyou.cookies.remove('__online');
						var uri = window.location.href;
						
						if (uri.indexOf('/center/') > 0 && uri.indexOf('login.html')<0&&uri.indexOf('register.html')<0) {
							opencyou.topnav.hreflogin();
						}
					}else if(data != null && data.user_success != null && data.user_success == true){
						//opencyou.cookies.create('__online',true,1);
						
						$("#key_tokens").html(data.amount);
					}
					var cookies_Vvip1 = opencyou.cookies.read('_open_vip');
					if( cookies_Vvip1 != null && cookies_Vvip1 >0){
						$("#logVipImg").show();
					}else{
						$("#logVipImg").hide();
					}
				}
			});
		}
		var cookies_This = opencyou.cookies.read('_open_sname');
		var cookies_Uuid = opencyou.cookies.read('_open_uuid');
		var cookies_Vvip = opencyou.cookies.read('_open_vip');
		
		if (cookies_This != null) {
			opencyou.account.closePro('login');
			opencyou.account.closePro('regster');
			opencyou.account.openPro('login_on');
			
			var himg=document.getElementById("logImg");
			if( himg!= null){
				himg.src=opencyou.url+"/PubImgSour/"+cookies_Uuid+".png";
			}
			
			$("#logname").html(decodeURIComponent(cookies_This.replace("+","%20")));
			
			if( cookies_Vvip != null && cookies_Vvip >0){
				$("#logVipImg").show();
			}
			
			var pun=document.getElementById("play_user_un");
			if (pun!=null) {
				$("#play_user_un").hide();
				$("#play_user_en").show();
			}
			var puimg=document.getElementById("play_user_img");
			if( puimg!= null){
				puimg.src=opencyou.url+"/PubImgSour/"+cookies_Uuid+".png";
				$("#play_user_name").html("Hi,"+cookies_This);
			}
			
			this.loadRecordIndex();
			return true;
		} else {
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0 ||uri.indexOf('/pay/') > 0) {
				parent.location.href = opencyou.url+"/login.html";
				return false;
			}
		}
		$("#logVipImg").hide();
	},
	checkUserData : function(data) {
		
		if (data != null && data.user_success != null && data.user_success == false) {
			opencyou.cookies.remove("_open_sname");
			opencyou.cookies.remove("_open_uuid");
			opencyou.cookies.remove('__online');
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0&&uri.indexOf('loginto=')<0) {
				window.location.href=opencyou.url+'/index.html?loginto='+uri;
			}else{
				opencyou.account.openLogin();
				return;
			}
		}else if(data != null){
			opencyou.cookies.create('__online',true,1);
		}
	},
	loadRecordIndex : function() {
		//console.log("--------------loadRecordIndex");
		var url = opencyou.url + "/account/member/recordlist";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					var div="";
					//console.log("data.list.length============",data.list.length);
					if(data.list.length<=0){
						div+="<div class=' mt50 line18 fts12 color999'> You haven't followed anyone yet！ </div>";
					}else{
						var c = 0;
						for(var i in data.list){
							if(c<5){
								var sid= data.list[i][0];
								var uid= data.list[i][1];
								var pep= data.list[i][3];
								var type= data.list[i][4];
								var name= data.list[i][5];//a.sid,a. uid ,a.start_time ,num , a.type ,b.name
								
								var page = type==0? "v":"g";
								div+="<li class='right_one'> "
									+"<div class='ent_img icon_head fl pr'><img src='"+opencyou.url+"/PubImgSour/uinfo/"+uid+".png"+"' onerror=\"this.src='../imgs/icon.png'\"  class='optiond' width='60' height='60' border='0'/>"
                                    +"<a href='"+opencyou.url+"/live/t.html?s="+sid+"' class='optiond'> <div class='icon_play optiond'></div></a></div>"
								//+"<img class='icon_head' src='"+opencyou.url+"/PubImgSour/"+uid+".png"+"' onerror=\"this.src='../imgs/icon.png'\"  width='60' height='60' border='0' /> "
								+"<a href='"+opencyou.url+"/live/t.html?s="+sid+"' >"+name+"</a>";
								/*if(pep=='notlive'){
									div+="<span > 未开播</span></div></li>";
								}else{
									div+="<span >Popularity："+pep+"</span></div></li>";	
								}*/
								div+="<span >"+sid+"</span></div></li>";
							}
							c++;
							
						}
					}
					$("#on_record_list").html(div);
					scrollRight();
				}
				
			}
		});
	},
	loadRecord : function() {
		//console.log("==================loadRecord");
		var url = opencyou.url + "/account/member/recordlist";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				//console.log("======================",data);
				if (data != null && data.user_success == true) {
					
					var div="";
					//alert(data.list.length);
					if(data.list.length==0){
						div+="<div class='option m10 line18 fts12 color999'> You haven't followed anyone yet！ </div>";
					}else{
						for(var i in data.list){
							var sid= data.list[i][0];
							var uid= data.list[i][1];
							var pep= data.list[i][3];
							var type= data.list[i][4];
							var name= data.list[i][5];//a.sid,a. uid ,a.start_time ,num , a.type ,b.name
							
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
				
			}
		});
	},
	reloadRecord : function(obj){
		
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
		
		
	},
	reloadAnchor : function(){
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
						
						var u = data.userInfo;
						window.anchor_id = u.uid;
						opencyou.account.showPhotoGallery();
						//血型
						var blood = "";
						if(u.blood=='1'){
							blood="A";
						}else if(u.blood=='2'){
							blood="B";
						}else if(u.blood=='3'){
							blood="AB";
						}else if(u.blood=='4'){
							blood="O";
						}else{
							blood="";
						}
						$.getJSON("../../inc/constellation.json", function(da){ 
							var constellation = '';
							for( var i in da.constellation){
								if(da.constellation[i].value==u.constellation){
									$("#constellation").html(da.constellation[i].constellation);
									break;
								}
							}
						}); 
						
						var city = u.city==-1?"":u.city;
						var height = u.height==null?"":u.height;
						var weight =  u.weight==null?"":u.weight;
						var bwh =  u.bwh==null?"":u.bwh;
						var facebook =  u.facebook==null?"Yet open":u.facebook;
						var birthday = "";
						if(u.birthday!=null && u.birthday!=""){
							birthday= u.birthday.substring(0,4)+"-"+u.birthday.substring(4,6)+"-"+u.birthday.substring(6,8);
						}
						var div = '<div class="uID_icon option_dia"><img src="'+ opencyou.url +'/PubImgSour/'+u.photo
							+'" width="166" height="125" onerror="this.src=\'../imgs/icon.png\'" class="option_dia"/></div>'
    						+' <div class="option_dia"><label >DOB：</label><span>'+birthday+'</span></div> <div class="option_dia">'
							+' <label >City：</label><span class="option_dia"';
							if(city.length>10){
								div+=' style=" height:48px;"';
							}
							div+='>'+city+'</span></div>'
    						+' <div class="option_dia"><label >Zodiac：</label><span id="constellation" ></span></div>'
    						+' <div class="option_dia"><label >Blood type：</label><span>'+blood+'</span></div>'
							+' <div class="option_dia"><label >Height：</label><span class="option_dia">'+height+'</span></div>'
							+' <div class="option_dia"><label >Weight：</label><span class="option_dia">'+weight+'</span></div>'
							+' <div class="option_dia"><label >BWH：</label><span class="option_dia">'+bwh+'</span></div>'
							+' <div class="option_dia"><label class="fl ">Facebook：</label>';
							if(facebook!="Yet open"){
								div+='<a href="'+facebook+'" target="_blank" class="fl href_fb" >'+facebook+'</a> ';
							}else{
								div+=facebook;
							}
        					div+='</div><div class="option_dia"><label class="fl">Signature：</label>'
							+'<span style="float:left; width:110px; height:50px;overflow:hidden;" >'
							+ u.sign+'</span></div>';
							
						$("#userInfoDialog").html(div);
						//opencyou.cookies.create('_open_uuid',"0",3);
						
						$("#channel_header").mouseover(function(event){
							if ( !$("#userInfoDialog").is(':visible') ) {
								$("#userInfoDialog").fadeIn() ;
							}
						});
						$(document).mouseover(function(event) {
							if ($("#userInfoDialog").is(':visible') ) {
								//console.log("=================",!$(event.target).hasClass("option_dia"),!$(event.target).parent().hasClass("option_dia"));
								if (!$(event.target).hasClass("option_dia") && !$(event.target).parent().hasClass("option_dia")  ) {
									$("#userInfoDialog").fadeOut() ;
								}
							}
						});		
					}else {
						
					}
				}
			});
		$("#userInfoDialog").html();
	},
	loadwatched: function() {
		var wh = opencyou.cookies.read('wh');
		
		if(wh){
			
			var url = opencyou.url + "/account/member/getChannelsInfo";
			$.ajax({
					type : "get",
					url : url,
					data : {channels:wh},
					dataType : "json",
					success : function(data) {
					
						if (data != null && data.user_success == true && data.list!=null) {
							
							var div ="";
							for(var i in data.list){
								var obj = data.list[i];//a.sid,a.uid,a.num ,a.time,b.name
								//div += '<li> <img class="icon_head" src="'+opencyou.url+'/PubImgSour/'+obj[1]+'.png"  width="60" height="60" border="0"> '
								//	+'<a href="'+opencyou.url+'/live/t.html?s='+obj[0]+'">'+obj[4]+'</a><span>'+obj[0]+'</span></li>';
								
								div+="<li class='right_one'> "
									+"<div class='ent_img icon_head fl pr'><img src='"+opencyou.url+"/PubImgSour/uinfo/"+obj[1]+".png"+"' onerror=\"this.src='../imgs/icon.png'\"  class='optiond' width='60' height='60' border='0'/>"  //http://www.xiuktv.com/PubImgSour/uinfo/19460166.png
                                    +"<a href='"+opencyou.url+"/live/t.html?s="+obj[0]+"' class='optiond'> <div class='icon_play optiond'></div></a></div>"
								+"<a href='"+opencyou.url+"/live/t.html?s="+obj[0]+"' >"+obj[4]+"</a><span>"+obj[0]+"</span></li>";
								
							}
							$("#on_watched_list").html(div);
							scrollRight();
						}else{
							var div = "<div class=' mt50 line18 fts12 color999'> You haven't watched anyone yet！ </div>";
							$("#on_watched_list").append(div);
						}
					}
			});
			
		}
	},
	showPhotoGallery : function() {
		opencyou.utils.getJsonData(opencyou.imageurl+'/photo/listJsonp?uid=' + window.anchor_id,function(json){
			var success = json.success;
			var list = json.list;
			var html = "";
			for(var i in list){
				var id = list[i].id;
				var imguri = list[i].imguri;
				html += " <li> <div class='mara'><div class='mara-secdiv'><img src='" + imguri + "' width='204' height='184'></div>";
				html += " </div></li>";
			}
			$("#photoGalleryWall").html(html);
		});
	},
	showAffair : function() {
		var flag = true;
		if(window.anchor_id>0){
			flag = true;
		}
		var uid = opencyou.cookies.read('_open_uuid');
		if(uid!=window.anchor_id){
			flag = false;
		}
		var url = opencyou.url + "/account/info/findaffair";
		$.ajax({
			type : "post",
			url : url,
			data : {uid:window.anchor_id},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success == true) {
					var list = data.list;
					
					var html = "";
					var oldday="";
					var j=0;
					var monthflag = false;
					var oldmonth = "";
					for(var i in list){
						var id = list[i].id;
						var content = list[i].content;
						var date = new Date(parseInt(list[i].createTime));
						var createTime = date.Format("yyyy-MM-dd");
						if(oldday==""){
							oldday=createTime;
						}
						if(oldmonth==""){
							oldmonth=month;
//							html += "<div class='timeline_marker' data-time='"+year+"-"+month+"'><span>"+year+"年"+month+"月</span></div><section>";
						}
						
						if(oldday!=createTime){
							j=j+1;
							oldday=createTime;
						}
						if(oldmonth!=month){
							monthflag= true;
							oldmonth=month;
						}
						
						var year = createTime.split("-")[0];
						var month = createTime.split("-")[1];
						var day = createTime.split("-")[2];
						var style = "tll_feed";
						if(j%2==1){
							style = "tlr_feed";
						}
						
						html += "			<div class='timeline_feed "+style+"'>";
						html += "			   <section class='tl-a-feed tl-new-feed' id='newsfeed-21159536117' style='display: block;'> ";
						html += "			    <article class='content'> ";
						html += "			     <div class='content-header'> ";
						html += "			      <div class='time'> ";
						html += "			       <span class='day'>"+day+"</span> ";
						html += "			       <div class='time-right'> ";
						html += "			        <span class='month'>"+month+"月</span> ";
						html += "			        <span class='year'>"+year+"</span> ";
						html += "			       </div>";
						html += "			      </div> ";
						html += "			     </div> ";
						html += "			     <div class='content-media'> ";
						html += "			      <div class='content-main'>";
						html += content;
						html += "			      </div> ";
						html += "			     </div> ";
						html += "			    </article> ";
						if(flag){
							html += "			    <div class='tl-feed-actions'> ";
							html += "			     <menu>";
							html += "			      <a href='#nogo' onclick='opencyou.account.deleteAffair("+id+")' href='javascript:void(0);' class='highlight-this' title='删除'>删除</a> ";
							html += "			     </menu> ";
							html += "			    </div>";
						}
						html += "			   </section>";
						html += "			   <i></i>";
						html += "			  </div>";
						if(monthflag){
//							html +="</section><div class='timeline_marker' data-time='"+year+"年"+month+"月'><span>"+year+"年"+month+"月</span></div>"
						}
					}
					$("#myaffair").html(html);
				}
			}
		});
	},
	deleteAffair : function(id) {
		var url = opencyou.url + "/account/info/delaffair";
		$.ajax({
			type : "post",
			url : url,
			data : {id:id},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success == true) {
					opencyou.account.showAffair();
				}
			}
		});
	}
	
};


/**
 * open工具类
 */
opencyou.utils = {
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
		},
		getGroup : function() {
			var url = window.location.href;
			var pos=url.indexOf('/center/');
			if (pos > 0) {
				var uri=url.substring(pos+8,url.length);
				var pos2=uri.indexOf('/');
				if(pos2>0){
					var group=uri.substring(0,pos2);
					return group;
				}
				return "";
			}
			return null;
		},
		getPage : function(group) {
			var url = window.location.href;
			var pos=url.indexOf(group);
			if (pos > 0) {
				var page=url.substring(pos+group.length+1,url.indexOf('.html'));
				return page;
			}
			return null;
		},
		getJsonData : function (url,fun){ //跨域ajax请求
			var	callback=((url.indexOf("?")>-1)?"&":"?")+"callback=?";
			var timeout=arguments[2]||10000;
			var charset=arguments[3]||'UTF-8';
			var t=setTimeout(function(){fun({result:false,error_info:'time out'});},timeout);
			$.ajax({
		   'url': url+callback,'scriptCharset':charset,'dataType':"jsonp",
		   success: function(json){clearTimeout(t);fun(json);}
		    });
		} 		
};

/**
 * cookieg处理工具对象
 */
opencyou.cookies = {
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
		opencyou.cookies.create(name, "", -1);
	}
};

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
};

/**
 * 顶部导航写入
 */
opencyou.topnav = {
	writeTopmenu : function() {
			var select1="";
			var select2="";
			var select3="";
			var select4="";
			var select5="";
			var uri = window.location.href;
			if (uri.indexOf('/faq/') > 0) {
				select4="class='cur'";
			}else if(uri.indexOf('/act/ent.html') > 0){
				select2="class='cur'";
			}else if(uri.indexOf('/act/rank.html') > 0){
				select3="class='cur'";
			}else if(uri.indexOf('/index.html') > 0 || uri.indexOf('.html') < 0){
				select1="class='cur'";//class='cur'"; 
			}else if(uri.indexOf('/center/mall') > 0 ){
				select5="class='cur'";
			}else{
				select1="class='cur'";
			}
			
			var menuString1 ="<div class='hfix'><div class='warp'><div class='menutop'><a href='"+opencyou.url+"/index.html' class='rc_logo'></a>"
							+"<div class='top_nav'>"
								+"<div class=''> "
									+"<div id='login' class='rc_login' onclick='opencyou.topnav.hreflogin()' title='Login'>Login</div>"
									+"<div id='regster' class='rc_regist' onclick='opencyou.topnav.hrefregister()' title='register'>Register</div>"
									+"<div id='login_on' class='on_login'  style='display:none' >"
										+"<div class='login_record option'> "
											+"<img class='option' src='../imgs/favorite.png' width='18' height='16' border='0'/> <span class='option'>Following</span>"
										+"</div>"
										//yu e
										+"<span class='icon_border'></span>"
										+"<a class='login_tokens' href='"+opencyou.url+"/center/acctInfos.html' target='_blank' title='查看我的账户'>"
											
											+"<img class=' icon_tokens ' src='../imgs/icon_$.png' width='15' height='15' border='0' /> "
											+"<span class='token_num ' id='key_tokens' >0</span> "
										+"</a>"
										+"<span class='icon_border'></span>"
										//tou xiang
										+"<div class='login_center option1'>"
										+"<img class='option1 icon_head radius5' id='logImg' src='../imgs/icon.png' onerror=\"this.src='../imgs/icon.png'\" width='40' height='40' border='0' /> "
										+"<img class='option1 ' id='logVipImg'  src='"+opencyou.url+"/imgs/icon_vip.png' onerror='this.src=\""+opencyou.url+"/imgs/0.png\"' width='16' height='15' border='0' style='display:none;'/>"
										+"<span id='logname' class=' log_name option1'></span></div>"
									+"</div>";
									
			var menuString=menuString1+ "</div></div></div>";
			//搜索
			menuString += "<div class='rc_search'>"
										+"<div  class='int'><span class='icon icon_search'></span>"
											+"<input id='search_input' type='text'  onfocus='opencyou.searchInput.clearNote(this.id)' value='100081' onkeydown='return lucenceSearch(event)'/></div>"
										+"<div id='search' class='btn_search' onclick='opencyou.topnav.research()' title='search'>Search</div>"
									+"</div>";
			menuString += "<div id='on_login_list' class='option' style='display:none;'>"
								+"<ul class='on_login_list input_border option' id='record_list'>"
							+"</ul>"
							+"</div>";
			menuString += "<div id='on_center_list' class='option1' style='display:none;'><ul class='on_center_list option1'>"
								+"<li onclick='opencyou.topnav.href_enter()' class='option1'>My account</li>";
			var flag = false;
			var url = opencyou.url + "/account/info/getinfo";
			$.ajax({
				type : "post",
				url : url,
				data : {},
				dataType : "json",
				async: false,
				success : function(data) {
					if (data != null && data.user_success == true) {
						var u=data.userInfo;
						if(u.anchorFlag=='1'){
							flag = true;
						}
					}
				}
			});
			//if(flag){//主播才能说说
			//	menuString += "<li onclick='opencyou.topnav.affair_enter()' class='option1'>My affairs</li>";
			//}
			menuString += "<li onclick='opencyou.account.userLogout()' class='option1' style=' border:none;'>Log Out</li>"
							+"</ul></div></div></div>";
			
			var menuString2 ="<div class='warp'><div class='nav-box'><ul>"
							+"<li "+select1+"> <a href='"+opencyou.url+"/index.html' title='home'>HOME</a></li>"
							+"<li "+select3+"><a href='"+opencyou.url+"/act/rank.html' title='ranking'>RANKING</a></li>"
							+"<li "+select5+"><a href='"+opencyou.url+"/center/mallCar.html' title='mall'>MALL</a></li>"
							+"<li "+select2+"><a href='"+opencyou.url+"/center/acctInfos.html' target='_blank' title='topup'>TOPUP</a></li>"
							//+"<li><a href='' title='topup'>TOPUP</a></li>"
							+"<li "+select4+"><a href='"+opencyou.url+"/faq/faqchong.html' target='_blank' title='faq'>FAQ</a></li></ul>"
							+"<div class='woyao'> <a href='javascript:opencyou.topnav.woyaolive(\""+opencyou.url+"/center/groupApply.html\")' title='Sign contract'>Sign contract</a><!--a href='/faq/index.html' title='Live show now'>Live show now</a--></div>"
							+"</div></div>";
			
			$("#header").html(menuString);
			if($("#nav-menu")){
				$("#nav-menu").html(menuString2);
			}
			
			if($("#ScrollerWarp").length>0){
				var menuScroller ="<div class='scroller' id='Scroller' > </div>";
				$("#ScrollerWarp").html(menuScroller);
			}
			
			$(".login_center *").mouseover(function(event) {
				$("#on_center_list").show();
				$(".login_center").css('background','#666');
				
				var w1 = $(".login_center").position().left; 
				//var w= $(".login_center").offset().left ;
				var a= $(".on_center_list").width()-$(".login_center").width();
				//console.log(w1 ,a );
				$(".on_center_list").css('left', w1-a-1 );
				//$(".login_center").css('border-color','#999');
			});
			
			$(document).mouseover(function(event) {
				if (!$(event.target).hasClass("option1")  ) {
					$("#on_center_list").hide();
					$(".login_center").css('background','none');
				}
			});
			if(opencyou.cookies.read('_open_sname')!=null){
				opencyou.account.loadRecord();
				
				/*window.setInterval(function(){
					var uid = opencyou.cookies.read('_open_uuid');
					var d =new Date();
					var url2 = "http://capi.showoo.cc/msg/getNotice?d="+d.getTime();
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
									var href = window.location.href;
									if( href.indexOf("/live/")>0 && data.data[i].event=='anchorInfoUpdate' && data.data[i].anchorId == anchor_id ){
										//console.log("================================1",data.data[i]);
										
										if(href.indexOf("/live/")>0){
											loadAnchor();
										}
											
									}else if(data.data[i].event == 'focusListUpdate'){
										//console.log("================================2",data.data[i]);
										opencyou.account.reloadRecord(data.data[i].body);
									}
								}
								
							}
						}
					});
				},15000);
				*/
			}
			
	},
	writeBottom : function (){
		
		$("body").append('<div id="space_write" style=" width:100%; height:1px;"></div><iframe id="bottomIframe" width="100%" height="69" src="'+opencyou.url+'/inc/bottom.html" allowtransparency="true" scrolling="no" frameborder="0"></iframe>');
		
		var thisHeight = $(window).height();
		var documentHeight= $(document.body).height();
		if(thisHeight > documentHeight){
			var tureHeight = thisHeight-documentHeight;
			var bottomHeight = $('#bottomIframe').height();
			$("#space_write").height(tureHeight);
			$('#bottomIframe').height(bottomHeight);//+tureHeight);
		} 
		
		var href = window.location.href;
		if( href.indexOf(opencyou.url+"/index.html")>=0 || href==opencyou.url+"/"){
			$("body").append('<div id="favorites" class="favorites" style="cursor:pointer;" onclick="opencyou.topnav.addBookmark()"><a class="fv_close" href="javascript:$(\'#favorites\').hide(200);"></a><p class="p1">Ctrl + D</p><p class="p2">Add for Favorites</p></div>');
		
		}
	},addBookmark:function(){
		if ($(event.target).hasClass("fv_close")  ) {
			return ;
		}
		var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd': 'CTRL';
		try{
			if (document.all) { //IE类浏览器
				try {
					window.external.toString(); //360浏览器不支持window.external，无法收藏
					//$.alert(lang_object.FAVORITE1 + ctrl + lang_object.FAVORITE2);
					
					opencyou.account.commonAlert("Add to Favorites failed, Ctrl+Dadd to favorites.");
				}
				catch (e){
					try{
						window.external.addFavorite(window.location, document.title);
					}
					catch (e){
						window.external.addToFavoritesBar(window.location, document.title);  //IE8
					}
				}
			}
			else if (window.sidebar) { //firfox等浏览器
				window.sidebar.addPanel(document.title, window.location, "");
			}
			else {
				//$.alert(lang_object.FAVORITE1 + ctrl + lang_object.FAVORITE2);
				opencyou.account.commonAlert("Add to Favorites failed, Ctrl+Dadd to favorites.");
			}
		}
		catch (e){
			//$.alert(lang_object.FAVORITE1 + ctrl + lang_object.FAVORITE2);
			opencyou.account.commonAlert("Add to Favorites failed, Ctrl+Dadd to favorites.");
		}
	},

	hreflogin: function(){
		var href= encodeURIComponent(window.location.href);
		if(href.indexOf("register.html")>0){
			href="";
		}
		if(href.indexOf("login.html")>0){
			return false;
		}
		window.location.href=opencyou.url+"/login.html?backurl="+href;
	},
	hrefregister:function(){
		window.location.href=opencyou.url+"/register.html";
	},
	href_enter: function(){
		//opencyou.topnav.hide_loginList()
		//window.location.href=opencyou.url+"/center/userCenter.html";
		//window.location.href=opencyou.url+"/center/userCenterInfo.html";
		if(window.location.href.indexOf("live")>0){
			window.open(opencyou.url+"/center/userCenterInfo.html");
		}else{
			window.location.href=opencyou.url+"/center/userCenterInfo.html";
		}
	},
	affair_enter: function(){
		var tipWords = 'The length of "My affairs" is no more than 250 characters';
        var btnFn = function( e ){//处理发送事件
        	var content = $("#easyDialog_text").val();
        	if(content == tipWords || content == '')
        	{
        		alert('please say something!');
        	}else
        	{
        		//发送给服务端
        		var url = opencyou.url + "/account/info/addaffair";
				$.ajax({
					type : "post",
					url : url,
					data : {
						content:content
					},
					dataType : "json",
					success : function(data) {
						if(data.success){
							window.location.reload();
						}else{
							alert("update affair error.");
						}
					}
				});
        		//关闭输入框
            	easyDialog.close();
        	}
            return false;
        };

        easyDialog.open({
            container : {
                header : 'Post News Feed',
                content : tipWords,
                yesFn : btnFn,
                noFn : true
            },
            fixed : false
        });
    },
	show_loginList:function(){
		$("#on_login_list").show(300);
	},
	hide_loginList:function(){
		$("#on_login_list").hide(300);
	},
	updateseccode : function( id){
		document.getElementById(id).src="/validateCodeServlet?d="+new Date();
	},
	research:function(){
		var val =search_input.value;
		var url = opencyou.url+"/act/find.html?wd="+val ;
		url=encodeURI(url); 
		url=encodeURI(url);
		window.open(url);
//		window.location.href = opencyou.url+"/act/find.html?wd="+val;
	},woyaolive:function(href){
		
		var cookies_This = opencyou.cookies.read('_open_sname');
		
		if (cookies_This != null) {
			window.location.href = href;
		}else{
			window.location.href = opencyou.url+"/login.html?backurl="+encodeURIComponent(href);
		}
	}
};

opencyou.searchInput = {
	
	clearNote : function(id){
		
		var val =  $('#'+id).val();
		if(val=='100081'){
			 $('#'+id).val("");
		     $('#'+id).css({'color':'#333'});
		}else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
		
	 }
};

function lucenceSearch(event){
	 var keyCode = event.keyCode?event.keyCode:event.which?event.which:event.charCode;
	 if (keyCode ==13){
		 opencyou.topnav.research();
	 }
}

/**
 * 通用基础类Map
 */
function Map() {
	this.container = new Object();
};
Map.prototype.put = function(key, value) {
	this.container[key] = value;
};
Map.prototype.get = function(key) {
	return this.container[key];
};
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
};
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
};
Map.prototype.remove = function(key) {
	delete this.container[key];
};
Map.prototype.toString = function() {
	var str = "";
	for ( var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
		str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
	}
	return str;
};

Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
};

Date.prototype.TimeStamp2Date = function(timestampString){
	var timestamp = parseInt(timestampString) * 1000;
	//new Date().format("yyyy-MM-dd HH:mm:ss"); 
    var date = new Date(timestamp).Format("yyyy/MM/dd");
    return date;
};
Date.prototype.TimeStamp2DateTime = function(timestampString){
	var timestamp = parseInt(timestampString) * 1000;
	//new Date().format("yyyy-MM-dd HH:mm:ss"); 
    var date = new Date(timestamp).Format("hh:mm");
    return date;
};
Date.prototype.getTimeMmSs = function(timestampString){
    var date = new Date().Format("mm:ss");
    return date;
};
Date.prototype.TimeStamp2Date2= function(timestampString){
	var timestamp = parseInt(timestampString) * 1000;
	//new Date().format("yyyy-MM-dd HH:mm:ss"); 
    var date = new Date(timestamp).Format("yyyy-MM-dd");
    return date;
};

/**
 * 字符串去空格函数
 */
//String.prototype.trim = function(arg) {
//	return this.replace(/(^\s*)|(\s*$)/g, arg);
//}
String.prototype.trim = function(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
};

function addJson(json, key, value){
	return json[key] = value;
}
function delJson(json, key){
	delete json[key];
};
