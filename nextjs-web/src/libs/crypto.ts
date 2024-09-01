/**
 * @File        : crypto.ts
 * @Author      : 정재백
 * @Since       : 2023-10-10
 * @Description : 암호화 유틸
 *                app 내에서 aes 와 rsa 방식 암복호화를 간편하게 다룰 목적으로 작성
 * @Site        : https://devlog.ntiple.com/795
 **/
import cryptojs from 'crypto-js'
import * as C from './constants'
import log from './log'

type WordArray = cryptojs.lib.WordArray
/** 암호화 기본키 저장소 */
const context = {
  aes: {
    defbit: 256,
    defkey: undefined as any as WordArray,
    opt: {
      iv: undefined as any as WordArray,
      mode: cryptojs.mode.CBC,
      padding: cryptojs.pad.Pkcs7
    }
  },
  rsa: {
    cryptor: undefined as any,
    defkey: ''
  }
}

context.aes.defkey = cryptojs.enc.Utf8.parse(''.padEnd(context.aes.defbit / 8, '\0'))
context.aes.opt.iv = cryptojs.enc.Hex.parse(''.padEnd(16, '0'))

const NIL_ARR = cryptojs.enc.Hex.parse('00')

const crypto = {
  /** AES 모듈 */
  aes: {
    init: async (key?: any) => {
      if (key) { context.aes.defkey = crypto.aes.key(key) }
    },
    decrypt: (msg: string, key?: any) => {
      let hkey: WordArray = key ? crypto.aes.key(key) : context.aes.defkey
      return cryptojs.AES.decrypt(msg, hkey, context.aes.opt).toString(cryptojs.enc.Utf8)
    },
    encrypt: (msg: string, key?: any) => {
      let hkey: WordArray = key ? crypto.aes.key(key) : context.aes.defkey
      return cryptojs.AES.encrypt(msg, hkey, context.aes.opt).toString()
    },
    key(key: any, bit: number = context.aes.defbit) {
      let ret: any = undefined
      if (key) {
        if (typeof key === C.STRING || typeof key === C.NUMBER) {
          key = String(key)
          const b64len = Math.round(bit * 3 / 2 / 8)
          if (key.length > (b64len)) { key = String(key).substring(0, b64len) }
          if (key.length < (b64len)) { key = String(key).padEnd(b64len, '\0') }
          if (ret === undefined) { try { ret = crypto.b64dec(key) } catch (e) { log.debug('E:', e) } }
          if (ret === undefined) { try { ret = crypto.hexdec(key) } catch (e) { log.debug('E:', e) } }
        } else {
          if (key.__proto__ === cryptojs.lib.WordArray) { ret = key }
        }
      }
      return ret as any as WordArray
    },
    setDefaultKey(key: any, bit: number = context.aes.defbit) {
      if (bit && bit !== context.aes.defbit) { context.aes.defbit = bit }
      context.aes.defkey = this.key(key, bit)
    }
  },
  /** RSA 모듈 / JSEncrypt 에서는 private key 를 사용해야만 암/복호화가 모두 지원된다 */
  rsa: {
    init: async (keyval?: string, keytype?: string) => {
      if (!context?.rsa?.cryptor) {
        const JSEncrypt = (await import('jsencrypt')).default
        context.rsa.cryptor = new JSEncrypt()
        switch (keytype) {
        case C.PRIVATE_KEY: case C.UNDEFINED: { context.rsa.cryptor.setPrivateKey(keyval) } break
        case C.PUBLIC_KEY: { context.rsa.cryptor.setPublicKey(keyval) } break
        }
      }
    },
    decrypt: (msg: string, key?: any) => {
      if (key) { context.rsa.cryptor.setPrivateKey(key) }
      return context.rsa.cryptor.decrypt(msg)
    },
    encrypt: (msg: string, key?: any) => {
      if (key) { context.rsa.cryptor.setPrivateKey(key) }
      return context.rsa.cryptor.encrypt(msg)
    }
  },
  b64dec(key: string) {
    let ret = NIL_ARR
    try { ret = cryptojs.enc.Base64.parse(key) } catch (e) { log.debug('E:', e) }
    return ret
  },
  hexdec(key: string) {
    let ret = NIL_ARR
    try { ret = cryptojs.enc.Hex.parse(key) } catch (e) { log.debug('E:', e) }
    return ret
  },
}

export default crypto