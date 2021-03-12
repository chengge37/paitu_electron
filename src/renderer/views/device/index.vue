<template>
  <div class="newServe">
    <div class="mainInfo">
      <!-- 头部 -->
      <div class="top">
        <!-- 添加设备按钮 -->
        <div>
        	<el-button icon="el-icon-plus" class="incomeBtn" type="primary" @click="toAddDevice" v-permission>添加设备</el-button>
        	<el-button type="text" style="color:#333;" class="lookChart word-hover" @click="output('exportTable')">导出表格</el-button>
        </div>

        <!-- 类别筛选及搜索框 -->
        <div class="select-search">
          <!-- 类别筛选 -->
          <div class="class-select">
            <span class="word">类别筛选</span>
            <el-cascader
              @change="changeCategory"
              placeholder="全部类别"
              class="cascader-border"
              :options="equipCategoryArray"
              :show-all-levels="false"
              :props="{value:'id',label:'name'}"
              v-model="category"
            ></el-cascader>
          </div>
          <search-box @change="search"></search-box>
        </div>
      </div>

      <!-- 设备列表 -->
      <div class="device-table">
        <el-table
          ref="multipleTable"
          :data="deviceList"
          tooltip-effect="dark"
          v-loading="tblLoading"
        >
          <!--<el-table-column type="selection" width="55"></el-table-column>-->

          <el-table-column label="序号" align="center" width="55">
            <template slot-scope="scope">{{(listParams.page-1)*listParams.page_size+scope.$index+1}}</template>
          </el-table-column>

          <el-table-column label="类别" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.category_name}}</template>
          </el-table-column>

          <el-table-column label="品牌" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.brand_name}}</template>
          </el-table-column>

          <el-table-column label="自定义描述" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.custom_desc}}</template>
          </el-table-column>

          <el-table-column label="型号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>

          <el-table-column label="使用中/库存数" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.count}}</template>
          </el-table-column>

          <el-table-column label="租赁方式" align="center">
            <template slot-scope="scope">{{scope.row.only_rent_day|rent}}</template>
          </el-table-column>

          <el-table-column label="使用场地" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.borrow_type|borrow}}</template>
          </el-table-column>
          <el-table-column label="是否上架" align="center" show-overflow-tooltip>
	                <template slot-scope="{row}">{{row.del==0?'已上架':'已下架'}}</template>
	            </el-table-column>
	

          <!-- <el-table-column label="是否上架" show-overflow-tooltip>
            <template slot-scope="{row}">{{row.del==0?'上架':'下架'}}</template>
          </el-table-column> -->

          <el-table-column label="出入库状态" align="center">
            <template slot-scope="{row}">
              <el-popover placement="bottom" width="400" trigger="hover" v-if="row.last_in_out_record">
                <el-table :data="row.sn_array">
                  <el-table-column property="sn" label="设备sn码" align="center"></el-table-column>
                  <el-table-column label="状态" align="center">
                    <template slot-scope="{row}">{{row.last_in_out_record.type|last_out}}</template>
                  </el-table-column>
                </el-table>
                <el-button type="text" slot="reference">鼠标悬停查看</el-button>
              </el-popover>
              <el-tag v-else>无</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="250">
            <template class="operation-btn" slot-scope="scope">
              <el-button type="text" @click="toDeviceDetail(scope.row.id)">详情</el-button>
              <el-button @click="toedit(scope.row.id)" type="text" v-permission>修改</el-button>
              <el-button
                @click="equipIsUp(scope.row)"
                type="text"
                v-permission
              >{{scope.row.del==0?'下架':'上架'}}</el-button>
              <el-button @click="toSetFAQ(scope.row.id)" type="text" v-permission>设置问题</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--需要导出的表格(隐藏)-->
			<table id="exportTable" class="firstTable table table-bordered table-hover" data-sortable="true" width="100%" v-show="false">
				<tbody>
					<tr>
						<th>序号</th>
						<th>类别</th>
						<th>品牌</th>
						<th>自定义描述</th>
						<th>型号</th>
						<th>使用者/库存数</th>
						<th>租赁方式</th>
						<th>使用场地</th>
						<th>是否上架</th>
					</tr>
					<tr v-for="(item,index) in allList" :key="item.id">
						<td>{{index+1}}</td>
						<td>{{item.category_name}}</td>
						<td>{{item.brand_name}}</td>
						<td>{{item.custom_desc}}</td>
						<td>{{item.name}}</td>
						<td>{{item.count}}</td>
						<td>{{item.only_rent_day|rent}}</td>
						<td>{{item.borrow_type|borrow}}</td>
						<td>{{item.del==0?'已上架':'已下架'}}</td>
					</tr>
				</tbody>
			</table>
      </div>
    </div>

    <!--设置问题组件模块-->
    <set-faq
      v-if="showFAQlist"
      :openDialog.sync="showFAQlist"
      type="2"
      :id="selectId"
      @closeFAQtable="closeFAQtable"
    ></set-faq>

    <!-- 分页组件 -->
    <!--<div class="page">
        <el-pagination background @current-change="changePage" :current-page="listParams.page" :page-size="listParams.page_size" layout="total, prev, pager, next, jumper" :total="deviceCount"></el-pagination>
    </div>-->
    <!--分页模块-->
    <pagination
      :total="parseInt(deviceCount)"
      :page="parseInt(listParams.page)"
      :pagesize="parseInt(listParams.page_size)"
      @getPageNum="changePage"
      class="pagination"
    ></pagination>
  </div>
</template>

<script>import { equip } from "@config/api.js";
import { storage } from "@util/storage.js";
import { mapGetters } from "vuex";
import setFaq from "ServeComponents/SetFAQ";
import searchBox from "ServeComponents/searchBox";
import pagination from "ServeComponents/FrontComponents/pagination";
import { exportTb } from "../../utils/exportTable";
export default {
	data() {
		return {
			equipCategoryArray: [], //从静态库中获取的所有类别
			category: [], //选中的分类
			listParams: {
				// 请求设备列表发送的页数和每页size参数
				page: 1,
				page_size: 12,
				category_id: "",
				search: ""
			},
			deviceCount: 0,
			deviceList: [],
			multipleSelection: [],
			tblLoading: false,
			showFAQlist: false, //是否显示设置问题对话框
			selectId: "", //选择关联的id
			allList: []
		};
	},

	components: {
		setFaq,
		pagination,
		searchBox
	},

	computed: {
		...mapGetters(["user_data"])
	},

	mounted() {
		this.equipCategoryArray = [{
				name: "全部类别",
				id: "1024"
			},
			// ...equip_category
			...this.$staticCategoryTree
		]; //给静态类别库加一个全部类别选项
		this.category = ["1024"]; //给全部类别选项加一个id以便其默认选中高亮
		this.getDeviceList();
	},

	methods: {
		output(id) {
			this.getRequest(equip.get, this.listParams).then(res => {
				this.getRequest(equip.get, { ...this.listParams,
					page_size: res.total_count
				}).then(res => {
					this.allList = res.rows
					this.$nextTick(() => {
						exportTb(id, "设备表格.xls");
					})
				})
			})
		},
		//关闭常见问题对话框方法
		closeFAQtable() {
			this.showFAQlist = false;
		},
		//跳转到设置常见问题对话框
		toSetFAQ(id) {
			console.log("setFAQ---------", id);
			this.selectId = id;
			this.showFAQlist = true;
		},

		// 进入页面请求接口获取设备列表
		getDeviceList() {
			this.tblLoading = true;
			this.getRequest(equip.get, this.listParams)
				.then(res => {
					this.tblLoading = false;
					if(res) {
						// storage.set("allDevice", res);
						this.listParams.page = parseInt(res.page);
						this.listParams.page_size = parseInt(res.page_size);
						this.deviceCount = parseInt(res.total_count);
						this.deviceList = res.rows;
					}
				})
				.catch(err => {
					this.tblLoading = false;
				});
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 跳转到添加设备详情页，状态为可编辑
		toAddDevice() {
			storage.set("editable", true);
			// storage.remove("selectedDevice");
			this.$router.push({
				path: "/serve/control_center/Device_details",
				query: {
					snEdit: 1
				}
			});
		},
		// 跳转到设备详情页，状态为不可编辑
		toDeviceDetail(id) {
			storage.set("editable", false);
			this.$router.push({
				path: "/serve/control_center/Device_details",
				query: {
					id
				}
			});
		},
		// 跳转到设备详情页，状态为可编辑
		toedit(id) {
			storage.set("editable", true);
			this.$router.push({
				path: "/serve/control_center/Device_details",
				query: {
					id
				}
			});
		},
		//设备上下架, 0/上架 ，1/下架
		equipIsUp(item) {
			let title = "";
			let isUp = "";
			if(item.del == 0) {
				title = "下架";
				isUp = 1;
			} else if(item.del == 1) {
				title = "上架";
				isUp = 0;
			}
			let params = {
				ids: item.id,
				is_up: isUp
			};
			this.util
				.confirm(this, "确定" + title + "设备吗?")
				.then(res => {
					if(res) {
						this.util.equipIsUp(params).then(res => {
							console.log("equipIsUp-------", res);
							this.$message.success(title + "成功！");
							this.getDeviceList();
						});
					}
				})
				.catch(err => {});
		},
		// 选择分类列表项获取相应设备列表
		changeCategory() {
			// 判断类别选择的是全部类别还是其他，若是全部类别，则发送请求时id为空
			this.listParams.category_id =
				this.category[0] == 1024 ?
				"" :
				this.category[this.category.length - 1] + "";
			this.getDeviceList();
		},
		// 顶部搜索
		search(val) {
			this.listParams.search = val;
			this.getDeviceList();
		},
		// 切换页码
		changePage(val) {
			this.listParams.page = val;
			this.getDeviceList();
		}
	},
	filters: {
		borrow: val => {
			let borrowType;
			switch(val) {
				case "0":
					borrowType = "影棚内/外借";
					break;
				case "1":
					borrowType = "影棚内";
					break;
				case "2":
					borrowType = "外借";
					break;
			}
			return borrowType;
		},
		rent: val => {
			let rentType;
			switch(val) {
				case "0":
					rentType = "按天/按小时租赁";
					break;
				case "1":
					rentType = "按天租赁";
					break;
			}
			return rentType;
		},
		last_out: val => {
			const stateMap = {
				1: "已出库",
				2: "已入库"
			}
			return stateMap[Number(val)]
		}
	}
};</script>

<style lang="scss" scoped>.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
}

.select-search {
	display: flex;
	align-items: center;
	.search-box {
		margin-left: 20px;
	}
}


/*设备列表*/

.device-table {
	/*border: 1px solid #eee;*/
	border-radius: 10px;
	margin-bottom: 20px;
	.el-table /deep/ .el-table__row /deep/ .cell {
		padding: 7px;
	}
}

.device-table /deep/ .el-table--fit {
	height: 100%;
}</style>
