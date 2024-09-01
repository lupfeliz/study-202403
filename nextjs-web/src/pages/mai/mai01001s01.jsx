/**
 * @File        : mai01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 메인 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import userContext from '@/libs/user-context'
import { Button, Block, Container } from '@/components'

const { definePage, useSetup } = app

export default definePage(() => {

  const { ready } = useSetup()()
  const userInfo = userContext.getUserInfo()

  return (
  <Container>
    <section className='title'>
      <h2>메인페이지</h2>
    </section>
    <hr/>
    <section>
      <p> 샘플 게시판 어플리케이션 입니다. </p>
      <p> 현재 페이지는 메인페이지 입니다. </p>
      <article>
        { ready() && !(userInfo?.userId) && (
        <Block>
          <Button
            href='/lgn/lgn01001s01'
            >
            로그인
          </Button>
          <Button
            href='/usr/usr01001s01'
            >
            회원가입
          </Button>
        </Block>
        ) }
        <Block>
          <Button
            href='/atc/atc01001s04/1'
            >
            게시판으로 이동
          </Button>
        </Block>
        <Block>
          <Button
            href='/smp/smp01001s01'
            >
            샘플1
          </Button>
        </Block>
        <Block>
          <Button
            href='/smp/smp01001s02'
            >
            샘플2
          </Button>
        </Block>
      </article>
    </section>
  </Container>
  )
})