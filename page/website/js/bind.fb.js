$(document).ready(function() {
  window.fbAsyncInit = function() {
	 FB.init({
		appId      : '588576371254278',//'825205517508302',//'1414880422108125',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});
	
	
	
	/*
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		console.log("auth.athResponseChange...."+response.status);
		
		if (response.status === 'connected') {
			fb.account.initLogin();
		} else if (response.status === 'not_authorized') {
			fb.account.FBlogin();
		} else {
			fb.account.FBlogin();
		}
	  });*/
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
			 
			 	fb.account.gobindFB();
		   	} else {
			 	console.log('[1] failed! User cancelled login or did not fully authorize.');
		   	}
		   
		}, {scope: 'email'});
	},
	//注销
	FBlogout:function(){
		console.log('[4] ---------------FBLogout------------------');
		FB.logout(function(res){ 
			
			$("#bind_result").html("");
			
			$("#en_bind_fb").hide();
			$("#un_bind_fb").show();
		})
		
	},
	checkBind : function() {
		console.log('[3] ---------------checkBind------------------');
		
			var cookies_Uuid = opencyou.cookies.read('_open_uuid');
			var url = opencyou.url + "/account/member/checkBind";
			$.ajax({
				type : "get",
				url : url,
				data : {
					uid : cookies_Uuid
				},
				dataType : "json",
				success : function(data) {
					
					if (data != null && data.user_success == true) {
						console.log('[3] Good to see you, ');
						
						$("#un_bind_fb").hide();
						$("#en_bind_fb").show();
						
					}  else{
						
						$("#en_bind_fb").hide();
						$("#un_bind_fb").show();
						
						console.log(data.user_success+"bind faild");
					}
					
				}
			});
			
	},
	
	//去绑定初始化
	gobindFB:function(){
		
		console.log('[2] ---------------init gobindFB------------------');
		FB.api('/me', function(response) {
			
			FB.getLoginStatus(function (response) {
				console.log('[2] --------------getLoginStatus-----------');
				if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
					var uid = response.authResponse.userID; // 取得 UID
					var accessToken = response.authResponse.accessToken; // 取得 accessToken
					
					console.log("[2] UID：" + uid+" accessToken：" + accessToken)
					
					var url = opencyou.url + "/account/member/bindfb";
					$.ajax({
						type : "post",
						url : url,
						data : {
							fbid : uid,
							token : accessToken
						},
						dataType : "json",
						success : function(data) {
							
							if (data != null && data.user_success == true) {
								console.log('[3] 绑定成功  ');
								
								fb.account.checkBind();
								
							} else if(data != null && data.user_success == false && data.error_code==-2){
								console.log("[3] 失败 ,");
								$("#en_bind_fb").hide();
								$("#un_bind_fb").show();
								$("#bind_result").html("FB账号已被其它账号绑定 , <a href='javascript:;' onclick='fb.account.FBlogout()'>换个Facebook账号串联</a>" );
							} else{
								
								$("#en_bind_fb").hide();
								$("#un_bind_fb").show();
								
								$("#bind_result").html("绑定失败");
								
								console.log(data.user_success+"bind faild");
							}
							
						}
					});
					console.log('[2] success !-----------');
				} else {
					window.location.reload();
					console.log('[2] failed !-----------');
				}
			});
		});
		//window.open( opencyou.url + "/loginfb.html" ,"_self");
	}
}


