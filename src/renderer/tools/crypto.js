const crypto = require('crypto')
const a = '5'
const b = '8'
const c = '4'
const d = '5'
var key = a + b + c + d + 'paitu'
function md5 (str) {
  const md5Hash = crypto.createHash('md5')
  return md5Hash.update(str).digest('base64')
}
/**
 * aes加密 密文str
 * @param {String} str 需要加密的str
 */
export const encrypt = (str) => {
  const encryptKey = Buffer.from(md5(key), 'base64')
  const dataBuffer = Buffer.from(str, 'utf8')
  const iv = ''
  const cipher = crypto.createCipheriv('aes-128-ecb', encryptKey, iv)
  let encryptedBase64 = cipher.update(dataBuffer, 'binary', 'base64')
  encryptedBase64 += cipher.final('base64')
  return encryptedBase64
}
/**
 * aes解密
 * @param {String} str
 */
export const decrypt = (str) => {
  const encryptKey = Buffer.from(md5(key), 'base64')
  const iv = ''
  const cipher = crypto.createDecipheriv('aes-128-ecb', encryptKey, iv)
  let decryptData = cipher.update(str, 'base64', 'utf8')
  decryptData += cipher.final('utf8')

  return decryptData
}
