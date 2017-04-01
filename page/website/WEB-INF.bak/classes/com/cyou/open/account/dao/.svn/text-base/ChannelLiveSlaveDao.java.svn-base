package com.cyou.open.account.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.cyou.common.orm.hibernate.HibernateDao;
import com.cyou.open.account.entity.bean.User;

@Repository
public class ChannelLiveSlaveDao extends HibernateDao<User, Long> {
	
    @Autowired
    protected SessionFactory channelliveSessionFactorySlave;
    public void setSessionFactory(){
        this.sessionFactory = channelliveSessionFactorySlave;
    }	
    
	// 查找关注记录
    public List findRecordList (String uids ,int ratio ,int add){
//    	String hql = "select sid,uid ,start_time,num,type from live_notify where UNIX_TIMESTAMP()>time and UNIX_TIMESTAMP()-time<=60 and uid in("+uids+")";
       
    	String hql = "select a.sid,a. uid ,a.start_time ,num*"+ratio+"+"+add+" , a.type ,b.name,num  from live_notify a left join raidcall.sess_info b on a.sid=b.sid " +
    			"where UNIX_TIMESTAMP()>a.time and UNIX_TIMESTAMP()-a.time<=60 and a.uid in("+uids+") order by a.start_time desc;"; 
    	System.out.println("======================"+hql);
        Query query  = this.getSession().createSQLQuery(hql);
        //query.setParameter(0, uids);
        List list = null;
        list =  query.list();
        return list;
    }

    public List findUnliveRecordList (String uids ,int ratio ,int add){
//      String hql = "select sid,uid ,start_time,num,type from live_notify where UNIX_TIMESTAMP()>time and UNIX_TIMESTAMP()-time<=60 and uid in("+uids+")";
       
        String hql = "select a.sid,a. uid ,a.start_time ,'notlive', a.type ,b.name,num  from live_notify a left join raidcall.sess_info b on a.sid=b.sid " +
                "where UNIX_TIMESTAMP()-a.time>60 and a.uid in("+uids+") order by a.start_time desc;"; 
        System.out.println("======================"+hql);
        Query query  = this.getSession().createSQLQuery(hql);
        //query.setParameter(0, uids);
        List list = null;
        list =  query.list();
        return list;
    }
    
	// 查找浏览记录
    public List findChannelList (String sids){
       
    	String hql = "select a.sid,a.uid,a.num ,a.time,b.name from live_notify a left join raidcall.sess_info b on a.sid=b.sid " +
    			"where UNIX_TIMESTAMP()>a.time and a.sid in("+sids+")"; 
    	System.out.println("======================"+hql);
        Query query  = this.getSession().createSQLQuery(hql);
        //query.setParameter(0, uids);
        List list = null;
        list =  query.list();
        return list;
    }
}
