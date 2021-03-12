<template>
  <div class="wrap">
    <header>
      <div class="header-left">
        <Bread class="bread"></Bread>
        <div class="info">
          <div class="avatar" v-if="user_data">
            <!--<img :onerror="util.maleAvatar" :src="$qiniuHost+user_data.avatar" alt="">-->
            <el-image  :src="util.picExplode(user_data.avatar,util.maleAvatar)" fit="scale-down" :onerror="util.maleAvatar" alt="">
            </el-image>
          </div>
          <div class="welcome-occupation" v-if="user_data">
            <p>Hi , {{user_data.cname||user_data.nick}} 今天又是美好的一天，加油～</p>
            <p></p>
          </div>
        </div>
      </div>
      <div class="pv">
        <p>昨日PV</p>
        <p>{{homeTip.last_pv}}</p>
      </div>
      <div class="ip">
        <p>昨日IP</p>
        <p>{{homeTip.last_ip}}</p>
      </div>
    </header>
    <section class="category-wrap">
      <div class="category card-hover" :class="{selected:curIndex==index}" v-for="(item,index) in categoryArr" :key="index" @click="selectCategory(index,item)">
        <div class="category-icon">
          <ali-svg-icon v-if="index==0" icon-class="houtai_kehu_hong" class-name="item-icon"></ali-svg-icon>
          <ali-svg-icon v-if="index==1" icon-class="houtai_shouru_zise" class-name="item-icon"></ali-svg-icon>
          <ali-svg-icon v-if="index==2" icon-class="houtai_dingdan_lanse" class-name="item-icon"></ali-svg-icon>
        </div>
        <div class="label-value">
          <span class="label">{{item.label}}</span>
          <div class="category-value">
            <span>{{item.value}}</span>
            <span>{{item.unit}}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="main-part">
      <div class="part-left">
        <div class="chart">
          <Echarts id="myChart" w="100%" h="100%" :options='options' className="my-chart"></Echarts>
        </div>
        <div class="wait-part">
          <div class="wait-thing">
            <div class="title">
              <span class="title-text">待办事项</span>
              <el-radio-group v-model="isAll" @change="selectOwnAll">
                <el-radio label="1">自己</el-radio>
                <el-radio label="0">全部</el-radio>
              </el-radio-group>
              <span class="btn word-hover" @click="toWorkList">工作列表 ></span>
            </div>
            <div class="content-box">
              <div class="content-head">
                <span>名称</span>
                <span>开始</span>
                <span>结束</span>
                <span>执行人</span>
              </div>
              <div class="content-list new-scroll">
                <div class="content-row" v-for="(item,index) in jobArr" :key="index">
                  <span :title="item.name">{{item.name}}</span>
                  <span :title="item.start_time">{{item.start_time}}</span>
                  <span :title="item.end_time">{{item.end_time}}</span>
                  <span :title="item.employee_name_array" :class="{'my-many':false}">{{item.employee_name_array}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="wait-order">
            <div class="title">
              <span class="title-text">待处理订单</span>
              <span class="btn word-hover" @click="toOrder">订单管理 ></span>
            </div>
            <div class="content-box">
              <div class="content-head">
                <span>名称</span>
                <span>下单时间</span>
                <span>金额</span>
                <span>状态</span>
              </div>
              <div class="content-list new-scroll">
                <div class="content-row" v-for="(item,index) in orderArr" :key="index">
                  <span :title="item.name">{{item.name}}</span>
                  <span :title="timeFormat(item.create_time)">{{timeFormat(item.create_time)}}</span>
                  <span :title="item.price">￥{{item.price}}</span>
                  <span :title="item.pay_status|payStatusFilter">{{item.pay_status|payStatusFilter}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="part-right">
        <div class="title">
          <span>团队动态</span>
          <span class="word-hover" @click="toStaff">团队管理 ></span>
        </div>
        <div class="menber-list new-scroll">
          <div class="menber-row" v-for="(item,index) in accountArr" :key="index">
            <div class="avatar" v-if="item.pic">
              <img :src="$qiniuHost+item.pic" alt="">
            </div>
            <div class="avatar" v-else>
              <img :src="util.StringAvatar" alt="">
            </div>
            <span class="name">{{item.nick}}</span>
            <span class="login-time">最近登录{{timeFormat(item.land_time)}}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Bread from 'ServeComponents/Breadcrumb/index'
import Echarts from '../../components/DrawEchart/index'
import {work} from '@config/api.js'
import { mapGetters } from "vuex";
import clipper from 'ServeComponents/photoClipper'


  export default {
    data(){
      return{
        categoryArr:[
          {
            url:'',
            label:'访客',
            value:'0',
            unit:'人'
          },
          {
            url:'',
            label:'入账',
            value:'¥0',
            unit:'元'
          },
          {
            url:'',
            label:'订单',
            value:'0',
            unit:'条'
          }
        ],
        options:{},
        homeTip:{
          last_ip:0,
          last_pv:0
        },
        jobArr:[],
        orderArr:[],
        accountArr:[],
        isAll:'0',
        curIndex:0
      }
    },
    components:{
      Bread,
      Echarts,
      clipper
    },
    created(){
      this.getHomeTip()
      this.getHomeType(1,this.categoryArr[0])
      this.getPendOrder()
      this.getPendJob(this.isAll)
      this.getAccount()
    },
    computed: {
      ...mapGetters(["user_data"])
    },
    methods:{
      selectOwnAll(){
        this.getPendJob(this.isAll)
      },
      toStaff(){
        this.$router.push('/serve/employee_set/employee_set')
      },
      toOrder(){
        this.$router.push('/serve/order/order')
      },
      toWorkList(){
        this.$router.push('/serve/work/worklist')
      },
      getHomeTip(){
        this.getRequest(work.homeTip).then(res=>{
          this.homeTip=res
          this.categoryArr[0].value=this.homeTip.week_visit
          this.categoryArr[1].value=this.homeTip.week_finance
          // this.categoryArr[2].value=this.homeTip.score
          this.categoryArr[2].value=this.homeTip.week_order
        }).catch(err=>{
          console.error(err)
        })
      },
      getHomeType(type,item){
        this.getRequest(work.homeType,{
          type
        }).then(res=>{
          this.options={
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
                    formatter: '{value} '+ item.unit
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
              series: [{
                  data: res.data,
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
        }).catch(err=>{
        })
      },
      getPendOrder(){
        this.getRequest(work.pendOrder).then(res=>{
          this.orderArr=res
        }).catch(err=>{
          console.error(err)
        })
      },
      getPendJob(is_all){
        this.getRequest(work.pendJob,{
          is_all
        }).then(res=>{
          this.jobArr=res
        }).catch(err=>{
          console.error(err)
        })
      },
      getAccount(){
        this.getRequest(work.account).then(res=>{
          this.accountArr=res
        }).catch(err=>{
          console.error(err)
        })
      },
      selectCategory(i,item){
        this.curIndex=i
        if(i==0){
          this.getHomeType(1,item)
        }else if(i==1){
          this.getHomeType(2,item)
        }else if(i==2){
          this.getHomeType(3,item)
        }
      },
      timeFormat(timestamp){
				var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
				var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
				return Y+M+D+h+m+s;
      },
      dealOrderStatus(val){
        switch(val){
          case '0':
            return '关闭'
            break
          case '1':
            return '未支付'
            break
          case '2':
            return '已支付'
            break
          case '3':
            return '商家已确认'
            break
          case '4':
            return '退款中'
            break
          case '5':
            return '已退款'
            break
          case '6':
            return '进行中'
            break
          case '7':
            return '等待评论'
            break
          case '8':
            return '评论结束'
            break        
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  // padding: 0 20px;
  // box-sizing: border-box;
  font-family:PingFangSC-Semibold,PingFang SC;
  header{
    padding:0 99px 0 20px;
    box-sizing: border-box;
    height: 135px;
    background: #fff;
    display: flex;
    margin-bottom: 20px;
    .header-left{
      margin-right: auto;
      // padding-top: 10px;
      box-sizing: border-box;
      .info{
        display: flex;
        align-items: center;
        margin-top: 6px;
        .avatar{
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-right: 20px;
          overflow: hidden;
    	  display: flex;
          img{
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }
        }
        .welcome-occupation{
          margin-right: auto;
          p:first-child{
            font-size: 20px;
            color: #333;
            font-weight: 600;
            margin-bottom: 4px;
          }
          p:last-child{
            font-size: 13px;
            color: #999;
          }
        }
      }
    }
    .pv,.ip{
      align-self: center;
      p:first-child{
        color: #999;
      }
      p:last-child{
        font-size: 20px;
        color: #333;
        font-weight: 600;
      }
    }
    .pv{
      margin-right: 30px;
    }
  }
  .category-wrap{
    display: flex;
    height: 120px;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 10px;
    .category{
      padding: 0 20px;
      box-sizing: border-box;
      width: calc((100% - 20px)/3);
      height: 100%;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &:not(:last-child){
        margin-right: 10px;
      }
      .category-icon{
        width: 70px;
        height: 70px;
        .item-icon{
          width: 70px;
          height: 70px;
        }
      }
      .label-value{
        text-align: right;
        display: flex;
        flex-direction: column;
        .label{
          font-size: 20px;
          color: #999;
          margin-bottom: 4px
        }
        .category-value{
          span:first-child{
            font-size: 20px;
            color: #333;
          }
          span:last-child{
            font-size: 11px;
            color: #999;
          }
        }
      }
    }
    .selected{
      box-shadow: 0 0 8px #ccc;
    }
  }
  .main-part{
    display: flex;
    padding: 0 20px 22px;
    box-sizing: border-box;
    height: 850px;
    .part-left{
      width: 96%;
      width: calc((100% - 10px)*0.752);
      height: 100%;
      margin-right: 10px;
      .chart{
        height: 360px;
        background: #fff;
        margin-bottom: 10px;
      }
      .wait-part{
        height: calc(100% - 370px);
        display: flex;
        .wait-thing,.wait-order{
          width: calc((100% - 10px)/2);
          height: 100%;
          background: #fff;
          .title{
            height: 48px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #FAFAFA;
            padding: 0 20px 0 10px;
            box-sizing: border-box;
            color: #999;
            .title-text{
              font-size: 20px;
              margin-right: 30px;
            }
            .el-checkbox{
              margin-right: 28px;
              /deep/ {
                .el-checkbox__label{
                  color: #999;
                }
                .el-checkbox__inner{
                  border-color: #00A4FF;
                }
              }
            }
            .btn{
              margin-left: auto;
              cursor: pointer;
            }
          }
          .content-box{
            height: calc(100% - 48px);
            .content-head{
              padding: 0 20px;
              color: #666;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: 600;
              height: 60px;
              span{
                width: 100px;
                text-align: center;
                &:first-child{
                  text-align: left;
                }
                &:last-child{
                  text-align: right;
                }
              }
            }
            .content-list{
              color: #333;
              height: calc(100% - 60px);
              overflow-y: auto;
              .content-row{
                width: calc(100% - 34px);
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #FAFAFA;
                margin-left: 20px;
                span{
                  font-size: 12px;
                  width: 300px;
                  text-align: center;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  padding: 0 5px;
                  &:first-child{
                    text-align: left;
                    padding-left: 0;
                  }
                  &:last-child{
                    text-align: right;
                  }
                }
                .my-many{
                  border-radius:2px;
                  border: 1px solid #7C6AFF;
                  font-size: 11px;
                  padding: 5px 7px;
                  box-sizing: border-box;
                  color: #7C6AFF;
                }
              }
            }
          }
        }
        .wait-thing{
          margin-right: 10px;
        }
        .wait-order{
          .content-list{
            .content-row{
              span{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0 5px;
              }
              span:last-child{
                color: #FF4949;
              }
            }
          }
        }
      }
    }
    .part-right{
      flex: 1;
      height: 100%;
      background: #fff;
      .title{
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #FAFAFA;
        padding: 0 10px;
        box-sizing: border-box;
        color: #999;
        span:first-child{
          font-size: 20px;
        }
        span:last-child{
          cursor: pointer;
        }
      }
      .menber-list{
        height: calc(100% - 48px);
        overflow-y: auto;
        .menber-row{
          height: 80px;
          width: calc(100% - 34px);
          margin-left: 20px;
          display: flex;
          align-items: center;
          .avatar{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 12px;
            // border: 1px solid #aaa;
            img{
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
          .name{
            color: #333;
            margin-right: 10px;
            width: 100px;
          }
          .status{
            color: #333;
          }
          .off{
            color: #999;
          }
          .login-time{
            margin-left: auto;
            font-size: 11px;
            color: #999;
          }
        }
        .menber-row + .menber-row{
          border-top: 1px solid #FAFAFA;
        }
      }
    }
  }
}
</style>
