/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
import router from './router'
import store from './store'
// Progress 进度条
import NProgress from 'nprogress'
// Progress 进度条样式
import 'nprogress/nprogress.css'
import TimeOutMsg from './components/timeout'

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  try {
    NProgress.start()
    // 判断是否有用户信息
    if (store.getters.user_data) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (store.getters.NewRouters.length === 0) {
          let role = ''
          if (Number(store.getters.user_data.is_role) === 0) {
            role = store.getters.user_data.menu_role
          } else {
            role = 'admin'
          }
          store.dispatch('GenerateRoutes', role).then((res) => {
            router.addRoutes(res)
            if (res[0].path === '/') {
              next({ ...to, replace: true })
            } else {
              next({ path: `${res[0].path}` + '/WorkBench', replace: true })
            }
          })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login')
        NProgress.done()
      }
    }
  } catch (error) {
    NProgress.done()
    TimeOutMsg({ title: '发生内部错误', message: `可能发生的原因：权限逻辑出现问题\n详情信息：\n${error}`, primaryButton: '重启' })
  }
})

router.afterEach(() => {
  NProgress.done()
})
