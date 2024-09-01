/**
 * @File        : block.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 아무런 역할을 하지 않는 일반 div 블럭과 동일
 *                jsx 태그 영역에서 영역구분을 위한 용도로 작성 (단순하게 태그 이름 구분을 위한 컴포넌트)
 * @Site        : https://devlog.ntiple.com/795
 **/
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type BlockProps = ComponentPropsWithRef<'div'> & { }
export default app.defineComponent((props: BlockProps, ref: BlockProps['ref']) => {
  return ( <div ref={ ref } { ...props }> { props.children } </div> )
})