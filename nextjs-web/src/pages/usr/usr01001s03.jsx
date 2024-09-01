/**
 * @File        : usr01001s03.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 마이페이지
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import userContext from '@/libs/user-context'
import values from '@/libs/values'
import crypto from '@/libs/crypto'
import * as C from '@/libs/constants'
import { Block, Form, Button, Input, Select, Container } from '@/components'

const { definePage, useSetup, log, goPage, clone } = app
const { matcher } = values
const userInfo = userContext.getUserInfo()

export default definePage(() => {
  const PTN_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  const self = useSetup({
    vars: {
      formdata: {
        id: '',
        userNm: '',
        userId: '',
        passwd: '',
        passwd2: '',
        emailId: '',
        emailHost: '',
        email: '',
      },
      iddupchk: false,
      emailSelector: 'select',
      emailHosts: [
        { name: '선택해 주세요', value: '' },
        'gmail.com',
        'naver.com',
        'daum.net',
        'kakao.com',
        'hotmail.com',
        'icloud.com',
        { name: '직접입력', value: '_' },
      ]
    },
    /** email 등 저장하고 있지 않은 개인정보를 표시하기 위해 불러들임 */
    async mounted() {
      const res = await api.get(`usr01002/${userInfo.userId}`)
      vars.formdata = res
      const email = PTN_EMAIL.exec(vars.formdata.email)
      if (email) {
        vars.formdata.emailId = email[1]
        vars.formdata.emailHost = email[5]
      }
      update(C.UPDATE_ENTIRE)
    }
  })
  const { update, vars, ready } = self()
  const emailHostChanged = async () => {
    if (vars.formdata.emailHost == '_') {
      vars.emailSelector = 'input'
      vars.formdata.emailHost = ''
      update(C.UPDATE_SELF)
    }
  }
  /** validation 진행 후 submit */
  const submit = async () => {
    let msg = ''
    let model = clone(vars.formdata)
    model.email = `${model.emailId}@${model.emailHost}`
    if (!msg && model.passwd && model.passwd.length < 4) { msg = '비밀번호를 4글자 이상 입력해 주세요' }
    if (!msg && model.passwd && !model.passwd2) { msg = '비밀번호 확인을 입력해 주세요' }
    if (!msg && model.passwd && model.passwd !== model.passwd2) { msg = '비밀번호 확인이 맞지 않아요' }
    if (!msg && !model.emailId) { msg = '이메일을 입력해 주세요' }
    if (!msg && !PTN_EMAIL.test(model.email)) { msg = `"${model.email}" 는 올바른 이메일 형식이 아니예요` }
    if (msg) {
      alert(msg)
    } else {
      let result = false
      try {
        /** 필요한 파라메터만 복사한다. */
        Object.keys(model).map((k) => ['id', 'userId', 'passwd', 'email'].indexOf(k) == -1 && delete model[k])
        if (model.passwd) { model.passwd = crypto.aes.encrypt(model.passwd) }
        let res = await api.put(`usr01002`, model)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          result = true
          goPage(-1)
        }
      } catch (e) {
        log.debug('E:', e)
      }
      if (!result) {
        alert('회원 정보 수정에 실패했어요 잠시후 다시 시도해 주세요')
      }
    }
  }
  return (
  <Container>
    <section className='title'>
      <h2>회원정보 수정</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article>
          { ready() && (
          <>
          <Block className='form-block'>
            <p> 이름 : { userInfo.userNm } </p>
          </Block>
          <Block className='form-block'>
            <p> 아이디 : { userInfo.userId } </p>
          </Block>
          </>
          ) }
          <Block className='form-block'>
            <label htmlFor='frm-passwd'>비밀번호</label>
            <Block className='form-element'>
            <Input
              type='password'
              id='frm-passwd'
              model={ vars.formdata }
              name='passwd'
              placeholder='변경시에만 입력해 주세요'
              maxLength={ 30 }
              className='w-full'
              size='small'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd2'>비밀번호확인</label>
            <Block className='form-element'>
            <Input
              type='password'
              id='frm-passwd2'
              model={ vars.formdata }
              name='passwd2'
              placeholder='비밀번호확인'
              maxLength={ 30 }
              className='w-full'
              size='small'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-email'>이메일</label>
            <Block className='form-element email'>
            <Input
              id='frm-email'
              model={ vars.formdata }
              name='emailId'
              placeholder='이메일 아이디'
              maxLength={ 30 }
              size='small'
              />
            <span>@</span>
            { matcher(vars?.emailSelector, 'select', 
              'select', (
                <Select
                  model={ vars.formdata }
                  name='emailHost'
                  options={ vars.emailHosts }
                  onChange={ emailHostChanged }
                  size='small'
                  />
              ),
              'input', (
                <Input
                  model={ vars.formdata }
                  name='emailHost'
                  maxLength={ 30 }
                  size='small'
                  />
              )
            ) }
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