$(document).ready(function() {
  window.fbAsyncInit = function() {
	 FB.init({
		appId      : '588576371254278',//'825205517508302',//'1414880422108125',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
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
	//登陆
	login:function(){
		console.log('[0] ---------------login------------------');
		FB.api('/me', function(response) {
			
			FB.getLoginStatus(function (response) {
				console.log('[0] --------------getLoginStatus-----------');
				//1、登陆FB状态
				if (response.status === 'connected') {
					
					console.log('[0] connected !-----------1、登陆FB状态');
					
					var uid = response.authResponse.userID; // 取得 UID
					var accessToken = response.authResponse.accessToken; // 取得 accessToken
					console.log("[0] UID：" + uid+" accessToken：" + accessToken);
					
					fb.account.quickLogin(uid,accessToken);
				//2、未登陆FB状态
				} else {
					console.log('[0] unconnected !-----------2、未登陆FB状态');
					
					fb.account.FBlogin();
				}
			});
		});
	},
	//FB登录  FaceBook_1405726799709824
	FBlogin:function(){
		console.log('[1] ---------------FBlogin------------------');
		
	 	FB.login(function(response) {
		   	if (response.authResponse) {
			 	console.log('[1] success! Welcome!  Fetching your information.... '+response);
			 	fb.account.login();
			 	
		   	} else {
			 	console.log('[1] failed! User cancelled login or did not fully authorize.');
		   	}
		   
		}, {scope: 'email'});
	},
	//快速登录RC
	quickLogin : function(fbid,token) {
		
		console.log('[2]-------------quickLogin--------------');
		
		FB.api('/me', function(response) {
			
			var new_fbid = response.id;
			var new_username = encodeURIComponent(response.name);
			var new_email = response.email;
			var new_img = "https://graph.facebook.com/"+new_fbid+"/picture";
			
			console.log("[2] "+new_fbid+","+new_username+","+new_email);
			
			var url = opencyou.url + "/account/member/loginfb";
			$.ajax({
				type : "post",
				url : url,
				data : {
					fbid : fbid,
					token : token,
					username:new_username,
					email:new_email
				},
				dataType : "json",
				success : function(data) {
					
					if (data != null && data.user_success == true) {
						console.log('[2] Good to see you, ' + response.name + '.'+response.id);
						
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
						//window.location.href = "center/userCenterInfo.html";
					} else{
						alert("登陆失败");
					}
					
				}
			});
		});
		
	}
	
};


