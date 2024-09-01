/**
 * @File        : checkbox.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 체크박스 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import _Checkbox, { CheckboxProps as _CheckboxProps } from '@mui/material/Checkbox'
import _Radio, { RadioProps as _RadioProps } from '@mui/material/Radio'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

/** mui 기본 체크박스(라디오버튼) 속성 타입 상속  */
type CheckboxProps = _CheckboxProps & _RadioProps & {
  model?: any
  type?: 'checkbox' | 'radio'
}

const { useRef, copyExclude, copyRef, useSetup, defineComponent, modelValue } = app

export default defineComponent((props: CheckboxProps, ref: CheckboxProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model'])
  const elem: any = useRef()
  const self = useSetup({
    props,
    vars: {
      checked: false,
    },
    async mounted() {
      copyRef(ref, elem)
      /** 초기 데이터 화면반영 */
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
    },
    async updated() {
      /** 데이터가 변경되면 실제 화면에 즉시 반영 */
      const { props, value } = modelValue(self())
      vars.checked = props?.value == value
    }
  })
  const { vars, update } = self()
  /** 체크박스 변경 이벤트 발생시 처리 */
  const onChange = async (e: any, v: any) => {
    const { props, setValue } = modelValue(self())
    setValue(v ? props?.value : '')
    vars.checked = v
    update(C.UPDATE_FULL)
  }
  return (
  <>
  {/* 표현타입에 따라 체크박스 또는 라디오버튼 으로 표현된다 */}
  { props.type === 'radio' ? (
    <_Radio ref={ elem } checked={ vars.checked || false } onChange={ onChange } { ...pprops } />
  ) : (
    <_Checkbox ref={ elem } checked={ vars.checked || false } onChange={ onChange } { ...pprops } />
  ) }
  </>
  )
})