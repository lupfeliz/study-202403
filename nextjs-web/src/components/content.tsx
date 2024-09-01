/**
 * @File        : content.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : react(jsx표현식) 에서 순수 html 태그를 사용할 수 없으므로 이를 해결하기 위한 컴포넌트.
 *                <Content html={`<span style="color:#f00">HTML</span>`} /> 처럼 html 태그를 content 속성으로 내포하거나
 *                <Content html={`<script> console.log('OK') </script>`} /> 와 같이 스크립트를 입력하는 용도로도 사용할 수 있다.
 * @Site        : https://devlog.ntiple.com/795
 **/
import { ComponentPropsWithRef } from 'react'
import parse from 'html-react-parser'
import app from '@/libs/app-context'
type ContentProps = ComponentPropsWithRef<'div'> & { html?: string }
export default app.defineComponent((props: ContentProps) => {
  const content = parse(String(props.children || props?.html || ''))
  return (<> {content} </>)
})