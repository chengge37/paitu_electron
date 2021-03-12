/* eslint-disable node/no-deprecated-api */
import { isNullOrUndefined } from 'util'

// let validator = {}
// validator.install = function (Vue, options) {
//     Vue.prototype.$validatePhone = (tag, err) => {
//         console.log(`Error find in interface ${tag}: ${err}`)
//     }
// }
// export default validator
const validateTime = function checkTime (rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入活动时间'))
  } else {
    callback()
  }
}
const validateInteger = (rule, value, callback) => {
  var myreg = /^[0-9]\d*$/
  if (!myreg.test(value)) {
    return callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}
// 手机验证
const validatePhone = function (rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  }
  setTimeout(function () {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error('手机号不合法'))
    } else {
      callback()
    }
  }, 600)
}
// 邮箱验证
const validateEmail = function (rule, value, callback) {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 300)
}
const validatesixlength = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('内容需要多于6个字'))
  } else {
    callback()
  }
}
const validateSixteenlength = (rule, value, callback) => {
  if (value.length < 16) {
    return callback(new Error('内容要多于16个字'))
  } else {
    callback()
  }
}
const isEmptyForm = (rule, value, callback) => {
  if (!value || value.length === 0) {
    return callback(new Error('此项不能为空'))
  } else {
    callback()
  }
}
const ValidateIdCard = (rule, value, callback) => {
  if (/^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/.test(value)) {
    callback()
  } else {
    return callback(new Error('身份证号码不合法'))
  }
}
const isEmpty = function (o) {
  if (isNullOrUndefined(o)) {
    return true
  }
  if (o === '') {
    return true
  }
  return false
}

const isInteger = function isInteger (obj) {
  if (obj == '0') return true
  return !isNaN(parseInt(obj, 10))
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
const isExternal = function (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
const isString = function (str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
const isArray = function (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
// 手机或者固话验证
const validatePhoneIncludeFixPhone = function (rule, value, callback) {
  const fixReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  const mobileEeg = /^1[3456789]\d{9}$/
  if (!fixReg.test(value) && !mobileEeg.test(value)) {
    return callback(new Error('请输入正确的固定电话或手机'))
  } else {
    callback()
  }
}
// 身份证
const validateID = (rule, value, callback) => {
  const myreg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (!myreg.test(value)) {
    return callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

export { validatePhone, validateEmail, validateInteger, validateTime, isEmpty, isInteger, validatesixlength, validateSixteenlength, isEmptyForm, isExternal, isString, isArray, ValidateIdCard, validatePhoneIncludeFixPhone, validateID }
