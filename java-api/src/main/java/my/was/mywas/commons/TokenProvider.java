/**
 * @File        : TokenProvider.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 인증토큰 발급기
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.EMPTY_OBJ;
import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static my.was.mywas.commons.Constants.AUTH;
import static my.was.mywas.commons.Constants.EXTRA_INFO;
import static my.was.mywas.commons.Constants.TOK_TYP_REF;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j @Component
public class TokenProvider {
  @Autowired SystemSettings settings;
  /** 엑세스토큰 */
  Key keyAcc;
  /** 리프레시토큰 */
  Key keyRef;
  @PostConstruct public void init () {
    this.keyAcc = Keys.hmacShaKeyFor(Decoders.BASE64.decode(settings.getSecretAcc()));
    this.keyRef = Keys.hmacShaKeyFor(Decoders.BASE64.decode(settings.getSecretRef()));
  }

  /** 토큰생성 (토큰타입이 액세스/리프레시 인지 여부에 따라 다른 KEY 를 사용한다) */
  public String createToken(String tokenType, Authentication auth, Object extraInfo) throws Exception {
    /** Authentication -> Token */
    Key key = keyAcc;
    long expire = settings.getExprAcc();
    switch (tokenType) {
    case TOK_TYP_REF: {
      key = keyRef;
      expire = settings.getExprRef();
    } break;
    default: break;
    }
    return createToken(key, expire, auth, extraInfo);
  }

  public String createToken(Key key, long expire, Authentication auth, Object extraInfo) throws Exception {
    String authorities = auth.getAuthorities().stream()
      .map(GrantedAuthority::getAuthority)
      .collect(Collectors.joining(","));
    return Jwts.builder()
      .setSubject(auth.getName())
      .claim(AUTH, authorities)
      .claim(EXTRA_INFO, extraInfo)
      .signWith(key, SignatureAlgorithm.HS512)
      .setExpiration(new Date(System.currentTimeMillis() + expire))
      .compact();
  }

  /** 인증정보읽어오기 */
  public Authentication getAuth(String tokenType, String token, HttpServletRequest req) {
    /** Token -> Authentication */
    Claims claims = null;
    claims = parseToken(tokenType, token, req);
    log.debug("EXPIRE-LEFT:{}s", (claims.getExpiration().getTime() - System.currentTimeMillis()) / 1000);
    return getAuth(claims);
  }

  public Authentication getAuth(Claims claims) {
    Collection<SimpleGrantedAuthority> authorities = null;
    User principal = null;
    if (claims != null) {
      /**
       * 디비를 거치지 않고 토큰에서 값을 꺼내 바로 시큐리티 유저 객체를
       * 만들어 Authentication을 만들어 반환하기에 유저네임, 권한 외 정보는 알 수 없다.
       */
      authorities =
        Arrays.stream(claims.get(AUTH).toString().split(","))
          .map(SimpleGrantedAuthority::new)
          .collect(Collectors.toList());
      principal = new User(claims.getSubject(), "", authorities);
    } else {
      principal = new User(null, "", null);
    }
    UsernamePasswordAuthenticationToken ret =
      new UsernamePasswordAuthenticationToken(principal, "", authorities);
    ret.setDetails(claims);
    return ret;
  }

  /** 토큰 복호화 분석 */
  public Claims parseToken(String tokenType, String token, HttpServletRequest req) {
    Claims ret = null;
    Object o = null;
    String att = cat(tokenType, token);
    if ((o = req.getAttribute(att)) == null) {
      try {
        Key key = keyAcc;
        if (tokenType == TOK_TYP_REF) { key = keyRef; }
        JwtParser parser = Jwts.parserBuilder().setSigningKey(key).build();
        Jws<Claims> jws = parser.parseClaimsJws(token);
        ret = jws.getBody();
        req.setAttribute(att, ret);
      } catch (Exception e) {
        /** 토큰리프레시의 경우 토큰타입이 다르기때문에 항상 실패함 */
        log.trace("FAIL TO PARSE:{} / {} / {}", e.getMessage(), tokenType, token);
        req.setAttribute(att, EMPTY_OBJ);
      }
      log.trace("JWT-PARSE:{}", ret);
    } else if (o != EMPTY_OBJ) {
      ret = cast(o, ret);
    }
    return ret;
  }
}