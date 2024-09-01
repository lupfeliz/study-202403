/**
 * @File        : constants.ts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 자주 사용되는 상수 정의
 * @Site        : https://devlog.ntiple.com/795
 **/
export const ROOT = 'ROOT'
export const DEBUG = 'debug'
export const INFO = 'info'
export const TRACE = 'trace'
export const WARN = 'warn'
export const ERROR = 'error'

export const UTF8 = 'utf-8'
export const TEXT = 'text'
export const STRING = 'string'
export const ALPHA = 'alpha'
export const ALPHASPC = 'alphaspc'
export const ALPHANUM = 'alphanum'
export const ALPHASTART = 'alphastart'
export const ALPHANUMSPC = 'alphanumspc'
export const ASCII = 'ascii'
export const EMAIL = 'email'
export const PUBLIC_KEY = 'publickey'
export const PRIVATE_KEY = 'privatekey'
export const OBJECT = 'object'
export const BOOLEAN = 'boolean'
export const NUMBER = 'number'
export const NUMERIC = 'numeric'

export const CONTENT_TYPE = 'content-type'
export const CHARSET = 'charset'
export const CTYPE_JSON = 'application/json'
export const CTYPE_GRAPHQL = 'application/graphql'
export const CTYPE_FORM = 'application/x-www-form-urlencoded'
export const CTYPE_XML = 'text/xml'
export const CTYPE_HTML = 'text/html'
export const CTYPE_TEXT = 'plain/text'
export const CTYPE_CSS = 'text/css'
export const CTYPE_OCTET = 'application/octet-stream'
export const CTYPE_MULTIPART = 'multipart/form-data'
export const APPSTATE_INIT = 0
export const APPSTATE_START = 1
export const APPSTATE_ENV = 2
export const APPSTATE_USER = 3
export const APPSTATE_READY = 4
export const APPSTATE_ERROR = 5

export const UNDEFINED = undefined as any

export const HIDE_PRELOAD = 'hide-preload'

export const FN_NIL = (..._: any[]) => { }

export const BEARER = 'Bearer'
export const AUTHORIZATION = 'Authorization'
export const POST = 'post'
export const GET = 'get'
export const PUT = 'put'
export const DELETE = 'delete'
export const TOKEN_REFRESH = 'tokenRefresh'

export const EXTRA_TIME = 1000 * 5
export const EXPIRE_NOTIFY_TIME = 1000 * 60 * 2

export const UPDATE_ENTIRE = 3
export const UPDATE_FULL = 2
export const UPDATE_SELF = 1
export const UPDATE_IF_NOT = 0

export const SC_OK = 200
export const SC_MOVED_PERMANENTLY = 301
export const SC_MOVED_TEMPORARILY = 302
export const SC_UNAUTHORIZED = 401
export const SC_FORBIDDEN = 403
export const SC_NOT_FOUND = 404
export const SC_METHOD_NOT_ALLOWD = 405
export const SC_BAD_REQUEST = 400
export const SC_INTERNAL_SERVER_ERROR = 500
export const SC_BAD_GATEWAY = 502
export const SC_SERVICE_UNAVAILABLE = 503
export const SC_GATEWAY_TIMEOUT = 504
export const SC_RESOURCE_LIMIT_IS_REACHED = 508

export const RESCD_OK = '0000'
/** 이 부분은 웹팩 플러그인(replace-loader)에 의해 자동으로 채워진다 */
export const CRYPTO_KEY = '{$$CRYPTO_KEY$$}'