import Vue from 'vue'
import { format } from 'date-fns'
import { jrDate, qiniuHost, error_pic, male_pic } from '../../config/config.js'
import $Vm from '../../main'
import { frontMessage,equip, adv, frontPersonal, studioApi, employee, customer, customer_group, refund, feedback, frontShop, shopTemplate, order, product, activity, frontEquip, frontStudio, frontOrder, frontAddress, safe, setting, frontComment, sms, finance, faq, coupon, store } from '@config/api.js'
import { asyncRoutes } from '@/router'

// 判断数据是否为空
export const isEmpty = (res) => {
  if (res == null || res == '' || res == undefined || JSON.stringify(res) == '[]' || JSON.stringify(res) == '{}') {
    return true
  } else {
    return false
  }
}

// 跳转到不存在的页面
export const notFound = (o, title) => {
  o.$router.push({ path: '*', query: { title: title } })
}

// 判断当前系统是否是window系统
export const download = () => {
  var agent = navigator.userAgent.toLowerCase()
  var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  let flag = ''
  let format = '.exe'
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    flag = 'win32'
    //		return 'win32';
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    flag = 'win64'
    //		return 'win64';
  }
  if (isMac) {
    flag = 'mac'
    format = '.dmg'
    //		return 'mac';
  }
  // 获取单机版版本号
  let version
  $Vm.getRequest(product.getProductList).then(res => {
    console.log('download-------', res)
    console.log('qiniuHost-------', qiniuHost)
    res.rows.forEach((item, index) => {
      if (item.id == 11) {
        version = item.version
      }
    })
    console.log(qiniuHost + 'paitume_' + version + '_' + flag + format + '?' + getUUID())
    const path = qiniuHost + 'paitume_' + version + '_' + flag + format + '?' + getUUID()
    window.open(path, '_self')
  }).catch(err => { })
}

// 联系客服调用的方法
export const contact = () => {
  console.warn('联系客服', $Vm)
  const chatToObj = {
    id: '3',
    name: '客服',
    avatar: male_pic
  }
  $Vm.$children[0].$refs.chat.chatTo(chatToObj)
}

// localStorage 设置方法
export const setStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

// localStorage 获取方法
export const getStroage = (key) => {
  return JSON.parse((localStorage.getItem(key)))
}

// 根据路由列表,获取子账号第一个有权先的路由路径
export const getFirstPermissPath = (roleList) => {
  // 跳转到第一个有权限的菜单
  const path = roleList.find(v => v.meta.permission == true)
  const url = path.path + '/' + path.children[0].path
  console.log('getFirstPermissPath-------', roleList, url)
  return url
}

// //获取路由表上的后台菜单
export const getServeMenu = (o) => {
  const routeList = []
  for (let i = 0; i < asyncRoutes.length; i++) {
    for (let j = 0; j < asyncRoutes[i].children.length; j++) {
      if (asyncRoutes[i].children[j].meta.roles1) {
        routeList.push(asyncRoutes[i].children[j])
      }
    }
  }
  return routeList
}
export const getServeMenu1 = (o) => {
  return asyncRoutes
}

export const throttle = (func, delay = 500) => {
  let prev = Date.now()
  return function () {
    const context = this
    const args = arguments
    const now = Date.now()
    if (now - prev >= delay) {
      func.apply(context, args)
      prev = Date.now()
    }
  }
}
// 子账号登录，设置相关路由权限问题
// export const setMenuPermission = (o, role) => {
// 	let roleList = getAccountRole(o, role);
// 	console.log('setMenuPermission---------', roleList);
// 	getServeMenu(o).forEach((item, index) => {
// 		if (roleList.includes(item.meta.menuRole)) {
// 			o.$set(item.meta, 'permission', true);
// 		}
// 	})
// };

export const getAccountRole = (o, role) => {
  const roleList = []
  const str = parseInt(role).toString(2)
  // 反转数组并遍历
  str.split('').reverse().forEach((item, index) => {
    if (item > 0) {
      roleList.push(Math.pow(2, index))
    }
  })
  return roleList
}
// 获取后台菜单列表
export const getServeMenuList = (o) => {
  // 获取后台菜单列表
  const menuList = []
  o.$router.options.routes.forEach((item, index) => {
    if (item.meta && item.meta.roles == 'serve' && item.children) {
      const obj = {
        menuRole: item.meta.menuRole,
        name: item.children[0].meta.title,
        status: '0'
      }
      menuList.push(obj)
    }
  })
  menuList.forEach((item, index) => {
    item.id = index
  })
  return menuList
}

// 获取七牛qiniuHost信息
export const qiniuAddress = (function () {
  return qiniuHost
})()

// 返回错误图片地址
export const errorPic = (function () {
  const errorPic = error_pic
  return `this.src="${errorPic}"`
})()

// 返回默认加载失败地址
export const errorAvatar = (function () {
  const errorAvatar = error_pic
  return errorAvatar
})()

// 返回默认头像地址
export const maleAvatar = (function () {
  const malePic = male_pic
  return `this.src="${malePic}"`
})()

export const StringAvatar = (function () {
  return male_pic
})()

// 返回默认头像，如果加载失败或者空
export const malePic = (function () {
  const malePic = male_pic
  return `this.src="${malePic}"`
})()

// 返回默认头像地址
export const defaultAvatar = (function () {
  const defaultAvatar = male_pic
  return defaultAvatar
})()

// 根据相同字段拆分成数组形式方法
export const changeArr = function (arr) {
  var map = {}
  var dest = []
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i]
    if (!map[ai.relation_id]) {
      dest.push({
        id: ai.relation_id,
        name: ai.name,
        type: ai.type,
        imgInfo: [ai]
      })
      map[ai.relation_id] = ai
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j]
        if (dj.id == ai.relation_id) {
          dj.imgInfo.push(ai)
          break
        }
      }
    }
  }
  return dest
}

// 去掉数组中为空的元素
export const trimSpace = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == '' || arr[i] == null || typeof (arr[i]) === 'undefined') {
      arr.splice(i, 1)
      i = i - 1
    }
  }
  return arr
}

// 对象数组根据属性排序,默认降序，desc:true升序 ，，false 降序
export const compare = function (property, desc = false) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    if (desc == true) {
      // 升序排列
      return value1 - value2
    } else {
      // 降序排列
      return value2 - value1
    }
  }
}

// 获取设备可选类别
export const getEquipArray = function () {
  const list = []
  const item = {
    id: '0',
    name: '不限'
  }
  list.push(item)
  $Vm.$staticCategoryTree.forEach((item, index) => {
    item.children.forEach((subItem, index2) => {
      if (subItem.children) {
        subItem.children.forEach((subItem2, index3) => {
          list.push(subItem2)
        })
      } else {
        list.push(subItem)
      }
    })
  })
  return list
}

// 获取全部城市信息，包含（不限城市）
export const staticAllCity = function () {
  const list = []
  const obj = {
    id: '0',
    city: '不限',
    code: '0'
  }
  list.push(obj)
  list.push(...$Vm.$staticCityArray)
  return list
}

// 根据城市名称获取城市区号，如"珠海市",返回"0756"
export const getCodeByCity = function (str) {
  const allCityCode = $Vm.config.allCity
  for (const item in allCityCode) {
    if (str == allCityCode[item]) {
      return item
    }
  }
}

// 保留2位小数
export const toFixed2 = function (num) {
  const str = parseFloat(num).toFixed(2)
  return str
}

// 检测密码强度  ['','低',’中','高']， 返回对应的0,1,2,3
export const checkPswStrong = function (str) {
  let s = 0
  if (str.length < 6) {
    return s
  };
  if (/[a-zA-Z]/.test(str)) {
    s++
  };
  if (/[0-9]/.test(str)) {
    s++
  };
  if (/[^0-9a-zA-Z]/.test(str)) {
    s++
  };
  return s
}

// 时间选择,obj(this),dateStart开始时间，dateEnd结束时间，fun/触发方法，filed（字段）
export const setTimeStart = function (obj, dateStart, dateEnd, fun, filed) {
  return new Promise((resolve, reject) => {
    if (obj[dateStart]) {
      if (obj[dateEnd]) {
        if (compareDate(obj[dateStart], obj[dateEnd])) {
          resolve(false)
        }
        obj[fun](filed, obj[dateStart] + '—' + obj[dateEnd])
      } else {
        obj[fun](filed, obj[dateStart] + '—')
      }
    }
    resolve(true)
  })
}

// 时间选择,obj(this),dateStart开始时间，dateEnd结束时间，fun/触发方法，filed（字段）
export const setTimeEnd = function (obj, dateStart, dateEnd, fun, filed) {
  if (obj[dateEnd]) {
    if (obj[dateStart]) {
      obj[fun]('time', obj[dateStart] + '—' + obj[dateEnd])
    } else {
      obj[fun]('time', '—' + obj[dateEnd])
    }
  } else {
    if (obj[dateStart]) {
      obj[fun]('time', obj[dateStart] + '—')
    }
  }
}

// 生成随机数
export const getUUID = function (len) {
  len = len || 6
  len = parseInt(len, 10)
  len = isNaN(len) ? 6 : len
  var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
  var seedLen = seed.length - 1
  var uuid = ''
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)]
  }
  return uuid
}

// 生成随机数(纯数字) 默认8位
export const getRandomNum = function (len) {
  len = len || 8
  len = parseInt(len, 10)
  len = isNaN(len) ? 8 : len
  var seed = '0123456789'
  var seedLen = seed.length - 1
  var uuid = ''
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)]
  }
  return uuid
}

// 深拷贝
export const deepcopy = function (source) {
  if (!source) {
    return source
  }
  const sourceCopy = source instanceof Array ? [] : {}
  for (const item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item]
  }
  return sourceCopy
}

// ajax错误处理
export const catchError = function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        Vue.prototype.$message({
          message: error.response.data.message || '请求参数异常',
          type: 'error'
        })
        break
      case 403:
        Vue.prototype.$message({
          message: error.response.data.message || '无访问权限，请联系企业管理员',
          type: 'warning'
        })
        break
      default:
        Vue.prototype.$message({
          message: error.response.data.message || '服务端异常，请联系技术支持',
          type: 'error'
        })
    }
  }
  return Promise.reject(error)
}

// 删除再次确认方法
export const confirm = function (obj, title = '此操作将永久删除信息, 是否继续?') {
  return obj.$confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  })
}

// 检测表格方法
export const checkForm = function (obj, formName = 'form', tips = '请填写必填信息!') {
  const o = obj.$refs[formName] || obj.$refs['ruleForm']
  return new Promise((resolve, reject) => {
    o.validate((valid) => {
      if (valid) {
        resolve(true)
      } else {
        $Vm.$message.warning(tips)
        reject(false)
      }
    })
  })
}

// 个位数字前面补0
export const toDouble = function (str) {
  const num = parseInt(str)
  return num > 9 ? num : '0' + num
}

// 格式化时间，年月日  默认格式为：2019-09-26
export const getTime = function (date, type = 'yyyy-MM-dd') {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(type)) type = type.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(type)) type = type.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return type
}

// 获取多长时间后的日期，返回数组 如['2019-09-26','2019-10-26']
// type  0/月 1/年
export const getTimePeriod = function (type) {
  const tempArr = []
  const date = getTime(new Date())
  tempArr.push(date)
  if (type == 0) {
    const arr = date.split('-')
    const year = arr[0] // 获取当前日期的年份
    const month = arr[1] // 获取当前日期的月份
    const day = arr[2] // 获取当前日期的日
    let days = new Date(year, month, 0)
    days = days.getDate() // 获取当前日期中的月的天数
    let year2 = year
    let month2 = parseInt(month) + 1
    if (month2 == 13) {
      year2 = parseInt(year2) + 1
      month2 = 1
    }
    let day2 = day
    let days2 = new Date(year2, month2, 0)
    days2 = days2.getDate()
    if (day2 > days2) {
      day2 = days2
    }
    if (month2 < 10) {
      month2 = '0' + month2
    }

    const t2 = year2 + '-' + month2 + '-' + day2
    tempArr.push(t2)
    console.log('tempArr------', tempArr)
  } else if (type == 1) {
    var d1 = new Date(date)
    var d2 = new Date(d1)
    d2.setFullYear(d2.getFullYear() + 1)
    tempArr.push(getTime(d2))
  }
  return tempArr
}

// 将unix时间戳转换为年月日
export const time2Date = function (value, formatStr = 'YYYY-MM-DD') {
  //	console.log('time2Date---------',value);
  return format(new Date(value * 1000), formatStr)
}

// 通过时间戳获取正常的时间显示  //type: Y:年月日 H:时分秒  其他：年月日时分秒
export const unix2Time = function (data, type) {
  var _data = data
  // 如果是13位正常，如果是10位则需要转化为毫秒
  if (String(data).length == 13) {
    _data = data
  } else {
    _data = data * 1000
  }
  const time = new Date(_data)
  const Y = time.getFullYear()
  const Mon = toDouble(time.getMonth() + 1)
  const Day = toDouble(time.getDate())
  const H = toDouble(time.getHours())
  const Min = toDouble(time.getMinutes())
  const S = toDouble(time.getSeconds())
  // 自定义选择想要返回的类型
  if (type == 'Y') {
    return `${Y}-${Mon}-${Day}`
  } else if (type == 'H') {
    return `${H}:${Min}:${S}`
  } else {
    return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
  }
}

// 比较两个时间大小,time1,time2 格式为'2019-09-30 00:00:00'
export const compareTime = function (time1, time2) {
  if (time1 > time2) {
    return true
  } else {
    return false
  }
}

// 计算两个时间的相差天数,sDate1和sDate2是2006-12-18  或者2006-12-18 00:00:00
export const datedif = function (sDate1, sDate2) {
  console.log('datedif---------', sDate1, sDate2)
  var dateSpan,
    tempDate,
    iDays
  sDate1 = Date.parse(sDate1.replace(/-/g, '/'))
  sDate2 = Date.parse(sDate2.replace(/-/g, '/'))
  dateSpan = sDate2 - sDate1
//dateSpan = Math.abs(dateSpan)
  iDays = Math.ceil(dateSpan / (24 * 3600 * 1000))
  console.log('iDays-------------', iDays)
  return iDays
}

// 获取指定日期，添加一个月或者一年后的日期 'month','year' ,0/月，1/年
export const getAfterDate = function (date, type) {
  var now
  if (date.toString().indexOf('-') >= 0) {
    now = new Date(date.replace(/-/g, '/'))
  } else {
    now = new Date(date)
  }

  if (type == 'year' || type==1) {
    now.setFullYear(now.getFullYear() + 1)
  } else if (type == 'month' || type==0) {
    now.setMonth(now.getMonth() + 1)
  }

  var datetime = now.getFullYear() + '-' + toDouble(now.getMonth() + 1) + '-' + toDouble(now.getDate())
  return datetime
}

// 计算当前日期下个月有几天
export const getNextMonthDay = function () {
  const date = new Date()
  const nowYear = date.getFullYear()
  const nowMonth = date.getMonth() + 1
  const nowDay = date.getDate()
  const date1 = nowYear + '-' + toDouble(nowMonth) + '-' + toDouble(nowDay)

  const arr = date1.split('-')
  const year = arr[0] // 获取当前日期的年份
  const month = arr[1] // 获取当前日期的月份
  const day = arr[2] // 获取当前日期的日
  let days = new Date(year, month, 0)
  days = days.getDate() // 获取当前日期中的月的天数
  let year2 = year
  let month2 = parseInt(month) + 1
  if (month2 == 13) {
    year2 = parseInt(year2) + 1
    month2 = 1
  }
  let day2 = day
  let days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }

  const date2 = year2 + '-' + month2 + '-' + day2

  let dateSpan,
    tempDate,
    iDays
  sDate1 = Date.parse(date1.replace(/-/g, '/'))
  sDate2 = Date.parse(date2.replace(/-/g, '/'))
  dateSpan = sDate2 - sDate1
  dateSpan = Math.abs(dateSpan)
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
  return iDays
}

// 图片explode
// export const picExplode =function (arrayStr,defaultPic,size=400){
//	if(arrayStr === null || arrayStr === undefined || arrayStr ==='' ||       Object.prototype.toString.call(arrayStr) !== '[object String]'){
//		return defaultPic;
//	}
//	let array = arrayStr.split(',');
//	let newArray = [];
//	array.forEach(item=>{
//		if(item.length>0){
//			newArray.push(item);
//		}
//	})
//	if(newArray.length>0){
//		return newArray[0] + '?imageMogr2/auto-orient/thumbnail/'+size+'x'+size+'>/blur/1x0/quality/75|imageslim';
//	} else {
//		return defaultPic;
//	}
// }

export const picExplode = function (arrayStr, defaultPic, size = 400) {
  if (arrayStr === null || arrayStr === undefined || arrayStr === '' || Object.prototype.toString.call(arrayStr) !== '[object String]') {
    return defaultPic
  }
  const newArray = arrayStr.split(',').filter(item => { return item })
  console.log('newArray-------', newArray, qiniuHost)
  if (newArray.length > 0) {
    const test = qiniuHost + newArray[0] + '?imageMogr2/auto-orient/thumbnail/' + size + 'x' + size + '>/blur/1x0/quality/75|imageslim'
    console.log('test-----------', test)
    return qiniuHost + newArray[0] + '?imageMogr2/auto-orient/thumbnail/' + size + 'x' + size + '>/blur/1x0/quality/75|imageslim'
  } else {
    return defaultPic
  }
}

// 比较两个对象数组差异，返回数组（暂时比较group_id,和group_name两个字段） array1/新修改的数组，array/旧的数组
// （暂时用在客户分组，和员工部门修改）
export const getDiff = function (array1, array2) {
  var result = []
  for (var i = 0; i < array1.length; i++) {
    var obj = array1[i]
    var id = obj.group_id
    var name = obj.group_name
    var isExist = false
    for (var j = 0; j < array2.length; j++) {
      var obj2 = array2[j]
      var id2 = obj2.group_id
      var name2 = obj2.group_name
      if (id == id2 && name == name2) {
        isExist = true
        break
      }
    }
    if (!isExist) {
      result.push(obj)
    }
  }
  return result
}

// 找出两个数组不同的元素,并返回数组
export const getArrDifference = function (arr1, arr2) {
  return arr1.concat(arr2).filter(function (v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}

// 验证手机号码是否合法
export const checkPhone = function (str) {
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(str)) {
    return true
  } else {
    $Vm.$message.warning('手机号码不合法！')
    return false
  }
}

// 验证邮箱是否合法
export const checkEmail = function (str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (reg.test(str)) {
    return true
  } else {
    $Vm.$message.warning('邮箱格式不合法！')
    return false
  }
}

// 根据年月日计算年龄，birthDay 为字符串 如、'2011-02-01'
export const getAge = function (strBirthday) {
  var returnAge
  var strBirthdayArr = strBirthday.split('-')
  var birthYear = strBirthdayArr[0]
  var birthMonth = strBirthdayArr[1]
  var birthDay = strBirthdayArr[2]

  var d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1
  var nowDay = d.getDate()

  if (nowYear == birthYear) {
    returnAge = 0 // 同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear // 年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        var monthDiff = nowMonth - birthMonth // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = 0 // 返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge // 返回周岁年龄
}

// 限制开始时间，选择开始时间必须是今天之后（用于时间选择，el-date-picker
export const checkDateStart = function (obj, startTime, endTime) {
  return {
    disabledDate: time => {
      if (compareDate(obj[startTime], obj[endTime])) {
        obj[endTime] = ''
      }
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
    }
  }
}

// 限制结束时间，选择结束时间大于开始时间（用于时间选择，el-date-picker
export const checkDateEnd = function (obj, startTime) {
  return {
    disabledDate: time => {
      if (obj[startTime]) {
        return (
          time.getTime() < new Date(obj[startTime]).getTime() - 86400000 ||
          time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        )
      } else {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
  }
}

// 比较两个日期的大小，如果开始时间大于结束时间，则返回true
export const compareDate = function (dateStart, dateEnd) {
  var oDate1, oDate2
  if (!dateStart || !dateEnd) return
  if (dateStart.toString().indexOf('-') >= 0) {
    oDate1 = new Date(dateStart.replace(/-/g, '/'))
  } else {
    oDate1 = new Date(dateStart)
  }

  if (dateEnd.toString().indexOf('-') >= 0) {
    oDate2 = new Date(dateEnd.replace(/-/g, '/'))
  } else {
    oDate2 = new Date(dateEnd)
  }
  if (oDate1.getTime() > oDate2.getTime()) {
    return true
  } else {
    return false
  }
}

// 返回方法
export const back = function (obj) {
  obj.$router.go(-1)
}

// 页面跳转方法
export const openPage = function (obj, path, Qdata) {
  obj.$store.dispatch('ActiveOpenNext', Qdata).then(() => {
    obj.$router.push({
      path: path
    })
  })
}

// 获取当前年份
export const getCurYear = function () {
  const date = new Date()
  return date.getFullYear()
}

// 获取当前月份
export const getCurMonth = function () {
  const date = new Date()
  return date.getMonth() + 1
}

// 获取当前日期 如2019-07-20
export const getCurDay = function () {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year + '-' + toDouble(month) + '-' + toDouble(day)
}

// 计算两个时间的时长  时间格式2019-07-20 14:25:20
export const calHours = function (startTime, endTime) {
  const hour =
    (new Date(endTime).getTime() -
      new Date(startTime).getTime()) /
    3600000
  return Math.ceil(hour)
}

// 获取两个日期时间段的信息，包括，是否为工作日，
export const getAllDate = function (startTime, endTime) {
  // 2019法定节假日
  var jrdate = jrDate

  function getDate (datestr) {
    var temp = datestr.split('-')
    var date = new Date(temp[0], temp[1] - 1, temp[2])
    return date
  }
  var startTime = getDate(startTime)
  var endTime = getDate(endTime)
  const list = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear()
    var month = (startTime.getMonth() + 1).toString().length == 1 ? '0' + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1)
    var day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate()
    var week = startTime.getDay()
    let type = 0
    const time = year + '-' + month + '-' + day
    if (jrdate.indexOf(time) >= 0) {
      type = 2
    } else {
      if (week == 0 || week == 6) {
        type = 1
      }
    }

    const item = {}
    item.date = time
    item.type = type
    list.push(item)

    startTime.setDate(startTime.getDate() + 1)
  }
  return list
}

//跳到到指定页面（当前页面打开）
export const toRoute=function(path,params){
	$Vm.$router.push({
		path: path,
		query: params
	});
}

// 跳转到登录页面(当前页面打开)
export const toLogin = function () {
  const path = '/login'
  $Vm.$router.push({
    path: path
  })
}

// 页面跳转（打开新页面）
export const openNewPage = function (url, params) {
  const page = $Vm.$router.resolve({
    path: url,
    query: params
  })
  window.open(page.href, '_blank')
}

// 跳转到店铺页面（打开新页面）（前台页面）//默认打开新页面true，如果传false，为当前页面打开
export const toShopPage = function (id, type = true) {
  const url = '/shop/index'
  if (!type) {
    $Vm.$router.push({
      path: url,
      query: {
        uid: id
      }
    })
  } else {
    const page = $Vm.$router.resolve({
      path: url,
      query: {
        uid: id
      }
    })
    window.open(page.href, '_blank')
  }
}

// ------------------活动模块---------------

// 获取活动列表信息
export const getActivityList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(activity.get_activity_list, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到活动列表页面,打开新页面
export const toActivityList = function (params) {
  const page = $Vm.$router.resolve({
    path: '/activity/index',
    query: params
  })
  window.open(page.href, '_blank')
}

// 跳转到活动详情页面（打开新页面）（前台页面）
export const toActivityPage = function (id) {
  const page = $Vm.$router.resolve({
    path: '/activity/active_details',
    query: {
      id: id
    }
  })
  window.open(page.href, '_blank')
}

// 判断用户是否已经登录,如果有登录，返回true，否则返回false
export const userIsLogin = function () {
  console.log('$Vm.$store.getters---', $Vm.$store.getters)
  if ($Vm.$store.getters.user_data) {
    return true
  }
  return false
}

// 获取用户信息
export const getUserInfo = () => {
  return $Vm.$store.getters.user_data
}

// --------------------影棚模块---------------------

// 获取影棚列表
export const getStudioList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontStudio.getStudioList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到影棚详情（打开新页面)(前台页面)
export const toStudioDetail = function (id) {
  const page = $Vm.$router.resolve({
    path: '/studio/detail',
    query: {
      id: id
    }
  })
  window.open(page.href, '_blank')
}

// 跳转到影棚列表页面,打开新页面
export const toStudioList = function (params) {
  const page = $Vm.$router.resolve({
    path: '/studio/index',
    query: params
  })
  window.open(page.href, '_blank')
}

// 跳转到影棚列表页面，在当前页面打开
export const toStudioPage = function () {
  $Vm.$router.push({
    path: '/studio/index'
  })
}

// --------------------器材模块--------------------

// 获取设备器材列表
export const getEquipList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontEquip.getEquipList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取设备器材列表(new)
export const getEquip = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(equip.get, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 设备批量上下架
export const equipIsUp = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(equip.equipIsUp, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 列表-打印二维码用
export const getEquipCodeList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(equip.getEquipCodeList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到器材列表页面（打开新页面)(前台页面)
export const toEquipList = function (params) {
  const page = $Vm.$router.resolve({
    path: '/equip/index',
    query: params
  })
  window.open(page.href, '_blank')
}

// 跳转到影棚列表页面，在当前页面打开
export const toEquipPage = function () {
  $Vm.$router.push({
    path: '/equip/index'
  })
}

// 跳转到器材详情（打开新页面)(前台页面)
export const toEquipDetail = function (id) {
  const page = $Vm.$router.resolve({
    path: '/equip/detail',
    query: {
      id: id
    }
  })
  window.open(page.href, '_blank')
}

// --------------购物车模块--------------
// 跳转到购物车页面 ,默认是打开新页面，如果传0,即当前页面打开
export const toCartPage = function (type) {
  const url = '/cart/index'
  if (type == 0) {
    $Vm.$router.push({
      path: url
    })
  } else {
    const page = $Vm.$router.resolve({
      path: url
    })
    window.open(page.href, '_blank')
  }
}

// 获取购物车信息
export const getOrderCart = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.getOrderCart).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取用户购物车数量（未支付订单）
export const getOrderCartNum = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.getOrderCart).then(res => {
      console.log('getOrderCartNum---------', res)
      resolve(res.count)
    }).catch(err => {
      reject(false)
    })
  })
}

// -----------------订单模块(后台)--------------
// 商家添加核验单模板
export const serveAddCheckTpl = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(order.serveAddCheckTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家修改核验单模板
export const serveEditCheckTpl = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(order.serveEditCheckTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家删除核验单模板
export const serveDelCheckTpl = (id) => {
  const params = { tpl_id: id }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(order.serveDelCheckTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家查询核验单模板（单个）
export const serveGetCheckTpl = (id) => {
  const params = { tpl_id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(order.serveGetCheckTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家查询核验单模板（列表）
export const serveGetCheckTplList = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(order.serveGetCheckTplList).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家修改核验单
export const serveEditCheck = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(order.serve_edit_check, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家添加核验单
export const serveAddCheck = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(order.serve_add_check, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家查询核验单
export const serveGetCheck = (orderId) => {
  const params = {
    order_id: orderId
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(order.serve_get_check, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取订单详情
export const getOrderDetail = (orderId) => {
  const params = {
    id: orderId
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.getOrderDetail, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 新后台获取订单接口
export const newServeOrderGet = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(order.newServeOrderGet, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// -----------------订单模块(前台)--------------
// 用户查询核验单
export const userGetCheck = (orderId) => {
  const params = {
    order_id: orderId
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.userGetCheck, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户更改核验单状态
export const userOptCheck = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(frontOrder.userOptCheck, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取订单支付状态
export const getPayStatus = (orderId) => {
  const params = {
    id: orderId
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.getPayStatus, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改预约订单外送类型
export const updateOrderOut = function (orderId, doorTodoor) {
  const params = {
    order_id: orderId,
    door_to_door: doorTodoor
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.updateOrderOut, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 创建预约订单
export const rentOrder = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(frontOrder.rentOrder, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改预约订单
export const editRentOrder = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(frontOrder.editRentOrder, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 删除订单
export const delUserOrder = (id) => {
  return new Promise((resolve, reject) => {
    const params = {
      id: id
    }
    $Vm.postRequest(frontOrder.delUserOrder, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取订单列表
export const serverOrderGet = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(order.serve_get_orderlist, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 删除不能外送的设备
export const delOrderNoOut = function (orderId) {
  const params = {
    order_id: orderId
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontOrder.delOrderNoOut, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// -------------------地址模块----------------
// 获取地址列表
export const getAddressList = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontAddress.getAddressList).then(res => {
      console.log('getAddressList---------', res)
      resolve(res)
    }).catch(err => {
      reject(false)
    })
  })
}

// 新增地址
export const addNewAddress = (form) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(frontAddress.addNewAddress, form).then(res => {
      console.log('addNewAddress---------', res)
      resolve(res)
    }).catch(err => { })
  })
}

// 设置默认地址
export const setDefaultAddress = (id) => {
  const params = {
    id: id
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontAddress.setDefaultAddress, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取默认地址
export const getDefaultAddress = () => {
  const params = {
    is_default: 1
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontAddress.getDefaultAddress, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// --------------租赁商模块(前台)------------
// 跳转到租赁商页面
export const toHirePage = () => {
  const url = '/hire/index'

  const page = $Vm.$router.resolve({
    path: url
  })
  window.open(page.href, '_blank')

  //	({ path: '/login', query: { to: "hire" } });
}

// --------------------安全设置模块-----------
// 修改手机，发送验证码
export const sendCode = (mobile) => {
  const params = {
    mobile: mobile
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(safe.sendCode, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改手机，验证短信码
export const checkCode = (pwd) => {
  const params = {
    pwd: pwd
  }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(safe.checkCode, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改手机，提交完成
export const updatePhone = (mobile, code) => {
  const params = {
    mobile: mobile,
    code: code
  }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(safe.updatePhone, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改密码，验证手机验证码
export const checkValidCode = (code) => {
  const params = {
    code: code
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(safe.checkValidCode, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// ----------------------基本设置模块---------------

// 修改密码，修改用户密码
export const updatePsw = (pwd, new_pwd) => {
  const params = {
    pwd: pwd,
    new_pwd: new_pwd
  }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(setting.updatePsw, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改基本设置
export const updateSetting = (form) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(setting.update, form).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取手机验证码
export const getMobilCode = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(setting.getMobilCode, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取极验
export const getGeetGt = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(setting.getGeetGt, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 找回密码方法
export const forGot = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(setting.forGot, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取最新用户信息，验证登录
export const newUserInfo = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontPersonal.getUserInfo).then(res => {
      console.log('frontPersonal---更新用户信息成功----', res)
      $Vm.$store.commit('update_user_data', res)
      resolve(res)
    }).catch(err => { })
  })
}

// ------------------------------评论模块-------------------
// 获取评论列表
export const getCommentList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontComment.getCommentList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 评论模块 （个人中心)
export const addComment = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(frontComment.addComment, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// --------------------------商家中心（后台管理）模块--------------------------------------------

// ---------------------短信模块-------------
// 商家获取短信余额
export const getBalance = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(sms.getBalance).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}
// 01商家获取短信条数
export const getSmsNum = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(sms.getSmsNum).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}
// 02获取短信价格
export const getSmsPrice = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(sms.getSmsPrice).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 03短信购买
export const smsPay = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(sms.smsPay, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}
// ----------------------财务模块------------------
// 获取可提现余额方法
export const getReflectMoney = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(finance.getReflectMoney).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家提现方法
export const outBalance = (money) => {
  const params = { money: money }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(finance.outBalance, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取收入/支出类型
export const getFinanceType = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(finance.getType).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取收入支出列表
export const getFinanceList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(finance.getAll, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家删除收入/支出
export const delFinance = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(finance.del, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取财务详情
export const getFinanceDetail = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(finance.getDetail, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到财务详情页面
export const financeDetail = (id) => {
  $Vm.$router.push({
    path: '/serve/finance_set/Finance_detail',
    query: {
      id: id
    }
  })
}

// 商家获取收入支出列表（主站后台新）
export const getAllFinance = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(finance.getAllFinance, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// ---------------------------------------商家中心模块----------------------
// 跳转到后台订单详情
export const toServerOrderDetail = (id) => {
  $Vm.$router.push({ path: '/serve/order/details', query: { id: id } })
}
// 跳转到后台活动订单详情
export const toServerActivityDetail = (id) => {
  $Vm.$router.push({ path: '/serve/active_set/details', query: { id: id } })
}

// ---------------------------------------常见问题模块------------------------
// 获取常见问题FAQ列表数据
export const getFAQlist = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(faq.getList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}
// 添加常见问题Q&A
export const addFAQ = (content, reply) => {
  const params = { sort: '1', content: content, relpy: reply }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(faq.add, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 修改常见问题Q&A
export const updateFAQ = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(faq.update, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 删除常见问题FAQ
export const delFAQ = (id) => {
  const params = { qid: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(faq.del, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家产品问答增改删(设置关联问题)
export const operateFAQ = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(faq.operate, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家用户根据影棚设备id获取关联的问题,type:1/影棚，2/设备
export const getFAQById = (type, id) => {
  const params = { type: type, obj_id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(faq.getListById, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// ----------------------------优惠券模块---------------------
// 商家添加优惠券
export const addCoupon = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(coupon.add, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家修改优惠券
export const updateCoupon = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(coupon.update, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家删除优惠券
export const delCoupon = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.del, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取优惠券列表
export const getCouponList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.getList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 不用登录获取优惠券列表
export const ajaxGetCouponList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.ajaxGet, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家根据id获取优惠券
export const getCouponById = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.getById, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户使用优惠券
export const couponUse = (orderId, id) => {
  const params = { id: id, order_id: orderId }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.couponUse, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户取消使用优惠券
export const couponCancel = (orderId, id) => {
  const params = { id: id, order_id: orderId }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.couponCancel, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户领取优惠券
export const userAddCoupon = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.userAdd, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 订单使用过的优惠券
export const couponOrder = (id) => {
  const params = { order_id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.couponOrder, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户获取自己的优惠券
export const userGetCoupon = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(coupon.userGet, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到我的优惠券页面,默认是打开新页面，如果传0,即当前页面打开
export const toMyCouponPage = function (type) {
  const url = '/personal/coupon/index'
  if (type == 0) {
    $Vm.$router.push({
      path: url
    })
  } else {
    const page = $Vm.$router.resolve({
      path: url
    })
    window.open(page.href, '_blank')
  }
}

// 跳转到我的优惠券页面,默认是打开新页面，如果传0,即当前页面打开
export const toCouponPage = function (type) {
  const url = '/coupon/index'
  if (type == 0) {
    $Vm.$router.push({
      path: url
    })
  } else {
    const page = $Vm.$router.resolve({
      path: url
    })
    window.open(page.href, '_blank')
  }
}

// -----------------------商家店铺模板模块----------------------------
// 商家获取所有店铺模板
export const getAllShopTpl = () => {
  const params = {
    page: 1,
    page_size: 10000
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(shopTemplate.getAllShopTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家设置店铺模板
export const setShopTpl = (id) => {
  const params = {
    tpl_id: id
  }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(shopTemplate.setShopTpl, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// -----------------------产品（商家）模块----------------------------
// 根据id获取商家基本信息方法
export const getShopById = (id) => {
  const params = { uid: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontShop.getShopById, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取商家对应功能()
export const getStoreLimit = (type = 1) => {
  const params = { type: type }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(store.getStoreLimit, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取子账号列表
export const storeAccountList = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(store.getStoreAccount).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家根据id获取子账号详情
export const storeAccountById = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(store.getOneAccount, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家添加子账号
export const storeAddAccount = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(store.addAccount, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家删除子账号
export const storeDelAccount = (id) => {
  const params = { id: id }
  return new Promise((resolve, reject) => {
    $Vm.postRequest(store.delAccount, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家修改账号
export const updateAccountDetail = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(store.updateAccount, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家子账号登录
export const accountLogin = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(store.accountLogin, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// ------------------用户产品模块--------------
// 获取产品列表方法
export const getProductList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getProductList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户下单方法
export const addProduct = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.addProduct, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 产品支付方法
export const productPay = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(product.productPay, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取产品订单信息
export const getProductInfo = (orderId) => {
  const params = { order_id: orderId }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getProductInfo, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取商家开通的功能列表
export const getUserProduct = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getUserProduct).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 获取产品订单详情（状态）
export const getProductStatus = (id) => {
  const params = { id, id }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getProductStatus, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户支付方法
export const ajaxUserPay = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.ajaxUserPay, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 跳转到支付页面  //0：打开新页面，1/在当前页打开
export const toPayPage = (orderId, type = 0) => {
  const params = { order_id: orderId }
  const url = '/pay'
  if (type == 1) {
    $Vm.$router.push({
      path: url,
      query: params
    })
  } else {
    const page = $Vm.$router.resolve({
      path: url,
      query: params
    })
    window.open(page.href, '_blank')
  }
}

// 获取购买产品列表
export const getAllProductOrder = () => {
  const params = { page: 1, page_size: 10000, is_pay: 1 }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getAllProductOrder, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户反馈问题
export const addFeedback = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(feedback.addFeedback, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 模拟支付方法（测试用，后面可以删除)
export const testOrder = (orderId) => {
  const params = { orderId: orderId }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.testOrder, params).then(res => {
      $Vm.$message.success('购买产品成功！')
      //			resolve(res);
    }).catch(err => { })
  })
}

// 获取现在版本信息
export const getNowProduct = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(product.getNowProduct).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}


export const productName = [{
	id: 0,
	name: '免费版',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序','扫码出入库', '数据保密','账号(5个)']
}, {
	id: 1,
	name: '5账号',
	funs: ['5账号']
}, {
	id: 2,
	name: '小程序',
	funs: ['小程序']
}, {
	id: 11,
	name: '专业版',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序', '扫码出入库', '数据保密', '账号(1个)']
}, {
	id: 12,
	name: '旗舰版',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序', '扫码出入库', '数据保密', '账号(5个)']
}, {
	id: 13,
	name: '多账号版',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序', '扫码出入库', '数据保密', '账号(大于5个)']
}, {
	id: 21,
	name: '平台普通版',
	funs: ['小程序', '5账号']
}, {
	id: 22,
	name: '平台商业版',
	funs: ['小程序', '多账号(大于5个)']
}, {
	id: 23,
	name: '多账号版',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序', '扫码出入库', '数据保密', '账号(大于5个)']
}, {
	id: 33,
	name: '旗舰版(永久)',
	funs: ['订单管理', '日程管理', '数据分析', '管理账号', '客服系统', '独立后台', '客户管理', '优惠券', '短信营销', '商家独立小程序', '扫码出入库', '数据保密', '账号(5个)']
}]

// 计算产品价格,obj,id,数量，timeType:0:月/1:年
export const calProductPrice = function (obj, id, num, timeType) {
  let priceType = ''
  let price = 0
  if (timeType == 0) {
    priceType = 'price'
  } else if (timeType == 1) {
    priceType = 'price_year'
  }
  switch (parseInt(id)) {
    case 1:
    case 2:
    case 11:
    case 21:
      price = obj[priceType]
      break
    case 12:
      price = (238 + 18 * num) * (timeType == 0 ? 1 : 12)
      break
    case 22:
      price = (198 + 18 * num) * (timeType == 0 ? 1 : 12)
      break
    case 23:
      price = 18 * num * (timeType == 0 ? 1 : 12)
      break
  }
  return price
}

//根据详情获取产品信息,type,0/获取当前产品信息，1/获取列表展示信息
export const productInfo=(item,type=0)=>{
	let info;
	let pid=item.pid || item.product_id;
	if(item.pid==0){
		pid=0;
	}
	if(type==0){
		info={
			pid:pid,
			startTime:item.st_time,
			endTime:item.end_time,
			name:item.product_name,
			remindDay:datedif(unix2Time(item.time), item.end_time),
			num:item.num
		};
	}else{
		pid=item.id;
		info={...item,pid:pid};
	}
	
	productName.forEach((o,index)=>{
		if(type==0 && o.id==pid){
			info.funs=o.funs;
		}
		if(type==1 && o.id==pid){
			info.funs=o.funs;
		}
	})
	return info;
}

//获取用户权限功能，type，0/扫码出入库，独立小程序，数据保密，1/多账号,默认为0
export const checkFuns=(type=0)=>{
	//获取当前账号数量
	let account=0;
	let info;
	return new Promise((resolve,reject)=>{
		getNowProduct().then(res=>{
			info=productInfo(res);
			//判断是否过期
			if(info.remindDay<0){
				$Vm.$message.warning('该账号产品版本已过期,没有权限操作!');
				resolve(false)
			}else{
				//没有过期，判断账号
				if(type==1){
					getEmployeeList().then(res=>{
						account=res.total_count;
						console.error('checkFuns-----',account);
						if([0,12,23,33].includes(info.pid)){
							if(account>=info.num){
								$Vm.$message.warning('账号已经用完啦!');
								resolve(false);
							}else{
								resolve(true);
							}
						}
					})
				}
				resolve(true);
			}
			console.error('checkFuns-----',info);
		})
	})
	
}



// 获取已购买产品信息
export const userProduct = () => {
  let productObj = null
  return new Promise((resolve, reject) => {
    getUserProduct().then(res => {
      console.log('userProduct---------', res)
      if (res.length > 0) {
        const userProduct = res[0]
        let type = []; let num = 1
        res.forEach((item, index) => {
          if (item.is_temp == 2) {
            type.push(item.type)
            if (item.type == 1) {
              num = item.num
            }
          }
        })
        if (type.length > 0) {
          type = type.sort().join(',')
          productObj = getEditionFuns(type, num)
          productObj.startTime = userProduct.st_time
          productObj.time = userProduct.time
          productObj.endTime = userProduct.end_time
          productObj.remindDay = datedif(unix2Time(productObj.time), productObj.endTime)
          productObj.is_temp = userProduct.is_temp
          if (unix2Time(productObj.time) > productObj.endTime) {
            productObj.isOverTime = true
          } else {
            productObj.isOverTime = false
          }
          let timeType = ''
          if (productObj.remindDay >= 30) {
            productObj.timeType = 1
            timeType = 'year'
          } else {
            productObj.timeType = 0
            timeType = 'month'
          }
          console.log('timeType---------', timeType)
          productObj.lastTime = getAfterDate(time2Date(userProduct.time), timeType)
        }
      }
      console.log('userProduct---------', productObj)
      resolve(productObj)
    })
  })
}

// 获取用户免费（试用）版本
export const userFreeProduct = () => {
  let productObj = null
  let freeProduct = null
  return new Promise((resolve, reject) => {
    getUserProduct().then(res => {
      console.log('userFreeProduct---------', res)
      if (res.length > 0) {
        let userProduct
        let flag = -1; let num = 1; let type = ''
        flag = res.findIndex((item, index) => {
          return (item.is_temp == 0 && item.type != 5)
        })
        if (flag >= 0) {
          userProduct = res[flag]
          num = 5
          type = '1,2,3'
          productObj = getEditionFuns(type, num)
          productObj.startTime = userProduct.st_time
          productObj.time = userProduct.time
          productObj.endTime = userProduct.end_time
          productObj.remindDay = datedif(unix2Time(productObj.time), productObj.endTime)
          productObj.is_temp = '0'
          if (unix2Time(productObj.time) > productObj.endTime) {
            productObj.isOverTime = true
          } else {
            productObj.isOverTime = false
          }
          let timeType = ''
          if (productObj.remindDay >= 30) {
            productObj.timeType = 1
            timeType = 'year'
          } else {
            productObj.timeType = 0
            timeType = 'month'
          }
          console.log('timeType---------', timeType)
          productObj.lastTime = getAfterDate(time2Date(userProduct.time), timeType)
        }
      }
      console.log('userFreeProduct---------', productObj)
      freeProduct = productObj
      resolve(freeProduct)
    })
  })
}

// 根据产品功能和数量，获取已经购买产品的信息
export const getEditionFuns = (fun, num) => {
  const productType = fun
  let productObj = {}
  let editionType = ''
  let funs = []
  let editionName = ''
  if (productType.includes('1,2,3')) {
    if (num > 5) {
      editionType = 12 // 单机旗舰版
    } else {
      editionType = 11 // 单机基础版
    }
  } else if (productType.includes('1,2')) {
    if (num > 5) {
      editionType = 22 // 平台商业版
    } else {
      editionType = 21 // 平台普通版
    }
  } else if (productType.includes('1')) {
    if (num > 5) {
      editionType = 23 // 多账号
    } else {
      editionType = 1 // 5账号
    }
  } else if (productType.includes('2')) {
    editionType = 2 // 小程序
  }
  funs = getEditionById(editionType, num)
  editionName = getEditionNameById(editionType)
  productObj = {
    editionName: editionName,
    funs: funs,
    id: editionType,
    num: num,
    productType: productType
  }
  return productObj
}

// 根据id转化为对应的版本功能
export const getEditionById = (id, num) => {
  let funs = []
  let flag = 0
  productName.forEach((item, index) => {
    if (item.id == id) {
      funs = item.funs
    }
  })
  if (num > 5) {
    funs.forEach((item, index) => {
      if (item.includes('多账号')) {
        flag = index
      }
    })
    funs[flag] = `多账号(${num}个)`
  }
  console.log('getEditionById-----funs----------', funs)
  return funs
}

// 根据版本id获取对应版本名称
export const getEditionNameById = (id) => {
  let name
  productName.forEach((item, index) => {
    if (item.id == id) {
      name = item.name
    }
  })
  return name
}

// 根据已购项目版本显示可以升级的产品id  //return Array
export const showProductById = (id) => {
  let canShowList = []
  switch (parseInt(id)) {
    case 0:
      canShowList.push(11,12,23,33);
      break;
    case 11:
      canShowList.push(12,23,33);
      break;
    case 12:
      canShowList.push(23,33);
      break;
  }
  return canShowList
  console.log('canshowList---------', canShowList)
}

// 根据数组中id转化为对应的版本名称和功能
export const changeEditionName = (list) => {
  list.forEach((item, index) => {
    productName.forEach((item2, index2) => {
      if (item.id == item2.id) {
//      item.edition = item2.name
        item.funs = item2.funs
      }
    })
  })
  return list
}

// 购买产品，根据产品id获取需要传的数量方法
export const getNumByProductId = (id) => {
  id = parseInt(id)
  let num = 1
  if ([12, 33].includes(id)) {
    num = 5
  }
  if ([23].includes(id)) {
    num = 6
  }
  return num
}

// --------------------退款模块----------------------
// 用户发起退款
export const userRefundPay = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(refund.userRefundPay, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 退款查询(用户/商家)
export const ajaxUserRefundOrderDetail = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(refund.ajaxUserRefundOrderDetail, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 退款申诉(用户)
export const userRefundAppeal = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(refund.userRefundAppeal, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 退款审核(商家)
export const serveRefundAnswer = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(refund.serveRefundAnswer, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

export const contactShop = (o, params) => {
  o.$parent.$parent.$refs.chat.chatTo(params)
}

// --------客户-分组管理模块--------------
// 商家获取分组管理
export const getCustomerGroupList = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(customer_group.getAll).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取客户列表
export const getCustomerList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(customer.getAll, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// --------获取员工模块--------------
// 商家获取员工分组
export const getEmployeeGroup = () => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(employee.getGroup).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家获取所有员工列表
export const getEmployeeList = (params) => {
  params = {
    page: 1,
    page_size: 10000
  }
  return new Promise((resolve, reject) => {
    $Vm.getRequest(employee.getAll, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 商家编辑员工
export const updateEmployee = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(employee.update, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// ------------------后台影棚模块-------------------
export const studioShelfIsUp = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.postRequest(studioApi.studioShelfIsUp, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// -------------------------广告（前台）--------------------
// 获取广告方法
export const ajaxGetAdv = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(adv.ajaxGetAdv, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 用户点击广告
export const userClickAdv = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(adv.userClickAdv, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

// 判断是否有操作权限
export const getRole = (o) => {
  let flag = true;
  let user_data=o.$store.getters.user_data;
  if(user_data.is_role==1) return true;
  const role = user_data.op_role;
  const list = getServeMenu1()
  const url = o.$router.currentRoute.fullPath.split('/').pop()
  list.forEach(item => {
    item.children.forEach(item1 => {
      if (item1.name.toLowerCase() === url.toLowerCase()) {
        if ((role & item.meta.roles) === 0) {
          flag = false
        }
      }
    })
  })
  return flag
}


//-------------消息模块------------
//获取个人消息列表
export const getMsgList = (params) => {
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontMessage.getMsgList, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

//修改消息已读状态
export const hasRead = (id) => {
  let params={id:id};
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontMessage.hasRead, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}

//删除消息
export const delMsg = (id) => {
  let params={id:id};
  return new Promise((resolve, reject) => {
    $Vm.getRequest(frontMessage.delMsg, params).then(res => {
      resolve(res)
    }).catch(err => { })
  })
}