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
			<step number='2'></step>
			
			<!-- 上传部分-->
			<div class='body'>
				<div class="pre">
					<p class="bold_title">合同范本</p>
					<div>
						<el-button type="text">预览</el-button>
						<el-button type="text">下载</el-button>
					</div>
				</div>
				<div class="model_content">
				</div>
				
				<div class="upload_content">
					<p class="title bold_title">上传文件</p>
					<p class="attention">注意：合同必须签名盖公章，对公账号和开票信息必须盖公章，否则视为无效，不能通过审核</p>
					<!--上传列表框-->
					<div class="upload">
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						  <p>上传合同</p>
						</el-upload>
						
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						  <p>上传对公账号</p>
						</el-upload>
						
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						  <p>上传开票信息</p>
						</el-upload>
					</div>
					
					<!--底部按钮模块-->
					<div class="bottom-button">
							<el-button type="default">上一步</el-button>
							<el-button type="primary" @click="submit">提交</el-button>
					</div>
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
				imageUrl:'',
			}
		},

		components: {Step},

		mounted() {},

		methods: {
			// 点击返回
			back() {
				history.back()
			},
			beforeAvatarUpload(){
				
			},
			handleAvatarSuccess(){
				
			},
			//提交方法
			submit(){
				this.$router.push({path:'/registe_set/vertify'});
			}
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
		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 35px;
			.title-left {
				flex: 1;
				font-size: 16px;
			}
			.title-right {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				div:first-child {
					margin-right: 40px;
					color: #3A7F9F;
				}
				div span {
					cursor: pointer;
				}
			}
		}
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
				s{
					border-color: #3A7F9F;
    				border-left-color: transparent;
				}
			}
		}
		/*注册模块*/
		.body{
			width:50%;
			margin:0px auto;
			.pre{
				display:flex;
				justify-content:space-between;
				align-items:center;
			}
			.model_content{
				height:216px;
				border:1px solid rgba(204,204,204,1);
			}
			.upload_content{
				p{
					margin-bottom:10px;
				}
				.title{
					margin-top:30px;
				}
				.attention{
					color:#E9B53B;
					font-size:12px;
					font-weight:normal;
				}
			}
			.upload{
				display:flex;
				justify-content:space-between;
				align-items:stretch;
			}
			.bold_title{
				font-weight:bold;
				font-size:14px;
			}
			.bottom-button{
				margin-top:38px;
				margin-bottom:50px;
			}
		}
		
  }
   
   /deep/{
   	.avatar-uploader{
   		width:32%
   	}
   	.avatar-uploader .el-upload {
   		border:1px solid #ccc;
	    border-radius:2px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	    width:100%;
	    height:10.7vw;
	    background:#eee;
	    p{
	    	position:relative;
	    	margin-top:-55px;
	    }
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    
	    line-height: 160px;
	    text-align: center;
	  }
   }
 
</style>