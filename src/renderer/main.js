/* eslint-disable no-undef */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import filters from './filter'
// 引用element
import ElementUI from 'element-ui'
// 加载自定义弹窗
import './Theme'
// 导入数据操作库
import db from './utils/db'
import Ndb from './db'
// 引入进度条
import './permission'
// 引入图标以及自定义css
import './icons'
import '@/styles/index.scss'
// 引入增强库
import echarts from 'echarts'
import VueAMap from 'vue-amap'
import VBack from './utils/v-back'
import AliSvgIcon from './components/AliSvg'
// 导入全景图相关包
import 'pannellum/build/pannellum.js'
import 'pannellum/build/pannellum.css'
import './utils/request'
// 导入阿里图标
import './assets/icon'
// 导入全局自定义指令
import directives from '@/directive'

// 导入全局公共函数
import * as util from './common/function/util'
// 导入全局验证函数
import * as validate from './utils/validate.js'
// 导入全局变量
import * as config from '@config/config.js'

// 导入七牛的qiniu-js
import * as qiniu from 'qiniu-js'
// 引入electron
import { ipcRenderer } from 'electron'

import VuejsClipper from 'vuejs-clipper'
// 当非web开发环境时，导入以下依赖
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(VuejsClipper, {
  components: {
    // 把其中某些组件注册为全局组件
    clipperBasic: true,
    clipperPreview: true,
    clipperUpload: true,
    clipperFixed: true,
    clipperRange: true
  }
})
Vue.use(VuejsClipper)

if (process.env.NODE_ENV === 'development') {
  const logs = require('./utils/log')
  Vue.prototype.$log = logs
}
// Vue.use(Print)
Vue.use(ElementUI)
Vue.use(VBack, {
  el: '#app',
  duration: 300,
  distance: '50px'
})
Vue.use(VueAMap)
Vue.use(directives)
Vue.component('ali-svg-icon', AliSvgIcon)

VueAMap.initAMapApiLoader({
  key: 'f95c3466594d19fa1c152220e0492fe4',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Weather', 'AMap.Marker'],
  v: '1.4.15',
  uiVersion: '1.0.11'
})
// 过滤器统一处理加载
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.echarts = echarts
// 加载线上库
if (window.staticCategoryTree && window.staticBrandArray && window.staticEquipArray && window.staticCityArray && window.staticAllCityArray) {
  Vue.prototype.$staticCategoryTree = staticCategoryTree
  Vue.prototype.$staticBrandArray = staticBrandArray
  Vue.prototype.$staticEquipArray = staticEquipArray
  Vue.prototype.$staticCityArray = staticCityArray
  Vue.prototype.$staticAllCityArray = staticAllCityArray
} else {
  ipcRenderer.send('resource-error')
}
Vue.prototype.util = util
Vue.prototype.config = config
Vue.prototype.$qiniuHost = config.qiniuHost
Vue.prototype.validate = validate
Vue.prototype.$db = db
Vue.prototype.$Ndb = Ndb
// 挂载七牛
Vue.prototype.$qiniu = qiniu

Vue.config.productionTip = false

const vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

export default vue
