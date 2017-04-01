package com.cyou.open.account.dao;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.cyou.common.orm.hibernate.HibernateDao;
import com.cyou.open.account.entity.bean.User;

@Repository
public class UserDao extends HibernateDao<User, Long> {
    @Autowired
    protected SessionFactory sessionFactory;
    public void setSessionFactory(){
        this.sessionFactory = sessionFactory;
    }	
    
	public User findUserByUid(long uid){
		User user=null;
		Map<String, Object> values = new HashMap<String, Object>();
		values.put("uid", uid);
		String hqlString = "from User where uid=:uid";
		Query query = createQuery(hqlString);
		query.setProperties(values);
		user = (User) query.uniqueResult();
		return user;
	}
	
//	// 查找关注记录
//    public List findRecordList (int uid){
//    	String hql = "select a.sid,  b.start_time, b.uid ,b.num,b.time,b.type,b.game_id, c.name from raidcall.slist a left join " +
//    			"channellive.live_notify b on a.sid=b.sid left join raidcall.sess_info c on a.sid=c.sid  where a.uid=? and UNIX_TIMESTAMP()-b.time<=60 ";
//       
//        Query query  = sessionFactory.openSession().createSQLQuery(hql);
//        query.setParameter(0, uid);
//        List list = null;
//        list =  query.list();
//        return list;
//    }

}
