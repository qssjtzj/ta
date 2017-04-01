function addFavorite(title, url) {
    if (typeof title == "undefined") {
        title = document.title;
    }
    if (typeof url == "undefined") {
        url = "http://" + location.host + "/";
    }
    var ctrl = navigator.userAgent.toLowerCase().indexOf("mac") != -1 ? "Command/Cmd" : "CTRL";
    try {
        if (document.all) {
            try {
                window.external.toString();
                window.alert("抱歉，您所使用的瀏覽器無法完成收藏。\n\n請使用Ctrl+D進行收藏");
            } 
            catch (e) {
                try {
                    window.external.addFavorite(url, title);
                } 
                catch (e) {
                    window.external.addToFavoritesBar(url, title);
                }
            }
        } else {
            if (window.sidebar) {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("抱歉，您所使用的瀏覽器無法完成收藏。\n\n請使用Ctrl+D進行收藏");
            }
        }
    } 
    catch (e) {
        window.alert("抱歉，您所使用的瀏覽器無法完成收藏。\n\n請使用Ctrl+D進行收藏");
    }
}
//
//function showGuard() {
//    var w = $(window).width(), c = $("#guardBox");
//    (w < 1450) ? (c.hide()) : (c.show());
//}




$(function(){
	return;
    $("#profile-info").tooltip({
        offset: [150, 2],
        tip: '#tooltip'
    });
    $('#tab-panes').tabs('#tab-contents > div', {
        tabs: 'li'
    });
    $('#guardBox').tabs('#guardBoxContent > div', {
        tabs: 'span'
    });
    $('#share-type').tabs('#share-type-contents > div', {
        onClick: function(e, i) {
            if (i == 1) {
                document.getElementById('share-code').select();
            }
        }
    });
   // showGuard();
    $('#btnOpenGuard').click(function() {
        if (serverData.nick) {
            $('#guardPayUser').text(serverData.nick);
            $(this).overlay({
                top: '20%',
                load: true,
                onBeforeLoad: function() {
                    var overlay = this.getOverlay();
                    $('div.guard-bind', overlay).hide();
                    $('div.guard-guide', overlay).show();
                }
            });
        } else {
            var self = $(this);
            RC.Event.subscribe('login', function(ret) {
                self.trigger('click');
            });
            RC.login();
        }
    });
    /*
    $(window).resize(function() {
        showGuard();
    });
    */
    $('#personal-pane').tabs('#host-content > div', {
        onClick: function(event, index) {
            var tab = this.getCurrentTab();
            var pane = this.getCurrentPane();
            if (!tab.hasClass('active')) {
                tab.addClass('active');
                if (index === 0) {
                    //wallPhotos();
                } else if (index == 1) {
                    if (serverData.uid && serverData.me && !serverData.fbPageUrl) {
                        //主播沒有填但登錄，引導綁定
                        pane.html('<div class="fbBind-guide""><p>該主播沒有綁定自己的粉絲頁面，您暫時看不到哦，趕快提醒他/她綁定吧！</p><div class="fbBind-guide-inner"><a href="""></a></div></div>');
                    } else {
                        if (serverData.fbPageUrl && FB) {
                            pane.html('<div class="fbBind-inner"><div id="fb-like-box" class="fb-like-box" data-href="' + serverData.fbPageUrl + '" data-colorscheme="light" data-show-faces="true" data-header="false" data-stream="true" data-show-border="false" data-width="960" data-height="520"></div></div>');
                            FB.XFBML.parse(pane.get(0));
                        } else {
                            //主播沒有填
                            pane.html('<div class="fbBind-guide2">該主播很懶還沒綁定Facebook哦~</div>');
                        }
                    }
                } else if (index == 2) {
                    if (serverData.ytChannelId) {
                        $('#yt-host').html('<div class="g-ytsubscribe" data-channelid="' + serverData.ytChannelId + '" data-layout="full" data-count="default"></div>');
                        $.getScript('https://apis.google.com/js/platform.js');
                    }
                    if (serverData.ytPlaylistId) {
                        $.getJSON('http://gdata.youtube.com/feeds/api/playlists/' + serverData.ytPlaylistId + '?v=2&alt=json&callback=?&max-results=50&fields=yt:playlistId,entry(media:group(yt:videoid,media:title,yt:duration))&key=AIzaSyA2sVRQOR-MQ74xynJq11zL5yy2z-rCDh0', function(data) {
                            if (data.error) {
                                console.log(data);
                                return false;
                            }
                            var toPaddedString = function(num, len) {
                                num = num.toString();
                                if (num.length < len) {
                                    var str = '';
                                    for (var i = 0; i < len - num.length; i++) {
                                        str += '0';
                                    }
                                    num = str + num;
                                }
                                return num;
                            };
                            var downTimeToJSON = function(remainSecond) {
                                var o = {};
                                o.day = Math.floor(remainSecond / 86400);
                                remainSecond -= o.day * 86400;
                                o.hour = toPaddedString(Math.floor(remainSecond / 3600), 2);
                                remainSecond -= o.hour * 3600;
                                o.minute = toPaddedString(Math.floor(remainSecond / 60), 2);
                                remainSecond -= o.minute * 60;
                                o.second = toPaddedString(remainSecond, 2);
                                return o;
                            };
                            var html = '';
                            var lid = data.feed.yt$playlistId.$t;
                            $.each(data.feed.entry, function(i, n) {
                                var id = n.media$group.yt$videoid.$t;
                                var title = n.media$group.media$title.$t;
                                var timeObj = downTimeToJSON(parseInt(n.media$group.yt$duration.seconds));
                                var time = timeObj.hour + ':' + timeObj.minute + ':' + timeObj.second;
                                var img = 'https://i1.ytimg.com/vi/' + id + '/mqdefault.jpg';
                                var url = 'https://www.youtube.com/watch?v=' + id + '&list=' + lid;
                                html += '<li>';
                                html += '<div><a href="../RC娛樂 讓夢發聲_files/' + url + '" target="_blank"><img src="../RC娛樂 讓夢發聲_files/' + img + '"/><span>' + time + '</span></a></div>';
                                html += '<h5><a href="../RC娛樂 讓夢發聲_files/' + url + '" target="_blank">' + title + '</a></h5>';
                                html += '</li>';
                            });
                            pane.find('.yt-title').show();
                            $('#yt-list').html(html);
                        });
                    }
                    if (!serverData.ytPlaylistId) {
                        $('.channel-yt-container').html('<div class="fbBind-guide2">該主播很懶還沒綁定Youtube哦~</div>');
                    }
                }
            }
        }
    });
});
