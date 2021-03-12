// 这里是定义菜单的地方，详情请查看 https://electronjs.org/docs/api/menu
import infotext from './updetail'
import { dialog, shell } from 'electron'
const os = require('os')
const version = require('../../../package.json').version
const menu = [
  {
    label: '设置',
    submenu: [{
      label: '快速重启',
      accelerator: 'F8',
      role: 'reload'
    }, {
      label: '退出',
      accelerator: 'CmdOrCtrl+F4',
      role: 'close'
    }]
  }, {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        role: 'about',
        click: () => {
          info()
        }
      },
      {
        label: '更新历史',
        role: 'uplog',
        click: () => {
          uplog()
        }
      },
      {
        label: '查看在线帮助',
        role: 'help',
        click: () => {
          help()
        }
      }]
  }]
// 打开关于
function info() {
  dialog.showMessageBoxSync({
    title: '关于',
    type: 'info',
    message: '派图影像管理软件',
    detail: `版本信息：${version}\n引擎版本：${process.versions.node}\n当前系统：${os.type()} ${os.arch()} ${os.release()}`
  })
}
// 打开主站帮助页
function help() {
  shell.openExternal('https://www.paitume.com/opman/index')
}
function uplog() {
  dialog.showMessageBox({
    title: '更新日志(๑•̀ㅂ•́)و✧',
    type: 'info',
    message: `当前版本：${version}`,
    detail: infotext.join(' ')
  })
}
export default menu
