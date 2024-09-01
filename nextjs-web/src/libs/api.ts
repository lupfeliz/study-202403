/**
 * @File        : api.ts
 * @Author      : 정재백
 * @Since       : 2023-08-09
 * @Description : api 통신모듈
 * @Site        : https://devlog.ntiple.com/795
 **/
import * as C from '@/libs/constants'
import app from './app-context'
import userContext from './user-context'
import crypto from './crypto'

type OptType = {
  method?: String
  apicd?: String
  resolve?: Function
  reject?: Function
}

const { putAll, getConfig, log } = app
const keepalive = true

/** 초기화, 기본적으로 사용되는 통신헤더 등을 만들어 준다 */
const init = async (method: string, apicd: string, data?: any, opt?: any) => {
  const headers = putAll({}, opt?.headers || {})
  const timeout = opt?.timeout || getConfig()?.api?.timeout || 10000
  const signal = AbortSignal.timeout(timeout)
  const url = api.mkuri(apicd)

  let body: any = ''
  if (!headers[C.CONTENT_TYPE]) {
    headers[C.CONTENT_TYPE] = C.CTYPE_JSON
  }
  if (String(headers[C.CONTENT_TYPE]).startsWith(C.CTYPE_JSON)) {
    body = JSON.stringify(data || {})
  } 
  /** JWT 토큰이 저장되어있는 경우 헤더에 Bearer 추가 */
  const user = userContext.getUserInfo()
  if (user && user?.accessToken?.value) {
    switch (opt?.authtype) {
    case undefined: {
      /** 일반적인 경우 */
      headers[C.AUTHORIZATION] = `${C.BEARER} ${user.accessToken?.value}`
    } break
    case C.TOKEN_REFRESH: {
      /** 추가 헤더가 필요한 경우 */
      headers[C.AUTHORIZATION] = `${C.BEARER} ${user.refreshToken?.value}`
    } break
    }
  }
  return { method, url, body, headers, signal }
}

/** 통신결과 처리 */
const mkres = async (r: Promise<Response>, opt?: OptType) => {
  let ret = { }
  let t: any = ''
  const resp = await r
  const hdrs = resp?.headers || { get: (v: any) => {} }
  /** 통신결과 헤더에서 로그인 JWT 토큰이 발견된 경우 토큰저장소에 저장 */
  if ((t = hdrs.get(C.AUTHORIZATION.toLowerCase()))) {
    const auth: string[] = String(t).split(' ')
    if (auth.length > 1 && auth[0] === C.BEARER) {
      try {
        const current = new Date().getTime()
        const decval = String(crypto.aes.decrypt(auth[1]) || '').split(' ')
        log.debug('AUTH:', decval)
        if (decval && decval.length > 5) {
          /** 로그인 인경우 */
          userContext.setUserInfo({
            userId: decval[0],
            userNm: decval[1],
            accessToken: {
              value: decval[2],
              expireTime: current + Number(decval[4])
            },
            refreshToken: {
              value: (decval[3] !== '_' ? decval[3] : C.UNDEFINED),
              expireTime: current + Number(decval[3] !== '_' ? decval[5] : 0),
            },
            notifyExpire: false
          })
          log.debug('CHECK:', decval[3].length, decval[3])
          userContext.checkExpire()
        } else if (decval && decval.length > 3) {
          /** 로그인 연장 인경우 */
          userContext.setUserInfo({
            userId: decval[0],
            userNm: decval[1],
            accessToken: {
              value: decval[2],
              expireTime: current + Number(decval[3])
            }
          })
          /** 토큰 만료시간을 모니터링 한다 */
          userContext.checkExpire()
        }
      } catch (e) {
        log.debug('E:', e)
      }
    }
  }
  /** 상태값에 따른 오류처리 */
  const state = { error: false, message: '' }
  let msgcode = async () => (await (resp?.json && resp.json()))?.message
  switch (resp.status) {
  case C.SC_BAD_GATEWAY:
  case C.SC_GATEWAY_TIMEOUT:
  case C.SC_INTERNAL_SERVER_ERROR:
  case C.SC_RESOURCE_LIMIT_IS_REACHED:
  case C.SC_SERVICE_UNAVAILABLE: {
    putAll(state, { error: true, message: `처리 중 오류가 발생했어요`, msgcode: await msgcode() })
  } break
  case C.SC_UNAUTHORIZED: {
    putAll(state, { error: true, message: `로그인을 해 주세요`, msgcode: await msgcode() })
    await userContext.logout(false)
  } break
  case C.SC_FORBIDDEN: {
    putAll(state, { error: true, message: `접근 권한이 없어요`, msgcode: await msgcode() })
  } break
  case C.SC_NOT_FOUND:
  case C.SC_BAD_REQUEST: {
    putAll(state, { error: true, message: `처리할 수 없는 요청이예요`, msgcode: await msgcode() })
  } break
  case C.SC_OK: {
  } break
  default: }

  /** 정상인경우 결과값 리턴처리 */
  if (!state.error) {
    switch (hdrs.get('content-type')) {
    /** 결과 타입이 JSON 인경우 */
    case 'application/json': {
      ret = await resp.json()
    } break
    /** 결과 타입이 OCTET-STREAM (다운로드) 인경우 */
    case 'application/octet-stream': {
      ret = await resp.blob()
    } break
    default: }
    if (opt?.resolve) { opt.resolve(ret) }
  } else {
    return opt?.reject && opt.reject(state) || {}
  }
  return ret
}

const api = {
  nextping: 0,
  /** PING, 백엔드가 정상인지 체크하는 용도 */
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      const apicd = `cmn00000`
      const curtime = new Date().getTime()
      if (opt?.noping) { return resolve(true) }
      if (curtime < api.nextping) { return resolve(true) }
      const { method, headers, signal, url } = await init(C.GET, apicd, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      const res: any = await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
      /** 다음 ping 은 10초 이후 */
      api.nextping = curtime + (1000 * 10)
      return res
    })
  },
  /** POST 메소드 처리 */
  async post(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, body, headers, signal } = await init(C.POST, apicd, data, opt)
      const r = fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  /** GET 메소드 처리 */
  async get(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, headers, signal } = await init(C.GET, apicd, data, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  /** PUT 메소드 처리 */
  async put(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, url, body, headers, signal } = await init(C.PUT, apicd, data, opt)
      const r = fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  /** DELETE 메소드 처리 */
  async delete(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await api.ping(opt)
      const { method, headers, signal, url } = await init(C.DELETE, apicd, data, opt)
      const r = fetch(url, { method, headers, signal, keepalive })
      return await mkres(r, putAll(opt || {}, { apicd, method, resolve, reject }))
    })
  },
  /** URL 을 형태에 맞게 조립해 준다 */
  mkuri(apicd: string) {
    const mat: any = apicd && /^([a-z]+)([0-9a-zA-Z]+)([/].*){0,1}$/g.exec(apicd) || {}
    if (mat && mat[1]) {
      return `${app.getConfig()?.api?.base || '/api'}/${mat[1]}/${mat[0]}`
    } else {
      return apicd
    }
  }
}

export default api