<template>
  <div>
    <AnalysisHead :type="3" 
    @selectTab="selectTab" 
    @handleFresh="handleFresh" 
    @selectTime="selectTime"
    @selectTimeRange="selectTimeRange"
    @clickPurpleBtn="clickPurpleBtn"
    @clickSearch="clickSearch"
    @clickAttr="clickAttr">
    </AnalysisHead>
  </div>
</template>

<script>
import AnalysisHead from '../../components/AnalysisHead/index'
  export default {
    data(){
      return{

      }
    },
    methods:{
      // 选择器材或者影棚
      selectTab(){
      },
      // 刷新
      handleFresh(){
      },
      // 点击昨日今日上周...
      selectTime(){
      },
      // 选择日期范围
      selectTimeRange(){
      },
      // 查看列表
      clickPurpleBtn(){
      },
      // 查找
      clickSearch(){
      },
      // 点击租借次数，成交
      clickAttr(){
      }
    },
    components:{
      AnalysisHead
    }
  }
</script>

<style lang="scss" scoped>

</style>