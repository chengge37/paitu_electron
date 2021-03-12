<template>
	<div :class="className" :style="{height:height,width:width}" />
</template>

<script>
	import echarts from 'echarts'

	export default {
		props: {
			className: {
				type: String,
				default: 'chart'
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: '530px'
			},
			data:{
		    	type:Object,
		    	default: () => []
	    	}
		},
		data() {
			return {
				chart: null,
				xLine:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				color1:[246,72,55],
				color2:[58,127,159],
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initChart()
			})
		},
		beforeDestroy() {
			if(!this.chart) {
				return
			}
			this.chart.dispose()
			this.chart = null
		},
		methods: {
			initChart() {
				this.chart = echarts.init(this.$el, 'macarons');


				//x轴显示内容
				let xLine=this.data['xLine']?this.data['xLine']:this.xLine;
				let color=this.data['type']==1?this.color1:this.color2;
				let lineColor=`rgba(${color[0]},${color[1]},${color[2]},1)`;
				let areaColor=`rgba(${color[0]},${color[1]},${color[2]},0.3)`;
//				console.log('lineColor----',lineColor);

				this.chart.setOption({

					backgroundColor: '#fff',
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '5%',
						right: '5%',
						top:'15%',
						//bottom: '10%'
					},

					xAxis: {
						type: 'category',
						boundaryGap: false,
						axisTick: {
							show: false
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: 'rgba(0,0,0, 1)',
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								type:"dashed",
								color: '#EFEFEF',
							}
						},
							data:xLine
					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						splitNumber:6,
						axisLine: {
							show: true,
							lineStyle: {
								color: 'rgba(0,0,0, 1)',
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								type:"dashed",
								color: '#EFEFEF',
							}
						},
						axisLabel: {
							color: '#000',
							formatter: '{value}'
						}
					},
					series: [{
							symbol:'circle',
							showSymbol: false,
//							name: '年度支出',
							name:this.data['tipsTitle'],
							type: 'line',
							//是否显示平滑曲线
							smooth: true,
							itemStyle: {
								normal: {
//									color: '#F64837',  //线条颜色
									color:lineColor,
									borderWidth: 5
								},
							},
							lineStyle: {
								normal: {
									width: 1    //线条厚度
								}
							},
							areaStyle: {
								normal: {
									color: {
										type: 'linear',
										x: 0,
										y: 0,
										x2: 0,
										y2: 1,
										colorStops: [{
											offset: 0,
//											color: 'rgba(246,72,55, 0.3)', //区域块颜色
												color:areaColor,    
										}, {
											offset: 1,
											color: 'rgba(255,255,255, 0.1)',
										}],
										globalCoord: false
									},
								}
							},
//							data: [135, 124, 153, 148, 174, 150, 167, 136, 150, 123, 166, 173, 188],
								data:this.data['value']

						}

					]
					
					

				})
			}
		}
	}
</script>