<template>
  <div class="wrap">
    <header>
      <div class="bread">
        <span>数据分析</span>
        <span> - </span>
        <span>动销数据</span>
      </div>
      <div class="select">
        <div class="time-btn">
          <span :class="{'btn-active':item.checked}" v-for="(item,index) in timeArr" :key="index">{{item.text}}</span>
        </div>
        <div class="time-range">
          <span>日期筛选：</span>
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="fresh-btn">
          <i class="el-icon-refresh-right"></i>
        </div>
      </div>
    </header>
    <section class="accumulative">
      <p class="accumulative-title">优惠券使用情况</p>
      <p class="accumulative-time">
        <span>2019-09-10～2019-09-17</span>
        <span>|</span>
        <span>本周</span>
      </p>
      <div class="accumulative-count">
        <div class="count-item" v-for="(item,index) in countArr" :key="index">
          <span>{{item.countName}}</span>
          <div>
            <span>{{item.num}}</span>
            <span v-if="index==3||index==4">{{item.unit}}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="user-register">
      <div class="user-register-item" v-for="(item,index) in userCountArr" :key="index">
        <p class="item-title">{{item.name}}</p>
        <p class="item-time">
          <span>{{item.timeRange}}</span>
          <span>|</span>
          <span>{{item.timeText}}</span>
        </p>
        <div class="number">
          <span>{{item.count}}</span>
          <span>{{item.unit}}</span>
        </div>
      </div>
    </section>
    <section class="user-attribute">
      <div class="attribute-header">
        <div class="name-time">
          <p class="name">用户属性</p>
          <p class="time">
            <span>2019-09-10～2019-09-17</span>
            <span>|</span>
            <span>本周</span>
          </p>
        </div>
        <div class="area">
          <el-dropdown trigger="click" class="cursor">
            <span class="el-dropdown-link">
              全国<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>全国</el-dropdown-item>
              <el-dropdown-item>广东省</el-dropdown-item>
              <el-dropdown-item>广西省</el-dropdown-item>
              <el-dropdown-item>湖南省</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-checkbox-group 
            v-model="checkedArea"
            >
            <el-checkbox v-for="area in areaArr" :label="area" :key="area">{{area}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="attr-chart">
        <Echarts id="attr" w="800px" h="500px" :options='attrOptions' className="attr-pine"></Echarts>
      </div>
    </section>
    <section class="overall">
      <div class="overall-left">
        <div class="up">
          <p class="name">总体转化情况</p>
          <p class="time">
            <span>2019-09-10～2019-09-17</span>
            <span>|</span>
            <span>本周</span>
          </p>
          <div class="purple-area">
            <div class="text">
              <span>总体转化率</span>
              <span>5.12%</span>
            </div>
            <div class="purple-left"></div>
            <div class="purple-right"></div>
          </div>
        </div>
        <div class="number-item" v-for="(item,index) in peopleArr" :key="index">
          <div class="item">
            <span>{{index+1}}</span>
            <span>{{item.name}}</span>
            <span>{{item.count}}人</span>
          </div>
          <div class="percent" v-if="index!=peopleArr.length-1">
            <ali-svg-icon icon-class="Vupload" class="Vupload"></ali-svg-icon>
            <span>5.12%</span>
          </div>
        </div>
      </div>
      <div class="overall-right">
        <div class="tab">
          <span v-for="(item,index) in tabArr" :key="index" :class="{active:item.checked}" @click="selectTab(index)">{{item.text}}</span>
        </div>
        <div class="chart" v-if="tabArr[0].checked">
          <Echarts id="overall" w="100%" h="500px" :options='overallOptions' className="overall-chart"></Echarts>
          <div class="under-name">
            <span>-</span>
            <span>-</span>
            <span>转化情况</span>
          </div>
        </div>
        <div class="line-area" v-else>
          <div class="line-item" v-for="item in 4" :key="item">
            <div class="purple-line"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Echarts from '../../components/DrawEchart/index'

  export default {
    data(){
      return{
        timeArr:[
          {
            text:'昨日',
            checked:false
          },
          {
            text:'今日',
            checked:true
          },
          {
            text:'上周',
            checked:false
          },
          {
            text:'本周',
            checked:false
          },
          {
            text:'上月',
            checked:false
          },
          {
            text:'本月',
            checked:false
          },
          {
            text:'去年',
            checked:false
          },
          {
            text:'本年',
            checked:false
          },
        ],
        countArr:[
          {
            countName:'PV',
            num:135
          },
          {
            countName:'UV',
            num:62
          },
          {
            countName:'独立IP',
            num:32
          },
          {
            countName:'页面平均浏览',
            num:12,
            unit:'分钟'
          },
          {
            countName:'平均交互深度',
            num:3.8,
            unit:'次'
          }
        ],
        userCountArr:[
          {
            name:'累计用户',
            timeRange:'2019-09-10 ~ 2019-09-17',
            timeText:'本周',
            count:'213,828',
            unit:'人'
          },
          {
            name:'累计注册',
            timeRange:'2019-09-10 ~ 2019-09-17',
            timeText:'本周',
            count:'213,828',
            unit:'人'
          }
        ],
        timeRange:'',
        areaArr:['精确到省','精确到市','精确到区'],
        checkedArea:[],
        attrOptions:{
          color:['#55ACEE','#798CF0', '#FACF2B', '#A5EFDF', '#FF9944'],
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)",
              show:false
          },
          series: [
              {
                  // name:'访问来源',
                  type:'pie',
                  radius: ['40%', '70%'],
                  hoverOffset:8,//高亮扇区的偏移距离,default: 10
                  startAngle:240,//起始角度，支持范围[0, 360],default: 90 
                  
                  label: {
                      normal: {
                          formatter: "{b}\n\n{d}%",
                          show: true,
                          color:'#333',
                          fontSize:14,
                          fontWeight:500,
                          // position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  labelLine: {
                      length:40,//视觉引导线第一段的长度
                      length2:20//视觉引导项第二段的长度。
                  },
                  data:[
                      {value:42, name:'影棚A'},
                      {value:12, name:'影棚B'},
                      {value:8, name:'相机A'},
                      {value:20, name:'相机B'},
                      {value:18, name:'相机A'}
                  ],
                  itemStyle:{
                    emphasis:{
                      label:{
                        color:'#7C6AFF'
                      }
                    },
                  }
              }
          ]
        },
        peopleArr:[
          {
            name:'访问主页&APP启动',
            count:'21,3124'
          },
          {
            name:'浏览商品详情',
            count:'3,124'
          },
          {
            name:'加入购物车',
            count:'3,124'
          },
          {
            name:'支付订单',
            count:'3,124'
          }
        ],
        overallOptions:{
          xAxis: {
              type: 'category',
              data: ['9-5', '9-6', '9-7', '9-8', '9-9', '9-10', '9-11','9-12','9-13','9-14','9-15','9-16','9-17','9-18'],
              boundaryGap:false,//值在刻度上而不是中间
              axisLabel:{
                rotate:-20,
                margin:16
              },
          },
          yAxis: {
            type: 'category',
              data:['0','500元','1000元','1500元','2000元','2500元'],
              boundaryGap:false,
              axisLine:{
                show:false
              },
              axisTick:{
                show:false
              },
              splitLine:{
                show:true,
                lineStyle:{
                  type:'dotted'
                }
              },
              offset:35
          },
          series: [{
              data: ['500元','1000元','500元','1500元','2500元','2000元','500元','2500元','1500元','2000元','2500元','1500元','2000元','500元',],
              type: 'line',
              lineStyle:{
                type:'dotted',
                color:'#7842ED'
              },
              itemStyle: {
                normal: {
                  color: "#7842ED",//折线点的颜色
                }
              }
          }]
        },
        tabArr:[
          {
            text:'趋势',
            checked:true
          },
          {
            text:'对比',
            checked:false
          },
        ]
      }
    },
    methods:{
      selectTab(i){
        this.tabArr.forEach(item=>{
          item.checked=false
        })
        this.tabArr[i].checked=true
      }
    },
    components:{
      Echarts
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  padding: 10px 20px;
  box-sizing: border-box;
  header{
    color: #999;
    margin-bottom: 20px;
    .bread{
      margin-bottom: 20px;
    }
    .select{
      display: flex;
      .time-btn{
        display: flex;
        margin-right: 10px;
        span{
          vertical-align: bottom;
          width: 48px;
          height: 100%;
          border:1px solid rgb(235,235,235);
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
        }
        span+span{
          border-left: none;
        }
        .btn-active{
          background: #7C6AFF;
          color: #f0f0f0;
        }
      }
      .time-range{
        margin-right:auto;
        &>span{
          color: #4E475C;
        }
        /deep/ {
          .el-range-separator{
            padding: 0;
          }
        }
      }
      .fresh-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        height: 34px;
        border: 1px solid #F0F0F0;
        align-self: center;
        background: #fff;
        cursor: pointer;
        i{
          font-size: 18px;
        }
      }
    }
  }
  .accumulative{
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    background: #fff;
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
    .accumulative-title{
      margin-bottom: 10px;
    }
    .accumulative-time{
      margin-bottom: 20px;
      span:nth-child(2){
        margin: 0 13px;
      }
    }
    .accumulative-count{
      display: flex;
      margin-bottom: 20px;
      .count-item{
        display: flex;
        flex-direction: column;
        margin-right: 50px;
        & > span:first-child{
          margin-bottom: 10px;
        }
        & > div{
          span:first-child{
            font-size: 20px;
            color: #333;
            font-weight: 600;
          }
          span+span{
            font-size: 12px;
          }
        }
        &:nth-child(4){
          border-left: 1px solid #F0F0F0;
          padding-left: 30px;
          box-sizing: border-box;
        }
      }
    }
  }
  .user-register{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .user-register-item{
      width: calc((100% - 20px)/2);
      padding: 20px 0 0 20px;
      box-sizing: border-box;
      background: #fff;
      min-height: 310px;
      .item-title{
        font-size: 20px;
        color: #333;
        margin-bottom: 4px;
      }
      .item-time{
        font-size: 12px;
        color: #999;
        margin-bottom: 60px;
        span:nth-child(2){
          margin: 0 13px;
        }
      }
      .number{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        span:first-child{
          color: #333;
          font-size: 40px;
          margin-right: 6px;
        }
        span:last-child{
          position: relative;
          top: 8px;
        }
      }
    }
  }
  .user-attribute{
    background: #fff;
    padding: 20px 0 50px 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .attribute-header{
      display: flex;
      .name-time{
        margin-right: 46px;
        .name{
          font-size: 20px;
          color: #333;
          margin-bottom: 4px;
        }
        .time{
          font-size: 12px;
          color: #999;
          margin-bottom: 60px;
          span:nth-child(2){
            margin: 0 13px;
          }
        }
      }
      .area{
        display: flex;
        .el-dropdown{
          margin-right: 65px;
          height: 20px;
        }
      }
    }
    .attr-chart{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .overall{
    margin-bottom: 60px;
    display: flex;
    .overall-left{
      padding-bottom: 20px;
      box-sizing: border-box;
      width: 310px;
      background: #fff;
      min-height: 529px;
      margin-right: 2px;
      .up{
        height: 200px;
        .name{
          padding: 20px 0 0 20px;
          box-sizing: border-box;
          font-size: 20px;
          color: #333;
          margin-bottom: 4px;
        }
        .time{
          padding-left: 20px;
          box-sizing: border-box;
          font-size: 12px;
          color: #999;
          margin-bottom: 34px;
          span:nth-child(2){
            margin: 0 13px;
          }
        }
        .purple-area{
          width: 150px;
          height: 52px;
          margin: 0 auto;
          background: #7C6AFF;
          color: #fff;
          position: relative;
          margin-bottom: 60px;
          .text{
            position: absolute;
            left: 50%;
            top: 20%;
            transform: translateX(-50%);
            // background: red;
            z-index: 9;
            text-align: center;
            line-height: 25px;
            // display: flex;
            // justify-content: center;
            // flex-direction: column;
          }
          .purple-left,.purple-right{
            width: 50%;
            height: 100%;
            position: absolute;
            top: 0;
            background: #7C6AFF;
          }
          .purple-left{
            // background: yellow;
            left: 0;
            transform: translateY(20%) skewY(15deg);
          }
          .purple-right{
            width: calc(50% - 1px);
            // background: orange;
            left: 50%;
            transform: translateY(20%) skewY(-15deg);
          }
        }
      }
      .number-item{
        .item{
          width: 290px;
          margin: 0 auto;
          height: 40px;
          background: #F8F8FA;
          display: flex;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          span:first-child{
            width: 20px;
            height: 20px;
            background: #7C6AFF;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 20px;
          }
          span:nth-child(2){
            margin-right: auto;
          }
        }
        .percent{
          text-align: center;
          // background: gold;
          height: 60px;
          padding-top: 20px;
          box-sizing: border-box;
          .Vupload{
            transform: rotate(180deg);
            margin-right: 5px;
          }
          span{
            color: #7C6AFF;
          }
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .overall-right{
      background: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-bottom: 80px;
      box-sizing: border-box;
      .tab{
        padding: 20px 0 0 20px;
        box-sizing: border-box;
        display: flex;
        // margin-bottom: 130px;
        height: 200px;
        span{
          width: 48px;
          height: 34px;
          border: 1px solid #EBEBEB;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: #867E9D;
          border-right: none;
        }
        span:first-child{
          border-top-left-radius: 20px; 
          border-bottom-left-radius: 20px; 
        }
        span:last-child{
          border-top-right-radius: 20px; 
          border-bottom-right-radius: 20px; 
        }
        .active{
          color: #F0F0F0;
          background: #7C6AFF;
        }
      }
      .chart{
        flex: 1;
        position: relative;
        .under-name{
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translate(-50%);
          span:not(:last-child){
            font-size: 25px;
            font-weight: bold;
            color: #7842ED;
          }
          span:last-child{
            margin-left: 5px;
          }
        }
      }
      .line-area{
        padding: 0 10px;
        box-sizing: border-box;
        .line-item{
          height: 40px;
          background: #F8F8FA;
          margin-bottom: 60px;
          .purple-line{
            width: 90%;
            height: 100%;
            background: #7C6AFF;
          }
          &:nth-child(2){
            .purple-line{
              width: 60%;
            }
          }
          &:nth-child(3){
            .purple-line{
              width: 40%;
            }
          }
          &:nth-child(4){
            .purple-line{
              width: 20%;
            }
          }
        }
      }
    }
  }
}
</style>