$(document).ready(function() {
	stime.api.stLoginAuth()
});
var stime={};
stime.api = {
	
	stLoginAuth : function() {
		
		var sign = opencyou.utils.getParamFromUrl("winnerloginret");
		
		if(sign==null ||sign==''){
			top.location.href=opencyou.url +"/login_st.html";
		}
		//opencyou.url = "http://www.xiuktv.com";
		var url = opencyou.url + "/account/member/stlogin";
		$.ajax({
			type : "get",
			url : url,
			data : {
				sign : sign
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					top.location.href=opencyou.url +"/index.html";
				} else {
					alert("Failed.");
				}
				
			}
		});
	}
};



