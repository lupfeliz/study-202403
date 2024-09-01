/**
 * @File        : atc01001s03/[articleid].jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 수정 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import * as C from '@/libs/constants'
import userContext from '@/libs/user-context'
import { Container, Block, Button, Link, Content } from '@/components'
import moment from 'moment'

const { definePage, useSetup, log, putAll, clone, getParameter, goPage } = app

export default definePage(() => {
  const self = useSetup({
    vars: {
      data: {
        id: '',
        title: '',
        contents: '',
        userId: '',
        userNm: '',
        ctime: ''
      },
    },
    async mounted() {
      loadData(getParameter('articleid'))
    }
  })
  const userInfo = userContext.getUserInfo()
  const { vars, update, ready } = self()

  const loadData = async (articleId) => {
    const res = await api.get(`atc01001/${articleId}`)
    vars.data = clone(res)
    log.debug('RES:', res)
    update(C.UPDATE_FULL)
  }

  const print = {
    cdate: (date) => date && moment(date).format('YYYY-MM-DD'),
  }
  return (
  <Container>
    <section className='title'>
      <h2>{ vars.data?.title || '게시물 조회' }</h2>
      { ready() && (userInfo?.userId || '') == vars.data?.userId && (
        <Button
          variant='contained'
          href={`/atc/atc01001s02/${vars.data?.id}`}
          >
          글수정
        </Button>
      ) }
    </section>
    <hr/>
    <section>
      <article>
        <Block> 
          <p> 작성자 : { vars.data.userNm } </p>
          <p> 작성일시 : { print.cdate(vars.data.ctime) } </p>
        </Block>
        <hr/>
        <Block className='w-full overflow-x-auto'>
          <Content html={ vars.data?.contents || '' } />
        </Block>
      </article>
    </section>
  </Container>
  )
})