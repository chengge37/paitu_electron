// 这里定义了静态文件路径的位置
import { join } from 'path'
var __static:string
if (process.env.NODE_ENV !== 'development') {
    __static = join(__dirname, '/static').replace(/\\/g, '\\\\')
}

export const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
export const loadingURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080/static/loader.html` : `file://${__static}/loader.html`
