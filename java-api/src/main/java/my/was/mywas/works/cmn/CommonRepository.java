/**
 * @File        : CommonRepository.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통으로 사용하는 JPA Repository
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.cmn;

import static com.ntiple.commons.ConvertUtil.cast;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j @Repository
public class CommonRepository {

  @Autowired private EntityManager em;

  /** DB 자체 기능을 사용한 암호화 encrypt, 단방향 암호화만 사용한다.  */
  public String dbEncrypt(String value) {
    String ret = "";
    try {
      /** JPA 질의문(Common.dbEncrypt)을 수행한다 */
      ret = cast(em.createNamedQuery("Common.dbEncrypt")
        .setParameter("value", value)
        .getSingleResult(), ret);
      log.debug("RESULT:{}", ret);
    } catch (Exception e) {
      log.error("", e);
    }
    return ret;
  }
}