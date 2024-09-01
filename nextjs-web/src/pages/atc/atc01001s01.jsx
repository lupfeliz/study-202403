/**
 * @File        : atc01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 작성 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import * as C from '@/libs/constants'
import { Block, Button, Container, Form, Editor } from '@/components'
import Input from '@/components/input'
import $ from 'jquery'

const { definePage, useSetup, log, clone, goPage } = app

export default definePage(() => {
  const self = useSetup({
    vars: {
      formdata: {
        title: '',
        contents: '',
      }
    },
    async mounted() {
    }
  })

  const { vars, update } = self()

  const submit = async () => {
    let msg = ''
    let model = clone(vars.formdata)
    const contents = String($(model.contents).text()).trim()
    if (!msg && !model.title) { msg = '제목을 입력해 주세요' }
    if (!msg && model.title.length < 2) { msg = '제목을 2글자 이상 입력해 주세요' }
    if (!msg && !contents) { msg = '내용을 입력해 주세요' }
    if (!msg && contents.length < 2) { msg = '내용을 2글자 이상 입력해 주세요' }
    if (msg) {
      alert(msg)
    } else {
      let result = false
      try {
        /** 필요한 파라메터만 복사한다. */
        Object.keys(model).map((k) => ['title', 'contents'].indexOf(k) == -1 && delete model[k])
        log.debug('CHECK:', model)
        const res = await api.put(`atc01001`, model)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          result = true
          goPage(-1)
        }
      } catch (e) {
        msg = e?.message
        log.debug('E:', e)
      }
      if (!result) {
        alert(msg || '새글 쓰기에 실패했어요 잠시후 다시 시도해 주세요')
      }
    }
  }

  return (
  <Container>
    <section className='title'>
      <h2>새글 작성</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article>
          <Block className='form-block'>
            <label htmlFor='frm-title'> 제목 </label>
            <Block className='form-element'>
              <Input
                id='frm-title'
                model={ vars.formdata }
                name='title'
                placeholder='제목'
                maxLength={ 20 }
                className='w-full'
                size='small'
                />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-contents'> 내용 </label>
            <Block className='form-element editor'>
              <Editor
                id='frm-contents'
                model={ vars.formdata }
                name='contents'
                className='w-full'
                size='small'
                />
            </Block>
          </Block>
          <hr/>
          <Block className='buttons'>
            <Button
              className='mx-1'
              variant='contained'
              size='large'
              onClick={ submit }
              >
              완료
            </Button>
            <Button
              className='mx-1'
              variant='outlined'
              size='large'
              onClick={ () => goPage(-1) }
              >
              취소
            </Button>
          </Block>
        </article>
      </Form>
    </section>
  </Container>
  )
})