import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import asyncRouterMap from './asyncRouterMap'
Vue.use(Router)

export const constantRouterMap = [{
  path: '/login',
  component: login,
  hidden: true
}, {
  path: '*',
  component: () => import('@/views/npermission'),
  hidden: true
}]

export const asyncRoutes = asyncRouterMap

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
const router = createRouter()

export default router
