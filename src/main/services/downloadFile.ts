import { app, ipcMain, BrowserWindow, dialog } from 'electron'
import * as path from 'path'
import * as os from 'os'
import { exists, remove } from 'fs-extra'
class Main {

  public mainWindow: BrowserWindow = null
  public downloadUrl: string = ""
  public version: string = require('../../../package.json').version
  public baseUrl: string = 'https://pic.paitume.com/'
  public Sysarch: string = os.arch().includes('64') ? 'win64' : 'win32'
  public HistoryFilePath = path.join(app.getPath('downloads'), os.platform().includes('win32') ? `paitume_${this.version}_${this.Sysarch}.exe` : `paitume_${this.version}_mac.dmg`)


  constructor(mainWindow: BrowserWindow, downloadUrl?: string) {
    this.mainWindow = mainWindow
    this.downloadUrl = downloadUrl || os.platform().includes('win32') ? this.baseUrl + `paitume_${this.version}_${this.Sysarch}.exe?${new Date().getTime()}` : this.baseUrl + `paitume_${this.version}_mac.dmg?${new Date().getTime()}`
  }

  start() {
    ipcMain.on('satrt-download', (event, msg) => {
      // 更新时检查有无同名文件，若有就删除，若无就开始下载
      exists(this.HistoryFilePath, async (e) => {
        try {
          if (e) {
            await remove(this.HistoryFilePath)
          }
          this.mainWindow.webContents.downloadURL(this.downloadUrl)
        } catch (error) { console.log(error) }
      })
      event.reply('confirm-download', true)
      this.mainWindow.webContents.session.on('will-download', (event: any, item: any, webContents: any) => {
        const filePath = path.join(app.getPath('downloads'), item.getFilename())
        item.setSavePath(filePath)
        item.on('updated', (event: any, state: String) => {
          switch (state) {
            case 'progressing':
              this.mainWindow.webContents.send('download-progress', (item.getReceivedBytes() / item.getTotalBytes() * 100).toFixed(0))
              break
            default:
              this.mainWindow.webContents.send('download-error', true)
              dialog.showErrorBox('下载出错', '由于网络或其他未知原因导致客户端下载出错，请前往官网进行重新安装')
              break
          }
        })
        item.once('done', (event: any, state: String) => {
          switch (state) {
            case 'completed':
              const data = {
                filePath
              }
              this.mainWindow.webContents.send('download-done', data)
              break
            case 'interrupted':
              this.mainWindow.webContents.send('download-error', true)
              dialog.showErrorBox('下载出错', '由于网络或其他未知原因导致客户端下载出错，请前往官网进行重新安装')
              break
            default:
              break
          }
        })
      })
    })
  }
}

export default Main
