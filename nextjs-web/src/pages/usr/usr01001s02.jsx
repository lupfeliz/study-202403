/**
 * @File        : usr01001s02.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 가입완료
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import { Block, Form, Button, Container, Lottie } from '@/components'

const { definePage, goPage } = app

export default definePage(() => {
  return (
  <Container>
    <section className='title'>
      <h2>회원가입 완료</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article className='text-center'>
          <Block>
            <p>
              가입이 완료되었어요
            </p>
            <Lottie
              src='/assets/lottie/hello.json'
              />
          </Block>
          <Block>
            <Button
              variant='contained'
              onClick={() => goPage(-1) }
              >
              이전 페이지로 이동
            </Button>
          </Block>
        </article>
      </Form>
    </section>
  </Container>
  )
})