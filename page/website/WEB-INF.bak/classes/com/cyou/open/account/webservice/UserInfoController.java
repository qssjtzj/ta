package com.cyou.open.account.webservice;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.cyou.common.custom.CookiesManager;
import com.cyou.common.utils.DateUtil;
import com.cyou.common.utils.LogUtils;
import com.cyou.common.utils.RedisTool;
import com.cyou.common.utils.RequestUtil;
import com.cyou.common.utils.SecurityUtil;
import com.cyou.open.account.service.UserHttpService;
import com.cyou.open.business.anchor.entity.bean.Affair;
import com.cyou.open.business.anchor.entity.bean.AnchorApply;
import com.cyou.open.business.anchor.service.AffairService;
import com.cyou.open.business.anchor.service.AnchorApplyService;
import com.cyou.open.business.car.entity.bean.Car;
import com.cyou.open.business.car.entity.bean.CarBuy;
import com.cyou.open.business.car.entity.bean.CarNumber;
import com.cyou.open.business.car.service.CarNumberService;
import com.cyou.open.business.car.service.CarService;
import com.cyou.open.business.gift.service.FlowerService;
import com.cyou.open.business.gift.service.GiftService;
import com.cyou.open.pay.entity.bean.ShowBi;
import com.cyou.open.pay.entity.bean.ShowBiHistory;
import com.cyou.open.pay.service.RcBiService;
import com.cyou.open.pay.service.ShowBiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/account/info")
public class UserInfoController {

    @Autowired
    private UserHttpService userHttpService;

    @Autowired
    private AnchorApplyService anchorApplyService;

    @Autowired
    private RcBiService rcbiService;

    @Autowired
    private AffairService affairService;

    @Autowired
    private ShowBiService showBiService;

    @Autowired
    private GiftService giftService;

    @Autowired
    private FlowerService flowerService;

    @Autowired
    private CarService carService;
    
    @Autowired
    private CarNumberService carNumberService;
    
    /**
     * 开通VIP
     * @throws ParseException 
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/buyvip", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object buyVip(HttpSession session, HttpServletRequest request,
        HttpServletResponse response) throws JsonProcessingException, ParseException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        ObjectMapper mapper = new ObjectMapper();
        retMap.put("user_success", false);
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());
        
        retMap.put("user_success", true);
        String vipBuy = request.getParameter("vipbuy");
        String vipAmount = request.getParameter("vipamount");
        int days = 0;
        Date date = userHttpService.getVipEndTime(uid);
        Date _date = null;
        if (vipAmount.equals("10000")) {
            _date = DateUtil.addMonth(date, 1);
        } else if (vipAmount.equals("26000")) {
            _date = DateUtil.addMonth(date, 3);
        } else if (vipAmount.equals("86000")) {
            _date = DateUtil.addMonth(date, 12);
        } else {}
        days = DateUtil.daysBetween(date, _date);
        if (vipBuy == null) {
            retMap.put("success", false);
            retMap.put("info", "buy vip amount is null. ");
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
        }
        ShowBi showbi = showBiService.getShowBiByUid(uid);
        double userAmount = 0;
        if (showbi != null) {
            userAmount = showbi.getAmount();
        }
        //1.判断 RC币是否足够，不足弹出去充值的提示
        long vipBuyAmount = Long.parseLong(vipBuy);
        if (userAmount < vipBuyAmount) {
            retMap.put("success", false);
            retMap.put("info", "rc bi is not enough,please recharge. ");
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
        }
        //2.扣款
        long orderid = showBiService.getOrderId();
        showBiService.consume(uid, vipBuyAmount, orderid, ShowBiHistory.SHOWBI_TYPE_BUYVIP);//购买vip

        //3.调开通vip服务
        DateUtil.addMonth(new Date(), days);
        int code = userHttpService.buyVip(uid, days, 1);
        if (code == 200) {
            retMap.put("success", true);
            CookiesManager.addCookie(response, "_open_vip", 1 + "");

            // 4.赠送车
            Date nowDate = new Date();
            long stime = nowDate.getTime() / 1000;
            //Date endDate = DateUtil.addMonth(nowDate, month);
            long etime = _date.getTime() / 1000;
            
            Car car = carService.getCarByType(4);
            if(car!=null){
            	retMap.put("car", car);
            	List<CarBuy> list = carService.getCarBuy(uid, 2);
            	//延时
                if(list!=null && list.size()>0){
                	CarBuy cb = list.get(0);
                	
                	if(cb.getCid() == car.getId()){
                		if(cb.getEndTime()<etime){
    	                	carService.updateBuyCar(cb, etime);
    	                	retMap.put("etime", etime);
    	                }else{
    	                	retMap.put("etime", cb.getEndTime());
    	                }
                	//赠送新车
                	}else{
                		carService.updateBuyCar(cb, stime);
    	            	carService.addBuyCar(Integer.parseInt(car.getId()+""), uid, 0, stime, etime, CarBuy.WAY_VIP);
    	            	retMap.put("etime", etime);
                	}
                	
                }else{
                	carService.addBuyCar(Integer.parseInt(car.getId()+""), uid, 0, stime, etime, CarBuy.WAY_VIP);
                	retMap.put("etime", etime);
                }
            	
                CarNumber cn = carNumberService.getCarNumberByType(uid,2);
            	if(cn!=null){
            		retMap.put("carnumber", cn.getNumber());
            	}else{
            		retMap.put("carnumber", null);
            	}
        	}
            // end 赠送车
            
            //登录成功 统计日志
			String ip = RequestUtil.getRequestIp(request);
			LogUtils.USEROP_LOG.info("buyvip " + uid + " " + ip + " " + vipBuyAmount );//buyvip uid amount ip
			
        } else if (code == 409) {
            retMap.put("success", false);
            retMap.put("info", "不支持开通. ");
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
        } else if (code == 411) {
            retMap.put("success", false);
            retMap.put("info", "level值不正确 ");
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
        } else if (code == 412) {
            retMap.put("success", false);
            retMap.put("info", "开通天数值不正确," + days);
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
        } else {
            retMap.put("success", false);
            retMap.put("info", "oh! 数据更新失败了，code:" + code);
            String renderStr = mapper.writeValueAsString(retMap);
            return new ResponseEntity<String>(renderStr, HttpStatus.OK);
            //506：无法获取当前相关数据；507：无法更新数据库表；508：无法插入数据库数据
        }
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 获取VIP信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getvip", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getVip(HttpSession session, HttpServletResponse response)
        throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());

        Map<String, Object> vip_info = userHttpService.getVipInfo(uid);
        Map<String, Object> info = userHttpService.getUInfoByUid(uid);
        String guardInfo = userHttpService.getGuardSingerList(uid);
        
        Car car = carService.getCarByType(4);
        retMap.put("car", car);
        
        System.out.println("-----///////////////" + car);
        if (guardInfo != null && !guardInfo.equals("")) {
            retMap.put("guardInfo", guardInfo);
        } else {
            retMap.put("guardInfo", null);
        }
        if (vip_info != null && info != null) {
            retMap.put("user_success", true);
            retMap.put("vipInfo", vip_info);
            retMap.put("username", info.get("nick"));
            retMap.put("level", info.get("level"));
            
        }

        Map<String, Object> vip = userHttpService.isVip(uid);
        if (vip != null) {
            CookiesManager.addCookie(response, "_open_vip", vip.get("level").toString());
        } else {
            CookiesManager.addCookie(response, "_open_vip", null);
        }

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);

        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 加载守护活动
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/guardactive", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object guardActive(HttpSession session, HttpServletResponse response,
    		@RequestParam(value = "channel") int channel)throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());
        
        Map<String, Object> group = userHttpService.getGroupInfo(channel);
		int singerid = Integer.parseInt(group.get("owner").toString());
        
		Car car = carService.getCarByType(5);//守护5
    	if(car==null){
    		retMap.put("error_code", -1);//守护没有赠送的车
    	}else{
    		 String guardInfo = userHttpService.getGuardSingerList(uid);
    	     guardInfo = guardInfo.replace("[[", "[").replace("]]", "]");
    	     
    	     JSONArray array = JSONArray.parseArray(guardInfo);  
    	        
    	     for(int k=0;k<array.size();k++){  
    	            
    	      	JSONObject jo = (JSONObject) array.get(k);
    	        System.out.println(jo.get("singerId")+"--------------------"+jo.get("end_time"));
    	        	
    	        long sid = jo.getInteger("singerId");
    	        long _date =jo.getInteger("end_time");
    	        if( sid == singerid ){
    	        		
    	        	//赠送车
    	        	Date nowDate = new Date();
    	            long stime = nowDate.getTime() / 1000;
    	            long etime =_date;
    	            
    	            List<CarBuy> list = carService.getCarBuy(uid, 3);
    	            //延时
    	            if(list!=null && list.size()>0){
    	            	
    	            	System.out.println("======================add time");
    	            	CarBuy cb = list.get(0);
    	            	
    	            	if(cb.getCid() == car.getId()){
    	            		if(cb.getEndTime()<etime){
        	                	carService.updateBuyCar(cb, etime);
        	                	retMap.put("etime", etime);
        	                }else{
        	                	retMap.put("etime", cb.getEndTime());
        	                }
    	            	//赠送新车
    	            	}else{
    	            		System.out.println("======================old car ");
    	            		carService.updateBuyCar(cb, stime);
    	            		System.out.println("======================send new car");
        	            	carService.addBuyCar(Integer.parseInt(car.getId()+""), uid, 0, stime, etime, CarBuy.WAY_GUARD);
        	            	retMap.put("etime", etime);
    	            	}
    	            	
    	            //送车
    	            }else{
    	            	System.out.println("======================send car");
    	            	carService.addBuyCar(Integer.parseInt(car.getId()+""), uid, 0, stime, etime, CarBuy.WAY_GUARD);
    	            	retMap.put("etime", etime);
    	            	
    	            }
    	            CarNumber cn = carNumberService.getCarNumberByType(uid,3);
	            	if(cn!=null){
	            		retMap.put("carnumber", cn.getNumber());
	            	}else{
	            		retMap.put("carnumber", null);
	            	}
	            	
    	            retMap.put("user_success", true);
    	            retMap.put("car", car);
    	            break;
    	        }
    		}
    	}
		
        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);

        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }
    
    /**
     * 获取主播信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getaccinfo", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getAccInfo(HttpSession session, HttpServletResponse response)
        throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());

        Map<String, Object> vip_info = userHttpService.getVipInfo(uid);
        Map<String, Object> info = userHttpService.getUInfoByUid(uid);
        String guardInfo = userHttpService.getGuardSingerList(uid);

        System.out.println("-----" + guardInfo);
        if (guardInfo != null && !guardInfo.equals("")) {
            retMap.put("guardInfo", guardInfo);
        } else {
            retMap.put("guardInfo", null);
        }
        if (vip_info != null && info != null) {
            retMap.put("user_success", true);
            retMap.put("vipInfo", vip_info);
            retMap.put("username", info.get("nick"));
            retMap.put("level", info.get("level"));
        }

        ShowBi showbi = showBiService.getShowBiByUid(uid);
        double amount = 0;
        if (showbi != null) {
            amount = showbi.getAmount();
        }
        retMap.put("amount", amount);//秀币余额 

        double profit = giftService.getAllCost(uid, null, null, null);
        profit = profit * 0.5 * 0.1;
        retMap.put("profit", profit);//我的收益

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);

        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 获取用户信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getinfo", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getUserInfo(HttpSession session) throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());
        
        Map<String, Object> info = userHttpService.getUInfoByUid(uid);
        String email = "";
        String passport = info.get("passport").toString();
        if (passport.length() > 5) {
            email = passport.substring(0, 2) + "..."
                + passport.substring(passport.indexOf("@") - 1, passport.length());
        }
        info.put("passport", email);
        info.put("anchorFlag", 0);
        AnchorApply anchorApply = anchorApplyService.getAnchorApply(uid);
        if (anchorApply != null) {
            if (anchorApply.getFlag() == 1) {
                info.put("anchorFlag", 1);
            }
        }
        retMap.put("user_success", true);
        retMap.put("userInfo", info);
        retMap.put("username", info.get("nick"));

        Set<String> followme = RedisTool.smembers("follow_me:" + uid);
        if (followme == null) {
            retMap.put("followme", "0");
        } else {
            retMap.put("followme", followme.size());
        }

        int flower = flowerService.getFlower(uid);
        retMap.put("flower", flower);

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 获取用户附加信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getinfoaddit", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getUserAdditInfo(HttpSession session) throws JsonProcessingException {

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        Map<String, Object> retMap = new HashMap<String, Object>();

        int uid = Integer.parseInt(user.get("uid").toString());
        Map<String, Object> info = userHttpService.getUInfoByUid(uid);

        String account = info.get("account").toString();
        Map<String, Object> addit_info = userHttpService.getUInfoAdditByUid(uid, account);

        String email = "";
        String passport = info.get("passport").toString();
        if (passport.length() > 5) {
            email = passport.substring(0, 2) + "..."
                + passport.substring(passport.indexOf("@") - 1, passport.length());
        }
        if (addit_info != null) {
            addit_info.put("passport", email);
            addit_info.put("username", info.get("nick"));

            retMap.put("user_success", true);
            retMap.put("userInfo", addit_info);
        } else {
            addit_info = new HashMap<String, Object>();
            addit_info.put("is_valid_mail", 0);
            addit_info.put("account", account);
            addit_info.put("passport", email);
            addit_info.put("username", info.get("nick"));

            retMap.put("user_success", false);
            retMap.put("userInfo", addit_info);
        }

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 修改用户信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/modifyinfo", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object modifyUserInfo(HttpSession session, HttpServletResponse response, @RequestParam(
        value = "uuid") int uuid, @RequestParam(value = "username") String username, @RequestParam(
        value = "sex") String sex, @RequestParam(value = "birthday") String birthday,
        @RequestParam(value = "area") String area,
        @RequestParam(value = "usersign") String usersign,
        @RequestParam(value = "city") String city, @RequestParam(value = "blood") String blood,
        @RequestParam(value = "constellation") String constellation,
        @RequestParam(value = "height") String height,
        @RequestParam(value = "weight") String weight, @RequestParam(value = "bwh") String bwh,
        //			@RequestParam(value = "facebook") String facebook,
        @RequestParam(value = "photo") String photo) throws JsonProcessingException,
        UnsupportedEncodingException {

        username = username.trim();
        sex = sex.trim();
        birthday = birthday.trim().replace("-", "");
        area = area.trim();
        String r_sign = URLDecoder.decode(usersign, "UTF-8");
        String r_username = URLDecoder.decode(username, "UTF-8");

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        if (username == null || sex == null || birthday == null || area == null || usersign == null) {
            retMap.put("error_code", -1);

        } else if (r_sign.length() > 45 || r_username.length() < 1 || r_username.length() > 16) {//签名超过45
            retMap.put("error_code", -3);

        } else {
            Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
            int uid = Integer.parseInt(user.get("uid").toString());

            if (uuid == uid) {
                String facebook = null;
                Map<String, Object> info = userHttpService.checkBind(uid);
                if (info != null) {
                    String fids = info.get("facebookid").toString();
                    facebook = "https://www.facebook.com/profile.php?id=" + fids;
                }

                int um = userHttpService.updateUInfo(uuid, birthday, area, usersign, username, sex,
                    city, blood, constellation, height, weight, bwh, facebook, photo);

                if (um > 0) {
                    retMap.put("user_success", true);

                    Map<String, Object> user_new = userHttpService.getUInfoByUid(uid);
                    session.setAttribute("OPEN_USER", user_new);

                    String cookievalue = SecurityUtil.md5(user.get("uid").toString()
                        + user_new.get("nick").toString() + "/" + System.nanoTime());
                    CookiesManager.addCookie(response, "_open_ssid", cookievalue);
                    //					CookiesManager.addCookie(response, "_open_sname", (String) user_new.get("nick"));

                    String c_name = URLEncoder.encode(user_new.get("nick").toString(), "utf-8");
                    CookiesManager.addCookie(response, "_open_sname", c_name);

                } else if (um == -3) {
                    retMap.put("error_code", -3);//没有修改内容
                } else {
                    retMap.put("error_code", -2);//用户信息错误
                }

            } else {
                retMap.put("error_code", 0);//登陆错误
            }

        }
        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**获取用户管理频道
     * 
     * @param session
     * @return
     * @throws JsonProcessingException
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/groupCount", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getGroupCounts(HttpSession session) throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        retMap.put("user_success", false);

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());
        int count = 0;
        Map<String, Object> groups = userHttpService.getGroupsByUid(uid);

        if (groups != null && !"".equals(groups)) {
            Object obj = groups.get("sids");
            if (obj != null && !"".equals(obj)) {
                JSONObject json = (JSONObject) obj;
                Set set = json.keySet();

                Iterator it = set.iterator();
                while (it.hasNext()) {
                    String key = (String) it.next();
                    String value = json.getString(key);
                    if (Integer.parseInt(value) == 255) {
                        count++;
                    }
                }
            }
        }
        retMap.put("counts", count);
        retMap.put("user_success", true);

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**获取用户管理频道列表详情
     * 
     * @param session
     * @return
     * @throws JsonProcessingException
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getgroups", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object getGroupsByUid(HttpSession session) throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        retMap.put("user_success", false);

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());

        Map<String, Object> groups = userHttpService.getGroupsByUid(uid);
        if (groups != null) {

            Object obj = groups.get("sids");
            System.out.println("===================" + obj);
            Map<String, Object> info = null;
            if (obj != null && !"".equals(obj)) {
                JSONObject json = (JSONObject) obj;
                Set set = json.keySet();
                String sids = set.toString().replace("[", "").replace("]", "").replace(", ", ",");
                info = userHttpService.getGroupsInfo(sids);
                retMap.put("ginfo", info.get("infos"));
            } else {
                retMap.put("ginfo", null);
            }

            retMap.put("user_success", true);
        }

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 频道是否存在
     * @param session
     * @return
     * @throws JsonProcessingException
     */
    @RequestMapping(value = "/checkgroup", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object checkGroupName(HttpSession session, @RequestParam(value = "name") String name)
        throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        int sid = userHttpService.checkGreoupName(name);
        if (sid > 0) {
            retMap.put("user_success", true);
        }

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 创建频道
     * @param session
     * @return
     * @throws JsonProcessingException
     */
    @RequestMapping(value = "/addgroup", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object createGroup(HttpSession session, @RequestParam(value = "name") String name,
        @RequestParam(value = "type") String type) throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());

        if (name == null || "".equals(name) || type == null || "".equals(type)) {
            retMap.put("error_code", -1);//参数错误
        } else {
            int sid = userHttpService.checkGreoupName(name);
            if (sid > 0) {
                retMap.put("error_code", -2);//已经存在
            } else {

                sid = userHttpService.creatGroup(name, uid, "", Integer.parseInt(type));
                if (sid > 0) {
                    retMap.put("sid", sid);
                    retMap.put("user_success", true);
                }
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 获取用户附加信息
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/showPhotoGallery", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object showPhotoGallery(HttpSession session) throws JsonProcessingException {

        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("user_success", false);

        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 主播说说
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/addaffair", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object addAffair(HttpSession session, HttpServletRequest request)
        throws JsonProcessingException {
        String content = request.getParameter("content");
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        int uid = Integer.parseInt(user.get("uid").toString());

        Affair affair = new Affair();
        affair.setContent(content);
        affair.setUid(uid);
        affair.setCreateTime(new Date());
        int result = affairService.add(affair);
        Map<String, Object> retMap = new HashMap<String, Object>();
        if (result == 0) {
            retMap.put("success", false);
        } else {
            retMap.put("success", true);
        }
        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 展示主播说说
     */
    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/findaffair", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object findAffair(HttpSession session, HttpServletRequest request)
        throws JsonProcessingException {
        Map<String, Object> retMap = new HashMap<String, Object>();
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("OPEN_USER");
        retMap.put("user_success", true);

        int uid = Integer.parseInt(request.getParameter("uid"));
        List<Affair> list = affairService.findByUid(uid);
        if (list != null && list.size() > 0) {
            retMap.put("success", true);
            retMap.put("list", list);
        } else {
            retMap.put("success", false);
        }
        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }

    /**
     * 删除主播说说
     */
    @RequestMapping(value = "/delaffair", method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object delAffair(HttpSession session, HttpServletRequest request)
        throws JsonProcessingException {
        int id = Integer.parseInt(request.getParameter("id"));
        affairService.del(id);
        Map<String, Object> retMap = new HashMap<String, Object>();
        retMap.put("success", true);
        ObjectMapper mapper = new ObjectMapper();
        String renderStr = mapper.writeValueAsString(retMap);
        return new ResponseEntity<String>(renderStr, HttpStatus.OK);
    }
}