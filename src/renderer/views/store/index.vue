<!--  -->
<template>
	<div>
		<div class="top-nav">
	      <div class="top-active">
	        <el-button icon="el-icon-plus" @click="accountDetail()">添加账号</el-button>
	      </div>
	      <div class="top-seach">
	      </div>
	    </div>
	    
	    <!--子账号列表-->
	    <el-table :data="accountList" fit :header-cell-style="{background:'#eef1f6',color:'#606266'}"
	      class="table-control">
	      <el-table-column type="index" align="center" label="序号" width="95">
	      </el-table-column>
	      <el-table-column prop="name" label="账号"></el-table-column>
	      <el-table-column prop="nick" label="昵称"></el-table-column>
	      <el-table-column prop="mobile" label="手机"></el-table-column>
	      <el-table-column align="center" label="状态">
	        <template slot-scope="scope">
	          <span v-if="scope.row.status==0">禁用</span>
	          <span v-if="scope.row.status==1">启用</span>
	        </template>
	      </el-table-column>
	      <el-table-column prop="remark" label="备注"></el-table-column>
	
	      <el-table-column align="center"  width="220" label="操作">
	        <template slot-scope="scope">
	          <el-button type="text" :disabled="isSubAccount" @click="accountDetail(1,scope.row.id)">修改</el-button>
	          <el-button type="text" :disabled="isSubAccount" @click="delAccount(scope.row.id)">删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    <!--分页模块-->
	    <!--<div class="page">
	    <el-pagination
		      background
		      @current-change="changePage"
		      layout="prev, pager, next"
		      :total="total_count"
		      style="text-align: right;"
		      v-if="total_count > 0"
		    ></el-pagination>
	    </div>-->
	    
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				accountList:[],
				isSubAccount:false,  //是否为子账号
				accountNum:0,  //开通的子账号数量
			}
		},

		computed: {
			...mapGetters(["user_data"])
		},
		components: {  },

		created() {
			//商家获取子账号列表
			this.storeAccountList();
		},
		mounted() {
			//获取账号是主账号还是子账号,如果有cid字段，就是子账号
			if(this.user_data.hasOwnProperty('cid')){
				this.isSubAccount=true;
			}else{
				//获取商家试用版本
				this.getUserFreeProduct();
				//获取商家开通的功能
				this.getUserProduct();
			}
			//获取商家开通对应的功能，是否有多账号功能
			console.log('this.user_data',this.user_data);
		},

		methods: {
			//获取商家使用版本
			getUserFreeProduct(){
				this.util.userFreeProduct().then(res=>{
					console.log('getUserFreeProduct------',res);
					if(res){
						this.accountNum=res.num;
					}
				})
			},
			//获取商家开通的功能
			getUserProduct(){
				this.util.getUserProduct().then(res=>{
					console.log('getUserProduct----',res);
					//获取商家已经购买的多账号数量
					if(res.length>0){
						res.forEach((item,index)=>{
							if(item.type==1 && item.is_temp==2){
								this.accountNum=parseInt(item.num);
							}
						})
					}
				})
			},
			//商家获取子账号列表
			storeAccountList(){
				this.util.storeAccountList().then(res=>{
					this.accountList=res;
					console.log('storeAccountList-----------',res);
				})
			},
			//删除账号
			delAccount(id){
				this.util.confirm(this).then(() => {
			        this.util.storeDelAccount(id).then(res=>{
			            this.$message.success("删除账号成功！");
			            this.storeAccountList();
			          })
			          .catch(err => {});
			      }).catch(err => {});
			},
			 //跳转到账号详情页面， type:0/添加,1/修改信息
		    accountDetail(type=0,id) {
		    	if(this.isSubAccount){
		    		this.$message.warning('子账号没有权限添加，请使用管理员账号添加！');
		    		return;
		    	}else{
		    		if(this.accountNum>0){
		    			if(this.accountNum<this.accountList.length){
		    				this.$message.warning('子账号数量已经用完，无法添加！');
			    			return;
		    			}
			    	}else{
			    		//跳转到购买页面
			    		this.$message.warning('暂无开通子账号功能！');
			    		let path="/serve/product_set/product_set";
			    		this.$router.push({path:path});
			    		return;
			    	}
		    	}
		    	
		    	let params=null;
		    	  if(id){
		    	  	params={id:id};
		    	  }
			      this.$router.push({ path: "/serve/employee_set/accountDetail", query: params });
		    },
			
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	
</style>