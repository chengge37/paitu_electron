<template>
  <div class="newServe">
    <div class="orderDetail mainInfo">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" :inline="false">
        <!--新增/修改收入，支出表格-->
        <!--<el-card class="card-set" v-if="status!=0">-->
        <div class="info-set">
          <div class="info-title">{{title}}</div>
        </div>

        <el-row :gutter="0">
          <el-form-item :label="is_in==1?'收入类型:':'支出类型:'" prop="type_id">
            <el-select v-model="form.type_id" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                v-if="(item.is_in==1 && is_in==1) || (item.is_in==0 && is_in==0)"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="is_in==1?'收入金额:':'支出金额:'" prop="money">
            <el-input
              type="number"
              v-model="form.money"
              v-only-number="{min:0,precision:2}"
              placeholder="请输入金额(保留2位小数)"
              :disabled="noEdit"
            ></el-input>
          </el-form-item>
          <el-form-item :label="is_in==1?'收入日期:':'支出日期:'" prop="date">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.date"
              type="datetime"
              placeholder="选择日期"
              :disabled="noEdit"
            ></el-date-picker>
          </el-form-item>
          <!--<el-form-item :label="is_in==1?'收入收据:':'支出收据:'">
						<el-input v-model="form.sn_no" :disabled="noEdit"></el-input>
          </el-form-item>-->

          <el-form-item :label="is_in==1?'收入收据:':'支出收据:'">
            <upload-img
              v-if="showImg"
              :showPlus="true"
              :noShowImg="false"
              type="finance"
              @handleSuccess="handleSuccess"
              :imageUrl="form.sn_no?$qiniuHost+form.sn_no:''"
            ></upload-img>
          </el-form-item>

          <el-col :span="10">
            <div style="width:calc(100% + 300px)">
              <el-form-item :label="is_in==1?'收入备注:':'支出备注:'" class="long-input" prop="content">
                <el-input
                  type="textarea"
                  v-model="form.content"
                  :disabled="noEdit"
                  show-word-limit
                  placeholder="请输入2-256字符内容"
                  minlength="2"
                  maxlength="256"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottomBtn">
      <el-button type="primary" @click="add" v-if="this.status!=3" v-permission>确定</el-button>
      <!--<el-button type="primary" @click="add"  v-if="this.status!=3">确定并继续新增</el-button>-->
      <el-button type="primary" @click="update(form.id)" v-if="this.status==3" v-permission>修改</el-button>
      <el-button type="default" @click="toList" v-if="this.status!=3" v-permission>取消</el-button>
      <el-button type="default" @click="back" v-if="this.status==3" v-permission>返回</el-button>
    </div>
  </div>
</template>

<script>
import { finance } from "@config/api.js";
import { storage } from "@util/storage.js";
import uploadImg from "ServeComponents/UploadImg";
export default {
  data: () => ({
    dataType: "",
    title: "",
    form: {},
    rules: {
      type_id: [
        {
          required: true,
          message: "请选择类型",
          trigger: "blur"
        }
      ],
      date: [
        {
          required: true,
          message: "请选择日期",
          trigger: "blur"
        }
      ],
      money: [
        {
          required: true,
          message: "请输入金额",
          trigger: "blur"
        }
      ],
      content: [
        {
          required: true,
          message: "请输入内容",
          trigger: "blur"
        },
        {
          min: 2,
          max: 256,
          message: "长度在 2到 256个字符",
          trigger: "blur"
        }
      ]
    },
    status: 0,
    is_in: Number,
    typeList: [], //类型列表
    removeType: [8, 9, 10], //排除不能添加的类型，系统影棚订单收入，系统设备订单收入，系统活动订单收入
    dataTypeList: [
      {
        label: "支出",
        value: "0"
      },
      {
        label: "收入",
        value: "1"
      }
    ],
    options: [],
    value: "",
    noEdit: false,
    updateId: "", //需要修改的ID
    showImg: true //是否显示图片
  }),

  components: { uploadImg },

  async created() {
    await this.getTypeList();
    let data = this.$route.query;
    let status = "";
    console.log("data-------", data);
    if (data.status) {
      status = data.status;
    }
    if (data.id) {
      this.updateId = data.id;
      this.getFinanceDetail();
    }
    this.status = status;
    console.log("status-----", status);
    // 0为查看详情，1为修改，2为添加
    switch (parseInt(status)) {
      case 0:
        this.title = "新增数据";
        break;
      case 1:
        this.title = "新增收入";
        this.is_in = 1;
        break;
      case 2:
        this.title = "新增支出";
        this.is_in = 0;
        break;
      default:
        this.title = "修改信息";
        break;
    }
    console.log("this.is_in", this.is_in);
  },
  mounted() {
    this.getTypeList();
  },
  methods: {
    //获取财务详情
    getFinanceDetail() {
      this.util.getFinanceDetail(this.updateId).then(res => {
        console.log("getFinanceDetail--------", res);
        this.is_in = res.is_in;
        this.form = res;
        this.reloadImg();
      });
    },

    //获取支出/收入类型列表
    getTypeList() {
      return new Promise((resolve, reject) => {
        this.util
          .getFinanceType()
          .then(res => {
            let list = [];
            //排除不能添加的选项
            res.forEach((item, index) => {
              let i = this.removeType.indexOf(parseInt(item.id));
              if (i < 0) {
                list.push(item);
              }
            });

            this.transData(list);
            this.typeList = list;
            resolve(true);
          })
          .catch(err => {
            resolve(true);
          });
      });
    },
    //取消返回按钮
    toList() {
      let path = "/serve/finance_set/finance_set";
      this.$router.push({
        path: path,
        query: {
          index: this.status
        }
      });
    },
    back() {
      this.util.back(this);
    },
    //添加收入/支出方法
    add() {
      console.log("保存方法---", this.form);
      this.util.checkForm(this).then(res => {
        if (res) {
          console.log("add-----", res);
          this.postRequest(finance.add, this.form).then(res => {
            this.$message.success("保存成功！");
            this.toList();
          });
        }
      });
    },
    //修改收入/支出方法
    update(id) {
      this.form.id = id;
      console.log("修改收入/支出方法---", this.form);
      this.postRequest(finance.update, this.form)
        .then(res => {
          this.$message.success("修改成功！");
          this.toList();
        })
        .catch(err => {});
    },
    //转换类型方法和时间
    transData(list) {
      list.forEach((item, index) => {
        if (this.form.type_id == item.id) {
          this.form.type_id = item.name;
        }
      });
    },

    //图片上传回调方法
    handleSuccess(key) {
      this.form.sn_no = key;
      this.reloadImg();
    },

    //重新加载图片
    reloadImg() {
      console.log("reloadImg------");
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.card-set {
  margin-bottom: 14px;
}

.orderDetail {
  padding: 30px;
}

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

.line {
  margin-bottom: 15px;
  margin-top: 10px;
}

.textare {
  margin-left: 20px;
  margin-right: 20px;
}

.form-box {
  .short-input /deep/ .el-input {
    width: 220px;
  }
}

/deep/ {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}

/deep/ {
  .el-textarea {
    min-height: 130px;
    .el-textarea__inner {
      min-height: 130px !important;
      border-radius: 0px;
    }
  }
}

.bottom-button {
  margin-top: 20px;
}
</style>