import { storage } from '@/utils/storage'

const active = {
  state: {
    order_page_data: storage.get('order_data')
  },
  mutations: {
    SET_ORDER_DATA: (state, data) => {
      storage.set('order_data', data)
      state.order_page_data = data
    },
    REMOVE_DATA: (state, data) => {
      storage.remove('order_data')
      state.order_page_data = data
    }
  },
  actions: {
    OrderOpenNext ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        commit('SET_ORDER_DATA', data)
        resolve()
      })
    },
    OrderOutPage ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('REMOVE_DATA', '')
        resolve()
      })
    }
  }
}
export default active
