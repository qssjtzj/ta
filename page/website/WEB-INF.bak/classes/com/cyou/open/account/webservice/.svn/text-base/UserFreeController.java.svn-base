package com.cyou.open.account.webservice;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.common.custom.CookiesManager;
import com.cyou.common.custom.ErrorCode;
import com.cyou.common.custom.InitialServlet;
import com.cyou.common.utils.LogUtils;
import com.cyou.common.utils.PropertiesLoader;
import com.cyou.common.utils.RequestUtil;
import com.cyou.common.utils.SecurityUtil;
import com.cyou.open.account.dao.UserHttpDao;
import com.cyou.open.account.service.UserHttpService;
import com.cyou.open.account.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 开放接口，不需要登陆
 * @author hexihong
 *
 */
@Controller
@RequestMapping(value = "/account/member")
public class UserFreeController {
	
	@Autowired
	private UserHttpService userHttpService;	

	@Autowired
	private UserService userService;
	
	/**
	 * 登陆
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object login(HttpSession session,
			HttpServletResponse response,HttpServletRequest request,
			@RequestParam(value = "account") String account ,
			@RequestParam(value = "pwd") String pwd,
			@RequestParam(value = "token") String token,
			@RequestParam(value = "remember") int remember)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		account = account.trim()+UserHttpDao.BASE_SUFFIX;
		pwd=pwd.trim();
		token = token.trim().replace("\"", "");
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(account==null || "".equals(account) || pwd==null || "".equals(pwd) ){
			retMap.put("error_code", ErrorCode.PARAM_NOT_EXIST);//参数不存在
			
		}else{
			int uid= userHttpService.getUidByAccount(account);
			if( uid==0){
				retMap.put("error_code", ErrorCode.USER_NOT_EXIST);//用户不存在
				
			}else{
				int _uid = uid ;
				
				if(pwd.equals("******") && token!=null && !"".equals(token)){
				 	
				 	String cookiespwd = SecurityUtil.decode64(SecurityUtil.decode64(token));
					String temp[] =cookiespwd .split("§");
					if(temp.length>2){
						_uid = Integer.parseInt(temp[0]);
						pwd = temp[1];
					}
				}
					
				if(_uid == uid){
					
				 	uid=userHttpService.checkPassWord(uid, pwd );
				 	if(uid!=0){
				 		Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
				 		
				 		retMap.put("user_success", true);
						retMap.put("uid", user.get("uid"));
						String username = user.get("nick").toString();
						retMap.put("username", username);
						
						session.setAttribute("OPEN_USER", user);
						String c_name=URLEncoder.encode(user.get("nick").toString(), "utf-8");
						CookiesManager.addCookie(response, "_open_sname",c_name );
						CookiesManager.addCookie(response, "_open_uuid", ""+uid);
						
						Map<String, Object>  vip = userHttpService.isVip(uid);
						if(vip!=null){
							CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
						}else{
							CookiesManager.addCookie(response, "_open_vip",null );
						}
						
				 		if(remember==1 ){
							String cookiepwd = SecurityUtil.encode64(SecurityUtil.encode64(  uid + "§" + pwd + "§" + System.nanoTime()));
							CookiesManager.addCookie(response, "_open_pwd", cookiepwd ,2*24*60*60);
				 		
					 		String cookiet = SecurityUtil.encode64(SecurityUtil.encode64(  uid + "§" + pwd + "§" + System.nanoTime()));
					 		CookiesManager.addCookie(response, "_open_t", cookiet ,2*24*60*60);
				 		}
						//登录成功 统计日志
						String ip = RequestUtil.getRequestIp(request);
						LogUtils.USEROP_LOG.info("login " + uid + " " + ip +" 1");//login 1 uid ip
						
					}else{
						CookiesManager.addCookie(response, "_open_pwd", null);
						retMap.put("error_code", -3);//密码错误
					}
			 	}else{
			 		CookiesManager.addCookie(response, "_open_pwd", null);
			 		retMap.put("error_code", -4);//
			 	}
			}
			 
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * FB登录|注册
	 */
	@RequestMapping(value = "/loginfb", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object loginFB(HttpSession session,
			HttpServletResponse response,HttpServletRequest request,
			@RequestParam(value = "fbid") String fbid,
			@RequestParam(value = "token") String token,
			@RequestParam(value = "username") String username,
			@RequestParam(value = "email") String email)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(fbid==null || "".equals(fbid) || token==null || "".equals(token) ){
			retMap.put("error_code", ErrorCode.PARAM_NOT_EXIST);//参数错误
		}else{
			int _uid = userHttpService.getUidByFB(fbid);
			//已绑定登录
			if(_uid>0){
				Map<String, Object>  user = userHttpService.getUInfoByUid(_uid);
			 	
				if(user!=null){
					retMap.put("user_success", true);
					retMap.put("uid", user.get("uid"));
					username = user.get("nick").toString();
					retMap.put("username", username);
				
		 			session.setAttribute("OPEN_USER", user);
//					String cookievalue = SecurityUtil.encode64(SecurityUtil.encode64(  user.get("uid").toString() + "搂"+user.get("nick").toString() + "搂" + System.nanoTime()));
//					CookiesManager.addCookie(response, "_open_ssid", cookievalue);
		 			String c_name=URLEncoder.encode(user.get("nick").toString(), "utf-8");
					CookiesManager.addCookie(response, "_open_sname",c_name );
					CookiesManager.addCookie(response, "_open_uuid", user.get("uid").toString());
					
					Map<String, Object>  vip = userHttpService.isVip(_uid);
					if(vip!=null){
						CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
					}else{
						CookiesManager.addCookie(response, "_open_vip",null );
					}
					//fb登录
					String ip = RequestUtil.getRequestIp(request);
					LogUtils.USEROP_LOG.info("login " + _uid + " " + ip +" 2");//login uid ip 2
					
		 		}else{
		 			retMap.put("error_code", ErrorCode.USER_NOT_EXIST);
		 		}
		 	
			//未绑定 注册并绑定
			}else if(_uid==0){
				String account = UserHttpDao.FB_ACCOUNT_TAG+fbid+UserHttpDao.BASE_SUFFIX;
				username=username;//+"_"+fbid;
				//System.out.println("==========="+username);
				/*if(username.length()>16){
					username = username.substring(0,16);
				}*/
				int uid = userHttpService.register(account, username, "1234", email);
				
				if(uid==0){
					retMap.put("user_success", false);
					retMap.put("error_code", 3);//注册失败
				}else{
					String facebook = "https://www.facebook.com/profile.php?id=" + fbid;
					userHttpService.updateUInfo(uid, "19000101", facebook);
					userHttpService.updateUAdditEmail( account, email);
					
					retMap.put("uid", uid);
					retMap.put("user_success", true);
					username = username;
					retMap.put("username", username);
					
					userHttpService.bindFB(uid, fbid, token);
					Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
					
					session.setAttribute("OPEN_USER", user);
					String c_name=URLEncoder.encode(retMap.get("username").toString(), "utf-8");
					CookiesManager.addCookie(response, "_open_sname",c_name );
					CookiesManager.addCookie(response, "_open_uuid", user.get("uid").toString());
					
					Map<String, Object>  vip = userHttpService.isVip(uid);
					if(vip!=null){
						CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
					}else{
						CookiesManager.addCookie(response, "_open_vip",null );
					}
					
					//fb注册
					String ip = RequestUtil.getRequestIp(request);
					LogUtils.USEROP_LOG.info("register " + uid + " " + ip  + " 2");//rigister uid ip 2
					
					//fb绑定
					LogUtils.USEROP_LOG.info("bandfb " + uid + " " + ip + " " + fbid );//bind 2 uid ip
				}
			}
		}
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 登录认证(uid ,cookies)
	 */
	@RequestMapping(value = "/ssologin", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	@Deprecated
	public Object ssoLogin(HttpSession session,HttpServletResponse response,HttpServletRequest request,
			@RequestParam(value = "uid") int uid ,
			@RequestParam(value = "cookies") String cookies )
			throws JsonProcessingException, UnsupportedEncodingException {
		
		cookies = cookies.trim().replace("\"", "");

		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(uid==0 || cookies ==null || "".equals(cookies)){
			retMap.put("error_code", -1);//参数错误
			
		}else{
			String cookiesValue = SecurityUtil.decode64(SecurityUtil.decode64(cookies));
			String temp[] =cookiesValue .split("§");
			if(temp.length>=3){
				int _uid=Integer.parseInt(temp[0]);
				String username= temp[1];
				System.out.println(uid+" ============="+"uid = "+temp[0]+" , nick = "+temp[1]+" , time="+temp[2]);
				
				String ssid = CookiesManager.getCookie(request, "_open_ssid");
				if(uid==_uid && cookies.equals(ssid)){
					Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
					
					retMap.put("uid", user.get("uid"));
					retMap.put("user_success", true);
					retMap.put("username", user.get("nick"));
					
					session.setAttribute("OPEN_USER", user);
					String c_name=URLEncoder.encode(user.get("nick").toString(), "utf-8");
					CookiesManager.addCookie(response, "_open_sname",c_name );
					CookiesManager.addCookie(response, "_open_uuid", ""+uid);
					
					Map<String, Object>  vip = userHttpService.isVip(uid);
					if(vip!=null){
						CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
					}else{
						CookiesManager.addCookie(response, "_open_vip",null );
					}
					
				}else{
					retMap.put("error_code", -2);
				}
			}else{
				retMap.put("error_code", -3);
			}
		}
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 注册
	 * @param session
	 * @param account
	 * @param pwd
	 * @param rtype
	 * @return
	 * @throws JsonProcessingException
	 * @throws UnsupportedEncodingException 
	 */
	@RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object register(HttpSession session,HttpServletResponse response,HttpServletRequest request,
			@RequestParam(value = "account") String account,
			@RequestParam(value = "username") String username,
			@RequestParam(value = "pwd") String pwd,
			@RequestParam(value = "email") String email,
			@RequestParam(value = "seccode") String secCode)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		account = account.trim()+UserHttpDao.BASE_SUFFIX;
		pwd=pwd.trim();
		email=email.trim();
		username=username.trim();
		secCode = secCode.trim().toUpperCase();
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		
		if( secCode==null || "".equals(secCode)   || session.getAttribute("validateCode") ==null || !secCode.equals(session.getAttribute("validateCode") )){
			retMap.put("user_success", false);
			retMap.put("error_code", -2);
		}else if(pwd==null || "".equals(pwd)  || account==null || "".equals(account)  || username==null || "".equals(username)   || email==null || "".equals(email)  ){
			retMap.put("user_success", false);
			retMap.put("error_code", -1);
			
		}else{
			int um = userHttpService.getUidByAccount(account);
			if(um==0){
				int uid = userHttpService.register(account, username, pwd, email);
							
				if(uid==0 ){
					retMap.put("user_success", false);
					retMap.put("error_code", 3);//娉ㄥ唽澶辫触
				}else{
					userHttpService.updateUInfo(uid, "19000101", null, null, null, null, null, null, null, null, null, null, null, null);
					int uid1= userHttpService.updateUAdditEmail( account, email);
					updateDefaultImg(uid);
								
					retMap.put("uid", uid);
					retMap.put("user_success", true);
					retMap.put("username", username);
								
					Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
					session.setAttribute("OPEN_USER", user);
								
					String c_name=URLEncoder.encode(retMap.get("username").toString(), "utf-8");
					CookiesManager.addCookie(response, "_open_sname",c_name );
					CookiesManager.addCookie(response, "_open_uuid", ""+uid);
								
					Map<String, Object>  vip = userHttpService.isVip(uid);
					if(vip!=null){
						CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
					}else{
						CookiesManager.addCookie(response, "_open_vip",null );
					}
					
					//注册
					String ip = RequestUtil.getRequestIp(request);
					LogUtils.USEROP_LOG.info("register " + uid + " " + ip  + " 1");//rigister uid ip 1
				}
			}else{
				retMap.put("user_success", false);
				retMap.put("error_code", 2);
			}
			
		}
		
		session.setAttribute("validateCode",""); 
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}

	/**
	 * 检查账号是否存在
	 * @param session
	 * @return
	 * @throws JsonProcessingException
	 * @throws UnsupportedEncodingException 
	 */
	@RequestMapping(value = "/checkexist", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object checkExist(HttpServletResponse response,
			@RequestParam(value = "account") String account)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		account = account.trim()+UserHttpDao.BASE_SUFFIX;
		int uid = userHttpService.checkExist(account);
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		if(uid!=0){
			retMap.put("user_success", true);
		}else{
			retMap.put("user_success", false);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 获取绑定fb账号
	 */
	@RequestMapping(value = "/getAccountByFB", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getAccountByFB(HttpSession session, 
			HttpServletResponse response,
			@RequestParam(value = "fbid") String fbid)
			throws JsonProcessingException, UnsupportedEncodingException {
		fbid=fbid.trim();
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		 if(fbid==null || "".equals(fbid) ){
				retMap.put("user_success", false);
				retMap.put("error_code", -1);//鍙傛暟閿欒
		
		 }else {
			 int _uid = userHttpService.getUidByFB(fbid);
			 Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
			 int uid= Integer.parseInt(user.get("uid").toString());
			 if(_uid>0 && uid==_uid){
				 Map<String, Object> info =  userHttpService.getUInfoByUid(_uid);
				 if(info!=null){
					 	retMap.put("user_success", true);
					 	retMap.put("account", info.get("account"));
					 	retMap.put("uid", _uid);
					 	
//					 	String cookievalue = SecurityUtil.encode64(SecurityUtil.encode64(  info.get("uid").toString() + "搂"+info.get("nick").toString() + "搂" + System.nanoTime()));
//						CookiesManager.addCookie(response, "_open_ssid", cookievalue);
						
						ObjectMapper mapper = new ObjectMapper();
						String renderStr =  mapper.writeValueAsString(retMap) ;
						return new ResponseEntity<String>(renderStr, HttpStatus.OK);
						
				 }else{
					 retMap.put("user_success", false);
					 retMap.put("error_code", -2);//鏈粦瀹�
				 }
				
			 }else{
				 retMap.put("user_success", false);
				 retMap.put("error_code", -2);//鏈粦瀹�
			 }
			 
		 }
			
		 	ObjectMapper mapper = new ObjectMapper();
			String renderStr =  mapper.writeValueAsString(retMap) ;
			return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 检查是否绑定fb
	 */
	@RequestMapping(value = "/checkBind", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object checkBind(HttpSession session, @RequestParam(value = "uid") int uid)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(uid>0){
			Map<String, Object> info =  userHttpService.checkBind(uid);
			if(info!=null){
				retMap.put("user_success", true);
				
			}else{
				retMap.put("error_code", -2);
			}
		}else{
			retMap.put("error_code", -1);
		}
			 
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * FB注册
	 */
	@RequestMapping(value = "/registerfb", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	@Deprecated
	public Object registerFB(HttpSession session,HttpServletResponse response, HttpServletRequest request,
			@RequestParam(value = "account") String account,
			@RequestParam(value = "username") String username,
			@RequestParam(value = "pwd") String pwd,
			@RequestParam(value = "email") String email,
			@RequestParam(value = "bind_fb") int bindFb,
			@RequestParam(value = "fbid") String fbid,
			@RequestParam(value = "token") String token)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		account = account.trim()+UserHttpDao.BASE_SUFFIX;
		pwd=pwd.trim();
		email=email.trim();
		username=username.trim();

		Map<String, Object> retMap = new HashMap<String, Object>();
		//鍙傛暟楠岃瘉
		if( account==null || "".equals(account)  || username==null || "".equals(username)   || email==null || "".equals(email)  || pwd==null || "".equals(pwd) ){
			retMap.put("user_success", false);
			retMap.put("error_code", -1);//
		}else{
			//
			int um = userHttpService.getUidByAccount(account);
			
			if(um==0){
					int uid = userHttpService.register(account, username, pwd, email);
					
					if(uid==0 ||uid==-1){
						retMap.put("user_success", false);
						retMap.put("error_code", 3);// 
					}else{
						
						userHttpService.updateUInfo(uid, "19000101", null, null, null, null, null, null, null, null, null, null, null, null);
						int uid1= userHttpService.updateUAdditEmail( account, email);
						updateDefaultImg(uid);
						
						retMap.put("uid", uid);
						retMap.put("user_success", true);
						username = username;
						retMap.put("username", username);
						
						//缁戝畾FB
						if( bindFb==1 && fbid!=null && !"".equals(fbid) && token!=null && !"".equals(token)){
							//if(userHttpService.getUidByFB(fbid)>0){//FB宸茶缁戝畾
								userHttpService.bindFB(uid, fbid, token);
							//}else{
							//	retMap.put("error_code", -2);//宸茶缁戝畾
							//}
						}
						
						//鐧婚檰
						Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
						
						session.setAttribute("OPEN_USER", user);
						String c_name=URLEncoder.encode(retMap.get("username").toString(), "utf-8");
						CookiesManager.addCookie(response, "_open_sname",c_name );
						CookiesManager.addCookie(response, "_open_uuid", ""+uid);
						
						Map<String, Object>  vip = userHttpService.isVip(uid);
						if(vip!=null){
							CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
						}else{
							CookiesManager.addCookie(response, "_open_vip",null );
						}
						
						//fb注册
						String ip = RequestUtil.getRequestIp(request);
						LogUtils.USEROP_LOG.info("register " + uid + " " + ip  + " 2");//rigister uid ip 2
					}
			}else{
				retMap.put("user_success", false);
				retMap.put("error_code", 2);//宸茶娉ㄥ唽
			}
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 更新用户默认头绪
	 * @param uid
	 */
	public static void  updateDefaultImg( int uid){
		
		Properties pro = PropertiesLoader.loadProperties("resource.properties");
		String path = pro.getProperty("ImagePath");
		
		String name=uid + ".png";
		String icon_path = InitialServlet.WEBCONTENT_REALPATH+"/imgs/icon.png";

		try {
			UpdateController.readUsingImageReader(icon_path, path+"/"+name, 0, 200, 0, 200);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * FB绑定
	 */
	@RequestMapping(value = "/bindfb", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object bindFB(HttpSession session,HttpServletRequest request,
			@RequestParam(value = "fbid") String fbid,
			@RequestParam(value = "token") String token)
			throws JsonProcessingException, UnsupportedEncodingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		int uid = Integer.parseInt(user.get("uid").toString());
		
		
		//绑定FB
		if(fbid!=null && !"".equals(fbid) && token!=null && !"".equals(token)){
			if(userHttpService.getUidByFB(fbid)>0){//FB已绑定
				retMap.put("error_code", -2);//重复绑定失败
			}else{
				userHttpService.bindFB(uid, fbid, token);
				retMap.put("user_success", true);
				
                String facebook = "https://www.facebook.com/profile.php?id=" + fbid;
                int um = userHttpService.updateUInfo(uid, facebook);

                //fb绑定
                String ip = RequestUtil.getRequestIp(request);
				LogUtils.USEROP_LOG.info("bandfb " + uid + " " + ip + " " + fbid );//rigister 2 uid ip
			}
			
		}else{
			retMap.put("error_code", -1);//鍙傛暟閿欒
		}
			
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 验证码
	 */
	@RequestMapping(value = "/validcode", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object validCode(HttpSession session,
			@RequestParam(value = "seccode") String secCode)
			throws JsonProcessingException {

		secCode = secCode.trim().toUpperCase();
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		//鍙傛暟楠岃瘉 璐﹀彿銆佸瘑鐮佸悎娉曢獙璇�
		if( secCode==null || "".equals(secCode)   || session.getAttribute("validateCode") ==null || !secCode.equals(session.getAttribute("validateCode") )){
			retMap.put("user_success", false);
			retMap.put("error_code", -1);//楠岃瘉鐮侀敊璇�
		}else{
			retMap.put("user_success", true);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 激活邮箱
	 * @param session
	 * @param callbackName
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value = "/activate", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object activate(HttpSession session,
			@RequestParam(value = "uid") int uid,
			@RequestParam(value = "code") String code)
			throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(code==null || "".equals(code.trim()) || code.length()!=10){
			retMap.put("user_success", false);
			retMap.put("error_code", -1);//鍙傛暟涓嶆纭�
			
		}else{
			Map<String, Object> uinfo = userHttpService.getUInfoByUid(uid);
			
			if(uinfo!=null){
				String account = uinfo.get("account").toString();
				String passport= uinfo.get("passport").toString();
				Map<String, Object>   addit_info = userHttpService.getUInfoAdditByUid(uid, account );
				
				if( addit_info==null || addit_info.get("is_valid_mail").toString().equals("0")){
					
					int result = userService.userVerify(uid,code);
					if(result==1){
						int um = userHttpService.updateUAdditInfo(uid, account,passport, 1);
						
						if(um!=0){
							retMap.put("user_success", true);
							
							retMap.put("user_name",uinfo.get("account"));
							String email =passport;
							email =email.substring(0,2)+"..." + email.substring(email.indexOf("@")-1,email.length());
							retMap.put("user_mail", email);
							
							ObjectMapper mapper = new ObjectMapper();
							String renderStr =  mapper.writeValueAsString(retMap) ;
							return new ResponseEntity<String>(renderStr, HttpStatus.OK);
						}
						
					}
				}
				
			}else{
				retMap.put("user_success", false);
				retMap.put("error_code", -2);//鐢ㄦ埛涓嶅瓨鍦�
			}
			
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}

	/**
	 * 获取邮件
	 */
	@RequestMapping(value = "/gatemail", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getEmail(HttpSession session,
			@RequestParam(value = "account") String account,
			@RequestParam(value = "seccode") String secCode)
			throws JsonProcessingException {
		
		account = account.trim()+UserHttpDao.BASE_SUFFIX;
		secCode = secCode.trim().toUpperCase();
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if (account == null || "".equals(account.trim()) ) {
			retMap.put("error_code", -1);//鍙傛暟涓嶆纭畇ession.getAttribute("validateCode")
		}else if( secCode==null || "".equals(secCode)   || session.getAttribute("validateCode") ==null || !secCode.equals(session.getAttribute("validateCode") )){
			retMap.put("error_code", -2);//楠岃瘉鐮侀敊璇�
		}else{
			
			int uid= userHttpService.getUidByAccount(account);
		 	if( uid<=0){
				retMap.put("error_code", -3);//璐﹀彿閿欒
		 	}else{
		 		Map<String, Object> info = userHttpService.getUInfoByUid(uid);
		 		if(info!=null){
		 			retMap.put("user_success", true);
					String email =info.get("passport").toString();
					email =email.substring(0,2)+"..." + email.substring(email.indexOf("@")-1,email.length());//q***@163.com
					retMap.put("user_email", email);
					retMap.put("account", account);
		 		}else{
					retMap.put("user_success", false);
					retMap.put("error_code", -4);//鐢ㄦ埛涓嶅瓨鍦�
				}
		 	}
		}
		session.setAttribute("validateCode",""); 
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 获取找回密码邮件
	 */
	@RequestMapping(value = "/getpwdcode", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getPwdCode(HttpSession session, HttpServletRequest request,
			@RequestParam(value = "account") String account)
			throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		account=account.trim();
		
		if (account == null || "".equals(account) ) {
				retMap.put("user_success", false);
				retMap.put("error_code", -1);//鍙傛暟閿欒
		}else{
			int uid= userHttpService.getUidByAccount(account);
		 	if( uid==0){
		 		retMap.put("user_success", false);
				retMap.put("error_code", -2);//璐﹀彿閿欒
		 	}else{
		 		Map<String, Object> info = userHttpService.getUInfoByUid(uid);
		 		if(info!=null){
		 			String email =info.get("passport").toString();
		 			String username =info.get("nick").toString();
		 			
		 			String path = request.getContextPath();
//					String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
		 			String basePath = request.getScheme()+"://"+request.getServerName()+path+"";
		 			
					System.out.println("......"+basePath);
					int result = userService.sendFindPwdMail(uid, account, email, username, basePath);
					
		 			retMap.put("user_success", true);
					email =email.substring(0,2)+"..." + email.substring(email.indexOf("@")-1,email.length());//q***@163.com
					retMap.put("user_email", email);
		 		}else{
					retMap.put("user_success", false);
					retMap.put("error_code", -4);//鐢ㄦ埛涓嶅瓨鍦�
				}
		 	}
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}

	/**
	 * 重置密码
	 */
	@RequestMapping(value = "/resetpwd", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object resetPwd(HttpSession session,
			@RequestParam(value = "uid") int uid,
			@RequestParam(value = "account") String account,
			@RequestParam(value = "pwd") String pwd,
			@RequestParam(value = "code") String code)
			throws JsonProcessingException {
		code = code.trim();
		pwd = pwd.trim();
		account = account.trim();
		String m_account = account.replace(UserHttpDao.BASE_SUFFIX, "");
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(code==null || "".equals(code) || pwd==null || "".equals(pwd) || account==null || "".equals(account)){
			retMap.put("error_code", -1);//鍙傛暟涓嶆纭�
			
		}else if(pwd.length()<5 || pwd.length()>20 ||pwd.indexOf(m_account)>-1){
			retMap.put("error_code", -2);//瀵嗙爜鏍煎紡涓嶆纭�
			
		}else{
			
			Map<String, Object>   uinfo = userHttpService.getUInfoByUid(uid);
			//楠岃瘉鍘熷瘑鐮�
			int m_uid=userHttpService.checkPassWord(uid, pwd );
			if(m_uid<=0){
				//
				int result = userService.resetPwdEmail(uid, code);
				if(result==1 && account.equals(uinfo.get("account").toString())){
					
					int um = userHttpService.updatePwd(uid, pwd);
					System.out.println("-------------um="+um);
					if(um>0){
						retMap.put("user_success", true);
						
					}else{
						retMap.put("error_code", -5);//淇敼瀵嗙爜澶辫触
					}
					
				}else{
					retMap.put("error_code", -4);//鏃犳晥鎴栧凡杩囨湡
					
				}
			}else{
				retMap.put("error_code", -3);//涓嶈兘涓庡師瀵嗙爜鐩稿悓
				
			}
			
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 在线验证
	 * 
	 * @param response
	 * @param callbackName
	 * @return
	 * @throws JsonProcessingException
	 * @throws UnsupportedEncodingException
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/online", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object online(HttpSession session,HttpServletResponse response,HttpServletRequest request) throws JsonProcessingException, UnsupportedEncodingException {
		System.out.println("==============online==============");
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		if(user!=null){
			retMap.put("user_success", true);
			int uid = Integer.parseInt( user.get("uid").toString() );
			
			Map<String, Object>  vip = userHttpService.isVip(uid);
			if(vip!=null){
				CookiesManager.addCookie(response, "_open_vip",vip.get("level").toString() );
			}else{
				CookiesManager.addCookie(response, "_open_vip",null );
			}
			
			//fb登录
			String ip = RequestUtil.getRequestIp(request);
			LogUtils.USEROP_LOG.info("online " + uid + " " + ip );//online uid ip vip
			
		}else{
			
			CookiesManager.addCookie(response, "_open_ssid", null);
			CookiesManager.addCookie(response, "_open_sname", null);
			CookiesManager.addCookie(response, "_open_vip",null );
		}
		 
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 关注列表
	 * @param session
	 * @param response
	 * @return
	 * @throws JsonProcessingException
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping(value = "/recordlist", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object recordList(HttpSession session,HttpServletResponse response) throws JsonProcessingException, UnsupportedEncodingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		
		if(user!=null){
			int uid= Integer.parseInt(user.get("uid").toString());
			List list = userService.getRecordList(uid);
//			List list = null;
			retMap.put("list", list);
			retMap.put("user_success", true);
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 获取token
	 * @param session
	 * @return
	 * @throws JsonProcessingException
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/gettoken", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getLoginToken(HttpSession session, HttpServletRequest request, 
			@RequestParam(value = "cid") int cid,
			HttpServletResponse response) throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		if(user!=null){
			int uid = Integer.parseInt( user.get("uid").toString() );
			String account =  user.get("account").toString() ;
			String ip = RequestUtil.getRequestIp(request);
			
			String token = userHttpService.getLoginToken(uid, ip, "link");
			
			if(!"".equals(token)){
				CookiesManager.addCookie(response, "_open_uuid", uid+"");
				CookiesManager.addCookie(response, "_open_saccount", account);
				CookiesManager.addCookie(response, "_open_stoken", token);
				retMap.put("user_success", true);
			}else{
				CookiesManager.addCookie(response, "_open_uuid", "0");
				CookiesManager.addCookie(response, "_open_saccount", null);
				CookiesManager.addCookie(response, "_open_stoken", null);
			}
			
		}
		int pcu = userService.getPCU(cid);
//		System.out.println("================"+cid+"=================="+pcu);
		int additive =0;
		int ratio = 1;
		if(pcu>0){
			additive = pcu;
			ratio = 0;
			
		}else{
			additive = userService.getAdditive();
			ratio = userService.getRatio();
		}
		
//		System.out.println(additive+"=================="+ratio);
		CookiesManager.addCookie(response, "_open_add", additive+"");
		CookiesManager.addCookie(response, "_open_multip", ratio+"");
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap);
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 获取主播信息
	 * sid 频道id
	 */
	@RequestMapping(value = "/getAnchorInfo", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserInfo(HttpSession session,
			@RequestParam(value = "sid") int sid)
			throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		int _sid= sid;
		Map<String, Object> group = userHttpService.getGroupInfo(_sid);
		int uid = Integer.parseInt(group.get("owner").toString());
		
		Map<String, Object>   info = userHttpService.getUInfoByUid(uid);
		
		info.remove("jifen");
		info.remove("silver");
		info.remove("passport");
		info.remove("account");
		info.remove("signup_time");
		
		retMap.put("user_success", true);
		retMap.put("userInfo",info );
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr = mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 获取频道信息
	 * @param session
	 * @param channels
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value = "/getChannelsInfo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getUserInfo(HttpSession session,@RequestParam(value = "channels") String channels)throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		
		List list = userService.getChannelInfoList("0"+channels);
		
		retMap.put("user_success", true);
		retMap.put("list",list );
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr = mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}	
	
	@RequestMapping(value = "/downloadtools", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public void downloadTools(HttpSession session, HttpServletResponse response) throws Exception {

        response.sendRedirect("http://www.showoo.cc/download/RCB_1.5.5.rar");
        
/*	    String fileName = "RCB_1.5.5.rar"; 
	    String path = session.getServletContext().getRealPath("/download/")+"/"+fileName;
        File file = new File(path);
        String filename = file.getName();
        InputStream fis = new BufferedInputStream(new FileInputStream(path));
        byte[] buffer = new byte[fis.available()];
        fis.read(buffer);
        fis.close();
        response.reset();
        response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes()));
        response.addHeader("Content-Length", "" + file.length());
        OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
        response.setContentType("application/octet-stream");
        toClient.write(buffer);
        toClient.flush();
        toClient.close();*/
//        
//        FileInputStream fs = null;
//        try {
//            fs = new FileInputStream(path);
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        }
//        response.setContentType("APPLICATION/OCTET-STREAM");
//        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
//        int b = 0;
//        try {
//            PrintWriter out = response.getWriter();
//            while ((b = fs.read()) != -1) {
//                out.write(b);
//            }
//            fs.close();
//            out.close();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }finally{
//            if(fs!=null){
//                try {
//                    fs.close();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//        }
    }
}
