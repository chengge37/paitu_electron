import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote } from 'electron'
import pkg from '../../../package.json'
import { encrypt, decrypt } from '@/tools/crypto'

const APP = remote.app
const USER_PATH = path.join(APP.getPath('documents'), `/${pkg.name}`)
const UserDB = ['Device', 'Order', 'Studio', 'Finance', 'Customer', 'Work']

if (!fs.pathExistsSync(USER_PATH)) fs.mkdirpSync(USER_PATH)

export default UserDB.map(item => {
  // 当各个文件夹不存在时，创建文件夹
  if (!fs.pathExistsSync(path.join(USER_PATH, `/${item}`))) fs.mkdirpSync(path.join(USER_PATH, `/${item}`))
  return {
    name: item,
    file: new FileSync(path.join(USER_PATH, `/${item}/${pkg.name}_${item}.ptdb`)
    // , {
    //   serialize: (data) => encrypt(JSON.stringify(data)),
    //   deserialize: (data) => JSON.parse(decrypt(data))
    // }
    )
  }
})
