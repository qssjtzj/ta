$(document).ready(function() {

});

var rcgroup ={};
rcgroup.api = {
	
	init : function() {
		
	}
};


rcopen.checkInput={
	check1:false,
	check2:false,
	check3:false,
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
	checkEmail:function(id){
		var val =  String.prototype.trim($('#'+id).val());
		
		if(val==""){
			 rcopen.checkInput.showTip(id,"必填项");
		}else{
			var patrn = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,4}$/;
			//var patrn = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,3}$/;
			//var patrn =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9])*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if (!patrn.exec(val)) {
				rcopen.checkInput.showTip(id,"电邮格式错误");
			//}
			//if(val.indexOf('@')==-1 || val.indexOf('.')==-1){
			//	rcopen.checkInput.showTip(id,"电邮格式错误");
			}else if(val.length<6 || val.length>64){
				rcopen.checkInput.showTip(id,"电邮格式错误!");
			}else{
				rcopen.checkInput.showTip(id,1);
				return true;
			}
		}
		return false;
	},
	checkOldEmail:function(id){
		if(rcopen.checkInput.checkEmail(id)){
			this.check1=true;
			this.checkNewEmail('new_email');
			//this.checkNewEmail2('new_email_01');
			return true;
		}
		this.check1=false;
		return false;
	},
	checkNewEmail:function(id){
		if(!rcopen.checkInput.checkEmail(id)){
			this.check2=false;
			return false;
		}else{
			var val =  $('#'+id).val();
			
			if(val==old_email.value){
				 rcopen.checkInput.showTip(id,"不能与原邮箱地址相同");
			}else{
				rcopen.checkInput.showTip(id,1);
				this.checkNewEmail2('new_email_01');
				this.check2=true;
				return true;
			}
		}
		this.check2=false;
		return false;
	},
	checkNewEmail2:function(id){
		if(!rcopen.checkInput.checkEmail(id)){
			this.check3=false;
			return false;
		}else{
		
			var val =  $('#'+id).val();
			
			if(val!=new_email.value){
				 rcopen.checkInput.showTip(id,"两次输入的邮箱地址不同");
			}else{
				rcopen.checkInput.showTip(id,1);
				//this.checkNewEmail('new_email');
				this.check3=true;
				return true;
			}
		}
		this.check3=false;
		return false;
	},
	checkUsername:function(id){
		
		var val =  String.prototype.trim($('#'+id).val());
		if(val==""){
			rcopen.checkInput.showTip(id,"必填项");
		}else if(val.length<1 || val.length>16){
			 rcopen.checkInput.showTip(id,"昵称不能超过16个字符");
		}else{
			rcopen.checkInput.showTip(id,1);
			return true;
		}
		return false;
	},
	textCounter:function (field, maxlimit) { 
		
		if (field.value.length > maxlimit){ 
			field.value = field.value.substring(0, maxlimit); 
			remLen.value="字数不能超过"+maxlimit;
			
		}else{ 
			remLen.value="";
			//document.upbook.remLen.value = maxlimit - field.value.length; 
		} 
	} 



};

