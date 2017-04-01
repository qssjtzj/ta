package com.cyou.open.account.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.cyou.open.account.dao.UserHttpDao;

@Service
@Transactional(readOnly = true)
public class StUserHttpService {
    private static final Logger log = Logger.getLogger(UserHttpService.class);
	
	@Autowired
	private UserHttpDao userHttpDao;
	
	
	@Value("${stlogin.oauth.url}")
	private String STLOGIN_URL;
	
	//检查ST用户账号是否存在
	public int checkStidExist(String stid) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("stid", stid);
    	int uid=0;
        try{
			String str =userHttpDao.httpRequestGet("user/check_stid_exist.php", params);
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
	public int updateStId(int _uid ,String stid ) {
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put("uid", _uid);
        params.put("stid", stid);
        
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
	public int getUidByStid(String stid) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("stid", stid);
    	int uid=0;
        try{
			String str =userHttpDao.httpRequestGet("user/getuid_by_stid.php", params);
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
	//验证登陆
	public Map<String, Object> checkLogin(String sign) {

		Map<String, Object> params = new HashMap<String, Object>();
        params.put("access_token", sign);
        
        String url = STLOGIN_URL;//"http://loginst.theskynet.co.th/show_time/login/api/oauth/resource.php";
        //http://loginst.theskynet.co.th/show_time/login/api/oauth/resource.php?access_token=7ae98ad9d5b557f3360df8e34e389fcb4424acef
        
		String str = userHttpDao.httpGet(url, params);
		log.info("================back==============="+str);

		JSONObject returnJson = JSONObject.parseObject(str);
		int code =returnJson.getIntValue("code");
		
		System.out.println("---------------------"+code);
		
		Map<String, Object> map =null;
		if(code==1000){
			
				map = new HashMap<String, Object>();
				map.put("user", returnJson.getString("user"));
//				map.put("nick", returnJson.getString("nick"));
//				map.put("passport", returnJson.getString("passport"));
//				map.put("fbid", returnJson.getString("fbid"));

		}
		
		return map;
	}
	
}
