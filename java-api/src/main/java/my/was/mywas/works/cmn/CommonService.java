/**
 * @File        : CommonService.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 서비스, 환경정보 및 암복호화 키 교환 등을 담당한다.
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.cmn;

import static com.ntiple.commons.Constants.UTF8;
import static my.was.mywas.commons.Constants.KOKR;
import static my.was.mywas.commons.Constants.RESCD_FAIL;
import static my.was.mywas.commons.Constants.RESCD_OK;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ntiple.commons.CryptoUtil.AES;
import com.ntiple.commons.CryptoUtil.RSA;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.InitObj;
import my.was.mywas.commons.CommonEntity.Result;
import my.was.mywas.commons.SystemSettings;

@Slf4j @Service
public class CommonService {

  private static CommonService instance;

  @Autowired private SystemSettings settings;

  @Autowired private CommonRepository repository;

  @PostConstruct public void init() {
    log.trace("INIT:{}", CommonService.class);
    instance = this;
  }

  public static CommonService getInstance() {
    return instance;
  }

  /** 시스템 활성화 여부 체크 */
  public Result cmn00000000() throws Exception {
    String rescd = RESCD_OK;
    if (!settings.isAlive()) { rescd = RESCD_FAIL; }
    Result ret = Result.builder()
      .rescd(rescd)
      .build();
    return ret;
  }

  /** 최초 접속 환경정보 조회 */
  public InitObj cmn01001a01() throws Exception {
    long timestamp = System.currentTimeMillis();
    return InitObj.builder()
      .current(new Date(timestamp))
      .locale(KOKR)
      .encoding(UTF8)
      .expirecon(settings.getExprAcc())
      .check(rsaEncrypt(settings.getKeySecret()))
      .build();
  }

  /** DB 암호화 */
  public String dbEncrypt(String value) {
    return repository.dbEncrypt(value);
  }

  /** AES 암호화 */
  public String aesEncrypt(String value) {
    try {
      return AES.encrypt(settings.getKeySecret(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** AES 복호화 */
  public String aesDecrypt(String value) {
    try {
      return AES.decrypt(settings.getKeySecret(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** RSA 암호화 (AES 키 전송용) */
  public String rsaEncrypt(String value) {
    try {
      return RSA.encrypt(1, settings.getKeyPublic(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** RSA 복호화 (AES 키 전송용) */
  public String rsaDecrypt(String value) {
    try {
      return RSA.decrypt(1, settings.getKeyPublic(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }
}