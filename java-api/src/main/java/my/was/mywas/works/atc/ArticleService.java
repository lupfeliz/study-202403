/**
 * @File        : ArticleService.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 서비스
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.atc;

import static com.ntiple.commons.ConvertUtil.convert;
import static my.was.mywas.commons.Constants.NOT_PERMITTED_USER;
import static my.was.mywas.commons.Constants.RESCD_OK;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.ApiException;
import my.was.mywas.commons.CommonEntity.AuthDetail;
import my.was.mywas.commons.CommonEntity.Result;
import my.was.mywas.commons.CommonEntity.SearchEntity;

@Slf4j @Service
public class ArticleService {

  @Autowired private ArticleRepository repository;

  @PostConstruct public void init() {
    log.trace("INIT:{}", ArticleService.class);
  }

  /** 게시글 조회 */
  public Article atc01001a02(Long id) throws Exception {
    Article ret = null;
    ret = repository.findOneByIdEquals(id);
    return ret;
  }

  /** 글 검색 */
  public SearchEntity<Article> atc01001a04(SearchEntity<?> prm) throws Exception {
    SearchEntity<Article> ret = convert(prm, new SearchEntity<>());
    Integer total = repository.countArticles(prm.getSearchType(), prm.getKeyword());
    List<Article> list = repository.searchArticles(prm.getSearchType(), prm.getKeyword(),
      prm.getOrderType(), prm.getPageable());
    ret.setRowTotal(total);
    ret.setList(list);
    return ret;
  }

  /** 글 저장 */
  public Result atc01001a01(Article prm) throws Exception {
    Result ret = new Result();
    log.debug("PRM:{}", prm);
    Article article = prm;
    Date date = new Date();
    Long pid = prm.getId();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String userId = auth.getName();
    if (pid != null && pid != 0) {
      /** 본인이 쓴 글인지 먼저 확인해야 한다. */
      article = repository.findOneByIdEquals(pid);
      if (article != null && article.getUserId() != null) {
        if (userId == null || !userId.equals(article.getUserId())) {
          throw new ApiException(0, NOT_PERMITTED_USER);
        }
        article.setTitle(prm.getTitle());
        article.setContents(prm.getContents());
        article.setUtime(date);
        repository.save(article);
        ret.setRescd(RESCD_OK);
      }
    } else {
      /** 새글등록 */
      AuthDetail detail = convert(auth.getDetails(), new AuthDetail());
      String num = String.valueOf(repository.getMaxNumber(article.getBoardId()) + 1);
      article.setBoardId(1L);
      article.setNum(num);
      article.setUserId(userId);
      article.setUserNm(detail.getExtraInfo().getUserNm());
      article.setCtime(date);
      article.setUtime(date);
      repository.save(article);
      ret.setRescd(RESCD_OK);
    }
    return ret;
  }

  /** 글 삭제 */
  public Result atc01001a03(Long id) throws Exception {
    Result ret = new Result();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String userId = auth.getName();
    Article article = null;
    /** 본인이 쓴 글인지 먼저 확인해야 한다. */
    article = repository.findOneByIdEquals(id);
    if (article != null && article.getUserId() != null) {
      if (userId == null || !userId.equals(article.getUserId())) {
        throw new ApiException(0, NOT_PERMITTED_USER);
      }
      repository.deleteById(id);
    }
    return ret;
  }
}