/**
 * @File        : SecurityConfig.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Spring-Security 설정파일
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.configs;

import static my.was.mywas.commons.Constants.TOK_TYP_ACC;
import static my.was.mywas.commons.WebUtils.getAuthToken;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.filter.GenericFilterBean;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.TokenProvider;

@Slf4j @Configuration
@EnableWebSecurity @EnableMethodSecurity 
public class SecurityConfig {

  @Autowired private CorsFilter corsFilter;
  @Autowired private AuthFilter authFilter;
  @Autowired private JwtAuthenticationEntryPoint authPoint;
  @Autowired private JwtAccessDeniedHandler authHandler;

  /** URL 패턴매칭 */
  private static AntPathRequestMatcher matcher(HttpMethod m, String path) {
    if (m != null) {
      return AntPathRequestMatcher.antMatcher(m, path);
    } else {
      return AntPathRequestMatcher.antMatcher(path);
    }
  }

  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    /** 전체공개 (인증없이 접근 가능한 목록) */
    List<RequestMatcher> reqPubLst = new ArrayList<>();
    /** 회원 사용자만 허용 */
    List<RequestMatcher> reqMbrLst = new ArrayList<>();
    /** 웹리소스 */
    List<RequestMatcher> reqWebLst = new ArrayList<>();

    reqPubLst.addAll(List.of(
      /** GET /api/cmn/* (공용API) */
      matcher(GET, "/api/cmn/**"),
      /** GET /api/usr/usr01001a01/** (마이페이지) */
      matcher(GET, "/api/usr/usr01001/**"),
      /** PUT /api/usr/** (회원가입) */
      matcher(PUT, "/api/usr/**"),
      /** POST /api/lgn/ (로그인) */
      matcher(POST, "/api/lgn/**"),
      /** POST /api/atc/atc01001/ (게시물 검색) */
      matcher(POST, "/api/atc/atc01001"),
      /** POST /api/atc/atc01001/ (게시물 상세조회) */
      matcher(GET, "/api/atc/atc01001/**"),
      /** H2DB웹콘솔 */
      matcher(null, "/h2-console/**"),
      /** 스웨거(OPENAPI) */
      matcher(null, "/swagger/swagger-ui/**"),
      matcher(null, "/swagger/swagger-resources/**"),
      matcher(null, "/swagger/v3/api-docs/**")
    ));

    /** 기타 /api 로 시작되는 모든 리퀘스트 들은 권한 필요 */
    reqMbrLst.addAll(List.of(
      matcher(null, "/api/**")
    ));

    reqWebLst.addAll(List.of(
      /** 기타 GET 메소드로 접근하는 모든 웹 리소스 URL */
      matcher(GET, "/**")
    ));

    final RequestMatcher[] reqPub = reqPubLst.toArray(new RequestMatcher[]{ });
    final RequestMatcher[] reqMbr = reqMbrLst.toArray(new RequestMatcher[]{ });
    final RequestMatcher[] reqWeb = reqWebLst.toArray(new RequestMatcher[]{ });
    log.debug("PUBLIC-ALLOWED:{}{}", "", reqPub);
    http
      /** token을 사용하는 방식이므로 csrf disable */ 
      .csrf(csrf -> csrf.disable())
      .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
      .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
      .exceptionHandling(exh -> exh
        /** 인증 실패 핸들링 */
        .authenticationEntryPoint(authPoint)
        /** 권한인가실패 핸들링 */
        .accessDeniedHandler(authHandler)
      )
      .headers(hdr ->
        hdr.frameOptions(frm -> frm.sameOrigin())
          /** 동일 사이트 referer */
          .referrerPolicy(ref -> ref.policy(ReferrerPolicy.SAME_ORIGIN))
          /** xss 보호 */
          .xssProtection(xss -> xss.disable())
      )
      /** 세션 사용하지 않음 */
      .sessionManagement(mng -> mng
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      /** URI별 인가설정 */
      .authorizeHttpRequests(req -> req
        // .anyRequest().permitAll()
        /** 전체공개 (인증없이 접근 가능한 목록) */
        .requestMatchers(reqPub).permitAll()
        /** 회원 사용자만 허용 */
        .requestMatchers(reqMbr).hasAnyAuthority("ROLE_USER")
        /** 웹리소스 */
        .requestMatchers(reqWeb).permitAll()
        .anyRequest()
          .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
      )
      /** 폼 로그인 불가 */
      .formLogin(login -> login.disable())
      /** 폼 로그아웃 불가 */
      .logout(logout -> logout.disable())
      /** 임의유저 불가 */
      .anonymous(anon -> anon.disable())
      ;
    SecurityFilterChain ret = http.build();
    return ret;
  }

  @Component public static class AuthFilter extends GenericFilterBean {
    /** 토큰발급기 */
    @Autowired TokenProvider tokenProvider;
    @Override public void doFilter(ServletRequest sreq, ServletResponse sres, FilterChain chain)
      throws IOException, ServletException {
      HttpServletRequest req = (HttpServletRequest) sreq;
      req.setAttribute(HttpServletResponse.class.getName(), sres);
      String token = getAuthToken(req);
      log.trace("TOKEN:{}", token);
      Claims claims = null;
      /** 토큰이 정상검증되면 인증정보를 현재 컨텍스트(리퀘스트) 에 저장한다. */
      if (token != null && (claims = tokenProvider.parseToken(TOK_TYP_ACC, token, req)) != null) {
        Authentication auth = tokenProvider.getAuth(claims);
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
      chain.doFilter(sreq, sres);
    }
  }

  /** 인증 실패 핸들링 */
  @Component public static class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override public void commence(HttpServletRequest req, HttpServletResponse res,
      AuthenticationException e) throws IOException, ServletException {
      log.debug("AUTH-ERR:{} {}", req.getRequestURI(), e.getMessage());
      res.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.name());
    }
  }

  /** 권한인가실패 핸들링 */
  @Component public static class JwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override public void handle(HttpServletRequest req, HttpServletResponse res,
      AccessDeniedException e) throws IOException, ServletException {
      log.debug("ACCESS-DENIED:{}", e.getMessage());
      res.sendError(HttpStatus.FORBIDDEN.value(), HttpStatus.FORBIDDEN.name());
    }
  }

  /** Cross Origin Resource Sharing 필터링 (일단은 전부허용)  */
  @Configuration public static class CorsFilterConfig {
    @Bean public CorsFilter corsFilter() {
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      CorsConfiguration cfg = new CorsConfiguration();
      cfg.setAllowCredentials(true);
      cfg.addAllowedOriginPattern("*");
      cfg.addAllowedHeader("*");
      cfg.addAllowedMethod("*");
      source.registerCorsConfiguration("/api/**", cfg);
      return new CorsFilter(source);
    }
  }
}