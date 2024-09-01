/**
 * @File        : user-context.ts
 * @Author      : 정재백
 * @Since       : 2024-04-20
 * @Description : 사용자 정보 저장소
 * @Site        : https://devlog.ntiple.com/795
 **/
import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { getPersistConfig } from 'redux-deep-persist'
/** 세션스토리지 사용선언, 탭별로 영속저장이 유지된다 */
import storage from 'redux-persist/lib/storage/session'

import * as C from '@/libs/constants'
import app from '@/libs/app-context'
import api from '@/libs/api'

const { log, clone } = app

/** 사용자 정보 */
const schema = {
  userInfo: {
    userId: '',
    userNm: '',
    /** 접근제어용 토큰(access-token) 저장소 */
    accessToken: { value: '', expireTime: 0 },
    /** 접근유지용 토큰(refresh-token) 저장소 */
    refreshToken: { value: '', expireTime: 0 },
    lastAccess: 0,
    notifyExpire: false,
    timelabel: ''
  }
}

const slice = createSlice({
  name: 'user',
  initialState: schema,
  reducers: {
    setUserInfo: (state, action) => {
      const p: any = action.payload
      for (const k in p) { (state.userInfo as any)[k] = p[k] }
    }
  }
})

/** 영속저장 설정을 해 준다 */
const persistConfig = getPersistConfig({
  key: 'user',
  version: 1,
  storage,
  blacklist: [ ],
  rootReducer: slice.reducer
})

/** redux store 를 만들어 준다 */
const userStore = configureStore({
  reducer: persistReducer(persistConfig, slice.reducer),
  /** serialize 경고 방지용 */
  middleware: (middleware) => middleware({ serializableCheck: false })
})

/** 영속저장 선언, 브라우저 리프레시 해도 정보가 남아 있다 */
const persistor = persistStore(userStore)

const userVars = {
  timerHandle: C.UNDEFINED as any
}

const userContext = {
  /** 사용자정보 입력 */
  setUserInfo(info: any) {
    userStore.dispatch(slice.actions.setUserInfo(info))
  },
  /** 사용자정보 출력 */
  getUserInfo() {
    return (userStore.getState().userInfo) as typeof schema.userInfo
  },
  /** 사용자 정보 만료시간 체크 */
  async checkExpire() {
    if (userVars.timerHandle) { clearTimeout(userVars.timerHandle) }
    const current = new Date().getTime()
    const userInfo = userContext.getUserInfo()
    let accessToken = userInfo.accessToken
    let refreshToken = userInfo.refreshToken
    let expired = false
    /** 액세스토큰 조회 */
    if ((accessToken?.expireTime || 0) > current) {
      const diff = Math.floor((accessToken.expireTime - current) / 1000)
      const minute = Math.floor(diff / 60)
      const mod = diff - (minute * 60)
      userContext.setUserInfo({ timelabel: `${String(minute).padStart(2, '0')}:${String(mod).padStart(2, '0')}` })
      if (mod % 10 == 0) { log.debug(`DIFF: ${minute} min ${mod} sec / ${diff} / ${current} / ${app.getConfig().auth?.expiry}`) }
    }
    if (refreshToken?.value && refreshToken?.expireTime < (current - C.EXTRA_TIME)) {
      log.debug('REFRESH-TOKEN EXPIRED')
      /** TODO: REFERESH 토큰 만료처리 */
    }
    // log.debug('CHECK:', Math.floor((accessToken.expireTime - (current + C.EXPIRE_NOTIFY_TIME - C.EXTRA_TIME)) / 1000))
    if ((accessToken?.value && accessToken?.expireTime <
      (current + C.EXPIRE_NOTIFY_TIME - C.EXTRA_TIME)) && !userInfo?.notifyExpire
      ) {
      if (confirm(`인증이 ${Math.ceil((accessToken?.expireTime - current) / 1000 / 60)}분 안에 만료됩니다. 연장하시겠어요?`)) {
        userContext.tokenRefresh()
      } else {
        userContext.setUserInfo({ notifyExpire: true })
      }
    }
    if (accessToken?.value && accessToken?.expireTime < (current - C.EXTRA_TIME)) {
      log.debug('ACCESS-TOKEN EXPIRED')
      if (accessToken.value && accessToken?.expireTime >= 0) {
        expired = true
        userContext.logout()
        alert('로그아웃 되었어요')
        app.goPage('/')
      }
    }
    accessToken = clone(userInfo.accessToken)
    userStore.dispatch(slice.actions.setUserInfo({ accessToken }))
    if (!expired) {
      userVars.timerHandle = setTimeout(userContext.checkExpire, 1000)
    }
  },
  async tokenRefresh() {
    api.post(`lgn01002`, {}, { authtype: C.TOKEN_REFRESH })
  },
  /** 강제 로그아웃 */
  async logout(notify: boolean = true) {
    userStore.dispatch(slice.actions.setUserInfo(
      clone(schema.userInfo)))
      /** TODO: 로그아웃 알림처리 */
  },
  /** 사용자정보 변경 모니터링 */
  subscribe(fnc: any) {
    userStore.subscribe(fnc)
  },
}

export { userStore, persistor }
export default userContext