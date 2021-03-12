import { storage } from '@/utils/storage'

const msgs = {
  state: {
    msg_arr: storage.get('msg_arr'),
    notice:new Date().getTime(),
  },
  mutations: {
    SET_MSG_ARR: (state, data) => {
      storage.set('msg_arr', data)
      state.msg_arr = data
    },
    REMOVE_MSG_ARR: (state, data) => {
      storage.remove('msg_arr')
      state.msg_arr = data
    },
    updateNotice:(state)=>{
    	state.notice=new Date().getTime();
    }
  },
  actions: {
    setMsgArr ({ commit }, data) {
      return new Promise((resolve, reject) => {
        console.log(data)
        commit('SET_MSG_ARR', data)
        resolve()
      })
    },
    RemoveMsgArr ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('REMOVE_MSG_ARR', '')
        resolve()
      })
    }
  }
}
export default msgs
