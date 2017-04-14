//ajaxPost  AJAX的公共函数，用于扩展多个AJAX请求
/* 参数详解：
	urls: 请求的URL
	data: 请求的参数
	callback: 成功请求后，需要调用的函数名
*/
function ajaxPost( urls , datas , callback ){
	$.ajax({
		async:false,
		url: urls,
		dataType: "json",
		data: datas,
		type: "post",
		success:function( data ){
			//成功请求过后调用 函数并把data参数传值进去
			callback(data);
		},
		error:function( data ){
			return -1;
		}
	});
}