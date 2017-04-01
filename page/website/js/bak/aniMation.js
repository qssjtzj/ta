/**
 * update by weiwenyan 2014.03.07
 */
//判断bottom的高度
var thisHeight = $(window).height();
var documentHeight= $(document.body).height();
if(thisHeight > documentHeight){
	var tureHeight = thisHeight-documentHeight;
	var bottomHeight = $('#bottomIframe').height();
	 $('#bottomIframe').height(bottomHeight+tureHeight);
	} 
 
 
//标签切换
function showTxt(head,number,num) {
	for(var i=1;i<=num;i++) {
		if(i == number) {
			var divName=document.getElementById(head + i);
			divName.style.display = "block";
			
		}else{
			var divName=document.getElementById(head + i);
			divName.style.display = "none";
		}
	}
}

/**
 * 账号中心，添加删除账号
 */
 var i=0
 function insert_row(tab){
  var tabInsert = document.getElementById(tab);
  i ++;
  R = tabInsert.insertRow();
  C = R.insertCell();
  C.innerHTML = +i+"行";
  C = R.insertCell();
  C.innerHTML = "加菲猫";
  C = R.insertCell();
  C.innerHTML = "倒霉熊";
  C = R.insertCell();
  C.innerHTML = "熊";
  C = R.insertCell();
  C.innerHTML = "管理员";
  C = R.insertCell();
  C.innerHTML = "双鱼";
  C = R.insertCell();
  C.innerHTML = new Date();
  C.innerHTML = "<input type='button'  value='删除' onclick='deleteRow(this)'>"+"<input type='submit' name='button2' id='button2' value='编辑'/>";
 } 
 function deleteRow(obj){
  tbl.deleteRow(obj.parentElement.parentElement.rowIndex);
 }