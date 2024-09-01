/**
 * @File        : select.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 선택 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import _Select, { SelectProps as _SelectProps } from '@mui/material/Select'
import _MenuItem from '@mui/material/MenuItem'
import * as C from '@/libs/constants'
import app from '@/libs/app-context'

/** 선택목록 타입 */
type OptionType = {
  name?: string
  value?: any
  selected?: boolean
}
/** mui 선택기 타입 상속 */
type InputProps = _SelectProps & {
  model?: any
  options?: OptionType[]
}

const { useRef, copyExclude, clear, copyRef, useSetup, defineComponent, modelValue } = app

export default defineComponent((props: InputProps, ref: InputProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'options', 'onChange'])
  const elem: any = useRef()
  const self = useSetup({
    name: 'select',
    props,
    vars: {
      index: 0,
      value: '',
      options: [] as OptionType[],
    },
    async mounted() {
      copyRef(ref, elem)
    }
  })
  const { vars, update } = self()

  /** 렌더링 시 필요한 선택목록 정보 조합 */
  if (props?.options && props?.options instanceof Array && vars?.options) {
    clear(vars.options)
    const { value: mvalue } = modelValue(self())
    for (let inx = 0; inx < props.options.length; inx++) {
      const item: any = props.options[inx]
      let value = typeof item === C.STRING ? item : item?.value || ''
      let name = item?.name || value
      if (value == mvalue) {
        vars.index = inx
        vars.value = value
      }
      vars.options.push({ name: name, value: value, selected: value == mvalue })
    }
    if (mvalue === undefined) { vars.index = 0 }
  }

  const onChange = async (e: any, v: any) => {
    const { setValue } = modelValue(self())
    let options: OptionType[] = vars.options as any
    const inx = v?.props?.value || 0
    setValue(options[inx].value, () => update(C.UPDATE_FULL))
    /** 변경시 데이터모델에 값전달 */
    if (props.onChange) { props.onChange(e as any, v) }
  }
  return (
  <_Select
    ref={ elem }
    onChange={ onChange }
    value={vars?.index || (vars?.options?.length > 0 ? 0 : '')}
    { ...pprops }
    >
    {/* 선택목록 생성*/}
    { vars?.options?.length > 0 && vars.options.map((itm, inx) => (
    <_MenuItem
      key={ inx }
      value={ inx }
      selected={ itm?.selected || false }
      >
      { `${itm?.name}` }
    </_MenuItem>
    ))}
  </_Select>
  )
})