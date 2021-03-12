<template>
	<div>
		<!--设置问题对话框-->
		<el-dialog class="historyDialog" title="购买记录" :visible.sync="showDialog" @close="closeHistory" center>
			<el-table ref="historyTable" :data="list">
				<el-table-column type="index" label="序号">
				</el-table-column>
				<el-table-column property="name" label="购买项目"></el-table-column>
				<el-table-column property="price"  label="金额"></el-table-column>
				<el-table-column label="类型" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.order_type==1">开通</span>
						<span v-if="scope.row.order_type==2">续费</span>
						<span v-if="scope.row.order_type==3">升级</span>
					</template>
				</el-table-column>
				<el-table-column label="下单时间" align="center" width="150">
					<template slot-scope="scope">
						<span>{{scope.row.create_time|time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
					</template>
				</el-table-column>
				<el-table-column label="时间类型" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.product_time==1?'月':'年'}}</span>
					</template>
				</el-table-column>
				<el-table-column  label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.is_pay==1">支付</span>
						<span v-if="scope.row.is_pay==2">未支付</span>
					</template>
				</el-table-column>
				
				<el-table-column property="remark"  label="详情"></el-table-column>
			</el-table>

			<!--分页模块-->
			<!--<div class="tableFoot">
				<div class="btns bottom-button">
					<el-button type="primary" class="confirmBtn" @click="setFAQ">保存</el-button>
					<el-button class="cancelBtn" @click="closeHistory">取消</el-button>
				</div>
			</div>-->
		</el-dialog>
	</div>
</template>

/* 设置关联问题组件 * (1)openlogin,接受一个Boolean，是否显示对话框  */
/* close 关闭购买记录对话框方法*/
<script>
	import { mapGetters } from "vuex";
	export default {
		props: {
			//是否显示对话框，默认不显示
			openDialog: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				showDialog: this.openDialog, //是否显示设置问题对话框
				list:[],
			}
		},
		watch: {
			openDialog(to) {
				this.showDialog = to;
			},
		},
		computed: {
			...mapGetters(["user_data"])
		},
		created(){
			this.getAllProductOrder();
		},
		mounted() {
			console.log('buyHistory---------');
			
		},
		methods: {
			//关闭对话框方法
			closeHistory() {
				this.$emit('close', false);
			},
			//获取购买产品列表
			getAllProductOrder(){
				this.util.getAllProductOrder().then(res=>{
					console.log('getAllProductOrder------',res);
					this.list=res.rows;
				})
			},
			
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.historyDialog {
		.el-table {
			height: 370px;
			overflow-y: auto;
		}
		.tableFoot {
			.btns {
				display: flex;
				justify-content: flex-end;
			}
		}
	}
	/deep/ .el-dialog{
		width:60%;
	}
</style>