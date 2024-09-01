/**
 * @File        : values.ts
 * @Author      : 정재백
 * @Since       : 2023-08-09
 * @Description : 각종 데이터 유틸 모음
 * @Site        : https://devlog.ntiple.com/795
 **/
import * as C from './constants'
import log from './log'

type PutAllOptType = {
  deep?: boolean
  root?: any
}

const values = {
  clone<T>(v: T) {
    let ret:T = C.UNDEFINED
    try {
      ret = JSON.parse(JSON.stringify(v))
    } catch(e) { log.debug('E:', e) }
    return ret
  },
  /** source객체의 모든 속성을 target 객체에 입력한다 (첫번째 인자가 target), deep 옵션을 줄경우 요소마다 재귀호출한다 */
  putAll<T>(_target: T, source: any, opt: PutAllOptType = C.UNDEFINED) {
    let target: any = _target
    if (target == null || source == null || target === source ) { return target }
    if (!opt) { opt = { root: target } }
    for (const k in source) {
      const titem = target[k]
      const sitem = source[k]
      if (titem !== undefined && titem !== null) {
        if (typeof (titem) === C.STRING) {
          target[k] = source[k]
        } else if ((opt?.deep) && titem instanceof Array && sitem instanceof Array) {
          values.putAll(titem, sitem, opt)
        } else if ((opt?.deep) && typeof(titem) === C.OBJECT && typeof(sitem) === C.OBJECT) {
          values.putAll(titem, sitem, opt)
        } else {
          /** 타입이 다르다면 무조건 치환. */
          target[k] = source[k]
        }
      } else {
        target[k] = source[k]
      }
    }
    return target
  },
  /** target 에서 exclude 나열된 것들을 제외한 모든 요소를 복제한 객체 생성 */
  copyExclude<T>(target: T, excludes: any[] = []) {
    let ret: any = { }
    const keys = Object.keys(target as any)
    for (const key of keys) {
      if (excludes.indexOf(key) !== -1) { continue }
      ret[key] = (target as any)[key]
    }
    return ret as T
  },
  /** react의 ref 객체끼리 복제 할 때 사용 (useRef), 기본적으로는 putAll 과 동일 */
  copyRef(target: any, source: any, opt?: any) {
    if (target && source && target.hasOwnProperty('current')) {
      values.putAll(target, source)
      if (opt) { values.putAll(target, opt) }
    }
    return target
  },
  /** target 객체 내부의 모든 요소 삭제 */
  clear<T>(target: T) {
    if (target instanceof Array) {
      target.splice(0, target.length)
    } else if (target) {
      for (const k in target) {
        const v = target[k]
        if (v instanceof Array) {
          values.clear(v)
        } else if (typeof v === C.OBJECT) {
          values.clear(v)
        } else {
          delete target[k]
        }
      }
    }
    return target
  },
  /** 최소(min)~최대(max)값 사이의 난수 생성, 최소값을 입력하지 않을경우 자동으로 0 으로 지정됨 */
  getRandom(max: number, min: number = C.UNDEFINED) {
    if (min == C.UNDEFINED) { min = 0 }
    if (max < 0) { max = max * -1 }
    const ret = min + Math.floor(Math.random() * max)
    return ret
  },
  /** 단일문자 난수 */
  randomChar(c = 'a', n = 26) {
    return String.fromCharCode(Number(c.charCodeAt(0)) + values.getRandom(n))
  },
  /** 난수로 이루어진 문자열, number / alpha / alphanum 의 3가지 타입으로 생성가능 */
  randomStr (length: number, type: 'number' | 'alpha' | 'alphanum' = C.UNDEFINED) {
    let ret = ''
    switch (type) {
    case undefined:
    /** 숫자   */
    case 'number': {
      for (let inx = 0; inx < length; inx++) {
        ret += String(values.getRandom(10))
      }
    } break
    /** 문자   */
    case 'alpha': {
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(2)) {
        case 0: /** 소문자 */ { ret += values.randomChar('a', 26) } break
        case 1: /** 대문자 */ { ret += values.randomChar('A', 26) } break
        }
      }
    } break
    /** 영숫자 */
    case 'alphanum': {
      for (let inx = 0; inx < length; inx++) {
        switch(values.getRandom(3)) {
        case 0: /** 숫자   */ { ret += String(values.getRandom(10)) } break
        case 1: /** 소문자 */ { ret += values.randomChar('a', 26) } break
        case 2: /** 대문자 */ { ret += values.randomChar('A', 26) } break
        }
      }
      break
    } }
    return ret
  },
  matcher(v: any, def: any, ...arg: any[]) {
    let ret = C.UNDEFINED
    let defval = C.UNDEFINED
    let vlst = v
    if (!arg) { return ret }
    if (!(vlst instanceof Array)) { vlst = [vlst] }
    for (let inx = 0; inx < arg.length; inx += 2) {
      let alst = arg[inx]
      if (!(alst instanceof Array)) { alst = [alst] }
      for (const aitm of alst) {
        for (const vitm of vlst) {
          if (vitm === aitm) {
            ret = arg[inx + 1]
            break
          }
          if (aitm === def) { defval = arg[inx + 1] }
        }
      }
    }
    if (ret === C.UNDEFINED) { ret = defval }
    return ret
  },
}

export default values