/**
 * @File        : button.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 버튼 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import _Button, { ButtonProps as _ButtonProps } from '@mui/material/Button'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'

type ButtonProps = _ButtonProps & {
  href?: any
  param?: any
}

export default app.defineComponent((props: ButtonProps, ref: ButtonProps['ref']) => {
  const onClick = async (e: any) => {
    /** 버튼이지만 href 속성이 있다면 a 태그처럼 작동한다 */
    if (props.href !== C.UNDEFINED) {
      e && e.preventDefault()
      e && e.stopPropagation()
      app.goPage(props.href, props.param)
    }
    if (props?.onClick) { props.onClick(e as any) }
  }
  return (
    <_Button ref={ ref } onClick={ onClick } { ...props }>
      { props.children }
    </_Button>
  )
})