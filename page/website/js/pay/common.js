function geturl(){
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
//	url=url+"/rcshow";
	return url;
}

$(document).ready(function() {
	$.ajax({
		type : "post",
		url : geturl() + "/account/member/online",
		data : {},
		dataType : "json",
		success : function(data) {
			if (data != null && data.user_success != null
					&& data.user_success == false) {
				window.parent.parent.location.href=geturl() +"/login.html";
			}
		}
	});
	
	$.ajax({
		type : "get",
		url : geturl() + "/rcpay/getshowbi",
		data : {},
		dataType : "json",
		success : function(data) {
			if (data != null && data.user_success != null
					&& data.user_success == false) {
				
			}else{
				$("#balance").val(data.amount);
				$("#balance").html(data.amount);
				
				$("#hasRcCoins").val(data.amount);
				$("#hasRcCoins").html(data.amount);
			}
		}
	});
});



