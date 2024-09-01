/**
 * @File        : form.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 폼 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import { ComponentPropsWithRef } from 'react'
import app from '@/libs/app-context'
type FormProps = ComponentPropsWithRef<'form'> & { }
export default app.defineComponent((props: FormProps, ref: FormProps['ref']) => {
  return ( <form ref={ ref } { ...props }> { props.children } </form> )
})