/**
 * @File        : smp01001s02.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 통신 샘플
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import * as C from '@/libs/constants'
import crypto from '@/libs/crypto'
import { Button, Block, Container } from '@/components'
import userContext from '@/libs/user-context'

const { log, definePage, useSetup, goPage, getParameter } = app

export default definePage((props) => {
  const self = useSetup({
    vars: {
      aeskey: '',
      userInfo: { },
      articles: [ ],
      message: ''
    },
    async mounted() {
      log.debug('CHECKPARAM:', getParameter())
    }
  })
  const { update, vars } = self()
  const onClick = async (v) => {
    try {
      vars.message = ''
      switch (v) {
      case 0: {
        /** 통신암호 초기화 */
        const res = await api.get(`cmn01001`, {})
        const check = res?.check || ''
        log.debug('RES:', res?.check, app.getConfig().security.key.rsa)
        await crypto.rsa.init(app.getConfig().security.key.rsa, C.PRIVATE_KEY)
        vars.aeskey = crypto.rsa.decrypt(check)
        update(C.UPDATE_SELF)
      } break
      case 1: {
        /** 로그인 (테스트계정) */
        await crypto.aes.init(vars.aeskey)
        const res = await api.post(`lgn01001`, {
          userId: `tester`,
          passwd: `${crypto.aes.encrypt('test12#')}`
        })
        log.debug('RES:', res)
        vars.userInfo = userContext.getUserInfo()
        log.debug('USER:', vars.userInfo)
        update(C.UPDATE_FULL)
      } break
      case 2: {
        /** 로그아웃 */
        userContext.logout()
        vars.userInfo = userContext.getUserInfo()
        update(C.UPDATE_FULL)
      } break
      case 3: {
        /** 게시물 조회 */
        const res = await api.post(`atc01001`, {
          searchType: '',
          keyword: '',
          rowStart: 0,
          rowCount: 10,
        })
        log.debug('RES:', res)
        vars.articles = res?.list || []
        update(C.UPDATE_FULL)
      } break
      default: }
    } catch (e) {
      log.debug('E:', e)
      vars.message = e.message
      update(C.UPDATE_FULL)
    }
  }
  return (
  <Container>
    <section className='title'>
      <h2>통신샘플</h2>
    </section>
    <hr/>
    <section>
      <Block>
        <Button
          className='mx-1'
          onClick={ () => goPage(-1) }
          >
          뒤로가기
        </Button>
        <Button
          className='mx-1'
          onClick={ () => onClick(0) }
          >
          통신암호초기화
        </Button>
        <Button
          className='mx-1'
          onClick={ () => onClick(1) }
          >
          로그인
        </Button>
        <Button
          className='mx-1'
          onClick={ () => onClick(2) }
          >
          로그아웃
        </Button>
        <Button
          className='mx-1'
          onClick={ () => onClick(3) }
          >
          게시물조회
        </Button>
      </Block>
      <Block>
        AES 암호화 키 : { vars.aeskey }
      </Block>
      <Block>
        로그인정보 : { JSON.stringify(vars.userInfo) }
      </Block>
      <Block>
        게시물목록 : { JSON.stringify(vars.articles) }
      </Block>
      <Block>
        메시지 : <span style={{ color: '#f00' }}>{vars.message}</span>
      </Block>
    </section>
  </Container>
  )
})