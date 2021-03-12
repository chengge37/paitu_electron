import setIpc from './ipcMain'
import RendSocket from './socket'
import config from '@config/index'
import menuconfig from '../config/menu'
import DownloadUpdate from './downloadFile'
import { app, BrowserWindow, Menu, dialog } from 'electron'
import { winURL, loadingURL } from '../config/StaticPath'
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

class MainInit {

  public winURL: string = ''
  public shartURL: string = ''
  public loadWindow: BrowserWindow = null
  public mainWindow: BrowserWindow = null

  constructor() {
    this.winURL = winURL
    this.shartURL = loadingURL
    if (process.env.NODE_ENV === 'development') {
      menuconfig.push({
        label: '开发者设置',
        submenu: [{
          label: '切换到开发者模式',
          accelerator: 'CmdOrCtrl+I',
          role: 'toggledevtools'
        }]
      })
    }
  }
  // 主窗口函数
  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      height: 900,
      useContentSize: true,
      width: 1822,
      minWidth: 1366,
      show: false,
      frame: config.IsUseSysTitle,
      titleBarStyle: config.IsUseSysTitle ? 'default' : 'hidden',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        // 如果是开发模式可以使用devTools
        devTools: process.env.NODE_ENV === 'development',
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      }
    })
    // 获取窗口内容的session
    const ses: any = this.mainWindow.webContents.session
    // 赋予模板
    const menu = Menu.buildFromTemplate(menuconfig as any)
    // 加载模板
    Menu.setApplicationMenu(menu)
    // 加载主窗口
    this.mainWindow.loadURL(this.winURL)
    // 检查更新
    const download: DownloadUpdate = new DownloadUpdate(this.mainWindow)
    download.start()
    // 启用socket
    RendSocket.Socket(this.mainWindow)
    // 启用协议，这里暂时只用于自定义头部的时候使用
    setIpc.Mainfunc(this.mainWindow, config.IsUseSysTitle)
    // 安装devtools
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.once('dom-ready', () => {
        this.mainWindow.show()
        this.mainWindow.maximize()
        electronDevtoolsInstaller(VUEJS_DEVTOOLS)
          .then((name) => console.log(`已安装: ${name}`))
          .catch(err => console.log('无法安装 `vue-devtools`: \n 可能发生得错误：网络连接问题 \n', err))
        this.loadWindow.destroy()
        this.mainWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
      })
    } else {
      this.mainWindow.webContents.once('dom-ready', () => {
        this.mainWindow.show()
        this.mainWindow.maximize()
        this.loadWindow.destroy()
      })
    }
    // 当确定渲染进程卡死时
    this.mainWindow.webContents.on('crashed', () => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: '警告',
        buttons: ['重载', '退出'],
        message: '图形化进程失去响应，是否等待其恢复？',
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
        console.log(res)
      })
    })
    // 不知道什么原因，反正就是这个窗口里的页面触发了假死时执行
    this.mainWindow.on('unresponsive', () => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: '警告',
        buttons: ['重载', '退出'],
        message: '图形化进程失去响应，是否等待其恢复？',
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
      })
    })
    app.on('gpu-process-crashed', () => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: '',
        buttons: ['切换', '退出'],
        message: '侦测到图形处理设备丢失，若继续则会导致软件出现意外故障，是否切换到通用模式，若切换后仍然黑屏请联系我们。',
        noLink: true
      }).then(res => {
        // 当显卡出现崩溃现象时使用该设置禁用显卡加速模式。（2020-01-08）证实有效
        if (res.response === 0) {
          app.disableHardwareAcceleration()
          this.mainWindow.reload()
        } else {
          this.mainWindow.close()
        }
      })
    })
    // 关闭时，清空用户信息
    this.mainWindow.on('close', () => {
      ses.clearStorageData({ storages: ['localstorage'] })
    })
    this.mainWindow.on('session-end', () => {
      ses.clearStorageData({ storages: ['localstorage'] })
    })
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }
  // 加载窗口函数
  loadindWindow(loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 800,
      height: 426,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      webPreferences: { experimentalFeatures: true }
    })

    this.loadWindow.loadURL(loadingURL)
    this.loadWindow.show()
    this.loadWindow.setAlwaysOnTop(true)
    // 延迟两秒可以根据情况后续调快，= =，就相当于个，sleep吧，就那种。 = =。。。
    setTimeout(() => {
      this.createMainWindow()
    }, 1500)
  }
  // 初始化窗口函数
  initWindow() {
    if (config.UseStartupChart) {
      return this.loadindWindow(this.shartURL)
    } else {
      return this.createMainWindow()
    }

  }
}
export default MainInit
