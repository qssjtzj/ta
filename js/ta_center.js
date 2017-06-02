
var center={

    init:function(){
        var uid = common.cookies.read("_uid_");
        console.log('uid', uid);

        this.getinfo();

        $("#btn_update").click(function(){
            var cls = $("#btn_update").attr("class");

            if(cls.indexOf("edit")>0){

                $(".sub2 .right .tab .tab_one.txt").removeAttr("readonly")
                $(".sub2 .right .tab .tab_one.txt").removeClass("tab_show").addClass("tab_edit");

                $("#btn_update").removeClass("edit").addClass("save");
                $("#btn_update").html("完成");
            }else if(cls.indexOf("save")>0){

                $(".sub2 .right .tab .tab_one.txt").attr("readonly","true")
                $(".sub2 .right .tab .tab_one.txt").removeClass("tab_edit").addClass("tab_show");

                $("#btn_update").removeClass("save").addClass("edit");
                $("#btn_update").html("编辑");

                center.update();
            }
        });

     /*   $("input[type='text']").blur(function(){
            var id = this.id;
            register.check(id);
        });

        $("input[type='text']").focus(function(){
            var id = this.id;

        });
    */
    },
    hideTip:function(id){
        $("#"+id).parent().find(".err-tip").html("");
        $("#"+id).parent().find(".err-tip").hide();
    },
    showTip:function( id, val){
        $("#"+id).parent().find(".err-tip").html(val);
        $("#"+id).parent().find(".err-tip").show();
    },
    check:function(id){
        var val = String.prototype.trim($("#"+id).val());

        if( id === "mobile"){
            return register.checkPhone(id, val);
        }else if( id === "img_verify"){
            return register.checkCode(id, val);
        }else if( id === "sms_verify"){
            return register.checkLength(id, val, 4, 4 , "请输入正确短信验证码");
        }else if( id === "password"){
            return register.checkPassword(id, val);
        }else if( id === "nickname"){
            return register.checkLength(id, val, 4, 12, "昵称长度不正确");
        }
        return false;
    },
    checkPhone:function(id, val){
        $("#btn_sms_verify").attr("phone-checked", "false");

        var patrn = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
        if (!patrn.exec(val)) {
            this.showTip(id, "请输入正确手机号码");
            return false;
        }else{
            this.hideTip(id);
            $("#btn_sms_verify").attr("phone-checked", "true");
        }
        return true;
    },
    checkCode:function(id, val){
        $("#btn_sms_verify").attr("code-checked", "false");

        if ( val.length && val.length == 4) {

            var url = TA.apiPath + "/account/verify_code.php";
            var data = {"code": val};
            RequestUtil.credent("GET",url, data , function(data){

                    if (data.rescode == 200 ) {
                        register.hideTip(id);
                        $("#btn_sms_verify").attr("code-checked", "true");
                        $("#btn_sms_verify").addClass("cur");
                    } else {
                        register.showTip(id, "图形验证码不正确");
                        register.refresh();
                    }
                });
        }else{
            this.showTip(id, "请输入正确图形验证码");
        }
        return true;
    },
    checkPassword:function(id, val){

        var patrn = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/;
        if (!patrn.exec(val)) {
            this.showTip(id, "密码格式不正确");
            return false;
        }else{
            this.hideTip(id);
        }
        return true;
    },
    checkLength:function(id, val, low, hight, msg){

        if (val.length >= low && val.length <= hight) {
            this.hideTip(id);
            return true;
        }else{
            this.showTip(id, "" + msg);
            return false;
        }
        return true;
    },
    clearNote : function(id,_val){
        var val =  this.trim($('#'+id).val());
        if(val==_val){
            $('#'+id).val("");
            $('#'+id).css({'color':'#333'});
        }else{
            //$('#'+id).val(val);
            $('#'+id).css({'color':'#333'});
        }
        this.hideTip(id);
    },
    getinfo:function(){
        // var uid = $("#uid").val();
        var uid = common.cookies.read("_uid_");

        var url = TA.apiPath + "/get_uinfo_attr.php";
        var data = {"uid": uid};
        RequestUtil.credent("GET",url, data , function(data){

            if (data.rescode == 200 ) {
                var obj = data.result;
                console.log(obj);

                document.getElementById("user_icon").setAttribute("src", obj.icon)
                $("#user_icon").attr('src',obj.icon);

                jQuery.each(obj, function(i, val) {
                    if(val === ''){
                        val = "保密"
                    }
                    $("input[name='"+ i +"']").val(val);
                });

            } else {
                swal({
                    title: "获取失败,请稍后重试",
                    text: data.rescode,
                    imageUrl: "/imgs/dlshibai.png",
                    timer: 5000,
                });
            }
        } );
    },
    update:function(){

        var uid = common.cookies.read("_uid_");

        var url = TA.apiPath + "/update_uinfo.php";
        var data = {};//{"account": phone, "passwd": password, "nick" : nickname, "verify" : sms_verify};

        $("input[isupdate='ture']").map(function() {
            data[this.name]= this.value;
        });
        console.log("data", data);
        data["uid"]= uid;

        RequestUtil.credent("GET", url, data , function(data){

            console.log("result", data);
            if (data.rescode == 200 ) {
                window.location.reload();
            } else{
                swal({
                    title: "修改失败",
                    text: data.error,
                    //type:"error"
                    imageUrl: "/imgs/dlshibai.png",
                    timer: 5000,
                });
            }
        });
    }
}