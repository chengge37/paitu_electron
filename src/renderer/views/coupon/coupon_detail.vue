<template>
	<div class="newServe">


		<el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline="false">
			<div class="card-set card">
				<div class="info-set">
					<div class="info-icon"></div>
					<div class="info-title">优惠券信息</div>
				</div>
				<!--优惠券添加图片模块-->
				<!--<el-row>
					<el-col :span="11" class="short-input">
						<el-form-item label="图片：">
							<upload-img @handleSuccess="handleSuccess" :imageUrl="form.img"></upload-img>
						</el-form-item>
					</el-col>
				</el-row>-->
				<el-row>
					<el-col :span="11">
						<el-form-item label="标题：" prop="title">
							<el-input v-model="form.title" placeholder="请输入优惠券标题"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="使用规则：" prop="content">
							<el-input v-model="form.content" placeholder="优惠券使用规则(不少于6个字)"></el-input>
							<!--<el-input v-model="form.content"type="textarea" :autosize="{ minRows: 2}" show-word-limit 
								maxlength="1000" placeholder="此处的内容用于简略描述您的活动内容(不少于6个字)" prop="brief">
							</el-input>-->
							<!--<div class="textare">-->
					          <!--<tinymce v-model="form.content" :height="100" />-->
					        <!--</div>-->
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="类型：" prop="coupon_type">
							<el-radio-group v-model="form.coupon_type">
								<el-radio label="1">代金券</el-radio>
								<!-- <el-radio label="2" disabled="true">折扣券</el-radio> -->
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item v-if="form.coupon_type==1" label="代金券金额：" prop="money">
							<el-input v-model="form.money" placeholder="请输入代金券金额"></el-input>
						</el-form-item>
						<el-form-item v-if="form.coupon_type==2" label="折扣：" prop="money">
							<el-input v-model="form.money" placeholder="请输入折扣（如8.8折就输入88）"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="使用门槛：" prop="limit_money">
							<el-input v-model="form.limit_money" placeholder="请输入使用门槛（0为通用）"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="使用时间：" prop="time" v-if="type==0">
							<el-date-picker v-if="updateTime" @change="changeTime" v-model="form.time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="使用时间：" prop="time" v-if="type==1">
							<el-date-picker v-if="updateTime" @input="inputDatePick" v-model="form.time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="发放数量：" prop="count">
							<el-input v-model.number="form.count" placeholder="请输入发放数量（正整数）"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="每人限领：" prop="limit_count">
							<el-input-number v-model="form.limit_count" :min="1" label="描述文字"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="是否推荐：" prop="recommend">
							<el-radio-group v-model="form.recommend">
								<el-radio label="1">推荐</el-radio>
								<el-radio label="0">不推荐</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-form-item label="全店通用：" prop="is_all">
							<el-radio-group v-model="form.is_all">
								<el-radio label="1">通用</el-radio>
								<el-radio label="0">不通用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="11">
						<el-form-item label="是否展示：" prop="is_show">
							<el-radio-group v-model="form.is_show">
								<el-radio label="0">展示</el-radio>
								<el-radio label="1">隐藏</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>

			</div>
		</el-form>

		<div class="bottomBtn">
			<el-button type="primary" class="color-area" @click="addCoupon" v-if="type==0" v-permission>添加</el-button>
	      	<el-button type="primary" class="color-area" @click="updateCoupon" v-if="type==1" v-permission>修改</el-button>
	      	<el-button @click="back">返回</el-button>
	   </div>
		
	</div>
</template>

<script>
	import Tinymce from "ServeComponents/Tinymce";
	import { mapGetters } from "vuex";
	import uploadImg from "ServeComponents/UploadImg";
	export default {
		data: () => ({
			form:{
				img:'',  //优惠券图片
				title:'', //标题
				content:'',  //优惠券信息
				type:'0',   //类型 0/新增 1/修改
				obj_id:'0',  //影棚或者设备id
				coupon_type:'1',   //优惠券类型 1/代金券 2/折扣券
				money:'',   //优惠券/可以减多少钱（几元代金券）   折扣券/如88折，传88
				limit_money:'',   //满多少钱使用
				st_time:'', //开始时间
				end_time:'', //结束时间
				count:'',   //发放数量
				limit_count:'1', //限制领取数量 传0为不限
				recommend:'1',  //是否推荐 1/推荐 0/不推荐
				is_all:'1',  //是否全店通用 1/是 0/否
				is_show:'0',  //是否展示  0/展示 1/隐藏
				time:[],   //开始结束时间，临时变量
			},
			rules: {
		        title: [
		          { required: true, message: "请输入标题", trigger: "blur" },
		          { min: 6, max: 1024, message: "长度在 6 到 1024个字符", trigger: "blur" }
		        ],
		        content: [
		          { required: true, message: "请输入内容", trigger: "blur" },
		          { min: 6, max: 1024, message: "长度在 6 到 1024个字符", trigger: "blur" }
		        ],
		        money: [
		          { required: true, message: "请输入内容", trigger: "blur" },
		        ],
		        limit_money: [
		          { required: true, message: "请输入内容", trigger: "blur" },
		        ],
		        count: [
		          { required: true, message: "请输入内容", trigger: "blur" },
		        ],
		        time: [
		          { required: true, message: "请输入内容", trigger: "blur" },
		        ]
		    },
			updateTime:true,  //是否显示时间组件
			type:0,  //默认是添加，如果是修改值为1
		}),

		computed: {
			...mapGetters(["user_data"])
		},
		components: { uploadImg,Tinymce },

		created() {
			console.log('this.$route------',this.$route);
			if (JSON.stringify(this.$route.query)!='{}') {
				let id=this.$route.query.id;
				this.getCouponById(id);
				this.type=1;
			}
		},
		mounted() {
			console.log('this.user_data-----',this.user_data);
		},

		methods: {
			//根据商家id获取优惠券详情
			getCouponById(id){
				this.util.getCouponById(id).then(res=>{
					this.form=res;
					//如果有时间，为form添加time变量绑定时间
					if(res.st_time){
						this.form.time=[];
						this.form.time.push(res.st_time,res.end_time);
					}
					console.log('getCouponById------',res);
					console.log('getCouponById------',this.form);
				})
			},
			//返回方法
			back(){
				this.util.back(this);
			},
			//添加优惠券方法
			addCoupon(){
				this.util.checkForm(this).then(res=>{
					if(res){
						if(this.form.time){
							this.form.st_time=this.form.time[0];
							this.form.end_time=this.form.time[1];
						}
						console.log('addCoupon--------',this.form);
						this.util.addCoupon(this.form).then(res=>{
							this.$message.success('添加优惠券成功！');
							this.back();
						})
					}
				}).catch(error=>{});
			},
			
			//修改优惠券
			updateCoupon(){
				console.log('updateCoupon---------');
				if(this.form.time){
					this.form.st_time=this.form.time[0];
					this.form.end_time=this.form.time[1];
				}
				this.util.updateCoupon(this.form).then(res=>{
					this.$message.success('修改成功！');
					this.back();
				})
			},
			//图片上传成功回调方法
			handleSuccess(key){
				console.log('------handleSuccess-------',key);
				this.form.img=key;
			},
			//改变使用时间方法
			changeTime(val){
				console.log('changeTime-------',val,this.form.time);
			},
			//input形式修改时间方法
			inputDatePick(e) {
				console.log('inputDatePick----------',e);
				this.updateTime=false;
			    this.$nextTick(() => {
					this.updateTime=true;
			        this.$set(this.form,"time",e);
			    });
			    console.log('this.form-----',this.form);
			},
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	.top-nav {
		.top-seach {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			.seach-box {
				margin-left: 25px;
				display: flex;
				.seach {
					display: flex;
					height: 38px;
					align-items: center;
					border: 1px solid #dcdfe6;
					border-radius: 2px 0 0 2px;
					background-color: #fff;
					.icon {
						width: 14px;
						height: 14px;
						margin: 12px 5px 12px 5px;
					}
					.seach-input {
						border: none;
						outline: medium;
						background-color: #ffffff;
						height: 30px;
						font-size: 14px;
					}
				}
				.seach-button {
					width: 54px;
					height: 38px;
					line-height: 38px;
					background-color: #3a7f9f;
					text-align: center;
					color: #fff;
					border-radius: 0px 2px 2px 0px;
					cursor: pointer;
				}
				.seach-button:active {
					background-color: #2c637c;
				}
			}
		}
	}
	
	.page {
		margin-top: 30px;
	}
	
	.table-control {
		.adduse /deep/ .el-button.is-round {
			background-color: #e9b53b;
		}
		.adduse /deep/ .el-button.is-round:active {
			background-color: #c59931;
			border-color: #c59931;
		}
		.adduse /deep/ .el-button.is-round:focus {
			border-color: rgba(197, 153, 49, 0.2);
		}
		.state-box /deep/ .el-button.is-round {
			background-color: #3a7f9f;
		}
		.state-box /deep/ .el-button.is-round:active {
			background-color: #2d6985;
		}
	}
	
	.table-control /deep/ .el-button.is-round {
		padding: 8px 22px;
		color: #ffffff;
	}
	
	.bottom-button{
		margin-top:20px;
	}
	.card{
	padding:20px 30px;
	background:#fff;
	margin-bottom:20px;
	.headTitle{
		font-size:20px;
		color:#333;
		padding-bottom:20px;
		border-bottom:1px solid #F0F0F0;
	}
}
/deep/{
	.el-input-number{
		width:230px;
		.el-input__inner{
			height:40px!important;
		}
	}
	.el-form-item__content{
		line-height:40px;
	}
}
</style>