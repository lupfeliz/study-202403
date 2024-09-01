/**
 * @File        : _document.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 정적 엔트리 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import { Html, Head, Main, NextScript } from 'next/document'
import { Content } from '@/components'
import app from '@/libs/app-context'

export default app.definePage(() => {
  return (
  <Html>
    <Head>
      {/* 페이지 hard-loading 시 적용할 기본 transition */}
      <Content html={`
        <style type="text/css">
          body { transition: opacity 0.4s 0.2s ease }
          .hide-onload { opacity: 0; }
        </style>`}
        />
    </Head>
    {/* hide-onload 클래스가 사라지면 트랜지션이 시작된다. */}
    <body className='hide-onload'>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
})