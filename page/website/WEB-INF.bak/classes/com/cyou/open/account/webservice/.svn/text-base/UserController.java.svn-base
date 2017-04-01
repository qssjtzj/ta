package com.cyou.open.account.webservice;

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
import com.cyou.common.utils.LogUtils;
import com.cyou.common.utils.RequestUtil;
import com.cyou.open.account.entity.bean.User;
import com.cyou.open.account.service.UserHttpService;
import com.cyou.open.account.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/account/user")
public class UserController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private UserHttpService userHttpService;	
	
	/**
	 * 获取激活邮件
	 * @param session
	 * @param account
	 * @param rtype
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value = "/getcode", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object getVerifyCode(HttpSession session,HttpServletRequest request)
			throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		Map<String, Object>   user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		
		int uid= Integer.parseInt( user.get("uid").toString() );
		Map<String, Object>   info = userHttpService.getUInfoByUid(uid);
		
		String email=info.get("passport").toString();
		String username=info.get("nick").toString();
		
		//Map<String, Object>   info = userHttpService.getUInfoAdditByUid(Integer.parseInt(user.get("uid").toString()) , );
		
		String path = request.getContextPath();
//		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
		String basePath = request.getScheme()+"://"+request.getServerName()+path+"";
			
		User uTemp = userService.sendVerifyMail( uid , email,  username ,basePath);
		if(uTemp != null){
				retMap.put("user_success", true);
				
				email = email.substring(0,2)+"..."+email.substring(email.indexOf("@")-1,email.length());
				retMap.put("user_email", email);
		}else{
				retMap.put("user_success", false);
				retMap.put("error_code", -2);//用户信息错误或已激活
		}
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr = mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 修改邮箱
	 */
	@RequestMapping(value = "/modifyEmail", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object modifyEmail(HttpSession session,
			@RequestParam(value = "omail") String oldMail,
			@RequestParam(value = "nmail") String newMail,
			@RequestParam(value = "nmail2") String newMail2)
			throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		Map<String, Object>   user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		int uid= Integer.parseInt( user.get("uid").toString() );
		Map<String, Object>   info = userHttpService.getUInfoByUid(uid);
		
		String email =info.get("passport").toString();
		String account =info.get("account").toString();
		
		
		
		if(oldMail==null || "".equals(oldMail.trim()) || newMail==null || "".equals(newMail.trim())  || newMail2==null || "".equals(newMail2.trim()) ){
			retMap.put("error_code", -1);//参数错误
			
		}else if(!email.endsWith(oldMail)){
			retMap.put("error_code", -4);//原邮箱错误
			
		}else if(oldMail.equals(newMail)){
			retMap.put("error_code", -2);//修改邮箱与原邮箱相同
			
		}else if(!newMail2.equals(newMail)){
			retMap.put("error_code", -3);//两次输入邮箱不同
		}else{
			Map<String, Object>   addit_info = userHttpService.getUInfoAdditByUid(uid, account );
			
			if( addit_info.get("is_valid_mail").toString().equals("0")){
				int um = userHttpService.updateUEmail(uid, account, newMail);
				if( um != 0 ){
					retMap.put("user_success", true);
				}else{
					retMap.put("error_code", 2);//用户信息错误
				}
			}else{
				retMap.put("error_code", 1);//用户已验证
			}
		}

		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap) ;
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}

/*	*//**
	 * 获取登陆token
	 * @param session
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value = "/gettoken", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	@Deprecated
	public Object getLoginToken(HttpSession session, 
			HttpServletRequest request, 
			HttpServletResponse response) throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("user_success", false);
		
		Map<String, Object>   user = (Map<String, Object>) session.getAttribute("OPEN_USER");
		int uid = Integer.parseInt( user.get("uid").toString() );
		String account =  user.get("account").toString() ;
		String ip = RequestUtil.getRequestIp(request);
		
		String token = userHttpService.getLoginToken(uid, ip, "link");
		int additive = userService.getAdditive();
		int ratio = userService.getRatio();
		System.out.println(additive+"=================="+ratio);
		CookiesManager.addCookie(response, "_open_add", additive+"");
		CookiesManager.addCookie(response, "_open_multip", ratio+"");
		
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
		
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap);
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
	/**
	 * 注销
	 * @param session
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object logout(HttpSession session, HttpServletResponse response) throws JsonProcessingException {
		
		Map<String, Object> retMap = new HashMap<String, Object>();
		session.removeAttribute("OPEN_USER");
		retMap.put("user_success", false);
		CookiesManager.addCookie(response, "_open_ssid", null);
		CookiesManager.addCookie(response, "_open_sname", null);
		CookiesManager.addCookie(response, "_open_vip",null );
		CookiesManager.addCookie(response, "_open_t",null );
		ObjectMapper mapper = new ObjectMapper();
		String renderStr =  mapper.writeValueAsString(retMap);
		return new ResponseEntity<String>(renderStr, HttpStatus.OK);
	}
	
}
