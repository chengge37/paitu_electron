/* eslint-disable eqeqeq */
import { format } from 'date-fns'
import {OrderStatus} from '../config/config'
// 金额格式化方法
function formatMoney (num) {
  var str = num.toString()
  var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}

// 将unix时间戳转换为年月日
function time2Date (value, formatStr = 'YYYY-MM-DD') {
  return format(new Date(value * 1000), formatStr)
}

//将unix时间戳转换为年月日,'YYYY-MM-DD hh:mm:ss' 时分秒
function time2FullDate(value) {
	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	var time = new Date((value*1000));
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

// 转换收入/支出类型
function formatInOrOut (type) {
  if (type == 1) {
    return '收入'
  } else if (type == 0) {
    return '支出'
  }
}
//将时分秒时间转为日期 如2019-09-29 00:00:00 返回2019-09-29
function strTime2Date(value){
	return value.split(' ')[0];
}
// 将年月日时分秒时间转换为年月日
function formatTimeToDay (str) {
  return str.split(' ')[0]
}

// 手机号码中间4位显示*符号
function toTel (value) {
  const start = value.slice(0, 3)
  const end = value.slice(-4)
  return `${start}****${end}`
}

// 将字符串转成整形数字
function toNumber (str) {
  return parseFloat(str)
}

function wipe(value){
  console.log(value)
  return value.split(' ')[0];
}

function payStatusFilter(payStatus){
  let payStatusTxt = '未知';
  let payStatusInt = Number(payStatus)
  switch (payStatusInt) {
    case OrderStatus.OrderStatusClose:
      payStatusTxt = '已关闭'
      break;
    case OrderStatus.OrderStatusWaitPay:
      payStatusTxt = '未支付'
      break;
    case OrderStatus.OrderStatusPaid:
      payStatusTxt = '已支付'
      break;
    case OrderStatus.OrderStatusConfirm:
      payStatusTxt = '商家确认,等待核验单'
      break;
    case OrderStatus.OrderStatusHasCheck:
      payStatusTxt = '核验单待客户确认'
      break;
    case OrderStatus.OrderStatusConfirmCheck:
      payStatusTxt = '核验单客户已确认'
      break;
    case OrderStatus.OrderStatusRejecting:
      payStatusTxt = '退款中'
      break;
    case OrderStatus.OrderStatusRejected:
      payStatusTxt = '退款完毕'
      break;
    case OrderStatus.OrderStatusIng:
      payStatusTxt = '进行中'
      break;
    case OrderStatus.OrderStatusIng:
      payStatusTxt = '进行中'
      break;
    case OrderStatus.OrderStatusWaitComment:
      payStatusTxt = '订单结束，待评论'
      break;
    case OrderStatus.OrderStatusDone:
      payStatusTxt = '完成'
      break;  
    default:
      break;
  }
  return payStatusTxt;
}

export default {
  formatMoney, time2Date,time2FullDate, formatInOrOut, formatTimeToDay, toTel, toNumber,wipe,strTime2Date,payStatusFilter
}
