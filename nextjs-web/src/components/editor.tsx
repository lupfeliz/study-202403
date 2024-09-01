/**
 * @File        : editor.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 편집기 컴포넌트
 * @Site        : https://devlog.ntiple.com/795
 **/
import { ComponentPropsWithRef } from 'react'
import { useEditor, EditorContent, EditorContentProps } from '@tiptap/react'
import { Mark, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import lodash from 'lodash'
import app from '@/libs/app-context'
import * as C from '@/libs/constants'

/** 편집기 내부에서 span 태그 사용이 가능하도록 편집기(tiptap) 플러그인 작성 */
const Span = Mark.create({
  name: 'span',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: false,
  parseHTML() { return [ { tag: 'span' }, ] },
  renderHTML({ HTMLAttributes }) { return ['span', mergeAttributes(HTMLAttributes), 0] },
  addAttributes() { return { class: { default: null }, style: { default: null } } },
})

/** 편집기 속성타입 상속 */
type EditorProps = ComponentPropsWithRef<'div'> & EditorContentProps & {
  model?: any
  name?: string
}

const { useRef, copyExclude, copyRef, useSetup, defineComponent, modelValue } = app
const { debounce } = lodash

export default defineComponent((props: EditorProps, ref: EditorProps['ref'] & any) => {
  const pprops = copyExclude(props, ['model', 'editor'])
  const elem: any = useRef()
  const editor = useEditor({
    /** 위에서 작성한 Span 플러그인을 사용한다. (이 선언이 없으면 'span' 태그가 불가하어 컬러등 스타일링이 불가능) */
    immediatelyRender: false,
    extensions: [StarterKit, Span],
    content: '',
  })

  const self = useSetup({
    name: 'editor',
    props,
    vars: { editor },
    async mounted() {
      copyRef(ref, elem)
    },
    updated: debounce(async (mode: number) => {
      /** 외부에서 강제 업데이트 신호를 받아도 100ms 정도 debounce 를 걸어준다 */
      if (mode === C.UPDATE_ENTIRE && vars) {
        const { value } = modelValue(self())
        self()?.vars?.editor?.commands.setContent(value)
      }
    }, 100)
  })
  const { vars, update } = self({ editor })
  vars.editor = editor
  /** 편집기 편집 이벤트는 자주 발생하기 때문에 debounce 로 이벤트 발생빈도를 낮춘다 */
  const onChange = debounce(async (v) => {
    const { setValue } = modelValue(self())
    setValue(v, () => update(C.UPDATE_FULL))
    if (props?.onChange) { props.onChange(v) }
  }, 100)
  editor && editor.on('transaction', ({ editor }) => {
    onChange(editor.getHTML())
  })
  return (
  <EditorContent ref={ elem }
    /* @ts-ignore */
    editor={ editor }
    { ...pprops }
    />
  )
})