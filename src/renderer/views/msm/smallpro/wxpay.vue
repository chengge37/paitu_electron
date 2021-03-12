<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="补充个人信息"></el-step>
      <el-step title="完善门店信息"></el-step>
      <el-step title="完善支付信息"></el-step>
    </el-steps>
    <el-table
      :data="userlist"
      v-loading="listLoading"
      element-loading-text="恢复数据..."
      fit
      border
      :header-cell-style="{background:'#7842ED',color:'#FFFFFF'}"
      class="table-control"
      v-if="active == 0"
    >
      <el-table-column label="提交项">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否必填">
        <template slot-scope="scope">
          <span>{{scope.row.isMustFill}}</span>
        </template>
      </el-table-column>
      <el-table-column label="示例">
        <template slot-scope="scope">
          <span>{{scope.row.example}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.describe}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <apply-img
            v-if="scope.row.type === 'image'"
            :image-url="scope.row.data"
            :file-name="scope.row.file_name"
            @UploadState="gruploadstate"
          />
          <el-input v-else size="small" v-model="scope.row.data" />
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="shoplist"
      v-loading="listLoading"
      element-loading-text="恢复数据..."
      fit
      border
      :header-cell-style="{background:'#7842ED',color:'#FFFFFF'}"
      class="table-control"
      v-if="active == 1"
    >
      <el-table-column label="提交项">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否必填">
        <template slot-scope="scope">
          <span>{{scope.row.isMustFill}}</span>
        </template>
      </el-table-column>
      <el-table-column label="示例">
        <template slot-scope="scope">
          <span>{{scope.row.example}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <pre>{{scope.row.describe}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <apply-img
            v-if="scope.row.type === 'image'"
            :image-url="scope.row.data"
            :file-name="scope.row.file_name"
            @UploadState="shopuploadstate"
          />
          <el-cascader
            v-else-if="scope.row.id==='store_address_code'"
            placeholder="试试搜索自己所在的省名"
            :options="options"
            filterable
            v-model="scope.row.data"
            @change="handleChange"
          ></el-cascader>
          <el-input v-else size="small" v-model="scope.row.data" />
        </template>
      </el-table-column>
    </el-table>
    <div class="form-box" v-if="active == 2">
      <el-form ref="form" :model="payForm" :rules="ruls" label-width="140px" label-position="left">
        <el-form-item label="个人开户银行省市" prop="company_bank_address_code">
          <el-cascader
            placeholder="试试输入开户银行省"
            :options="options"
            filterable
            @change="paySlect"
            v-model="payForm.company_bank_address_code"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="个人开户银行" prop="account_bank">
          <el-select v-model="bankType" placeholder="请选择">
            <el-option
              v-for="item in banklist"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-input v-if="bankType === '其他银行'" v-model="payForm.account_bank" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="个人开户银行全称" prop="bank_name" v-if="bankType === '其他银行'">
          <el-autocomplete
            v-model="payForm.bank_name"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="bank_name_Select"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="个人银行卡号" prop="account_number">
          <el-input v-model="payForm.account_number" placeholder="请输入个人银行卡号"></el-input>
        </el-form-item>
        <!-- 当用户为公司时，启用对公账号填写 -->
        <div v-if="organization_type == `2`">
          <el-form-item label="对公开户银行省市" prop="company_bank_address_code">
            <el-cascader
              placeholder="试试输入开户银行省"
              :options="options"
              filterable
              @change="dgpaySlect"
              v-model="payForm.dgcompany_bank_address_code"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="对公开户银行" prop="account_bank">
            <el-select v-model="dgbankType" placeholder="请选择">
              <el-option
                v-for="item in banklist"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-input
              v-if="dgbankType === '其他银行'"
              v-model="payForm.dgaccount_bank"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户银行全称" prop="bank_name" v-if="dgbankType === '其他银行'">
            <el-autocomplete
              v-model="payForm.bank_name"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="bank_name_Select"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="对公银行卡号" prop="account_number">
            <el-input v-model="payForm.dgaccount_number" placeholder="请输入对公银行卡号"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="active == 3">
      <div class="success">
        <ali-svg-icon icon-class="is_selected"></ali-svg-icon>
        <div class="text">提交完成，资料审核需要最低15个工作日的时间，请耐心等待，您可以在初始申请界面查看进度</div>
        <router-link to="/serve/pop_set/smallProIndex">
          <el-button type="primary">返回</el-button>
        </router-link>
      </div>
    </div>
    <div class="bottom-button" v-if="active<3">
      <el-button @click="$router.go(-1)" v-if="active == 0">取消</el-button>
      <el-button type="primary" @click="prev" v-else>上一步</el-button>
      <el-button type="primary" @click="next" v-if="active<2">下一步</el-button>
      <el-button type="primary" @click="confirpay" v-else>提交</el-button>
    </div>
  </div>
</template>

<script>
import ApplyImg from "ServeComponents/untilsupload/applyimg";
import { ApplyMniApp, other } from "@/config/api";
import { isEmptyForm } from "@/utils/validate.js";
export default {
  data: () => ({
    listLoading: false,
    active: 1,
    userlist: [
      {
        id: "id_card_number",
        title: "身份证号码",
        isMustFill: "是",
        example: "身份证号码",
        describe: "15位数字或17位数字+1位数字或X ",
        type: "text",
        data: ""
      },
      {
        id: "id_card_valid_time0",
        title: "身份证有效期限",
        isMustFill: "是",
        example: "2010-01-01",
        describe: "身份证有效期的起始日期",
        type: "text",
        data: ""
      },
      {
        id: "id_card_valid_time1",
        title: "身份证有效期限",
        isMustFill: "是",
        example: "2030-02-16或者长期",
        describe: "身份证有效期的终止日期，可以为长期",
        type: "text",
        data: ""
      },
      {
        id: "contact_phone",
        title: "超管手机号",
        isMustFill: "是",
        example: "1537310xxxx",
        describe: "11位大陆手机号码",
        type: "text",
        data: ""
      },
      {
        id: "contact_email",
        title: "超管信箱",
        isMustFill: "是",
        example: "1035765xxx@qq.com",
        describe: "电子邮箱",
        type: "text",
        data: ""
      },
      {
        id: "id_card_copy_qiniu",
        file_name: "id_card_copy",
        title: "身份证人面照片",
        isMustFill: "是",
        example: "无",
        describe: "请上传身份证人面照片",
        type: "image",
        data: ""
      },
      {
        id: "id_card_national_qiniu",
        file_name: "id_card_national",
        title: "身份证国徽面照片",
        isMustFill: "是",
        example: "无",
        describe: "请上传身份证人面照片",
        type: "image",
        data: ""
      }
    ],
    shoplist: [
      {
        id: "store_name",
        title: "门店名称",
        isMustFill: "是",
        example: "无",
        describe: "最长50个中文字符门店场所：填写门店名称",
        type: "text",
        data: ""
      },
      {
        id: "store_address_code",
        title: "门店省市编码",
        isMustFill: "是",
        example: "110000",
        describe: "门店场所：您只需要选择门店所在省市即可",
        type: "text",
        data: ""
      },
      {
        id: "store_street",
        title: "门店街道名称",
        isMustFill: "是",
        example: "xx街道xx路口xxx",
        describe:
          "门店场所：填写店铺详细地址，具体区/县\n及街道门牌号或大厦楼层;无需省市信息",
        type: "text",
        data: ""
      },
      {
        id: "store_longitude",
        title: "门店经度",
        isMustFill: "否",
        example: "113.941355",
        describe: "数字或小数点",
        type: "text",
        data: ""
      },
      {
        id: "store_latitude",
        title: "门店纬度",
        isMustFill: "否",
        example: "22.546245",
        describe: "数字或小数点",
        type: "text",
        data: ""
      },
      {
        id: "merchant_shortname",
        title: "商户简称",
        isMustFill: "是",
        example: "龙门客栈",
        describe:
          "最多16个汉字长度。\n将在支付完成页向买家展示，\n需与商家的实际经营场景相符",
        type: "text",
        data: ""
      },
      {
        id: "service_phone",
        title: "客服电话",
        isMustFill: "是",
        example: "0755-3666xxx",
        describe:
          "最多16个汉字长度。\n在交易记录中向买家展示，\n请确保电话畅通以便平台回拨确认",
        type: "text",
        data: ""
      },
      {
        id: "business_addition_desc",
        title: "补充说明",
        isMustFill: "否",
        example: "补充说明店铺内容",
        describe: "可填写需要额外说明的文字",
        type: "text",
        data: ""
      },
      {
        id: "store_entrance_pic_qiniu",
        file_name: "store_entrance_pic",
        title: "门店门口照片",
        isMustFill: "是",
        example: "无",
        describe: "门店场所：提交门店门口照片，要求招牌清晰可见",
        type: "image",
        data: ""
      },
      {
        id: "indoor_pic_qiniu",
        file_name: "indoor_pic",
        title: "店内环境照片",
        isMustFill: "是",
        example: "无",
        describe: "门店场所：提交店内环境照片",
        type: "image",
        data: ""
      },
      {
        id: "business_addition_pics_qiniu",
        file_name: "business_addition_pics",
        title: "补充材料",
        isMustFill: "否",
        example: "无",
        describe: "无",
        type: "image",
        data: ""
      }
    ],
    tempObject: {},
    payForm: {
      company_bank_address_code: "",
      dgcompany_bank_address_code: "",
      account_bank: "",
      dgaccount_bank: "",
      bank_name: "",
      dgbank_name: "",
      account_number: "",
      dgaccount_number: ""
    },
    banklist: [
      {
        id: 1,
        name: "工商银行"
      },
      {
        id: 2,
        name: "交通银行"
      },
      {
        id: 3,
        name: "招商银行"
      },
      {
        id: 4,
        name: "民生银行"
      },
      {
        id: 5,
        name: "中信银行"
      },
      {
        id: 6,
        name: "浦发银行"
      },
      {
        id: 7,
        name: "兴业银行"
      },
      {
        id: 8,
        name: "光大银行"
      },
      {
        id: 9,
        name: "广发银行"
      },
      {
        id: 10,
        name: "平安银行"
      },
      {
        id: 11,
        name: "北京银行"
      },
      {
        id: 12,
        name: "华夏银行"
      },
      {
        id: 13,
        name: "农业银行"
      },
      {
        id: 14,
        name: "建设银行"
      },
      {
        id: 15,
        name: "邮政储蓄银行"
      },
      {
        id: 16,
        name: "中国银行"
      },
      {
        id: 17,
        name: "宁波银行"
      },
      {
        id: 18,
        name: "其他银行"
      }
    ],
    UnsupportedBank: [
      623501,
      621468,
      620522,
      625191,
      622384,
      623078,
      940034,
      622150,
      622151,
      622181,
      622188,
      955100,
      621095,
      620062,
      621285,
      621798,
      621799,
      621797,
      622199,
      621096,
      62215049,
      62215050,
      62215051,
      62218849,
      62218850,
      62218851,
      621622,
      623219,
      621674,
      623218,
      621599,
      623698,
      623699,
      623686,
      621098,
      620529,
      622180,
      622182,
      622187,
      622189,
      621582,
      623676,
      623677,
      622812,
      622810,
      622811,
      628310,
      625919,
      625368,
      625367,
      518905,
      622835,
      625603,
      625605,
      518905
    ],
    bankType: "",
    dgbankType: "",
    options: [],
    organization_type: "",
    banktimer: null,
    ruls: {
      company_bank_address_code: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      account_bank: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      bank_name: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      account_number: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      dgcompany_bank_address_code: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      dgaccount_bank: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      dgbank_name: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      dgaccount_number: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ]
    }
  }),

  components: { ApplyImg },
  created() {
    this.listLoading = true;
    let provinces = this.$staticAllCityArray.map(item => {
      return item.province;
    });
    let provincesArr = [...new Set(provinces)];
    provincesArr = provincesArr.map(item => {
      return {
        label: item,
        children: []
      };
    });
    this.options = provincesArr.map(item => {
      this.$staticAllCityArray.forEach(city => {
        if (item.label === city.province) {
          item.children.push({
            label: city.city,
            value: city.admin_code
          });
        }
      });
      return item;
    });
    this.getRequest(ApplyMniApp.getApply)
      .then(res => {
        this.organization_type = res.organization_type;
        this.userlist.forEach(item => {
          item.data = res[item.id];
          if (item.id == "id_card_valid_time0") {
            item.data = JSON.parse(res.id_card_valid_time)[0];
          }
          if (item.id == "id_card_valid_time1") {
            item.data = JSON.parse(res.id_card_valid_time)[1];
          }
        });
        this.shoplist.forEach(item => {
          item.data = res[item.id];
        });

        if (this.organization_type == "2") {
          this.payForm.dgcompany_bank_address_code =
            res.company_bank_address_code;
          this.payForm.dgaccount_number = res.company_account_number;
          this.payForm.dgaccount_bank = res.company_account_bank;
          this.payForm.dgbank_name = res.company_bank_name;
          this.dgbankType = res.account_bank;
          this.bankType = res.company_account_bank;
          this.payForm.bank_name = res.bank_name;
          this.payForm.account_bank = res.account_bank;
          this.payForm.account_number = res.account_number;
          this.payForm.company_bank_address_code = res.bank_address_code;
        } else {
          this.bankType = res.company_account_bank;
          this.payForm.bank_name = res.bank_name;
          this.payForm.account_bank = res.account_bank;
          this.payForm.account_number = res.account_number;
          this.payForm.company_bank_address_code = res.bank_address_code;
        }

        console.log(this.payForm);
        this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
  },
  mounted() {},

  methods: {
    // 调用接口搜索银行
    querySearch(queryString, cb) {
      console.log(queryString);
      if (!queryString || this.banktimer) return;
      this.banktimer = true;
      setTimeout(() => {
        this.getRequest(other.searchBank, { search: queryString })
          .then(res => {
            if (res) {
              let endarray = [];
              res.forEach(item => {
                endarray.push({
                  value: item.bank,
                  address: item.id
                });
              });
              console.log(endarray);
              cb(endarray);
              this.banktimer = false;
              if (res.length == 0)
                this.$message({
                  type: "warning",
                  message: "无结果，请检查输入是否正确"
                });
            }
          })
          .catch(err => {
            this.banktimer = false;
          });
      }, 800);
    },
    // 开户银行全称
    bank_name_Select(data) {
      console.log(data);
      this.payForm.bank_name = data.value;
    },
    // 银行地址选择
    paySlect(value) {
      this.payForm.company_bank_address_code = value[1];
    },
    dgpaySlect(value) {
      this.payForm.dgcompany_bank_address_code = value[1];
    },
    handleChange(value) {
      this.shoplist.forEach(item => {
        if (item.id === "store_address_code") {
          item.data = value[1];
        }
      });
    },
    shopuploadstate(data) {},
    gruploadstate(data) {
      this.userlist.forEach(item => {
        if (item.file_name == data.fileName) {
          item.url = data.url;
        }
      });
      console.log(this.userlist);
    },
    next() {
      let objectAndType = {};
      switch (this.active) {
        case 0:
          objectAndType.type = "userlist";
          objectAndType.object = this.userlist;
          if (this.validate(objectAndType)) return;
          this.tempObject = this.clearDate(this.userlist);
          break;
        case 1:
          objectAndType.type = "shoplist";
          objectAndType.object = this.shoplist;
          if (this.validate(objectAndType)) return;
          Object.assign(
            this.tempObject,
            this.clearDate(this.shoplist, "shoplist")
          );
          break;

        default:
          break;
      }
      this.listLoading = true;
      this.postRequest(ApplyMniApp.updateApply, this.tempObject)
        .then(res => {
          if (res) {
            this.active = this.active + 1;
            this.listLoading = false;
          }
        })
        .catch(err => {
          this.listLoading = false;
        });

      console.log(this.tempObject);
    },
    prev() {
      this.active = this.active - 1;
    },
    async confirpay() {
      if (this.clearPayDada(this.payForm)) {
        Object.assign(this.tempObject, this.clearPayDada(this.payForm));
      } else {
        return;
      }
      this.listLoading = true;
      try {
        let updateres = await this.postRequest(
          ApplyMniApp.updateApply,
          this.tempObject
        );
        if (updateres) {
          this.$message({ type: "success", message: "提交成功" });
          this.listLoading = false;
        }
        let CapplyPayD = await this.postRequest(ApplyMniApp.CapplyPay);
        if (CapplyPayD.err_code) {
          this.$message({ type: "error", message: CapplyPayD.err_code_des });
        } else {
          this.active = this.active + 1;
        }
      } catch (error) {
        this.$message({ type: "error", message: error });
        this.listLoading = false;
      }
    },
    clearDate(list) {
      console.log(list);
      let tempObject = {};
      this.active === 0
        ? (tempObject = { id_card_valid_time: [] })
        : (tempObject = {});
      list.forEach((item, index) => {
        if (item.data) {
          tempObject[item.id] = item.data;
        }
      });
      if (this.active === 0) {
        tempObject.id_card_valid_time[0] = tempObject.id_card_valid_time0;
        tempObject.id_card_valid_time[1] = tempObject.id_card_valid_time1;
        delete tempObject.id_card_valid_time0;
        delete tempObject.id_card_valid_time1;
      }

      return tempObject;
    },
    // 整理支付需要的参数
    clearPayDada(Paydata) {
      console.log(Paydata);
      let Backnumber = Paydata.account_number.substring(0, 6);
      let TempPay = {};
      // 当是属于公司时
      if (this.organization_type == "2") {
        TempPay.company_account_bank = Paydata.dgaccount_bank;
        TempPay.company_bank_address_code = Paydata.dgcompany_bank_address_code;
        TempPay.company_account_number = Paydata.dgaccount_number;
        TempPay.account_bank = Paydata.account_bank;
        TempPay.bank_address_code = Paydata.company_bank_address_code;
        if (this.bankType === "其他银行")
          TempPay.company_bank_name = Paydata.bank_name;
        if (
          this.UnsupportedBank.includes(
            Number(Paydata.account_number.substring(0, 6))
          )
        ) {
          this.$message({
            type: "error",
            message: "对不起，您的银行卡不被支持，请更换"
          });
          return false;
        } else {
          TempPay.account_number = Paydata.account_number;
        }
        // 当时个体户时
      } else {
        TempPay.account_bank = Paydata.account_bank;
        TempPay.bank_address_code = Paydata.company_bank_address_code;
        if (this.bankType === "其他银行") TempPay.bank_name = Paydata.bank_name;
        if (
          this.UnsupportedBank.includes(
            Number(Paydata.account_number.substring(0, 6))
          )
        ) {
          this.$message({
            type: "error",
            message: "对不起，您的银行卡不被支持，请更换"
          });
          return false;
        } else {
          TempPay.account_number = Paydata.account_number;
        }
      }
      return TempPay;
    },
    validate(data) {
      let temp = [];
      switch (data.type) {
        case "userlist":
          temp = this.userlistValidate(data.object);
          break;
        case "shoplist":
          temp = this.shoplistValidate(data.object);
          break;
        default:
          break;
      }
      if (temp.includes(false))
        this.$message({
          type: "error",
          message: "您的信息未完善或未按照规则填写"
        });
      return temp.includes(false);
    },
    // 使用正则匹配数据是否完整
    userlistValidate(object) {
      let userTemp = [];
      object.forEach((item, index) => {
        switch (item.id) {
          case "id_card_number":
            userTemp.push(
              /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/.test(
                item.data
              )
            );
            break;
          case "id_card_valid_time0":
            userTemp.push(
              /^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/.test(item.data)
            );
            break;
          case "id_card_valid_time1":
            userTemp.push(
              /^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/.test(item.data) ||
                item.data === "长期"
            );
            break;
          case "contact_phone":
            userTemp.push(/^1[3456789]\d{9}$/.test(item.data));
            break;
          case "contact_email":
            userTemp.push(
              /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                item.data
              )
            );
            break;
          default:
            break;
        }
      });
      console.log(userTemp);
      return userTemp;
    },
    // 匹配商家数据是否完整
    shoplistValidate(object) {
      let shopTemp = [];
      object.forEach(item => {
        switch (item.id) {
          case "store_name":
            if (item.data && item.data.length > 4) {
              shopTemp.push(true);
            } else {
              shopTemp.push(false);
            }
            break;
          case "store_address_code":
            if (item.data) {
              shopTemp.push(true);
            } else {
              shopTemp.push(false);
            }
            break;
          case "store_street":
            if (item.data && item.data.length > 4) {
              shopTemp.push(true);
            } else {
              shopTemp.push(false);
            }
            break;
          case "merchant_shortname":
            if (item.data) {
              shopTemp.push(true);
            } else {
              shopTemp.push(false);
            }
            break;
          case "service_phone":
            shopTemp.push(
              /\d{3}-\d{8}|\d{4}-\d{7}|(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(
                item.data
              )
            );
            break;
          default:
            break;
        }
      });
      console.log(shopTemp);
      return shopTemp;
    }
  },
  watch: {
    bankType(value) {
      if (value !== "其他银行") {
        this.payForm.account_bank = value;
      }
    },
    dgbankType(value) {
      if (value !== "其他银行") {
        this.payForm.dgaccount_bank = value;
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
  /deep/ .el-table td {
    padding: 12px 0 !important;
  }
  /deep/ .el-table {
    border-radius: 0 !important;
  }
  .table-control /deep/ .el-cascader {
    width: 100%;
  }
  .form-box {
    background-color: #fff;
    padding: 36px;
    margin: 20px 0;
    /deep/ .el-cascader {
      width: 100%;
    }
    /deep/ .el-autocomplete {
      width: 100%;
    }
  }
  .success {
    margin-top: 20px;
    text-align: center;
    .text {
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0px;
    }
  }
</style>