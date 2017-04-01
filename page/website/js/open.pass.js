var opencyou_url="";

$(document).ready(function() {
	var url = window.location.href;
	var pos=url.indexOf('/open',7);
	if(pos>0){
		url=url.substring(0,pos+5);
	}else{
		pos=url.indexOf('/',7);
		if(pos>0){
			url=url.substring(0,pos);
		}
	}
	opencyou_url=url;
});

var rcopen ={};

rcopen.api = {
	
	gatemail : function() {
		var saccount=account.value;
		var scode=seccode.value;
		if(!rcopen.checkInput.checkEmpt('account') || !rcopen.checkInput.checkEmpt('seccode')){
			return falses;
		}
		
		var url = opencyou_url + "/account/member/gatemail";
		
		$.ajax({
			type : "get",
			url : url,
			data : {
				account:saccount,
				seccode:scode
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					var u_email=data.user_email;
					
					//$("#getpass_step_1").hide();
					//$("#getpass_step_2").show();
					//$("#account_val").html(saccount);
					//$("#email_val").html(u_email);
					window.location.href="sendpass.html?name="+data.account+"&mail="+u_email;
				} else {
					if( data.error_code==-2){
						$("#tip_form_tep1").html("Incorrect code!");
					}else{
						$("#tip_form_tep1").html("The account is not exist!");
					}
					opencyou.topnav.updateseccode('sec_code');
				}
				
			}
		});
	},
	initSendMail:function(){
		var u_account = opencyou.utils.getParamFromUrl("name");
		var u_mail = opencyou.utils.getParamFromUrl("mail");
		//alert(u_account+","+u_mail);
		$("#account_val").html(u_account);
		$("#email_val").html(u_mail);
		
	},
	sendPwdCode:function(){
		var url = opencyou_url + "/account/member/getpwdcode";
		var saccount = $("#account_val").html();
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				account : saccount
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					$("#email_val1").html(data.user_email);
					
					$("#getpass_step_2").hide();
					$("#getpass_step_2_r").show();
				}else{
					$("#tip_form").html("Send mail failed!");
				}
			}
		});
	},
	
	initUpdateForm:function(){
		
		var u_account = opencyou.utils.getParamFromUrl("account");
		var u_uid = opencyou.utils.getParamFromUrl("uid");
		var u_code =opencyou.utils.getParamFromUrl("code");
		
		$("#new_account").html(u_account);
		new_uid.value=u_uid;
		new_code.value=u_code;
		//alert(u_account+" , "+u_uid+" , "+u_code);
	},
	updatePwdForm:function(){
		$("#tip_form").html("");
		var suid=new_uid.value;
		var saccount=$("#new_account").html();
		var spwd=new_pwd.value;
		var scode=new_code.value;
		
		if(!rcopen.checkInput.check1 || !rcopen.checkInput.check2){
			return false;
		}
		//验证
		var url = opencyou_url + "/account/member/resetpwd";
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				uid:suid,
				account:saccount,
				pwd:spwd,
				code:scode
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					
					$("#getpass_step_3").hide();
					$("#getpass_step_3_r").show();
				}else if(data.error_code==-1||data.error_code==-2){
					$("#tip_form").html("Password between 6-20 characters,and cannot contain account information.");
				}else if(data.error_code==-3){
					$("#tip_form").html("Not the same as the original password!");
				}else if(data.error_code==-4){
					$("#tip_form").html("Link invalid or has expired!");
				}else{
					$("#tip_form").html("Change password failed,please correct and try again.");
				}
			}
		});
	},
	initActive:function(){
		//common/active.html?rtype=1&uid="+user.getId()+"&code="+code
		var u_uid = opencyou.utils.getParamFromUrl("uid");
		var u_code =opencyou.utils.getParamFromUrl("code");
		//验证
		var url = opencyou_url + "/account/member/activate";
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				uid:u_uid,
				code:u_code
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					$("#active_e").hide();
					$("#active_r").show();
					$("#email_val").html(data.user_mail);
					user_val.value=data.user_name;
				}else{
					$("#active_r").hide();
					$("#active_e").show();
				}
			}
		});
		
	},
	activeModifyPwd:function(){
		var u_name = user_val.value;
		var u_mail = $("#email_val").html();
		
		window.location.href=opencyou_url+"/common/sendpass.html?name="+u_name+"&mail="+u_mail;
	}

};


rcopen.checkInput={
	check1:false,
	check2:false,
	hideTip:function(id){
		
		$('#tip_'+id).removeClass("tip_error");
		$('#tip_'+id).removeClass("tip_right");
		$('#tip_'+id).hide();
	},
	showTip:function(id,val){
		if(val==1){
			$('#tip_'+id).text("");
			$('#tip_'+id).show();
			$('#tip_'+id).addClass("tip_right");
			
		}else{
			$('#tip_'+id).text(val);
			$('#tip_'+id).show();
			$('#tip_'+id).addClass("tip_error");
		}
	},
	checkEmpt:function(id){
		var val =  String.prototype.trim($('#'+id).val());
		if(val==""){
			 rcopen.checkInput.showTip(id,"Required.");
			 return false;
		}else{
			rcopen.checkInput.showTip(id,"");
			return true;
		}
	},
	
	checkPwd:function(id){
		var val =  String.prototype.trim($('#'+id).val());
		if(val==""){
			 rcopen.checkInput.showTip(id,"Required.");
		}else{
			if(val.length>5 && val.length<21){
				var patrn=/^[0-9]{6}$/; // /^[0-9]{6,20}$/; 
				if (!patrn.exec(val)) {
					var _account=$("#new_account").html();
					if(val.indexOf(_account)!=-1){
						rcopen.checkInput.showTip(id,"Password cannot contain account information.");
					}else{
						rcopen.checkInput.showTip(id,1);
						this.check1=true;
						this.checkPwd2('new_pwd1');
						return true;
						
					}
				}else{
					rcopen.checkInput.showTip(id,"The password is too simple.");
				}
			}else{
				rcopen.checkInput.showTip(id,"Between 6-20 characters.");
			}
		}
		this.check1=false;
	},
	checkPwd2:function(id){
		
		//rcopen.checkInput.hideTip(id);
		var val =   String.prototype.trim($('#'+id).val());
		if(val==""){
			 rcopen.checkInput.showTip(id,"Required.");
		}else if(val!=new_pwd.value){
			 rcopen.checkInput.showTip(id,"These passwords don't match.");
		}else{
			rcopen.checkInput.showTip(id,1);
			this.check2=true;
			return true;
		}
		this.check2=false;
	}

};

