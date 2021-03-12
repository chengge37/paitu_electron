import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import Baseadapter from './BaseConfig'
import Useradapter from './UserConfig'

const adapterlist = Baseadapter.concat(Useradapter)
const db = {}
// lowdb接管该文件
try {
  adapterlist.forEach(item => {
    db[item.name] = Datastore(item.file)
    db[item.name]._.mixin(LodashId)
  })
  // 通过._mixin()引入lodash_id唯一id插件
  if (!db.Base.has('user').value()) {
    adapterlist.forEach(item => {
      db[item.name].set('user', [{ id: '', data: [] }]).write()
    })
  }
} catch (error) {
  console.log('在挂载阶段读取：', error.message)
}

export default db
