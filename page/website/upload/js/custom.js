//document.domain = 'rcshow.tv';

window.DEBUG = true;

function log() {
    if (window.DEBUG && window.console && window.console.log) {
        try {
            console.log.apply(console, arguments);
        } catch (e) {
            var info = '';
            for (var i = 0; i < arguments.length; i++) {
                info += arguments[i] + ' ';
            }
            console.log(info);
        }
    }
}

//==================== imgAreaSelect start ====================

function selectChangeFun(img, selection, size) {
    log('onSelectChange,size:' + size);
    
    var scaleX = size / (selection.width || 1);
    var scaleY = size / (selection.height || 1);
    
    $('#previewImg_' + size).css({
        width: Math.round(scaleX * window.bigImgWidth) + 'px',
        height: Math.round(scaleY * window.bigImgHeight) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
    });
}

function selectChangeEnd(img, selection) {
    selectChange(img, selection);
    selectEnd(img, selection);
}

function selectChange(img, selection) {
    selectChangeFun(img, selection, 78);
    selectChangeFun(img, selection, 40);
}

function selectEnd(img, selection) {
    log('onSelectEnd');
    
    $('input[name="x1"]').val(selection.x1);
    $('input[name="y1"]').val(selection.y1);
    $('input[name="x2"]').val(selection.x2);
    $('input[name="y2"]').val(selection.y2);
}

function selectInit(x1, y1, x2, y2) {
    x1 = x1 == null ? 0 : x1;
    y1 = y1 == null ? 0 : y1;
    x2 = x2 == null ? 78 : x2;
    y2 = y2 == null ? 78 : y2;
    
    log('call selectInit', x1, y1, x2, y2);
    log('call selectInit2', window.bigImgWidth,window.bigImgHeight);
    $('#bigImg').imgAreaSelect({
        handles: 'corners',
        aspectRatio: '1:1',
        onInit: selectChangeEnd,
        onSelectChange: selectChange,
        onSelectEnd: selectEnd,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        imageWidth: window.bigImgWidth,
        imageHeight: window.bigImgHeight
    });
}

//==================== imgAreaSelect end ====================

var FaceUploader = {
    api: '',
    params: {},
    place: '',
    callbackObjName: '',
    callbackObj: null,
    doSave: false,
    init: function(imgUrl, point, isLogin) {
        if (window.parent && this.callbackObjName && window.parent.window[this.callbackObjName]) {
            this.callbackObj = window.parent.window[this.callbackObjName];
        }
        
        $(function() {
            if (!isLogin) {
                $('#loginTip').overlay({
                    closeOnClick: false,
                    closeOnEsc: false,
                    top: '40%',
                    load: true,
                    mask: {
                        color: '#555',
                        loadSpeed: 200,
                        opacity: 0
                    }
                });
                imgUrl = 'img/space.gif';
            }
			
            if (imgUrl.indexOf('space.gif') == -1) {
                if (!($.isArray(point) && point.length == 4)) {
                    point = [0, 0, 78, 78];
                }
				log("imgUrl:",imgUrl);
                var img = new Image();
				img.onload = function(){
					log('imgLoad', this.width, this.height);
                    
                   	window.bigImgWidth = this.width;
                   	window.bigImgHeight = this.height;
					
                    FaceUploader.fixImgScale();
                    $('#bigImg,#previewImg_78,#previewImg_40').attr('src', this.src);
                    setTimeout(function() {
                        selectInit.apply(null, point);
                    }, 1000);
					
				};
				img.src = imgUrl;
				/*
				
                $('<img src="' + imgUrl + '" />').load(function() {
                    log('imgLoad', this.width, this.height);
                    
                   	window.bigImgWidth = this.width;
                   	window.bigImgHeight = this.height;
					
                    FaceUploader.fixImgScale();
                    $('#bigImg,#previewImg_78,#previewImg_40').attr('src', this.src);
                    setTimeout(function() {
                        selectInit.apply(null, point);
                    }, 1000);
                });
				*/
            }
        });
    },
    onFileValueChange: function(obj) {
        log("change,"+obj.value);
        
        var fileId = obj.id;
        var fileVal = obj.value;
        if (!/.+\.(jpg|png|jpeg|gif)$/i.test(fileVal)) {
            this.showError('文件格式不對');
        } else {
            this.showError('');
			
            ajaxUpLoad(this.api, fileId, this.onComplete, this.params);
            this.showLoading(true);
        }
    },
    onSuccess: function(imgInfo) {
        log('onSuccess');
        log(imgInfo);

        if (this.callbackObj && this.callbackObj.params) {
            this.callbackObj.params.imageId = imgInfo.imageId;
        }

        if (imgInfo.imageId) {
            if (!this.params) {
                this.params = {};
            }
            this.params.imageId = imgInfo.imageId;
        }
        
		$.ajaxSetup ({ cache: false });
		log("imginfo:",imgInfo.img);
        var img = new Image();
		img.onload = function(){
			log('retImgLoad', this.width, this.height);
			
            window.bigImgWidth = this.width;
           	window.bigImgHeight = this.height;
					
            FaceUploader.fixImgScale();
            $('#bigImg,#previewImg_78,#previewImg_40').attr('src', this.src);
            setTimeout(function() {
                selectInit();
            }, 1000);
					
		};
		img.src = imgInfo.img;
		
		/*
		log('imginfo', imgInfo.img);
        $('<img src="' + imgInfo.img + '" />').load(function() {
            log('retImgLoad', this.width, this.height);
           
           		window.bigImgWidth = this.width;
           	 	window.bigImgHeight = this.height;
			
            FaceUploader.fixImgScale();
            $('#bigImg,#previewImg_78,#previewImg_40').attr('src', this.src);
            setTimeout(function() {
                selectInit();
            }, 1000);
        });
		*/
    },
    onError: function(txtError) {
        log('onError');
        
        this.showError(txtError);
    },
    onComplete: function(data) {
        log('onComplete');
        
        FaceUploader.showLoading(false);
        var startTag = data.substr(0, 1);
		
        if (startTag == '{' || startTag == '[') {
            data = eval('(' + data + ')');
			
            if (data.error) {
                FaceUploader.onError(data.error);
            } else {
                if (data.img) {
                    data.img += (data.img.indexOf('?') == -1 ? '?' : '&') + 'rand=' + new Date().getTime();
                }
                FaceUploader.onSuccess(data);
            }
        }
    },
    showLoading: function(show) {
        if (show) {
            $('#loadingImg').show();
        } else {
            $('#loadingImg').hide();
        }
    },
    showError: function(error) {
        $('#txtError').text(error);
        error && this.showLoading(false);
    },
    save: function() {
		this.showError('');
        if (this.doSave) {
            return false;
        }
        this.doSave = true;
        
        if ($('#x1').val() == '') {
            this.showError('Please upload photo !');
            return;
        }
        
        this.params = $.isPlainObject(this.params) ? this.params : {};
        var arg = $.extend(this.params, {
            x1: $('#x1').val(),
            y1: $('#y1').val(),
            x2: $('#x2').val(),
            y2: $('#y2').val()
        });
		log('save ', arg.x1, arg.y1, arg.x2, arg.y2);
		
		if(arg.x2-arg.x1<40 || arg.y2-arg.y1<40){
			this.showError('图片尺寸过小会使得头像模糊');
			FaceUploader.doSave = false;
			return;
		}
		/*if(arg.x2-arg.x1>200 || arg.y2-arg.y1>200){
			this.showError('图片尺寸不能大于200 X 200');
			FaceUploader.doSave = false;
			return;
		}*/
        
		FaceUploader.showLoading(true);
        $.post(this.api, arg, function(data) {
            FaceUploader.showLoading(false);
			
            var startTag = data.substr(0, 1);
            if (startTag == '{' || startTag == '[') {
                data = eval('(' + data + ')');
				
                if (data.error) {
                    FaceUploader.onError(data.error);
                } else if (data.img) {
                    if (FaceUploader.callbackObj && FaceUploader.callbackObj.onSuccess && typeof(FaceUploader.callbackObj.onSuccess) == 'function') {
                        data['place'] = FaceUploader.place;
                        FaceUploader.callbackObj.onSuccess(data);
						
                    }
					
                    FaceUploader.cancel();
                }
            }
            FaceUploader.doSave = false;
			window.parent.location.reload();
        });
    },
    cancel: function() {
        this.callbackObj && this.callbackObj.hide();
		
		location.reload();  
    },
    fixImgScale: function() {
		//console.log("-----------------",window.bigImgWidth , window.bigImgHeight);
		var MAX_LIMIT = 200;
		$('#bigImg').removeAttr('style');
       	if (window.bigImgWidth >= window.bigImgHeight) {
			var width = bigImgWidth;
			var height = bigImgHeight;
			
			if(width>MAX_LIMIT){
				width = MAX_LIMIT;
				var pos = bigImgWidth / width ;
				height =  Math.round(bigImgHeight/pos);
				
			}
            	
			$('#bigImg').css('width', width);
			$('#bigImg').css('margin-top' , (MAX_LIMIT-height)/2);
			
           //$('#bigImg').removeAttr('style').css(bigImgWidth > bigImgHeight ? 'width' : 'height', 200);
			
       	}
		if(window.bigImgHeight >= window.bigImgWidth){
			var width = bigImgWidth;
			var height = bigImgHeight;
			
			if(height>MAX_LIMIT){
				height = MAX_LIMIT;
				var pos = bigImgHeight / height ;
				width =  Math.round(bigImgWidth/pos);
				
			}
            
			$('#bigImg').css('height', height);
			$('#bigImg').css('margin-left' , (MAX_LIMIT-width)/2);
			
		}
		
    }
};
