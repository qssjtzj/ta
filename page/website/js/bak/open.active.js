$(document).ready(function() {
	
	rcactive.api.init();
});

var rcactive ={};
rcactive.api = {
	init : function() {
		//alert(language.language);
		this.initImage();
		this.initActive();
		this.initAnchor();
	},
	initImage : function() {
		var url = opencyou.url + "/business/image/list";
		var lang = language.language;
		$.ajax({
			type : "get",
			url : url,
			data : {
				limit:4,
				code:lang	
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					
					var div = '<ul class="imgList">';
					for(var i in data.list){
						if(i==0){
							div+='<li class="cur" > <a href="javascript:void(0)" target="_blank" title=""><img src="../'+data.list[i].imageUrl+'" width="990" height="335" border="0" /></a>  </li>';
						}else{
							div+='<li class="" > <a href="javascript:void(0)" target="_blank" title=""><img src="../'+data.list[i].imageUrl+'" width="990" height="335" border="0" /></a>  </li>';
						}
						
					}
               		div+='</ul>';
					
            		div+=' <div class="btn clearfix imgBtnList">';
					for(var i in data.list){
						if(i==0){
							div+='<a class="now_a" href="javascript:;"></a>';
						}else{
							div+='<a class="" href="javascript:;"></a>';
						}	
					}
            		div+='</div>';
					
					$("#player_list").html(div);
					scrollImg();
					
				} else {
					$("#player_list").html("加载失败");
				}
				
			}
		});
	},
	page:function(no){
		$("#active_list").attr("pageNo",no);
		this.initActive();
	},
	initActive : function() {
		var url = opencyou.url + "/business/active/list";
		var lang = language.language;
		var pageNo = $("#active_list").attr("pageNo");
		var pageSize = $("#active_list").attr("pageSize");
		var start=(pageNo-1)*pageSize;
		
		$.ajax({
			type : "get",
			url : url,
			data : {
				start:start,
				limit:pageSize,
				code:lang
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					var div="";
					for(var i in data.list){
						
						 div+='<div class="left_one"> <div class="one optiond">'
								+'<img src="../'+data.list[i].activeImage+'" class="optiond" width="650" height="150" border="0" />'
								+'<a href="javascript:void(0)" class="optiond" > <div class="icon_play optiond"></div> 点击看详情</a>'
							+'</div>'
							+'<div class="one_list" style=" display:none;">'
								+'<div>'
									+'<p><span>活动主题：</span> '+ data.list[i].activeTitle +'</p>'
									/*+'<p><span>活动时间：</span>'+ data.list[i].activeTime +'</p>'
									+'<p><span>活动频道：</span>'+ data.list[i].activeGroup +'</p>'*/
									
									+'<div class="pt5">'+data.list[i].activeContent+'</div>'
								+'</div>'
								+'<div class="foot">'
									+'<a href="javascript:void(0)" class="">点击收起</a><span class="icon_up"></span>'
								+'</div>'
							+'</div>'
						+'</div>';
					}
					$("#active_list").html(div);
					scrollLeft();
					
				} else {
					$("#active_list").html("加载失败");
				}
				
			}
		});
		
		url = opencyou.url + "/business/active/counts";
		$.ajax({
			type : "get",
			url : url,
			data : {
				code:lang
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success == true) {
					var counts = data.counts;
					var num = counts/pageSize;
					var page_all = Math.ceil(num);//总页数向上取整
					
					var div='';
					if(pageNo==1){
						div+='<li class="disabled"><a href="javascript:void(0)">首页</a></li>'
                      		+'<li class="disabled"><a href="javascript:void(0)">上一页</a></li>';
					}else{
						div+='<li class=""><a href="javascript:rcactive.api.page(1)">首页</a></li>'
                      		+'<li class=""><a href="javascript:rcactive.api.page('+(parseInt(pageNo)-1)+')">上一页</a></li>';
					}
					for( var i=1;i<=page_all ;i++){
						if(i==pageNo){
							div+='<li class="active"><a href="javascript:void(0)" class="_4q_b" >'+i+'</a></li>';
						}else{
							div+='<li class=""><a href="javascript:rcactive.api.page('+i+')" class="_4q_b" >'+i+'</a></li>';
						}
					}
					
					if(pageNo==page_all){
						div+='<li class="disabled"><a href="javascript:void(0)">下一页</a></li>'
                        	+'<li class="disabled"><a href="javascript:void(0)">尾页</a></li>';
					}else{
						div+='<li class=""><a href="javascript:rcactive.api.page('+(parseInt(pageNo)+1)+')">下一页</a></li>'
                        	+'<li class=""><a href="javascript:rcactive.api.page('+page_all+')">尾页</a></li>';
					}
					
					$("#page_list").html(div);
					
				}
			}
		});
	},
	initAnchor : function() {
		var url = opencyou.url + "/business/anchor/list";
		var lang = language.language;
		
		$.ajax({
			type : "get",
			url : url,
			data : {
				limit:5,
				code:lang
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					var div="";
					for(var i in data.list){
						if(i==0){
							div+=' <div class="right_one open">'
								+'<a class="one">'
								+'	<div class="headimg fl">'
								+'		<img src="../'+data.list[i].smallIcon+'" class="optiond" width="90" height="90" border="0" />'
								+'		<div class="toolbar"> <span class="icon rankid">1</span></div>'
								+'	</div>'
								+'	<ul class="fl">'
								+'		<li class="title">'+data.list[i].anchorName +'</li>'
								+'		<li>RC ID：'+data.list[i].anchorRcid+'</li>'
								+'		<li>群组ID：'+data.list[i].groupIds+'</li>'
								+'		<li>Popularity：'+data.list[i].popularity+'</li>'
								+'	</ul>'
								+'</a>'
								+'<div class="one_list" style=" display:block;">'
								+'	<img src="../'+data.list[i].imageIcon1+'" width="242" height="300" border="0"/>'
								+'	<img src="../'+data.list[i].imageIcon2+'" width="242" height="300" border="0"/>'
								+'</div>'
								+'</div>';
						}else{
							div+=' <div class="right_one">'
								+'<a class="one">'
								+'	<div class="headimg fl">'
								+'		<img src="../'+data.list[i].smallIcon+'" class="optiond" width="90" height="90" border="0" />'
								+'		<div class="toolbar"> <span class="icon rankid2">'+(parseInt(i)+1)+'</span></div>'
								+'	</div>'
								+'	<ul class="fl">'
								+'		<li class="title">'+data.list[i].anchorName +'</li>'
								+'		<li>RC ID：'+data.list[i].anchorRcid+'</li>'
								+'		<li>群组ID：'+data.list[i].groupIds+'</li>'
								+'		<li>Popularity：'+data.list[i].popularity+'</li>'
								+'	</ul>'
								+'</a>'
								+'<div class="one_list" style=" display:none;">'
								+'	<img src="../'+data.list[i].imageIcon1+'" width="242" height="300" border="0"/>'
								+'	<img src="../'+data.list[i].imageIcon2+'" width="242" height="300" border="0"/>'
								+'</div>'
								+'</div>';
						}
					}
					
					$("#anchor_list").html(div);
					scrollRigth();
					
				} else {
					$("#anchor_list").html("加载失败");
				}
				
			}
		});
		
	}
};

function scrollImg(){
	
	jQuery(function() {
		function u() {
			s = r, e.css({opacity: "0","z-index": "2"}), e.eq(s).css({opacity: "0.5","z-index": "3"}), r++, r == e.length && (r = 0), e.eq(r).css({"z-index": "4"}).animate({opacity: "1"}, 800), t.eq(r).addClass("now_a").siblings("a").removeClass("now_a")
		}
		var e = $(".playImg .imgList").children("li"), t = $(".playImg .imgBtnList").children("a"), n = e.length, r = 0, i = 6e3, s = n - 1, o = setInterval(u, i);
		t.each(function(e) {
			$(this).click(function() {
				r = e - 1, u()
			})
		}), $(".playImg .prev").click(function() {
			r <= 0 && (r = n), r -= 2, u()
		}), $(".playImg .next").click(function() {
			r >= n - 1 && (r = -1), u()
		}), $(".playImg").hover(function() {
			clearInterval(o)
		}, function() {
			o = setInterval(u, i)
		})
	})
}
function scrollLeft(){
//$(document).ready(function() {
	$(".left_one .one img").mouseover(function(event) {
		$(".left_one .one a").hide();
		if (!$(this).parent().hasClass("closed")  ) {
			$(this).parent().find("a").show();
		}
		//this.parent().parent().slideDown();
		
	});
	
	$(document).mouseover(function(event) {
		if (!$(event.target).hasClass("optiond")  ) {
			$(".left_one .one a").hide();
		}
	});		
	
	$(".left_one .one a").click(function(e) {
		$(".left_one .one_list").slideUp();
		$(this).parent().parent().find(".one_list").slideDown();
		
		$(".left_one .one").removeClass("closed");
		$(this).parent().addClass("closed");
		
		$(".left_one .one a").hide();
		
    });
	$(".left_one .one_list .foot a").click(function(e) {
		$(this).parent().parent().slideUp();	
		$(".left_one .one").removeClass("closed");
	});
	
	$(".left_one .one img").click(function(event) {
		if (!$(this).parent().hasClass("closed")  ) {
			
		}else{
			$(".left_one .one_list").slideUp();
			$(".left_one .one").removeClass("closed");
			$(this).parent().find("a").show();
		}
	});
	
//});
}
function scrollRigth(){
	
	$(".right_one .one").click(function(event) {
		if (!$(this).parent().hasClass("open")  ) {
			$(".right_one .one_list").slideUp();
			$(this).parent().find(".one_list").slideDown();
			
			$(".right_one").removeClass("open");
			$(this).parent().addClass("open");
		}else{
			
		}
	});
}