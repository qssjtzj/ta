
function sayToTa(nick,val,type){
	var current =false;
	$("#preUserSug ul li").each(function(){
		var uid = $(this).attr("u");
		if(uid == val){current = true;}
	});
	
	if(!current ){
		$("#preUserSug ul").append("<li u='"+val+"' t='"+type+"' class=''>"+nick+"</li>");
	}
	
	if(type==0){//悄悄说
		$("#privCheckbox").prop("disabled",false);   
		$("#privCheckbox").prop("checked", true);
	}else {
		$("#privCheckbox").prop("disabled",false);   
		$("#privCheckbox").prop("checked", false);
	}
	to_select_chat.value=nick;
	to_select_uid.value=val;
	
	$("#to_select_chat").addClass("select");
	//to_select_chat.u=val;
	document.getElementById("userManager").style.visibility = "hidden";
}
//拖拽时禁止选中文字
window.isDrag=false;
document.getElementById("chat_scroll").onselectstart = disableselect;
function disableselect(){ if(window.isDrag){ return false;}}

var scrollReload = function(){
	$(".chatMsgItem div var").click(function(event) {
		var u = $(this).attr("u");
		var n = event.target.innerHTML; 
		var drag = document.getElementById("userManager");
		$(drag).html("");
		//var div=' <div class="userWrap"><a href="javascript:sayToTa(\''+n+'\','+u+')" class="say_pri">Whisper to '+ n +'</a></div>';
		
		var div=' <div class="userWrap"><a href="javascript:;" class="nick" >'+n+'</a><a href="javascript:sayToTa(\''+n+'\','+u+',1)" class="say_pri">对他说</a><a href="javascript:sayToTa(\''+n+'\','+u+',0)" class="say_pri">对他悄悄说</a></div>';
		$(drag).append(div);
		
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);    
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);    
		drag.style.left = (event.clientX+scrollLeft)+"px";
		drag.style.top = (event.clientY+scrollTop)+"px";
		drag.style.visibility = "visible";
	});
	$(".chatUser li").click(function(event) {
		var l = $(this).attr("l");
		if(l=='' || l<=0){
			var drag = document.getElementById("userManager");
			drag.style.visibility = "hidden";
			return false;
		}
		var u = $(this).attr("id").split("_")[2];
		var n = $(this).attr("n");
		var drag = document.getElementById("userManager");
		$(drag).html("");
		//var div=' <div class="userWrap"><a href="javascript:sayToTa(\''+n+'\','+u+')" class="say_pri">Whisper to '+ n+'</a></div>';
		var div=' <div class="userWrap"><a href="javascript:;" class="nick" >'+n+'</a><a href="javascript:sayToTa(\''+n+'\','+u+',1)" class="say_pri">对他说</a><a href="javascript:sayToTa(\''+n+'\','+u+',0)" class="say_pri">对他悄悄说</a></div>';
		
		$(drag).append(div);
		
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);    
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);  
		 
		drag.style.left = (event.clientX+scrollLeft)+"px";
		drag.style.top = (event.clientY+scrollTop)+"px";
		drag.style.visibility = "visible";
	});
	$(document).click(function(event) {
		if (!$(event.target).hasClass("say_pri")  ) {
			var drag = document.getElementById("userManager");
			drag.style.visibility = "hidden";
		}
	});
	
};

$(function() {
	//主播名字点击弹出框
	scrollReload();

	//选择聊天对象
	$(".to_name *").click(function(event) {
		document.getElementById("preUserSug").style.left= 10+'px';
		//var h = $("#preUserSug").height();
		document.getElementById("preUserSug").style.bottom= 29+'px';
	
		$("#preUserSug").show();
		$(".input_text").css('border-color','#ccc');
		
		$(".preUserSug ul li").click(function(event) {
			var u = event.target.getAttribute("u");
			var n = event.target.innerHTML;
			var t = event.target.getAttribute("t");
			
			to_select_chat.value=n;
			//to_select_chat.u=u;
			to_select_uid.value=u;
			
			$("#to_select_chat").removeClass("select");
			
			/*
			if(t==0){
				$("#privCheckbox").prop("checked", true);
			}else{
				$("#privCheckbox").prop("checked", false);
			}
			*/
			if(u!=0){
				$("#privCheckbox").prop("disabled",false);     
				$("#to_select_chat").addClass("select");
			}else{
				$("#privCheckbox").prop("disabled",true); 
				$("#privCheckbox").prop("checked", false);
			}
			
		});
		$(".preUserSug ul li").mouseover(function(event) {
			$(this).parent().find("li").css('background','#fff');
			$(this).css('background','#ececec');
		});
		
		$(document).click(function(event) {
			if (!$(event.target).hasClass("uoption")  ) {
				$("#preUserSug").hide();
				$(".input_text").css('border-color','#e4e3e3');
			}
		});
	});

	//上下拖拽聊天框
	var drag = document.getElementById('watch_chat_slideBar');
	if(document.attachEvent){
		drag.attachEvent('onmousedown',dragHandle);
	}else{
		drag.addEventListener('mousedown', dragHandle,false);
	}
	function dragHandle(event){
		var event = event||window.event;
		var startY = drag.offsetTop;
		var mouseY = event.clientY;
		var deltaY = mouseY - startY;
		//console.log(">>",mouseY,startY);
		window.isDrag=true;
		if(document.attachEvent){
			drag.attachEvent('onmousemove',moveHandle);
			drag.attachEvent('onmouseup',upHandle);
			drag.attachEvent('onlosecapture',upHandle);
			drag.setCapture();
		}else{
			document.addEventListener('mousemove',moveHandle,true);
			document.addEventListener('mouseup',upHandle,true);
		}
		
		function moveHandle(event){
			var event = event||window.event;
			
			var s_height = (event.clientY - deltaY)- drag.offsetHeight;
			var p_height = $(".chat_scroll").height()-s_height-32;
			
			if(p_height >50 && p_height<350){
				drag.style.top = (event.clientY - deltaY)+"px";
				$("#chatMsg").height(s_height-13);
				$("#chat_private").height(p_height - 5);
			}else{
				
			}
			
		}
		function upHandle(){
			if(document.attachEvent){
				drag.detachEvent('onmousemove',moveHandle);
				drag.detachEvent('onmouseup',upHandle);
				drag.detachEvent('onlosecapture',upHandle);
				drag.releaseCapture();
			}else{
				document.removeEventListener('mousemove',moveHandle,true);
				document.removeEventListener('mouseup',upHandle,true);
			}
			window.isDrag=false;
		}
	
	}	


});

window.WebScroll = {};
WebScroll.gift = {
        scrlSpeed: 1,
		loop: 1,
        interval: {},
		doing:0,
		startTime:0,
		conf:function(obj){
			this.scrlSpeed=obj.scrlSpeed;
			this.loop=obj.loop;
			this.interval=obj.interval;
		},
		init:function(){
			this.scrlSpeed=(document.all)? this.scrlSpeed : Math.max(1, this.scrlSpeed-1);
		},
		initScroll: function (container,object){
			
			if (document.getElementById(container)!=null && document.getElementById(object)!=null){
				
				var contObj=document.getElementById(container);
				var obj=document.getElementById(object);
				
				contObj.style.visibility = "visible";
				contObj.scrlSpeed = this.scrlSpeed;
				var widthContainer = contObj.offsetWidth;
				obj.style.left=parseInt(widthContainer)+"px";//860px
				
				var widthObject=obj.offsetWidth;
				
				WebScroll.gift.startTime = new Date().getTime(); 
				var interval=window.setInterval("WebScroll.gift.objScroll('"+ container +"','"+ object +"',"+ widthContainer +","+WebScroll.gift.startTime+")",10);
				
				this.interval[object] = interval;
				//console.log("=========",interval,object);
			}
		},
		objScroll:function(container,object,widthContainer,startTime){
			
			var contObj=document.getElementById(container);
			var obj=document.getElementById(object);
			parentWidth = contObj.offsetWidth;
			widthObject=obj.offsetWidth;
			
			var nowTime = new Date().getTime(); 
			var pos = Math.round((nowTime-WebScroll.gift.startTime)/10);
			
			var scrlSpeed = contObj.scrlSpeed;
			
			if (parseInt(obj.style.left)>(widthObject*(-1))){
				
				if(pos<150){
					obj.style.left=parentWidth-2*pos*scrlSpeed+"px";
				}else if(pos>parentWidth+150){
					obj.style.left= (parentWidth-pos*scrlSpeed)*2+"px";
				}else{
					obj.style.left=parentWidth-150-pos*scrlSpeed+"px";
				}
			} else {
				//循环
				obj.style.left=parseInt(widthContainer)+"px";
				WebScroll.gift.startTime = new Date().getTime(); 
				
				/*
				clearInterval(this.interval[object]);
				$("#"+object).remove();
				delete this.interval[object];
				*/
			}
			
		},
		clearIntervals:function(){
			
			for(var i in this.interval){
				//console.log("=========",i,this.interval[i]);
				clearInterval(this.interval[i]);
				
				var html=$("#"+i).html();
				var sid = $("#"+i).attr("sid");
				var n = $("#"+i).attr("n");
				var d = new Date().getTime();
				var div = '<div id="animate_'+d+'" class="animate" sid="'+sid+'" n="'+n+'">'+html+'</div>';
				
				
				if( $("#Scroller_static").find(".animate").length<=0){
					$("#Scroller_static").append(div);
				}else{
					var len = 0;
					$("#Scroller_static .animate").each(function(){
						if(len==0){
							$(this).before(div);
						}else if(len>=2){
							$(this).remove();
						}
						len++;
					});
				}
				/*
					//点击跑马灯事件
				$("#animate_"+d).click(function(){
					var sid = $(this).attr("sid");
						var n = $(this).attr("n");
					var div_dialog="<div class='defaultDialog'><div class='login_close'><img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div><p class=' tc mt10 fts20'>确定离开本直播室，进入<font color='#ea821c'>"+n+"</font>的直播室吗？ &nbsp; </p><div class=' tc mt30'>"
							
							+"<a class='close_tag btn_red bc ' href='javascript:window.location.href=\""+opencyou.url+"/live/t.html?s="+sid+"\"' titel='Confirm'> Confirm </a>"
							+"<a class='close_tag btn_grey bc ml30' href='javascript:;' titel='Cancel'> Cancel </a>"
							+"</div>  </div>";
					scroll(0,0);
					$.popbox(div_dialog);
						
						// 弹窗关闭按钮
					$(".close_tag").click( function() {
						$("#zxxBlank").remove();
						$(this).parents(".wrap_out").remove();
					});
						
				});
				*/
				$("#"+i).remove();
				delete this.interval[i];
				
			}
			
		
		}
}
