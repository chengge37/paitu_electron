<template>
	<div class="newServe">
		<div class="top-nav">
	      <div class="top-active">
	        <el-button type="primary" @click="allRead">全部标记为已读</el-button>
	      </div>
	    </div>
    
		<!--消息表格-->
		<el-table :data="list" v-loading="listLoading">
			<el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
			</el-table-column>
			<el-table-column align="center" label="创建时间">
				<template slot-scope="{row}">
					<span>{{row.create_time | time2FullDate}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="remark" label="消息内容" show-overflow-tooltip></el-table-column>
			</el-table-column>
			<el-table-column align="center" label="状态">
				<template slot-scope="{row}">
					<span>{{row.is_read==0?'未读':'已读'}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="{row}">
					<el-button @click="hasRead(row.id)" type="text" v-if="row.is_read==0">标记为已读</el-button>
					<el-button @click="delMsg(row.id)" type="text">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--分页模块-->
		<pagination :total="parseInt(params.total)" :page="parseInt(params.page)" :pagesize="parseInt(params.page_size)" @getPageNum="changePage" class="pagination"></pagination>

	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import pagination from "ServeComponents/FrontComponents/pagination";
	export default {
		data(){
			return {
				listLoading:true,
				params:{
					page:1,
					page_size:10,
					total:0
				},
				list:null,
			}
		},

		computed: {
			...mapGetters(["user_data"])
		},
		components: {
			pagination
		},

		careted() {

		},
		mounted() {
			//获取消息列表
			this.getMsgList();
		},

		methods: {
			//获取消息列表
			getMsgList(){
				this.listLoading=true;
				let params={
					is_sys:0,
					page:this.params.page,
					page_size:this.params.page_size
				}
				this.util.getMsgList(params).then(res=>{
					console.warn('getMsgList----',res);
					this.params.total=res.total_count;
					this.list=res.rows;
					this.listLoading=false;
				})
			},
			
			//标记当前页都是已读
			allRead(){
				//获取当前页面未读的id
				let ids=[];
				this.list.forEach((item,index)=>{
					if(item.is_read==0){
						ids.push(item.id);
					}
				})
				if(ids.length==0){
					this.$message.warning('当前页没有未读的消息！');
					return;
				}else{
					this.util.confirm(this,'确定操作吗?').then(res=>{
						if(res){
							let id=ids.join(',');
							this.hasRead(id);
						}
					}).catch(res=>{});
					
				}
				
			},
			
			//标记信息为已读方法
			hasRead(id){
				this.util.hasRead(id).then(res=>{
					this.$message.success('操作成功！');
					this.getMsgList();
					this.updateNotice();
				})
			},
			
			//updateNotice
			updateNotice(){
				this.$store.commit("updateNotice");
			},
			
			//删除消息方法
			delMsg(id){
				this.util.confirm(this,'确定删除消息吗？').then(res=>{
					if(res){
						this.util.delMsg(id).then(res=>{
							this.$message.success('删除消息成功！');
							this.getMsgList();
							this.updateNotice();
						})
					}
				}).catch(res=>{});
				
			},
			
			//切换页数方法
			changePage(index){
				this.params.page=index;
				this.getMsgList();
			}
		}
	};
</script>
<style lang='scss' scoped>

</style>