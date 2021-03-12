<template>
  <div class="newServe">
    <div class="mainInfo">
      <div class="top">
        <el-radio-group v-model="time_type" @change="changeOpt">
          <el-radio-button
            :label="item.label"
            v-for="(item,index) in optList"
            :key="index"
          >{{item.name}}</el-radio-button>
        </el-radio-group>
        <div class="date-search">
          <span>按日期筛选：</span>
          <el-date-picker
            v-model="dateSearch"
            @change="changeDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div class="top-search">
          <search-box @change="search" placeholder="输入订单号搜索"></search-box>
          <el-button class="color-area" type="primary" @click="openadd = true" v-permission>
            <i class="el-icon-plus"></i>添加线下订单
          </el-button>
        </div>
      </div>

      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading">
        <el-table-column align="center" label="订单编号">
          <template slot-scope="scope">
            <div>内部id：{{scope.row.id}}</div>
            <div style="font-size: 12px;">对外id：{{scope.row.show_id}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单日期" sortable prop="start_time">
          <template slot-scope="{row}">
            <div>
              <i class="el-icon-time"></i>
              <span>使用时间</span>
              <div>{{row.start_time|timeFilter}} - {{row.end_time|timeFilter}}</div>
            </div>
            <div>
              <i class="el-icon-time"></i>
              <span>下单时间：{{row.create_time*1000|timeFilter}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额(￥)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.order_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="线上/线下" width="130" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.online|orderType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.order_type.studio == 1&&scope.row.order_type.equipment == 0">影棚订单</span>
            <span
              v-if="scope.row.order_type.studio == 1&&scope.row.order_type.equipment == 1"
            >影棚设备订单</span>
            <span v-if="scope.row.order_type.studio == 0&&scope.row.order_type.equipment == 1">设备订单</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template v-slot:header>
            <el-dropdown @command="handleCommand" trigger="click" class="cursor">
              <span class="el-dropdown-link">
                {{opt}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in statusOption"
                  :key="item.label"
                  :command="item.value"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- <template slot="header">
						<el-select class="head-other-col" @change="changeStatus(selectStatus)" v-model="selectStatus" placeholder="订单状态">
							<el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </template>-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_pay == 0" type="warning">已删除</el-tag>
            <el-tag
              v-else
              :type="scope.row.is_pay|pay_statusFilter"
            >{{scope.row.is_pay|payStatusFilter}}</el-tag>
            <el-tag
              type="warning"
              v-if="scope.row.refundStatus && scope.row.refundStatus!=1"
            >{{scope.row.refundStatus|refundStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="用户名称" width="150" align="center">
          <template slot-scope="scope">
            <span class="overflow">{{scope.row.order_customer}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" label="联系方式">
          <template slot-scope="scope">
            <span>{{scope.row.order_phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" label="核验单状态">
          <template slot-scope="scope">
            <span
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="scope.row.check && scope.row.online==0 && scope.row.check.status==0"
            >待确认</span>
            <span
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="scope.row.check && scope.row.online==0 && scope.row.check.status==1"
            >已确认</span>
            <span
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="scope.row.check && scope.row.online==0 && scope.row.check.status==2"
            >已拒绝</span>
            <span
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="(!scope.row.check && scope.row.is_pay == 3) && scope.row.online==0"
            >未添加</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <!-- 判断是否线上线下 -->
            <span v-if="scope.row.online == 0">
              <!-- 当is_pay为2时只显示接和拒接单 -->
              <span v-if="scope.row.is_pay == 2">
                <el-button
                  type="text"
                  @click="accept(scope.row.id,scope.row.rowsdata)"
                  v-permission
                >接单</el-button>
                <el-button
                  type="text"
                  @click="refuse(scope.row.id)"
                  style="margin-right: 10px;"
                  v-permission
                >拒接</el-button>
              </span>
              <!-- 当is_pay为1时，此时为未付款状态，此时给商家快捷修改价格 -->
              <span v-if="scope.row.is_pay == 1" style="margin-right: 10px;">
                <el-button type="text" @click="editmoney(scope.row.id)" v-permission>修改价格</el-button>
              </span>

              <!--<el-popover placement="bottom" width="140" trigger="hover">-->
              <div v-if="scope.row.is_pay == 2 || scope.row.is_pay == 1">
                <el-button type="text" @click="details(scope.row.rowsdata)">详情</el-button>
                <el-button
                  type="text"
                  @click="edit(scope.row.rowsdata)"
                  v-if="scope.row.is_pay == 1"
                  v-permission
                >修改</el-button>
              </div>
              <!--当接单拒接或修改价格存在时，显示更多-->
              <!--<el-button type="text" slot="reference" v-if="scope.row.is_pay == 2 || scope.row.is_pay == 1">更多</el-button>-->
              <!--</el-popover>-->

              <!-- 相反当订单状态不符合待支付或已付款则显示这些 -->
              <span v-if="scope.row.is_pay != 2 && scope.row.is_pay != 1">
                <el-button type="text" @click="details(scope.row.rowsdata)">详情</el-button>
                <el-button
                  type="text"
                  @click="edit(scope.row.rowsdata)"
                  v-if="scope.row.is_pay == 1"
                  v-permission
                >修改</el-button>
              </span>
            </span>
            <!-- 当订单状态为线下单时 -->
            <span v-else>
              <!--<el-popover placement="bottom" width="160" trigger="hover">-->
              <div>
                <el-button type="text" @click="details(scope.row.rowsdata)">详情</el-button>
                <el-button type="text" @click="edit(scope.row.rowsdata)" v-permission>修改</el-button>
                <el-button type="text" @click="dele(scope.row.id,scope.$index)" v-permission>删除</el-button>
              </div>
              <!-- 当接单拒接或修改价格存在时，显示更多 -->
              <!--<el-button type="text" slot="reference">更多</el-button>-->
              <!--</el-popover>-->
              <el-button type="text" @click="SuccOrder(scope.row.id)" v-permission>接单</el-button>
              <el-button type="text" @click="FailOrder(scope.row.id)" v-permission>拒单</el-button>
            </span>
            <el-button
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="scope.row.check && scope.row.online==0 && scope.row.check.status!=1 && scope.row.is_pay!=7 && scope.row.is_pay!=8"
              v-permission
            >修改核验单</el-button>
            <el-button
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="scope.row.check && scope.row.online==0 && scope.row.check.status==1"
            >查看核验单</el-button>
            <el-button
              type="text"
              @click="addSheet(scope.row.id)"
              v-if="!scope.row.check && scope.row.online==0 && scope.row.is_pay!=7 && scope.row.is_pay!=8"
              v-permission
            >上传核验单</el-button>

            <!-- 当is_pay为4时，此时为退款中，需要商家审核 -->
            <span v-if="scope.row.is_pay == 4" style="margin-right: 10px;">
              <el-button
                type="text"
                @click="toRefund(scope.row)"
                v-permission
              >审核退款</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页模块-->
    <pagination
      :total="parseInt(ordernum)"
      :page="parseInt(listParams.page)"
      :pagesize="parseInt(listParams.pageSize)"
      @getPageNum="handleCurrentChange"
      class="pagination"
    ></pagination>

    <add-order :only_order="true" :showadd="openadd" @closed="closed" @GetOrder="GetOrder"></add-order>

    <!--操作退款窗口模块-->
    <refund
      :openRefund="openRefund"
      :orderId="refundId"
      :orderType="refundType"
      @closed="closeRefund"
    ></refund>
  </div>
</template>

<script>
import searchBox from "../../components/searchBox/index";
import pagination from "../../components/FrontComponents/pagination";
import { order } from "../../config/api";
import { format } from "date-fns";
import addOrder from "../day/components/dialog/add";
import { fuzzyQuery } from "../../utils/fuzzy_search";
import { deepcopy } from "@/common/function/util";
import refund from "../../components/refund/index";
export default {
  components: {
    addOrder,
    refund,
    searchBox,
    pagination
  },
  data() {
    return {
      time_type: "0",
      optList: [
        {
          label: "0",
          name: "不限"
        },
        {
          label: "1",
          name: "昨日"
        },
        {
          label: "2",
          name: "今日"
        },
        {
          label: "4",
          name: "本周"
        },
        {
          label: "6",
          name: "本月"
        }
      ],
      openRefund: false, //是否显示退款窗口 ，默认false
      sele_order: 1,
      dateSearch: "",
      searchText: "",
      list: [],
      listLoading: true,
      //			templistbackup: [],
      openadd: false,
      ordernum: 0,
      statusOption: [
        {
          value: 0,
          label: "全部订单"
        },
        {
          value: 1,
          label: "未支付"
        },
        {
          value: 2,
          label: "已支付"
        },
        {
          value: 3,
          label: "商家确认"
        },
        {
          value: 4,
          label: "退款中"
        },
        {
          value: 5,
          label: "退款完毕"
        },
        {
          value: 6,
          label: "订单进行中"
        },
        {
          value: 7,
          label: "等待评论"
        },
        {
          value: 8,
          label: "评论结束"
        }
      ],
      opt: "全部订单",
      selectStatus: "",
      refundId: "", //需要退款的订单id
      refundType: "", //需要退款的订单类型
      listParams: {
        page: 1,
        pageSize: 10
      }
    };
  },
  filters: {
    timeFilter(time) {
      return format(time, "YYYY-MM-DD");
    },
    orderType(type) {
      const statusMap = {
        0: "线上订单",
        1: "线下订单"
      };
      return statusMap[type];
    },
    pay_statusFilter(status) {
      if (status == 1 || status == 4 || status == 5) {
        return "danger";
      } else if (status == 2 || status == 3 || status == 6) {
        return "warning";
      } else if (status == 7 || status == 8) {
        return "success";
      }
    },
    pay_statusdisplay(status) {
      const statusMap = {
        0: "已取消",
        1: "未支付",
        2: "已支付",
        3: "商家接单",
        4: "退款中",
        5: "退款完毕",
        6: "订单进行中",
        7: "待评论",
        8: "已评论"
      };
      return statusMap[status];
    },
    refundStatus(status) {
      const refundStatusList = {
        1: "审核中",
        11: "拒绝退款",
        12: "运营审核 ",
        14: "运营处理完毕",
        21: "打款中",
        22: "退款成功 "
      };
      return refundStatusList[status];
    }
  },
  created() {},
  mounted() {
    this.GetOrder();
  },
  methods: {
    handleCommand(command) {
      // console.log("changeStatus-----", val);
      let params = null;
      if (command != 0) {
        params = {
          pay_status: command
        };
      }
      this.opt = this.statusOption[command].label;
      this.GetOrder(params);
    },
    //时间选择方法
    changeDate() {
      console.log("changeDate-------", this.dateSearch);
      this.GetOrder();
    },

    //切换日期选项方法
    changeOpt(val) {
      this.time_type = val;
      console.log("time_type----", val);
      this.GetOrder();
    },

    //关闭退款窗口回调方法
    closeRefund(val) {
      console.log("closeRefund--------", val);
      this.openRefund = false;
      if (val) {
        this.GetOrder();
      }
    },

    //显示退款弹框方法
    toRefund(item) {
      console.log("toRefund-------", item);
      this.refundId = item.id;
      if (item.rowsdata.has_studio) {
        this.refundType = "1";
      } else {
        this.refundType = "2";
      }
      this.openRefund = true;
    },

    //跳转到核算单页面
    addSheet(orderId) {
      console.log("addSheet-------", orderId);
      this.$router.push({
        path: "/serve/order/accountList",
        query: {
          id: orderId
        }
      });
    },
    //切换状态方法
    changeStatus(val) {
      console.log("changeStatus-----", val);
      let params = null;
      if (val != 0) {
        params = {
          pay_status: val
        };
      }
      this.GetOrder(params);
    },
    SuccOrder(data) {
      this.util
        .confirm(this, "确定完成订单?")
        .then(res => {
          if (res) {
            this.getRequest(order.serve_update_orderstate, {
              order_id: data,
              status: 8
            }).then(res => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "修改状态成功"
                });
                this.GetOrder();
              }
            });
          }
        })
        .catch(error => {});
    },
    FailOrder(data) {
      this.util
        .confirm(this, "确定拒单吗?")
        .then(res => {
          if (res) {
            this.getRequest(order.serve_update_orderstate, {
              order_id: data,
              status: 5
            }).then(res => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "修改状态成功"
                });
                this.GetOrder();
              }
            });
          }
        })
        .catch(error => {});
    },
    editmoney(id) {
      this.$prompt("请输入价格", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let data = {
          id: id,
          price: value
        };
        this.postRequest(order.serve_update_price, data).then(res => {
          if (res == value) {
            this.$message({
              type: "success",
              message: "订单价格修改成功"
            });
            this.GetOrder();
          }
        });
      });
    },
    closed() {
      this.openadd = false;
      this.GetOrder();
    },
    details(data) {
      console.log(data);
      let Qdata = {
        Noedit: true,
        orderid: data.id
      };
      let path = "/serve/order/details";
      this.openPage(path, Qdata);
    },
    edit(data) {
      let Qdata = {
        Noedit: false,
        orderid: data.id
      };
      let path = "/serve/order/details";
      this.openPage(path, Qdata);
    },
    dele(id, deleId) {
      let data = {
        id: id
      };
      this.$confirm("您确定删除该订单吗？删除后将无法找回！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.postRequest(order.serve_dele_order, data)
          .then(res => {
            if (res == id) {
              this.$message({
                type: "success",
                message: "订单删除成功"
              });
              this.GetOrder();
            }
          })
          .catch(err => {});
      });
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
      // 判断是否为设备订单
      if (data.has_equipment == 1 && data.has_studio == 0) {
        device_temp = data.equip_order;
        // 判断是否为影棚(带设备)订单
      } else if (data.has_equipment == 1 && data.has_studio == 1) {
        device_temp = data.studio_order.equip_order_array;
      }
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
    accept(id, data) {
      console.log("id--------data--------", data);
      let clear_data = deepcopy(data);
      let send_serve_data = {
        id: id
      };
      if (data.has_equipment == 1) {
        send_serve_data.equip_sn_map_array = this.get_sn_data(clear_data);
      }
      if (data.has_equipment == 1) {
        this.$confirm(
          "您确定使用快速接单吗?这将会导致您的设备sn码被随机分配.",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          this.postRequest(order.serve_accept_order, send_serve_data).then(
            res => {
              if (res == id) {
                this.$message.success("接单成功");
                this.GetOrder();
              }
            }
          );
        });
      } else {
        this.util
          .confirm(this, "确定要接单吗？")
          .then(res => {
            if (res) {
              this.postRequest(order.serve_accept_order, send_serve_data).then(
                res => {
                  if (res == id) {
                    this.$message.success("接单成功");
                    this.GetOrder();
                  }
                }
              );
            }
          })
          .catch(() => {});
      }
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
    openPage(path, Qdata) {
      this.$store.dispatch("OrderOpenNext", Qdata).then(() => {
        this.$router.push({
          path: path
        });
      });
    },
    handleCurrentChange(e) {
      let params = {};
      switch (this.sele_order) {
        case 1:
          params = {
            page: e
          };
          break;
        case 2:
          params = {
            page: e,
            is_manual: 0
          };
          break;
        case 3:
          params = {
            page: e,
            is_manual: 1
          };
          break;

        default:
          console.log(typeof this.sele_order);
          break;
      }

      this.GetOrder(params);
    },
    //获取订单列表方法
    GetOrder(params) {
      this.listLoading = true;
      if (params) {
        params.is_server = 2;
      } else {
        params = {
          is_server: 2
        };
      }
      if (this.time_type != 0) {
        params.time_type = this.time_type;
      }
      params.search = this.searchText;
      if (this.dateSearch) {
        params.time_type = 9;
        params.st_time = this.dateSearch[0];
        params.et_time = this.dateSearch[1];
      }
      console.log("GetOrder--------------", params);
      this.util
        .newServeOrderGet(params)
        .then(res => {
          console.log("GetOrder---------", res);
          let templist = [];
          templist = res.rows;
          this.ordernum = res.total_count;
          this.list = [];
          try {
            templist.forEach(item => {
              let obj = {
                create_time: item.create_time,
                start_time: item.start_time,
                end_time: item.end_time,
                order_money: item.price,
                id: item.id,
                show_id: item.show_id,
                online: item.is_manual,
                order_type: {
                  studio: item.has_studio,
                  equipment: item.has_equipment
                },
                check: item.check,
                is_pay: item.pay_status,
                rowsdata: item
              };
              //如果订单为退款中，需要获取退款状态
              if (item.pay_status == 4) {
                let orderType;
                if (item.has_studio == 1) {
                  orderType = 1;
                } else {
                  orderType = 2;
                }
                this.getRefundDetail(item.id, orderType).then(res => {
                  console.log(
                    res,
                    "------------------------------------------------"
                  );
                  obj.refundStatus = res;
                });
              }
              if (item.customer != undefined) {
                obj.order_customer = item.customer.name;
                obj.order_phone = item.customer.mobile;
              } else {
                obj.order_customer = item.user.nick;
                obj.order_phone = item.user.mobile;
              }
              this.list.push(obj);
            });
            this.listLoading = false;
          } catch (error) {
            this.listLoading = false;
            console.error("数据处理出现错误");
            console.error(error);
          }
          //					this.templistbackup = this.list;
        })
        .catch(err => {
          this.listLoading = false;
          console.log("拉取数组输错");
          console.log(err);
        });
    },

    //查询订单退款状态
    getRefundDetail(orderId, orderType) {
      let params = {
        order_id: orderId,
        order_type: orderType,
        is_all: 1
      };
      return new Promise((resolve, reject) => {
        this.util.ajaxUserRefundOrderDetail(params).then(res => {
          console.log("ajaxUserRefundOrderDetail--------------", res);
          resolve(res.status);
        });
      });
    },

    search(val) {
      console.log("search--------", this.searchText);
      this.searchText = val;
      //			let templist = this.templistbackup;
      //			if(this.searchText == "") {
      //				this.list = templist;
      //			} else {
      //				this.list = fuzzyQuery(templist, this.searchText);
      //			}
      this.GetOrder();
    }
  },
  watch: {
    sele_order(value) {
      let params = {};
      switch (value) {
        case 1:
          params = {};
          break;
        case 2:
          params = {
            is_manual: 0
          };
          break;
        case 3:
          params = {
            is_manual: 1
          };
          break;

        default:
          break;
      }
      this.GetOrder(params);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// @import "@/styles/color.scss";
.top {
  padding: 20px;
  display: flex;
  align-items: center;
  .date-search {
    margin-left: 30px;
  }
  .top-search {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .search-box {
      margin-right: 25px;
      display: flex;
      .seach {
        display: flex;
        height: 38px;
        align-items: center;
        border: 1px solid #dcdfe6;
        border-radius: 2px 0 0 2px;
        background-color: #fff;
        .icon {
          width: 14px;
          height: 14px;
          margin: 12px 5px 12px 5px;
        }
        .seach-input {
          border: none;
          outline: medium;
          background-color: #ffffff;
          height: 30px;
          font-size: 14px;
        }
      }
      /deep/ .search-button {
        height: 40px;
      }
      .search-button:active {
        background-color: $Button-active;
      }
    }
  }
}

.tip {
  .tip-header {
    text-align: center;
    line-height: 20px;
    font-weight: bold;
  }
  .tip-content {
    padding: 0 20px;
    text-align: center;
  }
}

.overflow {
  overflow: hidden;
  /*超出部分隐藏*/
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
  white-space: nowrap;
  /*规定段落中的文本不进行换行 */
  width: 150px;
}

/deep/ {
  .el-table {
    .el-input .el-input__inner {
      align-self: center;
      padding: 0;
      border: none;
      background: none;
      text-align: center;
      color: #333;
      font-weight: 600;
      &::-webkit-input-placeholder {
        color: #333;
      }
      &::-moz-input-placeholder {
        color: #333;
      }
      &::-ms-input-placeholder {
        color: #333;
      }
    }
    .el-input__suffix {
      right: 25px;
    }
  }
}
</style>