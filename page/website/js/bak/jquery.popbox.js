(function($) {
	//给页面装载CSS样式	
	$.fn.popbox = function(options) {	
		return this.each(function() {
			var s = $.extend({}, popboxDefault, options || {});
			var node = this.nodeName.toLowerCase();
			if (node === "a" && s.ajaxTagA) {
				$(this).click(function() {
					var href = $.trim($(this).attr("href"));
					if (href) {
						if (href.indexOf('#') >= 0) {
							$.popbox($(href), options);
						} else if (/[\.jpg\.png\.gif\.bmp\.jpeg]$/i.test(href)) {
							//加载图片
							$.popbox.loading(options);
							var myImg = new Image(), element;
							myImg.onload = function() {
								var w = myImg.width, h = myImg.height;
								if (w > 0) {
									var element = $('<img src="'+href+'" width="'+w+'" height="'+h+'" />');
									$.popbox(element, options);
								}
							};
							myImg.onerror = function() {
								//显示加载图片失败
								var element = $('<div class="wrap_remind">图片加载失败！</div>');
								$.popbox(element, options);
							};
							myImg.src = href;
						} else {
							$.popbox.loading(options);
							$.get(href, {}, function(data) {
								$.popbox(data, options);
							});	
						}
					}	
					return false;
				});
			} else {
				$.popbox($(this), options);	
			}
		});				
	};
	
	$.popbox = function(elements, options) {
		if (!elements) {
			return;	
		}
		var s = $.extend({}, popboxDefault, options || {});
		//弹框的显示
		var WRAP = '<div id="zxxBlank" onselectstart="return false;" style="z-index:99;background: none repeat scroll 0% 0% rgb(51, 51, 51);position: fixed; position: fixed; top: 0px; left: 0px"></div><div class="wrap_out" id="wrapOut" ><div class="wrap_in" id="wrapIn"><div class="wrap_body" id="wrapBody"></div></div></div>';
		if ($("#wrapOut").size()) {
			$("#wrapOut").show();
			if (s.bg) {
				$("#zxxBlank").show();	
			} else {
				$("#zxxBlank").show();
			}
		} else {
			$("body").append(WRAP);	
		}
		
		if (typeof(elements) === "object") {
			elements.show();
		} else {
			elements = $(elements);
		}
		//一些元素对象
		$.o = {
			s: s,
			ele: elements,
			bg: $("#zxxBlank"), 
			out: $("#wrapOut"), 
			bar: $("#wrapBar"), 
			clo: $("#wrapClose"),
			bd: $("#wrapBody")
		};
		//装载元素
		$.o.bd.empty().append(elements);
		if ($.isFunction(s.onshow)) {
			s.onshow();
		}
		//尺寸
		$.popbox.setSize();
		//定位
		$.popbox.setPosition();

		if (s.fix) {
			$.popbox.setFixed();
		}
		if (s.drag) {
			$.popbox.drag();	
		} else {
			$(window).resize(function() {
				$.popbox.setPosition();					  
			});	
		}
		if (!s.bar) {
			$.popbox.barHide();	
		} else {
			$.popbox.barShow();	
		}
		if (!s.bg) {
			$.popbox.bgShow();
		} else {
			$.popbox.bgShow();
		}
		if (!s.btnclose) {
			$.popbox.closeBtnHide();	
		} else {
			$.o.clo.click(function() {
				$.popbox.hide();	
				return false;
			});
		}
		if (s.bgclose) {
			$.popbox.bgClickable();	
		}
		if (s.delay > 0) {
			setTimeout($.popbox.hide, s.delay);	
		}
	};
	$.extend($.popbox, {
		getSize: function(o) {
			//获取任意元素的高宽
			var w_h = {}, o_new = o.clone();
			$('<div id="wrapClone" style="position:absolute;left:-6000px;"></div>').appendTo("body").append(o_new);
			w_h.w = $("#wrapClone").width();
			w_h.h = $("#wrapClone").height();
			$("#wrapClone").remove();
			return w_h;
		},
		setSize: function() {
			if (!$.o.bd.size() || !$.o.ele.size() || !$.o.bd.size()) {
				return;	
			}
			//主体内容的尺寸
			var bd_w = parseInt($.o.s.width, 10), bd_h = parseInt($.o.s.height, 10);			
			if (!bd_w || bd_w <= 0 ) {
				var x_size = $.popbox.getSize($.o.ele), w = $(window).width();
				//宽度自动
				bd_w = x_size.w;
				if (bd_w < 50) {
					bd_w = 120;	
				} else if (bd_w > w) {
					bd_w = w - 120;
				}
			}
			$.o.bd.css("width", bd_w);
			$.o.out.css("width", bd_w+2);
			if (bd_h > 0) {
				$.o.bd.css("height", bd_h);
			}
			return $.o.bd;
		},
		setPosition: function(flag) {
			flag = flag || false;
			if (!$.o.bg.size() || !$.o.ele.size() || !$.o.out.size()) {
				return;	
			}			
			var rootEl = document.body;			
			$.o.bg.hide()
			var w = $(window).width(), h = $(window).height(), st = $(window).scrollTop(), ph = $("body").height();
			
			if (ph < h) {
				ph = h;	
			}	
		
			$.o.bg.width(w).height(ph).css("opacity", $.o.s.opacity).show().hide();
			//主体内容的位置
			//获取当前主体元素的尺寸
			var xh = $.o.out.outerHeight(), xw = $.o.out.outerWidth();
			var t = st + (h - xh)/2, l = (w - xw)/2;
			
			if ($.o.s.fix && window.XMLHttpRequest) {
				t = (h - xh)/2;
			}
			if (flag === true) {
				$.o.out.css({
					top: t,
					left: l
				});
			} else {
				$.o.out.css({
					top: t,
					left: l,
					zIndex: $.o.s.index
				});
			}
			return $.o.out;
		},
		//定位
		setFixed: function() {
			if (!$.o.out || !$.o.out.size()) {
				return;	
			}
			if (window.XMLHttpRequest) {
				$.popbox.setPosition().css({
					position: "fixed"			
				});
			} else {
				$(window).scroll(function() {
					$.popbox.setPosition();						  
				});
			}
			return $.o.out;
		},
		//背景可点击
		bgClickable: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.click(function() {
					$.popbox.hide();
				});
			}
		},
		//背景隐藏
		bgHide: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.hide();
			}
		},
		//背景层显示
		bgShow: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.show();
			} else {
				$('<div id="zxxBlank"></div>').prependTo("body");	
			}
		},
		//标题栏隐藏
		barHide: function() {
			if ($.o.bar && $.o.bar.size()) {
				$.o.bar.hide();
			}
		},
		//标题栏显示
		barShow: function() {
			if ($.o.bar && $.o.bar.size()) {
				$.o.bar.show();
			}
		},
		//关闭按钮隐藏
		closeBtnHide: function() {
			if ($.o.clo && $.o.clo.size()) {
				$.o.clo.hide();
			}
		},
		//弹框隐藏
		hide: function() {
			if ($.o.ele && $.o.out.size() && $.o.bg.size() && $.o.out.css("display") !== "none") {
				if ($.o.s.protect && (!$.o.ele.hasClass("wrap_remind") || $.o.ele.attr("id"))) {
					$.o.ele.clone().hide().appendTo($("body"));
				}
				$.o.out.fadeOut("fast", function() {
					$(this).remove();
					if ($.isFunction($.o.s.onclose)) {
						$.o.s.onclose();
					}
				});
				$.o.bg.fadeOut("fast", function() {
					$(this).remove();								
				});
			}
			return false;
		},
		//拖拽
		drag: function() {
			if (!$.o.out.size() || !$.o.bar.size()) {
				$(document).unbind("mouseover").unbind("mouseup");
				return;
			}
			var bar = $.o.bar, out = $.o.out;
			var drag = false;
			var currentX = 0, currentY = 0, posX = out.css("left"), posY = out.css("top");
			bar.mousedown(function(e) {
				drag = true;
				currentX = e.pageX;
				currentY = e.pageY;							 
			}).css("cursor", "move");	
			$(document).mousemove(function(e) {
				if (drag) {
					var nowX = e.pageX, nowY = e.pageY;
					var disX = nowX - currentX, disY = nowY - currentY;
					out.css("left", parseInt(posX) + disX).css("top", parseInt(posY) + disY);
				}					   
			});
			$(document).mouseup(function() {
				drag = false;
				posX = out.css("left");
				posY = out.css("top");
			});
		},
		//预载
		loading: function(options) {
			var element = $('<div class="wrap_remind">加载中...</div>');
			options = options || {}
			var newOptions = $.extend({}, options, {bar: false});
			$.popbox(element, newOptions);
		},
		//ask询问方法
		ask: function(message, sureCall, cancelCall, options) {
			var element = $('<div class="wrap_remind">'+message+'<p><button id="zxxSureBtn" class="submit_btn">确认</button>&nbsp;&nbsp;<button id="zxxCancelBtn" class="cancel_btn">取消</button></p></div>');
			$.popbox(element, options);
			//回调方法
			$("#zxxSureBtn").click(function() {
				if ($.isFunction(sureCall)) {
					sureCall.call(this);
				}						
			});
			$("#zxxCancelBtn").click(function() {
				if (cancelCall && $.isFunction(cancelCall)) {
					cancelCall.call(this);
				}
				$.popbox.hide();						  
			});	
		},
		//remind提醒方法
		remind: function(message, callback, options) {
			var element = $('<div class="wrap_remind">'+message+'<p><button id="zxxSubmitBtn" class="submit_btn">确认</button</p></div>');
			$.popbox(element, options);
			$("#zxxSubmitBtn").click(function() {
				//回调方法
				if (callback && $.isFunction(callback)) {
					callback.call(this);	
				}
				$.popbox.hide();							  
			});
				
		},
		//uri Ajax方法
		ajax: function(uri, params, options) {
			if (!params || typeof(params) !== "object") {
				params = {};	
			}
			if (uri) {
				$.popbox.loading(options);
				$.get(uri, params, function(data) {
					var scriptReg = /<script>.*<\/script>/g;
					var html = data.replace(scriptReg, ""), arrScript = data.match(scriptReg);
					$.popbox(html, options);
					$.each(arrScript, function(i, n) {
						$("head").append($(n));	
					});
				});		
			}
		}
	});
	var popboxDefault = {
		title: "对话框",
		shut: "×",
		index: 2000,
		opacity: 0.5,
		width: "auto",
		height: "auto",
		bar: false, //是否显示标题栏
		bg: false, //是否显示半透明背景
		btnclose:true, //是否显示关闭按钮
		fix: true, //是否弹出框固定在页面上
		bgclose: false, //是否点击半透明背景隐藏弹出框
		drag: false, //是否可拖拽
		ajaxTagA: true, //是否a标签默认Ajax操作
		protect: "auto", //保护装载的内容
		onshow: $.noop, //弹窗显示后触发事件
		onclose: $.noop, //弹窗关闭后触发事件
		delay: 0 //弹窗打开后关闭的时间, 0和负值不触发
	};
})(jQuery);