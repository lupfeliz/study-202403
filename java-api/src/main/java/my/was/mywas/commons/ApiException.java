/**
 * @File        : ApiException.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 API Exception
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.cat;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @ToString @Builder
public class ApiException extends RuntimeException {
  public HttpStatus status;
  public Integer errcd;
  public String errmsg;

  public ApiException(Integer errcd, String errmsg) {
    super(cat("[", errcd, "]", errmsg, ""));
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.errcd = errcd;
    this.errmsg = errmsg;
  }

  public ApiException(Integer errcd, String errmsg, HttpStatus status) {
    super(cat("[", errcd, "]", errmsg, "/", status));
    this.status = status;
    this.errcd = errcd;
    this.errmsg = errmsg;
  }
}