/**
 * @File        : RestResponse.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : REST 통신에 사용되는 공통 util
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static my.was.mywas.commons.Constants.AUTHORIZATION;
import static my.was.mywas.commons.Constants.BEARER;
import static my.was.mywas.commons.Constants.CONTENT_TYPE;
import static my.was.mywas.commons.Constants.CTYPE_HTML;
import static my.was.mywas.commons.WebUtils.curRequest;
import static my.was.mywas.commons.WebUtils.remoteAddr;
import static my.was.mywas.commons.WebUtils.secureOut;

import java.util.Map;
import java.util.concurrent.Callable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.ntiple.commons.CryptoUtil.AES;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.AuthResult;
import my.was.mywas.commons.CommonEntity.InitObj;

@Slf4j @Component
public class RestResponse {
  private static RestResponse instance;

  @Autowired SystemSettings settings;

  @PostConstruct public void init() {
    log.trace("INIT:{}", RestResponse.class);
    instance = this;
  }

  public static <T> ResponseEntity<T> response(Callable<T> exec) {
    HttpHeaders hdrs = new HttpHeaders();
    HttpStatus status = HttpStatus.OK;
    SystemSettings settings = instance.settings;
    Object res = null;
    try {
      HttpServletRequest req = curRequest();
      String ipaddr = remoteAddr(req);
      String uri = req.getRequestURI();
      log.trace("IP:{} / URI:{} / IS-ADMIN:{} / USER-ID:{} / EXTRA:{}", ipaddr, uri);
      res = exec.call();
      log.trace("RES:{}", res);
      if (res instanceof String) {
        /** 문자열 결과인 경우 바로 리턴한다. */
        hdrs.add(CONTENT_TYPE, CTYPE_HTML);
        ResponseEntity<T> ret = cast(
          new ResponseEntity<>(res, hdrs, status), ret = null);
        return ret;
      } else if (res instanceof AuthResult) {
        AuthResult ares = cast(res, ares = null);
        Long exptAcc = settings.getExprAcc();
        Long exptRef = settings.getExprRef();
        String encstr = "";
        log.debug("ARES:{}", ares);
        if (ares.getAccessToken() != null) {
          if (ares.getRefreshToken() != null) {
            try {
              /** 응답헤더에 사용자ID, 토큰정보등을 암호화 하여 내려보낸다. (공백구분) */
              encstr = AES.encrypt(settings.getKeySecret(), cat(
                ares.getUserId(), " ", ares.getUserNm(), " ",
                ares.getAccessToken(), " ", ares.getRefreshToken(), " ",
                exptAcc, " ", exptRef, " " 
              ));
            } catch (Exception e) {
              log.debug("E:{}", e.getMessage());
            }
            hdrs.add(AUTHORIZATION, cat(BEARER, " ", encstr));
          } else {
            try {
              /** 토큰리프레시 인 경우 액세스토큰만 발급해서 내려보낸다 */
              encstr = AES.encrypt(settings.getKeySecret(), cat(
                ares.getUserId(), " ", ares.getUserNm(), " ",
                ares.getAccessToken(), " ", exptAcc)
              );
            } catch (Exception e) {
              log.debug("E:{}", e.getMessage());
            }
            hdrs.add(AUTHORIZATION, cat(BEARER, " ", encstr));
          }
        }
      } else if (res instanceof InitObj) {
        InitObj ires = cast(res, ires = null);
        log.trace("CHECK:{}", ires.getCheck());
      }
    } catch (Exception e) {
      if (e instanceof ApiException) {
        // log.debug("ERROR:{}{}{}", e.getMessage(), C.CRNL, errstack(e));
        ApiException ee = cast(e, ApiException.class);
        if (ee.status != null) {
          status = ee.status;
        } else {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res = Map.of("message", ee.errmsg);
      } else {
        log.debug("ERROR:", e);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
    ResponseEntity<T> ret = cast(new ResponseEntity<>(secureOut(res), hdrs, status), ret = null);
    log.debug("RESULT-OK:{}", hdrs);
    return ret;
  }

  public static void log(String format, Object... args) {
    log.debug(format, args);
  }
}