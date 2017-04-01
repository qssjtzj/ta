 // JavaScript Document
var RcEditor = function() {
    this._text = null;
    this._frame = null;
    this._win = null;
    this._doc = null;
    this._isFocus = false;
    this._bookmark = null;
    this.disableEdit = false;
    this.disableEditControl = false;
    this.removePasteStyle = false;
    this.singleLineMode = false;
    this.maxByteSize = 0;
    this.className = 'RcEditor';
    this.css = {};
    this.setFilter = null;
    this.getFilter = null;
    this.onInit = null;
};
RcEditor.prototype.isIE = (function() {
    return new RegExp('msie|trident', 'i').test(navigator.userAgent);
})();
RcEditor.prototype.getByteSize = function(str) {
    if (typeof str == 'string') {
        var len = str.length;
        var _len = len;
        for (var i = 0; i < _len; i++) {
            if (str.charCodeAt(i) > 127) {
                len++;
            }
        }
        return len;
    }
    return str.length || 0;
};
RcEditor.prototype.addEvent = function(elem, event, callback) {
	////console.log("3addEvent");
    if (elem.addEventListener) {
        elem.addEventListener(event, callback, false);
    } else {
        var self = this;
        elem[event + callback] = function() {
            callback.call(elem, self._win.event);
        };
        elem.attachEvent('on' + event, elem[event + callback]);
    }
};
RcEditor.prototype.removeEvent = function(elem, event, callback) {
	//console.log("4removeEvent");
    if (elem.removeEventListener) {
        elem.removeEventListener(event, callback, false);
    } else {
        elem.detachEvent('on' + event, elem[event + callback]);
        elem[event + callback] = null;
    }
};
RcEditor.prototype.setStyle = function(obj, elem) {
	//console.log("5setStyle");
    if (Object.prototype.toString.call(obj) == '[object Object]') {
        elem = elem || this._doc.body;
        for (var name in obj) {
            elem.style[name] = obj[name];
        }
    }
};
RcEditor.prototype.init = function(txtId) {
	//console.log("6init");
    var self = this;
    var text = document.getElementById(txtId);
    if (text) {
        var frame = document.createElement('iframe');
        frame.className = this.className;
        frame.frameBorder = 0;
        frame.style.display = 'block';
        frame.style.border = 'none';
        var textTemp = text.cloneNode(false);
        textTemp.style.display = 'inline-block';
        textTemp.style.position = 'absolute';
        textTemp.style.left = '-10000px';
        document.body.appendChild(textTemp);
       	// frame.style.width = textTemp.offsetWidth + 'px';
		frame.style.width ='98%';
        frame.style.height = textTemp.offsetHeight + 'px';
        document.body.removeChild(textTemp);
        text.parentNode.insertBefore(frame, text);
        text.style.display = 'none';
		
        var doc = frame.contentDocument || frame.contentWindow.document;
        doc.designMode = this.disableEdit === false ? 'on' : 'off';
        doc.open();
        doc.write('<html><body style="margin:0;"></body></html>');
        doc.close();
        this._text = text;
        this._frame = frame;
        this._win = frame.contentWindow;
        this._doc = doc;
        this.setStyle(this.css);
		
        this.addEvent(this._win, 'focus', function() {
            self._isFocus = true;
        });
        this.addEvent(this._win, 'blur', function() {
            self._isFocus = false;
            self.updateValue();
        });
		
        if (this.isIE) {
            this.addEvent(this._frame, 'beforedeactivate', function() {
                if (self._win.getSelection) {
                    var selection = self._win.getSelection();
                    if (selection.rangeCount > 0) {
                        self._bookmark = selection.getRangeAt(0);
                    }
                } else {
                    if (self._doc.selection && self._doc.selection.type != 'Control') {
                        var range = self._doc.selection.createRange();
                        self._bookmark = range.getBookmark();
                    }
                }
            });
        }
        if (this.removePasteStyle === true || (typeof this.removePasteStyle == 'string' && this.removePasteStyle)) {
            function strip_tags(input, allowed) {
                allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
                return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
            }
            this.on('paste', function() {
                window.setTimeout(function() {
                    var allowed = self.removePasteStyle === true ? '' : self.removePasteStyle;
                    self._doc.body.innerHTML = strip_tags(self._doc.body.innerHTML, allowed);
                    self.updateValue();
                }, 100);
            });
        }
        if (this.disableEditControl) {
            if (this.isIE) {
                if (navigator.userAgent.toLowerCase().indexOf('msie') == -1) {
                    this.on('mscontrolselect', function(e) {
                        e.preventDefault();
                    });
                } else if (this._doc.selection) {
                    this.on('mouseup', function() {
                        if (self._doc.selection.type == 'Control') {
                            self.execCommand('unselect');
                        }
                    });
                }
            } else {
                if (document.getBoxObjectFor) {
                    this.execCommand('enableObjectResizing', false, false);
                } else {
                }
            }
        }
        if (this.maxByteSize) {
            this.on('keydown', function(e) {
                if (self.getByteSize(self.getText()) > self.maxByteSize && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 8 && e.keyCode != 46) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }
            });
        }
        if (this.isIE && this._doc.selection && !this._doc.getSelection) {
            this.on('keydown', function(e) {
                if (e.keyCode == 8 && self._doc.selection.type == 'Control') {
                    self._doc.selection.clear();
                }
            });
        }
        if (this.singleLineMode) {
            this.addEvent(this._doc, 'keydown', function(e) {
                if (e.keyCode == 13) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }
            });
        }
        this.setHTML();
        if (typeof this.onInit == 'function') {
            this.onInit.call(this, this._text, this._frame, this._doc);
        }
    } else {
        throw 'Text box not found';
    }
};
RcEditor.prototype.focus = function() {
	//console.log("7focus");
    this._win.focus();
    var selection, range;
    if (this._win.getSelection) {
        selection = this._win.getSelection();
        if (this._bookmark) {
            range = this._bookmark;
        } else {
            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            }
        }
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        if (this._doc.selection && this._doc.selection.type != 'Control') {
            if (this._bookmark && this._doc.body.createTextRange) {
                range = this._doc.body.createTextRange();
                range.moveToBookmark(this._bookmark);
                range.select();
            }
        }
    }
};
RcEditor.prototype.blur = function() {
	//console.log("7blur");
    this._win.blur();
};
RcEditor.prototype.isFocus = function() {
	//console.log("8isFocus");
    return this._isFocus;
};
RcEditor.prototype.execCommand = function(command, showUI, value) {
	//console.log("9execCommand");

    this.focus();
    this._doc.execCommand(command, showUI, value);
};
RcEditor.prototype.insertHTML = function(html) {
	//console.log("10insertHTML");
    this.focus();
    var selection, range;
    if (this._win.getSelection) {
        selection = this._win.getSelection();
        range = selection.getRangeAt(0);
		//alert(range);
		
		//IE9以上变的标准了，所以其createElement方法与标准浏览器一致
    	var ie9 = navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/MSIE/, '')) == 9;
		//alert(html);
		/*
		if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment){
			 Range.prototype.createContextualFragment = function(html){
				 var frag = document.createDocumentFragment(),  
				 div = document.createElement("div");
				 frag.appendChild(div);
				 div.outerHTML = html;
				 return frag;
			 };
		}*/
		var fragment;
		if(ie9){
			range = document.selection.createRange();
			//var node = document.createDocumentFragment(),  
			//div = document.createElement("div");
			//node.appendChild(div);
			//div.outerHTML = html;
			//fragment = node;
			
			//html = (node.nodeType == 3) ? node.data : node.outerHTML;
			
        	range.pasteHTML(html);
			
		}else{
       	 	fragment = range.createContextualFragment(html);
		
			var lastNode = fragment.lastChild;
			range.deleteContents();
			range.insertNode(fragment);
			
			range.setEndAfter(lastNode);
			range.setStartAfter(lastNode);
		}
		
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        selection = this._doc.selection;
        if (selection) {
            if (selection.type == 'Control') {
                selection.clear();
            }
            selection.createRange().pasteHTML(html);
        }
    }
};
RcEditor.prototype.appendHTML = function(html) {
	//console.log("11appendHTML");
    this._doc.body.innerHTML += html;
};
RcEditor.prototype.setHTML = function(value) {
	
    value = typeof value == 'undefined' ? this._text.value : value;
    var html = typeof this.setFilter == 'function' ? this.setFilter(value) : value;
	//console.log("12setHTML",html);
    this._doc.body.innerHTML = html;
    this.updateValue();
};
RcEditor.prototype.getHTML = function() {
	//console.log("13getHTML");
    var html = this._doc.body.innerHTML;
    return typeof this.getFilter == 'function' ? this.getFilter(html) : html;
};
RcEditor.prototype.updateValue = function() {
	//console.log("14updateValue");
    this._text.value = this.getHTML();
};
RcEditor.prototype.select = function(start, end) {
	//console.log("15select");
    var selection, range;
    if (typeof start == 'number') {
        end = typeof end == 'number' ? end : start;
        if (this._win.getSelection) {
            selection = this._win.getSelection();
            range = selection ? selection.getRangeAt(0) : this._doc.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            if (this._doc.body.createTextRange) {
                range = this._doc.body.createTextRange();
                range.collapse(true);
                range.moveStart('character', 0);
                range.moveEnd('character', 0);
                range.select();
            }
        }
    }
};
RcEditor.prototype.getText = function() {
	//console.log("16getText");
    return this._doc.body.innerHTML.replace(/<[^>]*>/g, '').replace(/&nbsp;/ig, ' ');
};
RcEditor.prototype.getFormatText = function() {
	//console.log("17getFormatText");
    return this._doc.body['innerText' in document.body ? 'innerText' : 'textContent'];
};
RcEditor.prototype.getSelectedText = function() {
	//console.log("18getSelectedText");
    var text = '';
    if (this._doc.selection) {
        text = this._doc.selection.createRange().text.replace(/\r\n/g, '');
    } else {
        var selection = this._win.getSelection();
        if (selection.rangeCount > 0) {
            text = selection.getRangeAt(0);
        }
    }
    return text.toString();
};
RcEditor.prototype.getTextSize = function() {
	//console.log("19getTextSize");
    return this.getText().length;
};
RcEditor.prototype.isEmpty = function() {
	//console.log("20isEmpty");
    return this.getTextSize() === 0;
};
RcEditor.prototype.width = function(width) {
	//console.log("21width");
    if (arguments.length > 0) {
        if (typeof width == 'number' && width > 0) {
            this._frame.style.width = width + 'px';
        }
    } else {
        return this._frame.offsetWidth;
    }
};
RcEditor.prototype.height = function(height) {
	//console.log("22height");
    if (arguments.length > 0) {
        if (typeof height == 'number' && height > 0) {
            this._frame.style.height = height + 'px';
        }
    } else {
        return this._frame.offsetHeight;
    }
};
RcEditor.prototype.show = function() {
	//console.log("23show");
    this._frame.style.display = 'block';
};
RcEditor.prototype.hide = function() {
	//console.log("24hide");
    this._frame.style.display = 'none';
};
RcEditor.prototype.toggle = function() {
    if (this._frame.style.display && this._frame.style.display.toLowerCase() == 'none') {
        this.show();
    } else {
        this.hide();
    }
};
RcEditor.prototype.disable = function() {
    this._doc.designMode = 'off';
};
RcEditor.prototype.enable = function() {
    this._doc.designMode = 'on';
};
RcEditor.prototype.on = function(event, callback) {
    this.addEvent(this._doc.body, event, callback);
};
RcEditor.prototype.off = function(event, callback) {
    this.removeEvent(this._doc.body, event, callback);
};
