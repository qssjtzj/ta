$(document).ready(function() {

});

opencyou.api = {
	
	getCode : function() {
		var new_account = $("#test_account").val();
	
		var url = opencyou.url + "/account/user/getcode.json";
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : new_account,
				rtype : 1
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					alert("The Email has been send "+new_account);
				} else {
					alert("Send mail Failed.");
				}
				
			}
		});
	},
	getPwdCode : function() {
		
		var new_account = $("#test_pwdaccount").val();
		var url = opencyou.url + "/account/member/getpwdcode.json";

		$.ajax({
			type : "post",
			url : url,
			data : {
				account : new_account,
				rtype : 1
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					alert("The Email has been send "+new_account);
				} else {
					alert("Send mail Failed.");
				}
				
			}
		});
	}
};


/**
 * 登录相关判断
 */

opencyou.loginInput = {
	check1:false,
	iID:0,
	init:function(){
		this.check1=false;
	},
	initRegInput:function(){
		var cookies_name = opencyou.cookies.read('_user_name');
		var cookies_pwd = opencyou.cookies.read('_user_pwd');
		
		if(cookies_name!=null){
			user_name.value=cookies_name;
		}
		
		if(cookies_pwd!=null){
			user_pwd.value=cookies_pwd;
			$('#user_pwd_01').hide();
			$('#user_pwd').show();
		}
	},
	onChangeUsername : function(){
		var val = user_name.value;
		
		var cookies_name = opencyou.cookies.read('_user_name');
		var cookies_pwd = opencyou.cookies.read('_user_pwd');
		
		if(val!=cookies_name && user_pwd.value=="******"){
			user_pwd.value="";
		}
		
	},
	clearNote : function(id){
		this.iID=setInterval(opencyou.loginInput.onChangeUsername, 500);
		//setTimeout("opencyou.loginInput.onChangeUsername()",100);
		var val =  $('#'+id).val();
		if(val=='Username'){
			 $('#'+id).val("");
		     $('#'+id).css({'color':'#333'});
		}else{
			//$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
		
	},
	checkAccount:function (id){
		var val =  $('#'+id).val();
		clearInterval(this.iID);
		if(val==""){
			 $('#'+id).val('Username');
			 $('#'+id).css({'color':'#999'});
			 opencyou.registerInput.showTip(id,"Required.");
			 
		}else{
			var url = opencyou.url + "/account/member/checkexist";
					$.ajax({
						type : "get",
						url : url,
						data : {
							account : val
						},
						dataType : "json",
						success : function(data) {
							
							if (data != null && data.user_success == true) {
								opencyou.registerInput.showTip(id,1);
								opencyou.registerInput.hideTip(id);
								opencyou.loginInput.check1=true;
								return true;
							} else {
								opencyou.registerInput.showTip(id,"The account is not exist!");
								opencyou.loginInput.check1=false;
								return false;
							}
							
						}
					});
			//
			var cookies_name = opencyou.cookies.read('_user_name');
			var cookies_pwd = opencyou.cookies.read('_user_pwd');
			
			if(val==cookies_name){
				if(cookies_pwd!=null){
					user_pwd.value=cookies_pwd;
					$('#user_pwd_01').hide();
					$('#user_pwd').show();
				}
			}	
		}
		opencyou.loginInput.check1=false;
	},
	
	changePw : function(id , pwd){
		$('#'+id).hide();
		$('#'+pwd).show();
		document.getElementById(pwd).focus();
	 },
	 
	thisPw : function (id ,pwd1){
		var val =  $('#'+id).val();
		if(val==""){
			$('#'+id).hide();
			$('#'+pwd1).show();
		}else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
	 },
	 
	addcss : function (id){
		$('#'+id).css({'color':'#333'});
	 }
};
/**
 * 注册相关判断
 */

opencyou.registerInput = {
	check1:false,
	check2:false,
	check3:false,
	check4:false,
	check5:false,
	check6:false,
	isSubmit:false,
	init:function(){
		this.check1=false;
		this.check2=false;
		this.check3=false;
		this.check4=false;
		this.check5=false;
		this.check6=false;
	},
	initRegInput:function(){
		if(!agreebbrule.checked){
			reg_submit_btn.disabled=false;
			$("#reg_submit_btn").css({'background':'url(../img/btn_submit_dis.jpg)'});
		}else{
			reg_submit_btn.disabled=true;
		}
	},
	clearNote : function(id,_val){
		var val =  this.trim($('#'+id).val());
		if(val==_val){
			 $('#'+id).val("");
		     $('#'+id).css({'color':'#333'});
		}else{
			//$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
		opencyou.registerInput.hideTip(id);
	 },
	hideTip:function(id){
		
		//$('#'+id).css({'background':'url(img/input_bg.jpg)'});
		$('#'+id).removeClass("int_right");
		$('#'+id).removeClass("int_error");
		$('#tip_'+id).removeClass("tip_error");
		$('#tip_'+id).removeClass("tip_right");
		$('#tip_'+id).hide();
	},
	showTip:function(id,val){
		if(val==1){
			$('#tip_'+id).text("");
			$('#tip_'+id).show();
			$('#tip_'+id).removeClass("tip_error");
			$('#tip_'+id).addClass("tip_right");
			$('#'+id).removeClass("int_error");
			$('#'+id).addClass("int_right");
			
		}else{
			//$('#'+id).css({'background':'url(img/input_bg1.jpg)'});
			$('#'+id).addClass("int_error");
			$('#tip_'+id).text(val);
			$('#tip_'+id).show();
			$('#tip_'+id).addClass("tip_error");
		}
	},
	trim:function(str){
		return String.prototype.trim(str);
	},
	checkAccount :function (id){
		var val = this.trim( $('#'+id).val());
		// 1.只能是字母、数字、下划线、点。2、不能以符号为开头。3、长度为5-25个字元
		if(val=="" || val=="Username"){
			 $('#'+id).val('Username');
			 $('#'+id).css({'color':'#999'});
			 opencyou.registerInput.showTip(id,"Required.");
		}else{
			var patrn=/^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[._]){0,24}$/;
			if (!patrn.exec(val)) {
				opencyou.registerInput.showTip(id,"Please fill in the letters or Numbers.");
					
			}else{
				if(val.length>4 && val.length<26){
					
					var url = opencyou.url + "/account/member/checkexist";
					$.ajax({
						type : "get",
						url : url,
						data : {
							account : val
						},
						dataType : "json",
						success : function(data) {
							
							if (data != null && data.user_success == true) {
								opencyou.registerInput.showTip(id,"This account has been used!");
								opencyou.registerInput.check1=false;
								return false;
								
							} else {
								opencyou.registerInput.showTip(id,1);
								opencyou.registerInput.check1=true;
								
								opencyou.registerInput.hideTip('new_password');
								opencyou.registerInput.checkPwd1('new_password');
								return true;
							}
							
						}
					});
					
					
				}else{
					opencyou.registerInput.showTip(id,"Between 5-25 characters.");
				}
			}
			
		}
		//this.check1=false;
		return false;
	},
	checkUsername :function (id){
		var val = this.trim( $('#'+id).val());
		// 长度不能超过16个字
		if(val=="" || val=="Nickname"){
			 $('#'+id).val('Nickname');
			 $('#'+id).css({'color':'#999'});
			 opencyou.registerInput.showTip(id,"Required.");
			 
		}else{
			
			if(val.length>0 && val.length<17){
				opencyou.registerInput.showTip(id,1);
				this.check2=true;
				return true;
			}else{
				opencyou.registerInput.showTip(id,"Between 1~32 characters.");
			}
		}
		this.check2=false;
		return false;
	},
	
	changePw : function(id , pwd){
		$('#'+id).hide();
		$('#'+pwd).show();
		document.getElementById(pwd).focus();
	 },
	 
	thisPw : function (id ,pwd1){
		var val =  $('#'+id).val();
		if(val==""){
			$('#'+id).hide();
			$('#'+pwd1).show();
		}else{
			$('#'+id).val(val);
			$('#'+id).css({'color':'#333'});
		}
	 },
	 
	addcss : function (id){
		$('#'+id).css({'color':'#333'});
		opencyou.registerInput.hideTip(id);
		
		$('#'+id).removeClass("int_error");
		$('#'+id+"_01").removeClass("int_error");
		//$('#'+id+"_01").css({'background':'url(../img/input_bg1.jpg)'});
	 },
	checkPwd1 :function (id){
		var val = this.trim( $('#'+id).val());
		// 1.不能是6位纯数字2、密码不能含有账号信息 。3、长度为6 和20
		if(val==""){
			 opencyou.registerInput.showTip(id,"Required.");
		}else{
			
			if(val.length>5 && val.length<21){
				var patrn=/^[0-9]{6}$/; // /^[0-9]{6,20}$/; 
				if (!patrn.exec(val)) {
					var _account=new_account.value;
					if(val.indexOf(_account)!=-1){
						opencyou.registerInput.showTip(id,"Cannot contain account information.");
					}else{
						opencyou.registerInput.showTip(id,1);
						this.check3=true;
						this.hideTip('password2');
						this.checkPwd2('password2');
						return true;
					}
				}else{
					opencyou.registerInput.showTip(id,"The password is too simple.");
				}
			}else{
				opencyou.registerInput.showTip(id,"Between 6-20 characters.");
			}
		}
		//$('#'+id+"_01").css({'background':'url(../img/input_bg1.jpg)'});
		$('#'+id+"_01").addClass("int_error");
		this.check3=false;
		return false;
	},
	checkPwd2 :function (id){
		var val = this.trim( $('#'+id).val());
		var val1 =  new_password.value;
		// 
		if(val==""){
			 opencyou.registerInput.showTip(id,"Required.");
		}else{
			
			if(val==val1){
				 opencyou.registerInput.showTip(id,1);
				 this.check4=true;
				 return true;
			}else{
				 opencyou.registerInput.showTip(id,"These passwords don't match.");
			}
		}
		$('#'+id+"_01").addClass("int_error");
		this.check4=false;
		return false;
	},
	checkEmail : function(id){
		var val = this.trim( $('#'+id).val());
		//alert(val);
		if(val=="" || val=="Email"){
			 $('#'+id).val('Email');
			 $('#'+id).css({'color':'#999'});
			 opencyou.registerInput.showTip(id,"Required.");
		}else{
			var patrn = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,4}$/;
			//var patrn = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,3}$/;
			
			// var patrn =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if (!patrn.exec(val)) {
				opencyou.registerInput.showTip(id," An invalid email format.");
			//}
			//if(val.indexOf('@')==-1 || val.indexOf('.')==-1){
			//	opencyou.registerInput.showTip(id,"电邮格式错误");
				
			}else if(val.length<6 || val.length>64){
				opencyou.registerInput.showTip(id," An invalid email format.");
			}else{
				opencyou.registerInput.showTip(id,1);
				this.check5=true;
				return true;
			}
		}
		this.check5=false;
		return false;
	},
	checkCode : function(id){
		var val = this.trim( $('#'+id).val());
		if(val=="" || val=="Verification Code"){
			 $('#'+id).val('Verification Code');
			 $('#'+id).css({'color':'#999'});
			 opencyou.registerInput.showTip(id,"Required.");
		}else{
			
			if(val.length<5){
				opencyou.registerInput.showTip(id,"Error.");
			}else{
				var url = opencyou.url + "/account/member/validcode";
				$.ajax({
					type : "get",
					url : url,
					data : {
						seccode : val
					},
					dataType : "json",
					success : function(data) {
						
						if (data != null && data.user_success == true) {
							opencyou.registerInput.showTip(id,1);
							opencyou.registerInput.check6=true;
							return true;
						} else {
							opencyou.registerInput.showTip(id,"Incorrect code.");
							opencyou.registerInput.check6=false;
							return false;
						}
						
					}
				});
				
			}
		}
		//opencyou.registerInput.showTip(id,"请填入正确验证码");
		this.check6=false;
		return false;
	},

	submitLoginFB:function(){
		this.checkAccount("new_account");
		this.checkUsername("new_username");
		this.checkPwd1("new_password");
		this.checkPwd2("password2");
		this.checkEmail("new_email");
		
		//alert("-------------" +this.check1+","+this.check2+","+this.check3+","+this.check4+","+this.check5);
		if(this.check1 && this.check2 && this.check3 && this.check4 && this.check5 ){
			this.createFBUser();
		}else{
			$("#tip_form").html("Please correct and try again.");
			//$('#tip_form').show();
		}
		
	},
	submitLogin:function(){
		
		this.checkAccount("new_account");
		this.checkUsername("new_username");
		this.checkPwd1("new_password");
		this.checkPwd2("password2");
		this.checkEmail("new_email");
		this.checkCode("new_seccode");
		
		if( !this.isSubmit ){
			
			//alert("-------------" +this.check1+","+this.check2+","+this.check3+","+this.check4+",5="+this.check5+","+this.check6);
			//this.check1 && && this.check6
			if(this.check2 && this.check3 && this.check4 && this.check5 ){
				this.isSubmit=true;
				this.createUser();
			}else{
				$("#tip_form").html("Please correct and try again.");
				//$('#tip_form').show();
			}
		}
		
		
	},
	createUser : function() {
		
		var new_account = this.trim($("#new_account").val());
		var new_username = this.trim($("#new_username").val());
		var new_password = this.trim($("#new_password").val());
		var new_email = this.trim($("#new_email").val());
		
		var new_seccode = this.trim($("#new_seccode").val());
		
		if(!agreebbrule.checked){
			$("#tip_form").html(" Please check the terms!");
			this.isSubmit=false;
			return false;
		}
		
		var url = opencyou.url + "/account/member/register";
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : new_account,
				username : encodeURIComponent(new_username),
				pwd : new_password,
				email : new_email,
				seccode : new_seccode
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					
					window.location.href="register_success.html?account="+new_account;
					
				} else {
					if(data.error_code==2){
						$("#tip_new_account").html("This account has been used!");
					//}else if(data.error_cod==-2){
					//	$("#tip_form").html("验证码错误");
					
					}else{
						$("#tip_form").html("Signup failed,please correct and try again.");
					}
					$('#tip_form').show();
					opencyou.registerInput.updateseccode();
				}
				
			}
		});
		
		this.isSubmit=false;
	},
	createFBUser : function() {
		var new_account = this.trim($("#new_account").val());
		var new_username = this.trim($("#new_username").val());
		var new_password = this.trim($("#new_password").val());
		var new_email = this.trim($("#new_email").val());
		//alert(new_username+"-------------"+encodeURI(new_username));
		var bind_fb= $("#fb_bind").val();
		var fb_id= $("#fb_id").val();
		var fb_token= $("#fb_token").val();
		
		if(!agreebbrule.checked){$("#tip_form").html("Please check the terms!");return false;}
		
		var url = opencyou.url + "/account/member/registerfb";
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : new_account,
				username : encodeURI(new_username),
				pwd : new_password,
				email : new_email,
				bind_fb:bind_fb,
				fbid:fb_id,
				token:fb_token
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					
					window.location.href="register_success.html?account="+new_account;
					
				} else {
					if(data.error_code==2){
						$("#tip_form").html("This facebook account has been used!");
					}else if(data.error_cod==-1){
						$("#tip_form").html("Please correct and try again.");
					
					}else{
						$("#tip_form").html("Signup failed,please correct and try again.");
					}
					$('#tip_form').show();
					opencyou.registerInput.updateseccode();
				}
				
			}
		});
	},
	updateseccode : function(){
		document.getElementById("sec_code").src="/validateCodeServlet?d="+new Date();
	}
};
/*
String.prototype.trim = function(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
*/
