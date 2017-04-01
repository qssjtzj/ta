function RcShare() {
    this._data = {};
    this._list = [{
        id: 'facebook',
        logo: 'img/rcshare/facebook.png',
        title: '分享至Facebook',
        url: 'http://www.facebook.com/share.php?src=bm&u={url}',
        width: 650,
        height: 306,
        order: 10
    }, {
        id: 'twitter',
        logo: 'img/rcshare/twitter.png',
        title: '分享至Twitter',
        url: 'http://twitter.com/intent/tweet?url={url}&text={title}',
        width: 550,
        height: 420,
        order: 9
    }, {
        id: 'googleplus',
        logo: 'img/rcshare/googleplus.png',
        title: '分享至Google+',
        url: 'https://plus.google.com/share?url={url}&hl=zh-CN',
        width: 620,
        height: 620,
        order: 8
    }, {
        id: 'blogger',
        logo: 'img/rcshare/blogger.png',
        title: '分享至Blogger',
        url: 'http://www.blogger.com/blog-this.g?n={title}&b=%3Ca%20href%3D%22{url}%22%3E{title}%3C%2Fa%3E&eurl={media}',
        width: 768,
        height: 468,
        order: 7
    }, {
        id: 'reddit',
        logo: 'img/rcshare/reddit.png',
        title: '分享至reddit',
        url: 'http://reddit.com/submit?url={url}&title={title}',
        order: 6
    }, {
        id: 'tumblr',
        logo: 'img/rcshare/tumblr.png',
        title: '分享至tumblr.',
        url: 'http://www.tumblr.com/share?v=3&u={url}',
        order: 5
    }, {
        id: 'pinterest',
        logo: 'img/rcshare/pinterest.png',
        title: '分享至Pinterest',
        url: 'http://pinterest.com/pin/create/button/?url={url}&description={desc}&is_video=true&media={media}',
        order: 4
    }, {
        id: 'linkedin',
        logo: 'img/rcshare/linkedin.png',
        title: '分享至LinkedIn',
        url: 'http://www.linkedin.com/shareArticle?url={url}&title={title}&summary={desc}',
        order: 3
    }, {
        id: 'odnoklassniki',
        logo: 'img/rcshare/odnoklassniki.png',
        title: '分享至Одноклассники',
        url: 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.noresize=on&st._surl={url}',
        order: 2
    }, {
        id: 'vkontakte',
        logo: 'img/rcshare/vkontakte.png',
        title: '分享至ВКонтакте',
        url: 'http://vkontakte.ru/share.php?url={url}',
        order: 1
    }];
}

RcShare.prototype.add = function(obj) {
    //obj={id:'facebook',logo:'img/rcshare/facebook.png',title:'分享至Facebook',url:'',width:650,height:306,scrollbars:true,order:0}
    var arr = [];
    for (var i = 0, len = this._list.length; i < len; i++) {
        if (obj.id && this._list[i].id && obj.id != this._list[i].id) {
            arr.push(this._list[i]);
        }
    }
    arr.push(obj);
    arr.sort(function(a, b) {
        return (b.order || 0) - (a.order || 0);
    });
    this._list = arr;
};
RcShare.prototype.init = function(containerId, data) {
    var container = document.getElementById(containerId);
    if (container && typeof data == 'object' && (data.title || data.desc)) {
        this._data = data;
        var html = '';
        html += '<ul class="rc_share_container">';
        for (var i = 0, len = this._list.length; i < len; i++) {
            var obj = this._list[i];
            var url = obj.url;
            for (var key in this._data) {
                url = url.replace(new RegExp('{' + key + '}', 'ig'), encodeURIComponent(this._data[key]));
            }
            var conf = '{width:' + (obj.width || 1024) + ',height:' + (obj.height || 650) + ',scrollbars:' + (obj.scrollbars === false ? 'false' : 'true') + '}';
            html += '<li><a href="javascript:;" class="rc_share_' + obj.id + '" title="' + obj.title.replace(/\"/g, '&quot;') + '" onclick="RcShare.popup(\'' + url + '\',' + conf + ')"><img src="' + obj.logo + '" /></a></li>';
        }
        html += '</ul>';
        container.innerHTML = html;
    }
};
RcShare.popup = function(url, conf) {
    window.open(url, 'Showoo Share Widget', 'width=' + (conf.width || 1024) + ',height=' + (conf.height || 650) + ',left=0,top=0,toolbar=no,menubar=no,scrollbars=' + (conf.scrollbars ? 'yes' : 'no') + ',resizable=no,location=no,status=no');
};

function RcInvite() {
    this._listReady = false;
    this._data = {};
    this._elemList;
    this._elemLogin;
    this._elemError;
    this._elemLoading;
    
    this.checkLogin = function(cb) {
    };
    this.startLogin = function(cb) {
    };
    this.getList = function(cb) {
    };
    this.startInvite = function(data, ids, cb) {
    };
    
    this.onListReady = function(list) {
    };
}

RcInvite.prototype._getList = function() {
    this.getList(function(list) {
        this._elemLoading.style.display = 'none';
        var html = '';
        for (var i = 0, len = list.length; i < len; i++) {
            html += '<li><a href="javascript:;" hidefocus="true" title="' + list[i].name + '"><label><input type="checkbox" name="uid" value="' + list[i].id + '" /><img src="' + list[i].face + '" /><span>' + list[i].name + '</span></label></a>';
        }
        if (html) {
            this._elemList.innerHTML = '<ul>' + html + '</ul>';
            this._elemList.style.display = 'block';
        } else {
            this._elemError.innerHTML = '您還沒有好友';
            this._elemError.style.display = 'inline-block';
        }
        this._listReady = true;
        if (typeof this.onListReady == 'function') {
            this.onListReady(list);
        }
    });
};
RcInvite.prototype.setData = function(obj) {
    if (typeof obj == 'object' && obj.title) {
        this._data = obj;
    }
};
RcInvite.prototype.login = function(cb) {
    this._elemLogin.style.display = 'none';
    this._elemLoading.style.display = 'inline-block';
    this.startLogin(function() {
        this._getList();
        if (typeof cb == 'function') {
            cb.call(this);
        }
    });
};
RcInvite.prototype.invite = function(cb) {
    if (this._listReady) {
        var inputs = this._elemList.getElementsByTagName('input');
        if (inputs.length) {
            var ids = [];
            for (var i = 0, len = inputs.length; i < len; i++) {
                if (inputs[i].checked) {
                    ids.push(parseInt(inputs[i].value, 10));
                }
            }
            if (ids.length) {
                this._elemError.style.display = 'none';
                this.startInvite(this._data, ids, function(ret) {
                    this._elemError.innerHTML = '<font color="green">恭喜，您成功邀請了好友</font>';
                    this._elemError.style.display = 'inline-block';
                    if (typeof cb == 'function') {
                        cb.call(this);
                    }
                });
            } else {
                this._elemError.innerHTML = '您未選擇好友';
                this._elemError.style.display = 'inline-block';
            }
        } else {
            this._elemError.innerHTML = '您沒有好友可以邀請';
            this._elemError.style.display = 'inline-block';
        }
    } else {
        this._elemError.innerHTML = '好友列表還未準備好';
        this._elemError.style.display = 'inline-block';
    }
};
RcInvite.prototype.toggleSelectAll = function(checkbox) {
    var inputs = this._elemList.getElementsByTagName('input');
    for (var i = 0, len = inputs.length; i < len; i++) {
        inputs[i].checked = checkbox.checked ? true : false;
    }
};
RcInvite.prototype.init = function(listId, loginId, errorId, loadingId) {
    this._elemList = document.getElementById(listId);
    this._elemLogin = document.getElementById(loginId);
    this._elemError = document.getElementById(errorId);
    this._elemLoading = document.getElementById(loadingId);
    if (this._elemList && this._elemLogin && this._elemError && this._elemLoading) {
        this._elemList.style.display = 'none';
        this._elemLogin.style.display = 'none';
        this._elemError.style.display = 'none';
        this._elemLoading.style.display = 'inline-block';
        this.checkLogin(function(isLogin) {
            if (isLogin) {
                this._getList();
            } else {
                this._elemLoading.style.display = 'none';
                this._elemLogin.style.display = 'inline-block';
            }
        });
    }
};