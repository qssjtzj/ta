$(document).ready(function() {
	
	if($(".center_left").find("iframe").length>0){
		var l_h= $(".center_left iframe").height();
		var r_h= $(".center_right ").height();
		if(r_h<940){
			r_h=940;
		}
		$(".center_left iframe").height(r_h)
		
	}
});

var rcopen ={};
rcopen.api = {
		commonDialog:function(){
			var div_dialog="<div class='commonDialog'><div class='common_close'>"
					+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
					+"<p class=' mt30 tc fts14 '>Your remaining Token：<i class=' colorred1'>1000</i></p> "
					+"<p class=' mt10 tc fts16'>Your have insufficient balance, please try again after you've topped off your balance on the recharge page.</p> "
					+"<div class=' bc mt30 tc'><a class='close_tag btn_grey  ' href='javascript:;' titel=Cancel'> Cancel </a>"
					+"<a class='close_tag btn_red ml30' href='javascript:;' titel='Confirm'> Confirm </a> </div> "
					+"</div>";
					
				scroll(0,0);
				$.popbox(div_dialog);
				
				// 弹窗关闭按钮
				$(".close_tag").click( function() {
					$("#zxxBlank").remove();
					$(this).parents(".wrap_out").remove();
				});
		},
		commonAlert:function(msg){
			var div_dialog="<div class='commonDialog'><div class='common_close'>"
					+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
					+"<p class=' mt30 tc fts14 '>" + msg + "</p> "
					+"<div class=' bc mt30 tc'><a class='close_tag btn_red' href='javascript:;' titel='Confirm'> Confirm </a> </div> "
					+"</div>";
				$.popbox(div_dialog);
				
				// 弹窗关闭按钮
				$(".close_tag").click( function() {
					$("#zxxBlank").remove();
					$(this).parents(".wrap_out").remove();
				});
		},
		commonConfirm:function(){
			var div_dialog="<div class='commonDialog'><div class='common_close'>"
					+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
					+"<p class=' mt30 tc fts14 '>Your remaining Token：<i class=' colorred1'>1000</i></p> "
					+"<div class=' bc mt30 tc'><a class='close_tag btn_grey ' href='javascript:;' titel=Cancel'> Cancel </a>"
					+"<a class='close_tag btn_red ml30' href='javascript:;' titel='Confirm'> Confirm </a> </div> "
					+"</div>";
				$.popbox(div_dialog);
				
				// 弹窗关闭按钮
				$(".close_tag").click( function() {
					$("#zxxBlank").remove();
					$(this).parents(".wrap_out").remove();
				});
		},
	initUserInfo : function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getvip?d"+d;
		
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				//console.log("-------------in------"+data);
				
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					
					var u=data.vipInfo;
					var div="<div class='u_img bc'><img src='http://api2.showoo.cc/user/getimg.php?type=100&uid="+u.uid+"' width='78' height='78'  border='0' onerror='this.src=img/mimg.jpg'/></div>"
						+ "<div class='u_username Ffamily_ht fts16 bc tc line40'> "+data.username
						+ "</div><div class='u_level bc Ffamily_ht line16 tc fts14'> <img src='../images/"+data.level+".png' width='15' height='15' /> LV."+data.level
						+ "</div>";
					
					var url=opencyou.url+"/PubImgSour/"+u.uid+".png";
					/*
					var viptime="";
					if(u.status==0){
						viptime="您尚未开通VIP";
					}else{
						viptime=u.end_time;
					}
					*/
					document.getElementById("user_img").src = url;//opencyou.url +"/user/update/getimg?uid="+u.uid;
					//var img_div="<img src='abc.jpg' width='78' height='78'  border='0' onerror='this.src=\'../imgs/icon.png\''/>";
					//$("#init_user_img").html(img_div);
					
					$("#user_name").html(data.username);
					$("#user_level").html(data.level);
					/*
					$("#vip_name").html(data.username);
					$("#vip_time").html(viptime);
					*/
					//document.getElementById("user_level_img").src='../images/'+data.level+'.png';
					
					//console.log(data);
					if( u.status && u.status>0 && u.level>0 ){
						//document.getElementById("user_vip_img").src='../imgs/icon_vip.png';
						$("#user_vip_img").show();
					}
					if(data.guardInfo!=null ){
						$("#user_guard_img").show();
					}
				} else {
					$("#init_user_info").html("load failed!");
					
				}
				
			}
		});
	},
	initVipInfo : function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getvip?d"+d;
		
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
					var viptime="";
					if(u.status==0){
						viptime="您尚未开通VIP";
					}else{
						viptime=u.end_time;
					}
					
					console.log(data);
					$("#vip_name").html(data.username);
					$("#vip_time").html(viptime);
					
					var himg=document.getElementById("user_icon");
					if( himg!= null){
						himg.src=opencyou.url+"/PubImgSour/"+u.uid+".png";
					}
					
					var car = data.car;
					if(car!=null){
						
						var vimg=document.getElementById("vipCarImg");
						if( vimg!= null){
							vimg.src=opencyou.url+car.image;
						}
						$("#vipCarName").html(car.name+"专属座驾");
						$("#vipCarDescribe").html(car.description);
						
					}
				} else {
					
				}
				
			}
		});
	},
	initAccInfo: function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getaccinfo?d"+d;
		
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				//console.log("-------------in------"+data);
				
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					var u=data.vipInfo;
					var viptime="";
					if(u.status==0){
						viptime="您尚未开通VIP";
					}else{
						viptime=u.end_time;
					}
					
					$("#account_name").html(data.username);
					$("#vip_time").html(viptime);
					$("#account_balance").html(data.amount);
					$("#account_profit").html(data.profit);

					var html = "";
					if(data.guardInfo!=null){
						var  guardInfo = JSON.parse(data.guardInfo)[0];
						html+="<table class='tb_common' rules='rows' >";
						html+="<tr class='tb_top'>";
						html+="	<th width='214px'>所守护主播昵称</th>";
						html+="	<th width='148px'>主播 ID</th>";
						html+="	<th width='186px'>到期时间</th>";
						html+="	<th></th>";
						html+="</tr>";
						if(guardInfo.length>0){
							for(var i=0;i<guardInfo.length;i++){
								html+="<tr>";
								html+="	<td>"+guardInfo[i].nick+"</td>";
								html+="	<td>"+guardInfo[i].singerId+"</td>";
								html+="	<td>"+Date.prototype.TimeStamp2Date2(guardInfo[i].end_time)+"</td>";
								html+="	<td><a class='btn_delay colorfff line26' href='javascript:rcopen.api.openGuardDialog("+u.uid+","+guardInfo[i].singerId+")' >延期</a></td>";
								html+="</tr>";;
							}
						}else{
							html = "您尚未开通守护";
						}
						html+="</table>";
					}else{
						html ="<div class='tb_vip'><font class='fts14 tb_ml'>您尚未开通守护</font></div>";
					}
					html+="</br></br></br></br>";
					$("#account_guardinfo").html(html);
				} 
			}
		});
	},
	getLevel: function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getlevel?d"+d;
		
		$.ajax({
			type : "get",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					
					var _exp = data.exp;
					var _explevel = data.explevel;
					
					var _jifen = data.jifen;
					var _level = data.level;
					
					var _rich = data.rich;
					var _richlevel = data.richlevel;
					
					var max_div_width=580;
					var max_lvl_width=55;
					var max_rich_width=27;
					var max_exp_width=100;
					
					if(_level>max_lvl_width){ _level=max_lvl_width; }
					if(_richlevel>max_rich_width){_richlevel=max_rich_width;}
					if(_explevel>max_exp_width){_explevel=max_exp_width;}
					
					var img_lvl = document.getElementById("level-img");
					img_lvl.src = opencyou.url+"/live/pic/lvl/"+_level+".png";
					var img_rich = document.getElementById("rich-img");
					img_rich.src = opencyou.url+"/live/pic/rich/"+_richlevel+".png";
					var img_exp = document.getElementById("exp-img");
					img_exp.src = opencyou.url+"/live/pic/exp/"+_explevel+".png";
					
					$("#lvl-level-progress .node").each(function(){
						var l = $(this).attr("l");
						var left =$(this).position().left;
						
						if(_level >=max_lvl_width ){
							$("#lvl-level-progress .node_ready").css('left',max_div_width );
							$("#lvl-level-progress .line_proce_ready").width(max_div_width);
							return;
						}else if(_level >= l){
							$("#lvl-level-progress .node_ready").css('left',left );
							$("#lvl-level-progress .line_proce_ready").width(left);
							return;
						}
					});
					
					$("#rich-level-progress .node").each(function(){
						var l = $(this).attr("l");
						var left =$(this).position().left;
						
						console.log("",l,_richlevel,left);
						if(_richlevel >= max_rich_width ){
							$("#rich-level-progress .node_ready").css('left',max_div_width );
							$("#rich-level-progress .line_proce_ready").width(max_div_width);
							return;
						}else if(_richlevel >= l){
							
							$("#rich-level-progress .node_ready").css('left',left );
							$("#rich-level-progress .line_proce_ready").width(left);
							return;
						}
					});
					
					$("#host-level-progress .node").each(function(){
						var l = $(this).attr("l");
						var left =$(this).position().left;
						console.log("",l,_explevel,left);
						
						if(_explevel >= max_exp_width ){
							$("#host-level-progress .node_ready").css('left',max_div_width );
							$("#host-level-progress .line_proce_ready").width(max_div_width);
							return;
						}else if(_explevel >= l){
							
							$("#host-level-progress .node_ready").css('left',left );
							$("#host-level-progress .line_proce_ready").width(left);
							return;
						}
					});
					
					/*
					var max_div_width=600;
					var max_rich_num = 256000000;//512000000;
					var max_exp_num = 35986555;//37333555;
					var max_level_num = 64008;//87665;
					
					if(_jifen>max_level_num){_jifen=max_level_num; _level=55; }
					if(_rich>max_rich_num){_rich=max_rich_num;}
					if(_exp>max_exp_num){_exp=max_exp_num;}
					
					var l_point = max_level_num / max_div_width;
					var level_left = _jifen / l_point;
					
					var r_point = max_rich_num / max_div_width;
					var rich_left = _rich / r_point;
					
					var e_point = max_exp_num / max_div_width;
					var exp_left = _exp / e_point;
					
					$("#lvl-level-progress .node_ready").css('left',level_left );
					$("#lvl-level-progress .line_proce_ready").width(level_left);
					
					$("#rich-level-progress .node_ready").css('left',rich_left );
					$("#rich-level-progress .line_proce_ready").width(rich_left);
					
					$("#host-level-progress .node_ready").css('left',exp_left );
					$("#host-level-progress .line_proce_ready").width(exp_left);
					
					var levelList = [0,30,317,1161,2864,5725,10044,16121,24255,34748,64008];
					var levelName = ['LV1','LV5','LV10','LV15','LV20','LV25','LV30','LV35','LV40','LV45','LV55'];
					
					var richList = [0,15000,100000,1000000,1500000,5000000,38000000,57000000,68000000,128000000,256000000];
					var richName = ['平民','3富','6富','10富','男爵','公爵','亲王','皇帝','圣帝','神','宙斯'];
				
					var hostList = [0,3705,19955,102355,472955,2009555,5245555,10028055,16461555,25385555,35986555];
					var hostName = ['LV1','LV10','LV20','LV30','LV40','LV50','LV60','LV70','LV80','LV90','LV100'];
					*/
					/*
					$("#lvl-level-progress .node").each(function(){
						var i = $(this).index();
						var left = levelList[i] / l_point;
						$(this).css('left',left);
					});
					
					$("#rich-level-progress .node").each(function(){
						var i = $(this).index();
						var left = richList[i] / r_point;
						$(this).css('left',left);
					});
					
					$("#host-level-progress .node").each(function(){
						var i = $(this).index();
						var left = hostList[i] / e_point;
						$(this).css('left',left);
					});
					*/
				} 
			}
		});
	},
	openGuardDialog:function(uid,singeruid){
		rcopen.api.step1GuardDialog(uid,singeruid);
		
	},
	step1GuardDialog:function(uid,singeruid,msg){
		var endtime = "";
		var amount = "0";
		var url = opencyou.url + "/guard/getguard";
		$.ajax({
			type : "post",
			url : url,
			data : {
				uidstr:uid,
				singerUidstr:singeruid
			},
			dataType : "json",
			async: false,
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				endtime = data.enddate;
				amount = data.amount;
			}
		});
		var div_dialog="<div class='defaultDialog'><div class='login_close'>"
			+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/>"
			+"</div><p class=' mt10 fts20'>You've already were the guardian , renew now?</p>"
			
			+"<p class=' mt10 fts14'>Guardian Expiry Date<i class=' colorred1'>（"+endtime+"）</i></p> "
			+"<div class=' tc mt30'><a class='close_tag btn_red bc ' href='javascript:rcopen.api.step2GuardDialog("+amount+","+uid+","+singeruid+");' titel='Confirm'> Confirm </a>"
			+"<a class='close_tag btn_grey bc ml20 pl20' href='javascript:;' titel=Cancel'> Cancel </a>"
			+"</div> </div>";	
			
		scroll(0,0);
		$.popbox(div_dialog);
		
		// 弹窗关闭按钮
		$(".close_tag").click( function() {
			$("#zxxBlank").remove();
			$(this).parents(".wrap_out").remove();
		});
	},
	step2GuardDialog:function(amount,uid,singeruid,msg){
		var user_name = "";
		var singer_name = "";
		var url = opencyou.url + "/guard/getguard";
		$.ajax({
			type : "post",
			url : url,
			data : {
				uidstr:uid,
				singerUidstr:singeruid
			},
			dataType : "json",
			async: false,
			success : function(data) {
				endtime = data.enddate;
				amount = data.amount;
				user_name = data.username;
				singer_name = data.singername;
			}
		});
		
		$("#guardDialog").show();
		$("#user_account").html(user_name);
		$("#singer_account").html(singer_name);
		
		var consume = "25000";
		$(".guard_lang li input").click(function(){
			var value = $("#"+this.id).attr("price");
			consume = value;
			$("#_token_value").html(value);
		});
		
		$("#btn_guard_kt").click(function(){
			if(amount>=consume){
				//开通逻辑
				rcopen.api.successDialog(consume,uid,singeruid);
			}else{
				rcopen.api.chongGuard();
			}
		});
		$("#guard_close").click(function(){
			$("#guardDialog").hide();
			window.location.reload();
		});
		
	
	},
	successDialog:function(consume,uid,singeruid){
		var duration = $("input[name='guard_radio']:checked").val(); //开通守护时长(月)
		var url = opencyou.url + "/guard/open";
		var flag = false;
		var endtime = "";
		var authtime = "";
		$.ajax({
			type : "post",
			url : url,
			data : {
				uidstr:uid,
				singerUidstr:singeruid,
				tokenStr:consume,
				monthStr:duration
			},
			dataType : "json",
			async: false,
			success : function(data) {
				if(data.success==true){
					flag = true;
				}
				endtime=data.endtime;
				authtime=data.authtime;
			}
		});
		if(!flag){
			alert('error');
		}
		var div_dialog="<div class='defaultDialog'><div class='login_close'>"
			+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/>"
			+"</div><p class=' mt10 fts20'>Congratulations！The guardian's renewal is succeeded.</p>"
			+"<p class=' mt10 fts14'>Guardian's Duration<i class=' colorred1'>（"+authtime+" - "+endtime+"）</i></p> "
			+"<div class=' tc mt10'> "
			+"<a class='close_tag btn_80x30 bc ' href='javascript:;' titel='Confirm'> Confirm </a></div> </div>";
			
		scroll(0,0);
		$.popbox(div_dialog);
		
		// 弹窗关闭按钮
		$(".close_tag").click( function() {
			$("#zxxBlank").remove();
			$(this).parents(".wrap_out").remove();
			window.location.reload();
		});
		
	},
	errorDialog:function(msg){
		var div_dialog="<div class='defaultDialog'><div class='login_close'>"
			+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/>"
			+"</div><p class=' mt10 fts20'>"+msg+"</p>"
			//+"<p class=' mt10 fts14'>Guardian Expiry Date<i class=' colorred1'>（2014/11/12-2015/01/07）</i></p> "
			+"<div class=' tc mt30'><a class='close_tag btn_red bc ' href='javascript:WEB_RC.webrc.getAvailableToBuyGuardInfo();' titel='Confirm'> Confirm </a>"
			+"<a class='close_tag btn_grey bc ml20 pl20' href='javascript:;' titel=Cancel'> Cancel </a>"
			+"</div> </div>";	
		scroll(0,0);
		$.popbox(div_dialog);
		
		// 弹窗关闭按钮
		$(".close_tag").click( function() {
			$("#zxxBlank").remove();
			$(this).parents(".wrap_out").remove();
			window.location.reload();
		});
	},
	chongGuard:function(obj){
		//rclog("---chongGard--");
		var div_dialog="<div class='defaultDialog'><div class='login_close'>"
			+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' id='login_close' class='close_tag' style='cursor: pointer'/></div>"
			+"<p class=' mt10 fts20'>Sorry，your balance is not enough.</p> "
			+"<div class=' tc mt30'><a class='close_tag btn_red bc ' href='"+opencyou.url +"/pay/paycharge.html' titel='Recharge' target='_blank'> Recharge </a>"
			+"<a class='close_tag btn_grey bc ml20' href='javascript:;' titel=Cancel'> Cancel </a>"
			+"</div> </div>";
		scroll(0,0);
		$.popbox(div_dialog);
		
		// 弹窗关闭按钮
		$(".close_tag").click( function() {
			$("#zxxBlank").remove();
			$(this).parents(".wrap_out").remove();
			window.location.reload();
		});
	},
	getFlowerInfo : function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getinfo?d"+d;
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				//console.log("-------------in------"+data);
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					$("#account_name").html(data.username);
					$("#account_flower").html(data.flower);
					$("#account_followme").html(data.followme);
				}
			}
		});
	},
	getUserInfo : function() {
		var d =new Date();
		var url = opencyou.url + "/account/info/getinfo?d"+d;
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
					var u=data.userInfo;
					
					var div="";
//					if($("#isupdate").val()==1){
//						$("#isupdate").val('0');
//						div+="<li> <span> 资料更新完成，赶快去链接你的<a href='userCenterFB.html' class='' id='_user_info_fb' title='Account Settings'  target='_self'>社交网站</a>吧！ </span></li>";	
//					}					
					div+="<div id='inner_social_network' class='u_inner_socal' ><li> <span><h8> Link to your <a href='userCenterFB.html' class='color36b' id='_user_info_fb' title='social network'  target='_self'>social network </a>now!</h8> </span></li></div><li></li>";					
					div += "<li><span>UID： </span> "+u.uid+" <!--span>Account： </span> "+u.account+"<label class='pl15'>Level：</label> "+u.level+"--></li><li> <span>Nick：</span>"+ u.nick+"</li>"
            			+"<li> <span>Sex：</span> ";
						if(u.sex=='0'){
							div+="F";
						}else{
							div+="M";
						}
					
					div += " </li><li> <span>Birthday：</span>"+ u.birthday+"</li>"
            			+"<li> <span>Area：</span><label id='area'></label></li>";
					
					if(u.anchorFlag=='1'){//主播才能展示
						if(u.city==null||u.city=='null'||u.city=='0'){
							u.city='';
						}
						div += "<li> <span>City：</span>"+ u.city+"</li>";

						if(u.constellation==null||u.constellation=='null'||u.constellation=='-1'){
							u.constellation='';
						}
						div += "<li> <span>Zodiac：</span><label id='constellation'></label></li>";
						
						if(u.blood==null||u.blood=='null'||u.blood=='-1'){
							u.blood='1';
						}
						div += " <li> <span>Blood type：</span>";
						if(u.blood=='1'){
							div+="A";
						}else if(u.blood=='2'){
							div+="B";
						}else if(u.blood=='3'){
							div+="AB";
						}else if(u.blood=='4'){
							div+="O";
						}else{
							div+="";
						}
						div += "</li>";
						
						if(u.height==null||u.height=='null'||u.height=='-1'){
							u.height='';
						}
						div += " <li> <span>Height：</span>"+ u.height+"</li>";
						
						if(u.weight==null||u.weight=='null'||u.weight=='-1'){
							u.weight='';
						}
						div += " <li> <span>Weight：</span>"+ u.weight+"</li>";
						
						if(u.bwh==null||u.bwh=='null'||u.bwh=='-1'){
							u.bwh='';
						}
						div += " <li> <span>BWH：</span>"+ u.bwh+"</li>";

						if(u.facebook==null||u.facebook=='null'){
							u.facebook='';
						}
						div += " <li> <span>Facebook：</span>"+ u.facebook+"</li>";
					}
					
					div += "<li> <span>Signature：</span><div class='fl line24 w70 mt10'>"+u.sign+"</div></li>";
					
					if(u.anchorFlag=='1'){
						div += " <li> <span>Photo：</span>";
						if(typeof(u.photo)!="undefined"&&u.photo!=null&&u.photo!=''){
							var imgurl=opencyou.url+"/PubImgSour"+u.photo;
							div += "<img src='"+imgurl+"' width='60' height='60'  border='0' id='appimg'/>";
						}
						"</li>";
						
						div += " <li> <span>Photo gallery：</span>";
                        div += "				<div class='account_photo_list'>";
                        div += "             	</div>";
						"</li>";
						rcopen.api.showPhotoGalleryListNoEdit();
					}
					
					$("#userinfo_list").html(div);
					
					$.getJSON("../inc/country.json", function(data){ 
							var country = '';
							for( var i in data.country){
								if(data.country[i].value==u.area){
									$("#area").html(data.country[i].country);
									break;
								}
							}
							
						}); 
					
					$.getJSON("../inc/constellation.json", function(data){ 
						var constellation = '';
						for( var i in data.constellation){
							if(data.constellation[i].value==u.constellation){
								$("#constellation").html(data.constellation[i].constellation);
								break;
							}
						}
						
					}); 
				} else {
					$("#userinfo_list").html("load failed!");
				}
				
			}
		});
	},delPhotoGalleryItem:function(id){
		
		opencyou.utils.getJsonData('http://image.showoo.cc/photo/del?id=' + id,function(json){
				var success = json.success;
				if(success)
					$("#gallery"+id).remove();
			});
	},showPhotoGalleryListNoEdit:function(){
		var uid = opencyou.cookies.read('_open_uuid');
        //列出照片墙
		opencyou.utils.getJsonData('http://image.showoo.cc/photo/listJsonp?timestamp='+jQuery.now()+'&uid=' + uid,function(json){
			var success = json.success;
			var list = json.list;
			var html = "";
			for(var i=0;i<list.length;i++){
				var id = list[i].id;
				var imguri = list[i].imguri;
                html += "                    	<div class=\"right_one\">";
                html += "                           <div class=\"ent_one\">";
                html += "                                <div class=\"ent_img fl pr\">";
                html += "                                    <img src=\""+imguri+"\" width=\"66\" height=\"60\">";
                html += "                                </div>	";
                html += "                            </div>";
                html += "                        </div>";
			}
			$(".account_photo_list").html(html);
		});
	},showPhotoGalleryList:function(){
		var uid = opencyou.cookies.read('_open_uuid');
        //列出照片墙
		opencyou.utils.getJsonData('http://image.showoo.cc/photo/listJsonp?timestamp='+jQuery.now()+'&uid=' + uid,function(json){
			var success = json.success;
			var list = json.list;
			var html = "";
			for(var i=0;i<list.length;i++){
				var id = list[i].id;
				var imguri = list[i].imguri;
                html += "                    	<div class=\"right_one\" id=\"gallery" + id + "\">";
                html += "                           <div class=\"ent_one\">";
                html += "                                <div class=\"ent_img fl pr\">";
                html += "                                    <img src=\""+imguri+"\" width=\"66\" height=\"60\">";
                html += "                                    <a href=\"javascript:rcopen.api.delPhotoGalleryItem('" + id + "')\" class=\"optiond\" style=\"display: inline;\"> <div class=\"icon_close optiond\"></div></a>";
                html += "                                </div>	";
                html += "                            </div>";
                html += "                        </div>";
			}
			$(".photo_list").html(html);
		});
	},
	changeBirthMonth:function(){
	
		var month = $("#BirthMonth").children('option:selected').val();
		var year = $("#BirthYear").children('option:selected').val();
		var dd = $("#BirthDay").children('option:selected').val();
		var day = 31;
		
		if(month=="01" || month=="03" || month=="05" || month=="07" || month=="08" || month=="10" || month=="12"){  
        	day = 31;
		} else if(month=="04" || month=="06" || month=="09" || month=="11"){  
            day = 30;
        } else if(month=="02"){  
        	if((year%4==0 && year%100!=0) || year%400==0){  
            	day=29;
           	} else{  
                day=28; 
            }  
        } 
		 
		var BirthDay='';
		for(var d=01;d<=day;d++){
			var d_string = d;
			if(d<10){
				d_string = "0"+d;
			}
			if(d==parseInt(dd)){
				BirthDay+='<option value="'+d_string+'" selected="selected"><font>'+d+'</font></option>';
			}else{
			    BirthDay+='<option value="'+d_string+'"><font>'+d+'</font></option>';
			}
		}
		
		$("#BirthDay").html(BirthDay);
	},
	showUpdateForm:function(){
		$(".userinfo_form").hide();
		$(".userinfo_update").show();
		
		var d =new Date();
		var url = opencyou.url + "/account/info/getinfo?d"+d;
		
		$.ajax({
			type : "post",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					var u=data.userInfo;
					
					var div="<li> <span>Account：</span> "+u.account
						//+" <label class='pl15'>Level：</label>"+u.level
						+"</li><input type='hidden' value='"+u.uid+"' id='u_uid'/>"
            			+ "<li> <span>Nick：</span> <input type='text' value='"+u.nick+"' name='update_username' id='update_username' class='input_border' onblur='rcopen.checkInput.checkUsername(this.id,\"Nikename\",16)' /><em class='tip colored' id='tip_update_username'>* </em></li>"
            			+ "<li> <span>Sex：</span><input type='radio' value='0' name='update_sex' class=''  /> F"
                 		+ "<input type='radio' value='1' name='update_sex' class='' />M </li>"
						//+ "<li> <span>生日： </span><input type='text' value='"+opencyou.utils.getLocalDate(u.birthday)+"' name='update_birthday' id='update_birthday' readonly class='input_border'/></li>"
						
						var y = u.birthday.substring(0,4);
						var m = u.birthday.substring(4,6);
						var d = u.birthday.substring(6,8);
						
						var BirthMonth = '<select name="BirthMonth" class="input_border" id="BirthMonth" onchange="rcopen.api.changeBirthMonth()" selectedvalue="01">'
							+'<option value="01"><font><font>January</font></font></option>'
							+'<option value="02"><font><font>February</font></font></option>'
							+'<option value="03"><font><font>March</font></font></option>'
							+'<option value="04"><font><font>April</font></font></option>'
							+'<option value="05"><font><font>May</font></font></option>'
							+'<option value="06"><font><font>June</font></font></option>'
							+'<option value="07"><font><font>July</font></font></option>'
							+'<option value="08"><font><font>August</font></font></option>'
							+'<option value="09"><font><font>September</font></font></option>'
							+'<option value="10"><font><font>October</font></font></option>'
							+'<option value="11"><font><font>November</font></font></option>'
							+'<option value="12"><font><font>December</font></font></option>'
							+'</select>';
						
						BirthMonth = BirthMonth.replace('value="'+m+'"','value="'+m+'" selected="selected" ');
						
						var BirthDay='<select name="BirthDay" class="input_border" id="BirthDay" style="margin:0 3px">';
						for(var day=01;day<=31;day++){
							var d_string =day;
							if(day<10){
								d_string = "0"+day;
							}
							if(day==parseInt(d)){
								BirthDay+='<option value="'+d_string+'" selected="selected"><font>'+day+'</font></option>';
							}else{
			     				BirthDay+='<option value="'+d_string+'"><font>'+day+'</font></option>';
							}
						}
						BirthDay+='</select>';
						
						var BirthYear='<select name="BirthYear" class="input_border" id="BirthYear" onchange="rcopen.api.changeBirthMonth()">';
						var edate=parseInt(new Date().Format("yyyy"));  
						for(var sdate=1900;sdate<=edate;sdate++){
							if(sdate==parseInt(y)){
								BirthYear+='<option value="'+sdate+'"  selected="selected"><font>'+sdate+'</font></option>';
							}else{
			     				BirthYear+='<option value="'+sdate+'"><font>'+sdate+'</font></option>';
							}
						}
						BirthYear+='</select>';
						
						div += "<li class='birthselect'> <span>Birthday：</span>"+BirthMonth+BirthDay+BirthYear+"</li>";
						
						div+= "<li> <span>Area：</span><select class='ui-area input_border' id='country' ></select></li>";
						
						//div+= "<li> <span>地区：</span> <input type='text' value='"+u.area+"' name='update_area' id='update_area'  class='input_border'/></li>";
						
						if(u.anchorFlag=='1'){//主播才能展示
							if(u.city=='-1'||u.city=='0'){
								u.city='';
							}
							div += "<li> <span>City：</span> <input type='text' value='"+u.city+"' name='update_city' id='update_city' class='input_border' onblur='rcopen.checkInput.checkUsername(this.id,\"City\",16)' /><em class='tip colored' id='tip_update_city'>* </em></li>";
							
							div+= "<li> <span>Zodiac：</span><select class='ui-area input_border' id='constellation2' ></select></li>";
							
							div += "<li> <span>Blood type：</span><input type='radio' value='1' name='update_blood' class='' /> A " +
									"<input type='radio' value='2' name='update_blood' class='' /> B " +
									"<input type='radio' value='3' name='update_blood' class='' /> AB " +
									"<input type='radio' value='4' name='update_blood' class='' /> O </li>";
							if(u.blood==null||u.blood=='-1'){
								u.blood=1;
							}
	                 		
							if(u.height==null||u.height=='-1'){
								u.height='';
							}
							div += "<li> <span>Height：</span> <input type='text' value='"+u.height+"' name='update_height' id='update_height' class='input_border' onblur='rcopen.checkInput.checkUsername(this.id,\"Height\",8)' /><em class='tip colored' id='tip_update_height'>* </em></li>";

							if(u.weight==null||u.weight=='-1'){
								u.weight='';
							}
							div += "<li> <span>Weight：</span> <input type='text' value='"+u.weight+"' name='update_weight' id='update_weight' class='input_border' onblur='rcopen.checkInput.checkUsername(this.id,\"Weight\",8)' /><em class='tip colored' id='tip_update_weight'>* </em></li>";

							if(u.bwh==null||u.bwh=='-1'){
								u.bwh='';
							}
							div += "<li> <span>BWH：</span> <input type='text' value='"+u.bwh+"' name='update_bwh' id='update_bwh' class='input_border' onblur='rcopen.checkInput.checkUsername(this.id,\"BWH\",8)' /><em class='tip colored' id='tip_update_bwh'>* </em></li>";

//							if(u.facebook==null||u.facebook=='-1'){
//								u.facebook='';
//							}
//							div += "<li> <span>Facebook：</span> <input type='text' value='"+u.facebook+"' name='update_facebook' id='update_facebook' class='input_border'/></li>";

						}
						
						div+= "<li> <span>Signature：</span></li>"
						+ "<textarea rows='4' class='input_border' id='update_qianming'  name='update_usersign' onBlur='rcopen.checkInput.textCounter(this, 18)'>"+u.sign+"</textarea>"
						
						+ "<input name='remLen' type='text' id='remLen' style=' width:350px; border: 0; color: red; margin-left:124px;' value='The length of signature is no more than 18 characters. ' size='3' maxlength='3'  readonly='readonly'>";
						
						if(u.anchorFlag=='1'){
							if(u.photo==null||u.photo=='null'){
								u.photo='';
							}
						
							div += "<li class='group_update'> <span>Photo：</span>";
							div += "<div class='upload' style=' left:124px; '>Upload Photo</div>";
                            div += "<input type='file' name='_icPhotocopy' id='_icPhotocopy' hidefocus='true' onchange='rcopen.api.onFileValueChange(this,2)' />";
                            div += "<input type='hidden' id='is_upload' value='0' />";
                            div += "<input type='hidden' id='imguri' value='"+u.photo+"' />";
                            div += "<em class='tip colored' id='tip__icPhotocopy'></em></li>";
                            div += "<p class=' pl124'>Support JPG file, Max file size : 2MB</p>";
                            //个人靓照展示
                            //div += "<div style='margin:17px 0px 27px 124px;'><img src='/live/img/photo_gallery_demo2.png' width='60' height='60'></div>";
                            
							div += "<li class='photo_gallery'> <span>Photo gallery：</span>";
							div += "<div class='upload' style=' left:124px; '>Upload Photo</div>";
                            div += "<input type='file' name='galleryCopy' id='galleryCopy' hidefocus='true' onchange='rcopen.api.onGalleryFileValueChange(this,2)' />";
                            div += "<input type='hidden' id='gallery_is_upload' value='0' />";
                            div += "<input type='hidden' id='gallery_imguri' value='"+u.photo+"' />";
                            div += "<em class='tip colored' id='tip_Gallerycopy'></em></li>";
                            div += "<p class=' pl124'>You can upload no more than 9 pics</p>"; 
                            div += "<p class=' pl124'>Support JPG file, Max file size : 2MB</p>";                           

                            
                            div += "				<div class='photo_list'>";
                         
                            div += "             	</div>";
                            
                            rcopen.api.showPhotoGalleryList();


						}
					
					$("#user_update_list").html(div);
					rcopen.api.changeBirthMonth();
					
					$("input[name='update_sex'][value="+u.sex+"]").attr("checked",true);
					
						$.getJSON("../inc/country.json", function(data){ 
							var country = '';
							for( var i in data.country){
								if(data.country[i].value==u.area){
									country+='<option value="'+data.country[i].value+'" selected="selected"><font>'+data.country[i].country+'</font></option>';
								}else{
									country+='<option value="'+data.country[i].value+'"><font>'+data.country[i].country+'</font></option>';
								}
							}
							
							$("#country").html(country);
						}); 
						
					if(u.anchorFlag=='1'){
						$("input[name='update_blood'][value="+u.blood+"]").attr("checked",true);
						
						$.getJSON("../inc/constellation.json", function(data){ 
							var constellation = '';
							for( var i in data.constellation){
								if(data.constellation[i].value==u.constellation){
									constellation+='<option value="'+data.constellation[i].value+'" selected="selected"><font>'+data.constellation[i].constellation+'</font></option>';
								}else{
									constellation+='<option value="'+data.constellation[i].value+'"><font>'+data.constellation[i].constellation+'</font></option>';
								}
							}
							
							$("#constellation2").html(constellation);
						}); 
					}
						
						
				} else {
					$("#user_update_list").html("load failed!");
				}
				
			}
		});
		
	},
	submitUpdateForm:function(){
	
		var uuid = u_uid.value;
		var username = update_username.value;
		var sex = $('input[name="update_sex"]:checked').val();
		var area = $('#country option:selected').val();//选中的值
		//var birthday = $('#BirthYear option:selected').val()+$('#BirthMonth option:selected').val()+$('#BirthDay option:selected').val();
		
		var y = $('#BirthYear option:selected').val();
		var m = $('#BirthMonth option:selected').val();
		var d = $('#BirthDay option:selected').val();
		var bd = new Date(y,parseInt(m)-1,d);
		var birthday = bd.Format("yyyyMMdd");
		
		if(!rcopen.checkInput.checkUsername('update_username','Nikename',16)){
			$('html, body').animate({scrollTop: 140}, 800);
			return false;
		}
		
		var city = '';
		if(typeof(update_city)=="undefined" ){
		}else{
			city=update_city.value;
			if( !rcopen.checkInput.checkUsername('update_city','City',16)){
				$('html, body').animate({scrollTop: 300}, 800);
				return false;
			}
		}
		
		var blood = '';
		if(typeof($('input[name="update_blood"]:checked').val())=="undefined" ){
		}else{
			blood = $('input[name="update_blood"]:checked').val();
		}
		
		var constellation = '';
		if(typeof(constellation2)=="undefined" ){
		}else{
			constellation = $('#constellation2 option:selected').val();//选中的值
		}
		
		var height = '';
		if(typeof(update_height)=="undefined" ){
		}else{
			height=update_height.value;
			if(!rcopen.checkInput.checkUsername('update_height','Height',8)){
				$('html, body').animate({scrollTop: 420}, 800);
				return false;
			}
		}
		
		var weight = '';
		if(typeof(update_weight)=="undefined" ){
		}else{
			weight=update_weight.value;
			if(!rcopen.checkInput.checkUsername('update_weight','Weight',8)){
				$('html, body').animate({scrollTop: 460}, 800);
				return false;
			}
		}
		
		var bwh = '';
		if(typeof(update_bwh)=="undefined" ){
		}else{
			bwh=update_bwh.value;
			if(!rcopen.checkInput.checkUsername('update_bwh','BWH',8)){
				$('html, body').animate({scrollTop: 500}, 800);
				return false;
			}
		}
		
		var photo = '';
		if(typeof($("#imguri").val())=="undefined" ){
		}else{
			photo=$("#imguri").val();
		}
		
		
		var url2 = "http://capi.showoo.cc/msg/addNotice";
		$.ajax({
			type : "get",
			url : url2,
			data : {
				uid : uuid,
				type:1,
				eventName:'anchorInfoUpdate',
				body:"" //"username:"+encodeURIComponent(username)+",sex:"+sex
			},
			async : false,
			dataType : "json",
			success : function(data) {
			}
		});
		
		
		var usersign = update_qianming.value;
		var url = opencyou.url + "/account/info/modifyinfo";
		$.ajax({
			type : "post",
			url : url,
			data : {
				uuid : uuid,
				username : encodeURIComponent(username),
				sex : sex,
				birthday:birthday,
				area:area,
				usersign:encodeURIComponent(usersign),
				city:encodeURIComponent(city),
				blood:blood,
				constellation:constellation,
				height:height,
				weight:weight,
				bwh:bwh,
//				facebook:facebook,
				photo:photo
			},
			dataType : "json",
			success : function(data) {
				
				if (data != null && data.user_success == true) {
					$("#isupdate").val('1');
					window.location.reload();
				} else if(data != null && data.error_code == -3){
					$("#isupdate").val('1');
					window.location.reload();
				}else{
					$("#tip_form_tep1").html("Update failed!");
				}
				
			}
		});
		
		
	},
	getActiveEmail:function(){
		var url = opencyou.url + "/account/info/getinfoaddit";
		
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
				if (data != null && data.user_success == true && data.userInfo.is_valid_mail==1){
						$("#email_val2").html(data.userInfo.passport);
						//$("#username_val2").html(data.user_name);
						u_username.value=data.userInfo.account;
						$("#email_active_no").hide();
						$("#email_active_yes").show();
				}else{
						$("#email_val1").html(data.userInfo.passport);
						$("#email_active_yes").hide();
						$("#email_active_no").show();
				}
			}
		});
	},
	sendEmailCode:function(){
		var url = opencyou.url + "/account/user/getcode";
		
		$.ajax({
			type : "get",
			url : url,
			data : {},
			dataType : "json",
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					$("#email_val_r").html(data.user_email);
					$("#email_active_no").hide();
					$("#email_active_no_r").show();
				}else{
					alert('Send mail failed!');
				}
			}
		});
	},
	sendPwdCode:function(){
		
		var u_mail=$("#email_val2").html();
		var u_name=u_username.value;
		
		window.open(opencyou.url+"/common/sendpass.html?name="+u_name+"&mail="+u_mail);
		return true;
		//跳转出去
		
	},
	updateEmailForm:function(){
		//验证
		//if(!rcopen.checkInput.check1 || !rcopen.checkInput.check1 || !rcopen.checkInput.check1 ){
		//	return false;
		//}
		
		var v1 = rcopen.checkInput.checkOldEmail('old_email');
		var v2 = rcopen.checkInput.checkNewEmail('new_email');
		var v3 = rcopen.checkInput.checkNewEmail2('new_email_01');
		
		if(v1&&v2&&v3){
			
		}else{
			return false;
		}
		var url = opencyou.url + "/account/user/modifyEmail";
		
		var omail = old_email.value;
		var nmail = new_email.value;
		var nmail2 = new_email_01.value;
		$.ajax({
			type : "post",
			url : url,
			data : {
				omail:omail,
				nmail:nmail,
				nmail2:nmail2
			},
			dataType : "json",
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true) {
					email_val_into.value=nmail;
					$("#email_modify_form").hide();
					$("#email_modify_form_r").show();
				}else if(data != null && data.error_code == -4){
					$("#tip_form").html("Original email address error!");
				}else if(data != null && data.error_code == -2){
					$("#tip_form").html("Not the same as the original email address!");
				}else {
					$("#tip_form").html("Update Failed!");
				}
			}
		});
	},
	//group manager 
	getGroupManager:function(){
		var url = opencyou.url + "/account/info/getgroups";
		
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
				if (data != null && data.user_success == true ){
					var list = data.ginfo;
					div = "";
					
					for(var i in list){
						
						var type = list[i].type==0?"Game":"Entertainment";
						div+="<dd>"
                              +" <div class='fl pr w60'>"
                              +" 	<img src='"+opencyou.url+"/PubImgSour/"+list[i].owner+".png' class='fl' width='40' height='40' border='0' onerror=\"this.src='../imgs/icon.png'\" />"
                              +" 	<ul class='fl ml18'>"
                              +"    	<li><a href='' class='color333 bold'>"+list[i].name+"</a></li>"
                              +"        <li ><label>Group ID:</label>"+list[i].sid+" <label class=' pl15'>Group Type:</label>"+type+"</li>"
                              +"        <li class=''><label>Create Time：</label>"+list[i].create_time+"</li>"
                              +" 	</ul>"
                              +" </div>	"
                              +" <div class=' fl mt15'> "
                              +"  	<a href='"+opencyou.url+"/faq/index.html' class='btn_group' >How to live</a> "
                              +"   	<a href='"+opencyou.url+"/live/t.html?s="+list[i].sid+"' class='btn_group' >Enter Group</a> "
                              +" </div>"
                              +" </dd>";
					}
					if(div==""){
						div="<p class=' color666 fts12'>您还没有创建群。</p>";
					}
					$("#group_list").html(div);
				}else{
					$("#group_list").html("Loading failed...");	
				}
			}
		});
	},
	getGroupCount:function(){
		var url = opencyou.url + "/account/info/groupCount";
		
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
				
				if (data != null && data.user_success == true ){
					var counts = 5-parseInt(data.counts);
					if(counts>0){
						$("#group_count").html("You can create <span >"+counts+"</span> more Groups , Groups cannot be delete or transfer.");
					}else{
						$("#group_count").html("You can create <span >"+counts+"</span> more Groups , Groups cannot be delete or transfer.");
						$("#btn_group_submit").hide();
						$("#btn_group_submit_hidden").show();
					}
					
				}else{
					$("#group_list").html("Loading failed...");	
				}
			}
		});
	},
	createGroup:function(){
		var group_name =  String.prototype.trim($('#group_name').val());
		var type = group_type.value;
		
		if(!groupCheckbox.checked){
			$("#tip_form").html("Please check the terms!");
			this.isSubmit=false;
			return false;
		}
		if(group_name.length==0){
			return false;
		}
		var url = opencyou.url + "/account/info/addgroup";
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				name:encodeURIComponent(group_name),
				type:type
			},
			dataType : "json",
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true ){
					$("#form1").hide();
					$("#form2").show();
					$("#enter_group").attr("href", opencyou.url +"/live/t.html?s="+data.sid);
				}else if(data != null && data.error_code==-2){
					$("#tip_group_name").html("Channel name is already in use!");
				}else{
					$("#tip_submit").html("Create failed!");
				}
			}
		});
	},
	initGroup:function(){
		var url = opencyou.url + "/user/anchorApply/getFlag";
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
				if (data != null && data.user_success == true && data.ret=='1' ){//审核通过
					$("#form3").hide();
					$("#form1").show();
				}else{
					$("#form1").hide();
					$("#form3").show();
				}
			}
		});
	
	},
	initApplyGroup:function(){
		$("#is_upload").val(0);
		$("#formid").val(0);
		
		var url = opencyou.url + "/user/anchorApply/getapply";
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
				if (data != null && data.user_success == true && data.ret=='1' ){//审核通过
					$("#ret_1").hide();
					$("#ret_3").hide();
					$("#ret_4").hide();
					$("#ret_2").show();
				}else if (data != null && data.user_success == true && data.ret=='2' ){//审核未通过
					
					$("#ret_2").hide();
					$("#ret_4").hide();
					$("#ret_3").show();
					var apply = data.anchorApply;
					
					$("#formid").val(apply.id);
					$("#name").val(apply.name);
					$("#icNo").val(apply.icNo);
					$("#bank").val(apply.bank);
					
					$("#accountName").val(apply.accountName);
					$("#accountNo").val(apply.accountNo);
					//$("#icPhotocopy").val(apply.icPhotocopy);
					
					$("#mobileID").val(apply.mobileID);
					$("#skypeID").val(apply.skypeID);
					
					$("#rcUserName").val(apply.rcUserName);
					$("#agentName").val(apply.agentName);
					$("#agentContatct").val(apply.agentContatct);
					
					$("#ret_1").show();
				}else if (data != null && data.user_success == true && data.ret=='0' ){//审核中
					$("#ret_1").hide();
					$("#ret_2").hide();
					$("#ret_3").hide();
					$("#ret_4").html("Your application has been submitted for review~").show();
				}else if (data != null && data.user_success == false && data.ret=='-1' ){//没有申请过
					$("#ret_1").show();
					$("#ret_2").hide();
					$("#ret_3").hide();
					$("#ret_4").hide();
				}else{
					$("#ret_1").hide();
					$("#ret_2").hide();
					$("#ret_3").hide();
					$("#ret_4").html("Server busy, please try again later~").show();
				}
			}
		});
	
	},
	onFileValueChange: function(obj,type) {
        var fileId = obj.id;
        var fileVal = obj.value;
		if(!rcopen.checkInput.checkFile(fileId)){
			return false;
		}
		var api = opencyou.url + "/user/anchorApply/uploadPhoto?type="+type;
//		var api = "http://localhost/photo/add?uid=123&type=0";
        ajaxUpLoad(api, fileId, function(d){
			if(d.indexOf('"user_success":true')>0){
				var start = d.indexOf('PubImgSour')+10;
				var end = d.indexOf('"}');
				var uri = d.substring(start,end);
				$("#tip_icPhotocopy").html("Upload Success!");
				$("#tip_icPhotocopy").css("color","#5a5");
				
				$("#tip__icPhotocopy").html("Upload Success!");
				$("#tip__icPhotocopy").css("color","#5a5");
				
				$("#is_upload").val(1);
				$("#imguri").val(uri);
			}else if(d.indexOf('"user_success":false')>0 &&  d.indexOf('"error_code":-2')>0 ){
				$("#tip_icPhotocopy").html(" Max file size:2MB");
				$("#tip_icPhotocopy").css("color","#f00");
				
				$("#tip__icPhotocopy").html(" Max file size:2MB");
				$("#tip__icPhotocopy").css("color","#f00");
				
				$("#is_upload").val(0);
			}else {
				$("#tip_icPhotocopy").html("Upload failed!");
				$("#tip_icPhotocopy").css("color","#f00");
				
				$("#tip__icPhotocopy").html("Upload failed!");
				$("#tip__icPhotocopy").css("color","#f00");
				$("#is_upload").val(0);
			}
			
		}, "");
         
    },addPhotoGalleryItem: function(id,url) {
        html += "                    	<div class='right_one'>";
        html += "                           <div class='ent_one'>";
        html += "                                <div class='ent_img fl pr'>";
        html += "                                    <img src='"+imguri+"' width='60' height='60'>";
        html += "                                    <a href=\"javascript:alert('delete')\" class=\"optiond\" style=\"display: inline;\"> <div class=\"icon_close optiond\"></div></a>";
        html += "                                </div>	";
        html += "                            </div>";
        html += "                        </div>";
        $(".photo_list").append(html);
    },

	onGalleryFileValueChange: function(obj,type) {
		var uid = opencyou.cookies.read('_open_uuid');
        var fileId = obj.id;
        var fileVal = obj.value;
        
        if(fileVal.toLowerCase().indexOf(".jpg")<0)
        {
        	rcopen.api.commonAlert("please upload jpg file!");
        	return false;
        }
       	
		if(!rcopen.checkInput.checkFile('galleryCopy')){
			return false;
		}
		
		var api = "http://www.showoo.cc/photo/add?uid=" + uid +"&type=0";
		ajaxUpLoad(api, fileId, function(d){
			var data = eval('(' + d + ')');
			
			if(data.success == false){
				rcopen.api.commonAlert(data.error);
				return false;
			}else if(data.success == true){
	            $(".photo_list").html('');
	            rcopen.api.showPhotoGalleryList();
			}
			
		}, "");
        
    },
    
	applyGroup:function(){
		$("#tip_form1").html("");
		var id = $("#formid").val();
		var name = $("#name").val();
		var sex = $('input[name="sex"]:checked').val();
		var icNo = $("#icNo").val();
		var bank = $("#bank").val();
		var accountName = $("#accountName").val();
		var accountNo = $("#accountNo").val();
		var icPhotocopy = $("#icPhotocopy").val();
		var mobileID = $("#mobileID").val();
		var skypeID = $("#skypeID").val();
		
		var rcUserName = $("#rcUserName").val();
		var agentOrCompany = $('input[name="agentOrCompany"]:checked').val();
		var agentName = $("#agentName").val();
		var agentContatct = $("#agentContatct").val();
		
		if(!applyCheckbox.checked){
			$("#tip_form1").html("Please check the terms!");
			//this.isSubmit=false;
			return false;
		}
		
		if(!rcopen.checkInput.checkEmpt('name')
			|| !rcopen.checkInput.checkEmpt('icNo')|| !rcopen.checkInput.checkEmpt('bank')
			|| !rcopen.checkInput.checkEmpt('accountName')|| !rcopen.checkInput.checkEmpt('accountNo')
			|| !rcopen.checkInput.checkEmpt('mobileID')
			|| !rcopen.checkInput.checkEmpt('skypeID')|| !rcopen.checkInput.checkEmpt('rcUserName')
			){
			
			//console.log(name,sex,icNo,bank,accountName,accountNo,icPhotocopy,mobileID,skypeID,rcUserName,agentOrCompany,agentName,agentContatct);
			return false;
		}
		if(agentOrCompany==1 ){
			if(!rcopen.checkInput.checkEmpt('agentName') || !rcopen.checkInput.checkEmpt('agentContatct')){
				return false;
			}
		}
		
		if($("#is_upload").val()!=1){
			rcopen.checkInput.checkFile('icPhotocopy');
			return false;
		}
		
		var url = opencyou.url + "/user/anchorApply/addapply";
		
		if(id>0){
			url = opencyou.url + "/user/anchorApply/updateapply";
		}
		
		//console.log(name,sex,icNo,bank,accountName,accountNo,icPhotocopy,mobileID,skypeID,rcUserName,agentOrCompany,agentName,agentContatct);
		
		$.ajax({
			type : "post",
			url : url,
			data : {
				id:id,
				name:name,
				sex:sex,
				icNo:icNo,
				bank:bank,
				accountName:accountName,
				accountNo:accountNo,
				//icPhotocopy:icPhotocopy,
				mobileID:mobileID,
				skypeID:skypeID,
				rcUserName:rcUserName,
				agentOrCompany:agentOrCompany,
				agentName:agentName,
				agentContatct:agentContatct
			},
			dataType : "json",
			success : function(data) {
				if(data.errordesc=='login failed'){
					opencyou.account.userLogout();
					return false;
				}
				if (data != null && data.user_success == true ){
					window.location.reload();
				}else if(data != null && data.error_code == -3  ){
					$("#tip_submit").html("没有上传图片！");
					
				}else if(data != null && data.error_code == -1  ){
					$("#tip_submit").html("参数错误！");
					
				}else{
					$("#tip_submit").html("申请失败！");
				}
				$("#tip_icPhotocopy").html("");
				$("#tip_icPhotocopy").css("color","#f00");
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
		if(atype==1){
			type="receive";
		}else{
			type = "send";
		}
		
		var box1 = $('#recordListBox1');
		var box2 = $('#recordListBox2');
		var tip = $('#noRecordTip');
		var startTime = $('#d1').val();
		var endTime = $('#d2').val();
		var groupid = $('#group').val();
		if (startTime && endTime) {
			type = type == 'receive' ? 'receive' : 'send';
			var url = opencyou.url  + '/gift/findrecord?page_size=12&start=' + startTime + '&end=' + endTime + '&type=' + type + '&groupid=' + groupid;
			$.get(url, function(data) {
				if (findError(data)) {
					return;
				}
				box1.add(box2).add(tip).hide();
				var total = parseInt(data);
				if (!isNaN(total)) {
					if (total > 0) {
						if (type == 'receive' && recordPageObj1) {
							recordPageObj1.api = url;
							recordPageObj1.lastSelectPage = 0;
							recordPageObj1.init(total, 'recordPages1', 'recordPageObj1');
							box1.show();
						} else if (type == 'send' && recordPageObj2) {
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
	},
	checkBuyVip:function(){
		var vipbuy = $("#pay_value").html();
		var vipamount = $("#vipamount").val();
		$.ajax({
			type : "post",
			url : opencyou.url + "/rcpay/getshowbi",
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null && data.user_success != null
						&& data.user_success == false) {
				}else{
					if(data.amount>vipbuy){
						var div_dialog="<div class='commonDialog'><div class='common_close'>"
							+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
							+"<p class=' mt30 tc fts14 '>Your remaining Token：<i class=' colorred1'>"+data.amount+"</i></p> "
							+"<p class=' mt10 tc fts16'>Are you sure buy \""+vipamount+"\" VIP?</p> "
							+"<div class=' bc mt30 tc'> "
							+"<a class='close_tag btn_grey  ' href='javascript:;' titel=Cancel'> Cancel </a>"
							+"<a class='close_tag btn_red ml30 ' onclick='rcopen.api.buyVip()' href='javascript:void(0);' titel='Confirm'> Confirm </a></div> "
							+"</div>";
							
						scroll(0,0);
						$.popbox(div_dialog);
						
						// 弹窗关闭按钮
						$(".close_tag").click( function() {
							$("#zxxBlank").remove();
							$(this).parents(".wrap_out").remove();
						});
						
					}else{
						var div_dialog="<div class='commonDialog'><div class='common_close'>"
							+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
							+"<p class=' mt30 tc fts14 '>Your remaining Token：<i class=' colorred1'>"+data.amount+"</i></p> "
							+"<p class=' mt10 tc fts16'>Your have insufficient balance, please try again after you've topped off your balance on the recharge page.</p> "
							+"<div class=' bc mt30 tc'><a class='close_tag btn_red  '  onclick=\"javascript:window.open('"+opencyou.url+"/pay/paycharge.html','_blank');\" herf='#'  titel='recharge'> Recharge </a> </div> "
							+"</div>";
							
						scroll(0,0);
						$.popbox(div_dialog);
						
						// 弹窗关闭按钮
						$(".close_tag").click( function() {
							$("#zxxBlank").remove();
							$(this).parents(".wrap_out").remove();
						});
					}
				}
			}
		});
	},
	buyVip:function(){
		var vipbuy = $("#pay_value").html();
		var vipamount = $("#vipamount").val();
		$.ajax({
			type : "post",
			url : opencyou.url + "/account/info/buyvip",
			data : {
				vipbuy:vipbuy,
				vipamount:vipamount
			},
			dataType : "json",
			success : function(data) {
				if (data != null && data.success != null
						&& data.success == false) {
					alert(data.info);
				}else{
					/*var div_dialog="<div class='commonDialog'><div class='common_close'>"
						+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag2' style='cursor: pointer'/></div>"
						+"<span class='icon_vip5'></span><p class=' mt50 ml130 fts16'> You are a VIP now！</p> "
						+"</div>";
						
					scroll(0,0);
					$.popbox(div_dialog);
					
					// 弹窗关闭按钮
					$(".close_tag2").click( function() {
						$("#zxxBlank").remove();
						$(this).parents(".wrap_out").remove();
						window.location.reload();
					});	*/
					
					var car = data.car;
						var div_dialog='<div class="carDialog" ><div class="carContent"><div class="car_close"><img src="'+ opencyou.url
							+'/imgs/close_16x16.png" align="right" class="close_tag" style="cursor: pointer"></div>'
							+'<div class="carBg"><div class="car_title"></div><p class=" fts18">Has been cool car '+car.name+'!</p> '
                    		+'<img src="'+opencyou.url+car.image+'" width="450" class=" mt20"/></div>'
                    
							+'<p class=" mt10 fts14">Effective date: <i class=" colorred1">'+Date.prototype.TimeStamp2Date(data.etime)+'</i></p> '
							+'<p class=" mt10 fts14">Please go to the <a href="'+opencyou.url+'/center/userCar.html" target="_blank" '
								+'class=" color36b">my account - my car</a> in the query.</p> ';
							
							if(data.carnumber==null || data.carnumber==''){
								div_dialog+='<div class=" tc mt30"> <a class=" btn_red bc fts12" href="javascript:rcmall.car.chooseCarBarn(2);" titel="Confirm"> 选则车牌 </a></div>';
							}
							
						    div_dialog+='</div></div>';
							
							scroll(0,0);
							$.popbox(div_dialog);
							
							// 弹窗关闭按钮
							$(".close_tag").click( function() {
								$("#zxxBlank").remove();
								$(this).parents(".wrap_out").remove();
								
							});
					
				}
			}
		});
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
	checkEmpt:function(id){
		
		var val =  String.prototype.trim($('#'+id).val());
		$('#'+id).val(val);
		if(val==""){
			rcopen.checkInput.showTip(id,"Required.");
		}else{
			rcopen.checkInput.showTip(id,1);
			return true;
		}
		return false;
	},
	checkFile:function(id){
		
		var filename =  $('#'+id).val();
		
		if(filename==""){
			rcopen.checkInput.showTip(id,"Required.");
		}else{
			
			var pos = filename.lastIndexOf(".");  
            var str = filename.substring(pos, filename.length);  
            var str1 = str.toLowerCase();
            if(id=='icPhotocopy' || id=='_icPhotocopy'){
            	if (str1 == '.jpg') { 
    				rcopen.checkInput.showTip(id,1);
    				return true;
    			} else{
    				$("#tip_icPhotocopy").css("color","#f00");
    				$("#tip__icPhotocopy").css("color","#f00")
    				rcopen.checkInput.showTip(id,"Support jpg.");
    			}	
            }else{
            	rcopen.checkInput.showTip(id,1);
				return true;
            }
		}	
		return false;
	},
	checkEmail:function(id){
		var val =  String.prototype.trim($('#'+id).val());
		
		if(val==""){
			 rcopen.checkInput.showTip(id,"Required.");
		}else{
			var patrn = /^([a-zA-Z0-9]{1})+([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,4}$/;
			//var patrn = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.[a-zA-Z]{2,3}$/;
			//var patrn =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9])*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if (!patrn.exec(val)) {
				rcopen.checkInput.showTip(id,"An invalid email format!");
			//}
			//if(val.indexOf('@')==-1 || val.indexOf('.')==-1){
			//	rcopen.checkInput.showTip(id,"电邮格式错误");
			}else if(val.length<6 || val.length>64){
				rcopen.checkInput.showTip(id,"An invalid email format!");
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
				 rcopen.checkInput.showTip(id,"Not the same as the original email address!");
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
				 rcopen.checkInput.showTip(id,"These email addresses don't match.");
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
	checkUsername:function(id,title,length){
		
		var val =  String.prototype.trim($('#'+id).val());
		if(val==""){
			rcopen.checkInput.showTip(id,"Required.");
		}else if(val.length<1 || val.length>length){
			 rcopen.checkInput.showTip(id,title+" limited to  "+length+" characters.");
		}else{
			rcopen.checkInput.showTip(id,1);
			return true;
		}
		return false;
	},
	textCounter:function (field, maxlimit) { 
		
		if (field.value.length > maxlimit){ 
			field.value = field.value.substring(0, maxlimit); 
			remLen.value="The characters can not exceed "+maxlimit;
			
		}else{ 
			remLen.value="";
			//document.upbook.remLen.value = maxlimit - field.value.length; 
		} 
	} ,
	checkGroupName:function(id){
		var val =  String.prototype.trim($('#'+id).val());
		
		if(val==""){
			 rcopen.checkInput.showTip(id,"Required.");
		}else{
			
			if (val.length>0) {
				
				var url = opencyou.url + "/account/info/checkgroup";
				var name = group_name.value;
				$.ajax({
					type : "post",
					url : url,
					data : {
						name:name
					},
					dataType : "json",
					success : function(data) {
						if(data.errordesc=='login failed'){
							opencyou.account.userLogout();
							return false;
						}
						if (data != null && data.user_success == true ){
							rcopen.checkInput.showTip(id,"Channel name is already in use!");
						}else{
							$("#tip_group_name").html("");	
							rcopen.checkInput.showTip(id,1);
						}
					}
				});
				
			}else {
				rcopen.checkInput.showTip(id,"An invalid name format!");
			}
		}
		
		
	}



};

