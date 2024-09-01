/**
 * @File        : UserRepository.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원정보관리 JPA repository
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.usr;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** JPA 에서는 기본적으로 메소드명으로 질의문을 자동생성 가능하므로 필요한 질의문만 기술한다 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  /** 회원id 가 존재하는지 체크 */
  Integer countByUserIdEquals(String userId) throws Exception;

  /** 회원Id 로 회원정보 조회 */
  User findOneByUserIdEquals(String userId) throws Exception;

  /** 회원일련번호 로 회원정보조회 */
  User findOneById(Long id) throws Exception;
}