/**
 * @File        : usr01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원가입
 * @Site        : https://devlog.ntiple.com/795
 **/
import app from '@/libs/app-context'
import api from '@/libs/api'
import values from '@/libs/values'
import crypto from '@/libs/crypto'
import * as C from '@/libs/constants'
import { Block, Form, Button, Input, Select, Container } from '@/components'

const { definePage, useSetup, log, goPage, clone, sleep } = app
const { matcher } = values

export default definePage(() => {
  const PTN_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  const self = useSetup({
    vars: {
      formdata: {
        userNm: '',
        userId: '',
        passwd: '',
        passwd2: '',
        emailId: '',
        emailHost: '',
        email: ''
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
    async mounted() {
      log.debug('USR01001S01 - MOUNTED!')
    }
  })
  const { update, vars } = self()
  const emailHostChanged = async () => {
    /** 직접입력인 경우 입력컴포넌트 전환 */
    if (vars.formdata.emailHost == '_') {
      vars.emailSelector = 'input'
      vars.formdata.emailHost = ''
      update(C.UPDATE_SELF)
    }
  }
  const checkUserId = async () => {
    const model = vars.formdata
    vars.iddupchk = false
    if (model.userId) {
      model.userId = String(model.userId)
        .toLowerCase().replace(/[^a-zA-Z0-9]+/, '')
      const res = await api.get(`usr01001/${model.userId}`)
      if (res?.rescd !== C.RESCD_OK) {
        alert(`"${model.userId}" 는 이미 사용중이거나 사용할수 없어요.`)
      } else {
        vars.iddupchk = true
        alert(`"${model.userId}" 는 사용 가능해요.`)
      }
      update(C.UPDATE_FULL)
    } else {
      alert('아이디를 입력해 주세요')
    }
  }
  /** 회원가입, was 에 전달하기 전에 validation 부터 수행한다. */
  const submit = async () => {
    let msg = ''
    let model = clone(vars.formdata)
    model.email = `${model.emailId}@${model.emailHost}`
    if (!msg && !model.userNm) { msg = '이름을 입력해 주세요' }
    if (!msg && model.userNm.length < 2) { msg = '이름을 2글자 이상 입력해 주세요' }
    if (!msg && !model.userId) { msg = '아이디를 입력해 주세요' }
    if (!msg && model.userId.length < 4) { msg = '아이디를 4글자 이상 입력해 주세요' }
    if (!msg && !vars.iddupchk) { msg = '아이디 중복확인을 수행해 주세요' }
    if (!msg && !model.passwd) { msg = '비밀번호를 입력해 주세요' }
    if (!msg && model.passwd.length < 4) { msg = '비밀번호를 4글자 이상 입력해 주세요' }
    if (!msg && !model.passwd2) { msg = '비밀번호 확인을 입력해 주세요' }
    if (!msg && model.passwd !== model.passwd2) { msg = '비밀번호 확인이 맞지 않아요' }
    if (!msg && !model.emailId) { msg = '이메일을 입력해 주세요' }
    if (!msg && !PTN_EMAIL.test(model.email)) { msg = `"${model.email}" 는 올바른 이메일 형식이 아니예요` }
    if (msg) {
      alert(msg)
    } else {
      let result = false
      // dialog.progress(true)
      try {
        /** 필요한 파라메터만 복사한다. */
        Object.keys(model).map((k) => ['userNm', 'userId', 'passwd', 'email'].indexOf(k) == -1 && delete model[k])
        model.passwd = crypto.aes.encrypt(model.passwd)
        let res = await api.put(`usr01001`, model)
        log.debug('RES:', res)
        if (res.rescd === C.RESCD_OK) {
          result = true
          await goPage(-1)
          await goPage(`/usr/usr01001s02`)
        }
      } catch (e) {
        log.debug('E:', e)
      }
      // thread(() => { dialog.progress(false) }, 500)
      if (!result) {
        alert('회원 등록에 실패했어요 잠시후 다시 시도해 주세요')
      }
    }
  }
  return (
  <Container>
    <section className='title'>
      <h2>회원가입</h2>
    </section>
    <hr/>
    <section className='flex-form'>
      <Form>
        <article>
          <Block className='form-block'>
            <label htmlFor='frm-user-nm'> 이름 </label>
            <Block className='form-element'>
            <Input
              id='frm-user-nm'
              model={ vars.formdata }
              name='userNm'
              placeholder='이름'
              maxLength={ 20 }
              className='w-full'
              size='small'
              />
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-user-id'>아이디</label>
            <Block className='form-element user-id'>
            <Input
              id='frm-user-id'
              model={ vars.formdata }
              name='userId'
              placeholder='영문자로 시작, 12자 이내'
              maxLength={ 12 }
              className='w-full'
              size='small'
              />
            <Button
              variant='contained'
              color='inherit'
              onClick={ checkUserId }
              >
              중복확인
            </Button>
            </Block>
          </Block>
          <Block className='form-block'>
            <label htmlFor='frm-passwd'>비밀번호</label>
            <Block className='form-element'>
            <Input
              type='password'
              id='frm-passwd'
              model={ vars.formdata }
              name='passwd'
              placeholder='영문자, 숫자, 특수기호 각 1개이상'
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