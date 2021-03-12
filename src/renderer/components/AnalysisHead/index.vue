<template>
  <div class="head-wrap">
    <header class="first-row" v-show="crumbsShow">
      <span>数据分析</span>
      <span>-</span>
      <span>{{bread}}</span>
    </header>
    <div class="second-row" v-if="type!=1 && navShow">
      <div class="equip-studio-tab">
        <div @click="selectTab(index)"  :class="{active:item.check}" class="tab-item" v-for="(item,index) in tabArr" :key="index">
          <span>{{item.text}}</span>
          <span>数据</span>
        </div>
      </div>
      <div class="fresh-btn" @click="handleFresh">
        <i class="el-icon-refresh-right"></i>
      </div>
    </div>
    <div class="third-row">
      <div class="time-btn">
        <span @click="selectTime({index:index,type:item.type})" :class="{'btn-active':timeCurrent == index}" v-for="(item,index) in timeArr" :key="index">{{item.text}}</span>
      </div>
      <div class="time-range" v-show="timeShow">
        <span>日期筛选：</span>
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          @change="selectTimeRange"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div @click="clickPurpleBtn" class="purple-btn" v-if="type!=1 && showList">
        <span>{{dataType ?'查看图表':'查看列表'}}</span>
      </div>
      <div class="search" v-if="type!=1 && searchShow">
        <input type="text" placeholder="输入器材名称筛选">
        <div @click="clickSearch">
            <ali-svg-icon icon-class="search-border-copy" class="search-border-copy"></ali-svg-icon>
        </div>
      </div>
      <div @click="handleFresh" class="fresh-btn">
        <i class="el-icon-refresh-right"></i>
      </div>
    </div>
    <div class="fouth-row" v-if="type == 3 && !dataType">
      <span @click="clickAttr(index)" v-for="(item,index) in attrArr" :key="index" :class="{active:item.checked}">{{item.text}}</span>
    </div>
  </div>
</template>

<script>

  export default {
    data(){
      return{
        tabArr:[
          {
            text:'器材',
            check:true
          },
          {
            text:'影棚',
            check:false
          }
        ],
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
        attrArr:[
          {
            text:'租借次数',
            checked:false
          },
          {
            text:'成交率',
            checked:false
          },
          {
            text:'销售额',
            checked:false
          },
          {
            text:'租借时长',
            checked:false
          }
        ],
        timeRange:''
      }
    },
    props:{
      type:{
        type:Number,
        default:3
      },
      crumbsShow:{
        type:Boolean,
        default:true
      },
      searchShow:{
        type:Boolean,
        default:true
      },
      navShow:{
        type:Boolean,
        default:true
      },
      timeShow:{
        type:Boolean,
        default:true
      },
      timeCurrent:{
        type:Number,
        default:1        
      },
      bread:{
        type:String,
        default:''
      },
      showList:{
        type:Boolean,
        default:false
      },
      dataType:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      selectTab(i){
        this.tabArr.forEach(item=>{
          item.check=false
        })
        this.tabArr[i].check=true
        this.$emit('selectTab')
      },
      handleFresh(){
        this.$emit('handleFresh')
      },
      selectTime(data){
        // this.timeArr.forEach(item=>{
        //   item.checked=false
        // })
        // this.timeArr[i].checked=true
        this.timeRange = ""
        this.$emit('selectTime',data)
      },
      selectTimeRange(event){
        this.$emit('selectTimeRange',event)
      },
      clickPurpleBtn(){
        this.$emit('clickPurpleBtn',this.dataType)
      },
      clickSearch(){
        this.$emit('clickSearch')
      },
      clickAttr(i){
        this.attrArr.forEach(item=>{
          item.checked=false
        })
        this.attrArr[i].checked=true
        this.$emit('clickAttr',i)
      }
    },
    mounted(){
      console.log(this.crumbsShow)
    },
    watch: {
      timeCurrent(val){
        if(val == 1){
          this.timeRange = ""
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
.head-wrap{
  margin-bottom: 24px;
  header{
    margin-bottom: 30px;
    span:first-child{
      color: #999;
    }
    span:last-child{
      color: #4E475C;
    }
  }
  .second-row{
    display: flex;
    margin-bottom: 15px;
    .equip-studio-tab{
      display: flex;
      font-size: 20px;
      margin-right: auto;
      .tab-item{
        display: flex;
        opacity: 0.5;
        cursor: pointer;
        &:first-child{
          margin-right: 20px;
        }
      }
      .active{
        opacity: 1;
        span:first-child{
          border-bottom: 2px solid #7C6AFF;
        }
      }
    }
    .fresh-btn{
      width:34px;
      height:34px;
      background:rgb(255,255,255);
      border:1px solid rgb(240,240,240);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i{
        font-size: 20px;
        color: #999;
      }
    }
  }
  .third-row{
    display: flex;
    margin-bottom: 10px;
      .time-btn{
        display: flex;
        margin-right: 20px;
        color: #867E9D;
        span{
          vertical-align: bottom;
          width: 48px;
          height: 35px;
          line-height: 35px;
          border:1px solid rgb(235,235,235);
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          transition: all .3s;
        }
        span+span{
          border-left: none;
          flex-shrink: 0;
        }
        .btn-active{
          background: #7C6AFF;
          color: #f0f0f0;
        }
      }
      .time-range{
        margin-right:20px;
        flex-shrink: 0;
        &>span{
          color: #4E475C;
        }
        /deep/ {
          .el-range-separator{
            padding: 0;
          }
        }
      }
      .purple-btn{
        width: 92px;
        height: 34px;
        background: #7C6AFF;
        color: #fff;
        border-radius: 16px;
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: auto;
        flex-shrink: 0;
        cursor: pointer;
        & > span{
          font-size: 12px;
        }
        
      }
      .search{
        width: 225px;
        height: 34px;
        display: flex;
        align-self: center;
        input{
          flex: 1;
          border: 1px solid #D9D9D9;
          text-indent: 13px;
          outline: none;
        }
        & > div{
          width: 34px;
          height: 34px;
          background: #7C6AFF;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          .search-border-copy{
            width: 20px;
            height: 20px;
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
        margin-left: auto;
        cursor: pointer;
        flex-shrink: 0;
        i{
          font-size: 18px;
        }
      }
  }
  .fouth-row{
    display: flex;
    span{
      padding: 7px 10px;
      box-sizing: border-box;
      background: #fff;
      color: #867E9D;
      border: 1px solid #EBEBEB;
      cursor: pointer;
      transition: all .3s;
    }
    span+span{
      border-left: none;
    }
    .active{
      background: #7C6AFF;
      color: #F0F0F0;
    }
  }
}
</style>