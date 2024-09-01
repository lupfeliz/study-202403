/**
 * @File        : UserService.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원관리 서비스
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.usr;

import static com.ntiple.commons.ConvertUtil.convert;
import static my.was.mywas.commons.Constants.NOT_PERMITTED_USER;
import static my.was.mywas.commons.Constants.RESCD_FAIL;
import static my.was.mywas.commons.Constants.RESCD_OK;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.ApiException;
import my.was.mywas.commons.CommonEntity.AuthDetail;
import my.was.mywas.commons.CommonEntity.Result;
import my.was.mywas.works.cmn.CommonService;

@Slf4j @Service
public class UserService {

  @Autowired private CommonService cmnservice;
  @Autowired private UserRepository repository;

  @PostConstruct public void init() {
    log.trace("INIT:{}", UserService.class);
  }

  /** 질의한 userId 로 사용하는 사람이 없다면 OK */
  public Result usr01001a01(String userId) throws Exception {
    Result ret = Result.builder()
      .rescd(RESCD_FAIL)
      .build();
    if (repository.countByUserIdEquals(userId) == 0) {
      ret.setRescd(RESCD_OK);
    }
    return ret;
  }

  /** 회원정보 저장 */
  public Result usr01001a02(User prm) throws Exception {
    Result ret = new Result();
    String userId = prm.getUserId();
    String password = prm.getPasswd();
    Date date = new Date();
    /** 비밀번호 평문화 */
    String dpassword = cmnservice.aesDecrypt(password);
    /** DB 저장을 위해 재암호화 */
    String epassword = cmnservice.dbEncrypt(dpassword);
    /** 비밀번호 노출 우려가 있으므로 실제로는 출력을 제한한다. */
    log.debug("USER-ID:{} / PASSWORD:{} / {} / {}", userId, password, dpassword, epassword);
    prm.setPasswd(epassword);
    prm.setCtime(date);
    prm.setUtime(date);
    log.debug("PRM:{}", prm);
    repository.save(prm);
    ret.setRescd(RESCD_OK);
    return ret;
  }

  /** 마이페이지 조회 */
  public User usr01002a01(String userId) throws Exception {
    User ret = null;
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    log.debug("AUTH:{} / {}", auth.getName(), auth.getDetails());
    AuthDetail detail = convert(auth.getDetails(), new AuthDetail());
    log.debug("DETAIL:{}", detail);
    /** 로그인된 사용자가 다르다면 조회불가능 */
    if (userId != null && userId.equals(auth.getName())) {
      ret = repository.findOneByUserIdEquals(userId);
    }
    return ret;
  }

  /** 회원정보 수정 (마이페이지 저장) */
  public Result usr01002a02(User prm) throws Exception {
    Result ret = new Result();
    log.debug("PRM:{}", prm);
    String password = prm.getPasswd();
    Date date = new Date();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User user = prm;
    if (user.getId() != null && user.getId() != 0) {
      user = repository.findOneById(user.getId());
      /** 로그인된 사용자가 다르다면 오류발생 */
      if (!user.getUserId().equals(auth.getName())) { throw new ApiException(0, NOT_PERMITTED_USER); }
      if (password != null && !"".equals(password)) {
        /** 비밀번호 평문화 */
        String dpassword = cmnservice.aesDecrypt(password);
        /** DB 저장을 위해 재암호화 */
        String epassword = cmnservice.dbEncrypt(dpassword);
        /** 비밀번호 노출 우려가 있으므로 실제로는 출력을 제한한다. */
        log.debug("USER-ID:{} / PASSWORD:{} / {} / {}", user.getUserId(), password, dpassword, epassword);
        user.setPasswd(epassword);
      }
      user.setEmail(prm.getEmail());
      user.setUtime(date);
      log.debug("PRM:{}", user);
      repository.save(user);
      ret.setRescd(RESCD_OK);
    }
    return ret;
  }

  /** 회원정보 삭제 */
  public Result usr01002a03(String userId) throws Exception {
    Result ret = new Result();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (userId != null) {
      User user = repository.findOneByUserIdEquals(userId);
      if (!user.getUserId().equals(auth.getName())) {
        throw new ApiException(0, NOT_PERMITTED_USER);
      }
      repository.delete(user);
      ret.setRescd(RESCD_OK);
    }
    return ret;
  }
}