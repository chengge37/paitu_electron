<!--  -->
<template>
	<div>
		<div class="buy">
			<!--现有版本模块-->
			<div class="buy-info nowProduct">
				<div class="info" v-if="productInfo">
					<div class="info-left have">
						<div class="info-title">
							<span>现有产品</span>
							<el-button  @click="toDetail(productInfo.pid,2,productInfo)" class="renew">立即续费</el-button>
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
						<div class="acquire">
							已有功能
							<span v-if="productInfo.pid==0" style="font-size:13px;color:#aaa;">(红色字体功能，过期后不能使用)</span>
						</div>
						<div class='haveFun'>
							<div class="acquire-item" v-for="(item,index) in productInfo.funs" :key="index">
								<i class="el-icon-check"></i>
								<div class="acquire-txt limitFun" v-if="productInfo.pid==0 && limitFuns.includes(item)">{{item}}</div>
								<div class="acquire-txt" v-else>{{item}}</div>
								
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
				
				<!--购买记录-->
				<div class="history">
					<el-button type="text" @click="openBuyHistory" v-permission>购买记录</el-button>
				</div>
				
			</div>
			
			
			
			
			<ul class="productList">
				<li class="buy-info" v-for="(item,index) in showProduct" :key="index">
					<div class="buy-title">*即日起可使用新权限</div>
	
					<div class="line"></div>
	
					<div class="info">
						<div class="info-left">
							<div class="info-title">
								<span>{{showTitle}}</span>
								<span class="editionType">{{item.name}}</span>
							</div>
	
							<div class="buy-type">
								<div class="buy-item" @click="toDetail(item.id,1,item)">
									<div class="item-logo">
										<img :src="$qiniuHost+'images/productEdition_'+item.pid+'.png'" width="48" height="48"/>
									</div>
									<div class="item-info">
										<div class="info-top">
											￥{{item.price}}元
											<span v-if="item.is_forever==1"></span>
											<span v-else-if="(productInfo && productInfo.remindDay>=30) || item.id==23">/年</span>
											<span v-else>/月</span>
										</div>
										<div class="info-bottom">
											<span>原价</span>
											<s>{{item.price*2}}元</s>
											<span>，已经抵扣{{item.price}}元</span>
										</div>
									</div>
									<div class="triangle"></div>
								</div>
							</div>
						</div>
	
						<div class="info-right">
							<div class="acquire">功能</div>
							<div class="haveFun">
								<div class="acquire-item" v-for="(subItem,index2) in item.funs" :key="index2">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">
										{{subItem}}
									</div>
								</div>
								<div class="acquire-item">
									<i class="el-icon-check"></i>
									<div class="acquire-txt">
										有效时间至：
										<!--按月-->
										<span style="color:#333;" v-if="item.pid!=23">{{item.is_forever!=1?timePeriodMonth:'永久有效'}}</span>
										<span style="color:#333;" v-else>{{timePeriodYear}}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>

		</div>
		
		<!--购买记录模块-->
		<buy-history :openDialog.sync="showBuyHistory" @close="closeHistory"></buy-history>
		
		<!--<button @click="testDelFun">删除产品(测试)</button>-->

	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import buyHistory from "ServeComponents/buyHistory"
	export default {
		data() {
			return {
				showBuyHistory:false,  //是否显示购买记录对话框
				titles:['开通','补差价开通'],
				showTitle:'', //显示的文案
				showProduct:[],
				timePeriod:[],
				productInfo:null, //已购买产品信息
				productInfo:null,  //用户使用版本信息
				canShowList:[], //可以显示的升级产品列表id
				timePeriodMonth:this.util.getTimePeriod(0)[1],
				timePeriodYear:this.util.getTimePeriod(1)[1],
				timeType:0,   //0:月  1：年
				limitFuns:['商家独立小程序','扫码出入库','数据保密','账号(5个)'],
				productList:[], //产品列表
			}
		},

		computed: {
			...mapGetters(["user_data"])
		},
		components: {buyHistory},

		created() {
			
		},
		mounted() {
			//获取当前现有产品
			this.getNowProduct();
			
			//获取时间段
			this.timePeriod=this.util.getTimePeriod(1);
		},

		methods: {
			//获取当前版本信息
			getNowProduct(){
				this.util.getNowProduct().then(res=>{
					this.productInfo=this.util.productInfo(res);
					console.warn('getNowProduct-----------',this.productInfo);
					if(this.productInfo.pid==0){
						this.showTitle=this.titles[0];
					}else{
						this.showTitle=this.titles[1];
					}
					//获取所有产品列表
					this.getAllProduct();
				})
			},
			
			openBuyHistory(){
				this.showBuyHistory=true;
			},
			
			//关闭购买记录方法
			closeHistory(val){
				this.showBuyHistory=false;
			},
			
			//跳转到购买详情页面,type:  //type 0/新开通  1/升级 2/续费
			toDetail(id,type,item){
				if(this.productInfo.pid==0){
					type=0;
				}
				
				let params = {id: id,type:type};  
				console.error('toDetail----------',item,id,type);
				if(type!=2){
					let obj=this.util.productInfo(item,1);
					params.selectInfo=JSON.stringify(obj);
				}
				if(type==0 && id==0){
					console.error('productList---',this.productList);
					this.productList.forEach((item,index)=>{
						if(item.id==12){
							let obj=this.util.productInfo(item,1);
							params.id=12;
							params.selectInfo=JSON.stringify(obj);
						}
					})
				}
				console.error('toDetail-------',params);
				let path="/serve/product_set/product_detail";
		      	this.$router.push({ path:path, query: params });
			},
		
			//获取所有产品列表
			getAllProduct(){
				let params={
					page:1,
					page_size:10000,
					type:1,
				}
				this.util.getProductList(params).then(res=>{
					console.error('getProductList----------------',res);
					this.productList=res.rows;
					let showList=[];
					console.error('productInfo.pid----------------',this.productInfo.pid);
					showList=this.util.showProductById(this.productInfo.pid);
					if(showList.length==0){
						this.showProduct=[];
					}else{
						res.rows.forEach((item,index)=>{
							if(showList.includes(parseInt(item.id))){
								let obj=this.util.productInfo(item,1);
								this.showProduct.push(obj);
							}
						})
					}
					console.error('showProduct----',this.showProduct);
					//计算产品差价
					this.productPay();
				})
			},
			
			//产品下单方法
			productPay() {
				if(this.productInfo&&this.productInfo.remindDay>=30){
					this.timeType=1;
				}
				this.showProduct.forEach((item,index)=>{
					let id=parseInt(item.id);
					let num=this.util.getNumByProductId(id);
					let params;
					params={
						pid:id,
						time:this.timeType+1,  //1月 2年 3永久
						num:num,
						is_sum:1,
					}
					if(item.is_forever==1){
						params.time=3;
					}
					if(id==23){
						params.time=2;
					}
					console.log('params', params);
					this.util.addProduct(params).then(res => {
						this.showProduct.forEach((item2,index2)=>{
							if(res.pid==item2.id){
								item2.price=res.price;
							}
						})
						console.log('showProduct-----------',this.showProduct);
					})
				})
				
			}
			

		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import './styles/index.scss';
.renew{
	background:#D0021B;
	border-radius:0px;
	color:#fff;
	margin-left:10px;
	padding:10px 15px;
}
.productHistory{
	display:flex;
	justify-content: space-between;
	flex:1;
}
.nowProduct{
	display:flex;
	margin-bottom:20px;
	.history{
		margin-right: 30px;
    	margin-top: 20px;
	}
}
.limitFun{
	color:red!important;
}

</style>