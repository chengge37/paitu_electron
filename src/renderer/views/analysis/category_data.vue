<template>
  <div class="app-container">
    <div class="main-left" v-if="!dataType">
      <div class="nav">
        <div
          class="nav-item"
          :class="{'nav-active' : current == index}"
          v-for="(item,index) in navList"
          :key="index"
          @click="navEvent(index)"
        >
          <span :class="{'active' : current == index}">{{item}}</span>数据
        </div>
      </div>

      <el-tree
        style="min-height:800px"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        @check="getHalfCheckEvent"
      ></el-tree>
    </div>
    <div class="main-right">
      <AnalysisHead
        :type="3"
        :crumbsShow="false"
        :searchShow="false"
        :navShow="false"
        :timeShow="timeShow"
        :timeCurrent="timeCurrent"
        :showList="showList"
        :dataType="dataType"
        @selectTab="selectTab"
        @handleFresh="handleFresh"
        @selectTime="selectTime"
        @selectTimeRange="selectTimeRange"
        @clickPurpleBtn="clickPurpleBtn"
        @clickSearch="clickSearch"
        @clickAttr="clickAttr"
      ></AnalysisHead>

      <!-- echarts -->
      <div id="main" style="width:98%; height:600px; margin-top:20px;" v-if="!dataType"></div>

      <!-- 表格 -->
      <el-row v-if="dataType">
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="classify_name" label="影棚类型" width="200"></el-table-column>
          <el-table-column prop="name" label="名称" width="300"></el-table-column>
          <el-table-column label="面积" width="100">
            <template slot-scope="scope">
              <span>
                {{scope.row.square}}m
                <sup>2</sup>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="影棚器材概况">
            <template slot-scope="scope">
              <el-table :data="scope.row.equip" height="250">
                <el-table-column prop="name" label="器材名称"></el-table-column>
                <!-- <el-table-column prop="type" label="情况"></el-table-column> -->
                <el-table-column prop="count_order_id" label="租借次数"></el-table-column>
                <el-table-column prop="success" label="成交率"></el-table-column>
                <el-table-column prop="price" label="销售额"></el-table-column>
                <el-table-column prop="time" label="租借时长"></el-table-column>
                <!-- <el-table-column prop="rent_rate" label="租借率"></el-table-column> -->
              </el-table>
            </template>
          </el-table-column>
          <!-- <el-table-column label="指标" width="160">
            <template slot-scope="scope">
              <el-table :data="scope.row.quota" :show-header="false" fit>
                <el-table-column prop="opt"></el-table-column>
              </el-table>
            </template>
          </el-table-column>-->
          <!-- <el-table-column label="合计" width="160">
            <template slot-scope="scope">
              <el-table :data="scope.row.total" :show-header="false" fit>
                <el-table-column prop="opt"></el-table-column>
              </el-table>
            </template>
          </el-table-column> -->
        </el-table>

        <!-- 页码 -->
      <el-pagination
        style="width:500px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="param.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="param.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>   

      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import AnalysisHead from "../../components/AnalysisHead/index";
import { analysis } from "@config/api.js";
import { mapGetters } from "vuex";

export default {
  name: "category",
  data() {
    return {
      option: {
        title: {
          text: "器材使用情况",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "55",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: [],
          axisLabel: {
            rotate: -20,
            margin: 20
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dotted"
            }
          },
          offset: 50
        },
        series: []
      },
      timeCurrent: 1,
      current: 0, // 导航当前点击（ 0：器材数据，1：影棚数据）
      treeData: [], // 三级树
      navList: ["器材", "影棚"],
      equipment: {
        type: "", // 1：影棚 2：设备
        time_type: "", // 时间类型 1昨天 2今天 3上周 4本周 5上月 6本月 7去年 8今年 9自定义
        data_type: "", // 1租借次数 2成交率 3销售额 4租借时长 5租借率  (2、5是未开通功能，未来可能废弃)
        st_time: "", // 开始日期
        et_time: "", // 结束日期
        rel_id: "" // 影棚或设备idz; 0或不存表示全部。id。多个id逗号分割
      },
      timeShow: false,
      showList: false,
      dataType: false,
      tableData: [

      ],
      param: {
        page: 1,
        page_size: 10
      },
      totalCount: 0,
      pageParam: {
        page: 1,
        page_size: 10
      },      
    };
  },
  methods: {
    // 获取器材数据
    getEquip() {
      this.getRequest(analysis.getEquip, { uid: this.user_data.id })
        .then(resp => {
          console.log(resp);
          this.treeData = resp;
          console.log(this.treeData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取影棚数据（折线图）
    getStudio() {
      this.getRequest(analysis.getStudio, { uid: this.user_data.id })
        .then(resp => {
          console.log(resp);
          this.treeData = resp;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取影棚数据（表格）
    getStudioTable(page,page_size,time_type,st_time,et_time) {
      if(time_type == 9){
        st_time = this.equipment.st_time;
        et_time = this.equipment.et_time;
      }else{
        time_type += 1;
      }
      this.getRequest(analysis.getStudioTable, {page,page_size,time_type,st_time,et_time,uid: this.user_data.id })
        .then(resp => {
          console.log(resp);
          if(!resp.rows){
            this.tableData = [];
          }else{
            this.tableData = resp.rows;
            this.totalCount = parseInt(resp.total_count);            
          }
          
        })
        .catch(err => {
          console.log(err);
          this.tableData = [];
        });
    },
    // 初始化
    init() {
      this.equipment.type = 1;
      this.equipment.time_type = 2;
      this.equipment.uid = this.user_data.id;
      this.drawEcharts(this.option);
    },
    // 画echarts
    drawEcharts(option) {
      var myChart = echarts.init(document.getElementById("main"));
      myChart.setOption(option, true);
      console.log(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    // 导航点击事件
    navEvent(index) {
      console.log(index);
      this.current = index;
      this.equipment.rel_id = "";
      switch (index) {
        case 0:
          this.option.title.text = "器材使用情况";
          this.showList = false;
          this.equipment.time_type = 2;
          this.equipment.st_time = "";
          this.equipment.et_time = "";
          this.timeCurrent = 1;
          this.timeShow = false;
          this.drawEcharts(this.option);
          this.equipment.type = ++index;
          this.getEquip();
          break;
        case 1:
          this.option.title.text = "影棚使用情况";
          this.timeShow = true;
          this.showList = true;
          this.drawEcharts(this.option);
          this.getStudio();
          break;
      }
    },
    // 选择器材或者影棚
    selectTab() {
    },
    // 刷新
    handleFresh() {
      this.getUsage(this.equipment);
    },
    // 点击昨日今日上周...
    selectTime(data) {
      this.timeCurrent = data.index;
      this.equipment.time_type = ++data.index;
      this.equipment.st_time = "";
      this.equipment.et_time = "";
      this.getUsage(this.equipment);
    },
    // 选择日期范围 (隐藏)
    selectTimeRange(event, i) {
      console.log(event, i);
      if (!event) {
        this.timeCurrent = 1;
        this.equipment.st_time = "";
        this.equipment.et_time = "";
        return;
      }
      this.equipment.st_time = this.conversionTime(event[0]);
      this.equipment.et_time = this.conversionTime(event[1]);
      this.timeCurrent = 9;
      this.equipment.time_type = 9;
      console.log(this.equipment.st_time, this.equipment.et_time);
      this.getUsage(this.equipment);
    },
    // 转换成日期
    conversionTime(time) {
      let d = new Date(time);
      console.log(d);
      let resDate =
        d.getFullYear() +
        "-" +
        this.judge(d.getMonth() + 1) +
        "-" +
        this.judge(d.getDate());
      return resDate;
    },
    // 判断时间不够10增加0
    judge(t) {
      return t < 10 ? "0" + t : t;
    },
    // 查看列表
    clickPurpleBtn(dataType) {
      this.dataType = !dataType;
      this.timeCurrent = 1;
      if(!dataType){
        this.getStudioTable(1,10, this.timeCurrent)
      }else{
        this.treeData = [];
        this.getStudio();
      }
    },
    // 查找
    clickSearch() {
    },
    // 点击租借次数，成交
    clickAttr(i) {
      this.equipment.data_type = ++i;
      this.getUsage(this.equipment);
    },

    // 三级树分类，节点被点击事件
    getHalfCheckEvent(currentObj, checkedKeys) {
      console.log(currentObj);
      console.log(checkedKeys);
      console.log(this.$refs.tree);
      let res = this.$refs.tree.getCheckedNodes();
      console.log(res);
      var arr = [];
      res.forEach(item => {
        console.log(item);
        if (!item.hasOwnProperty("children")) {
          arr.push(item.id);
        }
      });
      if (arr.length == 0) {
        console.log("没设备id不请求");
        this.equipment.rel_id = "";
        this.option.series = [];
        this.option.xAxis.data = [];
        this.drawEcharts(this.option);
      } else {
        console.log(this.equipment);
        this.equipment.rel_id = arr.join(",");
        this.getUsage(this.equipment);
      }
    },
    //  校验数据对象的字段是否正确，并请求接口返回echarts数据
    getUsage(data) {
        if (this.dataType) {
          console.log("请求表格数据")
          this.getStudioTable(1,this.pageParam.page_size,this.timeCurrent)
          return;
        }else{
          if (!data.type || !data.time_type || !data.data_type || !data.rel_id) {
            console.log(this.equipment);
            console.log("不请求");
              this.option.series = [];
              this.drawEcharts(this.option);
              return;
          } else {
            console.log("请求");
            this.getRequest(analysis.equipment, this.equipment)
              .then(resp => {
                if (!resp){
                  console.log("无数据")
                  this.option.series = [];
                  this.drawEcharts(this.option);
                }else{
                  this.option.series = resp.series;
                  this.option.xAxis.data = resp.time;
                  this.drawEcharts(this.option);
                }

              })
              .catch(err => {
                console.log(err);
              });
          }
        }      
    },

    // 每页展示多少条
    handleSizeChange(val) {
      console.log(val);
      console.log("每页展示多少条发生了改变");
      let pageParam = this.pageParam;
      pageParam.page_size = val;
      this.getStudioTable(this.pageParam.page,val, this.timeCurrent)
    },
    // 当前页码发生改变
    handleCurrentChange(val) {
      console.log(val);
      console.log("当前页码发生改变");
      let pageParam = this.pageParam;
      pageParam.page = val;
      this.getStudioTable(val,this.pageParam.page_size, this.timeCurrent)
    },    
  },
  mounted() {
    this.init();
    this.getEquip();
  },
  computed: {
    ...mapGetters(["user_data"])
  },
  components: {
    AnalysisHead
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  padding: 0 50px 20px 20px;
  .main-left {
    margin-top: 20px;
    padding: 0 10px;
    width: 426px;
    height: 860px;
    // background: #fff;
    flex-shrink: 0;
    .nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 15px;
      .nav-active {
        color: #000000 !important;
      }
      .nav-item {
        min-width: 80px;
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #867e9d;
        line-height: 28px;
        margin-right: 20px;
        cursor: pointer;
        transition: all 0.3s;
        .active {
          padding-bottom: 5px;
          border-bottom: 2px solid #7C6AFF;
        }
      }
    }
  }
  .main-right {
    width: 100%;
    margin-top: 2%;
  }
}

#main {
  margin: 0 auto;
}

.conditions {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>