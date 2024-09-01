/**
 * @File        : lgn01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 로그인 페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import crypto from '@/libs/crypto'
import * as C from '@/libs/constants'
import { Form, Block, Button, Container, Input } from '@/components'

const { definePage, useSetup, clone, log, goPage } = app

export default definePage(() => {

  const self = useSetup({
    vars: {
      formdata: {
        userId: '',
        passwd: '',
      }
    }
  })

  const { vars } = self()

  const submit = async () => {
    const formdata = clone (vars.formdata)
    formdata.passwd = crypto.aes.encrypt(formdata.passwd)
    try {
      const res = await api.post(`lgn01001`, formdata)
      log.debug('RES:', res)
      if (res.rescd === C.RESCD_OK) {
        goPage(-1)
      } else {
        alert('로그인이 실패했습니다')
      }
    } catch (e) {
      log.debug('E:', e)
      if (e?.msgcode == 'USER_NOT_FOUND') {
        alert('사용자 아이디 혹은 비밀번호가 잘못되었어요')
      } else {
        alert(e?.message || '오류가 발생했어요')
      }
    }
  }

  return (
  <Container>
    <section className='title'>
      <h2>로그인</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article className='text-center'>
          <Block className='form-block'>
            <label htmlFor='frm-user-id'> 아이디 </label>
            <Block className='form-element'>
            <Input
              id='frm-user-id'
              model={ vars.formdata }
              name='userId'
              placeholder='로그인 아이디'
              maxLength={ 20 }
              className='w-full'
              size='small'
              onEnter={ submit }
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd'> 비밀번호 </label>
            <Block className='form-element'>
            <Input
              id='frm-passwd'
              type='password'
              model={ vars.formdata }
              name='passwd'
              placeholder='비밀번호'
              maxLength={ 20 }
              className='w-full'
              size='small'
              onEnter={ submit }
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
              로그인
            </Button>
            <Button
              className='mx-1'
              variant='outlined'
              size='large'
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