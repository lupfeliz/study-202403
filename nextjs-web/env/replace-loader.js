/**
 * @File        : replace-loader.js
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 빌드시 소스코드를 가로채어 변화시켜주는 웹팩 플러그인
 * @Site        : https://devlog.ntiple.com/795
 **/
module.exports = function(source) {
  let result = String(source || '')
  let mat
  /** 치환데이터 저장소를 초기화 한다 */
  if (BUILD_STORE.$INITIALIZED === false) {
    const o = JSON.parse(process?.env?.BUILD_STORE)
    for (const k in o) { BUILD_STORE[k] = o[k] }
    delete BUILD_STORE.$INITIALIZED 
  }
  /** 소스코드에서 {$$문자열$$} 이 발견되면 BUILD_STORE 에서 내용을 찾아 치환한다 */
  while (result != null && (mat = /\{\$\$([a-zA-Z0-9_-]+)\$\$\}/g.exec(result))) {
    const prev = result.substring(0, mat.index)
    const next = result.substring(mat.index + mat[0].length, result.length)
    result = `${prev}${BUILD_STORE[mat[1]]}${next}`
  }
  return result
}
/** 치환데이터 저장소 */
const BUILD_STORE = { $INITIALIZED: false }