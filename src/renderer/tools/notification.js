/**
 * @export
 * @Author: 张恒
 * @Date: 2019-09-29 20:23:16
 * @Last Modified by: Sky
 * @Last Modified time: 2019-09-29 20:54:40
 * @param {Object} option
 * @returns
 * @feature 对于普通的通知只需要加入传入title,body；而对于需要图标的还需要传入icon，当然它也接受一个图片链接
 **/

export default {
  DesktopMsg (option) {
    const Iconfunc = new window.Notification(option.title, option)
    return new Promise((resolve) => {
      Iconfunc.onclick = () => {
        resolve(true)
      }
    })
  }
}
