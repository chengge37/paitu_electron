<template>
  <div>
    <div class="wraper">
      <div class="topAdd">
        <div>
          <el-button type="primary" class="color-area" v-permission @click="openAdd">
            <i class="el-icon-plus"></i>新增收入
          </el-button>
        </div>
        <div>
          <el-button type="text" @click="toFinance">
            财务管理
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
      <div class="content new-scroll" v-if="financeList.length>0">
        <div
          class="finance-item"
          v-for="item in financeList"
          :key="item.id"
          @click="toDetail(item.id)"
        >
          <div class="financeDetail">
            <div class="created-time">
              <div>添加日期</div>
              <div class="time">{{formatTime(item.date)}}</div>
            </div>
            <div class="money">
              <div>{{item.is_in==0?'支出类型':'收入类型'}}</div>
              <div class="time">{{map[item.type_id]}}</div>
            </div>
            <div class="start-time">
              <div>金额</div>
              <div class="time">{{item.money}}</div>
            </div>
            <div class="end-time">
              <div>明细</div>
              <div class="time">{{item.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { finance } from "@/config/api";
import { format } from "date-fns";
export default {
  props: ["time_whole"],
  data() {
    return {
      params: {
        // page_size:8,
        start_time: "",
        end_time: ""
      },
      financeList: [],
      //收入类型对照表
      map: {
        "8": "系统影棚",
        "9": "线下设备",
        "10": "系统活动",
        "11": "线下影棚",
        "12": "线下设备",
        "13": "线下活动",
        "1": "房租",
        "2": "水费",
        "3": "电费",
        "4": "工资",
        "5": "提现"
      }
    };
  },
  methods: {
    toFinance() {
      this.$router.push({
        path: "/serve/finance_set/finance_set"
      });
    },
    toDetail(id) {
      this.$router.push({
        path: "/serve/finance_set/Finance_detail",
        query: { id, status: 3 }
      });
    },
    formatTime(time) {
      return format(time, "YYYY.MM.DD-HH:mm");
    },
    dateFormat(time, flag) {
      //用于产生当天0点或者24点
      //0是0点，24是23：59分
      if (flag) {
        return format(time, "YYYY-MM-DD") + " 23:59:59";
      } else {
        return format(time, "YYYY-MM-DD") + " 00:00:00";
      }
    },
    openAdd() {
      this.$emit("openAdd", 3);
    },
    getFinanceList(newVal) {
      this.params.start_time = this.dateFormat(newVal, 0);
      this.params.end_time = this.dateFormat(newVal, 24);
      this.getRequest(finance.getAll, this.params)
        .then(res => {
          if (res) {
            this.financeList = res.rows;
            console.log(this.financeList, "这里是finance组件");
          }
        })
        .catch(err => {
          console.log("请求待办列表失败", err);
        });
    }
  },
  watch: {
    time_whole(newVal) {
      // console.log(newVal, "这里是todo组件");
      this.getFinanceList(newVal);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
.topAdd {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
}
.content {
  height: 700px;
  overflow-y: scroll;
  // padding-right: 15px;
  .finance-item {
    cursor: pointer;
    margin-top: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    // height: 70px;
    padding: 0 15px;
    .financeDetail {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(240, 240, 240, 1);
      height: 70px;
      .created-time {
        flex: 1;
        text-align: left;
        border-right: 1px solid rgba(240, 240, 240, 1);
        padding-left: 14px;
      }
      .money {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(240, 240, 240, 1);
      }
      .start-time {
        flex: 1;
        text-align: left;
        border-right: 1px solid rgba(240, 240, 240, 1);
        padding-left: 14px;
      }
      .end-time {
        flex: 1;
        max-width: 25%;
        text-align: left;
        padding-left: 14px;
        div {
          &:nth-child(2) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .time {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        padding-top: 5px;
      }
    }
  }
}
.empty {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
}
/deep/ .el-button--primary {
  background-color: $Theme-color;
}
</style>