/**
 * @File        : Constants.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통으로 사용하는 상수들을 정의한다
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

public interface Constants {
  static final String AUTH = "auth";
  static final String AUTHORIZATION = "Authorization";
  static final String BEARER = "Bearer";
  static final String CONTENT_DISPOSITION = "Content-disposition";
  static final String CONTENT_TYPE = "Content-type";
  static final String CTYPE_FILE = " application/octet-stream";
  static final String CTYPE_FORM = "application/x-www-form-urlencoded";
  static final String CTYPE_HTML = "text/html";
  static final String CTYPE_JSON = "application/json";
  static final String CTYPE_MULTIPART = "multipart/form-data";
  static final String CTYPE_TEXT = "text/plain";
  static final String EXTRA_INFO = "extraInfo";
  static final String PROF_DEV = "dev";
  static final String PROF_LOCAL = "local";
  static final String PROF_MY = "my";
  static final String PROF_PROD = "prod";
  static final String REFERER = "Referer";
  static final String ROLE_ADMIN = "ROLE_ADMIN";
  static final String ROLE_USER = "ROLE_USER";
  static final String STATIC_ACCESS = "static-access";
  static final String TOK_TYP_ACC = "ACC";
  static final String TOK_TYP_REF = "REF";
  static final String X_FORWARDED_FOR = "X-Forwarded-For";
  static final String KOKR = "ko-KR";
  static final String RESCD_OK = "0000";
  static final String RESCD_FAIL = "9999";
  static final String NOT_PERMITTED_USER = "NOT PERMITTED USER";
  static final String ISO88591 = "ISO8859-1";
}