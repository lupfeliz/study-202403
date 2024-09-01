/**
 * @File        : container.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 컨테이너 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import _Container, { ContainerProps as _ContainerProps } from '@mui/material/Container'
import app from '@/libs/app-context'
type ContainerProps = _ContainerProps & { }
export default app.defineComponent((props: ContainerProps, ref: ContainerProps['ref']) => {
  return ( <_Container ref={ ref } { ...props }> { props.children } </_Container> )
})