
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
// 引入remote模块
import { remote } from 'electron'
// package.json
import pkg from '../../../package.json'
import { encrypt, decrypt } from '@/tools/crypto'

const dbFile = []
const APP = remote.app
// 获取electron应用的用户目录
const MAIN_PATH = APP.getPath('userData')
// 如果不存在路径
if (!fs.pathExistsSync(MAIN_PATH)) { fs.mkdirpSync(MAIN_PATH) }

// 以同步的方式初始化lowdb读写的json文件名以及存储路径
// 使用aes加密解密
const BaseAdapter = new FileSync(path.join(MAIN_PATH, `/${pkg.name}_lowdb.ptdb`)
// , {
//   serialize: (data) => encrypt(JSON.stringify(data)),
//   deserialize: (data) => JSON.parse(decrypt(data))
// }

)

dbFile.push({ name: 'Base', file: BaseAdapter })

export default dbFile // 暴露出去
