<template>
  <div>
    <el-row>
      <el-col>
        <el-cascader :options="CustomerData" filterable v-model="value" :filter-method="Cfilter"></el-cascader>
      </el-col>
    </el-row>
    <el-dialog title="快速添加客户" append-to-body width="30%" :visible.sync="QaddWin">
      <el-form :model="addform" label-width="80px" :rules="rules" ref="addform">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="addform.name" placeholder="请填写客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="addform.mobile" placeholder="请联系电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="bottomBtn">
        <el-button
          type="success"
          class="color-area"
          @click="confirm"
          :loading="is_loading"
          :disabled="is_loading"
        >保 存</el-button>
        <el-button type="default" class="color-area" @click="closed">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isArray } from "util";
import { stringify } from "querystring";
import { customer, customer_group } from "@config/api.js";

export default {
  props: ["clear"],
  name: "SelectSingleCustomer",
  created() {
    this.getCustomerGroup();
  },
  mounted() {},
  watch: {
    value(val) {
      console.log(val);
      this.$emit("input", val[val.length - 1]);
    },
    clear(value) {
      if (value) {
        this.value = [];
      }
    },
    nodes(value) {
      let temparr = [];
      if (!value.label.includes(this.tempdata)) {
        this.QaddWin = true;
      }
    }
  },
  data() {
    return {
      value: [],
      QaddWin: false,
      addform: {
        group_id: "",
        name: "",
        mobile: ""
      },
      CustomerData: [],
      nodes: {},
      tempdata: "",
      is_loading: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "长度在 2 到 8个字符",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur"
          },
          {
            validator: this.validate.validatePhone,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 这里的轮询迟早是服务器cpu占用率一场高的罪魁祸首，除非整个add页不再被使用。
    Qadd() {},
    async getCustomerGroup() {
      let temparr = {};
      let obj = {};
      let CustomerGroup = await this.getRequest("/customer/serveGetGroup");
      CustomerGroup.forEach((item, index) => {
        temparr = {
          value: item.group_id,
          label: item.group_name,
          children: []
        };
        obj = {
          group_id: item.group_id,
          index: index
        };
        this.CustomerData.push(temparr);
        this.getCustomerList(obj);
      });
      let tempc = CustomerGroup.filter(item => item.group_name == "默认");
      if (tempc.length == 0) {
        let params = {
          group_array: [
            {
              group_name: "默认"
            }
          ]
        };
        await this.postRequest(customer_group.operate, params);
        await this.seachnew();
      } else {
        this.addform.group_id = tempc[0].group_id;
      }
    },
    getCustomerList(data) {
      let obj = {};
      this.getRequest("/customer/serveGetAllSimple", {
        group_id: data.group_id,
        page: 1,
        page_size: 9999
      }).then(res => {
        res.forEach(item => {
          let obj = {
            value: item.id,
            label: item.name
          };
          this.CustomerData[data.index].children.push(obj);
        });
      });
    },
    Cfilter(node, keyword) {
      this.tempdata = keyword;
      this.nodes = node;
      if (node.label.includes(keyword)) {
        return node;
      }
    },
    seachnew() {
      this.getRequest("/customer/serveGetGroup").then(res => {
        console.log("获取数据", res);
        let temparr = res.filter(item => item.group_name == "默认");
        console.log("数组", temparr);
        this.addform.group_id = temparr[0].group_id;
      });
    },
    confirm() {
      this.is_loading = true;
      this.$refs.addform.validate(valid => {
        if (valid) {
          this.postRequest(customer.add, this.addform)
            .then(res => {
              this.$message.success("添加客户成功！");
              this.CustomerData = [];
              this.getCustomerGroup();
              this.is_loading = false;
              this.addform = {
                group_id: "",
                name: "",
                mobile: ""
              };
              this.value.push(res.group_id)
              this.value.push(`${res.id}`)
              this.QaddWin = false;
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          this.is_loading = false;
          return false;
        }
      });
    },
    closed() {
      this.QaddWin = false;
      this.addform = {
        group_id: "",
        name: "",
        mobile: ""
      };
    }
  }
};
</script>

<style>
</style>
