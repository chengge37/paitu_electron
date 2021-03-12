<!--  -->
<template>
  <div class="order-container">
    <div class="top-nav">
      <div class="top-title">{{title}}</div>
      <div @click="back" class="back">
        <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
        <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
        <span>返回</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="form-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
        <el-card class="card-set">
          <div class="info-set">
            <div class="info-icon"></div>
            <div class="info-title">员工信息</div>
          </div>

          <el-row :gutter="0">
            <el-col :span="7" class="short-input">
              <el-form-item label="员工名称" prop="name">
                <el-input v-model="form.name" :disabled="noEdit"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="form.mobile" :disabled="noEdit"></el-input>
              </el-form-item>
              <el-form-item label="所在职位">
                <el-input v-model="form.position" :disabled="noEdit"></el-input>
              </el-form-item>
              <el-form-item label="户籍地">
                <el-input v-model="form.native_place" :disabled="noEdit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" class="short-input">
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
              <el-form-item label="所在部门" prop="group_id">
                <!--<el-input v-model="form.group_name" :disabled="noEdit"></el-input>-->
                <el-select v-model="form.group_id" placeholder="请选择" :disabled="noEdit">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.group_id"
                    :label="item.group_name"
                    :value="item.group_id"
                  ></el-option>
                </el-select>
                <el-button type="text" @click="manage" v-if="!noEdit">管理</el-button>
              </el-form-item>
              <el-form-item label="现在住址">
                <el-input v-model="form.address" :disabled="noEdit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>

    <div class="bottom-button">
      <el-button type="default" v-if="status==0" @click="back">返回</el-button>
      <el-button type="default" v-if="status!=0" @click="back">取消</el-button>
      <el-button type="primary" v-if="status==2" @click="operateEmployee('add')">保存</el-button>
      <el-button type="primary" v-if="status==1" @click="operateEmployee('update')">修改</el-button>
    </div>

    <!--管理分组对话框模块-->
    <el-dialog title="部门管理" :visible.sync="editGroupDialog" width="40%">
      <div class="hear">
        <el-button type="text" @click="OpenAdd = true">添加部门</el-button>
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
      <!-- 添加部门 -->
      <el-dialog append-to-body title="添加部门" :visible.sync="OpenAdd" width="30%">
        <el-input v-model="addGroupName" placeholder="请输入部门名称"></el-input>
        <div slot="footer">
          <el-button type="primary" class="add_btn" @click="operateGroup('add')">添加</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { employee } from "@config/api.js";
import { storage } from "@util/storage.js";
export default {
  data: () => ({
    title: "",
    noEdit: false,
    form: {},
    departmentList: [], //部门列表
    oldDepartmentList: [], //保留一份旧的部门列表，之后做修改对比用
    editGroupDialog: false,
    addGroupName: "",
    OpenAdd: false,
    canedit: false,
    rules: {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      group_id: [{ required: true, message: "请选择部门", trigger: "blur" }]
    }
  }),

  components: {},

  created() {
    let status = parseInt(storage.get("active_data").status);
    let data = JSON.parse(decodeURIComponent(storage.get("active_data").data));
    this.status = status;
    // 0为查看详情，1为修改，2为添加
    switch (status) {
      case 0:
        this.noEdit = true;
        this.title = "员工信息";
        this.form = data;
        break;
      case 1:
        this.noEdit = false;
        this.title = "员工修改";
        this.form = data;
        break;
      case 2:
        this.noEdit = false;
        this.title = "添加员工";
        this.form = {};
        break;
      default:
        break;
    }
  },

  mounted() {
    this.getGroup();
  },

  methods: {
    cancer() {
      this.departmentList = this.oldDepartmentList;
      this.canedit = false;
    },
    //改变日期，并计算年龄方法
    changeDate(val) {
      this.$set(this.form, "age", this.util.getAge(val));
    },
    //返回方法
    back() {
      this.$router.push({ path: "/serve/employee_set/employee_set" });
    },
    //管理方法
    manage() {
      this.editGroupDialog = true;
      this.addGroupName = "";
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
    //操作部门方法，添加/add,修改/update,删除/del
    operateGroup(type, id) {
      let params = {};
      let tips = "";
      let url = "";
      switch (type) {
        case "add":
          params = { group_name: this.addGroupName };
          tips = "添加部门成功！";
          url = employee.addGroup;
          break;
        case "update":
          //判断是否有修改的项
          let updateList = this.util.getDiff(
            this.departmentList,
            this.oldDepartmentList
          );
          if (updateList.length == 0) {
            this.$message.warning("没有修改的项!");
            return;
          }
          params = { group_array: updateList };
          tips = "修改部门成功！";
          url = employee.updateGroup;
          break;
        case "del":
          params = { id: id };
          tips = "删除部门成功！";
          url = employee.delGroup;
          break;
      }
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
        .catch(err => {

        });
    },

    //操作员工方法，添加/add,修改/update
    operateEmployee(type) {
      let url = "";
      let tips = "";

      this.util.checkForm(this).then(res => {
        if (type == "add") {
          url = employee.add;
          tips = "添加员工成功！";
        } else {
          url = employee.update;
          tips = "修改员工成功！";
        }
        this.postRequest(url, this.form)
          .then(res => {
            this.$message.success(tips);
            this.back();
          })
          .catch(err => {});
      });
    }
  },
  watch: {
    editGroupDialog(value) {
      if (!value) {
        this.canedit = value;
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import '@/assets/css/color.scss';
.top-nav {
  justify-content: space-between;
  .top-title {
    padding-bottom: 20px;
    padding-top: 35px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    border-bottom: 4px solid $Theme-color;
  }
  .back {
    cursor: pointer;
    .back-one {
      margin-right: -26px;
    }
    .back-two {
      margin-right: 2px;
    }
  }
}
.form-box {
  .short-input /deep/ .el-input {
    width: 220px;
  }
}
.bottom-button {
  margin-top: 30px;
}

/deep/ {
  .el-dialog__body {
    padding: 10px 1.3vw 1.3vw;
  }
  .add_btn{
    background:$Theme-color;
  }
}

.hear {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tip {
    font-size: 12px;
  }
}
</style>