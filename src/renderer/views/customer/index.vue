<template>
  <div class="newServe">
  	<div class='mainInfo'>
  		
	    <div class="top">
					<div class='rightContent'>
						<search-box @change="search" placeholder="姓名/电话号码搜索"></search-box>
						<el-button icon="el-icon-plus" @click="customerPage()" v-permission>添加客户</el-button>
					</div>
			</div>
	
	    <!--客户管理列表表格-->
	    <el-table :data="list" v-loading="listLoading">
	      <el-table-column align="center" label="序号" width="95">
	        <template slot-scope="scope">
	          <span>{{(page-1)*page_size+scope.$index+1}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column  align="center" label="客户分组" v-if="groupList">
					<template v-slot:header>
          <el-dropdown @command="changeGroup" trigger="click" class="cursor">
            <span class="el-dropdown-link">
              {{opt}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in groupList" :key="item.group_id" :command="item.group_id">{{item.group_name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
	      	<!-- <template slot="header">
						<el-select class="head-other-col"  v-model="selectGroup" @change="changeGroup" placeholder="分组">
							<el-option  v-for="(item,index) in groupList" :key="item.group_id" :label="item.group_name" :value="item.group_id"></el-option>
						</el-select>
					</template> -->
	        <template slot-scope="scope">
	          <span>{{scope.row.group_name}}</span>
	        </template>
	      </el-table-column>
	      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
	      <el-table-column prop="nick" label="客户头像">
					<template slot-scope="{row}">
						<el-image :src="row.avatar?$qiniuHost+row.avatar:config.male_pic" style="width:50px; height: 50px"></el-image>
					</template>
				</el-table-column>
	      <el-table-column prop="served_times" sortable label="服务次数" align="center"></el-table-column>
	      <el-table-column prop="birthday" label="客户生日" align="center"></el-table-column>
	      <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
	      <el-table-column prop="email" label="电子邮箱" align="center"></el-table-column>
	      <el-table-column prop="company" label="公司名称" align="center" width="300"></el-table-column>
	
	      <el-table-column align="center" prop="created_at" width="180" label="操作">
	        <template slot-scope="scope">
	          <el-button type="text" @click="customerPage(scope.$index,scope.row,0)">详情</el-button>
	          <el-button type="text" @click="customerPage(scope.$index,scope.row,1)" v-permission>修改</el-button>
	          <el-button type="text" @click="delCustomer(scope.row.id)" v-permission>删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    
    </div>
    
    <!--分页模块-->
		<pagination :total="parseInt(total_count)"  :page="parseInt(page)"  @getPageNum="changePage" class="pagination">			
		</pagination>
  </div>
</template>

<script>
	import pagination from "ServeComponents/FrontComponents/pagination";
	import searchBox from 'ServeComponents/searchBox'
import { customer, customer_group } from "@config/api.js";
export default {
  data() {
			return {
				opt:"全部",
		    listLoading: true,
		    value: "",
		    search_text: "",
		    options: [],
		    list: [],   //客户列表
		    selectGroup:'',  //选择的分组id
		    groupList:null, //分组列表
		    total_count: 0,
		    page:1,
		    page_size: 10,
		  }
	},

  components: {pagination,searchBox},

  careted() {},
  mounted() {
    this.loadList();
  },

  methods: {
  	//切换分组方法
  	changeGroup(command){
			const index=this.groupList.findIndex(item=>{
        return item.group_id===command
      })
      this.selectGroup=command;
      this.opt = this.groupList[index].group_name;
  		// console.log('changeGroup------',this.selectGroup);
//		this.groupList=null;
  		this.loadList();
  	},
  	
  	//搜索方法
  	search(val){
  		this.search_text=val;
  		this.loadList();
  	},
  	
    loadList() {
      let params = { 
      	page: this.page, 
      	page_size: this.page_size,
      	group_id:this.selectGroup,
      	search:this.search_text
      };
      this.getRequest(customer.getAll, params)
        .then(res => {
          console.log("res----", res);
          this.page = res.page;
          this.page_size = res.page_size;
          this.list = res.rows;
          this.total_count = res.total_count;
          this.getCustomerGroupList();
        })
        .catch(err => {});
    },
    
    //获取分组管理列表
    getCustomerGroupList() {
      this.getRequest(customer_group.getAll).then(res => {
          this.list.forEach((item, index) => {
            res.forEach((subItem, index) => {
              if (item.group_id == subItem.group_id) {
                item.group_name = subItem.group_name;
              }
            });
          });
          this.listLoading = false;
          let obj={
          	group_id:'0',
          	group_name:'全部'
          }
					this.groupList=res;
					this.groupList.unshift(obj);
          console.log("this.list--after---", this.list);
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    
    //跳转到客户详细页面
    customerPage(index, item = {}, status = 2) {
      let params = {
        data: encodeURIComponent(JSON.stringify(item)),
        status: status
      };
			this.util.openPage(this,'/serve/customer_set/customer_details',params);
    },
    
    //删除客户方法
    delCustomer(id) {
      console.log("delCustomer---");
      this.util.confirm(this).then(() => {
        let params = {
          id: id
        };
        this.postRequest(customer.del, params)
          .then(res => {
            this.$message.success("删除客户成功！");
            this.loadList();
          })
          .catch(err => {});
      }).catch(err => {});
    },
    
    //分页跳转方法
    changePage(val) {
      this.page = val;
      this.loadList();
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.top{
	display:flex;
	justify-content: flex-end;
	padding:20px 10px;
	button{
		border:1px solid $Theme-color;
		border-radius:0px;
		color:$Theme-color;
		padding:9px 10px;
	}
	.rightContent{
		display:flex;
	}
}
.search-box{
		margin-right:20px;
	}
</style>