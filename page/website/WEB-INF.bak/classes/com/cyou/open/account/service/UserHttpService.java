package com.cyou.open.account.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.cyou.common.utils.DateUtil;
import com.cyou.open.account.dao.UserHttpDao;

@Service
@Transactional(readOnly = true)
public class UserHttpService {
    private static final Logger log = Logger.getLogger(UserHttpService.class);
	
	@Autowired
	private UserHttpDao userHttpDao;
	
	//登陆
	public int checkPassWord(int _uid, String pwd) {
		//密码需要加密算法
//		String pwd = SecurityUtil.md5(_pwd);//sha1();
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        params.put("passwd", pwd);
        params.put("style", "text");
        
		String str =userHttpDao.httpRequestGet("user/check_passwd.php", params);
		log.info("================back==============="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		int uid=0;
		if(code==200){
			uid=returnJson.getIntValue("uid");
		}
		
		return uid;
	}
	
	//Token登陆
	public String getLoginToken(int _uid, String ip ,String kind) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        params.put("ip", ip);
        params.put("kind", kind);
        
		String str =userHttpDao.httpRequestGet("user/get_login_token.php", params);
		log.info("================back==============="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		String t = "";
		if(code==200){
			t = returnJson.getString("token");
		}
		
		return t;
	}
	
	//获取用户UID
	public int getUidByAccount(String account  ) {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("account", account);
		String str =userHttpDao.httpRequestGet("user/getuid.php", params);
		log.info("================back==============="+str);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		int uid=0;
		
		if(code==200){
			uid=returnJson.getIntValue("uid");
		}
		return uid;
	}
	
	//获取FB用户绑定UID
	public int getUidByFB(String fbids  ) {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("fbids", fbids);
		String str =userHttpDao.httpRequestGet("facebook/get_uid_by_facebookid.php", params);
		log.info("facebook/get_uid_by_facebookid.php========back========"+str);
		if(str==null){
			return -1;
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		int uid=0;
		
		if(code==200){
			if(returnJson.get("result").getClass().equals(JSONObject.class)){
				JSONObject json = returnJson.getJSONObject("result");
				uid =  json.getIntValue(fbids);
			}
		}
		return uid;
	}
	
	//检查用户是否绑定FB
	public  Map<String, Object> checkBind(int uid  ) {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", uid);
		String str =userHttpDao.httpRequestGet("facebook/check_bind.php", params);
		log.info("facebook/check_bind.php========back========"+str);
		if(str==null){
			return null;
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");

		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			map.put("facebookid", returnJson.getString("facebookid"));
			map.put("token", returnJson.getString("token"));
		}
		return map;
	}
	
	//绑定FB
	public int bindFB(int uid,String fbid,String token  ) {
		//uid=_uid&fb_uid=_fb_uid&token=_token
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", uid);
        params.put("fb_uid", fbid);
        params.put("token", token);
		String str =userHttpDao.httpRequestGet("facebook/bind.php", params);
		log.info("facebook/bind.php=========back==========="+str);
		if(str==null){
			return -1;//连接超时
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		if(code==200){
			return 1;
		}
		return 0;
	}
	
	//获取用户信息
	public Map<String, Object> getUInfoByUid(int _uid ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        
		String str =userHttpDao.httpRequestGet("user/getuinfo.php", params);
		log.info("user/getuinfo.php========back========"+str);
//		{"rescode":"200","uid":"_uid","nick":"","sign":"","sex":"","birthday":"","area":"","province":"","city":"","intro":"","jifen":"","silver":"","passport":"","account":"","signup_time":""}
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			map.put("uid", returnJson.getString("uid"));
			map.put("nick",  returnJson.getString("nick"));
			map.put("sign",  returnJson.getString("sign"));//签名
			map.put("sex",  returnJson.getString("sex"));
			map.put("birthday",  returnJson.getString("birthday"));
			map.put("area",  returnJson.getString("area"));
			map.put("province",  returnJson.getString("province"));//省份
			map.put("city",  returnJson.getString("city"));
			map.put("intro",  returnJson.getString("intro"));//介绍
			map.put("jifen",  returnJson.getString("jifen"));
			map.put("silver",  returnJson.getString("silver"));//银币
			map.put("passport", returnJson.getString("passport"));
			map.put("account",  returnJson.getString("account"));
			map.put("signup_time",  returnJson.getString("signup_time"));
			
			map.put("constellation",  returnJson.getString("constellation"));//星座
            map.put("blood",  returnJson.getString("blood"));//血型
            map.put("height",  returnJson.getString("height"));//身高
            map.put("weight",  returnJson.getString("weight"));//体重
            map.put("bwh",  returnJson.getString("bwh"));//三围
            map.put("facebook",  returnJson.getString("facebook"));//facebook
            map.put("photo",  returnJson.getString("photo"));//个人照片
            
			int userLevel=getUserLevel(Integer.parseInt(returnJson.getString("jifen")));
			map.put("level",  userLevel);
			
		}
		return map;
	}
	
	public int updateUInfo(int uid ,String facebook) {
		return updateUInfo(uid, null, null, null, null, null,null, null, null, null, null, null, facebook, null);		
	}
	public int updateUInfo(int uid ,String birthday ,String facebook) {
		return updateUInfo(uid, birthday, null, null, null, null,null, null, null, null, null, null, facebook, null);		
	}
	public int updateUInfo(int uid ) {
		return updateUInfo(uid, "19000101", null, null, null, null,null, null, null, null, null, null, null, null);		
	}
	//更新用户信息
	public int updateUInfo(int _uid ,String birthday ,String area ,String sign ,String nick ,String sex,
	    String city,String blood,String constellation,String height,String weight,String bwh,String facebook,String photo) {
		
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put("uid", _uid);
        if(birthday!=null){
        	params.put("birthday", birthday);
        }
        if(area!=null){
        	params.put("area", area);
        }
        if(sign!=null){
        	params.put("sign", sign);
        }
        if(nick!=null){
        	params.put("nick", nick);
        }
        if(sex!=null){
        	params.put("sex", sex);
        }
        if(city!=null){
            params.put("city", city);
        }
        if(blood!=null){
            params.put("blood", blood);
        }
        if(constellation!=null){
            params.put("constellation", constellation);
        }
        if(height!=null){
            params.put("height", height);
        }
        if(weight!=null){
            params.put("weight", weight);
        }
        if(bwh!=null){
            params.put("bwh", bwh);
        }
        if(facebook!=null){
            params.put("facebook", facebook);
        }
        if(photo!=null){
            params.put("photo", photo);
        }
//      params.put("city", city);
//      params.put("privince", privince);
//      params.put("intro", intro);
//      params.put("passport", passport); 
//      params.put("property", property);
        
		String str =userHttpDao.httpRequestGet("user/update.php", params);
		log.info("user/update.php========back========"+str);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		int uid=0;
		if(code==200){
			uid =returnJson.getIntValue("uid");
		}
		if(code == 412){
			uid=-3;
		}
		return uid;
	}
	
	//修改邮箱
	public int updateUEmail(int _uid ,String account, String passport  ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid);
        params.put("passport", passport); 
        
		String str =userHttpDao.httpRequestGet("user/update.php", params);
		log.info("user/update.php========back======="+str);
		
		params.put("account", account);
	    params.put("is_valid_mail", 0); 
	    params.put("passport", passport); 
		String str_addit =userHttpDao.httpRequestGet("user/update_addit_info.php", params);
		log.info("user/update_addit_info.php=======back======"+str_addit);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		JSONObject returnJson1 = JSONObject.parseObject(str_addit);
		int code1 =returnJson1.getIntValue("rescode");
		
		int uid=0;
		if(code==200 || code1==200){
			uid =returnJson.getIntValue("uid");
		}
		return uid;
	}
	
	//修改附加信息邮箱
	public int updateUAdditEmail(String account, String passport  ) {
		
		Map<String, Object> params = new HashMap<String, Object>();

		params.put("account", account);
	    params.put("is_valid_mail", 0); 
	    params.put("passport", passport); 
		String str =userHttpDao.httpRequestGet("user/update_addit_info.php", params);
		log.info("user/update_addit_info.php=======back======"+str);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");

		int uid=0;
		if(code==200 ){
			uid =1;
		}
		return uid;
	}
	
	//获取用户附加信息
	public Map<String, Object> getUInfoAdditByUid(int _uid,String _account ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        params.put("account", _account);
        
		String str =userHttpDao.httpRequestGet("user/get_uinfo_addit.php", params);
		log.info("user/get_uinfo_addit.php=======back======="+str);

		if(str==null){
			return null;//连接超时
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			map.put("account",  returnJson.getString("account"));
//			uid= &account= &safe_ques1= &safe_answ1= &safe_ques2= &safe_answ2= &safe_ques3= &safe_answ3= &error_times= &last_err_time= &is_valid_mail= &passport= &phone= 
			JSONObject json = returnJson.getJSONObject("info");
			map.put("uid", json.getString("uid"));
			//map.put("account",  json.getString("account"));
			map.put("safe_ques1",  json.getString("safe_ques1"));
			map.put("safe_answ1",  json.getString("safe_answ1"));
			map.put("safe_ques2",  json.getString("safe_ques2"));
			map.put("safe_answ2",  json.getString("safe_answ2"));
			map.put("safe_ques3",  json.getString("safe_ques3"));
			map.put("safe_answ3",  json.getString("safe_answ3"));
			map.put("error_times",  json.getString("error_times"));
			map.put("last_err_time",  json.getString("last_err_time"));
			map.put("is_valid_mail",  json.getString("is_valid_mail"));
			map.put("passport", json.getString("passport"));
			map.put("phone",  json.getString("phone"));
		}
		return map;
	}
	
	//更新邮箱验证信息
	public int updateUAdditInfo(int _uid ,String account, String passport, int isValidMail) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid);
	    params.put("is_valid_mail", isValidMail); 
		params.put("account", account);
		params.put("passport", passport);
		
		String str=userHttpDao.httpRequestGet("user/update_addit_info.php", params);
		log.info("user/update_addit_info.php=======back======"+str);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		if(code==200){
			return 1;
		}
		return 0;
	}
	
	//是否Vip
	public Map<String, Object> isVip(int _uid ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        
		String str =userHttpDao.httpRequestGet("user/is_vip.php", params);
		log.info("user/is_vip.php========back======="+str);
		
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			map.put("uid", returnJson.getString("uid"));
			map.put("level",  returnJson.getString("level"));
			map.put("start_time",  returnJson.getString("start_time"));
			map.put("end_time",  DateUtil.TimeStamp2Date(returnJson.getString("end_time")) );
		}
		return map;
	}
	
	/**
	 * 获取 vip 截止时间
	 * @param uid
	 * @return
	 * @throws ParseException 
	 */
	public Date getVipEndTime(int uid) throws ParseException{
		Map<String, Object> vip_info = getVipInfo(uid);
		Date endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(String.valueOf(vip_info.get("end_time")));
		Date nowDate = new Date();
		if(endDate.getTime() > nowDate.getTime())
			return endDate;
		else
			return nowDate;
	}
	//获取VIP用户信息
	public Map<String, Object> getVipInfo(int _uid ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        
		String str =userHttpDao.httpRequestGet("user/check_vip_info.php", params);
		log.info("user/check_vip_info.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			//"status":"0/1/2","level":"1","start_time":"0","end_time":"0","point":"","point_level":"","point_grow_perday":"","rank":"","rank_rate":"","uid":""
			map.put("uid", returnJson.getString("uid"));
			map.put("status",  returnJson.getString("status"));
			map.put("level",  returnJson.getString("level"));
			map.put("start_time",  returnJson.getString("start_time"));
			map.put("end_time",  DateUtil.TimeStamp2Date(returnJson.getString("end_time")) );
			map.put("point",  returnJson.getString("point"));
			map.put("point_level",  returnJson.getString("point_level"));
			map.put("point_grow_perday",  returnJson.getString("point_grow_perday"));
			map.put("rank",  returnJson.getString("rank"));
			map.put("rank_rate",  returnJson.getString("rank_rate"));
		}
		return map;
	}
	
	//购买vip
	public int buyVip(int _uid,int days,int level ) {
        
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid+"");
        params.put("level", level+"");
        params.put("days", days+"");
        try {
			params.put("description", URLEncoder.encode("Buy VIP", "utf-8"));
		} catch (UnsupportedEncodingException e) {
			params.put("description", "Buy-VIP");
		}
        
        String str =userHttpDao.httpRequestGet("user/set_vip.php", params);
        log.info("user/set_vip.php========back======="+str);

        JSONObject returnJson = JSONObject.parseObject(str);
        int code =returnJson.getIntValue("rescode");
        return code;
    }
	
	//获取用户等级
	public int getUserLevel(int jifen ) {
		int rank[] = {-1,0,1,4,13,30,57,97,152,224,317,431,571,737,933,1161,1424,1723,2061,2441,2864,3334,3853,4422,5046,5725,6463,7261,8122,9049,10044,11109,12247,13460,14750,16121,17573,19111,20735,22449,24255,26156,28153,30249,32447,34748,37156,39673,42301,45042,47899,50875,53971,57190,60535,64008,67611,71347,75218,79226,83375,87665};
		int max_rank = 0;
		int id= 0;
		
		for( int lev : rank){
//			log.info("-----------------"+lev);
			if(jifen == lev){
				max_rank=id;
				break;
			}else if(jifen<lev){
				max_rank=id-1;
				break;
			}
			max_rank=id;
			id++;
		}
		
        return max_rank;
    }
	
	//检查用户账号是否存在
	public int checkExist(String account) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("account", account);
    	int uid=0;
        try{
			String str =userHttpDao.httpRequestGet("user/check_exist.php", params);
			log.info("================back==============="+str);
			
			JSONObject returnJson = JSONObject.parseObject(str);
			int code =returnJson.getIntValue("rescode");
			if(code==200){
				uid=returnJson.getIntValue("uid");
			}
        }catch(Exception e){
        	uid=0;
        }
		
		return uid;
	}
	
	//注册
	public int register(String account, String username,String _pwd , String email) {
		//密码需要加密算法
//		String pwd = SecurityUtil.md5(_pwd);
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("account", account);
        params.put("passwd", _pwd);
        
        params.put("nick", username);
        params.put("passport", email);
        
		String str =userHttpDao.httpRequestGet("user/register.php", params);
		log.info("user/register.php========back========="+str);
		if(str==null){
			return -1;
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		int uid=0;
		if(code==200){
			uid=returnJson.getIntValue("uid");
		}
		
		return uid;
	}

	//修改密码
	public int updatePwd(int _uid ,String passwd  ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid);
        params.put("passwd", passwd); 
        params.put("style", "text"); 
        
		String str =userHttpDao.httpRequestGet("user/update_passwd.php", params);
		log.info("user/update_passwd.php========back======="+str);
		if(str==null){
			return -1;
		}
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		int uid=0;
		if(code==200 ){
			uid =returnJson.getIntValue("uid");
		}
		return uid;
	}
	
	//获取用户管理频道列表
	public Map<String, Object> getGroupsByUid(int _uid ) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid);
    	
		String str =userHttpDao.httpRequestGet("session/asmanager.php", params);
		log.info("session/asmanager.php=======back========"+str);
			
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
			
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			if(returnJson.get("sids").getClass().equals(JSONObject.class)){
				map.put("sids", returnJson.getJSONObject("sids"));
			}else{
				map.put("sids", "");
			}
			
		}
		return map;
	}
	
	//获取单频道详细信息 
	public Map<String, Object> getGroupInfo(int _sid ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("sid", _sid+"");
        
		String str =userHttpDao.httpRequestGet("session/info.php", params);
		log.info("session/info.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			//{"rescode":200,"sid":"100026","apply_ujifen":"0","apply_usjifen":"0","apply_info":"","apply_auto":"0",
			//"change_quality":"0","sorder":"1;48;50;",
			//"name":"LeagueOfLegendsCommunity","owner":"115","typeStr":"","type":"0","intro":"","jifen":13110,"area":"0",
			//"province":"0","city":"0","max":"10000","hall":"0","reception":"51","bpub":"1","isp":"2","slogan":"League of Legends SG.MY Server",
			//"create_time":"2014-05-26 14:07:58","fondcount":"104","mlist_vlimit":"1","search_limit":"0","alias":0}
			map.put("sid", returnJson.getString("sid"));
			map.put("owner",  returnJson.getString("owner"));
			map.put("typeStr",  returnJson.getString("typeStr"));
			map.put("type",  returnJson.getString("type"));
			map.put("jifen",  returnJson.getString("jifen"));
			map.put("name",  returnJson.getString("name"));
			map.put("intro",  returnJson.getString("intro"));
			map.put("max",  returnJson.getString("max"));
			map.put("alias",  returnJson.getString("alias"));
			map.put("create_time",  returnJson.getString("create_time"));
		}
		return map;
	}
	
	//获取多频道详细信息 
	public Map<String, Object> getGroupsInfo(String _sids ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("sids", _sids);
        
		String str =userHttpDao.httpRequestGet("session/infos.php", params);
		log.info("session/infos.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		Map<String, Object> map =null;
		if(code==200){
			map = new HashMap<String, Object>();
			if(returnJson.get("infos").getClass().equals(JSONObject.class)){
				map.put("infos", returnJson.getJSONObject("infos"));
			}else{
				
				map.put("infos", returnJson.getJSONArray("infos"));
			}
		}
		return map;
	}

	//检查频道名称是否存在
	public int checkGreoupName(String name ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("name", name);
        
		String str =userHttpDao.httpRequestGet("session/check_name.php?", params);
		log.info("session/check_name.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		int uid=0;
		if(code==200){
			uid = returnJson.getIntValue("sid");
		}
		return uid;
	}
	
	//创建频道
	public int creatGroup(String name ,int _owner,String slogan ,int _type) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("name", name);
        params.put("owner", _owner+"");
        params.put("slogan", slogan);
        params.put("type", _type+"");
        params.put("isp", 0);
        params.put("area", 0);
        params.put("province", 0);
        params.put("city", 0);
        params.put("bpub", 1);
        
		String str =userHttpDao.httpRequestGet("session/create.php", params);
		log.info("session/create.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		int uid=0;
		if(code==200){
			uid = returnJson.getIntValue("sid");
		}
		return uid;
	}
	
	//更新游戏频道标签
	public int updateGroup(int _sid,String typeStr ) {
		
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("sid", _sid+"");
        params.put("typeStr", typeStr);
        
		String str =userHttpDao.httpRequestGet("session/update.php?", params);
		log.info("session/update.php========back======="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		int uid=0;
		if(code==200){
			uid = returnJson.getIntValue("sid");
		}
		return uid;
	}

	//获取守护列表
	public String getGuardSingerList(int _uid ) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("uid", _uid);
    	
		String str =userHttpDao.httpRequestGet("user/get_guard_singer_list.php", params);
		log.info("user/get_guard_singer_list.php=======back========"+str);
			
		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("rescode");
		
		if(code==200){
			String infos = returnJson.getString("infos");
			JSONArray array = JSONArray.parseArray(infos);
			
			return array.toJSONString();
		}
		return "";
	}
}
