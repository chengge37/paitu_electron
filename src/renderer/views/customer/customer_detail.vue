<template>
	<div class="newServe">

		<div class="form-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
				<!--店铺信息-->
				<div class="card">
					<p class="headTitle">客户信息</p>

					<el-row :gutter="100">
						<el-col :span="6">
							<el-form-item label="客户名称" prop="name">
								<el-input v-model="form.name" :disabled="!canEdit" placeholder="请填写客户名称"></el-input>
							</el-form-item>
							<el-form-item label="联系电话" prop="mobile">
								<el-input v-model="form.mobile" :disabled="!canEdit" placeholder="请联系电话"></el-input>
							</el-form-item>
							<el-form-item label="服务次数" prop="served_times">
								<el-input v-model="form.served_times" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="10" class="short-input">
							<el-form-item label="客户生日" prop="birthday">
								<el-date-picker value-format="yyyy-MM-dd" v-model="form.birthday" type="date" placeholder="选择日期" :disabled="!canEdit"></el-date-picker>
							</el-form-item>
							<el-form-item label="电子邮箱" prop="email">
								<el-input v-model="form.email" :disabled="!canEdit"></el-input>
							</el-form-item>
							<el-form-item label="客户分组" prop="group_id">
								<el-select v-model="form.group_id" placeholder="请选择" :disabled="!canEdit">
									<el-option v-for="item in groupList" :key="item.group_id" :label="item.group_name" :value="item.group_id"></el-option>
								</el-select>
								<el-button type="text" @click="operate" v-permission>管理</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<div style="width:calc(100% + 300px)">
								<el-form-item label="家庭住址" class="long-input" prop="address">
									<el-input v-model="form.address" :disabled="!canEdit"></el-input>
								</el-form-item>
							</div>
						</el-col>

						<el-col>
							<el-form-item label="客户照片">
								<upload-img @handleSuccess="handleSuccess" :imageUrl="imageUrl" :editable="canEdit"></upload-img>
							</el-form-item>
						</el-col>
					</el-row>
					<!--</el-card>-->
				</div>

				<!--公司信息模块-->
				<div class="card">
					<p class="headTitle">公司信息</p>

					<el-row>
						<el-col :span="10" class="short-input">
							<el-form-item label="公司名称" prop="company">
								<el-input v-model="form.company" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="公司地址" style="width:calc(100% + 300px)" prop="company_address">
								<el-input v-model="form.company_address" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="10">
							<el-form-item label="客户备注" style="width:calc(100% + 300px)" prop="remark">
								<el-input type="textarea" v-model="form.remark" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<!--开票资料模块-->
				<div class="card">
					<p class="headTitle">店铺信息</p>

					<el-row>
						<el-col :span="6">
							<el-form-item label="发票抬头">
								<el-input v-model="form.receipte_title" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="纳税税号">
								<el-input v-model="form.tax_no" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40" class="detail">
						<el-col :span="6">
							<el-form-item label="开户行及账号">
								<el-input v-model="form.bank" :disabled="!canEdit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">
							<el-input v-model="form.bank_no" :disabled="!canEdit"></el-input>
						</el-col>
					</el-row>
				</div>
			</el-form>
		</div>
		
		<div class="bottomBtn">
			<el-button class="color-area" type="primary" v-if="status==2" @click="addCustomer">添加并退出</el-button>
			<el-button class="color-area" type="primary" v-if="status==1" @click="updateCustomer">修改</el-button>
			<el-button class="color-area" type="primary" v-if="status==0" @click="back">返回</el-button>
			<el-button class="color-area" type="default" v-if="status!=0" @click="back">取消</el-button>
		</div>

		<!--管理分组对话框模块-->
		<el-dialog title :visible.sync="groupDialog" width="30%">
			<div class="dialog_head">
				<div class="title">管理分组</div>
				<div>
					<el-button type="text" @click="checkout">添加分组</el-button>
				</div>
			</div>

			<el-form ref="form" :model="form" label-width="80px" :inline="false">
				<el-row :gutter="10">
					<el-col :span="12" class="short-input" v-for="(item,index) in groupList" :key="index">
						<el-form-item label="分组名称">
							<el-input v-model="item.group_name"></el-input>
							<i class="el-icon-delete" @click="delGroup(item.group_id)"></i>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<span slot="footer" class="dialog-footer">
        <div class="layout">
          <div class="bottomBtn">
          	<el-button type="primary" @click="updateGroup()">修 改</el-button>
            <el-button @click="dialog1Cancel()">取 消</el-button>
          </div>
        </div>
      </span>
		</el-dialog>

		<!--添加分组对话框模块-->
		<el-dialog :visible.sync="addDroupDialog" width="30%" title="添加分组">
			<!--<div class="dialog_head">
				<div class="title">添加分组</div>
			</div>-->

			<el-form ref="form" :model="form" label-width="80px" :inline="false">
				<el-row :gutter="0">
					<el-col :span="24" class="short-input">
						<el-form-item label="分组名称">
							<el-input v-model="addGroupName" placeholder="请输入分组名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<div class="bottomBtn">
					<el-button type="primary" class="add_btn" @click="addGroup">添加</el-button>
					<el-button type="default" @click="dialog2Cancel()">返 回</el-button>
				</div>
			</el-form>

		</el-dialog>
	</div>
</template>

<script>
	import { customer, customer_group } from "@config/api.js";
	import { checkPic } from "@util/picUtil.js";
	import uploadImg from "ServeComponents/UploadImg";
	import { storage } from "@util/storage.js";
	export default {
		//		data: () => ({  //和下面写法有什么区别？ this.validate不能用。。

		data() {
			return {
				title: "",
				canEdit: Boolean,
				addGroupName: "",
				status: Number,
				dialogImageUrl: false,
				groupDialog: false,
				addDroupDialog: false,
				dialogVisible: false,
				deferTime: 200,
				oldGroupList: [], //保存一份分组列表，之后好对比
				groupList: [],
				picPostData: {},
				imageUrl: "",
				form: {
					name: "",
					mobile: "",
					served_times: "",
					birthday: "",
					email: "",
					group_id: "",
					address: "",
					company: "",
					company_address: "",
					remark: "",
					receipt_title: "",
					tax_no: "",
					bank: "",
					bank_no: ""
				},
				rules: {
					name: [{
							required: true,
							message: "请输入姓名",
							trigger: "blur"
						},
						{
							min: 2,
							max: 8,
							message: "长度在 2 到 8个字符",
							trigger: "blur"
						}
					],
					mobile: [{
							required: true,
							message: "请输入手机",
							trigger: "blur"
						},
						{
							validator: this.validate.validatePhone,
							trigger: "blur"
						}
					],
					group_id: [{
						required: true,
						message: "请选择分组",
						trigger: "blur"
					}],
					address: [{
						min: 6,
						max: 128,
						message: "长度在 26到 128个字符",
						trigger: "blur"
					}],
					company: [{
						min: 2,
						max: 32,
						message: "长度在 2到 32个字符",
						trigger: "blur"
					}],
					company_address: [{
						min: 6,
						max: 128,
						message: "长度在 6到 128个字符",
						trigger: "blur"
					}],
					remark: [{
						min: 1,
						max: 512,
						message: "长度在 1到 512个字符",
						trigger: "blur"
					}],
					receipt_title: [{
						min: 1,
						max: 512,
						message: "长度在 1到 512个字符",
						trigger: "blur"
					}],
					tax_no: [{
						min: 6,
						max: 32,
						message: "长度在 6到 32个字符",
						trigger: "blur"
					}],
					bank: [{
						min: 6,
						max: 32,
						message: "长度在 6到 32个字符",
						trigger: "blur"
					}],
					bank: [{
						min: 6,
						max: 64,
						message: "长度在 6到 64个字符",
						trigger: "blur"
					}]
				}
			};
		},
		//		}),

		components: {
			uploadImg
		},

		created() {
			let status = parseInt(storage.get('active_data').status);
			let data = JSON.parse(decodeURIComponent(storage.get('active_data').data));
			this.status = status;
			console.log("data-----", data);
			//获取客户头像地址
			if(JSON.stringify(data) != "{}") {
				if(data.avatar) {
					this.imageUrl = this.config.qiniuHost + data.avatar;
				}
			}
			// 0为查看详情，1为修改，2为添加
			switch(status) {
				case 0:
					this.canEdit = false;
					this.title = "客户详情";
					this.form = data;
					break;
				case 1:
					this.canEdit = true;
					this.title = "客户修改";
					this.form = data;
					break;
				case 2:
					this.canEdit = true;
					this.title = "添加客户";
					this.form = {};
					break;
				default:
					break;
			}
		},
		mounted() {
			this.getCustomerGroupList();
		},
		methods: {
			checkout() {
				this.groupDialog = false;
				setTimeout(() => {
					this.addDroupDialog = true;
				}, this.deferTime);
			},
			back() {
				this.$router.go(-1);
			},
			dialog1Cancel() {
				this.groupDialog = false;
			},
			dialog2Cancel() {
				this.addDroupDialog = false;
				setTimeout(() => {
					this.groupDialog = true;
				}, this.deferTime);
			},
			//管理分组方法
			operate() {
				this.groupDialog = true;
				this.getCustomerGroupList();
			},
			//获取分组管理列表
			getCustomerGroupList() {
				this.getRequest(customer_group.getAll)
					.then(res => {
						console.log("res", res);
						this.groupList = res;
						//深度复制一份分组列表
						this.oldGroupList = this.util.deepcopy(res);
					})
					.catch(err => {});
			},
			//添加分组方法
			addGroup() {
				if(!this.addGroupName){
					this.$message.warning('请填写分组名称！');
					return;
				} 
				let params = {
					group_array: [{
						group_name: this.addGroupName
					}]
				};
				this.postRequest(customer_group.operate, params)
					.then(res => {
						this.$message.success("添加分组成功！");
						this.addGroupName = "";
						//重新加载数据
						this.getCustomerGroupList();
					})
					.catch(e => {
						console.log("e----", e);
					});
			},
			//修改分组方法
			updateGroup() {
				//判断是否有修改的项
				let updateList = this.util.getDiff(this.groupList, this.oldGroupList);
				if(updateList.length == 0) {
					this.$message.warning("没有修改的项!");
					return;
				}
				let params = {
					group_array: updateList,
				};
				this.postRequest(customer_group.operate, params)
					.then(res => {
						this.$message.success("修改分组名称成功！");
						//重新加载数据
						this.getCustomerGroupList();
					})
					.catch(err => {});
			},
			//删除分组方法
			delGroup(id) {
				this.util.confirm(this).then(() => {
					let params = {
						id: id
					};
					this.postRequest(customer_group.del, params)
						.then(res => {
							this.$message.success("删除分组成功！");
							//重新加载数据
							this.getCustomerGroupList();
						})
						.catch(err => {});
				}).catch(err => {});
			},
			//添加客户方法
			addCustomer() {
				console.log("添加客户----", this.form);

				this.$refs["form"].validate(valid => {
					if(valid) {
						this.postRequest(customer.add, this.form)
							.then(res => {
								this.$message.success("添加客户成功！");
								this.$router.go(-1);
							})
							.catch(err => {});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			//修改客户方法
			updateCustomer() {
				console.log("updateCustomer-----", this.form);
				this.postRequest(customer.update, this.form)
					.then(res => {
						this.$message.success("修改客户信息成功！");
						this.util.back(this);
					})
					.catch(err => {});
			},
			//图片上传成功方法
			handleSuccess(key) {
				this.form.avatar = key;
			}
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	.card {
		padding: 20px 30px;
		background: #fff;
		margin-bottom: 20px;
		.headTitle {
			font-size: 20px;
			color: #333;
			padding-bottom: 20px;
			border-bottom: 1px solid #F0F0F0;
			margin-bottom: 20px;
		}
	}
	
	.top-nav {
		justify-content: space-between;
		.top-title {
			padding-bottom: 20px;
			padding-top: 35px;
			font-size: 20px;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			border-bottom: 4px solid $Theme-color;
		}
		.back {
			cursor: pointer;
			.back-one {
				margin-right: -26px;
			}
			.back-two {
				margin-right: 2px;
			}
		}
	}
	
	.line {
		margin-bottom: 15px;
		margin-top: 10px;
	}
	
	.textare {
		margin-left: 20px;
		margin-right: 20px;
	}
	
	.form-box {
		.people /deep/ .el-input {
			input::-webkit-outer-spin-button,
			input::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}
			input[type="number"] {
				-moz-appearance: textfield;
			}
		}
	}
	
	/deep/ .el-upload{
		width:100px;
		height:100px;
		border-radius:0px;
	}
	
	.detail /deep/ .el-form-item__label {
		line-height: 20px;
	}
	
	/deep/ .el-dialog__body {
		padding: 10px 1.3vw 1.3vw;
		.add_btn {
			border-radius: 4px;
			color: #fff;
			border: none;
		}
		.el-icon-delete {
			cursor: pointer;
		}
	}
	
	/deep/ .el-dialog__footer {
		padding-left: 42px;
		.layout {
			display: flex;
			justify-content: space-between;
		}
	}
	
	/deep/ .el-dialog__body .el-form-item__content {
		display: flex;
		align-items: center;
		.el-input {
			margin-right: 0.5vw;
		}
	}
	
	.dialog_head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3vh;
		.title {
			font-size: 20px;
		}
	}
</style>