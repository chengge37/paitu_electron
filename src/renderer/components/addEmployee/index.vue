<!--  -->
<template>
  <div>
    <div class="fouth-row">
      <ali-svg-icon icon-class="gerenziliao" class-name="icon"></ali-svg-icon>
      <span>执行人</span>
      <div class="select-box">
        <el-dialog title="添加员工" width="30%" :visible.sync="innerVisible" append-to-body>
          <el-cascader
            :options="menberOptions"
            v-model="checkArr"
            :props="{ multiple: true }"
            clearable
          ></el-cascader>
          <span slot="footer" class="bottomBtn">
            <el-button type="success" @click="confirm">确 定</el-button>
            <el-button type="default" class="color-area" @click="closed">取 消</el-button>
          </span>
        </el-dialog>
      </div>
      <i class="el-icon-circle-plus-outline" v-if="!isEdit" @click="openadd"></i>
      <div class="menber-list">
        <span :title="item" class="menber" v-for="(item,index) in NameArr" :key="index">{{item[0]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    get_group_url: {},
    get_employee_url: {},
    isEdit: {
      type: Boolean,
      default: false
    },
    prop_plist: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    innerVisible: false,
    menberOptions: [],
    checkArr: [],
    NameArr: []
  }),

  components: {},

  mounted() {},
  created() {
    // this.getStaffGroup();
    console.error('addEmployee--------',this.prop_plist);
    this.getMember();
    this.NameArr = this.prop_plist
  },
  computed: {
    ...mapGetters(["user_data"])
  },
  methods: {
    openadd() {
      this.innerVisible = true;
    },
    closed() {
      this.innerVisible = !this.innerVisible;
    },
    confirm() {
      let endIdArr = [];
      let TempArr = [...this.checkArr];
      this.NameArr = []
      TempArr.forEach(item => {
        this.menberOptions.forEach(each => {
          if (each.value == item[0]) {
            each.children.forEach(every => {
              if (every.value == item[1]) {
                this.NameArr.push(every.label);
                endIdArr.push(every.value);
              }
            });
          }
        });
      });
      this.$emit("getemployeelist", endIdArr);
      this.innerVisible = false
    },
    //异步函数
    async getMember() {
      this.menberOptions = [];
      let groups = await this.getRequest(this.get_group_url);
      let promiseArr = [];
      for (let i = 0; i < groups.length; i++) {
        let obj = {
          value: groups[i].group_id,
          label: groups[i].group_name,
          children: []
        };
        this.menberOptions.push(obj);
        promiseArr.push(
          this.getRequest(this.get_employee_url, {
            page: 1,
            page_size: 9999,
            group_id: groups[i].group_id
          })
        );
      }
      Promise.all(promiseArr).then(res => {
            for (let j = 0; j < res.length; j++) {
              res[j].rows.forEach(item => {
                let obj = {
                  value: item.id,
                  label: item.nick,
                  mobile: item.mobile
                };
                this.menberOptions[j].children.push(obj);
              });
            }
            this.fillSelf();
          });
    },
    //填充管理员
    fillSelf() {
      //之后填充管理员进去
      console.log("之后填充管理员进去", this.menberOptions);
      this.menberOptions.forEach((item, index) => {
        if (item.children) {
          item.children.forEach(item1=>{
            if (item1.mobile == this.user_data.mobile) {
              this.checkArr.push([item.value, item1.value]);
            console.log(this.checkArr, "[]kkkk");
            this.confirm();
            }
          })
        }
      });
      console.log("哈哈哈");
    },
    // 获取员工分组
    getStaffGroup() {
      this.menberOptions = [];
      this.getRequest(this.get_group_url)
        .then(res => {
          res.forEach((item, index) => {
            let obj = {
              value: item.group_id,
              label: item.group_name,
              children: []
            };
            this.menberOptions.push(obj);
            this.getStaff(item.group_id, index);
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 根据员工分组获取员工
    getStaff(groupId, i) {
      this.getRequest(this.get_employee_url, {
        page: 1,
        page_size: 9999,
        group_id: groupId
      })
        .then(res => {
          res.rows.forEach((item, index) => {
            let obj = {
              value: item.id,
              label: item.nick,
              mobile: item.mobile
            };
            this.menberOptions[i].children.push(obj);
          });
          console.log(this.menberOptions);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  watch: {
    setpeople(value) {
      console.log(value);
      if (value.indexOf("请选择") === -1) {
        this.group_id = value;
        this.get_employee();
      }
    },
    selected_people(value) {
      this.$emit("getemployeelist", value);
    },
    prop_plist(value) {
      this.selected_people = value;
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.short-input /deep/ .el-input {
  width: 220px;
}
.long-input /deep/ .el-input {
  width: 100%;
}
.table {
  width: calc(100% + 300px);
  input {
    background: none;
    outline: none;
    border: 0px;
    height: 40px;
    width: 80%;
  }
  .dele {
    width: 100%;
    height: 100%;
  }
}
.table /deep/ .el-table th {
  padding: 0;
}
.table /deep/ .el-table__body {
  height: 50px;
}
.fouth-row {
  display: flex;
  align-items: center;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .icon + span {
    width:90px;
    display:inline-block;
  }
  .el-icon-circle-plus-outline {
    font-size: 30px;
    cursor: pointer;
    margin-right: 10px;
  }
  .menber-list {
    display: flex;
    flex-wrap: wrap;
    .menber {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #7c6aff;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .menber + .menber {
      margin-left: 5px;
    }
  }
}
</style>
