<template>
  <div class="newServe">
    <div class="mainInfo">
      <div class="top">
        <div class="rightContent">
          <search-box @change="search" placeholder="请输入手机号或昵称"></search-box>
          <el-button icon="el-icon-plus" @click="addEmployee()" class="addBtn" v-permission>添加员工</el-button>
        </div>
      </div>

      <!--表格列表数据-->
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        class="table-control"
      >
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号码"></el-table-column>
        <el-table-column align="center" prop="nick" label="员工昵称"></el-table-column>
        <el-table-column align="center" prop="nick" label="员工头像">
          <template slot-scope="{row}">
            <el-image
              :src="row.pic?$qiniuHost+row.pic:config.male_pic"
              style="width:50px; height: 50px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="position" label="职位"></el-table-column>
        <el-table-column align="center" prop="group_name" label="所在部门"></el-table-column>
        <!--<el-table-column prop="mobile" label="联系电话"></el-table-column>-->
        <el-table-column align="center" prop="native_place" label="户籍"></el-table-column>
        <el-table-column align="center" prop="age" label="年龄"></el-table-column>
        <el-table-column align="center" prop="birthday" label="出生日期"></el-table-column>
        <el-table-column align="center" prop="address" label="现住址"></el-table-column>
        <el-table-column align="center" prop="created_at" width="180" label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" @click="employeePage(scope.$index,scope.row,0)">详情</el-button>-->
            <el-button type="text" @click="lookDetail(scope.row)" v-permission>修改</el-button>
            <el-button type="text" @click="delEmployee(scope.row.id)" v-permission>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页模块-->
    <pagination :total="total_count" :page="page" @getPageNum="changePage" class="pagination"></pagination>

    <!--添加,修改员工对话框模块-->
    <el-dialog :title="type==0?'添加员工':'修改员工'" close-on-click-modal="false" :visible.sync="employeeDialog" width="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
        <el-row :gutter="0">
          <el-col :span="12" class="short-input">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="form.mobile" :disabled="noEdit" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="员工昵称" prop="nick">
              <el-input v-model="form.nick" :disabled="noEdit" placeholder="请输入6-32个字符昵称"></el-input>
            </el-form-item>
            <el-form-item label="员工邮箱" prop="email">
              <el-input v-model="form.email" :disabled="noEdit" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="所在部门" prop="group_id">
              <el-select
                v-model="form.group_id"
                placeholder="请选择"
                class="department"
                :disabled="noEdit"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.group_id"
                  :label="item.group_name"
                  :value="item.group_id"
                ></el-option>
              </el-select>
              <el-button type="text" @click="manage" v-if="!noEdit">管理部门></el-button>
            </el-form-item>
            <el-form-item label="户籍地">
              <el-input v-model="form.native_place" :disabled="noEdit"></el-input>
            </el-form-item>
            <el-form-item label="头像" class="avatar">
              <upload-img
                v-if="showImg"
                :imageUrl="form.pic?$qiniuHost+form.pic:''"
                @handleSuccess="handleSuccess"
              ></upload-img>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="short-input">
            <el-form-item v-if="type==0" label="员工密码" prop="pwd">
              <el-input
                v-model="form.pwd"
                placeholder="请输入6-32个字符密码"
                clearable
                show-password
                :disabled="noEdit"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="type==1" label="员工密码">
              <el-input
                v-model="form.pwd"
                clearable
                show-password
                :disabled="noEdit"
                placeholder="不填即不修改"
              ></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="form.birthday"
                @change="changeDate"
                type="date"
                placeholder="选择日期"
                :disabled="noEdit"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="员工年龄">
              <el-input v-model="form.age" :disabled="noEdit"></el-input>
            </el-form-item>
            <el-form-item label="所在职位">
              <el-input v-model="form.position" :disabled="noEdit"></el-input>
            </el-form-item>

            <el-form-item label="现在住址">
              <el-input v-model="form.address" :disabled="noEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="bottomBtn">
          <el-button type="primary" @click="operateEmployee" v-if="type==0" v-permission>确定</el-button>
          <el-button type="primary" @click="operateEmployee" v-else v-permission>修改</el-button>
          <el-button @click="employeeDialog=false" v-permission>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--管理分组对话框模块-->
    <el-dialog title="部门管理" :visible.sync="editGroupDialog" width="50%">
      <div class="hear">
        <el-button type="primary" @click="OpenAdd = true">添加部门</el-button>
        <div class="tip">Tip：当您点击编辑时，会解锁所有的部门，同样当您选择任意一个保存时会保存所有的部门。</div>
      </div>

      <el-table :data="departmentList">
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="{row}">
            <div v-if="!canedit">{{row.group_name}}</div>
            <el-input v-model="row.group_name" placeholder="请输入部门名称" v-else></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="canedit = true" v-if="!canedit">编辑</el-button>

            <span v-else>
              <el-button type="text" @click="operateGroup('update')">保存</el-button>
              <el-button type="text" @click="cancer">取消</el-button>
            </span>

            <el-button type="text" @click="operateGroup('del',row.group_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 添加部门 -->
    <el-dialog title="添加部门" :visible.sync="OpenAdd" width="30%">
      <el-input v-model="addGroupName" placeholder="请输入部门名称,长度为2-16个字符"></el-input>
      <div class="bottomBtn">
        <el-button type="primary" class="color-area" @click="operateGroup('add')">添加</el-button>
        <el-button type="default" @click="OpenAdd=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "ServeComponents/FrontComponents/pagination";
import uploadImg from "ServeComponents/UploadImg/index.vue";
import searchBox from "ServeComponents/searchBox";
import { employee } from "@config/api.js";
export default {
  data() {
    return {
      employeeDialog: false,
      editEmployeeDialog: false,
      editGroupDialog: false,
      listLoading: true,
      value: "",
      search_text: "",
      options: [],
      list: [], //客户列表
      selectGroup: "", //选择的分组id
      groupList: null, //分组列表
      total_count: 0,
      page: 1,
      page_size: 10,
      form: {}, //员工表格
      noEdit: false,
      addGroupName: "",
      OpenAdd: false,
      canedit: false,
      rules: {
        mobile: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 32, message: "长度在 6 到 32个字符", trigger: "blur" }
        ],
        nick: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 32, message: "长度在 2 到 32个字符", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: this.validate.validateEmail,
            trigger: "blur"
          }
        ],
        group_id: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur"
          }
        ]
      },
      departmentList: [],
      oldDepartmentList: [],
      type: 0, //打开对话框方式，0/添加， 1/修改
      showImg: true //是否现修改的图片组件
    };
  },

  components: {
    pagination,
    searchBox,
    uploadImg
  },

  careted() {},
  mounted() {
    this.loadList();
    this.getGroup();
  },

  methods: {
    //打开修改员工方法
    lookDetail(item) {
      console.log("lookDetail-------item-------", item);
      this.type = 1;
      this.employeeDialog = true;
      this.form = this.util.deepcopy(item);
      this.form.pwd = null;
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },

    //上传图片成功回调方法
    handleSuccess(key) {
      this.form.pic = key;
    },

    cancer() {
      this.departmentList = this.oldDepartmentList;
      this.canedit = false;
    },
    //打开添加员工对话框方法
    addEmployee() {
	//获取权限方法
	 this.util.checkFuns().then(res=>{
		console.error('operate----',res);
		if(res){
			this.type = 0;
		    this.form = {};
		    this.employeeDialog = true;
		}
	 });
      
    },

    //获取员工部门方法
    getGroup() {
      this.getRequest(employee.getGroup)
        .then(res => {
          console.log("获取员工部门成功----", res);
          this.departmentList = res;
          //深度复制一份部门列表
          this.oldDepartmentList = this.util.deepcopy(res);
        })
        .catch(err => {});
    },
    //返回方法
    back() {
      this.$router.push({
        path: "/serve/employee_set/index"
      });
    },
    //管理方法
    manage() {
      this.editGroupDialog = true;
      this.addGroupName = "";
    },
    //改变日期，并计算年龄方法
    changeDate(val) {
      this.$set(this.form, "age", this.util.getAge(val));
    },
    changePage(val) {
      this.page = val;
      this.loadList();
    },
    //搜索方法
  	search(val){
  		console.log('search---------',val);
  		this.search_text=val;
  		this.loadList();
  	},

    //获取员工列表数据
    loadList() {
      let params = {
        page: this.page,
        search:this.search_text
      };
      this.getRequest(employee.getAll, params)
        .then(res => {
          console.log("获取员工列表----", res);
          this.list = res.rows;
          this.total_count = res.total_count;
          this.listLoading = false;
        })
        .catch(err => {});
    },

    //操作员工方法，添加/type==0,修改/type==1
    operateEmployee() {
      let url = "";
      let tips = "";
      console.log("this.form---------", this.form);
      this.util.checkForm(this).then(res => {
        if (this.type == 0) {
          url = employee.add;
          tips = "添加员工成功！";
        } else {
          url = employee.update;
          tips = "修改员工成功！";
        }
        this.postRequest(url, this.form)
          .then(res => {
            this.$message.success(tips);
            this.employeeDialog = false;
            this.editEmployeeDialog = false;
            this.loadList();
          })
          .catch(err => {});
      });
    },

    //操作部门方法，添加/add,修改/update,删除/del
    operateGroup(type, id) {
      let params = {};
      let tips = "";
      let url = "";
      switch (type) {
        case "add":
          params = {
            group_name: this.addGroupName
          };
          tips = "添加部门成功！";
          url = employee.addGroup;
          break;
        case "update":
          //判断是否有修改的项
          let updateList = this.util.getDiff(
            this.departmentList,
            this.oldDepartmentList
          );
          console.log("updateList---------", updateList);
          if (updateList.length == 0) {
            this.$message.warning("没有修改的项!");
            return;
          }
          params = {
            group_array: updateList
          };
          tips = "修改部门成功！";
          url = employee.updateGroup;
          break;
        case "del":
          params = {
            id: id
          };
          tips = "删除部门成功！";
          url = employee.delGroup;
          break;
      }
      if (type == "del") {
        this.util.confirm(this).then(res => {
          if (res) {
            this.handle(type, url, params, tips);
          }
        });
      } else {
        this.handle(type, url, params, tips);
      }
    },

    handle(type, url, params, tips) {
      this.postRequest(url, params)
        .then(res => {
          this.$message.success(tips);
          switch (type) {
            case "add":
              this.addGroupName = "";
              this.OpenAdd = false;
              break;
            case "update":
              this.addGroupName = "";
              this.canedit = false;
              break;

            default:
              break;
          }
          //重新获取分组列表
          this.getGroup();
        })
        .catch(err => {});
    },

    //删除员工方法
    delEmployee(id) {
      let params = {
        ids: id
      };
      this.util.confirm(this).then(() => {
        this.getRequest(employee.del, params)
          .then(res => {
            //删除成功
            if(res==="删除成功"){
              this.$message.success("删除员工成功！");
            }else{
              //操作成功
              this.$message.warning("不能删除管理员！");
            }
            this.loadList();
          })
          .catch(err => {});
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.top {
  display: flex;
  justify-content: flex-end;
  padding: 20px 10px;
  button {
    border: 1px solid $Theme-color;
    border-radius: 0px;
    color: $Theme-color;
    padding: 9px 10px;
  }
  .rightContent {
    display: flex;
  }
}
.addBtn {
  margin-left: 20px;
}
.department {
  /deep/ {
    .el-input__inner {
      width: 100%;
    }
    .el-input {
      width: 160px !important;
    }
  }
}
/deep/ .el-upload--picture-card {
  width: 90px;
  height: 90px;
}
</style>