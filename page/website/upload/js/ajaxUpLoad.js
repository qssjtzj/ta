/**
 * @fileOverview AJAX文件上传静态方法，本人改写于一个jQuery流行上传插件，现在版本可以单独工作，不依赖于任何JS框架
 * @author Tang Guohui 2012-1-16
 * @see http://www.phpletter.com/Demo/AjaxFileUpload-Demo/
 * @example You can download from this URI http://www.phpletter.com/download_project_version.php?version_id=6
 */

/**
 * AJAX文件上传静态方法
 * @param {String} uri 请求URL
 * @param {String} fileId 上传文件域ID
 * @param {Function} callback 回调函数，带data参数为框架页返回HTML文件文本
 * @param {JSON} otherInputs 其它要一起POST向服务器的非文件域表单项
 */
function ajaxUpLoad(uri, fileId, callback, otherInputs)
{
    var otherInputs = otherInputs || {};
	var rand = new Date().getTime(); //框架与表单ID后缀，使用时间戳
    var frameId, formId;
	//IE9以上变的标准了，所以其createElement方法与标准浏览器一致
    var ie9 = navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/MSIE/, '')) < 9;
	
	/**
	 * 创建框架
	 * @param {String} id 框架iframe ID
	 */
    var createIframe = function(id)
    {
		var id = id + rand;
        if (window.ActiveXObject && ie9) 
        {
            var frame = document.createElement('<iframe id="' + id + '" name="' + id + '" />');
            //frame.src = 'javascript:false';
			
        }
        else 
        {
            var frame = document.createElement('iframe');
            frame.id = id;
            frame.name = id;
        }
        frame.style.position = 'absolute';
        frame.style.top = '-1500px'; //把它移到浏览器可视窗口外面，使其看不见
        document.body.appendChild(frame);
        frameId = id; //全局框架ID赋值，以方便后面调用
        return frame;
    };
    
	/**
	 * 创建表单
	 * @param {String} id 表单Form ID
	 * @param {String} fileId 文件域ID和Name
	 */
    var createForm = function(id, fileId)
    {
        var id = id + rand;
		if (window.ActiveXObject && ie9) 
        {
            var form = document.createElement('<form id="' + id + '" name="' + id + '" enctype="multipart/form-data" />');
        }
        else 
        {
            var form = document.createElement('form');
            form.id = id;
            form.name = id;
            form.enctype = 'multipart/form-data';
        }
        form.method = 'POST';
        form.style.position = 'absolute';
        form.style.top = '-1500px';
        
		//把复制新的文件域放回原来位置，把旧的移到提交表单中，因为IE浏览器出于安全考虑，复制出来的文件域是不会带上原来已有value，所以不能把复制的文件域移入表单中使用
        var oldFileInput = document.getElementById(fileId);
        var newFileInput = oldFileInput.cloneNode(true);
        oldFileInput.parentNode.insertBefore(newFileInput, oldFileInput);
        oldFileInput.name = fileId;
        form.appendChild(oldFileInput);
        
		//创建其它要一起POST向服务器的非文件域表单项集，创建隐藏域并赋值就可以
        for (var a in otherInputs) 
        {
            var otherInput = document.createElement('input');
            otherInput.type = 'hidden';
            otherInput.id = a;
            otherInput.name = a;
            otherInput.value = otherInputs[a];
            form.appendChild(otherInput);
        }
        
        document.body.appendChild(form);
        formId = id;
        return form;
    };
    
	/**
	 * 框架页加载完成回调函数
	 */
    var uploadCallback = function()
    {
        var frame = document.getElementById(frameId);
        var form = document.getElementById(formId);
        var data;
        
		//取加载完成后框架页的HTML文本(可以是纯文本)
        if (frame.contentWindow) 
        {
            data = frame.contentWindow.document.body ? frame.contentWindow.document.body.innerHTML : null;
            
        }
        else 
            if (frame.contentDocument) 
            {
                data = frame.contentDocument.document.body ? frame.contentDocument.document.body.innerHTML : null;
            }
        
		//把获取的数据传给回调函数
        callback(data);
        
		//把创建的框架与表单移除，不然多次操作将出现重复的HTML
        setTimeout(function()
        {
            try 
            {
                frame.parentNode.removeChild(frame);
                form.parentNode.removeChild(form);
            } 
            catch (e) 
            {
            }
        }, 300);
        
        data = null;
    };
    
	/**
	 * 把动态创建的表单自动提交到框架页
	 */
    var frame = createIframe('uploadFrame');
    var form = createForm('uploadForm', fileId);
    form.action = uri;
    form.target = frameId;
    form.submit();
    
	//注册框架页加载完成事件回调函数
    if (window.attachEvent) 
    {
        frame.attachEvent('onload', uploadCallback);
    }
    else 
    {
        frame.addEventListener('load', uploadCallback, false);
    }
}
