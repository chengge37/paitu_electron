<!--  -->
<template>
  <div class="content">
    <div class="calender-box">
      <div class="todo">
        <div class="todo-content">
          <el-tabs v-model="activeName" :stretch="true">
            <el-tab-pane label="待办事项" name="first">
              <addTodo :time_whole="time_whole" @openAdd="openAdd"></addTodo>
            </el-tab-pane>
            <el-tab-pane label="订单列表" name="second">
              <addOrder :time_whole="time_whole" @openAdd="openAdd"></addOrder>
            </el-tab-pane>
            <el-tab-pane label="记账" name="third">
              <addFinance :time_whole="time_whole" @openAdd="openAdd"></addFinance>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="calender">
        <myCalendar
          @dateChange="dateChange"
          @liststart="liststart"
          :timeToCalendar="timeToCalendar"
          :addTypeToCalendar="addTypeToCalendar"
        ></myCalendar>
      </div>
    </div>
    <Add
      :showadd="openadd"
      @closed="closed"
      :addType="addType"
      :addTime="addTime"
    ></Add>
  </div>
</template>

<script>
import myCalendar from "./components/calendar";
import { differenceInDays, format, startOfWeek, endOfWeek } from "date-fns";
import Add from "./components/dialog/add";
import { day, order, finance } from "@/config/api";
import addTodo from "./components/addTodo";
import addFinance from "./components/addFinance";
import addOrder from "./components/addOrder";
import MainIpc from "@/utils/ipcRenderer";
export default {
  data: () => ({
    //接收添加类型并传递给add组件
    addType: null,
    //接收添加时的时间并传递给add组件
    addTime: null,
    value: new Date(),
    // 第一次进入tab再第几个
    activeName: "first",
    // 列表时间
    todo_time: false,
    todo_time_year: 0,
    todo_time_month: 0,
    todo_time_now_day: 0,
    openadd: false,
    time_whole: new Date(), //列表起始时间
    params: {
      start_time: "",
      end_time: ""
    },
    timeToCalendar: "",
    addTypeToCalendar: "",
    i:0,
  }),
  components: { Add, myCalendar, addTodo, addFinance, addOrder },
  methods: {
    // 打开添加组件，接受一个type标识添加的类型，这样可以三个组件共用这个方法
    openAdd(type){
      this.addType = type;
      this.openadd = true;
      this.addTime = this.handleTime(this.time_whole);
    },
    difDay(day1, day2) {
      return (
        differenceInDays(
          format(day2, "YYYY-MM-DD"),
          format(day1, "YYYY-MM-DD")
        ) + 1
      );
    },
    dateChange(date) {
      //点击日期时通知待办项列表同步
      console.log(date);
      this.time_whole = date;
      this.todo_time = true;
      this.todo_time_month = parseInt(format(date, "MM"));
      this.todo_time_year = parseInt(format(date, "YYYY"));
      this.todo_time_now_day = parseInt(format(date, "DD"));
      console.log(
        "日期对比",
        date,
        this.todo_time_year,
        this.todo_time_month,
        this.todo_time_now_day
      );
    },
    handleTime(date) {
      date = format(date, "YYYY-MM-DD");
      date += " 00:00:01";
      return date;
    },
    liststart(flag, type, date) {
      this.addType = type;
      this.addTime = this.handleTime(date);
      this.openadd = flag;
      console.log(this.addTime, 4655555555555555555555555555555);
      console.log(this.addType, 4655555555555555555555555555555);
    },
    dateFormat(time, flag) {
      //用于产生当天0点或者24点
      if (flag) {
        return format(time, "YYYY/MM/DD") + " 23:59:59";
      } else {
        return format(time, "YYYY/MM/DD") + " 00:00:01";
      }
    },
    closed(addType) {
      //
      this.addType = -1;
      this.openadd = false;
      this.addTypeToCalendar = addType;
      this.timeToCalendar = this.params.start_time+this.i++;
      console.log("时间格式",this.timeToCalendar);
      // this.get_list_time(this.params.start_time);
      //通知列表刷新  +1s
      this.time_whole=new Date(this.time_whole.getTime()+1)
    },
  },
  destroyed(){
    MainIpc.remove("main-msg");
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/color.scss";
.content {
  .calender-box {
    display: flex;
    .todo {
      flex: 3;
      border-radius: 2px;
      background-color: #fff;
      margin-right: 10px;
      /deep/ .el-tabs el-tabs--top {
        background-color: #fff;
      }
      .todo-content /deep/ .el-tabs__header {
        background-color: #fff;
        margin-bottom: 0px;
      }
      .todo-content /deep/ .el-tabs__active-bar {
        height: 3px;
        background-color: $Theme-color;
      }
      .todo-content /deep/ .el-tabs__item.is-active {
        color: $Theme-color;
      }
      .todo-content /deep/ .el-tabs__item {
        height: 54px;
        line-height: 54px;
        padding: 0;
      }
      .todo-content /deep/ .el-tabs__item:hover {
        color: $Theme-color;
      }
      .todo-content /deep/ .el-tabs__active-bar {
        width: 33% !important
      }
    }
    .calender {
      flex: 5;
      padding: 0px 20px;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 2px;
    }
  }
}
@media screen and (max-width: 1450px) {
  .content{
    .calender-box{
      .calender{
      flex:7;
    }
    }
  }
    
}
</style>

