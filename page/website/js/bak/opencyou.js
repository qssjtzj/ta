$(document).ready(function() {
	opencyou.topnav.writeTopmenu();
	opencyou.topnav.writeBottom();
	$(window).keydown(function(event) {
		opencyou.keyboard.keydownCallback(event.keyCode);
	});
	opencyou.account.checkLogin();
	
});

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

/** 全局名称空间对象 */
var opencyou = {
	url : "http://" + window.location.host + "/open"

};

opencyou.apps = {
		showAppsList : function() {
			var url = opencyou.url + "/apps/app/list.json";
			$.ajax({
				type : "post",
				url : url,
				data : {},
				dataType : "json",
				success : function(data) {
					for (i in data) {
						var id = data[i].id;
						var appname = data[i].appname;
						var appkey = data[i].appkey;
						var div = '<dl><dt><img src="../../images/pic.jpg" /></dt><dd><p class="Ffamily_hei fts16 line32 color05"><a href="info.html?id='+id+'">'+appname+'</a></p>'
						+'<p class="Ffamily_hei fts14 line24  color04">玩家总数：1000昨日活跃人数：150</p></dd><dt class="fts14 color07">审核通过</dt></dl>';

						$("#gamelist_01").append(div);
					}
				}
			});
		}
}
/**
 * 账号相关功能对象
 */
opencyou.account = {
	openLogin : function(tourl) {
		$
				.popbox('<div class="main_login" id="main_login" >'
						+ '<div class="close"><img src="'+opencyou.url+'/images/close.jpg" align="right" id="op_loginclose" style="cursor: pointer"/></div>'
						+ '<dl><dd><input id="user_name" type="text" class="int" value="用户名" onFocus="opencyou.loginInput.clearNote(this.id)" onblur="opencyou.loginInput.thisNote(this.id)"/>'
						+ '<input  id="user_pwd" type="password" class="int" onkeydown="if(event.keyCode==32) return false" style="display:none" onPaste="return false" onblur="opencyou.loginInput.thisPw(this.id)"  onFocus="opencyou.loginInput.addcss(this.id)"/><input type="text" class="int"  id="user_pwd01" style="display:block" onkeydown="if(event.keyCode==32) return false" value="密  码" maxlength="16" onFocus="opencyou.loginInput.changePw(this.id)" />'
						+ '<div class="main_login_btn Ffamily_hei fts14 color08"><em><img src="'+opencyou.url+'/images/login_btn_01.jpg"  onclick="opencyou.account.userLogin(\''+tourl+'\')"  style="cursor:pointer"/></em><i><input id="user_remember" type="checkbox" value="0"  class="int01"/></i><span>记住用户名</span></div>'
						+ '</dd><dt class="fts14 Ffamily_hei color10">如需申请账号，请联系管理员。<br />联系邮箱：<br /><a href="mailto:zhuri.work@gmail.com">zhurui.work@gmail.com</a></dt></dl></div>');
		// 弹窗关闭按钮
		$("#op_loginclose").live("click", function() {
			$("#zxxBlank").remove();
			$(this).parents(".wrap_out").remove();
			opencyou.keyboard.keydownRegisterOrRemoveCallback(13, function() {
				opencyou.keyboard.tempoldcallback
			});
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0) {
				var cookies_This = opencyou.cookies.read('_open_sname');
				if (cookies_This == null) {
					window.location.href = opencyou.url+'/index.html';
				}
			}
		})
		opencyou.keyboard.tempoldcallback = opencyou.keyboard
				.keydownRegisterOrRemoveCallback(13, function() {
					opencyou.account.userLogin(tourl)
				});
	},
	openPro : function(divId) {// 打开divid
		$('#' + divId).show();
	},
	closePro : function(divId) {// 关闭divid
		$('#' + divId).hide();
	},
	userLogin : function(tourl) {
		var name = $("#user_name").val();
		var pwd = $("#user_pwd").val();
		var user_remember=0;
		if($("#user_remember").attr("checked")=='checked'){
			user_remember=1;
		}
		var url = opencyou.url + "/account/user/login.json";
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : name,
				pwd : pwd,
				remember : user_remember
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					var stringhtml = data.username;
					opencyou.account.closePro('login');
					opencyou.account.openPro('login_on');
					$('#login_on .logStr').html(stringhtml);
					$("#zxxBlank").remove();
					$("#main_login").remove();
					$('.login_user01').html(stringhtml);
					if(tourl!=undefined&&tourl!='undefined'){
						window.location.href=tourl;
						return;
					}
					var lto=opencyou.customer.getParamFromUrl("loginto"); 
					if(lto!=undefined&&lto!='undefined'){
						window.location.href=lto;
						return;
					}
					location.reload();
				} else {
					alert("用户名或密码输入错误！");
				}
			}
		});
	},
	userLogout : function() {
		var url = opencyou.url + "/account/user/logout.json";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == false) {
					opencyou.cookies.remove("_open_sname");
					opencyou.cookies.remove("_open_ssid");
					opencyou.account.closePro('login_on');
					opencyou.account.openPro('login');
					var uri = window.location.href;
					if (uri.indexOf('/center/') > 0) {
						window.location.href = opencyou.url+'/index.html';
					}
				} else {
					alert("系统错误！");
				}
			}
		});
		opencyou.cookies.remove("_open_sname");
		opencyou.cookies.remove("_open_ssid");
	},
	checkLogin : function(a) {
		if(!opencyou.cookies.read('__online')){
			var url = opencyou.url + "/account/user/online.json";
			$.ajax({
				type : "post",
				url : url,
				data : {},
				dataType : "json",
				success : function(data) {
					if (data != null && data.user_success != null
							&& data.user_success == false) {
						opencyou.cookies.remove("_open_sname");
						opencyou.cookies.remove("_open_ssid");
						var uri = window.location.href;
						if (uri.indexOf('/center/') > 0&&uri.indexOf('loginto=')<0) {
							window.location.href=opencyou.url+'/index.html?loginto='+uri;
							return false;
						}
					}else if(data != null && data.user_success != null
							&& data.user_success == true){
						opencyou.cookies.create('__online',true,3);
					}
				}
			});
		}
		var cookies_This = opencyou.cookies.read('_open_sname');
		if(a!=undefined){
			if(cookies_This==null){
				opencyou.account.closePro('login_on');
				opencyou.account.openPro('login');
				opencyou.account.openLogin(a.href);
				return false;
			}else{
				return true;
			}
		}
		if (cookies_This != null) {
			opencyou.account.closePro('login');
			opencyou.account.openPro('login_on');
			$('#login_on .logStr').html(cookies_This);
			$('.login_user01').html(cookies_This);
			return true;
		} else {
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0) {
				opencyou.account.openLogin();
				return false;
			}
		}
	},
	checkUserData : function(data) {
		if (data != null && data.user_success != null
				&& data.user_success == false) {
			opencyou.cookies.remove("_open_sname");
			opencyou.cookies.remove("_open_ssid");
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0&&uri.indexOf('loginto=')<0) {
				window.location.href=opencyou.url+'/index.html?loginto='+uri;
			}else{
				opencyou.account.openLogin();
				return;
			}
		}else if(data != null){
			opencyou.cookies.create('__online',true,3);
		}
	},
	createUser : function() {
		var new_account = $("#new_account").val();
		var new_username = $("#new_username").val();
		var new_password = $("#new_password").val();
		var new_email = $("#new_email").val();
		var new_phone = $("#new_phone").val();
		var new_seckey = $("#new_seckey").val();
		var url = opencyou.url + "/account/user/createuser.json";
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : new_account,
				username : new_username,
				password : new_password,
				email : new_email,
				phone : new_phone,
				seckey : new_seckey
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success == true) {
					easyDialog.open({
						container : {
							content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >用户创建成功！</p><p>您的账号将自动退出！</p></div>'
							
							},
							autoClose : 2000,  
		                    callback : opencyou.account.userLogout
							
						});
				} else {
					easyDialog.open({
						container : {
							content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >您没有足够的权限创建用户！</p><p>您的账号将自动退出！</p></div>'
							
							},
							autoClose : 2000,  
		                    callback : opencyou.account.userLogout
							
						});
				}
			}
		});
	}
}
opencyou.utils = {
		getLocalTime : function(nS) {     
			return new Date(parseInt(nS)).format("yyyy-MM-dd hh:mm:ss");     
		}
}
/**
 * 客服相关对象
 */
opencyou.customer = {
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
	loadPageList : function(pageNo, pageSize, counts,url){
		var total = Math.ceil(counts / pageSize);

		var div = "";
		var pageShow = 5;

		// 开始页码
		var start = pageNo;
		if (pageNo > (total-pageShow) ) {
			start = total-pageShow +1;
		} 
		if(start<1){
			start=1;
		}
		// 首页
		if (pageNo >1 ) {
			div += "<li class=''><a href='"+url+"pageNo=1" 
				+ "&pageSize=" + pageSize + "'>首页</a></li>";
			div += "<li class=''><a href='"+url+"pageNo=" + (pageNo - 1)
			+ "&pageSize=" + pageSize + "'>上一页</a></li>";
		} else {
			div += "<li class='disabled'><a>首页</a></li>";
			div += "<li class='disabled'><a>上一页</a></li>";
		}
		// alert(start);
		var max= Number(start) + Number(pageShow) ;
		// 分页
		for (var i = start; i < max && i <= total; i++) {

			if (i == pageNo) {
				div += "<li class='active'><span>" + i
						+ " <span class='sr-only'>(current)</span></span></li>";
			} else {
				div += "<li><a href='"+url+"pageNo=" + i + "&pageSize="
						+ pageSize + "'>" + i + "</a></li>";
			}
		}

		// 下一页
		if (pageNo<total ) {
			var next = Number(pageNo) + 1 ;
			
			div += "<li class='' ><a href='"+url+"pageNo=" + next 
				+ "&pageSize=" + pageSize + "'>下一页</a></li>";
			
			div += "<li class='' ><a href='"+url+"pageNo=" + (total)
				+ "&pageSize=" + pageSize + "'>尾页</a></li>";
		} else {
			div += "<li class='disabled' ><a>下一页</a></li>";
			div += "<li class='disabled'><a>尾页</a></li>";
		}
		
		div += "<li class='noborder'><span>"+pageNo+"/"+total+" 直接跳转到</span></li>";
		div+="<li><input type='text' value='' size='1' maxlength='3' id='input_page_no' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" onbeforepaste=\"clipboardData.setData('text',clipboardData.getData('text').replace(/[^\\d.]/g,''))\"/></li> <li><a href='javascript:opencyou.customer.jumpPage("+pageSize+","+total+",\""+url+"\");'>跳转</a></li>";
		
		$("#page_button_list").text("");
		$("#page_button_list").html(div);
	},
	jumpPage : function(pageSize,pageTotal,url){
		var val=input_page_no.value.trim();
		if(val > pageTotal || val<1){
			input_page_no.value='';
			return false;
		}
		window.location.href=url+"pageNo="+val+"&pageSize="+pageSize;
	},
	getCustomGameList : function() {
		var pNo=opencyou.customer.getParamFromUrl("pageNo");
		var pSize=opencyou.customer.getParamFromUrl("pageSize");
		
		var url = opencyou.url + "/customers/apps/list.json";
		$.ajax({
			type : "post",
			url : url,
			data : {
				page_no : pNo,
				page_size : pSize
			},
			dataType : "json",
			success : function(dd) {
				opencyou.account.checkUserData(dd);
				if (dd != null) {
					var data = dd.data;
					for (i in data) {
						var types = data[i].ordercount;
						var div = '<div class="bs-callout bs-callout-danger">';
								
						if (data[i].total_count > 0) {
							div += '<h4><a href="order_info.html?appkey=' + data[i].app_key + '">' + data[i].app_name;
							div += ' <span class="badge label-danger">'
									+ data[i].total_count + '</span> </a></h4><p>';
						} else {
							div += '<h4><a >' + data[i].app_name;
							div += ' <span class="badge">' + data[i].total_count
									+ '</span> </a></h4>';
						}

						for (j in types) {
							div += " <div class='list_word'>"
									+ types[j].type_name + "： "
									+ types[j].count + "</div>  ";
						}
						div += '</div>';

						$("#custom_game_list").append(div);
					}
					$("#order_today_counts").text(dd.today_solve);
					$("#order_history_counts").text(dd.total_solve);
					opencyou.customer.loadPageList(dd.page_no, dd.page_size, dd.total_count,'apporder.html?');
				}
			}
		});
	},
	getCustomOne : function(){
		var appId = opencyou.customer.getParamFromUrl("appkey");
		var url = opencyou.url + "/customers/workorder/accept.json";
		var gettype = 0;
		if (appId != '') {
			gettype = 1;
		}
		$
				.ajax({
					url : url,
					data : {
						appkey : appId,
						gettype : gettype
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							var faq = data.faqs;
							// 用户信息

							$("#oreder_number").text(data.id);
							order_id.value = data.id;

							var div_user = "<span class='title width300'>游戏名称："
									+ data.game_name + "</span>";
							div_user += "<span class='title width300'>用户等级 ："
									+ data.user_level + "</span>";
							div_user += "<span class='title width300'>注册渠道 ："
									+ data.user_channel_name + "</span>";
							div_user += "<span class='title width300'>提问渠道 ："
									+ data.order_channel + "</span>";
							div_user += "<span class='title width300'>用户IP ："
									+ data.user_ip + "</span>";
							div_user += "<span class='title width300'>用户账号 ："
									+ data.user_account + "</span>";
							div_user += "<span class='title width300'>用户UDID ："
									+ data.user_udid + "</span>";
							$("#user_info_list").append(div_user);
							// 问题描述
							var div_faq = "<span class='title width300'>用户账号 ："
									+ data.user_account + "</span>";
							div_faq += "<span class='title width300'>服务器 ："
									+ data.game_server + "</span>";
							div_faq += "<span class='title width300'>手机系统 ："
									+ data.user_system + "</span>";
							div_faq += "<span class='title width300'>角色ID ："
									+ data.user_roleid + "</span>";
							div_faq += "<span class='title width300'>问题类型 ："
									+ data.order_type_name + "</span>";
							div_faq += "<span class='title width300'>提问时间 ："
									+ opencyou.utils.getLocalTime(data.create_date)
									+ "</span>";
							div_faq += "<span class='title width300'>联系方式 ："
									+ data.user_tel + "</span>";
							div_faq += "<span class='title width300'>&nbsp;</span>";

							if (data.user_order_id!=null&&data.user_order_id != '') {
								div_faq += "<p class='title'>支付订单信息 ：<span class='alert-info'> 流水号："
										+ data.user_order_id
										+ " ,支付时间："
										+ opencyou.utils.getLocalTime(data.user_pay_date)
										+ " ,支付金额："
										+ data.user_pay_money
										+ " </span> </p>";
							}
							div_faq += "<p><span class='title'>问题描述 ：<code class='this_code'>"
									+ faq[0].content + "</code></span></p>";
							$("#faq_info_list").append(div_faq);

							// 备注
							var notes = data.note;
							var div_note = "";
							for ( var n in notes) {
								div_note += "<div class='warning_border line_height24'><span class='width100'>"
										+ notes[n].content
										+ "</span><span class='navbar-right with100date'>"
										+ opencyou.utils.getLocalTime(notes[n].time)+" by "
										+notes[n].customer_name+"</span></div>";
							}
							$("#note_list").append(div_note);

						} else {
							// alert("暂无未处理工单！");
							// window.location.href = "custom.htm";
							easyDialog.open({
								container : {
									content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>暂无未处理工单！</p><p>即将跳转到首页！</p></div>'
									
								},
								autoClose : 2000,  
		                        callback : opencyou.customer.reloadCustom 
							});
							
						}

					}
				});
	},
	showMarket : function() {
		
		$('#markets_textarea').css('color','#dbdbdb');
		$("#markets_textarea").val("请填写备注内容");
		easyDialog.open({
			container : 'easyDialogWrapper1'
		});
		$("#easyDialogYesBtn").removeAttr("disabled"); 
	},
	closeMarkets : function() {
		easyDialog.close();
	},
	resetMarkets : function(){
		$("#markets_textarea").val("请填写备注内容");
		$("#markets_textarea").css("color","#dbdbdb");
	},
	submitMarket : function() {
		
		var content = $("#markets_textarea").val();
		var url = opencyou.url + "/customers/workorder/note.json";
		if(content=="" || content=='请填写备注内容'){
			$("#markets_textarea").val("请填写备注内容");
			$("#markets_textarea").css("color","#f00");
			return false;
		}
		$("#easyDialogYesBtn").attr("disabled",true); 
		$.ajax({
					url : url,
					data : {
						orderid : order_id.value,
						content : content
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							if (data.success == true) {
								var div_note="<div class='warning_border line_height24'><span class='width100'>"+ data.content+"</span><em class='navbar-right with100date'>"+opencyou.utils.getLocalTime(data.time)+" by "
								+data.customer_name+"</em></div>";
								$("#note_list").append(div_note);

								easyDialog.open({
											container : {
												content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>添加备注成功！</p></div>',
												yesFn : function() {
													opencyou.customer.closeMarkets();
												}
											}
										});

							}
						}

					}

				});

	},
	reSetReply : function() {
		$("#reply_content").val("请填写回复内容");
	},
	submitReply : function() {
		var url = opencyou.url + "/customers/workorder/reply.json";
		var content = $("#reply_content").val();
		
		if(content=="" || content=='请填写回复内容'){
			$("#reply_content").val("请填写回复内容");
			easyDialog.open({
				container : {
					content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>请填写回复内容！</p></div>'
					},
					autoClose : 1500
				});
			return false;
		}
		$("#btnsubmit").attr("disabled",true); 
		$.ajax({
					url : url,
					data : {
						orderid : order_id.value,
						content : content
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							if (data.success == true) {
								// showMarket();
								easyDialog.open({
									container : {
										content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >答复内容已发送给用户！</p><p>感谢使用客服工具！</p></div>'
										
										},
										autoClose : 500,  
					                    callback : opencyou.customer.reloadCustom 
										
									});

							}else{
								easyDialog.open({
									container : {
										content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >答复失败或工单已被处理过！</p><p>感谢使用客服工具！</p></div>'
										
										},
										autoClose : 2000,  
					                    callback : opencyou.customer.reloadCustom 
										
									});
							}
						}
					}

				});

	},
	reloadCustom : function(){
		window.location.href = "apporder.html";
	},
	navTypeList : function(id) {
		
		var url = opencyou.url +  "/customers/workorder/typelist.json";
		
		$.ajax({
			url: url,
			data: "",
			type:"post",
			dataType : "json",
			success: function(data) {
				opencyou.account.checkUserData(data);
				if(data!=null){
					
					var div="";
					for( i in data){
						if(data[i].type_id ==id){
							div+='<li class="active"><a href="cusorder.html?tid='+data[i].type_id+'">--'+data[i].type_name+'</a></li>';
						}else{
							div+='<li><a href="cusorder.html?tid='+data[i].type_id+'">--'+data[i].type_name+'</a></li>';
						}
					}
					$("#nav_type_list").append(div);
				}
			
			}
		});	
		
	},
	loadHistoryPage : function(){
		var tid=0;
		var ptid=opencyou.customer.getParamFromUrl("tid"); 
		var pno= opencyou.customer.getParamFromUrl("pageNo");
		var psize= opencyou.customer.getParamFromUrl("pageSize");
		var pageNo=1;
		var pageSize=10;
		if(pno!=''){
			pageNo=pno;
		}
		if(psize!=''){
			pageSize=psize;
		}
		if(ptid!=''){
			tid=ptid;
		}
		opencyou.customer.navTypeList(tid);
		
		
		
		opencyou.customer.getHistoryList(pageNo,pageSize,tid);
	},
	getHistoryList : function(pNo,pSize,tid){
		var url = opencyou.url +  "/customers/workorder/donelist.json";
		
		$.ajax({
			url: url,
			data: {page_no: pNo, page_size: pSize,order_type:tid},
			type:"post",
			dataType : "json",
			success: function(dd) {
				opencyou.account.checkUserData(data);
				if(dd!=null){
					
					var data=dd.data;
					for( i in data){
						var faq=data[i].faqs;
						var div='<li>'+data[i].id +'</li><li>'+opencyou.utils.getLocalTime(data[i].create_date)+' </li>';
						var cont=faq[0].content;
	                    
	                    if(cont.length>29){
	                    	cont=cont.substring(0,29);
	                    	cont+="...";
	                    }
	                    div+='<li>'+data[i].user_account+'</li><li>' +opencyou.utils.getLocalTime(data[i].update_date) +'</li>';
	                    var cont_faq=faq[1].content;
	                    
	                    if(cont_faq.length>29){
	                    	cont_faq=cont_faq.substring(0,29);
	                    	cont_faq+="...";
	                    }
	                    div+='<li><a href="oldorder_info.html?oid='+data[i].id +'">查看详情</a></li>';
						$("#page_history_list").append(div);
					}
					
					opencyou.customer.loadPageList(pNo,pSize,dd.total_count,'cusorder.html?tid='+tid+'&');// dd.total_count
				}
			
			}
		});	
	},
	getHistoryOne : function(){
		var orderId=opencyou.customer.getParamFromUrl("oid"); 
		var url = opencyou.url +  "/customers/workorder/get.json";
		
		$.ajax({
			url: url,
			data: {orderid: orderId},
			type:"post",
			dataType : "json",
			success: function(data) {
				opencyou.account.checkUserData(data);
				if(data!=null){
					
					var faq=data.faqs;
						// 用户信息
					
					$("#oreder_number").text(data.id);
					order_id.value=data.id;
					
						var div_user="<span class='title width300'>游戏名称："+data.game_name+"</span>";
						div_user+="<span class='title width300'>用户等级 ："+data.user_level+"</span>";
						div_user+="<span class='title width300'>注册渠道 ："+data.user_channel_name+"</span>";
						div_user+="<span class='title width300'>提问渠道 ："+data.order_channel+"</span>";
						div_user+="<span class='title width300'>用户IP ："+data.user_ip+"</span>";
						div_user+="<span class='title width300'>用户账号 ："+data.user_account+"</span>";
						div_user+="<span class='title width300'>用户UDID ："+data.user_udid+"</span>"; 
						$("#user_info_list").append(div_user);
						// 问题描述
						var div_faq="<span class='title width300'>用户账号 ："+data.user_account+"</span>";
						div_faq+="<span class='title width300'>服务器 ："+data.game_server+"</span>";
						div_faq+="<span class='title width300'>手机系统 ："+data.user_system+"</span>";
						div_faq+="<span class='title width300'>角色ID ："+data.user_roleid+"</span>";
						div_faq+="<span class='title width300'>问题类型 ："+data.order_type_name+"</span>";
						div_faq+="<span class='title width300'>提问时间 ："+opencyou.utils.getLocalTime(data.create_date)+"</span>";
						div_faq+="<span class='title width300'>联系方式 ："+data.user_tel+"</span>"; 
						div_faq+="<span class='title width300'>&nbsp;</span>";
						
						if(data.user_order_id!=null&&data.user_order_id!=''){
							div_faq+="<p class='title'>支付订单信息 ：<span class='alert-info'> 流水号："+data.user_order_id+" ,支付时间："+opencyou.utils.getLocalTime(data.user_pay_date)+" ,支付金额："+data.user_pay_money+" </span> </p>"; 
						}
						div_faq+="<p><span class='title'>问题描述 ：<code class='this_code'>"+faq[0].content+"</code></span></p>"; 
						$("#faq_info_list").append(div_faq);
						div_faq="<p><span class=''>"+faq[1].content+"</span></p>";
						$("#reply_list").append(div_faq);
						
					// 备注
					var notes=data.note;
					var div_note="";
					for(var n in notes){
						// div_note+="<div class='warning_border
						// line_height24'><span>"+notes[n].content+"</span><em
						// class='navbar-right'>"+getLocalTime(notes[n].time)+"</em></div>";
						div_note += "<div class='warning_border line_height24'><span class='width100'>"
							+ notes[n].content
							+ "</span><span class='navbar-right with100date'>"
							+ opencyou.utils.getLocalTime(notes[n].time)+" by "
							+notes[n].customer_name+"</span></div>";
					}
					$("#note_list").append(div_note);
				}
			
			}
		});	
	}
}
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
}
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
 * 顶部导航写入
 */

opencyou.topnav = {
	
	writeTopmenu : function() {
			var select1="";
			var select2="";
			var select3="";
			var select4="";
			var uri = window.location.href;
			if (uri.indexOf('/center/') > 0) {
				select4="class='cur'";
			}else if(uri.indexOf('doccenter') > 0){
				select2="class='cur'";
			}else if(uri.indexOf('supcenter') > 0){
				select3="class='cur'";
			}else{
				select1="class='cur'";
			}
			
			var menuString1 ="<div class='cyou_logo Ffamily_hei fts16'>畅游开放平台</div><div class='top_nav Ffamily_hei'><div class='nav-box'><div id='login' class='login' onclick='opencyou.account.openLogin()'></div>"
							+ "<div id='login_on' class='on_login' style='display:none'>您好<span class='logStr'></span><span onclick='opencyou.account.userLogout()' style='cursor:pointer'>&nbsp;&nbsp;退出</span></div>";
			var menuString2 ="<ul><li "+select1+"><a href='"+opencyou.url+"/index.html'>首页</a></li><li "+select2+"><a href='"+opencyou.url+"/document/doccenter.html'>文档中心</a></li><li "+select3+"><a href='"+opencyou.url+"/support/supcenter.html'>支持</a></li><li "+select4+"><a href='"+opencyou.url+"/center/welcome.html' onclick='return opencyou.account.checkLogin(this);'>管理中心</a></li></ul>";
			var menuString=menuString1+menuString2+ "<div class='nav-line'></div></div><div class='line'></div></div>";
			$(".cy_menutop").html(menuString);
			
	},
	writeBottom : function (){
		$("body").append('<iframe id="bottomIframe" width="100%" height="118" src="'+opencyou.url+'/inc/bottom.html" allowtransparency="true" scrolling="no" frameborder="0"></iframe>');
		var thisHeight = $(window).height();
		var documentHeight= $(document.body).height();
		if(thisHeight > documentHeight){
			var tureHeight = thisHeight-documentHeight;
			var bottomHeight = $('#bottomIframe').height();
			$('#bottomIframe').height(bottomHeight+tureHeight);
		} 
	}
}
/**
 * 登录相关判断
 */

opencyou.loginInput = {

	clearNote : function(id){
		var val =  $('#'+id).val();
		if(val=="用户名"){
			 $('#'+id).val("");
		     $('#'+id).css({'color':'#333'});
			}
		else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
	 },

	changePw : function(id){
		$('#'+id).css({'display':'none'});
		document.getElementById('user_pwd').style.display = "block";
		document.getElementById('user_pwd').focus();//
	 },
	 
	thisNote : function(id){
		var val =  $('#'+id).val();
		if(val==""){
			 $('#'+id).val("用户名");
			 $('#'+id).css({'color':'#c4c4c4'});
			}
			else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
			}
	 },
	 
	thisPw : function (id){
		var val =  $('#'+id).val();
		if(val==""){
			$('#'+id).hide();
			$('#user_pwd01').show();
			}
			else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
			}
	 },
	 
	addcss : function (id){
		$('#'+id).css({'color':'#333'});
	 } 

}