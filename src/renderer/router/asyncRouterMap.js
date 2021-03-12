// 后台界面
/**
 * hidden: true                 如果在模板中使用该选项,则不会在侧栏显示该路由(例如：Dashboard),如果是在第一个子路由中使用,侧栏则只显示第一个子路由的名字和图标
 * alwaysShow: true             如果设置为true它则会始终显示根菜单,无视自路由长度,没有设置的话,就会折叠起来(不清楚为什么没有作用,可能是我写错位置了?)
 * redirect: 'noredirect'         若设置为noredirect则顶部面包屑不能够为其重定向.
 * onlyShowfirst: false         若该设置为true时，将会无视其有多少个孩子路由，只会显示第一个子路由并将其设置为根菜单
 * name:'router-name'           路由名称,此项为必须填写项   由于权限管理的原因，子路由name一定要跟path相同
 * meta : {
    title: 'title'               这里的名字决定了面包屑和侧栏的名字
    icon: 'svg-name'             当你在svg文件夹内加入了你的图标,那么在这里填写图标名他就会显示在侧栏
  }
 **/
import Layout from '@/layout'
const WorkBench = () => import('ServePage/work/index')
const WorkList = () => import('ServePage/work/work_list')
const Order = () => import('ServePage/order/index')
const Question = () => import('ServePage/question/index')
const Day = () => import('ServePage/day/index')
const Device = () => import('ServePage/device/index')
const DeviceDetails = () => import('ServePage/device/device_details')
const Active = () => import('ServePage/active/index')
const ActiveOrder = () => import('ServePage/activeOrder/index')
const ActiveOrderDetail = () => import('ServePage/activeOrder/actOrderDetail')
const Employee = () => import('ServePage/employee/index')
const Finance = () => import('ServePage/finance/index')
const FinanceDetail = () => import('ServePage/finance/detail')
const DataShow = () => import('ServePage/finance/dataShow')
const Basic = () => import('ServePage/basic/index')
const Studio = () => import('ServePage/studio/index')
const StudioDetails = () => import('ServePage/studio/studio_details')
const OrderDetails = () => import('ServePage/order/order_details')
const ActiveDetails = () => import('ServePage/active/active_details')
const AddUser = () => import('ServePage/active/adduser')
const Customer = () => import('ServePage/customer/index')
const CustomerDetails = () => import('ServePage/customer/customer_detail')
const Msm = () => import('ServePage/msm/index')
const MsmMessage = () => import('ServePage/msm/message/index')
const MsmCharge = () => import('ServePage/msm/message/charge')
const MsmHistory = () => import('ServePage/msm/message/history')
const smallProIndex = () => import('ServePage/msm/smallpro/index')
const smallShopInfo = () => import('ServePage/msm/smallpro/ShopInfo')
const smallWxPay = () => import('ServePage/msm/smallpro/wxpay')
const Coupon = () => import('ServePage/coupon/index')
const CouponDetail = () => import('ServePage/coupon/coupon_detail')
const AccountDetail = () => import('ServePage/store/account_detail')
const AccountList = () => import('ServePage/order/accountList')
// const Renewal = () => import('ServePage/Renewal')
const Product = () => import('ServePage/product/index')
const ProductDetail = () => import('ServePage/product/detail')
const MoveData = () => import('ServePage/analysis/move_data')
const CategoryData = () => import('ServePage/analysis/category_data')
const cameraTable = () => import('ServePage/analysis/camera_table')
const studioTable = () => import('ServePage/analysis/studio_table')
const Template = () => import('ServePage/template/index')
const permission = () => import('ServePage/permission/index')
const code = () => import('ServePage/code/index')
const message = () => import('ServePage/message/index')

export default [
  {
    path: '/serve/work',
    component: Layout,
    hidden: true,
    redirect: '/serve/work/WorkBench',
    meta: {
      permission: false
    },
    children: [{
      path: 'WorkBench',
      name: 'WorkBench',
      component: WorkBench,
      meta: {
        title: '工作台'
      }
    }]
  },
  {
    path: '/serve/message',
    component: Layout,
    hidden: true,
    redirect: '/serve/message/index',
    children: [{
      path: 'index',
      name: 'messageIndex',
      component: message,
      meta:{
      	title:'消息'
      }
    }]
  },
  {
    path: '/serve/day',
    component: Layout,
    onlyShowfirst: true,
    // name: 'day_set',
    meta: {
      roles: 1
    },
    children: [{
      path: 'day_set',
      name: 'day_set',
      component: Day,
      meta: {
        roles1: 1,
        roles: 1,
        title: '日程管理',
        icon: 'day'
      }
    }]
  },
  {
    path: '/serve/work',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 2,
      permission: false
    },
    children: [{
      path: 'worklist',
      name: 'WorkList',
      component: WorkList,
      meta: {
        roles: 2,
        roles1: 2,
        title: '待办列表',
        icon: 'todo'
      }
    }]
  },
  {
    path: '/serve/order',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 4,
      permission: false
    },
    children: [{
      path: 'order',
      name: 'Order',
      component: Order,
      meta: {
        roles: 4,
        roles1: 4,
        title: '订单管理',
        icon: 'order'
      }
    },
    {
      path: 'details',
      name: 'Details',
      component: OrderDetails,
      meta: {
        roles: 4,
        activeMenu: '/serve/order/order',
        title: '订单信息'
      }
    },
    {
      path: 'accountList',
      name: 'accountList',
      component: AccountList,
      meta: {
        roles: 4,
        activeMenu: '/serve/order/order',
        title: '人员列表'
      }
    }
    ]
  },
  {
    path: '/serve/active_order',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 8,
      permission: false
    },
    children: [{
      path: 'active_order',
      name: 'Active_order',
      component: ActiveOrder,
      meta: {
        roles1: 8,
        roles: 8,
        title: '活动订单',
        icon: 'active_order'
      }
    },
    {
      path: 'active_detail',
      name: 'Active_detail',
      component: ActiveOrderDetail,
      meta: {
        roles: 8,
        activeMenu: '/serve/active_order/active_order',
        title: '订单信息'
      }
    }
    ]
  },
  {
    path: '/serve/finance_set',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 16,
      permission: false
    },
    children: [{
      path: 'finance_set',
      name: 'Finance_set',
      component: Finance,
      meta: {
        roles1: 16,
        roles: 16,
        title: '财务管理',
        icon: 'finance'
      }
    }, {
      path: 'Finance_detail',
      name: 'Finance_detail',
      component: FinanceDetail,
      meta: {
        roles: 16,
        activeMenu: '/serve/finance_set/finance_set',
        title: '财务设置'
      }
    }, {
      path: 'dataShow',
      name: 'dataShow',
      component: DataShow,
      meta: {
        roles: 16,
        activeMenu: '/serve/finance_set/finance_set',
        title: '查看图表'
      }
    }]
  },
  {
    path: '/serve/customer_set',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 32
    },
    children: [{
      path: 'customer_set',
      name: 'Customer_set',
      component: Customer,
      meta: {
        roles1: 32,
        roles: 32,
        title: '客户管理',
        icon: 'customer'
      }
    }, {
      path: 'customer_details',
      name: 'customer_details',
      component: CustomerDetails,
      meta: {
        roles: 32,
        activeMenu: '/serve/customer_set/customer_set'
      }
    }]
  },
  {
    path: '/serve/employee_set',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 64
    },
    children: [{
      path: 'employee_set',
      name: 'Employee_set',
      component: Employee,
      meta: {
        roles1: 64,
        roles: 64,
        title: '团队管理',
        icon: 'employee'
      }
    }, {
      path: 'accountDetail',
      name: 'AccountDetail',
      component: AccountDetail,
      meta: {
        roles: 64,
        activeMenu: '/serve/employee_set/employee_set'
      }
    }]
  },
  {
    path: '/serve/code',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 512
    },
    children: [{
      path: 'code',
      name: 'code',
      component: code,
      meta: {
        roles1: 512,
        roles: 512,
        title: '码上出入库',
        icon: 'employee'
      }
    }]
  },
  {
    path: '/serve/permission',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 128
    },
    children: [{
      path: 'permission',
      name: 'permission',
      component: permission,
      meta: {
        roles1: 128,
        roles: 128,
        title: '权限管理',
        icon: 'employee'
      }
    }]
  },
  {
    path: '/serve/pop_set',
    component: Layout,
    onlyShowfirst: true,
    // name: 'pop_set',
    redirect: 'noredirect',
    meta: {
      roles: 256
    },
    children: [{
      path: 'Msm',
      name: 'Msm',
      component: Msm,
      meta: {
        roles1: 256,
        roles: 256,
        title: '推广中心',
        icon: 'broadcast'
      }
    }, {
      path: 'smallProIndex',
      name: 'smallProIndex',
      component: smallProIndex,
      meta: {
        roles: 256,
        title: '小程序申请',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'smallShopInfo',
      name: 'smallShopInfo',
      component: smallShopInfo,
      meta: {
        roles: 256,
        title: '提交开通小程序基本资料',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'smallWxPay',
      name: 'smallWxPay',
      component: smallWxPay,
      meta: {
        roles: 256,
        title: '提交开通小程序支付资料',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'MsmMessage',
      name: 'MsmMessage',
      component: MsmMessage,
      meta: {
        roles: 256,
        title: '短信营销',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'MsmCharge',
      name: 'MsmCharge',
      component: MsmCharge,
      meta: {
        roles: 256,
        title: '短信充值',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'MsmHistory',
      name: 'MsmHistory',
      component: MsmHistory,
      meta: {
        roles: 256,
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'coupon_set',
      name: 'coupon_set',
      component: Coupon,
      meta: {
        roles: 256,
        title: '优惠券',
        activeMenu: '/serve/pop_set/Msm'
      }
    }, {
      path: 'coupon_detail',
      name: 'coupon_detail',
      component: CouponDetail,
      meta: {
        roles: 256,
        title: '优惠券信息',
        activeMenu: '/serve/pop_set/Msm'
      }
    }]
  },
  // {
  //   path: '/serve/renewal',
  //   component: Layout,
  //   onlyShowfirst: true,
  //   meta: {
  //     roles: 512
  //   },
  //   // children: [{
  //   //   path: 'index',
  //   //   name: 'renewal',
  //   //   component: Renewal,
  //   //   meta: {
  //   //     roles1: 512,
  //   //     roles: 512,
  //   //     title: '续费/升级',
  //   //     icon: 'chanpin'
  //   //   }
  //   // }]
  // },
  {
    path: '/serve/analysis',
    component: Layout,
    redirect: 'noredirect',
    // name: 'analysis',
    meta: {
      permission: false,
      title: '数据分析',
      icon: 'shuju'
    },
    children: [{
      path: 'MoveData',
      name: 'MoveData',
      component: MoveData,
      meta: {
        roles1: 1024,
        roles: 1024,
        icon: 'dongxiao',
        activeMenu: '/serve/analysis/MoveData',
        title: '动销数据'
      }
    }, {
      path: 'CategoryData',
      name: 'CategoryData',
      component: CategoryData,
      meta: {
        roles1: 2048,
        roles: 2048,
        icon: 'pinglei',
        activeMenu: '/serve/analysis/CategoryData',
        title: '品类数据'
      }
    },
    {
      path: 'cameraTable',
      name: 'cameraTable',
      hidden: true,
      component: cameraTable,
      meta: {
        roles: 2048,
        activeMenu: '/serve/analysis/CategoryData',
        title: '品类数据'
      }
    },
    {
      path: 'studioTable',
      name: 'studioTable',
      hidden: true,
      component: studioTable,
      meta: {
        roles: 2048,
        activeMenu: '/serve/analysis/CategoryData',
        title: '品类数据'
      }
    }

    ]
  },
  {
    path: '/serve/control_center',
    component: Layout,
    name: 'control_center',
    redirect: 'noredirect',
    meta: {
      title: '管理中心',
      icon: 'control_center'
    },
    children: [{
      path: 'Device_set',
      name: 'Device_set',
      component: Device,
      meta: {
        title: '设备管理',
        icon: 'device',
        roles: 4096,
        roles1: 4096
      }
    }, {
      path: 'Device_details',
      name: 'Device_details',
      component: DeviceDetails,
      hidden: true,
      meta: {
        activeMenu: '/serve/control_center/Device_set',
        roles: 4096,
        title: '设备详情'
      }
    },
    {
      path: 'Studio_set',
      name: 'Studio_set',
      component: Studio,
      meta: {
        title: '影棚管理',
        icon: 'studio',
        roles: 8192,
        roles1: 8192
      }
    }, {
      path: 'Studio_details',
      name: 'Studio_details',
      component: StudioDetails,
      hidden: true,
      meta: {
        activeMenu: '/serve/control_center/Studio_set',
        roles: 8192,
        title: '影棚详情'
      }
    },
    {
      path: 'Active_set',
      name: 'Active_set',
      component: Active,
      meta: {
        title: '活动管理',
        icon: 'active',
        roles: 16384,
        roles1: 16384
      }
    }, {
      path: 'Active_details',
      name: 'Active_details',
      component: ActiveDetails,
      hidden: true,
      meta: {
        activeMenu: '/serve/control_center/Active_set',
        roles: 16384,
        title: '活动详情'
      }
    }, {
      path: 'Active_adduser',
      name: 'Active_adduser',
      component: AddUser,
      hidden: true,
      meta: {
        activeMenu: '/serve/control_center/Active_set',
        roles: 16384,
        title: '添加用户'
      }
    },
    {
      path: 'Question_set',
      name: 'Question_set',
      component: Question,
      meta: {
        roles: 32768,
        roles1: 32768,
        title: '问题管理',
        icon: 'wenti'
      }
    },
    {
      path: 'template_set',
      name: 'template_set',
      component: Template,
      meta: {
        title: '模板管理',
        icon: 'chanpin',
        roles: 65536,
        roles1: 65536,
        permission: false
      }
    },
    {
      path: 'Basic_set',
      name: 'Basic_set',
      component: Basic,
      meta: {
        title: '基本设置',
        icon: 'basic',
        roles: 131072,
        roles1: 131072
      }
    }
    ]

  },

  {
    path: '/serve/product_set',
    component: Layout,
    onlyShowfirst: true,
    meta: {
      roles: 262144,
      permission: false
    },
    children: [{
      path: 'product_set',
      name: 'product_set',
      component: Product,
      meta: {
        roles1: 262144,
        title: '增值服务',
        icon: 'chanpin',
        roles: 262144
      }
    }, {
      path: 'product_detail',
      name: 'product_detail',
      component: ProductDetail,
      meta: {
        roles: 262144,
        title: '续费',
        activeMenu: '/serve/product_set/product_set'
      }
    }]
  }]
