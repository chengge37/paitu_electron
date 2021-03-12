<!--  -->
<template>
	<div class="order-container">
		<!-- 头部 -->
		<header class="header">
			<div class="header_left">
				商家注册
			</div>
			<div class="back">
				<ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
				<ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
				<span @click="back">返回</span>
			</div>
		</header>

		<!-- 主体卡片 -->
		<el-card class="main">
			<!-- 步骤条 -->
			<step number='3'></step>
			
			<!-- 中间部分-->
			<div class='body'>
				<div class="icon">
					<!-- <img src="../../../../../assets/images/icon/sms/entry.png" alt=""> -->
				</div>
				<div class="content">
					<p>信息已提交，审核中</p>
					<p>审核结果我们会在3天内，以电话和邮件发方式通知您，感谢您的耐心等待!</p>
				</div>
				<div class="btn">
					<el-button>完成</el-button>
				</div>
			</div>
			
			
			
		</el-card>
		
		
		
	</div>
</template>

<script>
	import Step from '../FrontPage/Step/index.vue'
	export default {
		data() {
			return {
				isFinish: true,
			}
		},

		components: {Step},

		mounted() {},

		methods: {
			// 点击返回
			back() {
				history.back()
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	// 头部
	.header {
		height: 100px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 37px;
		border-bottom: 1px solid #eee;
		.header_left {
			line-height: 100px;
			border-bottom: 4px solid #3A7F9F;
			font-size: 20px;
			font-weight: bold;
		}
		.back {
			cursor: pointer;
			box-sizing: border-box;
			line-height: 103px;
			.back-one {
				margin-right: -26px;
			}
			.back-two {
				margin-right: 2px;
			}
			span {
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
	
	// 主体卡片
	.main {
		padding: 30px 59px 0;
		
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
					border: 18px solid #3A7F9F;
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
				s{
					border-color: #3A7F9F;
    				border-left-color: transparent;
				}
			}
		}
		/*中间模块*/
		.body{
			width:50%;
			margin:0px auto;
			display:flex;
			justify-content:center;
			flex-wrap:wrap;
			margin-top:9vh;
			.icon{
				display:flex;
				justify-content:center;
				align-items:center;
				width:217px;
				height:217px;
				background:#F4F6FF;
				border-radius:50%;
				img{
					width:87px;
					height:87px;
				}
			}
			.content{
				text-align:center;
				margin-top:25px;
				p{
					margin-bottom:20px;
					font-size:18px;
					color:#333;
				}
			}
			.btn{
				margin-bottom:18vh;
				margin-top:3vh;
				button{
					width:76px;
					height:42px;
					background:#3A7F9F;
					border-radius:5px;
					color:#fff;
				}
				
			}
		}
		
  }

</style>