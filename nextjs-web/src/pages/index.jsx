/**
 * @File        : index.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 최초 진입 페이지
 *                최초 페이지 이므로 기능없이 샘플페이지 이동용 버튼만 작성한다.
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import { Button, Container } from '@/components'

export default app.definePage((props) => {
  return (
  <Container>
    <section className='title'>
      <h2>INDEX PAGE</h2>
    </section>
    <hr/>
    <section>
      <Button
        href='/smp/smp01001s01'
        >
        컴포넌트샘플
      </Button>
      <Button
        href='/smp/smp01001s02'
        >
        통신샘플
      </Button>
    </section>
  </Container>
  )
})