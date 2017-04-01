$(document).ready(function() {
	var url = opencyou.url + "/account/member/online";
	$.ajax({
		type : "post",
		url : url,
		data : {},
		dataType : "json",
		success : function(data) {
			if (data != null && data.user_success != null
					&& data.user_success == false) {
				window.parent.parent.location.href=opencyou.url +"/login.html";
			}
		}
	});
});

function submit(){
	var amount = $('input:radio:checked').val();
	var url = opencyou.url + "/rcpay/getpayurl";
	$.ajax({
		type : "get",
		url : url,
		data : {
			"amount" : amount
		},
		dataType : "json",
		success : function(data) {
			console.log(data);
			if (data != null && data.success == true) {
				$("#payframe").attr("src",data.payurl);//.url(data.payurl);
			} else {
				console.log(data.error_info);
				$("#player_list").html("加载失败");
			}
			
		}
	});
}

var rcpay ={};
rcpay.api = {
	init : function() {
		this.init();
	},
	init : function() {
		var url = opencyou.url + "/rcpay/getpayurl";
		$.ajax({
			type : "get",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				console.log(data);
				if (data != null && data.success == true) {
					$("#payframe").attr("src",data.payurl);//.url(data.payurl);
				} else {
					$("#player_list").html("加载失败");
				}
				
			}
		});
	}
};
