$(document).ready(function() {
	rcrank.api.loadFollowRank();
	rcrank.api.loadGrossingRank();
	rcrank.api.loadFlowersRank();
});

var rcrank ={};
rcrank.api = {
	elemFollowRank1:$("#followRank1"),
	elemFollowRank2:$("#followRank2"),
	elemFollowRank3:$("#followRank3"),
	elemFollowRank4:$("#followRank4"),
	elemGrossingRank1:$("#grossingRank1"),
	elemGrossingRank2:$("#grossingRank2"),
	elemGrossingRank3:$("#grossingRank3"),
	elemGrossingRank4:$("#grossingRank4"),
	elemFlowersRank1:$("#flowersRank1"),
	elemFlowersRank2:$("#flowersRank2"),
	elemFlowersRank3:$("#flowersRank3"),
	elemFlowersRank4:$("#flowersRank4"),
	init : function() {
	},
	loadFollowRank:function(){
		var len=20;
		var div="";
		
		for(var i =1; i <= len;i++){
			var rid='',ridClass='',lClass='';
			if(i==1 ){rid=''; ridClass='icon_r1';lClass='l_one bgcolorffdee3';}
			else if(i==2 ){rid=''; ridClass='icon_r2'; lClass='l_one bgcolorffeef1';}
			else if(i==3 ){rid=''; ridClass='icon_r3';lClass='l_one bgcolorfff7f8';}
			else { rid=''+i; }
			
			div+='<div class="left_one"><div class="l_li '+lClass+'">'
				+'<div class="rank_id fl '+ridClass+'">'+rid+'</div><div class="fl pr" >';
			if(rid==''){
				div+='<a href="http://www.showoo.cc/live/t.html?s=100762" target="_blank" title="">'
				+'<img src="http://www.showoo.cc/PubImgSour/1420469117307.jpg" class="fl" width="60" height="60" border="0"></a>';
			}
			div+='<ul class="toolul"><li><a href="http://www.showoo.cc/live/t.html?s=100762">♚ลึกโอบฉัน♚  <img src="../live/pic/exp/24.png" height="22"/>    </a> </li>'
				+'<li class="grey"><span class="t_num"><span>10000</span>'
				+'</span></li></ul></div></div></div>';
		}
		this.elemFollowRank1.html(div);
		this.elemFollowRank2.html(div);
		this.elemFollowRank3.html(div);
		this.elemFollowRank4.html(div);
	},loadGrossingRank:function(){
		var len=20;
		var div="";
		
		for(var i =1; i <= len;i++){
			var rid='',ridClass='',lClass='';
			if(i==1 ){rid=''; ridClass='icon_r1';lClass='l_one bgcoloreaddfb';}
			else if(i==2 ){rid=''; ridClass='icon_r2'; lClass='l_one bgcolorf4eefd';}
			else if(i==3 ){rid=''; ridClass='icon_r3';lClass='l_one bgcolorfaf7fe';}
			else { rid=''+i; }
			
			div+='<div class="left_one"><div class="l_li '+lClass+'">'
				+'<div class="rank_id fl '+ridClass+'">'+rid+'</div><div class="fl pr" >';
			if(rid==''){
				div+='<a href="http://www.showoo.cc/live/t.html?s=100762" target="_blank" title="">'
				+'<img src="http://www.showoo.cc/PubImgSour/1420469117307.jpg" class="fl" width="60" height="60" border="0"></a>';
			}
			div+='<ul class="toolul"><li><a href="http://www.showoo.cc/live/t.html?s=100762">♚ลึกโอบฉัน♚</a></li>'
				+'<li class="grey"><span class="t_num"><span>10000</span>'
				+'</span></li></ul></div></div></div>';
		}
		this.elemGrossingRank1.html(div);
		this.elemGrossingRank2.html(div);
		this.elemGrossingRank3.html(div);
		this.elemGrossingRank4.html(div);
	},
	loadFlowersRank:function(){
		var len=20;
		var div="";
		
		for(var i =1; i <= len;i++){
			var rid='',ridClass='',lClass='';
			if(i==1 ){rid=''; ridClass='icon_r1';lClass='l_one bgcolorccf3ef';}
			else if(i==2 ){rid=''; ridClass='icon_r2'; lClass='l_one bgcolore5f9f7';}
			else if(i==3 ){rid=''; ridClass='icon_r3';lClass='l_one bgcolorf2fcfb';}
			else { rid=''+i; }
			
			div+='<div class="left_one"><div class="l_li '+lClass+'">'
				+'<div class="rank_id fl '+ridClass+'">'+rid+'</div><div class="fl pr" >';
			if(rid==''){
				div+='<a href="http://www.showoo.cc/live/t.html?s=100762" target="_blank" title="">'
				+'<img src="http://www.showoo.cc/PubImgSour/1420469117307.jpg" class="fl" width="60" height="60" border="0"></a>';
			}
			div+='<ul class="toolul"><li><a href="http://www.showoo.cc/live/t.html?s=100762">♚ลึกโอบฉัน♚</a></li>'
				+'<li class="grey"><span class="t_num"><span>10000</span>'
				+'</span></li></ul></div></div></div>';
		}
		this.elemFlowersRank1.html(div);
		this.elemFlowersRank2.html(div);
		this.elemFlowersRank3.html(div);
		this.elemFlowersRank4.html(div);
	}
	
};
