<!--  -->
<template>
  <div>
    <div class="top-nav">

      <div class="top-active">
        <el-button icon="el-icon-plus" @click="employeePage()">添加员工</el-button>
      </div>
    </div>

    <!--横线-->
    <div class="line"></div>

    <!--表格列表数据-->
    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      fit
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      class="table-control"
    >
      <!--<el-table-column type="selection"></el-table-column>-->
      <el-table-column align="center" type="index" label="序号">
        <!--<template slot-scope="scope">{{scope.row.id}}</template>-->
      </el-table-column>
      <el-table-column prop="name" label="员工名称"></el-table-column>
      <el-table-column prop="position" label="职位"></el-table-column>
      <el-table-column prop="group_name" label="所在部门"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"></el-table-column>
      <el-table-column prop="native_place" label="户籍"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="birthday" label="出生日期"></el-table-column>
      <el-table-column prop="address" label="现住址"></el-table-column>
      <el-table-column align="center" prop="created_at" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="employeePage(scope.$index,scope.row,0)">详情</el-button>
          <el-button type="text" @click="employeePage(scope.$index,scope.row,1)">修改</el-button>
          <el-button type="text" @click="delEmployee(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页模块-->
    <div class="page">
      <el-pagination
        @current-change="loadList"
        :current-page.sync="page"
        background
        layout="prev, pager, next"
        :total="total_count"
        v-if="total_count > 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { employee } from "@config/api.js";
export default {
  data() {
			return {
		    listLoading: false,
		    value: "",
		    seach_text: "",
		    options: [],
		    list: [],
		    total_count: 0,
		    page: 1,
		    tabIndex:"1",
		  }
	},

  components: {},

  mounted() {
    this.loadList();
  },

  methods: {
  	//tab菜单切换点击方法
    tabClick() {
    	console.log('tabClick------');
    },
    //获取员工列表数据
    loadList() {
      let params = {
        page: this.page
      };
      this.getRequest(employee.getAll, params)
        .then(res => {
          console.log("获取员工列表----", res);
          this.list = res.rows;
          this.total_count = res.total_count;
        })
        .catch(err => {});
    },
    //添加，查新员工，修改员工信息方法， status:2/添加,0/查看详情,1/修改信息
    employeePage(index, item = {}, status = 2) {
      console.log("添加员工----");
      let params = {
        data: encodeURIComponent(JSON.stringify(item)),
        status: status
      };
			this.util.openPage(this,"/serve/employee_set/accountDetail",params);
    },
    //删除员工方法
    delEmployee(id) {
      let params = { id: id };
      this.util.confirm(this).then(() => {
        this.postRequest(employee.del, params)
          .then(res => {
            this.$message.success("删除员工成功！");
            this.loadList();
          })
          .catch(err => {});
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.top-nav {
  .top-seach {
    flex: 1;
    display: flex;
    justify-content: flex-end;
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
        background-color: #3a7f9f;
        text-align: center;
        color: #fff;
        border-radius: 0px 2px 2px 0px;
        cursor: pointer;
      }
      .seach-button:active {
        background-color: #2c637c;
      }
    }
  }
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
.page {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
}

.table-control /deep/ .el-button.is-round {
  padding: 8px 22px;
  color: #ffffff;
}
</style>