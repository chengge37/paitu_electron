<template>
  <div id="day">
    <div id="calendar" v-if="pickDay != null">
      <div class="topDay">
        <div class="left">
          年份：
          <el-select v-model="yearValue" placeholder="请选择" @change="timeChange">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>&nbsp;&nbsp;&nbsp;&nbsp;月份：
          <el-select v-model="monthValue" placeholder="请选择" @change="timeChange">
            <el-option
              v-for="item in monthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="right">{{weather}}&nbsp;&nbsp;|&nbsp;&nbsp;今天&nbsp;&nbsp;|&nbsp;&nbsp;{{today}}</div>
        <div id="position" style="display:none"></div>
      </div>
      <div class="line"></div>
      <ul class="weekdays">
        <li>周一</li>
        <li>周二</li>
        <li>周三</li>
        <li>周四</li>
        <li>周五</li>
        <li>周六</li>
        <li>周日</li>
      </ul>
      <ul class="days" ref="main">
        <li
          v-for="(day,index) in days"
          :class="{
            'active':index==activeIndex&&index!=menuIndex,
            'today':day.day.getFullYear() == new Date().getFullYear() && day.day.getMonth() == new Date().getMonth() && day.day.getDate() == new Date().getDate(),
            'afterRight':index==menuIndex,
            'other-month':day.day.getMonth()+1 != currentMonth
            }"
          :key="day.day+index"
          @click="pick($event,day.day,index,day.day.getMonth()+1 != currentMonth)"
          @click.right="right($event,index,day.day.getMonth()+1 != currentMonth)"
        >
          <!--节假日显示-->
          <span class="holiday" v-if="day.holiday">{{day.holiday}}</span>

          <!--本月-->
          <span
            v-if="day.day.getMonth()+1 != currentMonth"
            class="other-month number1"
          >{{ day.day.getDate() }}</span>
          <span v-else-if="menuIndex!=index" class="beforeRight number1">
            {{ day.day.getDate() }}
            <span
              v-if="day['work']"
              :class="{empty:day['work'][0].orderCount+day['work'][1].jobCount<=0}"
            >
              <span class="opt" v-if="day['work'][0].orderCount+day['work'][1].jobCount>0">
                <div>
                  <span class="type">
                    <i class="el-icon-s-order"></i>&nbsp;&nbsp;&nbsp;订单
                  </span>
                  <span class="number">{{day['work'][0].orderCount}}</span>
                </div>
                <div>
                  <span class="type">
                    <i class="el-icon-menu"></i>&nbsp;&nbsp;&nbsp;待办
                  </span>
                  <span class="number">{{day['work'][1].jobCount}}</span>
                </div>
              </span>
            </span>
          </span>
          <span v-else>
            <div>
              <el-button @click.stop="addTodo(1,day.day)" v-permission>
                <i class="el-icon-s-order"></i>添加订单
              </el-button>
            </div>
            <div>
              <el-button @click.stop="addTodo(2,day.day)" v-permission>
                <i class="el-icon-menu"></i>添加待办
              </el-button>
            </div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
import { format } from "date-fns";
export default {
  props: ["timeToCalendar", "addTypeToCalendar"],
  data() {
    return {
      today: "",
      map: "",
      weather: "",
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      pickDay: null,
      activeIndex: null,
      menuIndex: null,
      yearOptions: [],
      yearValue: "",
      monthOptions: [
        {
          value: 1,
          label: "1"
        },
        {
          value: 2,
          label: "2"
        },
        {
          value: 3,
          label: "3"
        },
        {
          value: 4,
          label: "4"
        },
        {
          value: 5,
          label: "5"
        },
        {
          value: 6,
          label: "6"
        },
        {
          value: 7,
          label: "7"
        },
        {
          value: 8,
          label: "8"
        },
        {
          value: 9,
          label: "9"
        },
        {
          value: 10,
          label: "10"
        },
        {
          value: 11,
          label: "11"
        },
        {
          value: 12,
          label: "12"
        }
      ],
      monthValue: 1,
      holidayList: []
    };
  },
  mounted() {
    this.$refs.main.oncontextmenu = () => {
      return false;
    };
    document.getElementsByClassName("content")[0].onselectstart = function() {
      return false;
    };
    document
      .getElementsByClassName("content")[0]
      .addEventListener("click", this.handleMenu);
    console.log(this.currentWeek, "第几天");
    console.log(this.days, "看一下");
    this.$emit("dateChange", new Date());
    lazyAMapApiLoaderInstance.load().then(() => {
      this.init();
      this.timer = setInterval(() => {
        this.init();
      }, 300000);
    });
  },
  created() {
    this.holidayList = [
      { day: "0101", holiday: "元旦" },
      { day: "0125", holiday: "除夕" },
      { day: "0125", holiday: "春节" },
      { day: "0404", holiday: "清明节" },
      { day: "0501", holiday: "劳动节" },
      { day: "0625", holiday: "端午节	" },
      { day: "1001", holiday: "中秋节" },
      { day: "1001", holiday: "国庆节" }
    ];

    this.getYearOptions();
    this.initCalendar(null);
    console.log(this.days, "时间数组");
    //得到订单和待办的列表并与days数据整合
    this.getCountAndInit();
    this.getToday();
    let date = new Date();
    // console.log(date.getMonth()+1,"gfiufigufusduifuiu");
    this.monthValue = date.getMonth() + 1;
  },
  watch: {
    timeToCalendar(newl) {
      console.log('应该更新了');
      this.initCalendar(this.formatDate(this.yearValue, this.monthValue, 1));
      this.getCountAndInit();
    }
  },
  methods: {
    //今天日期
    getToday() {
      this.today = format(new Date(), "YYYY-MM-DD");
    },
    //天气
    init() {
      this.map = new AMap.Map("position", {
        resizeEnable: true
      });
      AMap.service("AMap.Geocoder", () => {
        let geocoder = new AMap.Geocoder();
        geocoder.getAddress(this.map.getCenter(), (status, result) => {
          if (status === "complete" && result.info === "OK") {
            this.getweather(result.regeocode.addressComponent.district);
          } else {
            console.log("哦吼，定位失败");
          }
        });
      });
    },
    getweather(live) {
      AMap.plugin("AMap.Weather", () => {
        const weater = new AMap.Weather();
        weater.getLive(live, (err, data) => {
          if (!err) {
            this.weather = data.weather;
          }
        });
      });
    },
    //先把key的字符改为数字类型，并补全
    formatKey(obj) {
      let temp = {};
      Object.keys(obj).forEach(item => {
        temp[+item] = obj[item];
      });
      return temp;
    },
    //用户下拉选择年月时
    timeChange() {
      //先清除选择
      this.activeIndex = -1;
      this.menuIndex = -1;
      this.initCalendar(this.formatDate(this.yearValue, this.monthValue, 1));
      this.getCountAndInit();
    },
    getCountAndInit() {
      Promise.all([
        this.getRequest("job/serveGetCountByMonth", {
          month:
            this.currentYear +
            "-" +
            this.currentMonth.toString().padStart(2, "0")
        }),
        this.getRequest("order/serveGetCountByMonth", {
          month:
            this.currentYear +
            "-" +
            this.currentMonth.toString().padStart(2, "0")
        })
      ]).then(data => {
        console.log(data, "Promise.all");
        this.jobCount = data[0].order_count_data;
        this.orderCount = data[1].order_count_data;
        this.initDays(this.days);
        console.log(this.days, "看一下11");
      });
    },
    handleObj(obj) {
      let temp = {};
      for (let i = 0; i < 43; i++) {
        temp[i] = 0;
      }
      obj = this.formatKey(obj);
      temp = { ...temp, ...obj };
      return temp;
    },
    //初始化数组
    initDays(days) {
      //为日期添加一个节假日字段holiday
      let flagDay = "";
      this.holidayList.forEach((item, index) => {
        days.forEach((item2, index2) => {
          flagDay =
            this.util.toDouble(item2.day.getMonth() + 1) +
            "" +
            this.util.toDouble(item2.day.getDate());
          if (item.day == flagDay) {
            item2.holiday = item.holiday;
          }
        });
      });
      console.log("initDays-----------", days);
      this.orderCount = this.handleObj(this.orderCount);
      console.log(this.orderCount, 982756);
      this.jobCount = this.handleObj(this.jobCount);
      for (let i = 0; i < days.length; i++) {
        if (i - this.currentWeek + 2 < 0) {
          this.$set(days[i], "work", [{ orderCount: 0 }, { jobCount: 0 }]);
        } else {
          this.$set(days[i], "work", [
            { orderCount: this.orderCount[i - this.currentWeek + 2] },
            { jobCount: this.jobCount[i - this.currentWeek + 2] }
          ]);
        }
      }
    },
    handleMenu() {
      this.menuIndex = -1;
    },
    addTodo(type, date) {
      console.log(11111);
      // date.replace(/-/g,"/");
      this.$emit("liststart", true, type, date);
    },
    right(e, index, flag) {
      if (!flag) {
        this.menuIndex = index;
      }
    },
    initCalendar(cur) {
      if (cur) {
        var date = new Date(cur);
      } else {
        var date = new Date();
        this.pickDay = date.getDate();
      }
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      var str = this.formatDate(this.currentYear, this.currentMonth, 1);
      this.currentWeek =
        new Date(str).getDay() == 0 ? 7 : new Date(str).getDay();

      this.days.length = 0; //初始化数组
      for (var i = this.currentWeek - 1; i >= 0; i--) {
        var d = new Date(str);
        d.setDate(d.getDate() - i);

        this.days.push({
          day: d
        });
      }
      for (var i = 1; i <= 42 - this.currentWeek; i++) {
        var d = new Date(str);
        d.setDate(d.getDate() + i);
        this.days.push({
          day: d
        });
      }
    },
    //选中日期
    pick(e, date, index, flag) {
      this.menuIndex = -1;
      //这里有很大问题
      if (!flag) {
        if (this.activeIndex == index) {
          return;
        }
        this.activeIndex = index;
        // console.log(e.currentTarget);
        console.log("pick----", date);
        this.pickDay = date.getDate();
        console.log("日历中的date", date);
        this.$emit("dateChange", date);
      }
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate(year, month, day) {
      var y = year;
      var m = month;
      var d = day;
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    getYearOptions() {
      let year = new Date().getFullYear();
      for (let i = year - 4; i <= year + 4; i++) {
        this.yearOptions.push({
          label: i,
          value: i
        });
      }
      this.yearValue = year;
    }
  }
};
</script>
<style lang="scss" scoped>
.topDay {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
li {
  list-style: none;
  text-align: center;
  margin: 0.6%;
}
.day_nav li {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
}
.day_nav {
  position: relative;
}
.day_nav li:nth-child(2) {
  padding-left: 10px;
}
.day_nav li:nth-child(3) {
  div {
    position: absolute;
    right: 0;
    height: 25px;
    width: 25px;
    background-color: #7c6aff;
    border-radius: 5px;
    padding-top: 4px;
  }
}
.day_nav li:nth-child(4) {
  position: absolute;
  right: -5%;
  width: 30%;
  cursor: default;
  padding-top: 5%;
}
.day_nav li:nth-child(1) {
  div {
    height: 25px;
    width: 25px;
    background-color: #7c6aff;
    border-radius: 5px;
    padding-top: 4px;
  }
}
li.today {
  position: relative;
}
li.today {
  .number1 {
    position: relative;
    &::after {
      display: block;
      width: 50px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      content: "(今天)";
      position: absolute;
      left: 55%;
      top: 0%;
    }
  }
}
li.afterRight:after {
  content: "";
}
#calendar {
  width: 100%;
  height: 100%;
}
span.other-month {
  border: none;
}
//星期那里的样式
.weekdays {
  display: flex;
  width: 100%;
  height: 4%;
  li {
    height: 40px;
    background-color: #fff;
    width: 13%;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(235, 235, 235, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }
}
//订单待办样式
.opt {
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding-top: 8%;
  div {
    &:nth-child(1) {
      border-bottom: 1px solid rgba(250, 250, 250, 1);
    }
    margin-bottom: 2px;
    height: 31px;
    display: flex;
    justify-content: space-between;
    line-height: 31px;
    background: rgba(255, 255, 255, 1);
    width: 85%;
    // border-radius: 3px;
    .type {
      width: 60%;
      text-align: left;
    }
    .number {
      width: 20%;
    }
  }
}
.days {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  li {
    position: relative;
    font-size: 20px;
    color: #777;
    border-color: #777;
    width: 13%;
    height: 130px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(235, 235, 235, 1);
    // padding-top: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    // align-items: center;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 16px 0px rgba(2, 3, 35, 0.08);
      position: relative;
      color: black;
    }
    &.active {
      color: black;
      box-shadow: 0px 0px 16px 0px rgba(2, 3, 35, 0.08);
      position: relative;
    }
    &.other-month {
      color: rgba(22, 5, 66, 0.3);
      // border-color: rgba(22, 5, 66, 0.3)
      border: 1px solid rgba(22, 5, 66, 0.1);
      cursor: Default;
      &:hover {
        color: rgba(22, 5, 66, 0.3);
        box-shadow: none;
      }
    }
  }
}
//每日里面span的样式
span.beforeRight {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
span.beforeRight span {
  width: 100%;
  height: 64px;
  border-radius: 4px;
}
span.empty {
  display: none;
}
//右键后的样式
li.afterRight {
  border: none;
  background: rgba(255, 255, 255, 1);
  /deep/ .el-button {
    // width: 80%;
    height: 40px;
    line-height: 1;
    border-radius: 20px;
    // padding-bottom: 5px;
    margin-top: 5px;
  }
  // span {
  //   display: flex;
  //   flex-wrap: wrap;
  //   justify-content: space-around;
  //   div {
  //     width: 80%;
  //     height: 34px;
  //     background: rgba(255, 255, 255, 1);
  //     box-shadow: 0px 0px 16px 0px rgba(2, 3, 35, 0.04);
  //     border-radius: 20px;
  //     font-size: 14px;

  //     font-family: PingFangSC-Regular, PingFang SC;
  //     font-weight: 400;
  //     color: rgba(22, 5, 66, 1);
  //     cursor: pointer;
  //     padding-top: 6px;
  //     &:nth-child(1) {
  //       margin-bottom: 10px;
  //     }
  //   }
  // }
}
.topDay {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .left {
    color: rgba(78, 71, 92, 1);
    padding-left: 10px;
  }
  .right {
    color: rgba(51, 51, 51, 1);
    padding-right: 15px;
    cursor: default;
  }
}
.line {
  height: 1px;
  background: rgba(240, 240, 240, 1);
  margin: 0;
  margin-bottom: 10px;
}
.topDay .left /deep/ .el-select {
  width: 80px;
  &:nth-child(2) {
    width: 60px;
  }
  .el-input__inner {
    height: 30px;
    padding: 0 5px;
    padding-left: 12px;
  }
  .el-input__suffix {
    .el-input__icon {
      height: 30px;
      line-height: 30px;
    }
  }
}
.holiday {
  width: 50px;
  height: 24px;
  font-size: 12px;
  position: absolute;
  left: 0%;
  top: 7%;
  color: #e02d2d;
}
</style>