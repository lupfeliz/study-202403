/**
 * @File        : WebUtils.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 원격지IP 등 request 분석정보, response 가공 등에 필요한 util
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.capitalize;
import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.ConvertUtil.EMPTY_CLS;
import static com.ntiple.commons.ConvertUtil.EMPTY_OBJ;
import static com.ntiple.commons.ConvertUtil.isPrimeType;
import static my.was.mywas.commons.Constants.AUTHORIZATION;
import static my.was.mywas.commons.Constants.BEARER;
import static my.was.mywas.commons.Constants.REFERER;
import static my.was.mywas.commons.Constants.X_FORWARDED_FOR;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.SecureOut;

@Slf4j
public class WebUtils {
  static final String PTN_SCHEM_HTTP = "^http[s]{0,1}[:][/][/]";

  /** 토큰정보 읽어오기 */
  public static String getAuthToken() { return getAuthToken(curRequest()); }
  public static String getAuthToken(HttpServletRequest req) {
    String hval = req.getHeader(AUTHORIZATION);
    log.trace("AUTH-HEADER:{}", hval);
    if (hval != null && hval.startsWith(BEARER) && hval.length() > BEARER.length() + 2) {
      return hval.substring(BEARER.length() + 1);
    }
    return null;
  }

  /** 현재 Request 객체 읽어오기 */
  public static HttpServletRequest curRequest() {
    return (cast(RequestContextHolder.getRequestAttributes(), ServletRequestAttributes.class))
      .getRequest();
  }

  /** 현재 Response 객체 읽어오기 (SecurityConfig.AuthFilter 에서 저장된 Response) */
  public static HttpServletResponse curResponse() { return curResponse(curRequest()); }
  public static HttpServletResponse curResponse(HttpServletRequest request) {
    if (request != null) {
      try {
        Object obj = request.getAttribute(HttpServletResponse.class.getName());
        if (obj != null) {
          if (obj instanceof HttpServletResponse) {
            return cast(obj, HttpServletResponse.class);
          }
        }
      } catch (Exception ignore) { }
    }
    return null;
  }

  /** 원격지 IP주소 읽어오기 (앞단에 웹서버Proxy 가 있을수 있으므로 X-Forward-For 헤더까지 읽어본다) */
  public static String remoteAddr() { return remoteAddr(curRequest()); }
  public static String remoteAddr(HttpServletRequest req) {
    String ret = null;
    ret = req.getHeader(X_FORWARDED_FOR);
    if (ret == null) { ret = req.getHeader("Proxy-Client-IP"); }
    if (ret == null) { ret = req.getHeader("WL-Proxy-Client-IP"); }
    if (ret == null) { ret = req.getHeader("HTTP_CLIENT_IP"); }
    if (ret == null) { ret = req.getHeader("HTTP_X_FORWARDED_FOR"); }
    if (ret == null) { ret = req.getRemoteAddr(); }
    return ret;
  }

  /** 호출지 (Referer) 읽어오기 */
  public static String referer() { return referer(curRequest()); }
  public static String referer(HttpServletRequest req) {
    String ret = null;
    ret = req.getHeader(REFERER);
    return ret;
  }

  /** Requet URL 에서 URI 분리 */
  public static String getUri(String urlStr, List<String> hostNames) {
    String ret = "";
    if (urlStr == null || "".equals(urlStr)) { return ret; }
    urlStr = urlStr.trim().replaceAll(PTN_SCHEM_HTTP, "").trim();
    if (hostNames != null) {
      LOOP:
      for (String hostName : hostNames) {
        if (urlStr.startsWith(hostName)) {
          ret = urlStr.substring(hostName.length());
          break LOOP;
        }
      }
    }
    return ret;
  }

  /** @SecureOut 으로 어노테이션 된 필드는 RestResponse 에서 삭제되도록 처리 */
  public static <T> T secureOut(T prm) {
    if (prm == null) { return prm; }
    T ret = prm;
    Class<?> cls = prm.getClass();
    if (isPrimeType(cls)) { return prm; }
    log.trace("CHECK1:{} : {}", cls.getSimpleName(), cls.isAnnotationPresent(SecureOut.class));
    if (cls.isAnnotationPresent(SecureOut.class)) {
      Field[] fields = cls.getDeclaredFields();
      for (Field field : fields) {
        log.trace("CHECK2:{}.{} : {}", cls.getSimpleName(), field.getName(), field.isAnnotationPresent(SecureOut.class));
        if (field.isAnnotationPresent(SecureOut.class)) {
          try {
            Method setter = cls.getDeclaredMethod(cat("set", capitalize(field.getName())), field.getType());
            if (setter != null) {
              setter.invoke(prm, new Object[]{ null });
            }
          } catch (Exception ignore) { }
        } else {
          Object val = null;
            Method mtd = null;
            try {
              mtd = cls.getMethod(cat("get", capitalize(field.getName())), EMPTY_CLS);
              if (mtd != null) { val = mtd.invoke(prm, EMPTY_OBJ); }
            } catch (Exception e) {
              log.debug("E:{}", e);
            }
          if (val != null) {
            if (val instanceof List) {
              List<?> list = cast(val, list = null);
              for (Object itm : list) {
                secureOut(itm);
              }
            } else if (val instanceof Map) {
              Map<String, Object> map = cast(val, map = null);
              for (String key : map.keySet()) {
                secureOut(map.get(key));
              }
            } else {
              secureOut(val);
            }
          }
        }
      }
    }
    return ret;
  }
}