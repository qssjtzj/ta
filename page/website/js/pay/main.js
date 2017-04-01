$.fn.fixActive = function(className) {
    className = className || 'active';
    this.on('mousedown', function() {
        $(this).addClass(className);
    }).on('mouseup', function() {
        $(this).removeClass(className);
    });
};

$.fn.autoTab = function(checker) {
    var inps = this.filter('input[type=text],textarea');
    if (inps.size() < 2) {
        return this;
    }
    inps.keydown(function(e) {
        var el = $(this);
        if (el.val().length == 0 && el.index() > 0 && e.which == 8) {
            inps.eq(el.index() - 1).focus();
        }
    });
    inps.keyup(function(e) {
        var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];
        if ($.inArray(e.which, keys) == -1) {
            if ($.isFunction(checker) && checker($(this))) {
                var nextIndex = $(this).index() + 1;
                if (nextIndex >= inps.size()) {
                    //inps.eq(inps.size() - 1).blur();
                } else {
                    inps.eq(nextIndex).focus();
                }
            }
        }
    });
    return this;
};


function gotopage(page){
	window.location.href=page;
}

function clsFormChecker() {
    this.data = {};
    this.check = function() {
        var firstErrorElem = null;
        var passChecked = true;
        for (var key in this.data) {
            var item = this.data[key];
            if (typeof(item) == 'function') {
                if (!item()) {
                    return false;
                }
            }
            
            var input = document.getElementById(key);
            if (input) {
                var error = 0;
                var checker = item[0];
                var val = input.value;
                if (typeof(checker) == 'function') {
                    if (!checker(val)) {
                        error++;
                    }
                    if (!firstErrorElem) {
                        firstErrorElem = input;
                    }
                } else {
                    if (checker) {
                        var reg = new RegExp(checker, 'i');
                        if (!reg.test(val)) {
                            error++;
                            if (!firstErrorElem) {
                                firstErrorElem = input;
                            }
                        }
                    } else {
                        var inps = document.getElementsByName(input.name);
                        var hasOneChecked = false;
                        for (var i = 0; i < inps.length; i++) {
                            if (inps[i].checked) {
                                hasOneChecked = true;
                                break;
                            }
                        }
                        if (!hasOneChecked) {
                            error++;
                            if (!firstErrorElem) {
                                firstErrorElem = input;
                            }
                        }
                    }
                }
                if (error > 0) {
                    passChecked = false;
                    if (firstErrorElem) {
                        firstErrorElem.focus();
                    }
                    break;
                }
            }
        }
        if(passChecked){
        	var amount = $("#payRcCoins").val();
			var url = geturl() + "/rcpay/chargeshowbi";
			$.ajax({
				type : "post",
				url : url,
				data : {
					"amount" : amount
				},
				dataType : "json",
				success : function(data) {
					if (data != null && data.success == true) {
						alert("充值秀币成功");
						window.parent.parent.location.href=geturl() +"/pay/rechargeok.html";
					}else{
						alert(data.error_info);
					}
//					if (data != null && data.success == true) {
//						$('#cypaycontent').empty();
//						$('#cypaycontent').html("<iframe id='payframe' name='displayinhere' width=650px'; height='300px;' src='"+data.payurl+"'></iframe>");
//						//$("#payframe").attr("src",data.payurl);//.url(data.payurl);
//					} else {
//						console.log(data.error_info);
//						$("#player_list").html("加载失败");
//					}
					
				}
			});
        }
        return passChecked;
    };
}

function findError(data) {
    if (typeof(data) == 'string') {
        var startTag = data.replace(/^\s+|\s+$/g, '').substr(0, 1);
        if (startTag == '{' || startTag == '[') {
            data = eval('(' + data + ')');
        }
    }
    if (data.error) {
        alert(data.error);
        if (data.script) {
            window.eval(data.script);
        }
        return true;
    }
    return false;
}

function clsSimpleTurnPage() {
    //UI config
    this.reverse = false;
    this.breakSize = 5;
    this.lang = {
        firstPage: 'First Page',
        prevPage: 'Previous Page',
        nextPage: 'Next Page',
        lastPage: 'Last Page'
    };
    //var
    this.api = '';
    this.pageSize = 6;
    //private
    this.instanceName = '';
    this.pageDiv = null;
    this.lastSelectPage = 0;
    this.totalPage = 1;
    this.dataCount = 66;
    this.localData = null;
    
    this.init = function(dataOrCount, btnBoxId, instanceName) {
        if (typeof(dataOrCount) == 'object' && dataOrCount.length != undefined) {
            this.dataCount = dataOrCount.length;
            this.localData = dataOrCount;
        } else if (typeof(dataOrCount) == 'number') {
            this.dataCount = parseInt(dataOrCount);
        } else {
            throw 'First parameter wrong.';
        }
        this.totalPage = Math.ceil(this.dataCount / this.pageSize);
        this.pageDiv = document.getElementById(btnBoxId);
        this.instanceName = instanceName;
        
        var defaultGo = this.reverse ? this.totalPage : 1;
        this.go(defaultGo);
    };
    
    this.beforeGo = function(page) {
    
    };
    
    this.go = function(page) {
        if (page == this.lastSelectPage) {
            return false;
        }
        this.lastSelectPage = page;
        
        if (typeof(this.beforeGo) == 'function') {
            this.beforeGo(page);
        }
        
        //build html
        var pageStr = '<div class="pageNav">';
        if (this.totalPage > 1) {
            if (this.reverse) {
                var endPageNum = this.totalPage;
                var startPageNum = Math.max(endPageNum - this.breakSize + 1, 1);
                if (page % this.breakSize == this.totalPage % this.breakSize) {
                    endPageNum = page;
                } else {
                    var step = this.totalPage % this.breakSize - page % this.breakSize;
                    if (step < 0) {
                        step += this.breakSize;
                    }
                    endPageNum = page + step;
                }
                startPageNum = Math.max(endPageNum - this.breakSize + 1, 1);
            } else {
                var startPageNum = 1;
                var endPageNum = Math.min(this.breakSize, this.totalPage);
                if (page % this.breakSize == 0) {
                    startPageNum = Math.max(page - this.breakSize + 1, 1);
                } else {
                    startPageNum = page - page % this.breakSize + 1;
                }
                endPageNum = Math.min(startPageNum + this.breakSize - 1, this.totalPage);
            }
            
            if (page != 1) {
                pageStr += '<a class="first" href="javascript:;" onclick="' + this.instanceName + '.go(1)">' + this.lang.firstPage + '</a>';
                pageStr += '<a class="prev" href="javascript:;" onclick="' + this.instanceName + '.go(' + (page - 1) + ')">' + this.lang.prevPage + '</a>';
            } else {
                pageStr += '<span class="first">' + this.lang.firstPage + '</span>';
                pageStr += '<span class="prev">' + this.lang.prevPage + '</span>';
            }
            for (var i = startPageNum; i <= endPageNum; i++) {
                if (i == page) {
                    pageStr += '<span class="current">' + i + '</span>';
                } else {
                    pageStr += '<a href="javascript:;" onclick="' + this.instanceName + '.go(' + i + ')">' + i + '</a>';
                }
            }
            if (page != this.totalPage) {
                pageStr += '<a class="next" href="javascript:;" onclick="' + this.instanceName + '.go(' + (page + 1) + ')">' + this.lang.nextPage + '</a>';
                pageStr += '<a class="last" href="javascript:;" onclick="' + this.instanceName + '.go(' + this.totalPage + ')">' + this.lang.lastPage + '</a>';
            } else {
                pageStr += '<span class="next">' + this.lang.nextPage + '</span>';
                pageStr += '<span class="last">' + this.lang.lastPage + '</span>';
            }
        }
        pageStr += '</div>';
        pageStr += '<div class="pageCount"></div>';
        
        //use ajax load
        var completeCalled = false;
        if (this.localData == null && this.api && $ && $.get) {
            completeCalled = true;
            var self = this;
            $.get(this.api, {
                page: page
            }, function(data) {
                if (findError(data)) {
                    return;
                }
                
                if (typeof(data) == 'string') {
                    var startTag = data.replace(/^\s+|\s+$/g, '').substr(0, 1);
                    if (startTag == '{' || startTag == '[') {
                        data = eval('(' + data + ')');
                    }
                }
                
                self.pageDiv.innerHTML = pageStr;
                window[self.instanceName].complete(page, data);
            });
        }
        
        //use local data
        if (!completeCalled && typeof(this.complete) == 'function') {
            this.pageDiv.innerHTML = pageStr;
            if (this.localData != null && this.localData.length) {
                var startIndex = Math.max(0, page - 1) * this.pageSize;
                var endIndex = startIndex + this.pageSize;
                var pageData = this.localData.slice(startIndex, endIndex);
                this.complete(page, pageData);
            } else {
                this.complete(page, []);
            }
        }
    };
    
    this.complete = function(page, pageData) {
    
    };
};

function searchRecord(type) {
    var box1 = $('#recordListBox1');
    var box2 = $('#recordListBox2');
    var tip = $('#noRecordTip');
    var startTime = $('#d1').val();
    var endTime = $('#d2').val();
    if (startTime && endTime) {
        type = type == 'exchange' ? 'exchange' : 'pay';
        var url = geturl() + '/rcpay/findrecord?page_size=12&start=' + startTime + '&end=' + endTime + '&type=' + type;
        $.get(url, function(data) {
            if (findError(data)) {
                return;
            }
            
            box1.add(box2).add(tip).hide();
            var total = parseInt(data);
            if (!isNaN(total)) {
                if (total > 0) {
                    if (type == 'pay' && recordPageObj1) {
                        recordPageObj1.api = url;
                        recordPageObj1.lastSelectPage = 0;
                        recordPageObj1.init(total, 'recordPages1', 'recordPageObj1');
                        box1.show();
                    } else if (type == 'exchange' && recordPageObj2) {
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
        alert('您的查询的时间不正确，请选择正确的时间');
        if (!startTime) {
            $('#d1').focus();
        } else {
            $('#d2').focus();
        }
    }
}

$(function() {

    //============================== PayRcCoinsForm ==============================
    $('#payRcCoins').keyup(function() {
        var hasCoins = parseInt($('#hasRcCoins').text());
        var getCoins = $('#getShowCoins');
        var el = $(this);
        var txt = el.val().replace(/^0+|[^0-9]/g, '');
        var v = 0;
        if (txt == '') {
            el.val('');
        } else {
            v = Math.min(parseInt(txt), hasCoins);
            el.val(v);
        }
        getCoins.text(v * 8);
    });
    
    //============================== WdatePicker ==============================
    var maxDate = new Date();
    var strMaxDate = maxDate.getFullYear() + '-' + (maxDate.getMonth() + 1) + '-' + maxDate.getDate();
    
    var minDate = new Date(maxDate.getTime() - 1000 * 60 * 60 * 24 * 30 * 6);
    var strMinDate = minDate.getFullYear() + '-' + (minDate.getMonth() + 1) + '-' + minDate.getDate();
    
    function d2picked() {
        var d1 = $('#d1');
        var d2 = $(this);
        if (new Date(d2.val()) < new Date(d1.val())) {
            var d1txt = d1.val();
            var d2txt = d2.val();
            d1.val(d2txt);
            d2.val(d1txt);
        }
    }
    
    function d1fun() {
        WdatePicker({
            el: 'd1',
            minDate: strMinDate,
            maxDate: strMaxDate
        });
    }
    
    function problemTime() {
        WdatePicker({
            el: 'problemTime'
        });
    }
    
    function d2fun() {
        if ($('#d1').val().length == 0) {
            WdatePicker({
                el: 'd1',
                minDate: strMinDate,
                maxDate: strMaxDate
            });
        } else {
            var selectedDate1 = new Date($('#d1').val());
            var strMinDate2 = selectedDate1.getFullYear() + '-' + (selectedDate1.getMonth() + 1) + '-01';
            var strMaxDate2 = selectedDate1.getFullYear() + '-' + (selectedDate1.getMonth() + 1) + '-%ld';
            WdatePicker({
                el: 'd2',
                minDate: strMinDate2,
                maxDate: selectedDate1.getMonth() < new Date().getMonth() ? strMaxDate2 : strMaxDate,
                onpicked: d2picked
            });
        }
    }
    
    var context = $('form.checkFrm');
    var date1 = $('#d1', context).focus(d1fun);
    var date2 = $('#d2', context).focus(d2fun);
    $('#d1img', context).click(d1fun);
    $('#d2img', context).click(d2fun);
    $('#problemTime').click(problemTime);
    
    //============================== Record ==============================
    $('.checkNav li', $('#content')).click(function() {
        $('.checkNav li', $('#content')).removeClass('current');
        $(this).addClass('current');
        $('#recordListBox1,#recordListBox2,#noRecordTip').hide();
        date1.add(date2).val('');
        if ($(this).index() == 0) {
            $('#btnSearchRecord').attr('onclick', "searchRecord('pay')");
        } else {
            $('#btnSearchRecord').attr('onclick', "searchRecord('exchange')");
        }
        return false;
    });
});

/**************************************** guohui code end ****************************************/

$(function() {
    $('.nav a').fixActive(); //需详细定位  
    $(".help-node a").bind('click', function() {
        var currentDiv = $(this).parent();
        var otherDiv = currentDiv.prevAll().add(currentDiv.nextAll());
        otherDiv.addClass('closed');
        currentDiv.toggleClass('closed');
    });
    
    var str = $("#numSelList input[name*='amount']");
    
    str.bind("click", function() {
        var GrandParent = $(this).parent().parent(); //li	
        var otherGrandParent = GrandParent.prevAll().add(GrandParent.nextAll());
        var Parent = $(this).parent();//label
        var otherParent = GrandParent.prevAll().find(".cur").add(GrandParent.nextAll().find(".cur"));
        
        
        Parent.addClass("cur");
        otherParent.removeClass("cur");
        GrandParent.addClass("current");
        otherGrandParent.removeClass("current");
    });
	
    $("#amount1").attr("checked", 'checked').triggerHandler("click");
	
    $("#numSelList label").click(function() {		
        $(this).find("input").attr("checked", 'checked').triggerHandler("click");
    });

   	var km = $("#km").length;
    $("#btnConfirm").click(function() {
    	
		$("<div/>").overlay({
			load: true,
			target: '#windowModal',
			mask: {
				color: '#000',
				loadSpeed: 100,
				opacity: 0.4
			},
			top: 200,						
			closeOnClick: false
		}) ;
		//奇米頁
		if(km !== 0){
			if (cardChecker && cardChecker.check()){
//					$('#ConfirmForm').submit();					
//					$("<div/>").overlay({
//						load: true,
//						target: '#windowModal',
//						mask: {
//							color: '#000',
//							loadSpeed: 100,
//							opacity: 0.4
//						},
//						top: 200,						
//						closeOnClick: false
//					});            
				}
		}else {			
			if($("#cashCheckbox").attr("checked")=="checked"){
				var amount = $('input:radio:checked').val();
				var url = geturl() + "/rcpay/getpayurl";
				$.ajax({
					type : "get",
					url : url,
					data : {
						"amount" : amount
					},
					dataType : "json",
					success : function(data) {
						console.log(data);
						if (data != null && data.success == true) {
							$('#cypaycontent').empty();
							$('#cypaycontent').html("<iframe id='payframe' name='displayinhere' width=650px'; height='300px;' src='"+data.payurl+"'></iframe>");
							//$("#payframe").attr("src",data.payurl);//.url(data.payurl);
						} else {
							console.log(data.error_info);
							$("#player_list").html("加载失败");
						}
						
					}
				});				
				
			}else{
					alert('请勾选：我已经阅读并同意了退款协议！');
			}					 
		}
    });
    
    $("#cardNumber input").autoTab(function(el) {
        var text = el.val().toUpperCase();
        el.val(text);
        return text.length > 3;
    });
});


