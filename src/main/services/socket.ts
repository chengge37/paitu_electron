import { ipcMain, BrowserWindow } from 'electron'
import { w3cwebsocket } from 'websocket'

class SocketMain {

  private token: string = ""
  private client: w3cwebsocket = null
  private url: string = ""
  private mainWindow: BrowserWindow = null
  private lockReconnect: Boolean = false
  private time: number = 540000
  private timeFun: any = null
  private serverFun: any = null

  constructor(token: string, mainWindow: BrowserWindow) {
    this.token = token
    this.mainWindow = mainWindow
    this.url = process.env.SOCKET_API
  }

  createWebSocket() {
    this.client = new w3cwebsocket(this.url, this.token, 'IP', { 'User-Agent': 'electron-app' })
    this.initOperate()
  }

  initOperate() {
    this.client.onerror = (err: any) => {
      const data = {
        status: -1,
        message: err
      }
      console.log("socket连接出错")
      this.Message(data)
      this.reconnect()
    }

    this.client.onopen = () => {
      this.reset()
      this.start()
      const data = {
        status: 0,
        message: '连接建立完成'
      }
      console.log("socket链接建立")
      this.Message(data)
    }

    this.client.onclose = (err) => {
      const data = {
        status: 1,
        message: '客户端断开连接'
      }
      console.log("socket断开", err)
      this.Message(data)
      this.reconnect()
    }

    this.client.onmessage = (e: any) => {
      const data = {
        status: 2,
        message: JSON.parse(e.data)
      }
      console.log("socket发送消息")
      this.Message(data)
    }
  }

  Message(data: any) {
    const senddata = {
      state: data.type,
      msg: data.message
    }
    this.mainWindow.webContents.send('main-msg', senddata)
  }
  // 重连
  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, 5000);
  }
  reset() {
    clearTimeout(this.timeFun)
    clearTimeout(this.serverFun)
  }
  start() {
    this.timeFun = setTimeout(() => {
      this.client.send('ping')
      this.serverFun = setTimeout(() => {
        this.client.close()
      }, this.time)
    }, this.time)
  }

}

export default {
  Socket(mainWindow: BrowserWindow) {
    console.log('socket激活')
    ipcMain.on('open-socket', (event, arg) => {
      const ActSocket: SocketMain = new SocketMain(arg, mainWindow)
      ActSocket.createWebSocket()
    })
  }
}
