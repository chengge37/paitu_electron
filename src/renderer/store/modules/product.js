/* eslint-disable prefer-promise-reject-errors */
import { getRequest } from '@/utils/request'
import { differenceInHours } from 'date-fns'

const params = { mac: require('node-machine-id').machineIdSync() }
const product = {
  state: {
    temp_states: localStorage.getItem('temp_states'),
    mac_states: localStorage.getItem('mac_states'),
    use_time: localStorage.getItem('use_time'),
    server_time: localStorage.getItem('server_time'),
    version: localStorage.getItem('vsersion')
  },
  mutations: {
    UPDATE_TEMP_DATA (state, data) {
      localStorage.setItem('temp_states', JSON.stringify(data))
      state.temp_states = data
    },
    UPDATE_MAC_STATES (state, data) {
      localStorage.setItem('mac_states', JSON.stringify(data))
      state.mac_states = data
    },
    UPDATE_USE_TIME (state, data) {
      localStorage.setItem('use_time', JSON.stringify(data))
      state.use_time = data
    },
    UPDATE_VERSION (state, data) {
      localStorage.setItem('vsersion', JSON.stringify(data))
      state.vsersion = data
    }
  },
  actions: {
    GetProduct ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getRequest('/product/userProductStoreDetail', { type: data }).then(res => {
          commit('UPDATE_TEMP_DATA', res)
          commit('UPDATE_USE_TIME', differenceInHours(new Date(res.end_time), res.time * 1000))
          resolve(res)
        })
      })
    },
    ValidMachine ({ commit }) {
      return new Promise((resolve, reject) => {
        getRequest('/product/validMachine', params).then(res => {
          console.log('机器码', res)
          commit('UPDATE_MAC_STATES', res)
          resolve(res)
        })
      })
    },
    Macopen () {
      return new Promise((resolve, reject) => {
        getRequest('/product/machineOpen', params).then(res => {
          resolve(res)
        })
      })
    },
    GetProductDetail ({ commit }) {
      return new Promise((resolve, reject) => {
        getRequest('/product/ajaxGetProtuctDetail', { id: 11 }).then(res => {
          commit('UPDATE_VERSION', res.version)
          resolve(res)
        })
      })
    },
    AddMac ({ commit }) {
      return new Promise((resolve, reject) => {
        getRequest('/product/userAddMac', params).then(res => resolve(true)).catch(err => reject(false, err))
      })
    }
  }
}
export default product
