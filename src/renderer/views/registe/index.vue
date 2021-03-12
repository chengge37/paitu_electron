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
			<step></step>

			<!-- 注册模块 -->
			<div class='registe'>
				<el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
					<el-form-item label="公司名称" prop="company">
						<el-input v-model="ruleForm.company" placeholder="请输入公司名称（请输入2到255个字符）"></el-input>
					</el-form-item>
					<el-form-item label="输入手机" prop="phone">
						<el-input v-model="ruleForm.phone" placeholder="请输入手机（10位数字以上）"></el-input>
					</el-form-item>
					<el-form-item label="商家姓名" prop="name">
						<el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="tel">
						<el-input v-model="ruleForm.tel" placeholder="请输入联系电话"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="idCard">
						<el-input v-model="ruleForm.idCard" placeholder="请输入身份证号码"></el-input>
					</el-form-item>
					<el-form-item label="办公地址" prop="address">
						<el-input v-model="ruleForm.address" placeholder="请输入详细办公地址"></el-input>
					</el-form-item>
					<el-form-item label="设置密码" prop="pass">
						<el-input v-model="ruleForm.pass" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item label="确定密码" prop="checkPass">
						<el-input v-model="ruleForm.checkPass" placeholder="请再次输入密码"></el-input>
					</el-form-item>
					
				</el-form>
				<!--用户同意模块-->
				<div class="read">
					<el-checkbox v-model="isRead">同意</el-checkbox>
					<span>《平台的相关协议》</span>
				</div>

				<div class="save">
					<el-button class="save_btn" @click="save('ruleForm')">保存</el-button>
				</div>
			</div>

		</el-card>

	</div>
</template>

<script>
	import Step from '../FrontPage/Step/index.vue'
	export default {
		data() {
			//	验证输入的两次密码是否一致
			var validatePass = (rule, value, callback) => {
				console.log('validataPass-----');
				if(value === '') {
					callback(new Error('密码为6-12位字符和数字组合'));
				} else {
					if(this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};

			return {
				isRead: false,
				ruleForm: {
					name: '',
					tel: '',
					idCard: '',
					address: '',
					pass: '',
					checkPass: '',
					company:'',
					phone:''
				},
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					company:[
						{ required: true, message: '请输入公司名称', trigger: 'blur' },
						{ min: 2, max: 255, message: '长度在 2 到 255个字符', trigger: 'blur' }
					],
					phone:[{
						validator:this.validate.validatePhone,
						trigger:'blur'
					}]
				}
			}
		},

		components: {
			Step
		},

		mounted() {console.log('this.validate---',this.validate);},

		methods: {
			// 点击返回
			back() {
				history.back()
			},
			//保存方法
			save(ruleForm) {
				//路由跳转
				this.$router.push({
					path: "/registe_set/upload"
				});
				this.$refs[ruleForm].validate((valid) => {
					if(valid) {
						alert('submit!');
						console.log('可以提交');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	/*头部*/
	
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
	/*主体卡片*/
	
	.main {
		height: 730px;
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
		/*注册模块*/
		.registe {
			width: 33%;
			margin: 0px auto;
		}
		/deep/ {
			.el-form-item__error {
				color: #E9B53B;
			}
			.el-form-item.is-error .el-input__inner {
				border-color: #E9B53B;
			}
		}
		.read {
			padding: 15px 0px 20px 10px;
			.el-checkbox {
				margin-right: 0px;
			}
			span {
				color: #3A7F9F;
				cursor: pointer;
			}
		}
		.save {
			.save_btn {
				width: 100%;
				background: #3A7F9F;
				color: #fff;
			}
		}
	}
</style>