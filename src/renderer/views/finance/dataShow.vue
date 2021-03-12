<!--  -->
<template>
  <div class="dataShow">
    <!--数据展示页面-->
    <!--<div id="main" style="width: 600px;height:400px;"></div>-->
    <div class="pie">
      <div class="cost">
        <div class="title">
          <span class="number">{{curMonth}}</span>
          <span>月支出</span>
        </div>
        <pie-echart class="costEcharts" :data="costData" :month="curMonth" v-if="costData.value"></pie-echart>
      </div>
      <div class="income">
        <div class="title">
          <span class="number">{{curMonth}}</span>
          <span>月收入</span>
        </div>
        <pie-echart
          class="incomeEcharts"
          :data="incomeData"
          :month="curMonth"
          v-if="incomeData.value"
        ></pie-echart>
      </div>
    </div>
    <div class="lineChart">
      <div class="nav">
        <div class="yearData">
          <el-tabs v-model="lineIndex" type="card">
            <el-tab-pane label="年度支出" name="0"></el-tab-pane>
            <el-tab-pane label="年度收入" name="1"></el-tab-pane>
          </el-tabs>
          <el-select v-model="selectYear" placeholder="请选择" size="mini">
            <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="rightData">{{title}}:￥{{total|formatMoney}}</div>
      </div>
      <line-echart class="yearChart" :data="yearData" v-if="showLineChart"></line-echart>
    </div>
  </div>
</template>

<script>
import pieEchart from "ServeComponents/Echarts/PieChart.vue";
import lineEchart from "ServeComponents/Echarts/LineChart.vue";
import { finance } from "@config/api.js";
export default {
  data: () => ({
    option: {},
    costData: {},
    incomeData: {},
    yearData: {},
    lineIndex: "0",
    lineTitle: ["年度支出", "年度收入"],
    title: "",
    total: 0,
    showLineChart: true,
    yearList: [],
    monthData: [],
    curMonth: 1,
    selectYear: ""
  }),

  components: {
    pieEchart,
    lineEchart
  },

  watch: {
    lineIndex(to, from) {
      this.getDataByYear(this.selectYear);
    },
    selectYear(to, from) {
      this.getDataByYear(this.selectYear);
    }
  },

  created() {
    this.selectYear = this.util.getCurYear();
    this.getDataByYear(this.selectYear);
  },

  mounted() {
    this.getAllValidYears();
    this.curMonth = this.util.getCurMonth();
    //获取当前月份数据
    console.log("getCurMonth----", this.util.getCurMonth());
    this.getDataByMonth(
      this.util.getCurYear() +
        "-" +
        this.util.toDouble(this.util.getCurMonth())
    );
  },

  methods: {
    //获取有数据的年份
    getAllValidYears() {
      this.getRequest(finance.getAllValidYears)
        .then(res => {
          //将有数据的年份添加到列表中
          for (var i = parseInt(res.min); i <= parseInt(res.max); i++) {
            this.yearList.push(i);
          }
        })
        .catch(err => {});
    },
    //根据年份获取数据
    getDataByYear(year) {
      let params = { year: year };
      this.getRequest(finance.getDataByYear, params)
        .then(res => {
          let monthList = res;
          this.monthData = [];
          //获取是支出还是输入的数据
          monthList.forEach((item, index) => {
            if (item.is_in == this.lineIndex) {
              this.monthData.push(item);
            }
          });
          console.log("this.monthData---", this.monthData);
          let value = this.handleData(year);
          this.tab(value);
        })
        .catch(err => {});
    },
    //根据月份获取数据
    getDataByMonth(month) {
      let params = { year_month: month };
      //				console.log('getDataByMonth----',params);
      this.getRequest(finance.getSumByPeriod, params)
        .then(res => {
          console.log("getSumByPeriod----", res);
          let allList = res;
          console.log("allList----", allList);
          this.costData = {
            title: [],
            value: [],
            type: 1
          };
          this.incomeData = {
            title: [],
            value: [],
            type: 2
          };
          allList.forEach((item, index) => {
            if (item.is_in == "0") {
              this.costData.title.push(item.name);
              this.costData.value.push(item.money);
            } else if (item.is_in == "1") {
              this.incomeData.title.push(item.name);
              this.incomeData.value.push(item.money);
            }
          });
          console.log("支出列表---", this.costData);
          console.log("收入列表---", this.incomeData);
        })
        .catch(err => {});
    },
    //整理没有数据的月份数据
    handleData(year) {
      let monthList = [];
      let dataList = [];
      let value = [];

      for (let i = 1; i <= 12; i++) {
        monthList.push(year + "-" + this.util.toDouble(i));
      }
      //如果月份没数据，补上
      for (let j = 0; j < monthList.length; j++) {
        let count = 0;
        for (let h = 0; h < this.monthData.length; h++) {
          if (monthList[j] == this.monthData[h].month) {
            dataList.push(this.monthData[h]);
            break;
          } else {
            count++;
            if (count == this.monthData.length) {
              let params = {
                month: monthList[j],
                sum_money: "0.00",
                is_in: this.lineIndex + ""
              };
              dataList.push(params);
            }
          }
        }
      }

      console.log("dataList----", dataList);
      dataList.forEach((item, index) => {
        value.push(item.sum_money);
      });
      return value;
    },
    //tab菜单切换方法
    tab(value) {
      this.total = 0;
      if (this.lineIndex == 0) {
        this.title = "总支出";
      } else {
        this.title = "总收入";
      }
      //计算总数
      value.forEach((item, index) => {
        this.total += parseFloat(item);
      });
      this.total = this.total.toFixed(2);

      console.log("value-----", value);
      this.yearData = {
        xLine: null,
        value: value,
        type: parseInt(this.lineIndex) + 1,
        tipsTitle: this.lineTitle[this.lineIndex]
      };

      //重新渲染折线图
      this.showLineChart = false;
      this.$nextTick(() => {
        this.showLineChart = true;
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.dataShow {
  .pie {
    display: flex;
    margin-bottom: 30px;
    & > div {
      flex: 1;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 46px 0px rgba(58, 127, 159, 0.1);
      border-radius: 10px;
      &:last-child {
        margin-left: 5%;
      }
      .title {
        padding: 20px 0 0 20px;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        .number {
          font-size: 28px;
          padding: 2px 7px;
          margin-right: 5px;
          display: inline-block;
          background: rgba(245, 248, 254, 1);
          border: 1px solid rgba(204, 204, 204, 1);
          border-radius: 5px;
        }
      }
    }
  }
  .yearChart {
    & > div {
      border-radius: 10px;
    }
  }
  .lineChart {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 46px 0px rgba(58, 127, 159, 0.1);
    border-radius: 10px;
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 4vw 0px 20px;
      position: relative;
      top: 45px;
      z-index: 1000;
      .yearData {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .rightData {
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  /deep/ {
    .el-tabs__item {
      padding: 0px;
    }
    .el-tabs__header {
      margin-bottom: 0px;
      border-bottom: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-left: none;
    }
    .el-tabs__item.is-active {
      font-size: 18px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: $Theme-color;
    }
  }
}
</style>