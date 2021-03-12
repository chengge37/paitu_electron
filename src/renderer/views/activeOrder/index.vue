<template>
	<div class="newServe">
		<div class="act-order-container">
			<div class="top-nav">
				<div class="top-order">
					<!--<el-dropdown @command="changeType" trigger="click" style="width:90px;margin-left:15px;cursor:pointer">
	            <span class="el-dropdown-link">
	              {{opt}}
	              <i class="el-icon-arrow-down el-icon--right"></i>
	            </span>
	            <el-dropdown-menu slot="dropdown">
	              <el-dropdown-item v-for="item in typeList" :key="item.label" :command="item.value">{{item.label}}</el-dropdown-item>
	            </el-dropdown-menu>
          </el-dropdown>-->
					
					<div class="order-group">
						<el-radio-group v-model="actOrder.params.time_type" @change="changeOpt">
							<el-radio-button :label="item.label" v-for="(item,index) in optList" :key="index">{{item.name}}</el-radio-button>
						</el-radio-group>
					</div>
					<div class="date-seach">
						<p style="width:70px;">日期筛选：</p>
						<el-date-picker
							v-model="dateArea"
							type="daterange"
							range-separator="~"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							@change="dateAreaChange">
						</el-date-picker>
					</div>
				</div>
				<div class="top-seach">
					
					<div class="seach-box">
						<div class="seach">
							<div class="icon">
								<ali-svg-icon icon-class="seach"></ali-svg-icon>
							</div>
							<input type="text" placeholder="请输入订单号或活动名" class="seach-input" v-model="searchText" />
						</div>
						<div class="seach-button color-area" @click="search">搜索</div>
					</div>
				</div>
			</div>
			<el-table :data="actOrder.list" v-loading="actOrder.listLoading" element-loading-text="Loading" fit  class="table-control">
				<el-table-column label="下单时间" prop="create_time_str" align="center" ></el-table-column>
				<el-table-column label="活动开始" prop="start_time" align="center" ></el-table-column>
				<el-table-column label="活动结束" prop="end_time" align="center" ></el-table-column>
				<el-table-column label="全部状态" align="center" >
					<template v-slot:header>
          <el-dropdown @command="changeStatus" trigger="click" class="cursor">
            <span class="el-dropdown-link">
              {{opt1}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in statusList" :key="item.label" :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
					<!-- <template slot="header">
						<el-select class="head-other-col" @change="changeStatus" v-model="selectStatus" placeholder="全部状态">
							<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template> -->
					<template slot-scope="scope">{{scope.row.pay_status | statusStr}}</template>
				</el-table-column>
				<el-table-column label="线上和线下" align="center" >
					<template v-slot:header>
          <el-dropdown @command="changeType" trigger="click" class="cursor">
            <span class="el-dropdown-link">
              {{opt}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in typeList" :key="item.label" :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
					<template slot-scope="scope">
						<span v-if="scope.row.type=='1'">线上</span>
						<span v-else>线下</span>
					</template>
				</el-table-column>
				<el-table-column label="订单编号" prop="show_id" align="center" >
				</el-table-column>
				<el-table-column label="全部费用" prop="fee" align="center" >
					<template v-slot:header>
          <el-dropdown @command="changeFee" trigger="click" class="cursor">
            <span class="el-dropdown-link">
              {{opt2}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in feeList" :key="item.label" :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
					<!-- <template v-slot:header>
            <el-select
              class="head-other-col"
              @change="changeFee"
              v-model="selectFee"
            >
              <el-option
                v-for="item in feeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template> -->
					<template slot-scope="scope">
						￥{{scope.row.fee}}
					</template>
				</el-table-column>
				<el-table-column label="客户名称" prop="contact_name" align="center" ></el-table-column>
				<el-table-column label="联系方式" prop="contact_mobile" align="center" ></el-table-column>
				<el-table-column label="所属活动" prop="name" align="center" ></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="gotoDetail(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<pagination :total="actOrder.total"  :page="actOrder.params.page" :pagesize="actOrder.params.page_size" @getPageNum="changePage" class="pagination">			
		</pagination>
	</div>
</template>

<script>
	import { activity } from "@/config/api";
	import { format } from 'date-fns';
	import pagination from "ServeComponents/FrontComponents/pagination";
	export default {
		components: {
			pagination
		},
		data() {
			return {
				optList: [{
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
				dateArea:'',
				timeArea:{},
                actOrder:{
                    listLoading:false,
                    list:[],
                    params:{
                        page:1,
						page_size:10,
						time_type:'0'
                    },
                    total:0
				},
				searchText:'',
				opt:"全部类型",
				status:"全部状态",
				selectStatus: "-1",
        opt1:"全部",
        opt2:"全部费用",
				statusList:[
					{value:'-1',label:'全部'},
					{value:'1',label:'未支付'},
					{value:'2',label:'已支付'},
					{value:'5',label:'活动中'},
					{value:'7',label:'等待评论'},
					{value:'8',label:'评论结束'},
				],
				typeList:[
					{value:'-1',label:'全部类型'},
					{value:'1',label:'线上'},
					{value:'2',label:'线下'},
				],
				selectType:'-1',
				feeList:[
					{value:'-1',label:'全部费用'},
					{value:'0',label:'免费'},
					{value:'1',label:'付费'},
				],
				selectFee:''
			};
		},
		filters: {
			statusStr(status) {
				const statusMap = {
					"0": "已关闭",
					"1": "未支付",
					"2": "已支付",
					"5": "活动中",
					"7": "等待评论",
					"8": "评论结束",
				};
				return statusMap[status];
			},
		},
		created() {},
		mounted() {
            this.getActOrderList()
		},
		methods: {
			search(){
				this.getActOrderList()
			},
			validParams(){
				let params = this.util.deepcopy(this.actOrder.params)
				if(this.selectStatus&&this.selectStatus!='-1'){
					params = Object.assign(params,{pay_status:this.selectStatus})
				}
				if(this.selectType&&this.selectType!='-1'){
					params = Object.assign(params,{type:this.selectType})
				}
				if(this.timeArea&&this.timeArea.st_time){
					let times = Object.assign(this.timeArea,{time_type:5});
					params = Object.assign(params,this.timeArea);
					
				}
				if(this.selectFee&&this.selectFee!='-1'){
					params = Object.assign(params,{fee:this.selectFee})
				}
				if(this.searchText){
					params = Object.assign(params,{search:this.searchText})
				}
				return params
			},
            getActOrderList(){
				this.actOrder.listLoading = true;
				let params = this.validParams()
                this.getRequest(activity.server_get_order, params)
                .then(res => {
                    this.actOrder.listLoading = false;
					this.actOrder.list = res.rows;
					this.actOrder.list.forEach(item => {
						item.create_time_str = format(item.create_time*1000,'YYYY-MM-DD')
					})
                    this.actOrder.total = res.total_count;
                })
                .catch(err => {
                    this.actOrder.listLoading = false;
                });
            },
            handleCurrentChange(val){
                console.log(val)
			},
			dateFormat(d){
			const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
			return resDate;
			},
			// 不够10添加0的函数
			p(s) {
			return s < 10 ? '0' + s : s
			},
			dateAreaChange(e){
				console.log('dateAreaChange---',e)
				if(e&&e.length>0){
					let startDate =  new Date(e[0]);
					let endDate =  new Date(e[1]);
					this.timeArea = {st_time:this.dateFormat(startDate),et_time:this.dateFormat(endDate)}
				}else{
					delete this.timeArea.st_time;
					delete this.timeArea.et_time;
				}
				
				this.getActOrderList()
			},
			changeStatus(command) {
      const index=this.statusList.findIndex(item=>{
        return item.value===command
      })
      this.selectStatus=command;
      this.opt1 = this.statusList[index].label;
      this.actOrder.params.page = 1;
      this.getActOrderList();

    },
			changeType(command) {
      const index=this.typeList.findIndex(item=>{
        return item.value===command
      })
      this.selectType=command;
      this.opt = this.typeList[index].label;
      this.actOrder.params.page = 1;
      this.getActOrderList();
    },
			changeOpt(val){
				this.actOrder.params.page = 1;
				console.log('val---',val)
				this.getActOrderList()
			},
			changeFee(command){
				const index=this.feeList.findIndex(item=>{
        return item.value===command
			})
			this.selectFee=command;
			this.opt2=this.feeList[index].label;
				this.actOrder.params.page = 1;
				this.getActOrderList()
			},
			changePage(e){
				this.actOrder.params.page = e;
				this.getActOrderList()
			},
			gotoDetail(data){
				this.$router.push('/serve/active_order/active_detail?id='+data.id+'&act_id='+data.activity_id)
			}
		},
		watch: {
			
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.act-order-container{
		background-color: #ffffff;
	}
	.top-nav {
		.top-order {
			display: flex;
            align-items: center;
			.add-order {
				margin-left: 20px;
				/deep/ .el-button--primary {
					background-color: $Theme-color;
					border-color: $Theme-color;
					height: 38px;
				}
				/deep/ .el-button--primary:active {
					background-color: $Button-active;
					border-color: $Button-active;
				}
			}
            .top-select{
                margin-right: 10px;
                /deep/ .el-input__inner{
                    background-color: inherit;
                    color: #333333;
                    border: none;
                    width: 120px;
					text-align: center;

                }
            }
            .order-group{
                margin-right: 20px;
            }
            .date-seach{
                display: flex;
				align-items: center;
            }
		}
		.top-seach {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			margin-right: 10px;
			.date-seach {
				.long {
					width: 150px;
					margin-left: 23px;
				}
			}
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
					background-color: $Theme-color;
					text-align: center;
					color: #fff;
					border-radius: 0px 2px 2px 0px;
					cursor: pointer;
				}
				.seach-button:active {
					background-color: $Button-active;
				}
			}
		}
	}
	
	
</style>