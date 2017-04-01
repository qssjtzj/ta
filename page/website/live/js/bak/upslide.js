function Upslide(settings) {
	this.pageAllData = settings.jdata;
	this.pageData = [];
	this.nowPage = settings.nowPage;
	this.indexNum = settings.indexNum;
	this.pageSize = settings.pageSize;
	this.objName = '';
	this.listSize = 0; 
	this.listNum = 0; 
	this.listNow = 0; 
	this.imgDivObj = null;
	this.imgUlObj = null;
	this.smallImgDivObj = null;
	this.handle={
		showOver:function(){
			$('.page-show-popup').show();
			$('#page-show-img').show();
		},
		hideOver:function(){
			$('#page-show-img').hide();
			$('.page-show-popup').hide();
		},
		small_img_prev:$('#page-show-img .small-img-btn .small-img-prev'),
		small_img_next:$('#page-show-img .small-img-btn .small-img-next'),
		page_close:$('#page-show-img .page-close'),
		page_pre:$('#page-show-img .page-pre'),
		page_next:$('#page-show-img .page-next'),
		page_show_img:$('#page-show-img')
	};
	this.indexAction = function(objName, imgDivName, imgUlName, smallImgDivName) {
		this.objName = objName;
		this.imgDivObj = $(imgDivName);
		this.imgUlObj = $(imgUlName);
		this.smallImgDivObj = $(smallImgDivName);
		var index = 0;
		var This = this;
		if (this.nowPage == 0) {
			index = this.indexNum;
		} else {
			index = this.nowPage * this.pageSize + this.indexNum;
		}
		this.indexNum = index;
		this.handle.showOver();
		this.createLargeImg(index, this.pageAllData);
		this.imgUlObj.empty();
		var html = '';
		for (var i = 0; i < this.pageAllData.length; i++) {
			html += '<li onclick="' + this.objName + '.slideAction(' + i + ')"><div></div><img src="../RC娛樂 讓夢發聲_files/' + this.pageAllData[i].img + '" alt="" /></li>';
		}
		this.imgUlObj.html(html);
		var width = this.imgUlObj.children('li').length * this.imgUlObj.children('li').eq(0).width();
		this.imgUlObj.width(width);
		var small_width = this.smallImgDivObj.width();
		this.listSize = small_width / this.imgUlObj.children('li').eq(0).width();
		this.listNum = this.imgUlObj.children('li').length % this.listSize == 0 ? this.imgUlObj.children('li').length / this.listSize : Math.ceil(this.imgUlObj.children('li').length / this.listSize);
		this.listNow = Math.ceil((this.indexNum + 1) / this.listSize);
		this.slideUl(this.listNow);
		this.checkShow(this.listNow);
		this.handle.small_img_prev.css('left', (this.handle.page_show_img.width() - small_width) / 2-27 + 'px').click(function() {
			This.listNow--;
			if (This.listNow <= 1) {
				This.listNow = 1;
			}
			This.slideUl(This.listNow);
			This.checkShow(This.listNow);
		});
		this.handle.small_img_next.css('right', (this.handle.page_show_img.width() - small_width) / 2-27 + 'px').click(function() {
			This.listNow++;
			if (This.listNow >= This.listNum) {
				This.listNow = This.listNum;
			}
			This.slideUl(This.listNow);
			This.checkShow(This.listNow);
		});
		this.handle.page_close.click(function() {
			This.handle.hideOver();
		});
		this.handle.page_pre.click(function() {
			This.indexNum--;
			if (This.indexNum < 0) {
				This.indexNum = This.pageAllData.length - 1;
			}
			This.switchAction(This.indexNum);
		});
		this.handle.page_next.click(function() {
			This.indexNum++;
			if (This.indexNum > This.pageAllData.length - 1) {
				This.indexNum = 0;
			}
			This.switchAction(This.indexNum);
		});

	};
	this.checkShow = function(listNow) {
		if (listNow == 1) {
			this.handle.small_img_prev.hide();
		} else {
			this.handle.small_img_prev.show();
		}
		if (listNow == this.listNum) {
			this.handle.small_img_next.hide();
		} else {
			this.handle.small_img_next.show();
		}
	};
	this.switchAction = function(index) {
		this.createLargeImg(index, this.pageAllData);
		this.listNow = Math.ceil((index + 1) / this.listSize);
		this.slideUl(this.listNow);
		this.checkShow(this.listNow);
	};
	this.slideAction = function(index) {
		this.indexNum = index;
		this.createLargeImg(this.indexNum, this.pageAllData);
		this.slideUl(this.listNow);
		this.checkShow(this.listNow);
	};
	this.slideUl = function(listNow) {
		var slideWidth = this.smallImgDivObj.width();
		this.imgUlObj.stop().animate({
			'left': (-slideWidth * (listNow - 1)) + 'px'
		}, 600);
		this.imgUlObj.find('li').find('div').removeClass('selected');
		this.imgUlObj.find('li').eq(this.indexNum).find('div').addClass('selected');
	};
	this.createLargeImg = function(index, pageAllData) {
		var This = this;
		this.imgDivObj.empty();
		var html = '';
		for (var i = 0; i < pageAllData.length; i++) {
			if (i == index) {
				html += '<img src="../RC娛樂 讓夢發聲_files/' + pageAllData[i]['img-big'] + '" alt="" />';
				break;
			}
		}
		this.imgDivObj.html(html);
		this.imgDivObj.find('img').hide();
		this.imgDivObj.find('img').load(function() {
			var divWidth = This.imgDivObj.width();
			var divHeight = This.imgDivObj.height();
			var imgWidth = This.imgDivObj.find('img').width();
			var imgHeight = This.imgDivObj.find('img').height();
			This.imgDivObj.find('img').css({
				'top': (divHeight - imgHeight) / 2 + 'px',
				'left': (divWidth - imgWidth) / 2 + 'px'
			});
			This.imgDivObj.find('img').show();
		});
		this.handle.page_pre.css('cursor', 'url(/live/img/bg/left.cur),auto');
		this.handle.page_next.css('cursor', 'url(/live/img/bg/right.cur),auto');
	};

}