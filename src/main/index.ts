'use strict'

import { app } from 'electron'
import initWindow from './services/windowManager'
import DisableButton from './config/DisableButton'

function onAppReady() {
  const init = new initWindow()
  init.initWindow()
  DisableButton.Disablef12()
}
// 当mac时，禁用缓存
if (process.platform === 'darwin') {
  app.commandLine.appendSwitch('--disable-http-cache')
}

app.isReady() ? onAppReady() : app.on('ready', onAppReady)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('browser-window-created', () => {
  console.log('创建新窗口')
  console.log(process.platform)
})

if (process.platform === 'win32') {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.removeAsDefaultProtocolClient('paituClient')
      console.log('有于框架特殊性开发环境下无法使用')
    }
  } else {
    app.setAsDefaultProtocolClient('paituClient')
  }
}

