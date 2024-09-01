/**
 * @File        : LoginController.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 로그인 컨트롤러
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.lgn;

import static my.was.mywas.commons.RestResponse.response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.AuthResult;
import my.was.mywas.commons.CommonEntity.Login;

@Slf4j @RestController
@RequestMapping("/api/lgn")
public class LoginController {

  static final String CONTROLLER_TAG = "로그인 API";

  @Autowired LoginService service;

  @PostConstruct public void init() {
    log.trace("INIT:{}", LoginController.class);
  }

  @Operation(summary = "로그인 (lgn01001a01)", tags = { CONTROLLER_TAG })
  @PostMapping("/lgn01001")
  public ResponseEntity<AuthResult> lgn01001a01(@RequestBody Login login) {
    return response(() -> service.lgn01001a01(login));
  }

  @Operation(summary = "로그인연장 (lgn01002a01)", tags = { CONTROLLER_TAG })
  @PostMapping("/lgn01002")
  public ResponseEntity<AuthResult> lgn01002a01() {
    /** 헤더로 입력된 리프레시 토큰을 사용한다 */
    return response(() -> service.lgn01002a01());
  }
}