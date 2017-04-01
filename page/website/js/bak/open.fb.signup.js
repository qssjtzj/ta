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
		   	} else {
			 	console.log('[1] failed! User cancelled login or did not fully authorize.');
		   	}
		   
		}, {scope: 'email'});
	},
	//注销
	FBlogout:function(){
		console.log('[1] ---------------FBLogout------------------');
		FB.logout(function(res){ 
			$("#fb_bind").val(0);
			$("#fb_id").val(0);
			$("#fb_token").val(0);
			$("#fb_form_connect").hide();
		})
		
	},
	//初始化注册页面
	init:function(){
		
		console.log('[0] ---------------init------------------');
		FB.api('/me', function(response) {
				
			FB.getLoginStatus(function (response) {
				console.log('[0] --------------getLoginStatus-----------');
				if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
					console.log('[0] success !-----------');
					$("#fb_form_connect").show();
					
				} else {
					window.open( opencyou.url + "/register.html" ,"_self");
					console.log('[0] failed !-----------');
				}
			});
		});
		
	},
	//初始化用户信息
	initLogin : function() {
		console.log('[3] ---------------initLogin------------------');
		
		FB.api('/me', function(response) {
			
			FB.getLoginStatus(function (response) {
				console.log('[3] --------------getLoginStatus-----------');
				if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
					console.log('[3] success !-----------');
				
					var uid = response.authResponse.userID; // 取得 UID
					var accessToken = response.authResponse.accessToken; // 取得 accessToken
					
					$("#fb_bind").val(1);
					$("#fb_id").val(uid);
					$("#fb_token").val(accessToken);
					
				} else {
					window.open( opencyou.url + "/register.html" ,"_self");
					console.log('[3] failed !-----------');
				}
			});
			var new_fbid = response.id;
			var new_username = response.name;
			var new_email = response.email;
			var new_img = "https://graph.facebook.com/"+new_fbid+"/picture";
			
			document.getElementById("facebook_img").src=new_img;
			$("#facebook_username").html(new_username);
			
			$('#new_username').val(new_username);
			$('#new_email').val(new_email);
			$('#new_username').css({'color':'#333'});
			$('#new_email').css({'color':'#333'});
			
		});
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
	/*createFBUser: function (new_fbid,new_username,new_email,new_img) {
		//alert("createFBUser-----------"+new_fbid);
		
		var url = opencyou.url + "/account/member/registerfb";
		$.ajax({
			type : "post",
			url : url,
			data : {
				fbid : new_fbid,
				username : new_username,
				email : new_email,
				img : new_img,
				rtype : 3
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					//alert(data.user_success+" , "+data.username);
					window.location.href="register_success.html?account="+new_account;
				} else if(data != null && data.user_success == false){
					if(data.error_code==2){
						fb.account.quickLogin();
					}
					
				}else{
					alert(data.user_success);
				}
				
			}
		});
	},*/
	/*quickSignup:function(){
		console.log('[4] --------------quickSignup------------');
		FB.login(function(response) {
		   	if (response.authResponse) {
			 	console.log('4 Welcome!  Fetching your information.... '+response);
			 	FB.api('/me', function(response) {
			   		//alert('login success, ' + response.name + '');
					
					var new_fbid = response.id;
					var new_username = response.name;
					var new_email = response.email;
					
					window.open( opencyou.url + "registerfb.html?username="+new_username+"&email="+new_email ,"_self");
					
			 	});
		   	} else {
			 	console.log('2 User cancelled login or did not fully authorize.');
		   	}
		   
		}, {scope: 'email'});
	},*/
	
}


