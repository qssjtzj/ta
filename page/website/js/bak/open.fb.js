$(document).ready(function() {
  window.fbAsyncInit = function() {
	 FB.init({
		appId      : '825205517508302',//'1414880422108125',
		//channelUrl: 'http://www.rc.im/channel.html',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});
	
	fb.account.init();
	
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		console.log("auth.athResponseChange...."+response.status);
		
		if (response.status === 'connected') {
			$("#btn_fblogin").hide();
			fb.account.initLogin();
		} else if (response.status === 'not_authorized') {
			fb.account.FBlogin();
		} else {
			fb.account.FBlogin();
		}
	  });
  };
	
	// Load the SDK asynchronously
	(function(d){
	   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	   if (d.getElementById(id)) {return;}
	   js = d.createElement('script'); js.id = id; js.async = true;
	   //js.src = "//connect.facebook.net/zh_CN/all.js";
	   js.src = "//connect.facebook.net/en_US/all.js";
	   //js.src = "//connect.facebook.net/zh_TW/all.js";
	   ref.parentNode.insertBefore(js, ref);
	}(document));
	
});

var fb={};
fb.account = {
	//登录
	FBlogin:function(){
		console.log('[1] ---------------FBlogin------------------');
		
	 	FB.login(function(response) {
		   	if (response.authResponse) {
			 	console.log('[1] success! Welcome!  Fetching your information.... '+response);
			 	//FB.api('/me', function(response) {
				//	var new_fbid = response.id;
				//	var new_username = response.name;
				//	var new_email = response.email;
				//	var new_img = "https://graph.facebook.com/"+new_fbid+"/picture";
					
			 	//});
		   	} else {
			 	console.log('[1] failed! User cancelled login or did not fully authorize.');
		   	}
		   
		}, {scope: 'email'});
	},
	//注销
	FBlogout:function(){
		console.log('[1] ---------------FBLogout------------------');
		FB.logout(function(res){ 
			$("#fb_form_noconnect").show();
			$("#fb_form_connect").hide();
			$("#btn_fblogin").show();
			
			$("#fb_bind").val(0);
			$("#fb_id").val(0);
			$("#fb_token").val(0);
						
			$("#line_bind_fb").hide();
			$("#line_login_or").show();
		})
		
	},
	//初始化登录页面显示
	init:function(){
		$("#fb_bind").val(0);
		$("#fb_id").val(0);
		$("#fb_token").val(0);
		
		$("#line_bind_fb").hide();
		$("#line_login_or").show();
		
		console.log('[0] ---------------init------------------');
		FB.api('/me', function(response) {
			
			FB.getLoginStatus(function (response) {
				console.log('[0] --------------getLoginStatus-----------');
				if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
					
					console.log('[0] success !-----------');
					$("#btn_fblogin").hide();
					
				} else {  
					
					$("#fb_form_noconnect").show();
					$("#fb_form_connect").hide();
					$("#btn_fblogin").show();
					console.log('[0] failed !-----------');
				}
			});
		});
	},
	//初始化用户信息
	initLogin : function() {
		console.log('[3] ---------------initLogin------------------');
		
		FB.api('/me', function(response) {
			
			var new_fbid = response.id;
			var new_username = response.name;
			var new_email = response.email;
			var new_img = "https://graph.facebook.com/"+new_fbid+"/picture";
			
			var url = opencyou.url + "/account/member/getAccountByFB";
			$.ajax({
				type : "get",
				url : url,
				data : {
					fbid : new_fbid
				},
				dataType : "json",
				success : function(data) {
					
					document.getElementById("facebook_img").src=new_img;
					$("#facebook_username").html(new_username);
					
					if (data != null && data.user_success == true) {
						console.log('[3] Good to see you, ' + response.name + '.'+response.id);
						$("#facebook_account").html(data.account);
						$("#facebook_quick_login").attr("data",data.uid);
						
						$("#fb_form_noconnect").hide();
						$("#fb_form_connect").show();
					
						$("#already_rc_account").show();
						$("#go_bind_fb").hide();
					} else if(data != null && data.user_success == false && data.error_code==-3){
						console.log("[3] 超时");
						//window.location.reload();
					} else{
						
						$("#fb_form_noconnect").hide();
						$("#fb_form_connect").show();
						
						$("#already_rc_account").hide();
						$("#go_bind_fb").show();
						
						console.log(data.user_success+"  未绑定RC账号");
					}
					
				}
			});
			
		});
	},
	//去绑定初始化
	gobindFB:function(){
		$("#already_rc_account").hide();
		$("#go_bind_fb").hide();
		
		console.log('[00] ---------------init gobindFB------------------');
		FB.api('/me', function(response) {
			
			FB.getLoginStatus(function (response) {
				console.log('[00] --------------getLoginStatus-----------');
				if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
					var uid = response.authResponse.userID; // 取得 UID
					var accessToken = response.authResponse.accessToken; // 取得 accessToken
					
					//console.log("[00] UID：" + uid+" accessToken：" + accessToken)
					$("#fb_bind").val(1);
					$("#fb_id").val(uid);
					$("#fb_token").val(accessToken);
					
					$("#line_bind_fb").show();
					$("#line_login_or").hide();
					
					console.log('[00] success !-----------');
				} else {
					window.location.reload();
					console.log('[00] failed !-----------');
				}
			});
		});
		//window.open( opencyou.url + "/loginfb.html" ,"_self");
	},
	//快速登录
	quickLogin : function() {
		
		console.log('[6]-------------quickLogin--------------');
		
			var m_uid=$("#facebook_quick_login").attr("data");
			var m_cookies=opencyou.cookies.read('_open_ssid');
			
			var url = opencyou.url + "/account/member/ssologin";
			$.ajax({
				type : "get",
				url : url,
				data : {
					uid : m_uid,
					cookies:m_cookies
				},
				dataType : "json",
				success : function(data) {
					if (data != null && data.user_success == true) {
						window.location.href = "center/userCenter.html";
					} else {
						alert("登陆失败！");
						console.log(data.user_success);
					}
				}
			});
	},
	quickSignupFB :function(){
		console.log('[5]-------------quickSignupFB--------------');
		window.open( opencyou.url + "/registerfb.html" ,"_self");
		
	}
}


