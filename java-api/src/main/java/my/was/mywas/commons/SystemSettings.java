/**
 * @File        : SystemSettings.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 시스템 설정 저장 객체
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.cast;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j @Component @Getter @Setter
public class SystemSettings implements ApplicationContextAware {

  private static SystemSettings instance;

  private boolean alive;

  private Map<String, Object> gprops;

  private ApplicationContext applicationContext;

  @Value("${spring.profiles.active:local}") private String profile; 
  /** aes 암호화 키 */
  @Value("${security.key.aes.secret:}") private String keySecret;
  /** rsa 암호화 개인키 */
  @Value("${security.key.rsa.privatekey:}") private String keyPrivate;
  /** rsa 암호화 공개키 */
  @Value("${security.key.rsa.publickey:}") private String keyPublic;
  /** access token security */
  @Value("${security.jwt.access.secret:}") private String secretAcc;
  /** refresh token security */
  @Value("${security.jwt.refresh.secret:}") private String secretRef;
  /** access token expiry */
  @Value("${security.jwt.access.expire:0}") private Long exprAcc;
  /** refresh token expiry */
  @Value("${security.jwt.refresh.expire:0}") private Long exprRef;

  @PostConstruct public void init() {
    log.trace("INIT:{}", SystemSettings.class);
    instance = this;
    alive = true;
    gprops = new LinkedHashMap<>();
  }

  public static final SystemSettings getInstance() {
    if (instance == null) {
      instance = new SystemSettings();
      instance.init();
    }
    return instance;
  }

  @Override @SuppressWarnings("null") 
  public void setApplicationContext(ApplicationContext appctx) throws BeansException {
    this.applicationContext = appctx;
  }

  public static final boolean containsPropertyKey(String key) {
    return instance.gprops.containsKey(key);
  }

  public static final String getProperty(String key) {
    return cast(instance.gprops.get(key), "");
  }

  public static final void setProperty(String key, String val) {
    instance.gprops.put(key, val);
  }
}