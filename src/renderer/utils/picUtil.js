import { Message } from 'element-ui'

const checkPic = (file, currentSize, maxSize) => {
  if (currentSize >= maxSize) {
    Message({
      type: 'info',
      message: '最多上传' + maxSize + '张图.'
    })
    return false
  }
  var isJPG = file.type === 'image/jpeg'
  var isPNG = file.type === 'image/png'
  var isLt2M = file.size / 1024 / 1024 < 2
  console.log('isJPG ' + isJPG)
  console.log('isPNG ' + isPNG)
  console.log('isLt2M ' + isLt2M)

  if (!isJPG && !isPNG) {
    Message.error('上传图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    Message.error('上传图片大小不能超过 2MB!')
    return false
  }
  var isPic = (isJPG || isPNG) && isLt2M
  console.log('是否图片？ ' + isPic)
  if (!isPic) return false
  var timestamp = new Date().valueOf()
  var ext = ''
  if (isJPG) {
    ext = '.jpg'
  }
  if (isPNG) {
    ext = '.png'
  }
  return timestamp + ext
}
export { checkPic }
