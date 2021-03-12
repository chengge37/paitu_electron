import Vue from 'vue'
import Main from './main.vue'
const TimeOutConstructor = Vue.extend(Main)

const Timeoutmsg = (option) => {
  const v = new TimeOutConstructor({ data: option }).$mount()
  document.body.appendChild(v.$el)
}
export default Timeoutmsg
