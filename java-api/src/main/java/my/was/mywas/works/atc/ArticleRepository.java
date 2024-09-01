/**
 * @File        : ArticleRepository.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물정보 JPA Repository
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.atc;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ArticleRepository extends JpaRepository<Article, Long> {

  /** 게시물 상세 조회 (JPA 메소드명에 의한 자동생성) */
  Article findOneByIdEquals(Long id);

  /** 게시물 갯수 조회 (named-query) */
  Integer countArticles(String searchType, String keyword);

  /** 게시물 검색 (named-query) */
  List<Article> searchArticles(String searchType, String keyword, String orderType, Pageable pageable);

  /** 다음 게시물 번호 조회 (named-query) */
  Integer getMaxNumber(Long boardId);

  /** 게시물 검색 ( SQL 질의문 사용 ) */
  @Query(nativeQuery = true)
  List<Article> searchArticlesUsingNative(String searchType, String keyword);
}