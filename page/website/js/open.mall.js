$(document).ready(function() {

});

var rcmall ={};
rcmall.api = {
		
	initCarList:function(){
			
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/car/carlist",
				data : {type:1},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						var obj = data;
						var div="";
						for(var i in obj.list){
							div+='<div class=" car_one"><div class="car_show"><div class="image">';
							if( obj.list[i].image.indexOf(".swf")>0 ){
								div+='<object type="application/x-shockwave-flash" data="'+opencyou.url+obj.list[i].image+'" width="160" ><param name="wmode" value="transparent"></object>';
							}else{
								div+='<img src="'+opencyou.url+obj.list[i].image+'" />';
							}
							
							div+='</div><div class="icon"><span class="icon01"><img src="'+opencyou.url+obj.list[i].icon+'" /></span><span>'+obj.list[i].name
								+'</span></div></div> <div class="car_price">价格：<span class="num">'+obj.list[i].price
								+'</span> Token/'+obj.list[i].cycle+' months</div>';
							if(obj.list[i].status== -1 ){
								div+= '<a href="javascript:;" class="car_buy_un">BUY</a></div>';//<span class="sale"></span>
							}else{
								div+= '<a href="javascript:rcmall.api.checkBuyCar('+obj.list[i].id+','+obj.list[i].price+',\''+obj.list[i].name+'\','+obj.list[i].cycle+');" class="car_buy">BUY</a></div>';
							}	
						}
						
						$("#cars_content").append(div);
					}else{
						$("#cars_content").append(" 暂无车辆出售！");
					}
				}
			});
			
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/car/carlist",
				data : {type:2},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						
						var obj = data;
						var div="";
						for(var i in obj.list){
							div+='<div class=" car_one"><div class="car_show"><div class="image">';
							if( obj.list[i].image.indexOf(".swf")>0 ){
								div+='<object type="application/x-shockwave-flash" data="'+opencyou.url+obj.list[i].image+'" width="160" ><param name="wmode" value="transparent"></object>';
							}else{
								div+='<img src="'+opencyou.url+obj.list[i].image+'" />';
							}
							
							div+='</div><div class="icon"><span class="icon01"><img src="'+opencyou.url+obj.list[i].icon+'" /></span><span>'+obj.list[i].name
								+'</span></div></div> <div class="car_price">价格：<span class="num">'+obj.list[i].price
								+'</span> Token/'+obj.list[i].cycle+' months</div>';
							if(obj.list[i].status== -1 ){
								div+= '<a href="javascript:;" class="car_buy_un">BUY</a></div>';//<span class="sale"></span>
							}else{
								div+= '<a href="javascript:rcmall.api.checkBuyCar('+obj.list[i].id+','+obj.list[i].price+',\''+obj.list[i].name+'\','+obj.list[i].cycle+');" class="car_buy">BUY</a></div>';
							}	
						}
						
						$("#cars_content2").append(div);
					}else{
						$("#cars_content2").append(" 暂无车辆出售！");
					}
				}
			});
			
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/car/carlist",
				data : {type:3},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						
						var obj = data;
						var div="";
						for(var i in obj.list){
							div+='<div class=" car_one"><div class="car_show"><div class="image">';
							if( obj.list[i].image.indexOf(".swf")>0 ){
								div+='<object type="application/x-shockwave-flash" data="'+opencyou.url+obj.list[i].image+'" width="160" ><param name="wmode" value="transparent"></object>';
							}else{
								div+='<img src="'+opencyou.url+obj.list[i].image+'" />';
							}
							
							div+='</div><div class="icon"><span class="icon01"><img src="'+opencyou.url+obj.list[i].icon+'" /></span><span>'+obj.list[i].name
								+'</span></div></div> <div class="car_price">价格：<span class="num">'+obj.list[i].price
								+'</span> Token/'+obj.list[i].cycle+' months</div>';
							if(obj.list[i].status== -1 ){
								div+= '<a href="javascript:;" class="car_buy_un">BUY</a></div>';//<span class="sale"></span>
							}else{
								div+= '<a href="javascript:rcmall.api.checkBuyCar('+obj.list[i].id+','+obj.list[i].price+',\''+obj.list[i].name+'\','+obj.list[i].cycle+');" class="car_buy">BUY</a></div>';
							}	
						}
						
						$("#cars_content3").append(div);
					}else{
						$("#cars_content3").append(" 暂无车辆出售！");
					}
				}
			});
	},
	checkBuyCar:function(cid,price,name,cycle){
			var vipbuy = price;//$("#pay_value").html();
			var vipamount = $("#vipamount").val();
			$.ajax({
				type : "post",
				url : opencyou.url + "/rcpay/getshowbi",
				data : {},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						
						if(data.amount>vipbuy){
							var div_dialog="<div class='commonDialog p20'><div class='common_close'>"
								+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag' style='cursor: pointer'/></div>"
								+"<p class=' mt10 fts16'>Are you sure buy Car <font color='red'>"+name+"</font>?</p> "
								+"<p class=' mt10 line24 fts14 '>Your remaining Token：<span class=' colortoken'>"+data.amount+"</span></p> "
								+"<p class=' line24 fts14'>价格： <span class='colortoken'>"+price+"</span>Tokens</p> "
								+"<p class=' line24 fts14'>有效期： "+cycle+" Months</p> "
								+"<div class=' bc mt30 tc'> "
								+"<a class='close_tag btn_grey  ' href='javascript:;' titel='Cancel'> Cancel </a>"
								+"<a class='close_tag btn_red ml30 ' onclick='rcmall.api.buyCar("+cid+","+price+")' href='javascript:void(0);' titel='Confirm'> Confirm </a></div> "
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
					}else{
						console.log(data);
					}
					
				}
			});
	},
	buyCar:function(cid,amount){
			
			$.ajax({
				type : "post",
				url : opencyou.url + "/business/car/buycar",
				data : {
					cid:cid,
					amount:amount
				},
				dataType : "json",
				success : function(data) {
					console.log(data);
					if (data != null && data.success != null && data.success == true) {
						
						/*
						var div_dialog="<div class='commonDialog'><div class='common_close'>"
							+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag2' style='cursor: pointer'/></div>"
							+"<p class=' mt20 tc fts16'> 恭喜,车辆购买成功！</p> ";
							
							if(data.carnumber==null || data.carnumber==''){
								div_dialog+="<div class=' bc mt10 tc'> "
								+"<a class='close_tag btn_red' href='javascript:rcmall.car.chooseCarBarn(1);' titel='Confirm'> 选则车牌 </a></div> "
							}
							div_dialog+="</div>";
							
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
                    
							+'<p class=" mt10 fts14">Effective date: <i class=" colorred1">'+data.endtime+'</i></p> '
							+'<p class=" mt10 fts14">Please go to the <a href="'+opencyou.url+'/center/userCar.html" target="_blank" '
								+'class=" color36b">my account - my car</a> in the query.</p> ';
							
							if(data.carnumber==null || data.carnumber==''){
								div_dialog+='<div class=" tc mt30"> <a class="close_tag btn_red bc fts12 " href="javascript:rcmall.car.chooseCarBarn(1);" titel="Confirm"> 选则车牌 </a></div>';
							}
							
						    div_dialog+='</div></div>';
							
							scroll(0,0);
							$.popbox(div_dialog);
							
							// 弹窗关闭按钮
							$(".close_tag").click( function() {
								$("#zxxBlank").remove();
								$(this).parents(".wrap_out").remove();
							});
							
					}else{
						
						var div_dialog="<div class='commonDialog'><div class='common_close'>"
							+"<img src='"+ opencyou.url+"/imgs/close_16x16.png' align='right' class='close_tag2' style='cursor: pointer'/></div>"
							+"<p class=' mt50 ml130 fts16'> 购买失败！"+data.error_code+"</p> "
							+"</div>";
							
						scroll(0,0);
						$.popbox(div_dialog);
						
						// 弹窗关闭按钮
						$(".close_tag2").click( function() {
							$("#zxxBlank").remove();
							$(this).parents(".wrap_out").remove();
							window.location.reload();
						});	
					}
				}
			});
	},initGuardCar:function(){
		var url= opencyou.url + "/business/car/carlist";
			$.ajax({
				type : "get",
				url : url,
				data : {type:5},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success == true) {
						console.log(data);
						if(data.list.length>0){
							var car = data.list[0];
							$("#carname").html(car.name);
							var cimg=document.getElementById("carimage");
							if( cimg!= null){
								cimg.src=opencyou.url+car.image;
							}
							
						}
					}
				}
			});
	}
	
};

/*********mycar api*********/
rcmall.car = {
	initMyCar:function(){
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/car/usercars",
				data : {},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						
						var div="";
						for(var i in data.list){
							//console.log(data.list[i]);
							var obj = data.list[i];
							div+='<div class=" car_one">'
									+'<div class="car_show"><div class="image">';
									
							if( obj[6].indexOf(".swf")>0){
								div += '<object type="application/x-shockwave-flash" data="'+opencyou.url+obj[6]+'" width="160" ><param name="wmode" value="transparent"></object>'	
							}else{	
								div +='<img src="'+opencyou.url+obj[6]+'" width="160"/>';
							}
							
							div+='</div><div class="icon"><span class="icon01"><img src="'+opencyou.url+obj[5]+'" height="26"  /></span><span>'+obj[4]+'</span></div></div>';
							if(obj[7]==2){
								div+='<div class="car_price">价格：<span class="num">VIP gift</span></div>';
							}else if(obj[7]==3){
								div+='<div class="car_price">价格：<span class="num">Guardian gift</span></div>';
							}else{
								div+='<div class="car_price">价格：<span class="num">'+obj[2]+'</span>Tokens</div>';
							}
							div+='<div class="car_price">有效期至：'+Date.prototype.TimeStamp2Date(obj[3])+'</div>';
							if(obj[1]==1){
								div+='<a href="javascript:;" class="car_buy_un radius3" >正在使用</a>'
									+'<div class="car_using">正在使用</div>';
									
								var carDiv='<p class="C_car_name"><img src="'+opencyou.url+obj[5]+'" height="26" /><span>'+obj[4]+'</span></p>';
                                if( obj[7]==2){
									carDiv+='<p>价格：<span class="num">VIP赠送</span></p>';
								}else if(obj[7]==3){
									carDiv+='<p>价格：<span class="num">Guard赠送</span></p>';
								}else{
									carDiv+='<p>价格：<span class="num">'+obj[2]+'</span>Tokens</p>';
								}
								
								carDiv+='<p>有效期至：<span>'+Date.prototype.TimeStamp2Date(obj[3])+'</span></p>'
                                	+'<a href="javascript:rcmall.car.cancelCar('+obj[0]+');" class="btn_car_unuser radius3" >取消出行车</a>'
                                	+'<div class="C_car_count" >共 <span class="num" id="myCarCount">'+data.list.length+'</span> 辆车</div>';
								$("#idCarInfo").html(carDiv);
								if( obj[6].indexOf(".swf")>0){
									$("#idCarPost").html('<object type="application/x-shockwave-flash" data="'+opencyou.url+obj[6]+'" width="310" ><param name="wmode" value="transparent"></object>');
								}else{
									$("#idCarPost").html('<img src="'+opencyou.url+obj[6]+'" width="310" />');
								}
							}else{
								div+='<a href="javascript:rcmall.car.changeCar('+obj[0]+');" class="car_buy radius3" >使用该车出行</a>';
							}
							div+='</div>';
							
							if(obj[7]==1){
								$("#cWay1").html('<a href="javascript:rcmall.car.chooseCarBarn(1);" class="href">点击领取</a>');
							}else if(obj[7]==2){
								$("#cWay2").html('<a href="javascript:rcmall.car.chooseCarBarn(2);" class="href">点击领取</a>');
							}else if(obj[7]==3){
								$("#cWay3").html('<a href="javascript:rcmall.car.chooseCarBarn(3);" class="href">点击领取</a>');
							}
						}
						
						$("#id_c_content").append(div);
					}else{
						$("#id_c_content").append("暂无车辆！");
					}
				}
			});
	},
	initMyCarBarn:function(){
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/carnumber/usercarnumbers",
				data : {},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						
						var div="";
						for(var i in data.list){
							var obj = data.list[i];
							if(obj.type==1){
								//var div ='<a href="javascript:;" class="barn">'+obj.number+'</a><p>普通车牌</p>';
								var div ='<div class="C_zhantai"><a href="javascript:;" class="barn">'+obj.number+'</a>';
								
								if(obj.status==1){
									div+='<div class="carbarn_using">正在使用</div>';
								}else{
									div+='<a href="javascript:rcmall.car.changeCarNumber(\''+obj.number+'\');" >设为出行车牌</a>';
								}
								div+='</div><p>普通车牌</p>';
								
								$("#carbarnBuy").html(div);
							}else if(obj.type==2){
								//var div ='<a href="javascript:;" class="barn">'+obj.number+'</a><p>VIP车牌</p>';
								
								var div ='<div class="C_zhantai"><a href="javascript:;" class="barn">'+obj.number+'</a>';
								
								if(obj.status==1){
									div+='<div class="carbarn_using">正在使用</div>';
								}else{
									div+='<a href="javascript:rcmall.car.changeCarNumber(\''+obj.number+'\');" >设为出行车牌</a>';
								}
								div+='</div><p>VIP车牌</p>';
								
								$("#carbarnVip").html(div);
							}else if(obj.type==3){
								//var div ='<a href="javascript:;" class="barn">'+obj.number+'</a><p>守护车牌</p>';
								
								var div ='<div class="C_zhantai"><a href="javascript:;" class="barn">'+obj.number+'</a>';
								
								if(obj.status==1){
									div+='<div class="carbarn_using">正在使用</div>';
								}else{
									div+='<a href="javascript:rcmall.car.changeCarNumber(\''+obj.number+'\');" >设为出行车牌</a>';
								}
								div+='</div><p>守护车牌</p>';
								
								$("#carbarnGuard").html(div);
							}
						}
						
					}
				}
			});
	},
	changeCarNumber:function(number){
		//console.log(cid);
		$.ajax({
				type : "post",
				url : opencyou.url + "/business/carnumber/changecarnumber",
				data : {number:number},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						window.location.reload();
					}else{
						if(data.error_code==-1){}
						//alert("出行失败！");
					}
				}
		});
	},
	changeCar:function(cid){
		//console.log(cid);
		$.ajax({
				type : "post",
				url : opencyou.url + "/business/car/changecar",
				data : {cid:cid},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						window.location.reload();
					}else{
						if(data.error_code==-1){}
						//alert("出行失败！");
					}
				}
		});
	},
	cancelCar:function(cid){
		console.log(cid);
		$.ajax({
				type : "post",
				url : opencyou.url + "/business/car/cancelcar",
				data : {cid:cid},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null && data.success == true) {
						window.location.reload();
					}else{
						//alert("车辆出行失败！");
					}
				}
		});
	},
	chooseCarBarn:function(type){
		var div_dialog="<div class='carBarnDialog'><div class='common_title'><span>挑选一个您喜欢的车牌号吧</span> "
						+"<a href='javascript:rcmall.car.changeCB("+type+");' title='' >换一批</a></div>"
					+"<div class='common_content' id='common_content_cb'></div> "
					+"<div class='common_tool'><span class='num'>您选定的车牌号为：<span id='carbarn_value' ></span></span> "
						+"<a class='close_tag btn_cancel' href='javascript:;' titel='Confirm'> 以后再说 </a> "
						+"<a class='btn_confirm ' href='javascript:rcmall.car.buyCarNumber("+type+");' titel='Cancel'> Confirm </a></div>"
					+"</div>";
					
				scroll(0,0);
				$.popbox(div_dialog);
				
				// 弹窗关闭按钮
				$(".close_tag").click( function() {
					$("#zxxBlank").remove();
					$(this).parents(".wrap_out").remove();
				});
				rcmall.car.changeCB(type);
				
	},
	changeCB:function (type){
			$.ajax({
				type : "get",
				url : opencyou.url + "/business/carnumber/getrandbarn",
				data : {
					size:24,
					type:type
				},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null&& data.success == true) {
						
						var div='';
						for(var i in data.list){
							if(i==0){ $("#carbarn_value").html(data.list[i].number);}
							div+=" <a href='javascript:;' value='"+data.list[i].number+"'>"+data.list[i].number+"</a> ";
						}
						$("#common_content_cb").html(div);
						
						$(".common_content a").click(function(){
							$(".common_content a").removeClass("on");
							$(this).addClass("on");
							$("#carbarn_value").html($(this).attr("value"));
						});
					}else{
						
					}
				}
			});
	},buyCarNumber:function(type){
		var number=$("#carbarn_value").html();
		console.log(number);
		if(number==null || number=='' ){ alert("请选择车牌");}
		$.ajax({
				type : "post",
				url : opencyou.url + "/business/carnumber/buycarnumber",
				data : {
					number:number,
					type:type
				},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success != null&& data.success == true) {
						window.location.reload();
					}else{
						alert("购买失败！");
					}
				}
			});
	}
}
