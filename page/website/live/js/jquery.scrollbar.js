(function($) {

jQuery.fn.extend({
	jqScrollbar: function() {	
		var _this=$(this);
		var scrCont=$(this).find(".scrCont");
		var scrPanel=$(this).find(".scrPanel");
		var scrUp=scrPanel.find(".scrUp");
		var scrDown=scrPanel.find(".scrDown");
		var scrZone=scrPanel.find(".scrZone");
		var scrBar=scrPanel.find(".scrBar");
		
		var mouseX,mouseY;
		var isMouseOver;
		var isMouseDrag;
		var lineT=scrZone.position().top;
		var htDisplay=$(this).height();//可见区域高度
		var htZone=htDisplay-scrUp.height()-scrDown.height();//可滑动高度
		var htBar=scrBar.height();
		var lineB=lineT+htZone-htBar;//滑动底线
		var barYTar;
		var barSp=Math.floor(htZone/15);
		var scrCan;
		var htCount=scrCont.outerHeight();//滚动内容高
		var htCountLast=htCount;//滚动内容上一次高
		var scrollTimer;
		var scrollTimerIs;
		var scrHtTimer;
		
		
		
		scrUp.css({"top":0});
		scrDown.css({"top":scrUp.height()+htZone});
		scrZone.css({"top":scrUp.height(),"height":htZone});
		
		resizeFunc();
		
		scrHtTimer=setInterval(scrListener,300);
		
		function scrListener(){
			htCount=scrCont.outerHeight();
			if(htCountLast!=htCount){
				htCountLast=htCount;
				resizeFunc();
			}
		}//end func
		
		function resizeFunc(){
			
			isMouseOver=false;
			isMouseDrag=false;
			barYTar=0;
			scrCont.css("top",0);
			scrollTimerIs=false;
			
			if(htCount<=htDisplay){
				scrCan=false;
				scrPanel.hide();
			}//end if
			else{
				scrCan=true;
				scrPanel.show();
			}//end else
			
			scrBar.css({"top":scrUp.height()});
			
		}//end func
		
		$(document).bind({
			'mouseup': function(e) {
					isMouseDrag=false;  
					mouseSelectOn();
			}
		});
	
		$(this).bind({
			'mousewheel':function (event, delta) {
				if(scrCan){
					delta = delta || (event.wheelDelta ? event.wheelDelta / 120 : (event.detail) ? -event.detail/3 : 0);
					delta=delta/Math.abs(delta)*barSp;
					barYTar-=delta;
					scrollFunc();
				}//end if 
			},
			'mouseenter': function(e) {
				if(scrCan){
					isMouseOver=true;
						$(document).bind({'mousewheel': function(e) {e.preventDefault();}});//阻止窗口默认行为发生
				}//end if  
			},
			'mouseleave': function(e) {
				if(scrCan){
					isMouseOver=false;
						$(document).unbind('mousewheel');//恢复窗口默认行为发生
				}//end if     
			},
			'mousemove': function(e) {
				mouseX=e.pageX;
				mouseY=e.pageY; 
				startDrag();
			}
		});//end bind	
		
		scrBar.bind({
			'mousemove': function(e) {
				$(this).mousedown(function(){isMouseDrag=true;});
			}
		});//end bind
		
		scrZone.bind({
			'click': function(e) {
				barYTar=mouseY-_this.offset().top;
				scrollFunc();
			}
		});//end bind	
		
		scrUp.bind({
			'mouseleave': function(e) {
				scrollTimerIs=false;
				clearInterval(scrollTimer);
			},
			'mousedown': function(e) {
				if(!isMouseDrag && !scrollTimerIs){ 
					scrollTimerIs=true;
					scrollTimer=setInterval(function(){
						barYTar-=barSp;
						scrollFunc();
					},60);	
				}//end if	
				mouseSelectOff();
			},
			'mouseup': function(e) {
				scrollTimerIs=false;
				clearInterval(scrollTimer);
			}
		});//end bind
		
		
		scrDown.bind({
			'mouseleave': function(e) {
				scrollTimerIs=false;
				clearInterval(scrollTimer);
			},
			'mousedown': function(e) {
				if(!isMouseDrag && !scrollTimerIs){ 
					scrollTimerIs=true;
					scrollTimer=setInterval(function(){
						barYTar+=barSp;
						scrollFunc();
					},60);	
				}//end if	
				mouseSelectOff();
			},
			'mouseup': function(e) {
				scrollTimerIs=false;
				clearInterval(scrollTimer);
			}
		});//end bind
	
		function startDrag(){
			if(isMouseDrag && isMouseOver){
				barYTar=mouseY-_this.offset().top;
				scrollFunc();
				mouseSelectOff();
			 }//end if
		}//end func  	
	   
		function scrollTimerSet(){
			scrollTimer=setInterval(function(){
				scrollFunc();
			},60);
		}//end func   
	   
		function scrollFunc(){
				barYTar=barYTar>lineB?lineB:barYTar;
				barYTar=barYTar<lineT?lineT:barYTar;
				scrBar.css("top",barYTar); 
				scrCont.css("top",-Math.floor(barYTar-lineT)/(htZone-htBar)*(htCount-htDisplay));	
		}//end func   
		
		function mouseSelectOff(){
			document.onselectstart = function () { return false; };	//防止ie选取
			document.unselectable= "on";//防止OPERA选取
			_this.css({"-moz-user-select":"none"});//防止FIREFX选取
			$("body").css({"-webkit-user-select":"none"});//防止chrome选取发
		}//end func
		
		function mouseSelectOn(){
			document.onselectstart = function () { return true; };//允许IE选取
			document.unselectable= "off";//允许OPERA选取
			_this.css({"-moz-user-select":"elements"});//允许FIREFOX选取
			$("body").css({"-webkit-user-select":"text"});//允许CHROME选取
		}//end func	
	
	}//end fn
});//end extend

})(jQuery);//闭包