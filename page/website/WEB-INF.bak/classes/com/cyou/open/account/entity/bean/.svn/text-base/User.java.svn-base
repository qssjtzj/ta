package com.cyou.open.account.entity.bean;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.cyou.common.custom.DataEntity;

@Entity
@Table(name = "member_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class User extends DataEntity {
	
	@Column(name = "uid")
	private long uid;// 用户唯一标识
	
	@Column(name = "account")
	private String account;// 账号

	@Column(name = "pwdcode")
	private String pwdcode;// 修改密码验证码
	
	@Column(name = "pwdvalid_date")
	private Date pwdvalidDate;// 修改密码有效期
	
	@Column(name = "ecode")
	private String ecode;// 邮箱验证码
	
	@Column(name = "evalid_date")
	private Date evalidDate;// 邮箱验证有效期

	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPwdcode() {
		return pwdcode;
	}

	public void setPwdcode(String pwdcode) {
		this.pwdcode = pwdcode;
	}

	public Date getPwdvalidDate() {
		return pwdvalidDate;
	}

	public void setPwdvalidDate(Date pwdvalidDate) {
		this.pwdvalidDate = pwdvalidDate;
	}

	public String getEcode() {
		return ecode;
	}

	public void setEcode(String ecode) {
		this.ecode = ecode;
	}

	public Date getEvalidDate() {
		return evalidDate;
	}

	public void setEvalidDate(Date evalidDate) {
		this.evalidDate = evalidDate;
	}
	
}
