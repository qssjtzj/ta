$(document).ready(function() {
	var group=opencyou.utils.getGroup();
	if('custom'==group){
		var page=opencyou.utils.getPage(group);
		if('apporder'==page){
			opencyou.customer.getCustomGameList();
		}else if('cusorder'==page){
			opencyou.customer.loadHistoryPage();
		}else if('oldorder_info'==page){
			opencyou.customer.getHistoryOne();
		}else if('order_info'==page){
			opencyou.customer.getCustomOne();
		}
	}
});
/**
 * 客服相关对象
 */
opencyou.customer = {
	getCustomGameList : function() {
		var pNo=opencyou.utils.getParamFromUrl("pageNo");
		var pSize=opencyou.utils.getParamFromUrl("pageSize");
		
		var url = opencyou.url + "/customers/apps/list.json";
		$.ajax({
			type : "post",
			url : url,
			data : {
				page_no : pNo,
				page_size : pSize
			},
			dataType : "json",
			success : function(dd) {
				opencyou.account.checkUserData(dd);
				if (dd != null) {
					var data = dd.data;
					for (i in data) {
						var types = data[i].ordercount;
						var div = '<div class="bs-callout bs-callout-danger">';
								
						if (data[i].total_count > 0) {
							div += '<h4><a href="order_info.html?appkey=' + data[i].app_key + '">' + data[i].app_name;
							div += ' <span class="badge label-danger">'
									+ data[i].total_count + '</span> </a></h4><p>';
						} else {
							div += '<h4><a >' + data[i].app_name;
							div += ' <span class="badge">' + data[i].total_count
									+ '</span> </a></h4>';
						}

						for (j in types) {
							div += " <div class='list_word'>"
									+ types[j].type_name + "： "
									+ types[j].count + "</div>  ";
						}
						div += '</div>';

						$("#custom_game_list").append(div);
					}
					$("#order_today_counts").text(dd.today_solve);
					$("#order_history_counts").text(dd.total_solve);
					opencyou.page.init(dd.page_no, dd.page_size, dd.total_count,'apporder.html?');
				}
			}
		});
	},
	getCustomOne : function(){
		var appId = opencyou.utils.getParamFromUrl("appkey");
		var url = opencyou.url + "/customers/workorder/accept.json";
		var gettype = 0;
		if (appId != '') {
			gettype = 1;
		}
		$
				.ajax({
					url : url,
					data : {
						appkey : appId,
						gettype : gettype
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							var faq = data.faqs;
							// 用户信息

							$("#oreder_number").text(data.id);
							order_id.value = data.id;

							var div_user = "<span class='title width300'>游戏名称："
									+ data.game_name + "</span>";
							div_user += "<span class='title width300'>用户等级 ："
									+ data.user_level + "</span>";
							div_user += "<span class='title width300'>注册渠道 ："
									+ data.user_channel_name + "</span>";
							div_user += "<span class='title width300'>提问渠道 ："
									+ data.order_channel + "</span>";
							div_user += "<span class='title width300'>用户IP ："
									+ data.user_ip + "</span>";
							div_user += "<span class='title width300'>用户账号 ："
									+ data.user_account + "</span>";
							div_user += "<span class='title width300'>用户UDID ："
									+ data.user_udid + "</span>";
							$("#user_info_list").append(div_user);
							// 问题描述
							var div_faq = "<span class='title width300'>用户账号 ："
									+ data.user_account + "</span>";
							div_faq += "<span class='title width300'>服务器 ："
									+ data.game_server + "</span>";
							div_faq += "<span class='title width300'>手机系统 ："
									+ data.user_system + "</span>";
							div_faq += "<span class='title width300'>角色ID ："
									+ data.user_roleid + "</span>";
							div_faq += "<span class='title width300'>问题类型 ："
									+ data.order_type_name + "</span>";
							div_faq += "<span class='title width300'>提问时间 ："
									+ opencyou.utils.getLocalTime(data.create_date)
									+ "</span>";
							div_faq += "<span class='title width300'>联系方式 ："
									+ data.user_tel + "</span>";
							div_faq += "<span class='title width300'>&nbsp;</span>";

							if (data.user_order_id!=null&&data.user_order_id != '') {
								div_faq += "<p class='title'>支付订单信息 ：<span class='alert-info'> 流水号："
										+ data.user_order_id
										+ " ,支付时间："
										+ opencyou.utils.getLocalTime(data.user_pay_date)
										+ " ,支付金额："
										+ data.user_pay_money
										+ " </span> </p>";
							}
							div_faq += "<p><span class='title'>问题描述 ：<code class='this_code'>"
									+ faq[0].content + "</code></span></p>";
							$("#faq_info_list").append(div_faq);

							// 备注
							var notes = data.note;
							var div_note = "";
							for ( var n in notes) {
								div_note += "<div class='warning_border line_height24'><span class='width100'>"
										+ notes[n].content
										+ "</span><span class='navbar-right with100date'>"
										+ opencyou.utils.getLocalTime(notes[n].time)+" by "
										+notes[n].customer_name+"</span></div>";
							}
							$("#note_list").append(div_note);

						} else {
							// alert("暂无未处理工单！");
							// window.location.href = "custom.htm";
							easyDialog.open({
								container : {
									content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>暂无未处理工单！</p><p>即将跳转到首页！</p></div>'
									
								},
								autoClose : 2000,  
		                        callback : opencyou.customer.reloadCustom 
							});
							
						}

					}
				});
	},
	showMarket : function() {
		
		$('#markets_textarea').css('color','#dbdbdb');
		$("#markets_textarea").val("请填写备注内容");
		easyDialog.open({
			container : 'easyDialogWrapper1'
		});
		$("#easyDialogYesBtn").removeAttr("disabled"); 
	},
	closeMarkets : function() {
		easyDialog.close();
	},
	resetMarkets : function(){
		$("#markets_textarea").val("请填写备注内容");
		$("#markets_textarea").css("color","#dbdbdb");
	},
	submitMarket : function() {
		
		var content = $("#markets_textarea").val();
		var url = opencyou.url + "/customers/workorder/note.json";
		if(content=="" || content=='请填写备注内容'){
			$("#markets_textarea").val("请填写备注内容");
			$("#markets_textarea").css("color","#f00");
			return false;
		}
		$("#easyDialogYesBtn").attr("disabled",true); 
		$.ajax({
					url : url,
					data : {
						orderid : order_id.value,
						content : content
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							if (data.success == true) {
								var div_note="<div class='warning_border line_height24'><span class='width100'>"+ data.content+"</span><em class='navbar-right with100date'>"+opencyou.utils.getLocalTime(data.time)+" by "
								+data.customer_name+"</em></div>";
								$("#note_list").append(div_note);

								easyDialog.open({
											container : {
												content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>添加备注成功！</p></div>',
												yesFn : function() {
													opencyou.customer.closeMarkets();
												}
											}
										});

							}
						}

					}

				});

	},
	reSetReply : function() {
		$("#reply_content").val("请填写回复内容");
	},
	submitReply : function() {
		var url = opencyou.url + "/customers/workorder/reply.json";
		var content = $("#reply_content").val();
		
		if(content=="" || content=='请填写回复内容'){
			$("#reply_content").val("请填写回复内容");
			easyDialog.open({
				container : {
					content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p>请填写回复内容！</p></div>'
					},
					autoClose : 1500
				});
			return false;
		}
		$("#btnsubmit").attr("disabled",true); 
		$.ajax({
					url : url,
					data : {
						orderid : order_id.value,
						content : content
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						opencyou.account.checkUserData(data);
						if (data != null) {
							
							if (data.success == true) {
								// showMarket();
								easyDialog.open({
									container : {
										content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >答复内容已发送给用户！</p><p>感谢使用客服工具！</p></div>'
										
										},
										autoClose : 500,  
					                    callback : opencyou.customer.reloadCustom 
										
									});

							}else{
								easyDialog.open({
									container : {
										content : '<div style="margin-top:20px; text-align:center; font-size:20px; color:rgb(255,102,0);"><p >答复失败或工单已被处理过！</p><p>感谢使用客服工具！</p></div>'
										
										},
										autoClose : 2000,  
					                    callback : opencyou.customer.reloadCustom 
										
									});
							}
						}
					}

				});

	},
	reloadCustom : function(){
		window.location.href = "apporder.html";
	},
	navTypeList : function(id) {
		
		var url = opencyou.url +  "/customers/workorder/typelist.json";
		
		$.ajax({
			url: url,
			data: "",
			type:"post",
			dataType : "json",
			success: function(data) {
				opencyou.account.checkUserData(data);
				if(data!=null){
					
					var div="";
					for( i in data){
						if(data[i].type_id ==id){
							div+='<li class="active"><a href="cusorder.html?tid='+data[i].type_id+'">--'+data[i].type_name+'</a></li>';
						}else{
							div+='<li><a href="cusorder.html?tid='+data[i].type_id+'">--'+data[i].type_name+'</a></li>';
						}
					}
					$("#nav_type_list").append(div);
				}
			
			}
		});	
		
	},
	loadHistoryPage : function(){
		var tid=0;
		var ptid=opencyou.utils.getParamFromUrl("tid"); 
		var pno= opencyou.utils.getParamFromUrl("pageNo");
		var psize= opencyou.utils.getParamFromUrl("pageSize");
		var pageNo=1;
		var pageSize=10;
		if(pno!=''){
			pageNo=pno;
		}
		if(psize!=''){
			pageSize=psize;
		}
		if(ptid!=''){
			tid=ptid;
		}
//		opencyou.customer.navTypeList(tid);
		
		
		
		opencyou.customer.getHistoryList(pageNo,pageSize,tid);
	},
	getHistoryList : function(pNo,pSize,tid){
		var url = opencyou.url +  "/customers/workorder/donelist.json";
		
		$.ajax({
			url: url,
			data: {page_no: pNo, page_size: pSize,order_type:tid},
			type:"post",
			dataType : "json",
			success: function(dd) {
				opencyou.account.checkUserData(data);
				if(dd!=null){
					
					var data=dd.data;
					for( i in data){
						var faq=data[i].faqs;
						var div='<li>'+data[i].id +'</li><li>'+opencyou.utils.getLocalTime(data[i].create_date)+' </li>';
						var cont=faq[0].content;
	                    
	                    if(cont.length>29){
	                    	cont=cont.substring(0,29);
	                    	cont+="...";
	                    }
	                    div+='<li>'+data[i].user_account+'</li><li>' +opencyou.utils.getLocalTime(data[i].update_date) +'</li>';
	                    var cont_faq=faq[1].content;
	                    
	                    if(cont_faq.length>29){
	                    	cont_faq=cont_faq.substring(0,29);
	                    	cont_faq+="...";
	                    }
	                    div+='<li><a href="oldorder_info.html?oid='+data[i].id +'">查看详情</a></li>';
						$("#page_history_list").append(div);
					}
					
					opencyou.page.init(pNo,pSize,dd.total_count,'cusorder.html?tid='+tid+'&');// dd.total_count
				}
			
			}
		});	
	},
	getHistoryOne : function(){
		var orderId=opencyou.utils.getParamFromUrl("oid"); 
		var url = opencyou.url +  "/customers/workorder/get.json";
		
		$.ajax({
			url: url,
			data: {orderid: orderId},
			type:"post",
			dataType : "json",
			success: function(data) {
				opencyou.account.checkUserData(data);
				if(data!=null){
					
					var faq=data.faqs;
						// 用户信息
					
					$("#oreder_number").text(data.id);
					order_id.value=data.id;
					
						var div_user="<span class='title width300'>游戏名称："+data.game_name+"</span>";
						div_user+="<span class='title width300'>用户等级 ："+data.user_level+"</span>";
						div_user+="<span class='title width300'>注册渠道 ："+data.user_channel_name+"</span>";
						div_user+="<span class='title width300'>提问渠道 ："+data.order_channel+"</span>";
						div_user+="<span class='title width300'>用户IP ："+data.user_ip+"</span>";
						div_user+="<span class='title width300'>用户账号 ："+data.user_account+"</span>";
						div_user+="<span class='title width300'>用户UDID ："+data.user_udid+"</span>"; 
						$("#user_info_list").append(div_user);
						// 问题描述
						var div_faq="<span class='title width300'>用户账号 ："+data.user_account+"</span>";
						div_faq+="<span class='title width300'>服务器 ："+data.game_server+"</span>";
						div_faq+="<span class='title width300'>手机系统 ："+data.user_system+"</span>";
						div_faq+="<span class='title width300'>角色ID ："+data.user_roleid+"</span>";
						div_faq+="<span class='title width300'>问题类型 ："+data.order_type_name+"</span>";
						div_faq+="<span class='title width300'>提问时间 ："+opencyou.utils.getLocalTime(data.create_date)+"</span>";
						div_faq+="<span class='title width300'>联系方式 ："+data.user_tel+"</span>"; 
						div_faq+="<span class='title width300'>&nbsp;</span>";
						
						if(data.user_order_id!=null&&data.user_order_id!=''){
							div_faq+="<p class='title'>支付订单信息 ：<span class='alert-info'> 流水号："+data.user_order_id+" ,支付时间："+opencyou.utils.getLocalTime(data.user_pay_date)+" ,支付金额："+data.user_pay_money+" </span> </p>"; 
						}
						div_faq+="<p><span class='title'>问题描述 ：<code class='this_code'>"+faq[0].content+"</code></span></p>"; 
						$("#faq_info_list").append(div_faq);
						div_faq="<p><span class=''>"+faq[1].content+"</span></p>";
						$("#reply_list").append(div_faq);
						
					// 备注
					var notes=data.note;
					var div_note="";
					for(var n in notes){
						// div_note+="<div class='warning_border
						// line_height24'><span>"+notes[n].content+"</span><em
						// class='navbar-right'>"+getLocalTime(notes[n].time)+"</em></div>";
						div_note += "<div class='warning_border line_height24'><span class='width100'>"
							+ notes[n].content
							+ "</span><span class='navbar-right with100date'>"
							+ opencyou.utils.getLocalTime(notes[n].time)+" by "
							+notes[n].customer_name+"</span></div>";
					}
					$("#note_list").append(div_note);
				}
			
			}
		});	
	}
}
