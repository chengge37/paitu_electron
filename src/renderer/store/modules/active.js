import { storage } from '@/utils/storage'

const active = {
  state: {
    active_page_data: storage.get('active_data')
  },
  mutations: {
    SET_ACTIVITY_DATA: (state, data) => {
      storage.set('active_data', data)
      state.active_page_data = data
    },
    REMOVE_DATA: (state, data) => {
      storage.remove('active_data')
      state.active_page_data = data
    }
  },
  actions: {
    ActiveOpenNext ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        commit('SET_ACTIVITY_DATA', data)
        resolve()
      })
    },
    ActiveOutPage ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('REMOVE_DATA', '')
        resolve()
      })
    }
  }
}
export default active
