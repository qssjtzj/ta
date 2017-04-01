package com.cyou.open.account.dao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.cyou.common.utils.HttpClientUtil;

@Repository
public class UserHttpDao  {
	
	@Value("${base.dbapi.url}")
	private String BASE_URL;
	
	public static final String BASE_SUFFIX = "@showoo.cc";
	
	public static final String FB_ACCOUNT_TAG="FB_";
	
	public static final String ST_ACCOUNT_TAG="ST_";
	
	public String httpRequestPost(String httpUrl, Map<String, String> headers, Map<String, Object> params) {
		
		httpUrl=BASE_URL+httpUrl;
		params.put("api_user", "web-main");
		params.put("api_password", "web-dinfweuwefxhaw");
		
		String returnStr = HttpClientUtil.doPost(httpUrl, headers, params);
		return returnStr;
	}
	public String httpRequestGet(String httpUrl, Map<String, Object> params) {
		httpUrl=BASE_URL+httpUrl;
		params.put("api_user", "web-main");
		params.put("api_password", "web-dinfweuwefxhaw");
		
		String returnStr = HttpClientUtil.doGet(httpUrl, params);
		return returnStr;
	}
	
	public String httpPost(String httpUrl, Map<String, String> headers, Map<String, Object> params) {
		
		String returnStr = HttpClientUtil.doPost(httpUrl, headers, params);
		return returnStr;
	}
	public String httpGet(String httpUrl, Map<String, Object> params) {
		
		String returnStr = HttpClientUtil.doGet(httpUrl, params);
		return returnStr;
	}
}
