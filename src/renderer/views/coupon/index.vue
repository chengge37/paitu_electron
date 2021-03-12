<!--  -->
<template>
	<div class="newServe">
		<div class="top-nav">
			<div class="top-active">
				<el-button type="primary" icon="el-icon-plus" @click="toDetail()" v-permission>添加优惠券</el-button>
			</div>

		</div>
		<!--<div class="line"></div>-->

		<!--优惠券列表表格-->
		<el-table :data="couponList" v-loading="listLoading" element-loading-text="Loading">
			<!--<el-table-column align="center" label="序号" width="95">
				<template slot-scope="scope">
					<span>{{(page-1)*page_size+scope.$index+1}}</span>
				</template>
			</el-table-column>-->
			<el-table-column align="center" type="index" label="序号" width="95">
			</el-table-column>
			<el-table-column label="创建时间">
				<template slot-scope="scope">
					<span>{{scope.row.create_time|time2Date('YYYY-MM-DD hh:mm:ss')}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" align="center"></el-table-column>
			<el-table-column label="类型">
				<template slot-scope="scope">
					<span>{{scope.row.coupon_type==1?"代金券":"折扣券"}}</span>
				</template>
			</el-table-column>
			<el-table-column label="开始时间">
				<template slot-scope="scope">
					<span>{{scope.row.st_time}}</span>
				</template>
			</el-table-column>
			<el-table-column label="结束时间">
				<template slot-scope="scope">
					<span>{{scope.row.end_time}}</span>
				</template>
			</el-table-column>
			<el-table-column label="金额/折扣">
				<template slot-scope="scope">
					<span v-if="scope.row.coupon_type==1">{{scope.row.money}}</span>
					<span v-else>{{parseInt(scope.row.money)}}折</span>
				</template>
			</el-table-column>
			<el-table-column prop="user_count" label="被领取" align="center"></el-table-column>
			<el-table-column prop="is_use" label="被使用" align="center"></el-table-column>
			<el-table-column align="center" label="是否显示">
				<template slot-scope="{row}">
					<span v-if="row.is_show==0">显示</span>
					<span v-else>隐藏</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" width="180" label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="toDetail(scope.row.id)" v-permission>修改</el-button>
					<el-button type="text" @click="delCoupon(scope.row.id)" v-permission>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--分页模块-->
		<pagination :total="parseInt(total_count)"  :page="parseInt(page)" :pagesize="parseInt(pageSize)" @getPageNum="changePage" class="pagination">			
		</pagination>
		
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import uploadImg from "ServeComponents/UploadImg";
	import pagination from "ServeComponents/FrontComponents/pagination";
	export default {
		data: () => ({
			listLoading: true,
			page: 1,
			pageSize: 10,
			total_count:0,
			couponList:[],  //优惠券列表
		}),

		computed: {
			...mapGetters(["user_data"])
		},
		components: { uploadImg,pagination },

		careted() {},
		mounted() {
			console.log('this.user_data-----',this.user_data);
			this.getCouponList();
		},

		methods: {
			//获取优惠券列表方法
			getCouponList(){
				let params={
					page:this.page,
					page_size:this.pageSize,
					uid:this.user_data.id,
					is_show:2,
				}
				this.util.getCouponList(params).then(res=>{
					this.listLoading=false;
					this.couponList=res.rows;
					this.total_count=res.total_count;
					console.log('getCouponList--------',res);
				})
			},
			//列表翻页方法
			changePage(val){
				this.page=val;
				this.getCouponList();
			},
			//返回方法
			back(){
			},
			//跳转到详情
			toDetail(id){
				console.log('toDetail-----',id);
				let path="/serve/pop_set/coupon_detail";
				if(id){
					let data = {id: id};
		      		this.$router.push({ path:path, query: data });
				}else{
					this.$router.push({ path:path});
				}
			},
			//删除优惠券方法
			delCoupon(id){
				this.util.confirm(this).then(() => {
					this.util.delCoupon(id).then(res=>{
						this.$message.success("删除成功!");
						this.getCouponList();
					})
				}).catch(err => {});
			}
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	
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
	
</style>