<template>
	<div>
		<div class="buy">
			<!--现有版本模块-->
			<div class="buy-info">
				<div class="info" v-if="productInfo">
					<div class="info-left have">
						<div class="info-title">
							<span>现有产品</span>
						</div>

						<div class="buy-type">
							<div class="buy-item">
								<div class="item-logo">
									<img :src="$qiniuHost+'images/productEdition_'+productInfo.pid+'.png'" width="48" height="48"/>
								</div>
								<div class="item-info">
									<div class="info-top">{{productInfo.name}}</div>
									<div class="info-bottom">
										 <p>剩余天数：{{productInfo.remindDay<0?'已过期':`${productInfo.remindDay}天`}}</p> 
										 <span>有效期：{{productInfo.startTime | strTime2Date}} ～{{productInfo.endTime | strTime2Date}}</span> 
									</div>
								</div>
								<div class="triangle"></div>
							</div>
						</div>
					</div>

					<!--版本功能模块-->
					<div class="info-right">
						<div class="acquire">已有功能</div>
						<div class='haveFun'>
							<div class="acquire-item" v-for="(item,index) in productInfo.funs" :key="index">
								<i class="el-icon-check"></i>
								<div class="acquire-txt">{{item}}</div>
							</div>
							<div class="acquire-item">
								<i class="el-icon-check"></i>
								 <div class="acquire-txt">
									有效时间：
									({{productInfo.startTime | strTime2Date}} ～{{productInfo.endTime | strTime2Date}})
								</div> 
							</div>
						</div>
					</div>
				</div>
				
			</div>

			<ul class="productList" v-if="loadHaveProduct">
				<!--购买或者升级产品模块-->
				<li class="buy-info renewContent" v-if="openType!=2">
					<div class="buy-title">*即日起可使用新权限</div>

					<div class="line"></div>

					<div class="info">
						<div class="info-left">
							<div class="info-title">
								<span>{{openType==0?'开通':'补充差价开通'}}</span>
								<span class="editionType">{{selectInfo.name}}</span>
							</div>

							<div class="buy-type">
								<div class="buy-item">
									<div class="item-logo">
										<img :src="$qiniuHost+'images/productEdition_'+selectInfo.id+'.png'" width="48" height="48" />
									</div>
									<div class="item-info">
										<div class="info-top">
											￥{{selectInfo.price}}元
											<!--<span v-if="selectId!=33">/{{chargeType==0?'月':'年'}}</span>-->
										</div>
										<div class="info-bottom">
											<span>原价</span>
											<s>{{selectInfo.price*2}}元</s>
											<span>，已经抵扣{{selectInfo.price}}元</span>
										</div>
									</div>
									<div class="triangle"></div>
								</div>
							</div>
						</div>

						<div class="info-right">
							<div class="acquire">功能</div>
							<div class='haveFun'>
								<div class="acquire-item" v-for="(subItem,index2) in selectInfo.funs" :key="index2">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">{{subItem}}</div>
								</div>
								<div class="acquire-item">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">
										使用时长：
										<span v-if="selectInfo.is_forever!=1" style="color:#333;">（{{timePeriod[0]}} ~ {{timePeriod[1]}}）</span>
										<span v-else style="color:#333;">永久有效</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>

				<!--立即续费模块-->
				<li class="buy-info renewContent" v-if="openType==2">
					<div class="buy-title">*即日起可使用新权限</div>

					<div class="line"></div>

					<div class="info">
						<div class="info-left">
							<div class="info-title">
								<span class="editionTitle">「{{productInfo.name}}」续费</span>
								<span class="editionType">1{{chargeType==0?'月':'年'}}</span>
							</div>

							<div class="time">
								<div class="content">
									<span>到期：</span>
									<p>{{overDate}}</p>
								</div>
							</div>

							<div class="buy-type">
								<div class="buy-item">
									<div class="item-logo">
										<img :src="$qiniuHost+'images/productEdition_'+productInfo.pid+'.png'" width="48" height="48" />
									</div>
									<div class="item-info">
										<div class="info-top">{{productInfo.name}}</div>
										<div class="info-bottom">
											<span>原价</span>
											<s>{{payPrice*2}}元</s>
										</div>
									</div>
									<div class="price">¥{{payPrice}}元/{{chargeType==0?'月':'年'}}</div>
									<div class="triangle"></div>
								</div>
							</div>
						</div>

						<!--版本功能模块-->
						<div class="info-right">
							<div class="acquire">功能</div>
							<div class="haveFun">
								<div class="acquire-item" v-for="(item,index) in productInfo.funs" :key="index">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">{{item}}</div>
								</div>
								<div class="acquire-item">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">
										使用时长： （{{timePeriod[0]}} ~ {{overDate}}）
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>

				<!--自定账号模块-->
				<li class="buy-info account" v-if="showAccount">
					<div class="buy-title">*自定义账号必须多于5个账号</div>

					<div class="line"></div>

					<div class="info">
						<div class="info-left">
							<div class="info-title">
								<span>请输入账号数量</span>
							</div>

							<el-input v-number :disabled="openType==2" v-model="accountNum" v-on:input="changeAccountNum" :placeholder="'请输入'+limitAccount+'或以上的正整数'"></el-input>
						</div>
					</div>
				</li>
			</ul>

			<div class="pay">
				<div class="money">
					付款金额：
					<span>{{payPrice}}元</span>
				</div>

				<div class="original">
					原价
					<s>{{payPrice*2}}</s> 元，已经抵扣{{payPrice}}元
				</div>
				<div v-if="productInfo && selectId!=33">
					<div class="pay-switch" v-if="productInfo.remindDay>=30 || selectId==23">
						<el-tooltip content="产品剩余天数大于30天只能按年付费或者该产品只能按年购买" placement="top" effect="light">
							<el-switch disabled="true" v-model="timeType" active-color="#999999" inactive-color="#FF9500" active-text="按年付费" inactive-text="按月付费"></el-switch>
						</el-tooltip>
					</div>
					<div class="pay-switch" v-else>
						<el-switch @change="changeTime" v-model="timeType" active-color="#999999" inactive-color="#FF9500" active-text="按年付费" inactive-text="按月付费"></el-switch>
					</div>
				</div>
				<div class="operate">
					<el-button @click="back">返回</el-button>
					<div class="payment" @click="toPay">去付款</div>
				</div>
			</div>
		</div>

		<!--支付模块-->
		<pay :openPay.sync="openPay" v-if="openPay" :payOption.sync="payOption" @closed="closePay"></pay>
	</div>
</template>

<script>
	import pay from "ServeComponents/pay";
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				openPay: false, //是否显示支付窗口模块
				timePeriod: [],
				productInfo: null, //已购买产品信息
				userProduct: null,
				selectId: "",
				chargeType: 0, //收费类型 0/按月 1/按年
				payPrice: 0, //需要支付的金额
				timeType: false, //时间类型   false/按月  true/按年
				openType: 0, //开通类型  0/新开通  1/升级 2/续费
				showAccount: false, //是否显示自定账号模块
				accountNum: "", //账号数量
				selectInfo: null, //选择的产品
				overDate: "", //到期时间
				loadHaveProduct: false,
				limitAccount: 6, //最低账号个数
				moreAccount:[23],  //判断是否为自定义账号产品
			};
		},

		watch:{
			timeType(to,from){
				this.chargeType=to?1:0;
			}
		},

		computed: {
			...mapGetters(["user_data"])
		},
		components: {
			pay
		},

		created() {
			let query=this.$route.query;
			//获取要购买的产品编号
			console.log("this.$route.query--------",query);
			if(JSON.stringify(query) != "{}") {
				this.selectId = query.id;
				this.openType = query.type;
				this.getNowProduct().then(res => {
					console.error('getNowProduct---------',res);
					this.productInfo=res;
					this.loadHaveProduct = true;
					
					if(this.productInfo.remindDay >= 30) {
						this.timeType = true;
					}
					
					//如果是多账号，获取账号个数
					if(this.moreAccount.includes(Number(this.productInfo.pid))) {
						this.limitAccount = this.productInfo.num;
					}
					
					console.log("limitAccount-------", this.limitAccount);
					
				
					//如果是开通或者升级
					if(this.openType != 2 ) {
						this.selectInfo = JSON.parse(query.selectInfo);
					}
					
					if(this.selectId==23 || this.productInfo.pid==23){
						this.timeType=true;
						this.showAccount=true;
					}//如果是续费
					else {
						this.accountNum = this.productInfo.num;
					}

					if(this.openType != 0) {
						this.overDate = this.util.getAfterDate(
							this.productInfo.endTime.split(" ")[0],
							this.timeType?1:0
						);
					}
					
					//获取时间段
					this.getTimePeriod();
					
					//计算价格
					this.calPrice();
				});
			}
		},
		mounted() {},

		methods: {
			//切换时间方法
			changeTime(val) {
				let type=this.timeType?1:0;
				if(this.productInfo && this.openType == 2) {
					this.overDate = this.util.getAfterDate(
						this.productInfo.endTime.split(" ")[0],
						type
					);
				}
				this.getTimePeriod();
				this.calPrice();
			},
			
			//获取时间节点
			getTimePeriod(){
				console.error('getTimePeriod----',this.productInfo,this.selectInfo);
				this.timePeriod=this.util.getTimePeriod(this.timeType);
				//如果是免费版本购买旗舰版，则要判断免费版本是否过期，如果没有过期，则要加上剩下免费版本时间
				if(this.productInfo.pid==0 && this.productInfo.remindDay>0 && this.selectInfo.pid==12){
					this.timePeriod[1]=this.util.getAfterDate(this.productInfo.endTime,this.timeType?1:0);
				}
			},
			
			//关闭支付窗口回调函数
			closePay() {
				this.openPay = false;
			},
			//返回按钮
			back() {
				this.util.back(this);
			},
			//去支付功能
			toPay() {
				if(!this.checkAccount(1)) return;
				let params=this.getParams(0);
				this.util.addProduct(params).then(res=>{
					console.log("toPay---------", res)
					let path = "https://www.paitume.com/pay?order_id=" + res.id;
					this.$electron.shell.openExternal(path);
				})
			},

			//检查账号数量是否符合,type:0/不显示提示  1/显示提示
			checkAccount(type) {
				if(this.showAccount && !this.accountNum) {
					if(type == 1) {
						this.$message.warning("请输入账号数量！");
					}
					return false;
				} else {
					let limitAccount = Number(this.limitAccount);
					let accountNum = this.accountNum ? Number(this.accountNum) : 0;
					if(this.showAccount && limitAccount > 6) {
						if(accountNum < limitAccount) {
							if(type == 1) {
								this.$message.warning("请输入" + limitAccount + "或以上的正整数账号数!");
							}

							return false;
						}
					}
					if(this.showAccount && accountNum < 6) {
						if(type == 1) {
							this.$message.warning("请输入6或以上的正整数账号数！");
						}
						return false;
					}
				}
				return true;
			},

			//获取商家开通的功能列表
			getNowProduct() {
				return new Promise((resolve, reject) => {
					this.util.getNowProduct().then(res => {
						res=this.util.productInfo(res);
						resolve(res);
					});
				});
			},

			//修改账号数量方法
			changeAccountNum() {
				console.log("changeAccountNum-----", this.accountNum);
				this.calPrice();
			},
			
			//获取参数,type,1/计算价格参数，0/下单参数
			getParams(type=1){
				let params;
				//开通或者升级
				if(this.openType != 2) {
					let id = Number(this.selectId);
					let num = this.util.getNumByProductId(id);
					if(this.accountNum > 5) {
						num = this.accountNum;
					}
					params = {
						pid: id,
						time: this.timeType ? 2 : 1,
						num: num,
					};
				}
				//续费
				else {
					let id = Number(this.productInfo.pid);
					params = {
						pid: id,
						time: this.timeType ? 2 : 1,
						num: this.productInfo.num
					};
				}
				if(type==1){
					params.is_sum=1;
				}
				//如果是永久版的
				if(this.selectId==33) {
					params.time = 3;
				}
				
				return params;
			},

			//计算价格
			calPrice() {
				let params=this.getParams();
				this.util.addProduct(params).then(res => {
					this.payPrice = res.price;
					console.log("this.payPrice------------", this.payPrice);
				});
			},
			
			
			
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	@import "./styles/index.scss";
	.operate {
		display: flex;
		button {
			margin-right: 10px;
		}
	}
	
	.productList {
		li {
			width: 100%;
		}
	}
	
	.account {
		.info {
			padding-top: 0px;
			.info-left {
				border: none;
				.el-input {
					margin-top: 16px;
					margin-bottom: 20px;
				}
			}
		}
	}
	
	.renewContent {
		.buy-item {
			border-color: #ff9500 !important;
			.price {
				font-size: 20px;
				color: #ff9500;
				margin-left: 20px;
			}
		}
		.editionTitle {
			font-weight: 600;
			color: #333 !important;
		}
		.editionType {
			color: #ff9500 !important;
		}
		.time {
			height: 60px;
			background: #333333;
			color: #ff9500;
			padding: 16px 0px 16px 20px;
			margin-top: 20px;
			.content {
				display: flex;
				align-items: center;
			}
			p {
				font-size: 20px;
				margin-left: 15px;
			}
		}
	}
</style>