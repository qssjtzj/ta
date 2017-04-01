package com.cyou.open.account.webservice;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

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
import com.cyou.common.utils.LogUtils;
import com.cyou.common.utils.RequestUtil;
import com.cyou.common.utils.SecurityUtil;
import com.cyou.open.account.dao.UserHttpDao;
import com.cyou.open.account.service.StUserHttpService;
import com.cyou.open.account.service.UserHttpService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 开放接口，不需要登陆
 * @author hexihong
 *
 */
@Controller
@RequestMapping(value = "/account/member")
public class StUserController {
	
	@Autowired
	private StUserHttpService stUserHttpService;	

	@Autowired
	private UserHttpService userHttpService;	
//	@Autowired
//	private UserService userService;
	
	/**
	 * 登陆验证
	 */
	@RequestMapping(value = "/stlogin", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object login(HttpSession session,
			HttpServletResponse response,HttpServletRequest request,
			@RequestParam(value = "sign") String sign )
			throws JsonProcessingException, UnsupportedEncodingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		if(sign==null || "".equals(sign) ){
			retMap.put("error_code", ErrorCode.PARAM_NOT_EXIST);//参数不存在
			
		}else{
			
			Map<String, Object> lmap = stUserHttpService.checkLogin(sign);
			if( lmap == null){
				retMap.put("error_code", ErrorCode.USER_NOT_EXIST);//登录失败
				
			}else{
				//gui是否存在  不存在注册  存在登录
				String stid= lmap.get("user").toString();
				int uid = stUserHttpService.checkStidExist(stid);
				//不存在注册  存在登录
				if(uid<=0){
					//String nick = lmap.get("nick").toString();
					//String passport = lmap.get("passport").toString();
					//String fbid = lmap.get("fbid").toString();
					
					//UserHttpDao.ST_ACCOUNT_TAG +
					String account =  stid.trim() + UserHttpDao.BASE_SUFFIX;
					
					uid = userHttpService.register(account, stid.trim(),"1qazxsw2", "");
					
					if(uid==0 ){
						retMap.put("error_code", 3);//注册失败
					}else{
						userHttpService.updateUInfo(uid);
						stUserHttpService.updateStId(uid, stid.trim());
						int uid1= userHttpService.updateUAdditEmail( account, "");
						retMap.put("user_success", true);
						
						//注册统计日志
						String ip = RequestUtil.getRequestIp(request);
						LogUtils.USEROP_LOG.info("register " + uid + " " + ip  + " 3");//rigister uid ip 3
					}
					
				}else{
					retMap.put("user_success", true);
				}
				
				if(Boolean.parseBoolean(retMap.get("user_success").toString())){
					
				 	Map<String, Object>  user = userHttpService.getUInfoByUid(uid);
				 		
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
					
					//登录成功 统计日志
					String ip = RequestUtil.getRequestIp(request);
					LogUtils.USEROP_LOG.info("login " + uid + " " + ip  + " 3");//login uid ip 3=st
				}
			}
			 
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	

}
