import { postRequest, getRequest } from '@/utils/request'

import db from '@/db'
import { resetRouter } from '@/router'
const UserDB = ['Base', 'Device', 'Order', 'Studio', 'Finance', 'Customer', 'Work']
const user = {
  state: {
    user_data: JSON.parse(localStorage.getItem('user')),
    no_login_notice_time: 0,
    loginOver: 'false',
    isStaff: JSON.parse(localStorage.getItem('isStaff'))
  },
  mutations: {
    update_user_data (state, data) {
      localStorage.setItem('user', JSON.stringify(data))
      state.user_data = data
    },
    remove_user_data (state, data) {
      localStorage.removeItem('user')
      state.user_data = data
    },
    update_no_login_notice_time (state, data) {
      localStorage.setItem('no_login_notice_time', data)
      state.no_login_notice_time = data
    },
    update_loginOver (state, data) {
      localStorage.setItem('loginOver', data)
      state.loginOver = data
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        postRequest('/user/ajaxAccountLoginByMobile', userInfo).then(res => {
          if (res instanceof Error || res === undefined) {
            commit('remove_user_data')
          } else {
            commit('update_user_data', res)
            commit('update_loginOver', false)
            // 判断数据库中是否有用户若是初始化状态就写入用户信息
            if (!db.Base.get('user[0].id').value()) {
              UserDB.forEach(item => {
                db[item].get('user')
                  .find({ id: db[item].get('user[0].id').value() })
                  .assign({ id: res.id })
                  .write()
              })
            } else {
              // 判断数据库中有无此用户
              const hasId = db.Base.get('user').value().map(item => {
                if (Number(item.id) === Number(res.id)) {
                  return true
                }
              })
              // 若无则写入
              if (!hasId.includes(true)) {
                UserDB.forEach(item => {
                  db[item].get('user').push({ id: res.id, data: [] }).write()
                })
              }
            }

            resolve(true)
          }
        }).catch(err => {
          commit('remove_user_data')
          reject(err)
        })
      })
    },
    VaildToken ({ commit }) {
      return new Promise((resolve, reject) => {
        getRequest('/user/ajaxGetUserToken').then(res => {
          if (res) {
            console.log('重载用户信息')
            commit('update_user_data', res)
            commit('update_loginOver', false)
            resolve(res)
          }
        })
      })
    },
    LogOut ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        postRequest('/user/ajaxLogout').then(() => {
          commit('remove_user_data', null)
          dispatch('ResetRoutes')
          resetRouter()
          resolve()
        }).catch(err => reject(err))
      })
    }
  }
}
export default user
