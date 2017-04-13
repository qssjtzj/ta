# readme
#test user name
# test
#third
#four


<?php
session_start();

define('FILEPATH',dirname(__FILE__));

$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';
@header("Access-Control-Allow-Origin:".$origin);
@header("Access-Control-Allow-Credentials:true");

$ret = new stdClass();
$ret->rescode = 403;

if(!isset($_GET['phone']) ||!isset($_GET['code'])) {
        $ret->error= "phone, code  must be exist";
        echo json_encode($ret);
        exit();
}

$_phone = $_GET['phone'];
$_code = md5(strtolower($_GET['code']));

if(!isset($_SESSION["verification"]) || $_code != $_SESSION["verification"]){
    $ret->error=  "验证码错误" ;
    $ret->rescode = 1021;
    echo json_encode($ret);
    exit();
}

if( isset($_COOKIE["phone"]) ){
    $ret->error=  "请稍后再试" ;
    $ret->rescode = 1022;
    echo json_encode($ret);
    exit();
}

$str = random(4);
$sms_code = md5($str . "!@#$%" . $_phone);
$_SESSION["sms_code"] = $sms_code;
SetCookie("phone", $_phone, time() + 60, "/", ".iyoho.mobi");


if(isset($_GET['debug']) && $_GET['debug'] == 'true'){

    $ret->msg=  $str;

    $ret->rescode = 200;
    setcookie('sms', $str, time() + 60, '/', '.iyoho.mobi');
    echo json_encode($ret);
    exit();
}
