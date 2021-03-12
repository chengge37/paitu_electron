import { storage } from '@/utils/storage'

const city = {
  state: {
    city_code: storage.get('city_code')
  },
  mutations: {
    SET_CITY_CODE: (state, data) => {
      storage.set('city_code', data)
      state.city_code = data
    },
    REMOVE_DATA: (state, data) => {
      storage.remove('city_code')
      state.city_code = data
    }
  },
  actions: {
    setCityCode ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        commit('SET_CITY_CODE', data)
        resolve()
      })
    },
    RemoveCode ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('REMOVE_DATA', '')
        resolve()
      })
    }
  }
}
export default city
