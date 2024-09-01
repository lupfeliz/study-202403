/**
 * @File        : CommonController.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 컨트롤러
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.cmn;

import static my.was.mywas.commons.RestResponse.response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.InitObj;
import my.was.mywas.commons.CommonEntity.Result;

@Slf4j @RestController
@RequestMapping("/api/cmn")
public class CommonController {

  static final String CONTROLLER_TAG1 = "공용 API"; 

  @Autowired CommonService service;

  @PostConstruct public void init() {
    log.trace("INIT:{}", CommonController.class);
  }

  @Operation(summary = "시스템 활성화 여부 체크 (cmn00000000)", tags = { CONTROLLER_TAG1 })
  @GetMapping("/cmn00000")
  public ResponseEntity<Result> cmn00000000() {
    return response(() -> service.cmn00000000());
  }

  @Operation(summary = "최초 접속 환경정보 조회 (cmn01001a01)", tags = { CONTROLLER_TAG1 })
  @GetMapping("/cmn01001")
  public ResponseEntity<InitObj> cmn01001a01() {
    return response(() -> service.cmn01001a01());
  }
}