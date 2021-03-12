const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user_data: state => state.user.user_data,
  loginOver: state => state.user.loginOver,
  IsStaff: state => state.user.isStaff,
  is_login_in: state => state.user.user_data != null && state.user.user_data !== undefined && state.user.user_data !== false,
  no_login_notice_time: state => state.user.no_login_notice_time,
  city_code: state => state.city.city_code,
  errorLogs: state => state.errorLog.logs,
  NewRouters: state => state.filter_route.addRouters,
  temp_states: state => state.product.temp_states,
  mac_states: state => state.product.mac_states,
  use_time: state => state.product.use_time,
  version: state => state.product.version,
  msg_arr: state => state.msg.msg_arr,
  notice: state => state.msg.notice
}
export default getters
