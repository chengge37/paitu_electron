<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
//require('echarts/theme/macarons') // echarts theme
//import resize from './mixins/resize'

export default {
//mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    month: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '384px'
    },
    data:{
    	type:Object,
    	default: () => []
    }
  },
  data() {
    return {
      chart: null,
      colorList1:['#FA8A89','#F9BD5E','#FFAAA9','#FCAA8D'], //初始化颜色列表
      colorList2:['#3A9F90','#82ACBC','#B6E4C8','#3A889F','#96BE7C'],
      winWidth:0,  //浏览器宽度
    }
  },
  created(){
  	console.log('pieChart--------------');
  	if (window.innerWidth){
  		this.winWidth = window.innerWidth;
  	}else if ((document.body) && (document.body.clientWidth)){
  		this.winWidth = document.body.clientWidth;
  	}
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      
      let chartName= this.data['title'];
			let chartData= this.data['value'];
			let total=0;
			chartData.forEach((item,index)=>{
				total+=parseInt(item);
			})
			
			var data=[]
			var legendName=[]
			for (var i=0;i<chartData.length;i++){
					chartName[i]=' '+chartName[i]+' '; //加空格
			    var c={
			        value:chartData[i],
								name:chartName[i]+(parseFloat(chartData[i]/total)*100).toFixed(2)+'%'
			    }
			    data[i]=c;
			    legendName[i]=chartName[i]+(parseFloat(chartData[i]/total)*100).toFixed(2)+'%';
			}

			//选择颜色
			let colorList=this.data["type"]==1?this.colorList1:this.colorList2;
			
      this.chart.setOption({
      	title: {
		        text: '￥'+total,
		        subtext: this.month+'月',
						x:'69%',
						y:'45%',
        		textAlign:'center',
		        textStyle: {
		            fontSize: 25,
		            fontWeight: 'bold',
		            color: '#333333',
		        },
		        subtextStyle: {
		            color: "#333",
		            fontSize: 18,
		            fontWeight: 'normal'
		        }
		    },
        tooltip: {
          trigger: 'item',
//        formatter: '{a} <br/>{b} : {c} ({d}%)'
					fromatter:'<br/>{b} : {c} ({d}%)'
        },
        legend: {
		        orient: 'vertical',
		        x: this.winWidth>=1500?'20%':'5%',   //文字对应左边位置
		        y:'center',
		        itemWidth: 20,
		        itemHeight: 20,
		        align: 'left',
		        textStyle: {
		            fontSize:14,
		            color: '#000'
		        },
		        data: legendName
		    },
        series: [{
		        type: 'pie',
		        radius: ['45%', '70%'],
		        center: ['70%', '50%'],
						color:colorList,
		        data: data,
		        labelLine: {
		            normal: {
		                show: false,
		                length: 20,
		                length2: 20,
		                lineStyle: {
		                    color: '#12EABE',
		                    width: 2
		                }
		            }
		        },
		        label: {
		            normal: {
		                show:false,
		                formatter: '{c|{c}}\n{hr|}\n{d|{d}%}',
		                rich: {
		                    b: {
		                        fontSize: 20,
		                        color: '#12EABE',
		                        align: 'left',
		                        padding: 4
		                    },
		                    hr: {
		                        borderColor: '#12EABE',
		                        width: '100%',
		                        borderWidth: 2,
		                        height: 0
		                    },
		                    d: {
		                        fontSize: 20,
		                        color: '#fff',
		                        align: 'left',
		                        padding: 4
		                    },
		                    c: {
		                        fontSize: 20,
		                        color: '#fff',
		                        align: 'left',
		                        padding: 4
		                    }
		                }
		            }
		        }
		    }]
        
        
        
        
      })
    }
  }
}
</script>
