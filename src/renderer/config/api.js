/* eslint-disable camelcase */
'use strict'

// 获取所有平台店铺
export const allStore = {
  getStore: '/user/ajaxGetStore'
}

// 获取广告
export const ad = {
  getAd: '/adv/ajaxGet', // 获取广告
  clickAd: '/adv/userClick'// 点击广告
}

// 工作台
export const work = {
  homeTip: '/analysis/serveHomeTip',
  homeType: '/analysis/serveHomeType',
  pendOrder: '/analysis/serveHomePendOrder',
  pendJob: '/analysis/serveHomePendJob',
  account: '/analysis/serveHomeAccount'
}

// 工作列表
export const worklist = {
  agency: '/job/serveGet', // 获取待办
  add: '/job/serveAdd', // 添加待办
  getDetail: '/job/serveGetJobDetail', // 获取工作详情
  editDetail: '/job/serveEdit', // 商家修改工作
  del: '/job/serveDel', // 商家删除工作
  getOperation: '/job/serveGetJobLog', // 获取动态列表
  getMsg: '/job/serveGetJobReply', // 获取留言
  addMsg: '/job/serveAddJobReply', // 添加留言
  delMsg: '/job/serveAddJobDel', // 删除留言
  getOneMsg: '/job/serveGetJobReplyOne'// 获取单个留言
}

// 用户申请
export const apply = {
  apply: '/apply/userApply', // 用户申请成为商家(后续有别的)
  del: '/apply/userDel', // 用户删除申请 TODO还未被使用
  get: '/apply/userGet', // 用户获取自己的申请 TODO还未被使用
  rule: '/apply/userGet' // 判断用户是否申请过成为租赁商
}

// 订单管理（模块）order
export const order = {
  serve_get_orderlist: '/order/serveGet',
  serve_edit_order: '/order/serveEdit',
  serve_accept_order: '/order/serveAccept',
  serve_refuse_order: '/order/serveReject',
  serve_add_order: '/order/serveAdd',
  serve_get4_calendar: '/order/serveGet4Calendar',
  serve_dele_order: '/order/serveDel',
  serve_update_price: '/order/serveUpdatePrice',
  serve_update_orderstate: '/order/serveOrderOver',
  serve_add_check: '/order/serveAddCheck', // 商家添加核验单
  serve_get_check: '/order/serveGetCheck', // 商家查询核验单
  serve_edit_check: '/order/serveEditCheck', // 商家修改核验单
  serveAddCheckTpl: '/order/serveAddCheckTpl', // 商家添加核验单模板
  serveEditCheckTpl: '/order/serveEditCheckTpl', // 商家修改核验单模板
  serveDelCheckTpl: '/order/serveDelCheckTpl', // 商家删除核验单模板
  serveGetCheckTpl: '/order/serveGetCheckTpl', // 商家查询核验单模板(单个)
  serveGetCheckTplList: '/order/serveGetCheckTplList', // 商家查询核验单模板(列表)
  newServeOrderGet: '/order/orderGet' // 新后台获取订单接口
}
export const activity = {
  // 无需登录
  get_activity_list: '/activity/ajaxGet', // 获取列表
  get_activity_details: '/activity/ajaxGetDetail', // 获取活动详情
  get_activity_user: '/activity/ajaxGetUser', // 获取参加活动的用户
  // 商家
  serve_add_activity: '/activity/serveAdd', // 商家添加活动
  serve_add_user: '/activity/serveAddUser', // 商家添加用户到活动
  serve_del_activity_user: '/activity/serveDelUser', // 商家删除用户从活动
  serve_edit_activity: '/activity/serveEdit', // 商家编辑活动
  serve_activity_list: '/activity/serveGet', // 商家获取活动
  serve_start_activity: '/activity/serveStart', // 商家开始活动
  serve_dele_activity: '/activity/serveShelfActivity',
  server_get_order: '/activity/serveGetActivityOrder',
  server_shelf_activity: '/activity/serveShelfActivity', // 批量上下架活动
  // 登录用户
  get_my_activity: '/activity/userGetOrder',
  apply_activity: '/activity/userApply',
  del_activity: '/activity/userDeleteOrder',
  // 用户参加活动
  ajaxUserApply: '/activity/userApply',
  // 支付活动
  ajaxActivityPay: '/activity/userPay',
  // 取消活动订单
  cancelActivity: '/activity/userCancelOrder'
}
export const job = {
  get: '/job/serveGet',
  add: '/job/serveAdd',
  del: '/job/serveDel',
  edit: '/job/serveEdit'
}
export const day = {
  serve_get_job: job.get,
  serve_add_job: job.add,
  serve_dele_job: job.del,
  serve_edit_job: job.edit,
  serve_get_calendar: order.serve_get4_calendar
}

// 设备管理（模块）device
export const equip = {
  get: '/equip/serveGet', // 接口（1）：商家获取设备列表
  getByCategory: '/equip/ajaxGetBrandByCategory', // 接口（2）：根据分类ID获取品牌列表
  add: '/equip/serveAdd', // 接口（3）：添加设备
  del: '/equip/serveDelete', // 接口（4）：删除设备
  addNew: '/equip/serveAddNew', // 接口（5）：提交库里没有的设备
  edit: '/equip/serveEdit', // 接口（6）：修改设备
  getSimple: '/equip/serveGetSimple',
  takeOff: '/equip/serveShelfIsUp', // 下架设备
  getEquipCodeList: '/equip/serveGetList4QrCode', // 列表-打印二维码用
  equipIsUp: '/equip/serveShelfIsUp', // 批量上下架
  checkSn: '/equip/checkSnDuplicate' // 检查sn码
}

// 影棚管理（模块）studio
export const studioApi = {
  studioServeGet: '/studio/serveGet', // 接口（1）：商家获取影棚列表
  studioServeAdd: '/studio/serveAdd', // 接口（2）：添加影棚
  studioServeEdit: '/studio/serveEdit', // 接口（3）：编辑影棚
  studioServeDel: '/studio/serveDel', // 接口（4）：删除影棚
  studioShelfIsUp: '/studio/serveShelfIsUp' // 影棚批量上下架
}

// 财务管理模块
export const finance = {
  getAll: '/finance/serveGet', // 获取收入支出列表
  getType: '/finance/serveTypeGet',
  update: '/finance/serveUpdate',
  add: '/finance/serveAdd',
  del: '/finance/serveDel',
  getAllValidYears: '/finance/serveGetAllValidYears',
  getDataByYear: '/finance/serveGetSummaryGroupByMonthOfYear',
  getDataByMonth: '/finance/serveGetByMonth',
  getSumByPeriod: '/finance/serveGetSumByPeriod', // 获取指定时间段内汇总
  getReflectMoney: '/finance/serveGetBalance', // 获取商家可提现的余额
  outBalance: '/finance/serveOutBalance', // 商家提现方法
  getDetail: '/finance/serveGetDetail', // 获取财务详情
  getAllFinance: '/finance/serveGetFinance' // 商家获取收入支出列表（主站后台新）
}

// 基本设置模块
// export const getSetting='/user/serveGetSetting';
export const setting = {
  oldUpdate: 'user/serveUpdateSetting', // 修改商家基本信息（旧的）租赁商使用
  oldGet: '/user/serveGetSetting', // 获取商家基本信息（旧的）租赁商使用
  get: '/user/ajaxGetUserMsg', // 获取商家基本信息（新的）
  update: '/user/editUserMsgBase', // 修改商家基本信息（新的）
  getGeetGt: '/user/ajaxGeetGt',
  getMobilCode: '/user/ajaxGetCode',
  regUser: '/user/ajaxReg',
  forGot: '/user/ajaxForgot',
  updatePsw: '/user/userUpdatePwd', // 修改用户密码
  getEmail: '/user/getEmailCode',
  editEmail: '/user/editEmail',
  checkUser: '/user/authUserTrue',
  isUserTrue: '/user/isUserTrue' // 用户是否实名认证
}

// 员工管理模块
export const employee = {
  getGroup: '/employee/serveGetGroup', // 获取员工分组
  addGroup: '/employee/serveAddGroup', // 添加员工分组
  updateGroup: '/employee/serveEditGroup', // 更新员工分组
  delGroup: '/employee/serveDelGroup', // 删除员工分组
  getAll: '/employee/serveGet', // 获取员工
  add: '/employee/empAdd', // 添加员工
  update: '/employee/empEdit', // 更新员工
  del: '/employee/empDel' // 删除员工
}

// 客户管理模块
export const customer = {
  getAll: '/customer/serveGet',
  getAllSimple: '/customer/serveGetAllSimple',
  add: '/customer/serveAdd',
  update: '/customer/serveEdit',
  del: '/customer/serveDel'

}

// 客户-分组管理模块
export const customer_group = {
  getAll: '/customer/serveGetGroup',
  operate: '/customer/serveAddAndEditGroup',
  del: '/customer/serveDelGroup'
}

// 问题管理模块
export const question = {
  getAll: '/question/serveGet', // 商家获取问题列表
  reply: '/question/userReply', // 回复
  vertify: '/question/serveVerify', // 商家审核问题/回复
  update: '/question/serveUpdate', // 商家修改自己发布的回复
  ajaxGetall: '/question/ajaxGetQuestionList', // 前台获取问题
  ajaxUserAdd: '/question/userAdd', // 用户添加问题
  ajaxUserReply: '/question/userReply' // 用户（商家）回复问题
}

// 常见问题Q&A模块
export const faq = {
  add: '/questionAnswers/serveAdd', // 新增常见问题
  update: '/questionAnswers/serveUpdate', // 修改常见问题
  del: '/questionAnswers/serveDel', // 删除常见问题
  getList: '/questionAnswers/serveGet', // 获取常见问题列表
  operate: '/questionAnswers/serveOperation', // 商家问答关联的增改删
  getListById: '/questionAnswers/ajaxUserGet' // 商家用户根据影棚设备id获取关联的问题
}

// 评论管理模块
export const comment = {
  getAll: '/comment/serveGet', // 获取评论列表
  reply: '/comment/serveReply', // 商家回复评论
  customerAdd: '/comment/add' // 用户评论
}

// 短信
export const sms = {
  getTemplate: '/sms/serveGetTemplate',
  getBalance: '/sms/serveGetBalance',
  send: '/sms/serveSend',
  getHistory: '/sms/serveGetHistory', // 发送历史
  getHistoryDetail: '/sms/serveGetHistoryDetail', // 发送历史详情
  getYunpian: '/sms/serveGetYunpianTemplate', // 获取云片模板
  getAddTplHistory: '/sms/serveGetAddTplHistory', // 用户添加历史(审核历史)
  applyNewTpl: '/sms/serveAddTplNew', // 提交库里没有得
  addTpl: '/sms/serveAddTpl', // 选择模板添加,
  getSmsNum: '/sms/serveGetSmsNum', /// 01商家获取短信条数
  getSmsPrice: '/sms/ajaxGetSmsPrice', // 02获取短信价格
  pay: '/sms/servePay',
  getChargeHistory: '/sms/serveGetChargeHistory',
  getOrderPayStatus: '/sms/userGetOrderPayStatus'
}

export const other = {
  delPic: '/qiniu/serveDelPic',
  searchBank: '/wx/searchBank',
  getServerTime: '/help/ajaxGetTime'
}

// 优惠券模块接口
export const coupon = {
  add: '/coupon/serveAdd', // 商家添加优惠券
  update: '/coupon/serveEdit', // 商家修改优惠券
  del: '/coupon/serverDel', // 商家删除优惠券
  getList: '/coupon/couponGetList', // 获取优惠券列表
  getById: '/coupon/serverGetOne', // 商家根据id获取优惠券
  userAdd: '/coupon/userAdd', // 用户领取优惠券
  userGet: '/coupon/userGet', // 用户获取自己的优惠券
  couponUse: '/coupon/couponUse', // 用户使用优惠券
  couponCancel: '/coupon/couponCancel', // 订单优惠券取消使用
  ajaxGet: '/coupon/ajaxGetList', // 不用登录获取优惠券列表
  couponOrder: '/coupon/couponOrder' // 订单使用过的优惠券
}

export const shopTemplate = {
  getAllShopTpl: '/user/serveGetAllShopTpl', // 商家获取所有店铺模板
  setShopTpl: '/user/serveSetShopTpl' // 商家设置店铺模板
}

// 退款接口
export const refund = {
  userRefundPay: '/orderRefund/userRefundPay', // 用户发起退款
  ajaxUserRefundOrderDetail: '/orderRefund/ajaxUserRefundOrderDetail', // 退款查询(用户/商家)
  userRefundAppeal: '/orderRefund/userRefundAppeal', // 退款申诉(用户)
  serveRefundAnswer: '/orderRefund/serveRefundAnswer' // 退款审核(商家)
}

// 前台接口,
// 首页模块
export const frontHome = {
  getAd: '/banner/ajaxGetAll', // 获取首页轮播图
  getEquip: '/equip/ajaxGetEquipAdv', // 获取器材信息
  getStudio: '/studio/ajaxGetStudioAdv', // 获取影棚信息
  getActivity: activity.get_activity_list // 获取活动,
}
// 成为租赁商模块接口
export const applyHire = {
  applyHire: '/apply/userApply'
}
// 个人中心模块接口
// 个人中心首页接口
export const frontPersonal = {
  personalHome: '/order/userGetUserOrderList',
  getOrder: '/order/userGetUserOrderList',
  getCollectList: '/start/userGetList',
  setTop: '/start/userSetIsTop',
  delBatchCollect: '/start/userUnFollowOrBatch',
  delSingleCollect: '/start/userUnFollowOrUnCollect',
  delCollect: '/start/userUnFollowOrBatch',
  updateUser: '/user/userUpdateSetting', // 修改用户信息
  getUserInfo: '/user/ajaxGetUserToken' // 获取最新用户信息
}
// 个人中心活动模块接口
export const frontActivity = {
  getActivity: '/activity/ajaxGetActivity',
  getActivityOrder: '/activity/userGetOrder'
}
// 个人中心通知消息接口
export const frontMessage = {
  getMsgList: '/notice/userGetList',
  getReadMsg: '/notice/userGetDetail',
  delMsg: '/notice/userDelnotic',
  hasRead: '/notice/userEditnoticRead'
}
// 影棚模块
export const frontStudio = {
  getStudioList: '/studio/ajaxGetStudioList', // 获取影棚列表
  getDetailById: '/studio/ajaxGetStudioDetail' // 根据影棚id获取影棚详情
}

// 设备（器材）模块
export const frontEquip = {
  getAllCategory: '/equip/ajaxGetCategoryAll', // 获取所有器材分类
  getEquipList: '/equip/ajaxGetEquipList', // 获取器材列表
  getBrandByCategory: '/equip/ajaxGetBrandByCategory', // 根据分类ID获取品牌列表
  getEquipById: '/equip/ajaxGetEquipDetail' // 根据设备id获取设备详情
}

// 订单模块
export const frontOrder = {
  addUserOrder: '/order/userAddUserOrder', // 用户提交订单
  getUserOrderList: '/order/userGetList', // 获取用户订单列表
  delUserOrder: '/order/userDelUserOrder', // 删除用户未支付订单
  getOrderCart: '/order/userGetOrderCart', // 用户获取未支付订单购物信息(伪购物车获取)
  editRentOrder: '/order/userEditRentOrder', // 修改预约订单
  rentOrder: '/order/userRentOrder', // 创建预约租用订单
  pay: '/order/userPay', // 订单支付
  getOrderDetail: '/order/userGetDetail',
  updateOrderAddress: '/order/userOrderAddress', // 修改订单地址
  updateOrderOut: '/order/userEditOrderDoor', // 修改订单外送类型
  delOrderNoOut: '/order/userDelOrderDoor', // 删除不能外送的设备
  delOrder: '/order/userDelOrder', // 删除已完成的订单
  getPayStatus: '/order/userGetOrderPayStatus', // 获取订单支付状态
  userOptCheck: '/order/userOptCheck', // 用户更改核验单状态
  userGetCheck: '/order/getCheck' // 用户查询核验单
}

// 评论模块
export const frontComment = {
  getCommentList: '/comment/ajaxGetCommentList', // 获取评论列表
  addComment: '/comment/userAddCommon',
  updateComment: '/comment/userUpdate', // 修改评论
  review: '/comment/userUpdateReply' // 追评
}

// 收藏、关注模块
export const frontFollowOrCollect = {
  followOrCollect: '/start/userFollowOrCollect', // 收藏或关注
  unFollowOrUnCollect: '/start/userUnFollowOrUnCollect', // 取消收藏或关注
  getLsObjById: '/start/userIsObj' // 根据id获取是否已经关注
}

// 用户地址模块
export const frontAddress = {
  addNewAddress: '/address/userAddressAdd', // 新增地址
  getAddressList: '/address/userAddressGetList', // 获取用户地址列表
  delAddress: '/address/userAddressDel', // 删除用户地址
  setDefaultAddress: '/address/userAddressDefault', // 设置默认地址
  updateAddress: '/address/userAddressEdit', // 修改用户地址
  getDefaultAddress: '/address/userAddressGetDetail' // 获取默认地址
}

// 获取店家信息
export const frontShop = {
  getShopById: '/user/ajaxGetUserShop' // 根据店家id获取店家基本信息
}

// 安全设置模块
export const safe = {
  sendCode: 'user/userEditMobileTwoCode', // 修改手机发送验证码
  checkCode: 'user/userEditMobileOnePass', // 修改手机验证原来密码
  updatePhone: '/user/userEditMobileThreeFinish', // 修改手机提交完成
  checkValidCode: '/user/userValidCode', // 修改密码，验证验证码
  getThreeCode: '/user/ajaxthirdLoginGetCode', // 获取code
  getThreeUser: '/user/ajaxthirdLoginGetUser', // 获取用户信息
  RegThreeUser: '/user/ajaxthirdLoginReg', // 注册时，绑定第三方登录
  BangThreeUser: '/user/thirdLoginBang', // 绑定用户信息
  delThreeUser: '/user/thirdLoginDel', // 删除第三方用户信息
  VaildCode: '/user/userVaildMobile', // 验证验证码is匹配手机号码
  SetPwdAndNick: '/user/userUpdatePwdAndNick'// 快速修改用户名和密码
}
// 短链接
export const ShoutUrl = {
  getUrl: '/user/ajaxGetShortUrl'
}
export const help = {
  getType: '/help/ajaxGetType',
  getContent: '/help/ajaxGetContentOne'
}

// ------用户意见反馈模块----------
export const feedback = {
  addFeedback: '/feedback/ajaxAddFeedback' // 用户反馈问题
}

// ------产品（商家）模块----------
export const store = {
  getStoreLimit: '/product/userProductStoreDetail', // 获取商家对应功能（）
  getStoreAccount: '/product/userProductAccountList', // 获取商家子账号列表
  getOneAccount: '/product/userProductAccountOne', // 获取商家子账号详情
  updateAccount: '/product/userProductAccountEdit', // 商家账号修改
  updateAccountRole: '/product/userProductAccountRole', // 商家修改账号权限
  addAccount: '/product/userProductAccountAdd', // 商家添加账号
  delAccount: '/product/userProductAccountDel', // 商家删除账号
  accountLogin: '/user/ajaxAccountLogin' // 商家子账号登录
}

// -------------用户产品模块------------------
export const product = {
  getProductList: '/product/ajaxGetProductList', // 获取产品列表
  addProduct: '/product/productAddOrder', // 用户产品下单
  productPay: '/product/userPay', // 产品支付userPay
  getProductInfo: '/product/ajaxGetProductOrder', // 获取产品订单信息
  getUserProduct: '/product/userProductStoreList', // 获取商家用户开通的功能列表
  getProductStatus: '/product/userGetProductOrderDetail', // 获取产品订单详情（状态）
  ajaxUserPay: '/product/ajaxUserPay', // 用户支付方法(通用)
  getAllProductOrder: '/product/ajaxGetProductALLOrder', // 获取购买产品列表
  testOrder: '/product/testorder', // 模拟支付接口（测试用，后面删除）
  getNowProduct:'/product/ajaxGetUserProductNow', //用户获取产品版本
}
// 申请微信小程序
export const applywx = {
  getReGrantUrl: '/wx/getReGrantUrl'
}
export const ApplyMniApp = {
  create: '/wx/applyMiniApp', // 创建小程序
  saveApply: '/wx/saveApplyData', // 提交申请需要的数据(文字字段)
  getApply: '/wx/getApply', // 查询自己提交的数据和状态
  getCreateStatus: '/wx/queryApplyMiniAppStatus', // 查询创建状态
  queryMiniAppInfo: '/wx/queryMiniAppInfo', // 查询已经创建的
  CapplyPay: '/wx/applyMicro', // 提交申请支付资料
  Progress: '/wx/getProgress', // 查询进度
  RaMiniApp: '/wx/initMiniApp', // 重提交资料
  GetReUrl: '/wx/getReGrantUrl', // 获取重授权rul

  setMiniAppDomain: '/wx/setMiniAppDomain', // 设置域名
  setMiniAppWorkDomain: '/wx/setMiniAppWorkDomain', // 设置工作域名
  setMiniAppCategory: '/wx/setMiniAppCategory', // 设置类目
  setMiniAppInfo: '/wx/setMiniAppInfo', // 设置描述
  setMiniAppName: '/wx/setMiniAppName', // 设置名称
  setMiniAppIcon: '/wx/setMiniAppIcon', // 设置ICON
  setMiniAppTpl: '/wx/setMiniAppTpl', // 设置代码
  setMiniAppCommit: '/wx/setMiniAppCommit', // 提交审核
  setMiniAppRelease: '/wx/setMiniAppRelease', // 提交发布

  queryNameAudit: '/wx/queryNameAudit', // 查询名字审核
  queryOptStatus: '/wx/queryOptStatus', // 查询OptStatus
  queryLastAuditStatus: '/wx/queryLastAuditStatus', // 查询最近一次审核

  applyPay: '/wx/applyPay',
  queryPay: '/wx/queryPay',
  genQR: '/wx/genQR'
}

// 数据分析模块
export const analysis = {
  equipment: '/analysis/ajaxGetCategory',
  getEquip: '/analysis/ajaxGetEquip',
  getStudio: '/analysis/ajaxGetStudio',
  getAllPercent: '/analysis/ajaxGetMoveData',
  getGMV30: '/analysis/ajaxGetGMV30',
  getOrderPrice: '/analysis/ajaxGetOrderPrice',
  getSalePer: '/analysis/ajaxGetSalePer',
  getCouponUse: '/analysis/ajaxGetCoupon',
  getStudioTable: '/analysis/ajaxGetCategoryStudioTable'
}

// --------广告模块（前台）-----------------
export const adv = {
  ajaxGetAdv: '/adv/ajaxGet', // 获取广告
  userClickAdv: '/adv/userClick' // 用户点击广告
}
