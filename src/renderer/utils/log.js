/* 沙雕控制台日志
 * V 0.0.3
 */

module.exports = {
  // 沙雕？
  log (MSG) {
    /* MSG就是你要显示的对象 */
    console.log(
      '%co(*≧▽≦)ツ',
      'font-family:Microsoft YaHei;color:#00CCFF',
      MSG
    )
  },

  // 无奈
  warn (MSG) {
    /* MSG就是你要显示的对象 */
    console.warn(
      '%c╮(╯▽╰)╭',
      'font-family:Microsoft YaHei;color:#FF00FF',
      MSG
    )
  },

  // 报错
  error ({ MSG, Code } = {}) {
    /* Code是错误代码
           * MSG就是你要显示的对象
           */
    Code = Code || ''

    console.error(
      '%cΣ(っ °Д °;)っ\n',
      'font-family:Microsoft YaHei;color:#FF0000',
      '错误代码',
      Code,
      MSG
    )
  },

  // 消息
  Msg (NAME, MSG) {
    /* NAME是你要放到标题里的名称
           * MSG就是你要显示的对象
           */
    console.info(
      `%c❀${NAME}消息：\n`,
      'font-family:Microsoft YaHei;color:#FF69B4',
      MSG
    )
  },

  // 计数
  Count (NAME, MSG) {
    /* NAME是你要放到标题里的名称
           * MSG就是你要显示的对象
           */
    console.log(
      `%c❖${NAME}总数：`,
      'font-family:Microsoft YaHei;color:#FF9900',
      MSG
    )
  },

  // 数据
  List (NAME, MSG) {
    /* NAME是你要放到标题里的名称
           * MSG就是你要显示的对象
           */
    console.log(
      `%c📋${NAME}数据：`,
      'font-family:Microsoft YaHei;color:#32CD32',
      MSG
    )
  },

  // 表格
  Table (MSG, SORT) {
    /* MSG就是你要显示到表格里的对象
           * SORT是筛选要显示的对象用的，传入对象名，多个对象用“,”隔开
           */
    SORT ? console.table(MSG, SORT.split(',')) : console.table(MSG)
  }
}
