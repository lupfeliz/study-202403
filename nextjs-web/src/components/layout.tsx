/**
 * @File        : layout.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 기본 레이아웃 컴포넌트
 *                페이지 트랜지션이 적용된 기본 레이아웃, Header 와 Footer 요소가 존재함.
 * @Site        : https://devlog.ntiple.com/795
 **/
import { motion, HTMLMotionProps } from 'framer-motion'
import app from '@/libs/app-context'
import Header from './header'
import Footer from './footer'

type LayoutProps = HTMLMotionProps<'div'>
export default app.defineComponent((props: LayoutProps, ref: any) => {
  const { children, ...rest } = props
  return (
    <>
      {/* 머리말(HEADER) 영역 */}
      <Header />
      {/* 페이징 트랜지션, goPage 로 이동시 트랜지션이 걸린다 */}
      <motion.main
        ref={ ref }
        initial={ { x: '5%', opacity: 0 } }
        animate={ { x: 0, opacity: 1 } }
        exit={ { x: '-5%', opacity: 0 } }
        transition={ { duration: 0.25, ease: 'easeInOut' } }
        { ...rest }
        >
        {/* 페이지 내용 */}
        { children as any }
      </motion.main>
      {/* 꼬리말(FOOTER) 영역 */}
      <Footer />
    </>
  )
})