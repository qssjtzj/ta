function TurnPage(settings) {
	this.imgDivObj = null;
	this.listDivObj = null;
	this.pageAllData = settings.data;
	this.pageSize = settings.pageSize;
	this.nowPage = 0;
	this.now = 0;
	this.pageData = [];
	this.parms = {
		firstPage: '首頁',
		prevPage: '上一頁',
		nextPage: '下一頁',
		lastPage: '末頁'
	};
	this.objName = '';
	this.listSize = settings.listSize;
	this.handle={
		mouseOver:function(obj,className){
			$(obj).addClass(className);
			$(obj).find('a').show();
		},
		mouseOut:function(obj,className) {
			$(obj).removeClass(className);
			$(obj).find('a').hide();
		}
	};
}
TurnPage.prototype.indexAction = function(settings) {
	this.objName = settings.objName;
	this.imgDivObj = $(settings.imgDivName);
	this.listDivObj = $(settings.listDivName);
	this.nowPage = 0;
	this.getPageData(this.nowPage);
	this.createPage(this.imgDivObj, this.pageData);
	this.createList(this.nowPage);
};
TurnPage.prototype.secondAction = function(photos) {
	this.pageAllData = photos;
	this.nowPage = 0;
	this.getPageData(this.nowPage);
	this.createPage(this.imgDivObj, this.pageData);
	this.createList(this.nowPage);
};
TurnPage.prototype.switchBtn = function(nowPage) {
	this.nowPage = nowPage;
	this.getPageData(this.nowPage);
	this.createPage(this.imgDivObj, this.pageData);
	this.createList(this.nowPage);
};
TurnPage.prototype.delImg = function(iid, event, obj) {
	event.cancelBubble = true;
	if (window.confirm('確定刪除嗎？')) {
		var This = this;
		$.post('index.php?c=showroom&a=delPhoto', {
			id: iid
		}, function(jdata) {
			if (parseInt(jdata) == 1) {
				$(obj).closest('li').remove();
				var reloadData = [];
				for (var i = 0; i < This.pageAllData.length; i++) {
					if (parseInt(This.pageAllData[i].id) != iid) {
						reloadData.push(This.pageAllData[i]);
					}
				}
				window.photos_wall = This.pageAllData = reloadData;
				if (This.nowPage > 0 && This.pageAllData.length % This.pageSize == 0) {
					This.nowPage--;
				}
				This.getPageData(This.nowPage);
				This.createPage(This.imgDivObj, This.pageData);
				This.createList(This.nowPage);
			}
		});
	}
};
TurnPage.prototype.createPage = function(imgDivObj, pageData) {
	imgDivObj.empty();
	var html = '';
	for (var i = 0; i < pageData.length; i++) {
		html += '<li onclick="' + this.objName + '.fnConnect(' + this.nowPage + ',' + i + ',' + this.pageSize + ')"><div class="mara" onmouseover="' + this.objName + '.mouseOver(this)" onmouseout="' + this.objName + '.mouseOut(this)"><div style="height:4px;overflow:hidden;"></div><div><img src="../RC娛樂 讓夢發聲_files/' + pageData[i].img + '" alt="1" /></div><p>' + pageData[i].time + '<a href="">del</a></p></div></li>';

	}
	imgDivObj.html(html);
};
TurnPage.prototype.getPageData = function(nowPage) {
	var min = this.pageSize * nowPage;
	var max = this.pageSize * nowPage + this.pageSize;
	this.pageData = [];
	for (var i = min; i < max; i++) {
		if (this.pageAllData[i] != null) {
			this.pageData.push(this.pageAllData[i]);
		}
	}

};
TurnPage.prototype.createList = function(nowPage) {
	var listNum = Math.ceil(this.pageAllData.length / this.pageSize);
	var listul = this.listDivObj.empty();
	var html = '';
	if (listNum == 1 || listNum == 0) {
		html += '';
	} else {
		if (this.nowPage == 0) {
			html += '<span>' + this.parms.firstPage + '</span><span>' + this.parms.prevPage + '</span>';
		} else if (this.nowPage > 4) {
			html += '<a onclick="' + this.objName + '.switchBtn(0)">' + this.parms.firstPage + '</a><a onclick="' + this.objName + '.switchBtn(' + (this.nowPage - 1) + ')">' + this.parms.prevPage + '</a><span>...</span>';
		} else {
			html += '<a onclick="' + this.objName + '.switchBtn(0)">' + this.parms.firstPage + '</a><a onclick="' + this.objName + '.switchBtn(' + (this.nowPage - 1) + ')">' + this.parms.prevPage + '</a>';
		}
		for (var i = 0; i < listNum; i++) {
			if (listNum > this.listSize) {
				if (this.nowPage < this.listSize && i < this.listSize) {
					if (this.nowPage == i) {
						html += '<a class="d-acitve" onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
					} else {
						html += '<a onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
					}
				} else if (this.nowPage >= this.listSize && i > this.nowPage - this.listSize + 1 && i < this.nowPage + this.listSize - 3) {
					if (this.nowPage == i) {
						html += '<a class="d-acitve" onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
					} else {
						html += '<a onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
					}
				}
			} else {
				if (this.nowPage == i) {
					html += '<a class="d-acitve" onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
				} else {
					html += '<a onclick="' + this.objName + '.switchBtn(' + i + ')">' + (i + 1) + '</a>';
				}
			}
		}
		if (this.nowPage == listNum - 1) {
			html += '<span>' + this.parms.nextPage + '</span><span>' + this.parms.lastPage + '</span>';
		} else if (this.nowPage < (listNum - 5)) {
			html += '<span>...</span><a onclick="' + this.objName + '.switchBtn(' + (this.nowPage + 1) + ')">' + this.parms.nextPage + '</a><a onclick="' + this.objName + '.switchBtn(' + (listNum - 1) + ')">' + this.parms.lastPage + '</a>';
		} else {
			html += '<a onclick="' + this.objName + '.switchBtn(' + (this.nowPage + 1) + ')">' + this.parms.nextPage + '</a><a onclick="' + this.objName + '.switchBtn(' + (listNum - 1) + ')">' + this.parms.lastPage + '</a>';
		}
	}
	listul.html(html);
};