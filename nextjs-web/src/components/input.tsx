/**
 * @File        : input.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 입력 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import _TextField, { TextFieldProps as _TextFieldProps } from '@mui/material/TextField'
import $ from 'jquery'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

type InputProps = _TextFieldProps & {
  model?: any
  onEnter?: Function
  maxLength?: number
  inputMode?: string
  pattern?: string
}

const { copyExclude, useRef, copyRef, useSetup, defineComponent, modelValue } = app
export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'onEnter', 'maxLength', 'inputMode', 'pattern'])
  const iprops = props?.inputProps || {}
  const elem: any = useRef()
  const self = useSetup({
    name: 'input',
    props,
    vars: { },
    async mounted() {
      copyRef(ref, elem)
      /** 최초상태 화면반영 */
      $(elem?.current).find('input').val(modelValue(self())?.value || '')
    },
    async updated(mode) {
      if (mode && vars) {
      /** 화면 강제 업데이트 발생시 화면반영 */
        $(elem?.current).find('input').val(modelValue(self())?.value || '')
      }
    }
  })
  const { vars, update } = self()
  /** 입력컴포넌트 변경이벤트 처리 */
  const onChange = async (e: any) => {
    const { setValue } = modelValue(self())
    const v = $(elem?.current).find('input').val()
    /** 변경시 데이터모델에 값전달 */
    setValue(v, () => update(C.UPDATE_FULL))
    if (props.onChange) { props.onChange(e as any) }
  }
  /** 입력컴포넌트 키입력 이벤트 처리 */
  const onKeyDown = async (e: any) => {
    const keycode = e?.keyCode || 0
    switch (keycode) {
    case 13: {
      if (props.onEnter) { props.onEnter(e) }
    } break
    }
  }
  return (
  <_TextField ref={ elem }
    onChange={ onChange }
    onKeyDown={ onKeyDown }
    hiddenLabel
    inputProps={{
      maxLength: props?.maxLength || iprops?.maxLength,
      inputMode: props?.inputMode || iprops?.inputMode,
      pattern: props?.pattern || iprops?.pattern
    }}
    { ...pprops }
    />
  )
})