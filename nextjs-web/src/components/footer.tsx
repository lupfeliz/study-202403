/**
 * @File        : footer.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 꼬리말 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import $ from 'jquery'
import lodash from 'lodash'
import app from '@/libs/app-context'
import { Container } from '@/components'

const { defineComponent, useSetup, useRef } = app
const { debounce } = lodash
const evtlst = ['scroll', 'resize']
export default defineComponent(() => {
  const eref = useRef({} as HTMLDivElement)
  useSetup({
    async mounted({ releaser }) {
      evtlst.map(v => window.addEventListener(v, fncResize))
      fncResize()
    },
    async unmount() {
      evtlst.map(v => window.removeEventListener(v, fncResize))
    }
  })
  const fncResizePost = debounce(() => {
    const page = $('html,body')
    /** footer sticky 기능을 위해 css 변수를 수정한다 */
    const footer = eref.current || {}
    {[
      '--screen-height', `${window.innerHeight || 0}px`,
      '--scroll-top', `${page.scrollTop()}px`,
      '--footer-height', `${footer?.offsetHeight || 0}px`
    ].map((v, i, l) => (i % 2) &&
      footer?.style?.setProperty(l[i - 1], v))}
    footer?.classList?.remove('hide')
  }, 10)
  const fncResize = () => {
    eref?.current?.classList?.add('sticky', 'hide')
    fncResizePost()
  }
  return (
    <footer ref={ eref }>
    <Container>
      FOOTER
    </Container>
    </footer>
  )
})