import { storage } from '@/utils/storage'

const day = {
  state: {
    day_page_data: storage.get('day_data')
  },
  mutations: {
    SET_DAY_DATA: (state, data) => {
      storage.set('day_data', data)
      state.day_page_data = data
    },
    REMOVE_DATA: (state, data) => {
      storage.remove('day_data')
      state.day_page_data = data
    }
  },
  actions: {
    DayOpenNext ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        commit('SET_DAY_DATA', data)
        resolve()
      })
    },
    DayOutPage ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('REMOVE_DATA', '')
        resolve()
      })
    }
  }
}
export default day
