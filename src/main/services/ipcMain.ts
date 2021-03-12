/* eslint-disable prefer-promise-reject-errors */
import { ipcMain, dialog, BrowserWindow } from 'electron'
export default {
  Mainfunc(mainWindow: BrowserWindow, IsUseSysTitle: Boolean) {
    ipcMain.on('IsUseSysTitle', (event) => {
      const data = IsUseSysTitle
      event.reply('CisUseSysTitle', data)
    })
    ipcMain.on('windows-mini', () => {
      mainWindow.minimize()
    })
    ipcMain.on('window-max', (event) => {
      if (mainWindow.isMaximized()) {
        event.reply('window-confirm', false)
        mainWindow.restore()
      } else {
        event.reply('window-confirm', true)
        mainWindow.maximize()
      }
    })
    ipcMain.on('window-close', () => {
      mainWindow.close()
    })
    ipcMain.on('window-reload', () => {
      mainWindow.reload()
    })
    // 当没有成功加载动态标签时触发
    ipcMain.on('resource-error', (event, arg) => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '必要动态库丢失',
        buttons: ["重试", "退出软件"],
        message: '由于网络或者其他未知因素导致必要在线动态库丢失，是否重试？',
        noLink: true
      }).then(res => {
        if (res.response === 0) {
          mainWindow.reload()
        } else {
          mainWindow.close()
        }
      })
    })
    // 创建打印窗口
    ipcMain.on('open-win', (event, arg) => {
      let PrintWin = new BrowserWindow({
        parent: mainWindow,
        modal: process.platform === 'win32',
        height: 595,
        useContentSize: true,
        width: 842,
        autoHideMenuBar: true,
        minWidth: 842,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          // 如果是开发模式可以使用devTools
          devTools: process.env.NODE_ENV === 'development',
          // 在macos中启用橡皮动画
          scrollBounce: process.platform === 'darwin'
        }
      })
      PrintWin.loadURL(arg.url)
      PrintWin.webContents.once('dom-ready', () => {
        PrintWin.show()
        PrintWin.webContents.send('send-data', arg.sendData)
        if (arg.IsPay) {
          // 检查支付时候自动关闭小窗口
          let testUrl = setInterval(() => {
            let Url = PrintWin.webContents.getURL()
            if (Url.includes('paitume')) {
              PrintWin.close()
            }
          }, 1200)
          PrintWin.on('close', () => {
            clearInterval(testUrl)
          })
        }
      })

    })
  }
}
