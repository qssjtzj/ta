$(document).ready(function() {
	rcpay.api.initMenu();
});

var rcpay ={};
rcpay.api = {
	initMenu: function() {
			var select1="";
			var select2="";
			var select3="";
			var select4="";
			var select5="";
			var uri = window.location.href;
			if (uri.indexOf('/pay/payrecord.html') > 0) {
				select1="class='cur'";
			}else if(uri.indexOf('/pay/paycharge.html') > 0){
				select2="class='cur'";
			}else if(uri.indexOf('/pay/paycharge_step') > 0){
				select2="class='cur'";
			}else if(uri.indexOf('/pay/index.html') > 0 ){
				select1="class='cur'"; 
			}else {
				select1="class='cur'";
			}
		var menuString ="<div class='warp'><div class='nav-box'><ul>"
							+"<li "+select1+"> <a href='"+opencyou.url+"/pay/index.html' title='home'>ACCOUNT</a></li>"
							+"<li "+select2+"><a href='"+opencyou.url+"/pay/paycharge.html' title='RECHARGE RC'>RECHARGE RC</a></li>"
							+"<li "+select3+"><a href='"+opencyou.url+"/faq/faqchong.html' title='faq'  target='_blank'>HELP</a></li>"
							//+"<li "+select4+"><a href='"+opencyou.url+"/pay/vip.html' title='open vip'>OPEN VIP</a></li>"
							+"</ul></div></div>";
			
			
			$("#pay-menu").html(menuString);
	},
	initUserInfo : function() {
		var url = opencyou.url + "/account/info/getvip";
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				
				if(data.errordesc=='login failed'){
					
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					
					var u=data.vipInfo;
					var url=opencyou.url+"/PubImgSour/"+u.uid+".png";
					
					$("#l_username").html(data.username);
					$("#l_username2").html(data.username);
//					document.getElementById("l_userimg").src=img;
					document.getElementById("l_userimg").src=url;
				} else {
					
				}
				
			}
		});
	},
	getCard:function(){
		$.ajax({
			type : "post",
			url : opencyou.url + "/rcpay/getshowbi",
			data : {},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success != null
						&& data.user_success == false) {
					
				}else{
					$("#pay_user_cion").html(data.amount);
					$("#pay_user_cion2").html(data.amount);
					$("#balance").html(data.amount);
				}
			}
		});
	},
	getShow:function(){
		$.ajax({
			type : "post",
			url : opencyou.url + "/rcpay/getshowbi",
			data : {},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success != null
						&& data.user_success == false) {
					
				}else{
					$("#pay_user_showbi").html(data.amount);
					$("#pay_user_token").html(data.amount);
				}
			}
		});
	},
	chong:function(){
		//alert($("#cashCheckbox").attr("checked"));
		if(!cashCheckbox.checked){
			alert("Terms Selection!");
			return;
		}
		
		var amount = $("input[type='radio']:checked").val();
		var url = opencyou.url + "/rcpay/getpayurl";
		$.ajax({
			type : "get",
			url : url,
			data : {
				"amount" : amount
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success == true) {
					window.open(data.payurl,"_blank");
					
					var div_dialog=$("#pay_dialog").html();
					$.popbox(div_dialog);
					//window.location.href=""+data.payurl;
					//$('#cypaycontent').empty();
					//$('#cypaycontent').html("<iframe id='payframe' name='displayinhere' width=650px'; height='300px;' src='"+data.payurl+"'></iframe>");
					//$("#payframe").attr("src",data.payurl);//.url(data.payurl);
				} else {
					$("#player_list").html("Load Faild!");
				}
				
			}
		});				
	},
	convert:function(){
		var amount = $("#payRcCoins").val();
		var patrn=/^[1-9][0-9]*$/;
		if (!patrn.exec(amount)){
			alert('请输入正确的支付RC币');
			return false;
		} 
		
		var url = opencyou.url + "/rcpay/chargeshowbi";
		$.ajax({
			type : "post",
			url : url,
			data : {
				"amount" : amount
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success == true) {
					window.location.href=opencyou.url +"/pay/payconvertok.html";
				}else{
					alert(data.error_info);
				}
			}
		});
		
	},	
	closeDialog:function(){
		$("#zxxBlank").remove();
		$(".wrap_out").remove();
	},
	getUserInfo : function() {
		var url = opencyou.url + "/account/info/getinfo";
		
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					
				} else {
					
				}
				
			}
		});
	},
	searchRecord: function (type) {
		var reg = new RegExp("(^|&)atype=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		var atype = 0;
		if (r != null){ 
			atype = unescape(r[2]); 
		}

		if(atype==2){
			type = "exchange";
		}else{
			type="pay";
		}
		
		var box1 = $('#recordListBox1');
		var box2 = $('#recordListBox2');
		var tip = $('#noRecordTip');
		var startTime = $('#d1').val();
		var endTime = $('#d2').val();
		
		if (startTime && endTime) {
			type = type == 'exchange' ? 'exchange' : 'pay';
			var url = opencyou.url  + '/rcpay/findrecord?page_size=12&start=' + startTime + '&end=' + endTime + '&type=' + type;
			$.get(url, function(data) {
				if (findError(data)) {
					return;
				}
				
				box1.add(box2).add(tip).hide();
				var total = parseInt(data);
				if (!isNaN(total)) {
					if (total > 0) {
						if (type == 'pay' && recordPageObj1) {
							recordPageObj1.api = url;
							recordPageObj1.lastSelectPage = 0;
							recordPageObj1.init(total, 'recordPages1', 'recordPageObj1');
							box1.show();
						} else if (type == 'exchange' && recordPageObj2) {
							recordPageObj2.api = url;
							recordPageObj2.lastSelectPage = 0;
							recordPageObj2.init(total, 'recordPages2', 'recordPageObj2');
							box2.show();
						}
					} else {
						tip.show();
					}
				}
			});
		} else {
			alert('您的查询时间不正确，请选择正确的查询时间');
			if (!startTime) {
				$('#d1').focus();
			} else {
				$('#d2').focus();
			}
		}
	}
	
};

