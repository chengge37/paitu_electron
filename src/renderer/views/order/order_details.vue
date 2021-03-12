<template>
  <div>
    <!--基本信息-->
    <div class="card">
      <div class="baseInfo">
        <p class="headTitle">基本信息</p>
        <div class="printBtn">
          <ali-svg-icon icon-class="dayin"></ali-svg-icon>
          <el-button type="text" @click="printDeal('0')">打印订单</el-button>
          <el-button type="text" @click="printDeal('1')">隐藏价格打印订单</el-button>
        </div>
      </div>
      <ul class="baseList">
        <li>
          <span class="name">下单时间：</span>
          <span class="value">{{rowdata.create_time | time2Date}}</span>
        </li>
        <li>
          <span class="name">订单开始：</span>
          <span class="value">{{rowdata.start_time}}</span>
        </li>
        <li>
          <span class="name">订单结束：</span>
          <span class="value">{{rowdata.end_time}}</span>
        </li>
        <li>
          <span class="name">订单状态：</span>
          <span class="value">{{rowdata.pay_status | payStatusFilter}}</span>
        </li>
        <li>
          <span class="name">订单类型：</span>
          <span class="value" v-if="rowdata.has_studio == 1&&rowdata.has_equipment == 0">影棚订单</span>
          <span class="value" v-if="rowdata.has_equipment == 1&&rowdata.has_studio == 0">设备订单</span>
          <span class="value" v-if="rowdata.has_studio == 1&&rowdata.has_equipment == 1">影棚设备订单</span>
        </li>
        <li>
          <span class="name">订单编号：</span>
          <span class="value">{{rowdata.show_id}}</span>
        </li>
        <li>
          <span class="name">订单金额：</span>
          <span class="value" v-if="isEdit">{{form.price}}</span>
          <div class="value" v-else>
            <el-input v-model="form.price" />
          </div>
        </li>
        <li>
          <span class="name">配送地址：</span>
          <span class="value">{{rowdata.address_id==0?'用户自提':'寄送'}}</span>
        </li>
      </ul>
    </div>

    <!--订单明细-->
    <div class="card">
      <p class="headTitle">订单明细</p>
      <!--影棚详情信息-->
      <div class="product" v-if="form.studio_price">
        <div class="productList">
          <el-image
            style="width:330px;height:330px;"
            :src="$qiniuHost+form.studio_pic"
            fit="scale-down"
          ></el-image>
          <ul>
            <li>
              <span class="name">影棚名称：</span>
              <span class="value">{{form.studio_name}}</span>
            </li>
            <li>
              <span class="name">订单开始：</span>
              <span class="value">{{rowdata.start_time}}</span>
            </li>
            <li>
              <span class="name">订单结束：</span>
              <span class="value">{{rowdata.end_time}}</span>
            </li>
            <li>
              <span class="name">租用价格：</span>
              <span class="value">{{form.studio_price}}</span>
            </li>
            <li>
              <span class="name">租用时间：</span>
              <span class="value" v-if="form.rent_type==2">{{form.studio_start_time}}天</span>
              <span class="value" v-if="form.rent_type==1">{{form.studio_start_time}}小时</span>
            </li>
            <li>
              <span class="name">租赁方式：</span>
              <span class="value">{{form.rent_type==1?'按小时租赁':'按天租赁'}}</span>
            </li>
          </ul>
        </div>
      </div>

      <!--设备详情信息-->
      <div class="product" v-for="(item,index) in form.device" :key="index">
        <div class="productList">
          <el-image
            style="width:330px;height:330px;"
            fit="scale-down"
            :src="util.picExplode(item.equip.pic)"
          ></el-image>
          <ul>
            <li>
              <span class="name">产品名称：</span>
              <span class="value">{{item.equip.static.name}}</span>
            </li>
            <li>
              <span class="name">订单开始：</span>
              <span class="value">{{rowdata.start_time}}</span>
            </li>
            <li>
              <span class="name">订单结束：</span>
              <span class="value">{{rowdata.end_time}}</span>
            </li>
            <li>
              <span class="name">租借数量：</span>
              <span class="value">{{item.order_count}}</span>
            </li>
            <li>
              <span class="name">订单类型：</span>
              <span class="value">{{rowdata.is_manual==0?'线上订单':'线下订单'}}</span>
            </li>
            <li>
              <span class="name">类型：</span>
              <span class="value">{{item.equip.static.category_name}}</span>
            </li>
            <li>
              <span class="name">设备单价：</span>
              <span class="value">{{item.price}}</span>
            </li>
            <li v-if="rowdata.pay_status != 2&&!isEdit">
              <span class="name">分配SN码：</span>
              <el-popover placement="right" trigger="click">
                <div
                  v-for="(device_sn,index) in parseInt(item.order_count)"
                  :key="index"
                  class="sn-style"
                >
                  <el-select
                    v-model="sn_code[`${item.equip_id}&${device_sn}`]"
                    placeholder="请选择sn码"
                    @change="set_sn_code(item)"
                    :disabled="isEdit"
                  >
                    <el-option
                      v-for="sn_data in item.equip.sn_array"
                      :key="sn_data.id"
                      :label="sn_data.sn"
                      :value="sn_data.id"
                    ></el-option>
                  </el-select>
                </div>
                <el-button type="text" slot="reference">点击查看详情</el-button>
              </el-popover>
            </li>
          </ul>
          <ul v-if="isEdit">
            <li v-for="sncode in item.equip.sn_array" :key="sncode.id">
              <span class="name">设备SN码：</span>
              <span class="value">{{sncode.sn}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 指派员工 -->
    <div class="card">
      <p class="headTitle">指派员工</p>
      <div class="emp-cont">
        <addEmployee
          :get_group_url="group_url"
          :get_employee_url="employee_url"
          :isEdit="isEdit"
          :prop_plist="form.employee"
          @getemployeelist="employee_list"
        />
      </div>
    </div>
    <!--客户信息-->
    <div class="card">
      <p class="headTitle">客户信息</p>
      <div class="userInfo" v-if="rowdata.user">
        <el-image
          style="width:100px;height:100px"
          :src="rowdata.user.avatar?($qiniuHost+rowdata.user.avatar):config.male_pic"
        ></el-image>
        <ul class="userList">
          <li>
            <span class="name">客户名称：</span>
            <span class="value">{{rowdata.user.nick}}</span>
          </li>
          <li>
            <span class="name">联系方式：</span>
            <span class="value">{{rowdata.user.mobile}}</span>
          </li>
        </ul>
      </div>
      <div class="userInfo" v-else>
        <el-image
          style="width:100px;height:100px"
          :src="rowdata.customer.avatar?($qiniuHost+rowdata.customer.avatar):config.male_pic"
        ></el-image>
        <ul class="userList">
          <li>
            <span class="name">客户名称：</span>
            <span class="value">{{rowdata.customer.name}}</span>
          </li>
          <li>
            <span class="name">联系方式：</span>
            <span class="value">{{rowdata.customer.mobile}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--添加备注-->
    <div class="card">
      <p class="headTitle">添加备注</p>
      <div class="remark">
        <span>订单备注：</span>
        <el-input type="textarea" v-model="form.remark"></el-input>
      </div>
    </div>

    <div class="bottomBtn">
      <div v-if="!isEdit">
        <el-button type="primary" @click="confirm" v-permission>确定</el-button>
        <el-button @click="cancel" v-permission>取消</el-button>
      </div>
      <el-button type="primary" v-else @click="edit" v-permission>修改</el-button>
      <div v-if="rowdata.pay_status == 2">
        <el-button type="primary" @click="refuse" style="margin-left: 20px;" v-permission>拒接</el-button>
        <el-button type="primary" @click="accept" v-permission>接单</el-button>
      </div>
    </div>

    <!--打印A4格式表格-->
    <div class="printForm" ref="printOrder">
      <div class="printTop">
        <p>店铺名称：{{user_data.nick}}</p>
        <span>订单打印</span>
        <p>{{util.getCurDay()}}</p>
      </div>
      <div class="printOrderInfo">
        <p class="title">订单信息</p>
        <div class="infoList">
          <p>
            <span>订单编号</span>
            <span>{{rowdata.show_id}}</span>
          </p>
          <p>
            <span>订单类型</span>
            <span class="value" v-if="rowdata.has_studio == 1&&rowdata.has_equipment == 0">影棚订单</span>
            <span class="value" v-if="rowdata.has_equipment == 1&&rowdata.has_studio == 0">设备订单</span>
            <span class="value" v-if="rowdata.has_studio == 1&&rowdata.has_equipment == 1">影棚设备订单</span>
          </p>
          <p class="orderTime">
            <span>下单时间</span>
            <span>{{rowdata.create_time | time2Date}}</span>
          </p>
          <p>
            <span>开始时间</span>
            <span>{{rowdata.start_time}}</span>
          </p>
          <p>
            <span>结束时间</span>
            <span>{{rowdata.end_time}}</span>
          </p>
        </div>
      </div>
      <div class="printOrderDetail">
        <p class="title">订单明细</p>
        <div class="orderListTop">
          <span>名称</span>
          <span>数量</span>
          <span>器材SN码</span>
          <span>时间</span>
          <span>总价</span>
        </div>
        <div class="listInfo" v-if="form.studio_price">
          <span>{{form.studio_name}}</span>
          <span>1</span>
          <span>无</span>
          <span class="value" v-if="form.rent_type==2">{{form.studio_start_time}}天</span>
          <span class="value" v-if="form.rent_type==1">{{form.studio_start_time}}小时</span>
          <span v-if="!hidePrintPrice">{{form.studio_price}}</span>
          <span v-else>已隐藏</span>
        </div>
        <div class="listInfo" v-if="form.device" v-for="(item,index) in form.device" :key="index">
          <span>{{item.equip.static.name}}</span>
          <span>{{item.order_count}}</span>
          <span v-if="item.equip.sn_array.length>0">
            <span
              v-for="(item2,index2) in item.equip.sn_array"
              :key="index2"
            >{{item2.sn?item2.sn:'无'}}</span>
          </span>
          <span v-else>无</span>
          <span class="value" v-if="form.rent_type==2">{{form.studio_start_time}}天</span>
          <span class="value" v-if="form.rent_type==1">{{form.studio_start_time}}小时</span>
          <span v-if="!hidePrintPrice">{{item.price}}</span>
          <span v-else>已隐藏</span>
        </div>
        <div class="orderListTop">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>总价：{{hidePrintPrice?'已隐藏':form.price}}</span>
        </div>
      </div>
      <div class="userInfo">
        <p class="title">客户信息</p>
        <div class="infoDetail">
          <p>
            <span>客户姓名</span>
            <span>Tommy</span>
          </p>
          <p>
            <span>联系方式</span>
            <span>13522222222</span>
          </p>
        </div>
      </div>
      <div class="remark">
        <p class="title">备注</p>
        <div class="remarkInfo">
          <p v-if="form.remark">{{form.remark}}</p>
          <p v-else>无</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPic } from "@util/picUtil.js";
import addEmployee from "ServeComponents/addEmployee";
import { employee, order } from "@/config/api";
import { format } from "date-fns";
import { deepcopy } from "@/common/function/util";
import { mapGetters } from "vuex";
import ipcApi from "../../../renderer/utils/ipcRenderer";
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    webviewUr:
      process.env.NODE_ENV === "development"
        ? `http://localhost:9080/static/printOrder.html`
        : `file://${__static}/printOrder.html`,
    employee_url: employee.getAll,
    group_url: employee.getGroup,
    isEdit: true,
    rowdata: "", //订单信息
    form: {
      id: "",
      start_time: "",
      price: "",
      end_time: "",
      employee: [],
      remark: "",
      device: [],
      sn_temp_data: ""
    },
    order_type_options: [
      {
        value: "0",
        label: "线上订单"
      },
      {
        value: "1",
        label: "线下订单"
      }
    ],
    studio_type_options: [
      {
        value: "1",
        label: "按小时计算"
      },
      {
        value: "2",
        label: "按天计算"
      }
    ],

    dialogImageUrl: "",
    dialogVisible: false,
    picPostData: {},
    is_list: false,
    employee: [],
    time_is_edit: true,
    sn_code: {},
    send_sn_code: [],
    hidePrintPrice: false //是否隐藏价格打印
  }),

  components: {
    addEmployee
  },

  filters: {
  },
  created() {
    let params = {};
    if (this.$route.query.id) {
      params = {
        order_id: this.$route.query.id
      };
      this.isEdit = true;
    } else {
      this.isEdit = Boolean(this.$store.state.order.order_page_data.Noedit);
      params = {
        order_id: this.$store.state.order.order_page_data.orderid
      };
    }
    this.getdata(params);
  },
  computed: {
    ...mapGetters(["user_data"])
  },
  methods: {
    getdata(params) {
      params.is_server = 1;
      this.getRequest(order.newServeOrderGet, params).then(res => {
        console.log("serve_get_orderlist--------", res);
        //					this.rowdata = res.rows[0];
        this.rowdata = res;
        this.clearData();
      });
    },
    // 获取sn随机数据
    sn_data() {
      return new Promise((resolve, reject) => {
        this.$confirm(
          "您尚未为设备分配sn码,接单后系统会自动分配是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            console.log(this.form.device);
            let tempdata = this.get_sn_data(this.form.device);
            console.log(tempdata);
            resolve(tempdata);
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    async accept() {
      try {
        let data = {};
        if (this.rowdata.has_equipment == 1) {
          console.log(this.send_sn_code.length === 0);
          if (this.send_sn_code.length === 0) {
            this.send_sn_code = await this.sn_data();
          }
          if (!this.send_sn_code) return false;
          data = {
            id: this.rowdata.id,
            equip_sn_map_array: this.send_sn_code
          };
        } else {
          data = {
            id: this.rowdata.id
          };
        }
        console.log(data);
        this.$confirm("您确定接单吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.postRequest(order.serve_accept_order, data)
            .then(res => {
              if (res == data.id) {
                this.$message({
                  type: "success",
                  message: "接单成功"
                });
                this.rowdata.pay_status = 3;
              }
            })
            .catch(err => {});
        });
      } catch (error) {}
    },
    refuse(id) {
      let data = {
        id: id,
        remark: ""
      };
      this.$prompt("（您若拒单则钱款会打回客户）请输入拒单原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        data.remark = value;
        this.postRequest(order.serve_refuse_order, data)
          .then(res => {
            if (res == id) {
              this.$message({
                type: "success",
                message: "拒单成功"
              });
            }
          })
          .catch(err => {});
      });
    },
    goBack() {
      this.$store.dispatch("OrderOutPage").then(() => {
        this.$router.go(-1);
      });
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let picKey = checkPic(file, 1, 2);
            if (!picKey) return;
            let token = await this.getRequest(
              "/qiniu/userGetQiniuUpToken?key=" + picKey
            );
            this.picPostData = token;
            console.log("token-----", token);
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };
        Sync();
      });
    },
    handleSuccess(response, file) {
      let imageUrl = this.config.qiniuHost + response.key;
    },
    employee_list(e) {
      console.log(e);
      this.form.employee = e;
    },
    clearData() {
      console.log("this.rowdata-------------------", this.rowdata);
      this.form.create_time = format(
        this.rowdata.create_time * 1000,
        "YYYY-MM-DD"
      );
      this.form.id = this.rowdata.id;
      this.form.start_time = this.rowdata.start_time;
      this.form.price = this.rowdata.price;
      this.form.is_manual = this.rowdata.is_manual;
      this.form.end_time = this.rowdata.end_time;
      this.form.rent_type = this.rowdata.rent_type;
      if (this.form.rent_type == 2) {
        this.form.studio_start_time = this.util.datedif(
          this.rowdata.start_time,
          this.rowdata.end_time
        );
      } else {
        this.form.studio_start_time = this.util.calHours(
          this.rowdata.start_time,
          this.rowdata.end_time
        );
      }

      switch (this.rowdata.is_manual) {
        case "0":
          this.form.user_name = this.rowdata.user.nick;
          this.form.user_mobile = this.rowdata.user.mobile;
          this.form.user_avatar = this.rowdata.user.avatar;

          this.form.remark = this.rowdata.remark;
          this.rowdata.employee.forEach(item => {
            this.form.employee.push(item.name);
          });
          if (this.rowdata.has_studio == 1) {
            this.form.studio_price = this.rowdata.studio_order.price;
            this.form.studio_name = this.rowdata.studio_order.studio_detail.name;
            this.form.studio_pic = this.rowdata.studio_order.studio_detail.pic;
            this.form.device = this.rowdata.studio_order.equip_order_array;
          } else if (this.rowdata.has_equipment == 1) {
            this.form.device = this.rowdata.equip_order;
          }
          if (this.rowdata.pay_status > 1) {
            this.isEdit = true;
          }
          break;
        case "1":
          this.rowdata.employee.forEach(item => {
            this.form.employee.push(item.name);
          });
          this.form.user_name = this.rowdata.customer.name;
          this.form.user_mobile = this.rowdata.customer.mobile;
          this.form.user_avatar = this.rowdata.customer.avatar;
          if (this.rowdata.has_studio == 1) {
            this.form.studio_price = this.rowdata.studio_order.price;
            this.form.studio_name = this.rowdata.studio_order.studio_detail.name;
            this.form.studio_pic = this.rowdata.studio_order.studio_detail.pic;
            this.form.device = this.rowdata.studio_order.equip_order_array;
          } else if (this.rowdata.has_equipment == 1) {
            this.form.device = this.rowdata.equip_order;
          }

          break;

        default:
          break;
      }
      console.log("this.rowdata-------after------------", this.rowdata);
    },

    set_sn_code(data) {
      console.log(data, 222222222222);
      let arr = [];
      let sn_arr = [];
      let sn_arr_temp = [];
      // 遍历选择器中选择的sn_code
      for (let key in this.sn_code) {
        if (key.includes(data.equip_id)) {
          sn_arr.push(this.sn_code[key]);
          // 将对应的设备id和sn_code对应一起
          // 通过设备数量决定对arr数组添加
          if (data.order_count == 1) {
            this.send_sn_code.push({
              equip_id: data.equip_id,
              sn_array: [sn_arr[0]]
            });
          } else {
            arr.push({
              equip_id: data.equip_id,
              ...sn_arr
            });
          }
        }
      }

      //当设备有多个时,对其进行清洗操作,(此处应该有更优的写法;待优化)
      if (data.order_count > 1 && arr.length == data.order_count) {
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i].equip_id == arr[i + 1].equip_id) {
            sn_arr_temp.push(arr[i][0]);
            sn_arr_temp.push(arr[i + 1][0]);
          }
        }
        // 将数据放进最终需要发送的数组中
        this.send_sn_code.push({
          equip_id: data.equip_id,
          sn_array: [...sn_arr_temp]
        });
      }
    },
    confirm() {
      let data = {};
      console.log("this.form--------------", this.form);
      data = {
        id: this.form.id,
        employee_array: this.form.employee,
        remark: this.form.remark,
        price: this.form.price
      };
      console.log("发送信息", data);
      this.postRequest(order.serve_edit_order, data)
        .then(res => {
          if (res.id == this.form.id) {
            let params = {
              order_id: res.id
            };
            this.getdata(params);
            this.$message.success("修改成功");
            this.isEdit = !this.isEdit;
          }
        })
        .catch(err => {});
      console.log(data);
    },
    edit() {
      if (this.rowdata.pay_status > 1 && this.rowdata.is_manual == 0) {
        this.$alert("该订单因已付款而被锁定,无法修改", "警告", {
          confirmButtonText: "确定",
          type: "error"
        });
      } else {
        this.isEdit = false;
        if (this.rowdata.is_manual == 1) {
          this.time_is_edit = false;
        }
      }
    },
    cancel() {
      if (this.rowdata.is_manual == 0) {
        this.isEdit = !this.isEdit;
      } else {
        this.isEdit = !this.isEdit;
        this.time_is_edit = !this.time_is_edit;
      }
    },
    // 传入需要随机出来的数据
    RandomArray(arr, count) {
      let list = [];
      for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * arr.length);
        // 由于只要id所以这里就只取了id
        list.push(arr[index].id);
        // 去除之前添加的,防止出现重复数据
        arr.splice(index, 1);
      }
      return list;
    },
    // 清洗数据
    get_sn_data(data) {
      // 预存设备数组
      let device_temp = [];
      // 预存已经处理过的数组
      let send_data = [];
      // 预存当sn码不足的设备名
      let defect_device_name = [];
      // 此处将得到设备数组赋值
      device_temp = deepcopy(data);
      // 对设备数组进行整理
      device_temp.forEach(item => {
        // 此处是判断,可能会出现设备和sn码数量不匹配的问题
        if (item.equip.sn_array > item.order_count) {
          // 如果没有任何问题就将设备id和随机的sn码放到这个数组中
          send_data.push({
            equip_id: item.equip_id,
            sn_array: this.RandomArray(item.equip.sn_array, item.order_count)
          });
        } else {
          this.$alert(
            "检测到您剩余可分配设备sn码不足,无法自动分配sn码,请去设备管理处检查后方可快速接单!",
            "出现错误",
            {
              confirmButtonText: "确定",
              type: "error"
            }
          );
          // 如果后期需要为用户展示,什么设备sn码不足的时候,这里,就是了
          defect_device_name.push({
            name: item.static.name
          });
          console.log(defect_device_name);
        }
      });
      // 当是影棚无设备是,就返回空数组
      return send_data;
    },
    // printOrder(type) {
    // 	if(type==1){
    // 		this.hidePrintPrice=true;
    // 	}else{
    // 		this.hidePrintPrice=false;
    // 	}
    // 	this.$nextTick(()=>{
    // 		this.$print(this.$refs.printOrder);
    // 	})

    // },
    printDeal(type) {
      //传0不隐藏价格，传1隐藏价格
      // this.$message({ type: "warning", message: "建设中" });
      if (this.form.rent_type == 2) {
        this.form.studio_start_time =
          this.util.datedif(this.rowdata.start_time, this.rowdata.end_time) +
          "天";
      } else {
        this.form.studio_start_time =
          this.util.calHours(this.rowdata.start_time, this.rowdata.end_time) +
          "小时";
      }
      let data = {
        url: this.webviewUr,
        sendData: {
          form: this.form,
          rowdata: this.rowdata,
          showprice: Boolean(+type) ? false : true,
          storeName: this.user_data.nick
        }
      };
      console.log(this.form);
      console.log(this.user_data.nick);
      ipcRenderer.send("open-win", data);
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import "@/styles/color.scss";
@media print {
  .printForm {
    display: block !important;
  }
}

.card {
  background: #fff;
  padding: 20px 0px;
  margin-bottom: 20px;
  .headTitle {
    font-size: 20px;
    padding-left: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  .emp-cont {
    margin-top: 20px;
    margin-left: 40px;
  }
  .product {
    display: flex;
    align-items: center;
    padding: 20px;
    .el-image {
      padding: 10px;
      border: 1px solid #f0f0f0;
    }
  }
  .userInfo {
    display: flex;
    align-items: baseline;
    padding: 20px 20px 0px 40px;
    .el-image {
      margin-right: 20px;
      border: 1px solid #f0f0f0;
    }
    .userList {
      margin-right: 80px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .remark {
    display: flex;
    align-items: center;
    padding: 20px 40px 0px 40px;
    /deep/ .el-textarea__inner {
      min-height: 200px !important;
      border-radius: 0px;
    }
    span {
      width: 80px;
    }
  }
  ul {
    li {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0px;
      }
      .name {
        color: #999999;
      }
      .value {
        color: #333;
        font-weight: 600;
      }
    }
  }
  .baseList {
    padding: 20px 0px 20px 40px;
  }
  .productList {
    display: flex;
    align-items: flex-start;
    padding: 20px 0px 0px 20px;
    ul {
      margin-left: 20px;
    }
  }
}

.printForm {
  font-size: 9px;
  padding: 20px;
  background: #fff;
  display: none;
  .printTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .title {
    padding: 10px 20px;
    font-size: 11px;
    background-color: #ddd !important;
    margin: 30px 0px 20px 0px;
  }
  .orderTime {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  .orderListTop {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  .orderListTop,
  .listInfo {
    display: flex;
    span {
      display: inline-block;
      width: 100px;
    }
    span:first-child {
      width: 400px;
    }
  }
  .listInfo {
    margin-bottom: 20px;
  }
  .infoList,
  .infoDetail,
  .remarkInfo,
  .orderListTop,
  .listInfo {
    padding-left: 20px;
    p {
      margin-bottom: 8px;
      span {
        margin-right: 40px;
      }
    }
  }
}

.baseInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
  border-bottom: 1px solid #f0f0f0;
  .headTitle {
    border-bottom: none;
  }
}

.bottomBtn{
	display:flex;
}

</style>