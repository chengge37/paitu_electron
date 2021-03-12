<template>
  <div>
    <div class="wraper">
      <div class="topAdd">
        <div>
          <el-button type="primary" class="color-area" v-permission @click="openAdd">
            <i class="el-icon-plus"></i>添加线下订单
          </el-button>
        </div>
        <div>
          <el-button type="text" @click="toOrder">
            订单管理
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
      <div class="content new-scroll" v-if="orderList.length>0">
        <div class="order-item" v-for="item in orderList" :key="item.show_id" @click="toDetail(item.id)">
          <span>订单编号{{item.show_id}}</span>
          <div class="orderDetail">
            <div class="created-time">
              <div>下单时间</div>
              <div class="time">{{formatTime(item.create_time)}}</div>
            </div>
            <div class="money">
              <div>订单金额</div>
              <div class="time">￥{{item.price}}</div>
            </div>
            <div class="start-time">
              <div>开始时间</div>
              <div class="time">{{formatTime(item.start_time)}}</div>
            </div>
            <div class="end-time">
              <div>结束时间</div>
              <div class="time">{{formatTime(item.end_time)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { day } from "@/config/api";
import { format } from "date-fns";
export default {
  created() {
    console.log(format(1572923219*1000,"YYYY.MM.DD-HH:mm"),"duhfuyhduh");
  },
  props: ["time_whole"],
  data() {
    return {
      params: {
        // page_size:8,
        start_time: "",
        end_time: ""
      },
      orderList: []
    };
  },
  methods: {
    toOrder(){
      this.$router.push({
        path:'/serve/order/order'
      })
    },
    toDetail(id){
      this.$router.push({
        path:'/serve/order/details',
        query:{id}
      })
    },
    formatTime(time){
      if(time.length==10){
        return format(time*1000,"YYYY.MM.DD-HH:mm")
      }
      return format(time,"YYYY.MM.DD-HH:mm")
      // time.replace(/-/g,".")
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
      this.$emit("openAdd", 1);
    },
    getOrderList(newVal) {
      this.params.start_time = this.dateFormat(newVal, 0);
      this.params.end_time = this.dateFormat(newVal, 24);
      this.getRequest(day.serve_get_calendar, this.params)
        .then(res => {
          if (res) {
            this.orderList = res;
            console.log(this.orderList, "这里是order组件");
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
      this.getOrderList(newVal);
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
  height: 690px;
    overflow-y: scroll;
    // padding-right: 15px;
  .order-item {
    cursor: pointer;
    margin-top: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    // height: 70px;
    // padding: 0 10px;
    span {
      font-size: 10px;
    }
    .orderDetail {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(240, 240, 240, 1);
      height: 70px;
      .created-time {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(240, 240, 240, 1);
      }
      .money {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(240, 240, 240, 1);
      }
      .start-time {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(240, 240, 240, 1);
      }
      .end-time {
        flex: 1;
        text-align: center;
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
.empty{
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
  }
/deep/ .el-button--primary{
  background-color: $Theme-color;
}
</style>