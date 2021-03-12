<!--  -->
<template>
  <div class="newServe">
    <div class="addOrder-container">
      <div class="top-nav">
        <div class="top-title">人员列表</div>
        <div class="top-right">
          <!-- <div @click="back" class="back">
            <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
            <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
            <span>返回</span>
          </div>-->
          <div class="top-btn">
            <el-button type="primary" icon="el-icon-plus" @click="openCustomerList">从客户列表添加</el-button>
            <!-- <el-button class="add-btn" icon="el-icon-plus" @click="addactive">添加人员</el-button> -->
          </div>
        </div>
      </div>

      <el-table :data="userList" v-loading="Loading" element-loading-text="获取数据中..." fit>
        <el-table-column label="人员名称">
          <template slot-scope="{row}">
            <span v-if="row.user.nick">{{row.user.nick}}</span>
            <span v-else>暂无名称</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="{row}">
            <span v-if="row.user.mobile">{{row.user.mobile}}</span>
            <span v-else>暂无电话</span>
          </template>
        </el-table-column>
        <el-table-column label="报名电话">
          <template slot-scope="{row}">{{row.contact_mobile}}</template>
        </el-table-column>
        <el-table-column label="报名人数">
          <template slot-scope="{row}">{{row.person_nums}}</template>
        </el-table-column>
        <el-table-column label="报名金额">
          <template slot-scope="{row}">{{row.price}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="{row}">
            <el-button type="text" @click="deleuser(row)" v-if="row.user.is_user == 0">删除</el-button>
            <el-tag type="warning" v-else>线上用户无法编辑</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        background
        @current-change="changePage" 
        :current-page="user_params.page" 
        :page-size="user_params.page_size"
        layout="prev, pager, next"
        :total="user_total"
        style="text-align: right;"
      ></el-pagination>-->
    </div>
    <pagination
      :total="user_total"
      :page="user_params.page"
      :pagesize="user_params.page_size"
      @getPageNum="userChangePage"
      class="pagination"
    ></pagination>
    <!-- <div class="bottom-button button-set">
      <div @click="back" class="back">
        <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
        <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
        <span>返回</span>
      </div>
    </div>-->
    <el-dialog title="客户列表（勾选）" :visible.sync="showCustomerList" width="70%">
      <el-table
        :data="customerList"
        :row-key="getRowKey"
        :header-cell-style="{background:'#F5F8FE',color:'#606266'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="客户分组">
          <template v-slot:header>
            <el-dropdown trigger="click" @command="handleCommand" class="cursor">
              <span class="el-dropdown-link">
                {{ audit }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="g_item.group_id"
                  v-for="(g_item,g_idx) in group"
                  :key="g_idx"
                >{{g_item.group_name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.group_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称"></el-table-column>
        <el-table-column prop="served_times" label="服务次数"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <el-table-column prop="email" label="电子邮件"></el-table-column>
        <el-table-column prop="company" label="公司名称"></el-table-column>
        <!-- <el-table-column type="selection" :reserve-selection="true" width="150"></el-table-column> -->
      </el-table>

      <el-pagination
        backgroundc
        @current-change="changePage"
        :current-page="cus_params.page"
        :page-size="cus_params.page_size"
        layout="prev, pager, next"
        :total="cus_total"
        style="text-align: right;"
      ></el-pagination>
      <el-button class="comfirm-btn" @click="confirm" v-if="select_cus.length>0">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { customer_group, customer, activity } from "@/config/api";
import pagination from "ServeComponents/FrontComponents/pagination";
export default {
  data: () => ({
    isEdit: false,
    temp_value: "",
    audit: "客户分组",
    Loading: true,
    user_data: [],
    group: [],
    upload_data: {
      activity_id: ""
    },
    userList: [],
    user_total: 0,
    user_params: {
      page: 1,
      page_size: 10
    },
    cus_params: {
      page: 1,
      page_size: 10,
      group_id: ""
    },
    customerList: [],
    select_cus: [],
    cus_total: 0,
    showCustomerList: false,
    IsOnline: false
  }),

  components: {
    pagination
  },
  created() {
    this.upload_data.activity_id = this.$route.query.activity_id;
    if (this.$route.query.IsOnline == 1) {
      this.IsOnline = false;
    } else {
      this.IsOnline = true;
    }
  },
  mounted() {
    this.getCustomerList();
    this.getCustomerGroups();
    this.initActiveOrder();
  },

  computed: {
    listen_list() {
      return this.value.list.length;
    }
  },

  methods: {
    openCustomerList() {
      if (this.IsOnline) {
        this.showCustomerList = true;
      } else {
        this.$notify.error({
          title: "发生错误",
          message: "您当前得活动处于未上架状态无法修改人员！"
        });
      }
    },
    // 指定一个key标识这一行的数据,分页记住勾选
    getRowKey(row) {
      return row.id;
    },

    handleCommand(e) {
      this.cus_params.group_id = e;
      this.getCustomerList();
      console.log("handleCommand----", e);
    },
    handleSelectionChange(val) {
      this.select_cus = val;
    },
    back() {
      this.$router.go(-1);
    },
    initActiveOrder() {
      let params = Object.assign(this.user_params, {
        activity_id: this.upload_data.activity_id
      });
      this.getRequest(activity.server_get_order, params)
        .then(res => {
          this.Loading = false;
          this.userList = res.rows;
          this.user_total = res.total_count;
        })
        .catch(err => {
          this.Loading = false;
        });
    },
    changePage(val) {
      this.cus_params.page = val;
      this.getCustomerList();
    },
    userChangePage(val) {
      this.user_params.page = val;
      this.initActiveOrder();
    },
    getCustomerList() {
      this.getRequest(customer.getAll, this.cus_params)
        .then(res => {
          this.cus_total = res.total_count;
          this.customerList = res.rows;
        })
        .catch(err => {});
    },
    getCustomerGroups() {
      this.getRequest(customer_group.getAll)
        .then(res => {
          this.group = res;
          this.group.unshift({ group_id: "", group_name: "全部" });
        })
        .catch(err => {});
    },
    deleuser(row) {
      let data = {
        activity_id: row.activity_id,
        customer_id: row.cid
      };
      this.postRequest(activity.serve_del_activity_user, data)
        .then(res => {
          this.user_params.page = 1;
          this.initActiveOrder();
        })
        .catch(err => {});
    },
    confirm() {
      this.select_cus.forEach(item => {
        this.upload_data.customer_array.push({
          name: item.name,
          mobile: item.mobile,
          group_id: item.group_id
        });
      });
      console.log("this.upload_data", this.upload_data);
      this.postRequest(activity.serve_add_user, this.upload_data)
        .then(res => {
          if (res) {
            this.$alert("活动人员添加成功！", "提示", {
              type: "success",
              callback: action => {
                this.$router.go(-1);
              }
            });
          } else {
            this.$notify.error({
              title: "发生错误",
              message: "请您检查是否有数据没有填充，若确认无误请联系管理员！"
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "发生错误",
            message: "请您检查是否有数据没有填充，若确认无误请联系管理员！"
          });
        });
    }
  },
  watch: {}
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.addOrder-container{
  padding: 10px;
  margin-bottom: 30px;
  background-color: #ffffff;
}
.top-nav {
  justify-content: space-between;
  align-items: center;
  .top-title {
    padding-bottom: 20px;
    padding-top: 10px;
    font-size: 20px;
    // font-weight: bold;
    color: rgba(51, 51, 51, 1);
    // border-bottom: 4px solid $Theme-color;
  }
  .top-right {
    display: flex;
    align-items: center;
  }
}
.line {
  margin-bottom: 15px;
  margin-top: 10px;
}
.form-box {
  .short-input /deep/ .el-input {
    width: 220px;
  }
  .text-button {
    font-size: 12px;
  }
  // 去除数字输入框调整
  .input-num /deep/ .el-input {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
  .table {
    width: calc(100% + 300px);
    input {
      background: none;
      outline: none;
      border: 0px;
      height: 40px;
      width: 80%;
    }
    .dele {
      width: 100%;
      height: 100%;
    }
  }
  .table /deep/ .el-table th {
    padding: 0;
  }
  .table /deep/ .el-table__body {
    height: 50px;
  }
}
.button-set {
  margin-top: 14px;
  .back {
    cursor: pointer;
    .back-one {
      margin-right: -26px;
    }
    .back-two {
      margin-right: 2px;
    }
  }
}
.comfirm-btn {
  background-color: #54ad17;
  color: #ffffff;
  padding: 10px 50px;
  border-radius: 0;
}
</style>