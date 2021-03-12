<template>
	<div class="newServe">
		<div class="mainInfo">
			<div class="top">

				<div class='leftContent'>
					<el-radio-group v-model="time_type" @change="changeOpt">
						<el-radio-button :label="item.label" v-for="(item,index) in timeList" :key="index">{{item.name}}</el-radio-button>
					</el-radio-group>

					<search-box @change="search" placeholder="单号/明细搜索"></search-box>

					<div class="income">
						<span>总收入：</span>
						<span>+ ¥{{incomeMoney}}</span>
					</div>
					<div class="cost">
						<span>总支出：</span>
						<span>- ¥{{costMoney}}</span>
					</div>
					<el-button type="text" class="lookChart word-hover" @click="lookChart">查看图表</el-button>
					<el-button type="text" class="lookChart word-hover" @click="output('exportTable')">导出表格</el-button>
					
					<div class="acount" style="margin-left:20px;">
				        <span>线上可提现余额：</span>
				        <span class="money">￥{{balance}}</span>
				        <el-button type="warning" size="mini" @click="showReflect=true">提现</el-button>
				   </div>
				</div>

				<div class='rightContent'>
					<el-button icon="el-icon-plus" class="incomeBtn" @click="detail('1')" v-permission>添加收入</el-button>

					<el-button icon="el-icon-plus" class="costBtn" @click="detail('2')" v-permission>添加支出</el-button>
				</div>

			</div>

			<!--全部列表表格-->
			<el-table :data="list" v-loading="listLoading" element-loading-text="Loading" fit>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
				<el-table-column align="center" sortable label="添加日期" prop="date">
					<template slot-scope="scope">{{scope.row.date}}</template>
				</el-table-column>
				
				<el-table-column align="center" label="类型" prop="type_name" width="150">
					<template v-slot:header>
						<el-dropdown trigger="click" @command="changeType" class="cursor">
							<span class="el-dropdown-link">
				              {{selectType|showType}}
				              <i class="el-icon-arrow-down el-icon--right"></i>
				            </span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="item in typeList" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
					<template slot-scope="scope">{{scope.row.is_in | formatInOrOut}}</template>
				</el-table-column>
		
				<el-table-column align="center" label="类别" prop="type_name">
					<template v-slot:header>
						<el-dropdown trigger="click" @command="changeMode" class="cursor">
							<span class="el-dropdown-link">
				              {{modeTxt}}
				              <i class="el-icon-arrow-down el-icon--right"></i>
				            </span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="item in financeType" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				
				<el-table-column align="center" prop="money" label="金额"></el-table-column>
				<!--<el-table-column align="center" prop="sn_no" label="收入/支出单据"></el-table-column>-->
				<el-table-column align="center" prop="sn_no" label="收入/支出单据">
					<template slot-scope="{row}">
						<el-image v-if="row.sn_no" :src="$qiniuHost+row.sn_no" @click="showPreviewImg(row)" class="cursor"  style="width:50px; height: 50px"></el-image>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="content" label="明细"></el-table-column>
				<el-table-column align="center" prop="created_at" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="detail('3',scope.row)" v-permission>修改</el-button>
						<el-button type="text" @click="delFinance(scope.row.id)" v-permission>删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--需要导出的表格(隐藏)-->
			<table id="exportTable" class="firstTable table table-bordered table-hover" data-sortable="true" width="100%" v-show="false">
				<tbody>
					<tr>
						<th>序号</th>
						<th>添加日期</th>
						<th>类型</th>
						<th>类别</th>
						<th>金额</th>
						<th>收支单号</th>
						<th>明细</th>
					</tr>
					<tr v-for="(item,index) in allList" :key="index">
						<td>{{index+1}}</td>
						<td>{{item.date}}</td>
						<td>{{item.is_in | formatInOrOut}}</td>
						<td>{{item.type_name}}</td>
						<td>{{item.money}}</td>
						<td>{{item.sn_no}}</td>
						<td>{{item.content}}</td>
					</tr>
				</tbody>
			</table>

		</div>

		<!--分页模块-->
		<pagination :total="listTotalCount" :page="listParams.page" :pagesize="listParams.pageSize" @getPageNum="changePage" class="pagination">
		</pagination>
		
		
		
		<!--图片预览模块-->
		<el-dialog :visible.sync="showImagePreview">
			<el-carousel indicator-position="outside" height="600px" :autoplay="false" arrow="never">
				<el-carousel-item v-for="(item,index) in previewImgList" :key="index">
					<img :src="config.qiniuHost+item.sn_no" :onerror="util.errorPic" style="max-width: 100%;max-height: auto;display: block; margin: 0 auto;" />
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
		
		<!--提现对话框-->
	    <el-dialog width="30%" title="提现" :visible.sync="showReflect">
	      <el-form label-width="80px">
	        <el-form-item label="提现金额">
	          <el-input v-model="reflectMoney" placeholder="请输入金额(保留2位小数)"></el-input>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="showReflect = false">取 消</el-button>
	        <el-button type="primary" @click="reflect">确定</el-button>
	      </div>
	    </el-dialog>

	</div>

</template>

<script>
	import searchBox from '../../components/searchBox/index'
	import dataShow from "./dataShow.vue";
	import pagination from "../../components/FrontComponents/pagination";
	import { exportTb } from "../../utils/exportTable";
	export default {
		components: {
			searchBox,
			pagination,
			dataShow
		},
		data() {
			return {
				showImagePreview:false, //是否显示预览图
				previewImgList:[],  //预览图片列表
				searchTxt: '',
				time_type: '0',
				timeList: [{
					label: '0',
					name: '不限'
				}, {
					label: '1',
					name: '昨日'
				}, {
					label: '2',
					name: '今日'
				}, {
					label: '4',
					name: '本周'
				}, {
					label: '6',
					name: '本月'
				}],
				typeList: [{
					value: '-1',
					label: '全部'
				}, {
					value: '0',
					label: '支出'
				}, {
					value: '1',
					label: '收入'
				}],
				opt: "全部",
				opt1: "全部",
				selectType:'-1',  //选择的类型 ，默认为'-1' 全部
				selectMode:'-1',  //选择的类别，默认为'-1'
				modeTxt:'类别', //显示的类别的文本
				listLoading: false,
				list: [],
				allList: [], //列表（全部数据）导出表格使用
				modeList: [],
				listParams: {
					page: 1,
					pageSize: 10, //TODO For test pagination
					start_date: null,
					end_date: null
				},
				listTotalCount: 0,
				financeType: [],
				showChart: false,
				incomeMoney: '0.00',
				costMoney: '0.00',
				showReflect: false, //是否显示提现窗口
				balance:0,
				reflectMoney: "", //需要提现的金额

			}
		},
		filters:{
			showType(type){
				console.log('showType--------',type);
				if(type==-1){
					return '全部';
				}else if(type==0){
					return '支出';
				}else if(type==1){
					return '收入';
				}
			}
		},
		created() {
			//获取后台菜单
			let list = this.util.getServeMenu(this);
			console.log('list----------', list);
		},
		mounted() {
			//获取商家可用余额
    		this.getBalance();
    		
			this.loadList();
			this.getTypeList();
		},
		methods: {
			//获取可提现余额
		    getBalance() {
		      this.util.getReflectMoney().then(res => {
		        console.log("getReflectMoney----------", res);
		        this.balance = res;
		      });
		    },
		    //提现方法
		    reflect() {
		      this.util.outBalance(this.reflectMoney).then(res => {
		        this.$message.success("提现申请已提交！");
		        this.showReflect = false;
		        this.reflectMoney = "";
		        //重新获取余额
		        this.getBalance();
		        console.log("outBalance---------", res);
		      });
		    },
		    
			//显示预览图方法
			showPreviewImg(item){
				this.previewImgList=[];
				this.showImagePreview=true;
				this.previewImgList.push(item);
			},
			
			//加载数据方法
			loadList() {
				this.listLoading = true;
				let params = {
					page: this.listParams.page,
					page_size: this.listParams.pageSize,
					search:this.searchTxt,
//					is_in:'', //0.支出 1.收入
//					type_array:[],  //类型数组 支出类型 1房租,2水费,3电费,4工资,5提现    收入类型 8系统影棚订单收入,9系统设备订单收入,10系统活动订单收入,11线下影棚订单收入,12线下设备订单收入,13线下活动订单收入
				}
				if(this.selectType && this.selectType>=0){
					params.is_in=this.selectType;
				}
				if(this.selectMode){
					if(this.selectMode>0){
						params.type_array=[this.selectMode];
					}
				}
				if(this.time_type!=0){
					params.time_type=this.time_type;
				}
				console.log('params-------------', params);
				this.util.getAllFinance(params).then(res => {
					console.log('allList---loadList----', res);
					this.listLoading = false;
					this.list = res.rows
					this.listTotalCount = parseInt(res.total_count);
					this.incomeMoney=res.all_income|'0';
					this.costMoney=res.all_expenditure|'0';
					//加载全部数据
					this.loadAllList(params,res.total_count);
				}, (err) => {
					this.listLoading = false;
				})
			},

			//获取列表全部数据（导出表格使用）
			loadAllList(params, total) {
				params.page_size = total;
				console.log('loadAllList-----------', params);
				this.util.getAllFinance(params).then(res => {
					console.log('loadAllList-----------', res);
					this.allList = res.rows;
				})
			},
			//导出表格
			output(id) {
				exportTb(id, "财务表格.xls");
			},
			downTable(tableId) {
				tableExport(tableId, '财务表格', 'xls');
			},

			changePage(val) {
				this.listParams.page = val;
				this.loadList();
			},

			//搜索方法
			search(val) {
				this.searchTxt = val;
				console.log('search-----', this.searchTxt);
				this.loadList();
			},
			//获取支出/收入类型列表
			getTypeList() {
				this.util.getFinanceType().then(res => {
					this.financeType.push({
						id: "0",
						name: "全部"
					});
					this.financeType.push(...res);
					this.oldFinanceType = this.util.deepcopy(this.financeType);
					console.log("this.financeType----------", this.financeType);
				}).catch(err => {});
			},

			//status:，1/新增收入，2/新增支出，3/修改
			detail(status, item) {
				let params = {
					status: status
				};
				if(item) {
					params.id = item.id;
				}
				console.log("params----", params);
				this.$router.push({
					path: '/serve/finance_set/Finance_detail',
					query: params
				});
			},

			//切换类型方法
			changeType(val){
				this.selectType=val;
				this.changeMode('0');
				this.loadList();
			},
			
			//删除方法
			delFinance(id) {
				this.util.confirm(this).then(res => {
					if(res) {
						console.log('删除');
						this.util.delFinance(id).then(res => {
							this.$message.success('删除成功！');
							this.loadList();
						})
					}
				}).catch(res => {});
			},

			//切换类别方法
			changeMode(val){
				console.log('changeMode------',val,this.selectMode);
				this.selectMode=val;
				let flag=this.financeType.findIndex((item,index)=>{
					return item.id==val;
				})
				this.modeTxt=this.financeType[flag].name;
				this.loadList();
			},

			//切换日期选项方法
			changeOpt(val) {
				console.log('changeOpt----', val);
				this.loadList();
			},

			//查看图表方法
			lookChart() {
				let path = "/serve/finance_set/dataShow";
				this.$router.push({
					path: path
				});
			}

		},

	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 10px;
		.el-button--text {
			color: #333333;
		}
		.income {
			padding: 4px 11px;
			background: rgba(84, 173, 23, 0.04);
			color: #17CE66;
			border-radius: 100px 0px 0px 100px;
			margin-left: 20px;
		}
		.cost {
			padding: 4px 11px;
			background: rgba(212, 40, 45, 0.04);
			color: #FF4949;
			border-radius: 0px 100px 100px 0px;
			margin-right: 10px;
		}
		.leftContent {
			display: flex;
			align-items: center;
		}
		.rightContent {
			.incomeBtn {
				color: #FF4949;
				background: rgba(212, 40, 45, 0.04);
				margin-right: 10px;
				border: 1px solid transparent;
				border-radius: 0px;
				&:hover {
					border-color: #FF4949;
				}
			}
			.costBtn {
				color: #17CE66;
				background: rgba(84, 173, 23, 0.04);
				border: 1px solid transparent;
				border-radius: 0px;
				&:hover {
					border-color: #17CE66;
				}
			}
		}
		.el-radio-group {
			margin-right: 30px;
		}
	}
	
</style>