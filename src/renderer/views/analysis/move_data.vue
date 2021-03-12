<template>
  <div class="wrap">
    <!-- <header>
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
    </header> -->
    <AnalysisHead :type="1" :crumbsShow="false" :timeCurrent="timeCurrent"
      @handleFresh="handleFresh" 
      @selectTime="selectTime"
      @selectTimeRange="selectTimeRange">
    </AnalysisHead>
    <section class="ratio-wrap">
      <div class="ratio-item" v-for="(item,index) in ratioArr" :key="index">
        <p class="ratio-name">{{item.ratioName}}</p>
        <p class="ratio-time">
          <!-- <span>{{item.timeRange}}</span>
          <span>|</span> -->
          <span>{{timeRange||typeText}}</span>
        </p>
        <p class="ratio-count">
          <span>{{item.count}}</span>
          <span>{{item.unit}}</span>
        </p>
        <p class="ratio">
          <span>环比：</span>
          <span>{{item.chainRatio}}</span>
          <span>同比：</span>
          <span>{{item.sameRatio}}</span>
        </p>
      </div>
    </section>
    <section class="GMV-change">
      <div class="intro">
        <p class="title">GMV近30天变化趋势</p>
        <p class="time-range">{{`${new Date().getFullYear()}-${gmvRes.time[0]} ~ ${new Date().getFullYear()}-${gmvRes.time[gmvRes.time.length-1]}`}}</p>
        <p class="day">一个月</p>
        <p class="count">
          <span>{{gmvRes.total}}</span>
          <span>元</span>
        </p>
        <p class="ratio chain">
          <span>环比：</span>
          <span>{{gmvRes.huan_bi}}%</span>
        </p>
        <p class="ratio same">
          <span>同比：</span>
          <span>{{gmvRes.tong_bi}}%</span>
        </p>
        <p class="total">
          <span>合计：</span>
          <span>{{gmvRes.total}}元</span>
        </p>
        <p class="average">
          <span>均值：</span>
          <span>{{gmvRes.pre30}}元</span>
        </p>
      </div>
      <div class="line-chart">
        <Echarts id="GMV" w="86%" h="90%" :options='GmvOptions' className="Gmv-chart"></Echarts>
        <div class="name">
          <span>-</span>
          <span>-</span>
          <span>GMV</span>
        </div>
      </div>
    </section>
    <section class="order-category">
      <div class="pine" v-for="(item,index) in pineArr" :key="index">
        <p class="pine-title">{{item.name}}</p>
        <p class="pine-time">
          <span>{{timeRange||typeText}}</span>
          <!-- <span>{{item.timeRange}}</span>
          <span>|</span>
          <span>{{item.timeText}}</span> -->
        </p>
        <div class="pine-chart">
          <Echarts :id="item.id" w="800px" h="500px" :options='item.options' className="item.className"></Echarts>
        </div>
      </div>
    </section>
    <section class="coupon-data">
      <p class="coupon-title">优惠券使用情况</p>
      <p class="coupon-time">
        <span>{{timeRange||typeText}}</span>
        <!-- <span>2019-09-10～2019-09-17</span>
        <span>|</span>
        <span>本周</span> -->
      </p>
      <div class="coupon-count">
        <div class="total">
          <span>{{couponTotal}}</span>
          <span>次</span>
        </div>
        <div class="item-count-wrap">  
          <div class="item-count" v-for="(item,index) in couponArr" :key="index">
            <span>----</span>
            <span>{{item.name}}</span>
            <span>{{item.total}}</span>
            <span>次</span>
          </div>
        </div>
      </div>
      <div class="coupun-change">
        <Echarts id="coupon" w="100%" h="500px" :options='couponOptions' className="coupon-chart"></Echarts>
      </div>
    </section>
  </div>
</template>

<script>
import Echarts from '../../components/DrawEchart/index'
import AnalysisHead from '../../components/AnalysisHead/index'
import {analysis} from "@config/api.js"
	import { mapGetters } from "vuex";


  export default {
    data(){
      return{
        timeArr:[
          {
            text:'昨日',
            checked:false,
            type:'1'
          },
          {
            text:'今日',
            checked:true,
            type:'2'
          },
          {
            text:'上周',
            checked:false,
            type:'3'
          },
          {
            text:'本周',
            checked:false,
            type:'4'
          },
          {
            text:'上月',
            checked:false,
            type:'5'
          },
          {
            text:'本月',
            checked:false,
            type:'6'
          },
          {
            text:'去年',
            checked:false,
            type:'7'
          },
          {
            text:'本年',
            checked:false,
            type:'8'
          },
        ],
        ratioArr:[
          {
            ratioName:'GMV',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'元',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'订单量',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'次',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'下单人数',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'人',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'客单价',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'取消订单数量',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'次',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'取消订单的用户数',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'人',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'退款的次数',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'次',
            chainRatio:'',
            sameRatio:''
          },
          {
            ratioName:'退款的用户',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            count:'',
            unit:'人',
            chainRatio:'',
            sameRatio:''
          },
        ],
        gmvRes:{
          time:[]
        },
        GmvOptions:{
        	
        },
        couponOptions:{
        	
//        xAxis: {
//            type: 'category',
//            data: ['9-5', '9-6', '9-7', '9-8', '9-9', '9-10', '9-11','9-12','9-13','9-14','9-15','9-16','9-17','9-18'],
//            boundaryGap:false,//值在刻度上而不是中间
//            axisLabel:{
//              rotate:-20,
//              margin:16
//            },
//        },
//        yAxis: {
//          type: 'category',
//            data:['0','500','1000','1500','2000','2500'],
//            axisLabel: {
//              formatter: '{value} 次'
//            },
//            boundaryGap:false,
//            axisLine:{
//              show:false
//            },
//            axisTick:{
//              show:false
//            },
//            splitLine:{
//              show:true,
//              lineStyle:{
//                type:'dotted'
//              }
//            },
//            offset:35
//        },
//        tooltip: {
//            trigger: 'axis',
//            padding: [10, 10],
//            extraCssText: 'line-height:2'
//        },
//        series: [
//          {
//            name:'优惠券A',
//            data: ['500','1000','500','1500','2500','2000','500','2500','1500','2000','2500','1500','2000','500',],
//            type: 'line',
//            lineStyle:{
//              type:'dotted',
//              color:'#7842ED'
//            },
//            itemStyle: {
//              normal: {
//                color: "#7842ED",//折线点的颜色
//              }
//            }
//          },
//          {
//            name:'优惠券B',
//            data: ['1500','500','2500','1000','2500','1000','500','1500','2500','2000','2000','1000','2000','1500',],
//            type: 'line',
//            lineStyle:{
//              type:'dotted',
//              color:'#ED4242'
//            },
//            itemStyle: {
//              normal: {
//                color: "#ED4242",//折线点的颜色
//              }
//            }
//          }
//        ]
          
        },
        pineArr:[
          {
            name:'下单金额分布',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            id:'order',
            className:'order-pine',
            options:{
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
                          // {value:42, name:'200元以下'},
                          // {value:12, name:'200元～500元'},
                          // {value:8, name:'501元～1000元'},
                          // {value:20, name:'1001元～1500元'},
                          // {value:18, name:'1500元以上'}
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
            }
          },
          {
            name:'品类租借占比',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            id:'category',
            className:'category-pine',
            options:{
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
                          // {value:42, name:'影棚A'},
                          // {value:12, name:'影棚B'},
                          // {value:8, name:'相机A'},
                          // {value:20, name:'相机B'},
                          // {value:18, name:'相机A'}
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
            }
          }
        ],
        timeRange:'',
        startTime:'',
        endTime:'',
        type:1,
        uid:'',
        gmvChart:null,
        couponTotal:0,
        couponArr:[],
        couponArrOptions:[],
        typeText:'',
        timeCurrent:1
      }
    },
    components:{
      Echarts,
      AnalysisHead
    },
    computed: {
      ...mapGetters(["user_data"])
    },
    created(){
      this.uid=this.user_data.id
      this.typeText=this.timeArr[1].text
      // 获取今日的所有数据
      this.getPercent(this.uid,2)
      this.getGMV(this.uid)
      this.getOrderPrice(this.uid,2)
      this.getSalePer(this.uid,2)
      this.getCouponUse(this.uid,2)
    },
    methods:{
      // 刷新
      handleFresh(){
        console.warn('刷新')
        if(this.type!=9){
          this.getPercent(this.uid,this.type)
          this.getGMV(this.uid)
          this.getOrderPrice(this.uid,this.type)
          this.getSalePer(this.uid,this.type)
          this.getCouponUse(this.uid,this.type)
        }else{
          this.getPercent(this.uid,9,this.startTime,this.endTime)
          this.getGMV(this.uid)
          this.getOrderPrice(this.uid,9,this.startTime,this.endTime)
          this.getSalePer(this.uid,9,this.startTime,this.endTime)
          this.getCouponUse(this.uid,9,this.startTime,this.endTime)
        }
      },
      // 点击昨日今日上周...
      selectTime(data){
        this.timeCurrent=data.index
        this.timeRange=''
        console.warn('点击昨日今日上周',data)
        this.type=data.type
        this.typeText=this.timeArr[data.index].text
        this.getPercent(this.uid,this.type)
        this.getOrderPrice(this.uid,this.type)
        this.getSalePer(this.uid,this.type)
        this.getCouponUse(this.uid,this.type)
      },
      // 选择日期范围
      selectTimeRange(data){
        this.timeCurrent=-1
        this.typeText=''
        this.type=9
        console.warn('选择日期范围',data)
        this.startTime=data[0]
        this.endTime=data[1]
        this.timeRange=this.startTime+ '~' +this.endTime
        this.getPercent(this.uid,9,this.startTime,this.endTime)
        this.getOrderPrice(this.uid,9,this.startTime,this.endTime)
        this.getSalePer(this.uid,9,this.startTime,this.endTime)
        this.getCouponUse(this.uid,9,this.startTime,this.endTime)
      },
      // 获取8个数据的同比环比
      getPercent(id,type,startTime,endTime){
        this.getRequest(analysis.getAllPercent,{
          uid:id,
          time_type:type,
          st_time:startTime,
          et_time:endTime
        }).then(res=>{
          this.ratioArr[0].count=res.GMV.total
          this.ratioArr[0].chainRatio=res.GMV.huan_bi
          this.ratioArr[0].sameRatio=res.GMV.tong_bi

          this.ratioArr[1].count=res.count.total
          this.ratioArr[1].chainRatio=res.count.huan_bi
          this.ratioArr[1].sameRatio=res.count.tong_bi

          this.ratioArr[2].count=res.user.total
          this.ratioArr[2].chainRatio=res.user.huan_bi
          this.ratioArr[2].sameRatio=res.user.tong_bi

          this.ratioArr[3].count=res.order_user.total
          this.ratioArr[3].chainRatio=res.order_user.huan_bi
          this.ratioArr[3].sameRatio=res.order_user.tong_bi

          this.ratioArr[4].count=res.cancel_order_sun.total
          this.ratioArr[4].chainRatio=res.cancel_order_sun.huan_bi
          this.ratioArr[4].sameRatio=res.cancel_order_sun.tong_bi

          this.ratioArr[5].count=res.cancel_order_user.total
          this.ratioArr[5].chainRatio=res.cancel_order_user.huan_bi
          this.ratioArr[5].sameRatio=res.cancel_order_user.tong_bi

          this.ratioArr[6].count=res.refund_order_sun.total
          this.ratioArr[6].chainRatio=res.refund_order_sun.huan_bi
          this.ratioArr[6].sameRatio=res.refund_order_sun.tong_bi

          this.ratioArr[7].count=res.refund_order_user.total
          this.ratioArr[7].chainRatio=res.refund_order_user.huan_bi
          this.ratioArr[7].sameRatio=res.refund_order_user.tong_bi
        }).catch(err=>{})
      },
      // 获取GMV30
      getGMV(id){
        this.getRequest(analysis.getGMV30,{
          uid:id
        }).then(res=>{
          // console.warn(res,'获取GMV')
          this.gmvRes=res
          this.GmvOptions={
             xAxis: {
              type: 'category',
              data: res.time,
              boundaryGap:false,//值在刻度上而不是中间
              axisLabel:{
                rotate:-20,
                margin:16
              },
            },
            yAxis: {
              type : 'value',
              axisLabel : {
                  formatter: '{value} 元'
              },
              // type: 'category',
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
                // offset:35
            },
            series: [{
                data: res.series,
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
          }
        }).catch(err=>{})
      },
      initGMV(){
        // this.gmvChart=
      },
      // 获取下单金额分布
      getOrderPrice(id,type,startTime,endTime){
        this.getRequest(analysis.getOrderPrice,{
          uid:id,
          time_type:type,
          st_time:startTime,
          et_time:endTime
          // time_type:3,
          // st_time:'2019-06-07',
          // et_time:'2020-08-07'
        }).then(res=>{
          console.warn(res,'下单金额分布')
          let dataArr=[]
          res.series.forEach((item,index)=>{
            dataArr.push({
              value:item,
              name:res.name[index]
            })
          })
          this.pineArr[0]={
            name:'下单金额分布',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            id:'order',
            className:'order-pine',
            options:{
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
                      data:dataArr,
                      itemStyle:{
                        emphasis:{
                          label:{
                            color:'#7C6AFF'
                          }
                        },
                      }
                  }
              ]
            }
          }
        }).catch(err=>{})
      },
      // 获取品类销售百分比
      getSalePer(id,type,startTime,endTime){
        this.getRequest(analysis.getSalePer,{
          uid:id,
          time_type:type,
          st_time:startTime,
          et_time:endTime
          // time_type:3,
          // st_time:'2019-06-07',
          // et_time:'2020-08-07'
        }).then(res=>{
          console.warn(res,'品类租借占比')
          let dataArr=[]
          res.series.forEach((item,index)=>{
            dataArr.push({
              value:item,
              name:res.name[index]
            })
          })
          this.pineArr[1]={
            name:'品类租借占比',
            timeRange:'2019-09-10～2019-09-17',
            timeText:'本周',
            id:'category',
            className:'category-pine',
            options:{
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
                      data:dataArr,
                      itemStyle:{
                        emphasis:{
                          label:{
                            color:'#7C6AFF'
                          }
                        },
                      }
                  }
              ]
            }
          }
        }).catch(err=>{})
      },
      // 获取优惠券使用情况
      getCouponUse(id,type,startTime,endTime,couponId){
        this.getRequest(analysis.getCouponUse,{
          uid:id,
          time_type:type,
          st_time:startTime,
          et_time:endTime,
          coupon_id:0
        }).then(res=>{
          console.warn(res,'优惠券使用情况')
          this.couponTotal=res.total.reduce((pre,cur)=>Number(pre)+Number(cur))
          this.couponArr=res.series
          this.couponArr.forEach(item=>{
            item.total=item.data.reduce((pre,cur)=>Number(pre)+Number(cur))
          })
          console.warn(this.couponArr,'销售数组')
          res.series.forEach((item,index)=>{
            this.couponArrOptions.push({
              name:item.name,
              data: item.data,
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
            })
          })
          this.couponOptions={
            xAxis: {
                type: 'category',
                data: res.time,
                boundaryGap:false,//值在刻度上而不是中间
                axisLabel:{
                  rotate:-20,
                  margin:16
                },
            },
            yAxis: {
              type: 'category',
                data:['0','500','1000','1500','2000','2500'],
                axisLabel: {
                  formatter: '{value} 次'
                },
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
            tooltip: {
                trigger: 'axis',
                // formatter: "{b}<br/><br/>{a0} : {c0}<br/><br/>{a1} : {c1}",
                padding: [10, 10],
                extraCssText: 'line-height:2'
            },
            series: this.couponArrOptions
          }
        }).catch(err=>{})
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  padding: 10px 20px;
  box-sizing: border-box;
  header{
    color: #999;
    margin-bottom: 24px;
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
  .ratio-wrap{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .ratio-item{
      width:calc((100% - 60px)/4);
      height:185px;
      background: #fff;
      padding: 20px 0 0 20px;
      box-sizing: border-box;
      margin-right: 20px;
      &:first-child{
        margin-bottom: 20px;//只需单独设置第一个的margin，flex布局便会自动排列好
      }
      &:nth-child(4n){
        margin-right: 0;
      }
      // &:nth-child(5),&:nth-child(5) ~ div{
      //   background: red;
      // }  
      .ratio-name{
        font-size: 20px;
        color: #333;
        margin-bottom: 4px;
      }
      .ratio-time{
        color: #999;
        font-size: 12px;
        margin-bottom: 20px;
        span:nth-child(2){
          margin: 0 13px;
        }
      }
      .ratio-count{
        margin-bottom: 5px;
        span:first-child{
          font-size: 40px;
          color: #333;
        }
        span:last-child{
          font-size: 12px;
          color: #999;
          position: relative;
          top: -4px;
          margin-left: 7px;
        }
      }
      .ratio{
        font-size: 12px;
        span:nth-child(odd){
          color: #999;
          margin-right: 14px;
        }
        span:nth-child(even){
          position: relative;
          &:before{
            content: '';
            position:absolute;
            left: 0;
            top: -3px;
            transform: translate(-150%,0);
            width: 0;
            border: 5px solid transparent;
            border-bottom: 9px solid #D4282D;
          }
        }
        span:nth-child(2){
          margin-right: 24px;
          color: #D4282D;
        }
        span:last-child{
          color: #2B9F32;
          &:before{
            border-bottom-color: #2B9F32;
          }
        }
      }
    }
  }
  .GMV-change{
    background: #fff;
    display: flex;
    margin-bottom: 20px;
    min-height:478px;
    .intro{
      width: 25%;
      padding: 20px 0 0 20px;
      box-sizing: border-box;
      .title{
        font-size: 20px;
        color: #333;
        margin-bottom: 8px;
      }
      .time-range,.day{
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }
      .count{
        margin-bottom: 8px;
        span:first-child{
          font-size: 40px;
          color: #333;
        }
        span:last-child{
          font-size: 12px;
          color: #999;
          position: relative;
          top: -4px;
          margin-left: 7px;
        }
      }
      .ratio{
        font-size: 12px;
        margin-bottom: 4px;
        span:first-child{
          color: #999;
          margin-right: 14px;
        }
        span:last-child{
           position: relative;
           color: #D4282D;
          &:before{
            content: '';
            position:absolute;
            left: 0;
            top: -3px;
            transform: translate(-150%,0);
            width: 0;
            border: 5px solid transparent;
            border-bottom: 9px solid #D4282D;
          }
        }
      }
      .same{
        margin-bottom: 128px;
        span:last-child{
          color: #2B9F32;
          &:before{
            border-bottom-color: #2B9F32;
          }
        }
      }
      .total,.average{
        span:first-child{
          font-size: 14px;
          color: #999;
        }
        span:last-child{
          font-size: 20px;
          color: #333;
        }
      }
      .total{
        margin-bottom: 8px;
      }
      .average{
        margin-bottom: 170px;
      }
    }
    .line-chart{
      position: relative;
      flex: 1;
      .name{
        position: absolute;
        bottom: 20px;
        left: 44%;
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
  }
  .order-category{
    min-height: 478px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .pine{
      padding: 20px 0 0 20px;
      box-sizing: border-box;
      min-height: 500px;
      background: #fff;
      width: calc((100% - 20px)/2);
      .pine-title{
        font-size: 20px;
        color: #333;
        margin-bottom: 4px;
      }
      .pine-time{
        font-size: 12px;
        color: #999;
        margin-bottom: 40px;
        span:nth-child(2){
          margin: 0 13px;
        }
      }
      .pine-chart{
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 50px;
      }
    }
  }
  .coupon-data{
    padding: 20px 0 50px 20px;
    box-sizing: border-box;
    background: #fff;
    min-height: 511px;
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
    .coupon-title{
      font-size: 20px;
      color: #333;
      margin-bottom: 4px;
    }
    .coupon-time{
      font-size: 12px;
      color: #999;
      margin-bottom: 40px;
      span:nth-child(2){
        margin: 0 13px;
      }
    }
    .coupon-count{
      display: flex;
      .total{
        width: 160px;
        // margin-right: 56px;
        span:first-child{
          color: #333333;
          font-size: 40px;
          margin-right: 8px;
        }
        span:last-child{
          font-size: 12px;
          color: #999;
        }
      }
      .item-count-wrap{
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item-count{
          width: calc((100% - 80px)/5);
          margin-right: 20px;
          // width: 230px;
          span:first-child{
            color: #7842ED;
            font-weight: bold;
            margin-right: 10px;
            font-size: 20px;
          }
          span:nth-child(2){
            font-size: 12px;
            color: #999;
            margin-right: 10px;
          }
          span:nth-child(3){
            color: #333333;
            font-size: 40px;
            margin-right: 8px;
          }
          span:nth-child(4){
            font-size: 12px;
            color: #999;
          }
        }
        .item-count:nth-child(5n){
          margin-right: 0;
        }
      }
    }
    // .coupun-change{

    // }
  }
}
</style>