<template>
	<!-- 步骤条 -->
	<div class="step">
		<ul>
			<li :class='{on:number>=1}'>1、填写基本信息<b></b></li>
			<li :class='{on:number>=2}'><s></s>2、下载合同盖章上传<b></b></li>
			<li :class='{on:number>=3}'><s></s>3、审核<b class="last"></b></li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			number:{
				type:String,
				default:'1'
			}
		},
		created() {},
		data() {
			return {
				levelList: null
			}
		},
		methods: {

		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

/*步骤条*/
.step {
	width: 100%;
	height: 36px;
	color: #fff;
	overflow: hidden;
	margin-bottom: 40px;
	li {
		position: relative;
		width: 32.1%;
		float: left;
		height: 36px;
		line-height: 36px;
		margin-right: 1.2%;
		display: inline;
		color: #555;
		font-weight: 700;
		font-size: 14px;
		text-align: center;
		background: #F4F6FF;
		b {
			width: 0;
			height: 0;
			border: 18px solid #fff;
			border-left-color: #F4F6FF;
			font-size: 0;
			line-height: 0;
			position: absolute;
			top: 0;
			right: -22px;
		}
		s {
			width: 0;
			height: 0;
			border: 18px solid #F4F6FF;
			border-left-color: transparent;
			font-size: 0;
			line-height: 0;
			position: absolute;
			left: -24px;
			top: 0;
		}
	}
	.on {
		color: #fff;
		background: #3A7F9F;
		b {
			border-left-color: #3A7F9F;
		}
		s {
			border-color: #3A7F9F;
			border-left-color: transparent;
		}
	}
}

</style>