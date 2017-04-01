package com.cyou.open.account.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cyou.common.utils.MailManager;
import com.cyou.common.utils.RedisTool;
import com.cyou.open.account.dao.ChannelLiveSlaveDao;
import com.cyou.open.account.dao.UserDao;
import com.cyou.open.account.entity.bean.User;

@Service
@Transactional(readOnly = true)
public class UserService {

    @Autowired
    private UserDao             userDao;

    @Autowired
    private ChannelLiveSlaveDao channelLiveSlaveDao;

    @Autowired
    private MailManager         mailManager;

    @Value("${mail.verification.time}")
    private int                 vtime;

    @Value("${mail.pwd.time}")
    private int                 pwdtime;

    @Value("${base.path}")
    private String              BASE_PATH;

    //获取激活邮件
    @Transactional
    public User sendVerifyMail(long uid, String email, String username, String path) {

        User user = userDao.findUserByUid(uid);
        if (user == null) {
            user = new User();
            user.setUid(uid);
            user.setCreateDate(new Date());
        }

        String code = UUID.randomUUID().toString().replace("-", "");
        code = code.substring(2, 7) + code.substring(18, 23);

        Date validDate = new Date(System.currentTimeMillis() + vtime * 60 * 1000);
        user.setEcode(code);
        user.setEvalidDate(validDate);
        user.setUpdateDate(new Date());
        userDao.save(user);

        Map<String, String> map = new HashMap<String, String>();
        map.put("template", "verify");
        map.put("username", username);
        //		path=path.replace("/", "");
        map.put("userValidPath", path + "/common/active.html?uid=" + uid + "&code=" + code);
        mailManager.setTomails(email);
        mailManager.sendMail("Activate Email", map);

        return user;
    }

    //激活邮箱
    @Transactional
    public int userVerify(long uid, String code) {

        User user = userDao.findUserByUid(uid);
        if (user == null) {
            return 0;//用户不存在
        }

        long vdate = user.getEvalidDate().getTime();
        long now = System.currentTimeMillis();

        if (code.equals(user.getEcode()) && vdate > now) {
            user.setEvalidDate(new Date());
            user.setUpdateDate(new Date());
            return 1;
        } else {
            return 2; //错误的激活码活已过期
        }

    }

    //获取找回密码邮件
    @Transactional
    public int sendFindPwdMail(long uid, String account, String email, String username, String path) {
        User user = userDao.findUserByUid(uid);
        if (user == null) {
            user = new User();
            user.setUid(uid);
            user.setCreateDate(new Date());
        }
        user.setAccount(account);

        String code = UUID.randomUUID().toString().replace("-", "");
        code = code.substring(3, 8) + code.substring(15, 20) + code.substring(25, 30);
        Date validDate = new Date(System.currentTimeMillis() + pwdtime * 60 * 60 * 1000);

        user.setPwdcode(code);
        user.setPwdvalidDate(validDate);
        user.setUpdateDate(new Date());
        userDao.save(user);

        Map<String, String> map = new HashMap<String, String>();
        map.put("template", "pwd");
        map.put("username", username);
        //path=path.replace("/", "");
        map.put("userPwdPath", path + "/common/resetpass.html?account=" + account + "&uid=" + uid
            + "&code=" + code);
        mailManager.setTomails(email);
        mailManager.sendMail("Reset Password", map);

        return 1;
    }

    //重置密码
    @Transactional
    public int resetPwdEmail(long uid, String code) {

        User user = userDao.findUserByUid(uid);
        if (user == null) {
            return 0;//用户不存在
        }

        long pdate = user.getPwdvalidDate().getTime();
        long now = System.currentTimeMillis();

        if (code.equals(user.getPwdcode()) && pdate > now) {
            user.setPwdvalidDate(new Date());
            user.setUpdateDate(new Date());

            return 1;
        } else {
            return 2; //错误的激活码或已过期
        }

    }

    //查找关注
    public List getRecordList(int uid) {

        Set<String> set = RedisTool.smembers("i_follow:" + uid);
        if (set == null) {
            System.out.println("========= recordlist =======   i_follow redis is null uid:" + uid);
            return new ArrayList();
        }
        Iterator it = set.iterator();
        String uids = "0,";
        while (it.hasNext()) {
            String key = (String) it.next();
            uids += key + ",";
        }
        if (uids.endsWith(",")) {
            uids = uids.substring(0, uids.length() - 1);
        }

        int a = getAdditive();
        int b = getRatio();
        System.out.println("========= recordlist =======   uids :" + uids + ", b:" + b + ", a:" + a);
        List list = channelLiveSlaveDao.findRecordList(uids, b, a);
        System.out.println("========= recordlist =======   listsize " + list.size());
        for (Object o : list) {
            Object[] os = (Object[]) o;
            int cid = (Integer) os[0];
            int count = (Integer) os[6];
            int c = getPCU(cid);
            if (c > 0) {
                os[3] = count + c;
            }
        }
        System.out.println("========= recordlist =======   listsize " + list.size());
        list.addAll(channelLiveSlaveDao.findUnliveRecordList(uids, b, a));
        System.out.println("========= recordlist =======   listsize " + list.size());

        return list;
    }
    
    //查找频道信息
    public List getChannelInfoList(String sids) {

        List list = channelLiveSlaveDao.findChannelList(sids);
        System.out.println("================   listsize " + list.size());
        Date date = new Date();
        
        for (Object o : list) {
            Object[] os = (Object[]) o;
            //a.sid,a.uid,a.num ,a.time,b.name //'notlive'
            int sid = (Integer) os[0];
            int uid = (Integer) os[1];
            String num = os[2].toString();
            String name = os[4].toString();
            
            int time = (Integer) os[3];
            
            System.out.println(date.getTime()/1000 - time +"="+ date.getTime() +"-"+time);
            if(date.getTime()/1000 - time >60){
            	os[2] = "notlive";
            }
        }
        
        return list;
    }
    //查找全局人气 增加数
    public int getAdditive() {
        int res = 0;
        String additive = RedisTool.get("channel_pcu_additive:");
        if (additive != null && !"".equals(additive) && Integer.parseInt(additive) >= 0) {
            res = Integer.parseInt(additive);
        }
        return res;
    }

    //查找全局人气 倍数
    public int getRatio() {
        int res = 1;
        String ratio = RedisTool.get("channel_pcu_ratio:");
        if (ratio != null && !"".equals(ratio) && Integer.parseInt(ratio) > 0) {
            res = Integer.parseInt(ratio);
        }
        return res;
    }

    //查找是否人工设置假值
    public int getPCU(int cid) {
        int pcu = 0;
        String key = "channel_pcu:" + cid;
        String p = RedisTool.get(key);

        if (p != null && !"".equals(p) && Integer.parseInt(p) > 0) {
            pcu = Integer.parseInt(p);
        }
        return pcu;
    }
}
