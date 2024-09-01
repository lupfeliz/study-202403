/**
 * @File        : LoginService.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 로그인 서비스
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.lgn;

import static com.ntiple.commons.ConvertUtil.arr;
import static com.ntiple.commons.ConvertUtil.convert;
import static com.ntiple.commons.ConvertUtil.tomap;
import static my.was.mywas.commons.Constants.EXTRA_INFO;
import static my.was.mywas.commons.Constants.TOK_TYP_ACC;
import static my.was.mywas.commons.Constants.TOK_TYP_REF;
import static my.was.mywas.commons.WebUtils.curRequest;
import static my.was.mywas.commons.WebUtils.getAuthToken;
import static my.was.mywas.commons.WebUtils.remoteAddr;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.AuthInfo;
import my.was.mywas.commons.CommonEntity.AuthResult;
import my.was.mywas.commons.CommonEntity.Login;
import my.was.mywas.commons.ApiException;
import my.was.mywas.commons.SystemSettings;
import my.was.mywas.commons.TokenProvider;
import my.was.mywas.works.cmn.CommonService;
import my.was.mywas.works.usr.User;
import my.was.mywas.works.usr.UserRepository;

@Slf4j @Service
public class LoginService {

  @Autowired SystemSettings settings;
  @Autowired CommonService service;
  @Autowired UserRepository usrrepo;
  @Autowired TokenProvider tokenprov;

  @PostConstruct public void init() {
    log.trace("INIT:{}", LoginService.class);
  }

  /** 로그인 수행 */
  public AuthResult lgn01001a01(Login login) throws Exception {
    AuthResult ret = new AuthResult();
    Authentication auth = null;
    String userId = login.getUserId();
    String password = login.getPasswd();

    try {
      /** 평문화 */
      String dpassword = service.aesDecrypt(password);
      /** DB 에서 비교를 위해 재암호화 */
      String epassword = service.dbEncrypt(dpassword);

      /** 비밀번호 노출 우려가 있으므로 실제로는 출력을 제한한다. */
      log.debug("USER-ID:{} / PASSWORD:{} / {} / {}", userId, password, dpassword, epassword);
      User user = usrrepo.findOneByUserIdEquals(userId);
      if (user != null) {
        if (epassword.equals(user.getPasswd())) {
          log.trace("USER:{}", user);
          Collection<SimpleGrantedAuthority> authorities =
            Arrays.stream(
              arr("ROLE_USER"))
              .map(SimpleGrantedAuthority::new)
              .collect(Collectors.toList());
          /**
           * authenticationToken 객체를 통해 Authentication 객체 생성
           * 이 과정에서 CustomUserDetailsService 에서 우리가 재정의한 loadUserByUsername 메서드 호출
           * Authentication auth = authenticationManagerBuilder.getObject().authenticate(authToken);
           */
          auth = new UsernamePasswordAuthenticationToken(userId, dpassword, authorities);
          Map<String, Object> info = tomap(AuthInfo.builder()
            .ipAddr(remoteAddr())
            .userNm(user.getUserNm())
            .build());
          /** 인증 정보를 기준으로 access 토큰 생성 */ 
          String atoken = tokenprov.createToken(TOK_TYP_ACC, auth, info);

          /** 인증 정보를 기준으로 refresh 토큰 생성 */ 
          String rtoken = tokenprov.createToken(TOK_TYP_REF, auth, info);
          ret = AuthResult.builder()
            .userId(userId)
            .userNm(user.getUserNm())
            .accessToken(atoken)
            .refreshToken(rtoken)
            .restyp("")
            .rescd("0000")
            .build();
        } else {
          throw new ApiException(0, "USER_NOT_FOUND");
        }
      } else {
        throw new ApiException(0, "USER_NOT_FOUND");
      }
    } catch (Exception e) {
      if (!(e instanceof ApiException)) {
        log.debug("E:{}", e);
      } else {
        throw e;
      }
    }
    return ret;
  }

  /** 로그인 연장 */
  public AuthResult lgn01002a01() {
    HttpServletRequest req = curRequest();
    String refreshToken = getAuthToken(req);
    AuthResult ret = new AuthResult();
    try {
      /** 리프레시토큰을 받아서 유효하다면 */
      Claims claims = tokenprov.parseToken(TOK_TYP_REF, refreshToken, req);
      Authentication auth = tokenprov.getAuth(claims);
      Object data = claims.get(EXTRA_INFO);
      AuthInfo ainfo = convert(data, new AuthInfo());
      if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER"))) {
      }
      /** 시간 연장된 새로운 액세스토큰을 발급하여 리턴한다. */
      String atoken = tokenprov.createToken(TOK_TYP_ACC, auth, data);
      ret = AuthResult.builder()
        .userId(claims.getSubject())
        .userNm(ainfo.getUserNm())
        .accessToken(atoken)
        .restyp("")
        .rescd("0000")
        .build();
    } catch (Exception ignore) {
    }
    return ret;
  }
}