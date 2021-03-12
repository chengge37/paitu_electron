<!--  -->
<template>
  <div class="newServe">
    <div class="act-container">
      <div class="top-nav">
        <div class="top-time">
          <span class="title">按活动日期筛选：</span>
          <el-date-picker
            v-model="dateArea"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateAreaChange"
          ></el-date-picker>
        </div>
        <div class="top-active">
          <el-button type="primary" icon="el-icon-plus" @click="addactive" v-permission>添加活动</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="putaway" v-permission>批量上架</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="soldout" v-permission>批量下架</el-button>
        </div>
        <div class="top-seach" v-if="false">
          <div class="all-active">
            筛选
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="seach-box">
            <div class="seach">
              <div class="icon">
                <ali-svg-icon icon-class="seach"></ali-svg-icon>
              </div>
              <input type="text" placeholder="输入您想查询的内容" class="seach-input" v-model="seach_text" />
            </div>
            <div class="seach-button">搜索</div>
          </div>
        </div>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="获取数据中..."
        fit
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
      >
        <el-table-column type="selection" :reserve-selection="true" width="60"></el-table-column>
        <el-table-column align="center" width="80" label="序号" type="index"></el-table-column>
        <el-table-column label="类型" width="150" align="center">
          <template slot="header">
            <el-select
              class="head-other-col"
              @change="changeType"
              v-model="selectType"
              placeholder="类型"
            >
              <el-option
                v-for="(item,index) in activityType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.type|type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" align="center">
          <template slot-scope="scope">
            <span class="address-oh">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动地点" width="250" align="center">
          <template slot-scope="scope">
            <span class="address-oh">{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            {{scope.row.start_time}}
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"  label="参加活动人员详情">
          <template slot-scope="{row}">
            <el-button type="text" @click="peoplede(row.id)">点击查看详情</el-button>
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="审核状态" width="110">
          <template v-slot:header>
          <el-dropdown @command="changeValidType" trigger="click" class="cursor">
            <span class="el-dropdown-link">
              {{opt}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in validType" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
          <!-- <template slot="header">
						<el-select class="head-other-col" @change="changeValidType" v-model="selectValidType" placeholder="审核状态">
							<el-option v-for="(item,index) in validType" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </template>-->
          <template slot-scope="{row}">
            <el-tag :type="row.is_valid|statusFilter">{{row.is_valid|statusFilterText}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="费用/人次">
          <template slot-scope="scope">
            <i class="el-icon-ptmqian"></i>
            <span>{{scope.row.fee}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="人数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.current_person}}/{{scope.row.max_person}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <div class="state-box" v-if="scope.row.is_valid == 1">
              <!-- <el-button
                round
                @click="start(scope.row.id)"
                v-if="scope.row.is_start == 0&&Date.parse(new Date(scope.row.start_time)) > Date.parse(new Date(Nowdate))"
              >开始</el-button>-->
              <div
                class="statetext"
                v-if="scope.row.is_start == 0&&Date.parse(new Date(scope.row.start_time)) > Date.parse(new Date(Nowdate))"
              >未开始</div>
              <!-- <div
                class="statetext"
                v-else-if="scope.row.is_start == 2&&Date.parse(new Date(scope.row.end_time)) <= Date.parse(new Date(Nowdate))"
              >已结束</div>-->
              <div
                class="statetext"
                v-else-if="Date.parse(new Date(scope.row.end_time)) <= Date.parse(new Date(Nowdate))"
              >已结束</div>
              <div class="statetext" v-else>进行中</div>
            </div>
            <!-- 当审核并不通过的时候 -->
            <div v-else>被冻结</div>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="全部状态" align="center" width="110">
          <template v-slot:header>
            <el-dropdown @command="changeDeletedStatus" trigger="click" class="cursor">
              <span class="el-dropdown-link">
                {{opt1}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in deletedStatus"
                  :key="item.label"
                  :command="item.value"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- <template slot="header">
						<el-select class="head-other-col" @change="changeDeletedStatus" v-model="selectDeletedStatus" placeholder="上架状态">
							<el-option v-for="(item,index) in deletedStatus" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </template>-->
          <template slot-scope="scope">
            <span v-if="scope.row.is_deleted=='0'">已上架</span>
            <span v-else>已下架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="报名人员">
          <template slot-scope="scope">
            <div class="adduse">
              <el-button
                type="text"
                @click="adduse(scope.row)"
                :disabled="scope.row.is_valid == 0||Date.parse(new Date(scope.row.end_time)) <= Date.parse(new Date(Nowdate))"
              >人员列表</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="details(scope.$index,scope.row)">详情</el-button>
            <!-- 这里是当活动没有审核通过又过了开始日期的时候不关闭修改 -->
            <el-button
              type="text"
              @click="edit(scope.$index,scope.row)"
              v-if="(scope.row.is_start == 0&&Date.parse(new Date(scope.row.start_time)) > Date.parse(new Date(Nowdate)))||scope.row.is_valid == 0"
              v-permission
            >修改</el-button>
            <el-button
              type="text"
              @click="dele(scope.row)"
              v-permission
            >{{scope.row.is_deleted==1?'上架':'下架'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页模块-->
    <pagination
      :total="listnum"
      :page="params.page"
      :pagesize="params.page_size"
      @getPageNum="changePage"
      class="pagination"
    ></pagination>
    <el-dialog title="参加活动人员详情" :visible.sync="showpeople" width="70%">
      <el-table :data="gridData" v-loading="Loading" element-loading-text="获取数据中..." fit>
        <el-table-column label="昵称">
          <template slot-scope="{row}">{{row.user.nick}}</template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="{row}">{{row.user.mobile}}</template>
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
        <el-table-column label="操作" width="170">
          <template slot-scope="{row}">
            <el-button type="text" @click="deleuser(row.id,row)" v-if="row.user.is_user == 0">删除</el-button>
            <el-tag type="warning" v-else>线上用户无法编辑</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="getpeople"
        layout="prev, pager, next"
        :total="people"
        style="text-align: right;"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { activity } from "@/config/api";
import pagination from "ServeComponents/FrontComponents/pagination";
export default {
  data: () => ({
    listLoading: false,
    value: "",
    seach_text: "",
    options: [],
    params: {
      page: 1,
      page_size: 10
    },
    list: [],
    Nowdate: new Date(),
    showpeople: false,
    gridData: [],
    activeId: "",
    Loading: false,
    listnum: 0,
    people: 0,
    dateArea: "",
    timeArea: {},
    ids: [],
    opt: "全部",
    opt1: "全部",
    activityType: [
      { value: "-1", label: "全部" },
      { value: "1", label: "线上" },
      { value: "2", label: "线下" }
    ],
    selectType: "",
    validType: [
      { value: "-1", label: "全部" },
      { value: "0", label: "待审核" },
      { value: "1", label: "已审核" }
    ],
    selectValidType: "",
    deletedStatus: [
      { value: "-1", label: "全部" },
      { value: "0", label: "已上架" },
      { value: "1", label: "已下架" }
    ],

    selectDeletedStatus: ""
  }),

  components: {
    pagination
  },

  mounted() {
    this.init();
  },

  methods: {
    dateAreaChange(e) {
      console.log("dateAreaChange---", e);
      if (e && e.length > 0) {
        let startDate = new Date(e[0]);
        let endDate = new Date(e[1]);
        this.timeArea = {
          st: this.dateFormat(startDate),
          et: this.dateFormat(endDate)
        };
      } else {
        delete this.timeArea.st;
        delete this.timeArea.et;
      }

      this.init();
    },
    dateFormat(d) {
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return resDate;
    },
    // 不够10添加0的函数
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    changeType(val) {
      console.log("val--", val);
      this.init();
      console.log("selectType---", this.selectType);
    },
    changeValidType(command) {
      const index = this.validType.findIndex(item => {
        return item.value === command;
      });
      this.selectValidType = command;
      this.opt = this.validType[index].label;
      this.init();
    },
    changeDeletedStatus(command) {
      const index = this.deletedStatus.findIndex(item => {
        return item.value === command;
      });
      this.selectDeletedStatus = command;
      this.opt1 = this.deletedStatus[index].label;
      this.init();
    },
    peoplede(data) {
      this.showpeople = true;
      this.activeId = data;
      let params = Object.assign(this.params, { id: this.activeId });
      this.Loading = true;
      this.initActiveOrder(params);
    },
    adduse(row) {
      let Qdata = {
        activity_id: row.id,
        IsOnline: row.is_deleted
      };
      this.$router.push({
        path: "/serve/control_center/Active_adduser",
        query: Qdata
      });
    },
    deleuser(id, row) {
      console.log(id);
      console.log(row);
      this.list.forEach(item => {
        if (item.id == row.activity_id) {
          let data = {
            activity_id: item.id,
            customer_id: row.cid
          };
          this.postRequest(activity.serve_del_activity_user, data)
            .then(res => console.log(res))
            .catch(err => {});
        }
      });
    },
    start(id) {
      let data = {
        id: id
      };
      this.postRequest(activity.serve_start_activity, data)
        .then(res => {
          if (res) {
            this.$notify({
              title: "成功",
              message: "活动成功开始",
              type: "success"
            });
          }
        })
        .catch(err => {});
    },
    addactive() {
      let Qdata = {
        state: 2
      };
      let path = "/serve/control_center/Active_details";
      this.openPage(path, Qdata);
    },
    details(id, data) {
      let Qdata = {
        state: 0,
        data: encodeURIComponent(JSON.stringify(data))
      };
      let path = "/serve/control_center/Active_details";
      this.openPage(path, Qdata);
    },
    edit(id, data) {
      let Qdata = {
        state: 1,
        data: encodeURIComponent(JSON.stringify(data))
      };
      let path = "/serve/control_center/Active_details";
      this.openPage(path, Qdata);
    },
    handleCurrentChange(e) {
      // 此处可以获得当前页码
      // console.log(e);
      // let params = {
      //   page: e
      // };
      this.params.page = e;
      this.init();
    },
    getpeople(e) {
      let params = {
        id: this.activeId,
        page: e,
        page_size: 10
      };
      this.Loading = true;
      this.initActiveOrder(params);
    },
    dele(rowdata) {
      let data = {
        ids: rowdata.id,
        is_up: null
      };
      if (rowdata.is_deleted == 0) {
        data.is_up = 1;
        this.postRequest(activity.serve_dele_activity, data).then(res => {
          console.log(res)
          if (res == 1) {
            this.$message({ type: "success", message: "下架成功" });
            this.init();
          }
        });
      } else {
        data.is_up = 0;
        this.postRequest(activity.serve_dele_activity, data).then(res => {
          console.log(res)
          if (res == 1) {
            this.$message({ type: "success", message: "上架成功" });
            this.init();
          }
        });
      }
    },

    async init() {
      let params = {};
      if (this.timeArea && this.timeArea.st) {
        params = Object.assign(this.params, this.timeArea);
      } else {
        delete this.params.st;
        delete this.params.et;
        params = this.params;
      }
      if (this.selectType && this.selectType != "-1") {
        params = Object.assign(this.params, { type: this.selectType });
      } else {
        delete this.params.type;
        params = this.params;
      }
      if (this.selectValidType && this.selectValidType != "-1") {
        params = Object.assign(this.params, { is_valid: this.selectValidType });
      } else {
        delete this.params.is_valid;
        params = this.params;
      }
      if (this.selectDeletedStatus && this.selectDeletedStatus != "-1") {
        params = Object.assign(this.params, {
          is_deleted: this.selectDeletedStatus
        });
      } else {
        delete this.params.is_deleted;
        params = this.params;
      }
      try {
        let rowdata = await this.getRequest(
          activity.serve_activity_list,
          params
        );
        console.log(rowdata);
        this.list = rowdata.rows;
        this.listnum = rowdata.total_count;
        this.listLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    initActiveOrder(params) {
      this.getRequest(activity.server_get_order, params)
        .then(res => {
          this.Loading = false;
          this.gridData = res.rows;
          this.people = res.total_count;
        })
        .catch(err => {
          this.Loading = false;
        });
    },
    openPage(path, Qdata) {
      this.$store.dispatch("ActiveOpenNext", Qdata).then(() => {
        this.$router.push({ path: path });
      });
    },
    changePage(val) {
      this.params.page = val;
      this.init();
    },
    // 指定一个key标识这一行的数据,分页记住勾选
    getRowKey(row) {
      return row.id;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.ids = [];
      val.forEach(item => {
        this.ids.push(item.id);
      });
      console.log("this.ids---", this.ids);
    },
    putaway() {
      if (this.ids.length > 0) {
        this.$confirm("此操作将批量上架所选中的活动, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.shelfActivity(0);
          })
          .catch(() => {});
      } else {
        this.$message({ message: "请先勾选需要上架的活动项目。" });
      }
    },
    soldout() {
      if (this.ids.length > 0) {
        this.$confirm("此操作将批量下架所选中的活动, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.shelfActivity(1);
          })
          .catch(() => {});
      } else {
        this.$message({ message: "请先勾选需要下架的活动项目。" });
      }
    },
    shelfActivity(data) {
      let params = {
        ids: this.ids.join(","),
        is_up: data
      };
      this.postRequest(activity.server_shelf_activity, params)
        .then(res => {
          if (data) {
            this.$message({ type: "success", message: "批量下架成功!" });
          } else {
            this.$message({ type: "success", message: "批量上架成功!" });
          }
          this.init();
        })
        .catch(err => {});
    }
  },
  filters: {
    type(status) {
      const statusMap = {
        "1": "线上",
        "2": "线下"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        "1": "success",
        "0": "info"
      };
      return statusMap[status];
    },
    statusFilterText(status) {
      const statusMap = {
        "1": "通过",
        "0": "待审核"
      };
      return statusMap[status];
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.act-container {
  background-color: #ffffff;
  padding: 10px;
  margin-bottom: 30px;
}
.top-nav {
  display: flex;
  justify-content: space-between;
  .top-seach {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .seach-box {
      margin-left: 25px;
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
      .seach-button {
        width: 54px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: #fff;
        border-radius: 0px 2px 2px 0px;
        cursor: pointer;
      }
      .seach-button:active {
        background-color: #2c637c;
      }
    }
  }
  .top-active {
    .add-btn {
      border: 1px solid #54ad17;
      color: #54ad17;
      background-color: #ffffff;
    }
  }
}

// .table-control /deep/ .el-button.is-round {
//   padding: 8px 22px;
//   color: #ffffff;
// }
</style>
