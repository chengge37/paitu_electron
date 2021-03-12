module.exports = {
  build: {
    env: require('./prod.env')
  },
  dev: {
    env: require('./dev.env'),
    removeElectronJunk: true
  },
  DisableF12: true, // 是否禁用F12
  UseStartupChart: true, // 是否开启启动动画
  IsUseSysTitle: true // 是否使用系统头部
}
