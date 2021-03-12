<!--  -->
<template>
  <div class="app-container">
    <div class="top-nav">
      <el-tabs v-model="tabIndex" type="card">
        <!--短信管理-->
        <el-tab-pane label="短信管理" name="0"></el-tab-pane>
      </el-tabs>

      <div class="top-right">
        <span class="sms">
          剩余短信：
          <!--<span>{{leftCount}}</span>条短信）-->
        </span>
        <span class="money">{{leftCount}}条</span>
        <!--<span class="money">￥{{balance}}</span>-->
        <el-button type="warning" size="mini" @click="charge()" v-permission>充值</el-button>
      </div>
    </div>

    <div class="line"></div>

    <div class="top-operate">
      <!-- 添加模板按钮 -->
      <el-button type="text" @click="addTemp()" v-permission>
        <i class="el-icon-plus"></i>
        <span class="word">新增模板</span>
      </el-button>
      <el-button type="text">
        <i class="el-icon-document-copy"></i>
        <router-link to="MsmHistory">
          <span class="word">发送历史</span>
        </router-link>
      </el-button>
    </div>

    <!--模板列表-->
    <div
      class="template template_one"
      :class="temp.checked ? active : ''"
      v-for="(temp,index) in templates"
      :key="index"
    >
      <div class="top">
        <p class="bold_title">
          <el-checkbox v-model="temp.checked" :checked="temp.checked" @change="checkChange(index)"></el-checkbox>
          <span class="title">{{temp.name}}</span>

          <span class="value">
            （
            <span>{{temp.vars.length}}</span>个变量）
          </span>

          <span class="top_show" v-show="temp.show" @click.stop="showMsg(index)">
            收起
            <i class="el-icon-caret-top"></i>
          </span>
          <span class="top_show" v-show="!temp.show" @click.stop="showMsg(index)">
            展开
            <i class="el-icon-caret-bottom"></i>
          </span>
        </p>
      </div>

      <div class="body">
        <el-form ref="form" label-width="80px">
          <div>
            <span v-html="refreshDemo(index)"></span>
            <ali-svg-icon icon-class="question" class-name="question-one"></ali-svg-icon>
          </div>
          <div ref="body" v-show="temp.show">
            <div class="body_variables">
              <div v-for="(variable,i) in temp.vars" :key="i">
                <el-form-item :label="variable.var_name">
                  <el-input
                    @click.prevent.self="alert(2)"
                    size="mini"
                    v-model="variable.content"
                    :maxlength="variable.var_length"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <!--选择客户 整个页面一套就可以 不用嵌套在模板之中 -->
    <div>
      <div class="top style">
        <el-row>
          <el-col :span="24">
            <div class="bold_title chos">
              <div>选择发送的客户</div>
              <div>
                <span class="yellow_title" @click="addCustom">手动添加</span>
              </div>
              <div class="cus_btn">
                <el-input
                  class="input"
                  size="mini"
                  v-model="searchContent"
                  placeholder="请输入用户姓名或电话模糊搜索"
                ></el-input>
                <el-button class="search" size="mini" type="primary" @click="search">搜索</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>

      <el-row>
        <el-col :span="16">
          <el-row style="padding-bottom:5px">
            <el-col :span="8">
              <el-select
                size="small"
                @change="groupChange"
                v-model="selectGroupId"
                placeholder="请选择客户的组别"
              >
                <el-option
                  v-for="(item,index) in groupTempWithAllArray"
                  :key="index"
                  :label="item.group_name"
                  :value="item.group_id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button size="small" type="primary" @click="addGroup">添加整组</el-button>
            </el-col>
          </el-row>

          <el-table
            v-if="groupDone"
            :data="userArray"
            style="width: 100%"
            v-loading="customerLoading"
          >
            <el-table-column label="分组" prop="group_name" width="200px"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="添加">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :type="scope.row.isSelected?'primary':''"
                  :icon="scope.row.isSelected?'el-icon-check':'el-icon-check'"
                  @click="add(scope.$index)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column label="排除">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="disableExclude(scope.$index)"
                  :key="scope.row.time"
                  :ref="scope.$index+'ex'"
                  v-bind:type="excludeBtnType(scope.$index)"
                  :icon="scope.row.isSelected?'el-icon-check':'el-icon-check'"
                  @click="exclude(scope.$index,scope)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="getUserList"
            :current-page.sync="loadCustomerParam.page"
            :page-size="loadCustomerParam.page_size"
            :total="customerTotalCount"
            style="text-align:right"
          ></el-pagination>
        </el-col>
        <el-col :span="8" style="padding-top:37px;padding-left:20px;">
          <el-table :data="selectArray" style="width: 100%" v-loading="customerLoading">
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type == 1">单个客户</el-tag>
                <el-tag v-if="scope.row.type == 2">分组</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="名称/电话(分组)">
              <template slot-scope="scope">
                <el-row :ref="scope.$index+'selectName'">{{ selectShowName(scope.row)}}</el-row>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="removeSelect(scope.$index)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="right_btn">
            <el-button class="buttom_cancel" slot="right-footer" size="small" @click="cancelMsm">取消</el-button>
            <el-button class="buttom_send" type="primary" slot="right-footer" size="small" @click="sendSms" v-permission>发送</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 手动添加弹出层 -->
    <el-dialog title="手动添加客户" :visible.sync="dialogVisible" width="30%">
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        ref="userForm"
        :rules="rules"
        :model="userForm"
      >
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="客户分组" prop="group_id">
          <el-select v-model="userForm.group_id" placeholder="请选择客户的组别" style="width:100%">
            <el-option
              v-for="o in groupTempArray"
              :key="o.group_id"
              :label="o.group_name"
              :value="o.group_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogVisible = false" class="buttom_cancel">取 消</el-button>
          <el-button type="primary" @click="saveCustomInfo('userForm')" class="buttom_sure">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增短信模板 -->
    <addTplDialog
      :show="addTplDialogVisable"
      v-on:closeAddTplDialogMsg="addTplDialogVisable = false"
      v-on:refreshTplMsg="loadTemplate()"
    ></addTplDialog>
  </div>
</template>

<script>
import { customer, customer_group, sms } from "@config/api.js";
import _ from "lodash";
import { isArray } from "util";
import addTplDialog from "./addTplDialog.vue";
export default {
  components: {
    addTplDialog
  },
  data() {
    return {
      searchContent: "",
      selectGroupId: null,
      customerLoading: false,
      groupDone: true,
      active: "active",
      tabIndex: "0", //头部 el-tabs
      balance: "0.00", //余额
      addTplDialogVisable: false, //新增模板

      dialogVisible: false, //弹出层dialog一开始隐藏
      labelPosition: "right", //弹出层dialog的label位置
      userForm: {
        //弹出层dialog添加客户的表单信息
        name: "",
        mobile: "",
        group_id: ""
      },
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
            required: true,
            validator: this.validate.validatePhone,
            trigger: "blur"
          }
        ],
        group_id: [
          {
            required: true,
            message: "请选择分组",
            trigger: "blur"
          }
        ]
      },
      templates: [], //短信模板
      groupTempArray: [], //临时组别id数据
      groupTempWithAllArray: [],
      customerTotalCount: 0,
      loadCustomerParam: {
        page: 1,
        page_size: 10
      },
      userArray: [], //左边table数据
      selectArray: [], //已选客户(右边table)数据
      leftCount: 0 //剩余短信条数
    };
  },
  mounted() {
    this.getBalance();
    this.getUserGroup();
    this.loadTemplate();
    this.getSmsNum();
  },
  methods: {
    //获取商家短信条数
    getSmsNum() {
      this.util.getSmsNum().then(res => {
        console.log("getSmsNum---------", res);
        this.leftCount = res;
      });
    },

    checkChange(index) {
      console.log("checkChange----------", index, this.templates);
      if (this.templates[index].checked) {
        this.templates.forEach((item, i) => {
          if (i != index) {
            item.checked = false;
          }
        });
      }
    },
    //搜索用户方法
    search() {
      this.getUserList();
    },
    removeSelect(index) {
      this.selectArray.splice(index, 1);
      this.refreshLeftSelect();
    },
    exclude(index, scope) {
      //排除
      console.log("exclude", this.$refs);
      let customer = this.userArray[index];
      let exculeIndex = this.getGroupInSelectArrayByCustomerIndex(index);
      console.log("exclude exculeIndex ", exculeIndex);
      let isAdd2Exclude = false;
      if (exculeIndex == -1) {
        console.log("XXXXXX");
        return;
        //??BUG才来这里
      } else {
        let selectItem = this.selectArray[exculeIndex];
        if (
          selectItem.excludeArray !== undefined &&
          isArray(selectItem.excludeArray)
        ) {
          //如果存在就是删除咯
          let existIndexInExclude = _.findIndex(
            selectItem.excludeArray,
            excludeItem => {
              return excludeItem.id == customer.id;
            }
          );
          if (existIndexInExclude >= 0) {
            console.log("删除");
            _.remove(selectItem.excludeArray, item => {
              return item.id == customer.id;
            });
          } else {
            console.log("添加1");
            selectItem.excludeArray.push({
              id: customer.id,
              name: customer.name
            });
            isAdd2Exclude = true;
          }
        } else {
          console.log("添加2");
          selectItem.excludeArray = [
            {
              id: customer.id,
              name: customer.name
            }
          ];
          isAdd2Exclude = true;
        }
      }
      console.log("触发", this.$refs[exculeIndex + "selectName"]);
      this.$refs[exculeIndex + "selectName"].$parent.$forceUpdate();
      console.log("customer = ", customer);
      customer.isSelected = !isAdd2Exclude;
    },
    excludeBtnType(index) {
      //判断在不在 对应的group的排除列表里
      let style = "";
      if (index == 0) {
        // console.log('excludeBtnType', index)
      }

      let customer = this.userArray[index];
      let selectExistGroup = _.find(this.selectArray, selectItem => {
        return selectItem.type == 2 && selectItem.id == customer.group_id;
      });
      if (!selectExistGroup) {
        style = "";
      } else {
        if (
          selectExistGroup.excludeArray !== undefined &&
          isArray(selectExistGroup.excludeArray)
        ) {
          let existIndexInExclude = _.findIndex(
            selectExistGroup.excludeArray,
            excludeItem => {
              return excludeItem.id == customer.id;
            }
          );
          style = existIndexInExclude >= 0 ? "danger" : "";
        } else {
          style = "";
        }
      }
      if (index == 0) {
        console.log("excludeBtnType", style);
      }
      return style;
    },
    selectShowName(row) {
      console.log("selectShowName");
      if (row.type == 1) {
        return row.name;
      } else {
        if (row.excludeArray !== undefined && isArray(row.excludeArray)) {
          let str = row.name;
          for (let i = 0, n = row.excludeArray.length; i < n; i++) {
            let excludeItem = row.excludeArray[i];
            if (i == 0) {
              str += " 排除列表[" + excludeItem.name + "]";
            } else if (i == n - 1) {
              str = str.replace(/]/, "");
              str += "," + excludeItem.name + "]";
            } else {
              str += "," + excludeItem.name;
            }
          }
          return str;
        } else {
          return row.name;
        }
      }
    },
    getGroupInSelectArrayByCustomerIndex(index) {
      let customer = this.userArray[index];
      let selectExistGroupIndex = _.findIndex(this.selectArray, selectItem => {
        return selectItem.type == 2 && selectItem.id == customer.group_id;
      });
      return selectExistGroupIndex;
    },
    disableExclude(index) {
      let customer = this.userArray[index];
      let existGroup = _.find(this.selectArray, selectItem => {
        return selectItem.type == 2 && selectItem.id == customer.group_id;
      });
      if (!existGroup) {
        return true;
      }
      return false;
    },
    add(index) {
      let customer = this.userArray[index];
      customer.isSelected = !customer.isSelected;
      let existIndexOfTypeCustomer = _.findIndex(this.selectArray, item => {
        return item.id == customer.id && item.type == 1;
      });
      let existIndexOfTypeGroup = _.findIndex(this.selectArray, item => {
        return item.id == customer.group_id && item.type == 2;
      });
      console.log(
        "customer.isSelected = ",
        customer.isSelected,
        existIndexOfTypeCustomer,
        existIndexOfTypeGroup
      );
      if (customer.isSelected) {
        //添加动作
        if (existIndexOfTypeCustomer < 0 && existIndexOfTypeGroup < 0) {
          // 都不存在
          this.selectArray.push({
            type: 1,
            id: customer.id,
            group_id: customer.group_id,
            name: customer.name
          });
        } else if (existIndexOfTypeGroup >= 0) {
          //分组存在
          //查询出来存在的数组
          let selectExistGroup = this.selectArray[existIndexOfTypeGroup];
          if (
            selectExistGroup.excludeArray !== undefined &&
            isArray(selectExistGroup.excludeArray)
          ) {
            let existIndexInExclude = _.findIndex(
              selectExistGroup.excludeArray,
              excludeItem => {
                return excludeItem.id == customer.id;
              }
            );
            if (existIndexInExclude >= 0) {
              //右表group 排除列表里有 添加就从排除列表删除
              selectExistGroup.excludeArray.splice(existIndexInExclude, 1);
            } else {
              //提示 在组里
              console.log("已经在组里");
              this.$message.info("已经添加过用户所在的组");
            }
          } else {
            //提示 在组里
            console.log("已经在组里");
            this.$message.info("已经添加过用户所在的组");
          }
        } else if (existIndexOfTypeCustomer > 0) {
          //单客户存在
          this.$message.info("已经添加过用户");
        }
      }
      this.userArray[index] = customer;
      let exculeIndex = this.getGroupInSelectArrayByCustomerIndex(index);
      if (exculeIndex >= 0) {
        this.$refs[exculeIndex + "selectName"].$parent.$forceUpdate();
      }
    },
    addGroup() {
      //添加整组
      if (this.selectGroupId === null) {
        this.$message.warning("先选择组");
        return;
      }
      if (this.selectGroupId == 0) {
        //所有用户删除
        let newSelectArray = [];
        this.groupTempArray.forEach(groupItem => {
          newSelectArray.push({
            type: 2,
            id: groupItem.group_id,
            name: groupItem.group_name
          });
        });
        this.selectArray = newSelectArray;
      } else {
        let existIndex = _.findIndex(this.selectArray, item => {
          return item.id == this.selectGroupId;
        });
        if (existIndex >= 0) {
          this.$message.info("已经添加过本组");
        } else {
          let groupItem = _.find(this.groupTempArray, item => {
            return item.group_id == this.selectGroupId;
          });
          this.selectArray.push({
            type: 2,
            id: groupItem.group_id,
            name: groupItem.group_name
          });
          //把已经添加过的单个组内删除
          _.remove(this.selectArray, item => {
            return item.type == 1 && item.group_id == groupItem.group_id;
          });
        }
      }
      this.refreshLeftSelect();
    },
    refreshLeftSelect() {
      console.log("refreshLeftSelect", this.userArray, this.selectArray);
      for (let i = 0, n = this.userArray.length; i < n; i++) {
        let customer = this.userArray[i];
        console.log("检查 customer", customer);
        let shouldSelect = false;
        for (let j = 0, k = this.selectArray.length; j < k; j++) {
          let selectItem = this.selectArray[j];
          if (selectItem.type == 1) {
            if (selectItem.id == customer.id) {
              shouldSelect = true;
              continue;
            }
          } else {
            if (customer.group_id == selectItem.id) {
              let inExcule = false;
              if (
                selectItem.excludeArray !== undefined &&
                isArray(selectItem.excludeArray)
              ) {
                let existIndexInExclude = _.findIndex(
                  selectItem.excludeArray,
                  excludeItem => {
                    return excludeItem.id == customer.id;
                  }
                );
                if (existIndexInExclude >= 0) {
                  inExcule = true;
                }
              }
              if (!inExcule) {
                shouldSelect = true;
              }
            } else {
              continue;
            }
          }
        }
        customer.isSelected = shouldSelect;
        console.log("检查 customer 结果", customer.isSelected);

        this.userArray[i] = customer;
      }
      console.log("userArray[i]--after------", this.userArray);
    },
    //选择分组 过滤客户
    groupChange(val) {
      console.log("groupchange " + val);
      this.selectGroupId = val;
      this.getUserList();
    },
    //refresh短信变量
    refreshDemo(index) {
      console.log("refreshDemo--------------", index);
      let templateItem = this.templates[index];
      console.log("refreshDemo " + index + templateItem.checked);
      return this.genSmsText(templateItem, true);
    },
    genSmsText(templateItem, isHtml) {
      //isHtml  true的时候返回网页用的 false 发给后台用
      let ori = templateItem.template;

      for (let i = 0, n = templateItem.vars.length; i < n; i++) {
        let varObj = templateItem.vars[i];
        console.log("----", varObj);

        if (varObj.content != "") {
          ori = ori.replace(
            varObj.var_key,
            isHtml
              ? '<span class="varColor">' + varObj.content + "</span>"
              : varObj.content
          );
        } else {
          let index = i + 1;
          ori = ori.replace(
            varObj.var_key,
            isHtml
              ? '<span class="varColor">' + varObj.var_name + "</span>"
              : varObj.var_name
          );
        }
      }
      return ori;
    },
    //获取所有客户 不分页 暂时不考虑性能
    getUserGroup() {
      this.getRequest(customer_group.getAll)
        .then(resq => {
          if (resq) {
            console.log(
              "getUserGroup----------525555555555555555555555555555555555",
              resq
            );
            this.groupTempArray = resq;
            var all = [
              {
                group_id: 0,
                group_name: "全部"
              }
            ];
            this.groupTempArray.forEach(item => {
              all.push(item);
            });
            this.groupTempWithAllArray = all;
            //                      this.groupDone = true;
            console.log(
              "this.groupTempWithAllArray  = ",
              this.groupTempWithAllArray
            );
            this.getUserList();
          }
        })
        .catch(err => {});
    },
    getUserList() {
      console.log("getUserList");
      let p = this.loadCustomerParam;
      p.simple = 1;
      p.search = this.searchContent;
      p.group_id = this.selectGroupId;
      this.customerLoading = true;
      this.getRequest(customer.getAll, p)
        .then(resq => {
          this.customerLoading = false;
          if (resq) {
            console.log(resq);
            let timestamp = Date.parse(new Date());
            let index = 1;
            resq.rows.forEach(item => {
              item.isSelected = false;
              item.time = timestamp + index;
              item.isSelected = this.isCustomerSelected(item);
            });
            this.userArray = resq.rows;
            this.loadCustomerParam.page = parseInt(resq.page);
            this.loadCustomerParam.page_size = parseInt(resq.page_size);
            this.customerTotalCount = parseInt(resq.total_count);
          }
        })
        .catch(err => {
          this.customerLoading = false;
        });
    },
    isCustomerSelected(customer) {
      let selected = false;
      this.selectArray.forEach(selectItem => {
        if (selectItem.type == 1) {
          if (selectItem.id == customer.id) {
            selected = true;
          }
        } else {
          if (selectItem.id == customer.group_id) {
            if (
              selectItem.excludeArray !== undefined &&
              isArray(selectItem.excludeArray)
            ) {
              let inExcule = false;
              _.forEach(selectItem.excludeArray, (index, excludeItem) => {
                if (excludeItem.id == customer.id) {
                  inExcule = true;
                  //跳出forEach 不是返回 false
                  return false;
                }
              });
              return !inExcule;
            } else {
              selected = true;
            }
          }
        }
      });
      return selected;
    },
    loadTemplate() {
      console.log("sms.getTemplate " + sms.getTemplate);
      this.getRequest(sms.getTemplate)
        .then(resq => {
          console.log("####", resq);
          if (
            resq &&
            Object.prototype.toString.call(resq) === "[object Array]"
          ) {
            let templateArray = [];
            let regex = /#(.+?)#/g;
            for (let i = 0, n = resq.length; i < n; i++) {
              let oriTemplate = resq[i];
              let result = regex.test(oriTemplate.template);
              let matchArray = oriTemplate.template.match(regex);
              console.log("matchArray", matchArray);
              if (
                matchArray == undefined ||
                matchArray.length !== oriTemplate.vars.length
              ) {
                console.log("出错啦");
                break;
              } else {
                console.log("没有出错");
              }
              oriTemplate.checked = i === 0;
              oriTemplate.show = i === 0;
              oriTemplate.vars.forEach(varObj => {
                varObj.content = "";
              });

              console.log("#---#", oriTemplate);
              this.templates.push(oriTemplate);
            }
          } else {
            console.log("sms getTemplate不是数组");
          }
          //默认第一个模板
        })
        .catch(err => {});
    },
    //添加客户
    saveCustomInfo(formName) {
      console.log(this.userForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(123);
          this.postRequest(customer.add, this.userForm)
            .then(res => {
              this.getUserGroup(); //重新加载数据
              this.$message.success("添加客户成功！"); //提示添加成功
              this.dialogVisible = false; //关闭弹层
              this.$refs[formName].resetFields(); //表格数据清空
            })
            .catch(err => {
              return false;
            });
        } else {
          return false;
        }
      });
    },
    //取消
    cancelMsm() {
      this.selectArray = [];
    },
    // 发送
    sendSms() {
      let selectTemplate = _.find(this.templates, item => {
        return item.checked;
      });
      console.log("selectTemplate = ", selectTemplate);
      if (!selectTemplate || selectTemplate === undefined) {
        this.$alert("请先选择短信模板", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      //先判断所选模板变量是否都输入了
      let varEmpty = false;
      _.forEach(selectTemplate.vars, varObj => {
        if (varObj.content == "") {
          varEmpty = true;
          return false;
        }
      });
      if (varEmpty) {
        this.$alert("所选模板还有变量为空", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      var smsText = this.genSmsText(selectTemplate, false);
      if (this.selectArray.length == 0) {
        this.$alert("没有选择要发送的客户", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      let customText = "";
      for (let i = 0, n = this.selectArray.length; i < n; i++) {
        let selectItem = this.selectArray[i];
        if (selectItem.type == 1) {
          customText += selectItem.name;
        } else {
          customText += selectItem.name;
          if (
            selectItem.excludeArray !== undefined &&
            isArray(selectItem.excludeArray)
          ) {
            customText += "[排除列表:";
            for (let j = 0, k = selectItem.excludeArray.length; j < k; j++) {
              let exclueItem = selectItem.excludeArray[j];
              if (j == k - 1) {
                customText += exclueItem.name + "]";
              } else {
                customText += exclueItem.name + ",";
              }
            }
          }
        }
        if (i != n - 1) {
          customText += ",";
        }
      }
      console.log("customText " + customText);
      //生成要发送的文字
      this.$confirm(
        '是否确认发送<span style="color: $Theme-color">' +
          smsText +
          "</span>模板，发送信息给" +
          customText,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          type: "warning"
        }
      )
        .then(() => {
          let sendSmsParamter = {
            text: smsText,
            select_array: this.selectArray,
            template_id: selectTemplate.id
          };
          this.postRequest(sms.send, sendSmsParamter)
            .then(res => {
              this.$message({
                type: "success",
                message: "发送成功!"
              });
              this.getBalance();
            })
            .catch(err => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发送"
          });
        });
    },
    //获取余额
    getBalance() {
      this.util
        .getBalance()
        .then(res => {
          console.log("getBalance-----------", res);
          this.balance = res;
        })
        .catch(err => {});
    },
    //充值方法
    charge() {
      this.$router.push('MsmCharge')
      console.log("charge----");
    },
    //展开收起
    showMsg(index) {
      this.templates[index].show = !this.templates[index].show;
    },
    // 选择模板
    chooseTemplate(index) {
      console.log("chooseTemplate");
      this.templates[index].checked = !this.templates[index].checked;
      for (let i = 0; i < this.templates.length; i++) {
        if (i !== index) {
          this.templates[i].checked = false;
        }
      }
    },

    onSubmit() {
      console.log("submit！");
    },
    addCustom() {
      this.dialogVisible = true;
    },
    addTemp() {
      this.addTplDialogVisable = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 1px;
}

.app-container {
  background: #fff;
  min-width: 800px;
}

.top-nav {
  height: auto;
  padding-top: 50px;
  display: flex;
  justify-content: space-between;
}

.top-right {
  margin-top: -20px;
  display: flex;
  align-items: center;

  .sms {
    color: #999;
  }

  .money {
    font-size: 26px;
    color: $Theme-color;
    font-weight: bold;
    margin-right: 1vw;
  }
}

.top-operate {
  display: flex;
  justify-content: space-between;
}

.line {
  margin-top: -16px;
  margin-bottom: 5px;
}

.template {
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 10px;
  cursor: defalt;

  .top {
    background: rgba(245, 248, 254, 1);
    height: 54px;
    line-height: 54px;
    padding-left: 20px;

    .top_show {
      float: right;
      padding-right: 20px;
      color: #e9b53b;
      font-weight: 400;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .body {
    padding: 20px 50px;

    /deep/ .el-input__count-inner {
      margin-bottom: 2px;
    }

    .show {
      display: none;
    }

    .question-one {
      color: #e9b53b;
      cursor: pointer;
    }

    .body_variables {
      margin-top: 18px;
    }

    & > div {
      margin-bottom: 20px;
    }
  }
}

.right_btn {
  text-align: right;
  margin-top: 10px;
}

/deep/ .el-checkbox__label:hover {
  color: $Theme-color;
}

/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: $Theme-color;
}

/deep/ .el-transfer__button {
  background-color: $Theme-color;
  border: 1px solid $Theme-color;
}

/deep/ .el-transfer__button.is-disabled {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

/deep/ .el-transfer {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .el-transfer-panel {
    width: 350px;
    max-width: 350px;

    .el-transfer-panel__footer {
      text-align: right;
      padding-right: 5px;
    }

    .el-checkbox__label {
      .small {
        font-size: 10px;
        float: right;
        color: rgb(172, 165, 165);
      }
    }
  }
}

/deep/ .el-transfer-panel__body {
  height: 446px;
}

/deep/ .el-transfer-panel__list.is-filterable {
  height: 380px;
}

.yellow_title {
  margin-left: 19px;
  border: 1px solid rgba(233, 181, 59, 1);
  border-radius: 15px;
  padding: 4px;
  color: #e9b53b !important;
  font-size: 14px !important;
  cursor: pointer;
  font-weight: normal !important;
}

.yellow_title:hover {
  color: rgba(233, 181, 59, 0.5) !important;
}

.style {
  margin-bottom: 20px;
}

.custom {
  margin-top: 14px;
  overflow: hidden;

  .custom_table {
    width: 45%;
    float: left;

    .table_style {
      width: 100%;
    }

    .group_select {
      padding: 0;
      width: 125px;
      vertical-align: middle;
    }

    .company {
      float: left;
    }

    .myphone {
      padding-left: 10px;
      text-align: right;
    }

    .custom_search {
      vertical-align: middle;

      /deep/ .el-icon-search {
        padding-left: 10px;
      }
    }

    /deep/ .gutter {
      background-color: rgba(245, 248, 254, 1);
    }
  }

  .custom_choose {
    float: right;
  }
}

.transferText {
  margin: 0 15px 0 0;
}

/deep/ .buttom_cancel {
  border: 1px solid $Theme-color;
  border-radius: 2px;
  color: $Theme-color;
}

/deep/ .buttom_send {
  border: 1px solid $Theme-color;
  background: $Theme-color;
  border-radius: 2px;
  color: #fff;
}

/*/deep/ .buttom_send:hover {
  opacity:0.8;
}*/

.template_one {
  margin-bottom: 30px;
}

.bold_title {
  /deep/ .el-checkbox {
    margin-right: 0;
  }

  font-size: 16px;
  color: #333;
  font-weight: 400;

  .yellow_title {
    font-size: 16px;
    color: #333;
  }
  .title {
    margin-left: 6px;
    font-weight: bold;
  }
  .value {
    color: #999999;
  }
}

.bold_title.chos {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .cus_btn {
    margin-left: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .input {
      width: 220px;
    }

    .search {
      margin-left: 12px;
    }
  }
}

/deep/ .el-button--primary {
  background-color: $Theme-color;
}

/deep/ .varColor {
  color: $Theme-color;
}

/deep/ .el-tag {
  color: $Theme-color;
}

/deep/ tr th {
  border-right: 0;
}

/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner,
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: $Theme-color;
  border-color: $Theme-color;
}

.el-tabs--card /deep/ .el-tabs__header .el-tabs__nav {
  border: none;
}

.el-tabs--card /deep/ .el-tabs__header .el-tabs__item {
  background: rgba(238, 238, 238, 1);
  border-radius: 5px 5px 0px 0px;
  width: 106px;
  text-align: center;
}

.el-tabs--card /deep/ .el-tabs__header .el-tabs__item.is-active {
  background: $Theme-color;
  border-radius: 5px 5px 0px 0px;
  color: #fff;
}
</style>
