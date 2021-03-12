<!--  -->
<template>
  <div v-loading="loading" element-loading-text="正在提交信息">
    <div class="form-box" v-if="!active">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
        <!-- 基础资料 -->
        <el-form-item label="小程序名称：" prop="mini_app_name">
          <el-input v-model="form.mini_app_name" placeholder="请输入微信小程序名称（大于4个字符）"></el-input>
        </el-form-item>
        <el-form-item label="小程序简要说明：" prop="info">
          <el-input v-model="form.info" placeholder="请输入小程序简要说明"></el-input>
        </el-form-item>
        <el-form-item label="法人微信：" prop="legal_persona_wechat">
          <el-input v-model="form.legal_persona_wechat" placeholder="请输入法人微信号（大于6个字符）"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名：" prop="id_card_name">
          <el-input v-model="form.id_card_name" placeholder="请输入法人姓名"></el-input>
        </el-form-item>
        <el-form-item label="企业名称：" prop="company_name">
          <el-input v-model="form.company_name" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机：" prop="contact_phone">
          <el-input v-model="form.contact_phone" placeholder="请输入联系人手机"></el-input>
        </el-form-item>
        <el-form-item label="公司类别：" prop="company_code_type">
          <div class="company">
            <el-select v-model="form.company_code_type" placeholder="请选择">
              <el-option
                v-for="item in organization_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="营业执照号" prop="business_license_number">
          <el-input v-model="form.business_license_number" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="营业执照注册地址" prop="company_address">
          <el-input v-model="form.company_address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="证照有效期" prop="business_time">
          <Sdate-picker @GetTime="SetBusiness" :Timedata="form.business_time" Stype="business_time"></Sdate-picker>
        </el-form-item>
        <div v-if="form.company_code_type == 3">
          <el-form-item label="组织机构代码" prop="organization_number">
            <el-input v-model="form.organization_number" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="证照有效期" prop="organization_time">
            <Sdate-picker
              @GetTime="SetOrganizationTime"
              :Timedata="form.organization_time"
              Stype="organization_time"
            ></Sdate-picker>
          </el-form-item>
        </div>
        <el-form-item
          v-if="form.company_code_type == 3"
          label="上传组织机构代码证件："
          prop="organization_copy_qiniu"
        >
          <imgupload :image-url="form.organization_copy_qiniu" @picaddress="GetOrganizationCopy" />
        </el-form-item>
        <!-- 支付资料 -->
        <el-form-item label="法人身份证号" prop="id_card_number">
          <el-input v-model="form.id_card_number" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="证照有效期" prop="id_card_valid_time">
          <Sdate-picker
            @GetTime="SetIdCard"
            :Timedata="form.id_card_valid_time"
            Stype="id_card_valid_time"
          ></Sdate-picker>
        </el-form-item>
        <el-form-item label="店铺名称" prop="store_street">
          <el-input v-model="form.store_street" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="客服手机号" prop="service_phone">
          <el-input v-model="form.service_phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管手机号" prop="contact_phone">
          <el-input v-model="form.contact_phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="运营城市" prop="store_address_code">
          <el-cascader
            placeholder="试试搜索自己所在的省名"
            :options="options"
            v-model="form.store_address_code"
            filterable
            @change="storeAddressChange"
          ></el-cascader>
        </el-form-item>
        <!-- 个人卡 -->
        <el-form-item label="个人开户银行省市" prop="bank_address_code">
          <el-cascader
            placeholder="试试输入开户银行省"
            :options="options"
            filterable
            @change="paySlect"
            v-model="form.bank_address_code"
          ></el-cascader>
        </el-form-item>
        <div class="bank-box">
          <el-form-item label="个人开户银行" prop="account_bank">
            <el-select v-model="form.account_bank" placeholder="请选择">
              <el-option
                v-for="item in banklist"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="bankclass"
            label="个人开户银行全称（包含支行）"
            prop="bank_name"
            v-if="form.account_bank === '其他银行'"
          >
            <el-autocomplete
              v-model="form.bank_name"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="bank_name_Select"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-form-item>
        </div>
        <el-form-item label="个人银行卡号" prop="account_number">
          <el-input v-model="form.account_number" placeholder="请输入个人银行卡号"></el-input>
        </el-form-item>
        <!-- 对公卡 -->
        <el-form-item label="对公开户银行省市" prop="company_bank_address_code">
          <el-cascader
            placeholder="试试输入开户银行省"
            :options="options"
            filterable
            @change="companyPaySlect"
            v-model="form.company_bank_address_code"
          ></el-cascader>
        </el-form-item>
        <div class="bank-box">
          <el-form-item label="对公开户银行" prop="company_account_bank">
            <el-select v-model="form.company_account_bank" placeholder="请选择">
              <el-option
                v-for="item in banklist"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="bankclass"
            label="开户银行全称（含支行）"
            prop="company_bank_name"
            v-if="form.company_account_bank === '其他银行'"
          >
            <el-autocomplete
              v-model="form.company_bank_name"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="companyBankNameSelect"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-form-item>
        </div>
        <el-form-item label="对公银行卡号" prop="company_account_number">
          <el-input v-model="form.company_account_number" placeholder="请输入对公银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址Email：" prop="contact_email">
          <el-input v-model="form.contact_email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <!-- 图片部分 -->
        <el-form-item label="上传营业执照：" prop="company_license_pic_qiniu">
          <imgupload :image-url="form.company_license_pic_qiniu" @picaddress="GetCompanyLicense" />
        </el-form-item>
        <el-form-item label="上传小程序图标：" prop="mini_app_icon_qiniu">
          <imgupload :image-url="form.mini_app_icon_qiniu" @picaddress="getwxminipic" />
        </el-form-item>
        <!-- 还没有返回 -->
        <el-form-item label="上传身份证人像面：" prop="id_card_copy_qiniu">
          <imgupload :image-url="form.id_card_copy_qiniu" @picaddress="GetIdCardCopy" />
        </el-form-item>

        <el-form-item label="上传身份证国徽面：" prop="id_card_national_qiniu">
          <imgupload :image-url="form.id_card_national_qiniu" @picaddress="GetIdCardNational" />
        </el-form-item>

        <el-form-item label="上传店铺截图：" prop="store_entrance_pic_qiniu">
          <imgupload :image-url="form.store_entrance_pic_qiniu" @picaddress="GetStoreEntrance" />
        </el-form-item>

        <el-form-item label="上传店铺内截图：" prop="indoor_pic_qiniu">
          <imgupload :image-url="form.indoor_pic_qiniu" @picaddress="GetIndoorPic" />
        </el-form-item>
      </el-form>
      <div class="bottom-button">
        <el-button type="primary" @click="confirmmini">提交</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>
    <div v-else>
      <div class="success">
        <ali-svg-icon icon-class="is_selected"></ali-svg-icon>
        <div class="text">提交完成，资料审核需要最低15个工作日的时间，请耐心等待，您可以在初始申请界面查看进度</div>
        <router-link to="/serve/pop_set/smallProIndex">
          <el-button type="primary">返回</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ApplyImg from "ServeComponents/untilsupload/applyimg";
import imgupload from "ServeComponents/untilsupload";
import { ApplyMniApp, other } from "@/config/api";
import { rules, city, banklist } from "./components/Agreement";
import SdatePicker from "./components/datePicker";
export default {
  data: () => ({
    loading: false,
    form: {
      mini_app_name: null,
      info: null,
      legal_persona_wechat: null,
      legal_persona_name: null,
      company_name: null,
      contact_phone: null,
      company_license_pic_qiniu: null,
      mini_app_icon_qiniu: null,
      // 企业类型:1是18位营业执照，3是15位营业执照
      company_code_type: 1,
      company_code: "",
      // 当organization_type:2时，三证合一
      business_licence_type: null,
      // 营业执照号
      business_license_number: null,
      // 证件注册地址
      company_address: null,
      // 证件有效期
      business_time: [],
      // // 组织机构代码
      organization_number: null,
      // 组织机构图
      organization_copy_qiniu: "",
      // 组织机构代码有效期
      organization_time: [],
      // 人面
      id_card_copy_qiniu: "",
      // 国徽
      id_card_national_qiniu: "",
      // 店面
      store_entrance_pic_qiniu: "",
      // 店内
      indoor_pic_qiniu: "",
      // 法人姓名
      id_card_name: "",
      // 法人身份证号码
      id_card_number: "",
      // 身份证有效期
      id_card_valid_time: [],
      // 店铺名称
      store_street: "",
      // 客服手机号
      service_phone: "",
      // 超管手机号
      contact_phone: "",
      // 运营城市代码
      store_address_code: "",
      // 个人银行省市编码
      bank_address_code: "",
      // 个人银行卡号
      account_number: "",
      // 开户银行前缀
      account_bank: "",
      // 银行名称
      bank_name: "",
      // 对公开户银行省市
      company_bank_address_code: "",
      // 对公开户银行前缀
      company_account_bank: "",
      // 银行名称
      company_bank_name: "",
      // 对公银行卡
      company_account_number: "",
      // 联系email
      contact_email: ""
    },
    // 选择公司类别
    cascaderdata: [],
    // 银行类型
    bankType: "",
    dgbankType: "",
    organization_type_options: [
      {
        value: 1,
        label: "18位营业执照"
      },
      {
        value: 3,
        label: "15位营业执照"
      }
    ],
    rules,
    banklist,
    serverTempData: null,
    uploaddata: {},
    options: [],
    store_address_code: [],
    banktimer: null,
    active: false
  }),

  components: { ApplyImg, imgupload, SdatePicker },

  created() {
    this.options = city(this);
    this.getRequest(ApplyMniApp.getApply).then(res => {
      console.log(res);
      this.form.id_card_valid_time = JSON.parse(res.id_card_valid_time);
      this.form.business_time = JSON.parse(res.business_time);
      this.form.mini_app_name = res.mini_app_name;
      this.form.legal_persona_wechat = res.legal_persona_wechat;
      this.form.legal_persona_name = res.legal_persona_name;
      this.form.company_name = res.company_name;
      this.form.contact_phone = res.contact_phone;
      this.form.company_license_pic_qiniu = res.company_license_pic_qiniu;
      this.form.mini_app_icon_qiniu = res.mini_app_icon_qiniu;
      this.form.company_code = res.company_code;
      this.form.business_license_number = res.business_license_number;
      this.form.company_address = res.company_address;
      this.form.business_licence_type = res.business_licence_type;
      this.form.organization_number = res.organization_number;
      this.form.organization_time = res.organization_time;
      this.form.organization_type = res.organization_type;
      this.form.account_bank = res.account_bank;
      this.form.account_number = res.account_number;
      this.form.store_street = res.store_street;
      this.form.service_phone = res.service_phone;
      this.form.bank_name = res.bank_name;
      this.form.company_account_bank = res.company_account_bank;
      this.form.company_bank_name = res.company_bank_name;
      this.form.company_bank_address_code = res.company_bank_address_code;
      this.form.company_account_number = res.company_account_number;
      this.form.contact_email = res.contact_email;
      this.form.id_card_copy_qiniu = res.id_card_copy_qiniu;
      this.form.id_card_national_qiniu = res.id_card_national_qiniu;
      this.form.organization_copy_qiniu = res.organization_copy_qiniu;
      this.form.id_card_number = res.id_card_number;
      this.form.id_card_name = res.id_card_name;
      this.form.info = res.info;
      this.form.store_address_code = res.store_address_code;
      this.form.bank_address_code = res.bank_address_code;
      this.form.store_entrance_pic_qiniu = res.store_entrance_pic_qiniu;
      this.form.indoor_pic_qiniu = res.indoor_pic_qiniu;
    });
  },

  methods: {
    companyBankNameSelect(data) {
      console.log(data);
      this.form.company_bank_name = data.value;
    },
    // 开户银行全称
    bank_name_Select(data) {
      console.log(data);
      this.form.bank_name = data.value;
    },
    companyPaySlect(value) {
      this.form.company_bank_address_code = value[1];
    },
    // 银行地址选择
    paySlect(value) {
      this.form.bank_address_code = value[1];
    },
    storeAddressChange(data) {
      this.form.store_address_code = data[1];
    },
    SetOrganizationTime(data) {
      this.form.organization_time = data;
    },
    SetIdCard(data) {
      this.form.id_card_valid_time = data;
    },
    SetBusiness(data) {
      this.form.business_time = data;
    },
    GetIndoorPic(data) {
      this.form.indoor_pic_qiniu = data;
    },
    GetStoreEntrance(data) {
      this.form.store_entrance_pic_qiniu = data;
    },
    GetIdCardNational(data) {
      this.form.id_card_national_qiniu = data;
    },
    GetIdCardCopy(data) {
      this.form.id_card_copy_qiniu = data;
    },
    GetOrganizationCopy(data) {
      this.form.organization_copy_qiniu = data;
    },
    GetCompanyLicense(data) {
      this.form.company_license_pic_qiniu = data;
      console.log("图片地址", data);
    },
    getwxminipic(data) {
      this.form.mini_app_icon_qiniu = data;
      console.log("图片地址", data);
    },
    async storagedata() {
      this.uploaddata.id_card_valid_time = JSON.stringify(
        this.uploaddata.id_card_valid_time
      );
      this.uploaddata.business_time = JSON.stringify(
        this.uploaddata.business_time
      );
      this.uploaddata.organization_time = JSON.stringify(
        this.uploaddata.organization_time
      );
      this.loading = true;
      try {
        let updateBaise = await this.postRequest(
          ApplyMniApp.saveData,
          this.uploaddata
        );
        if (updateBaise) {
          this.loading = false;
          this.active = true;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    confirmmini() {
      console.log(this.form);
      let temp = this.form;
      this.$refs.form.validate(valid => {
        if (valid) {
          for (let key in temp) {
            if (temp[key]) {
              this.uploaddata[key] = temp[key];
            }
          }
          this.storagedata();
          console.log(this.uploaddata);
        }
      });
    },
    // 搜索
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
    }
  },
  watch: {}
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.form-box {
  background-color: #fff;
  padding: 36px;
  .bottom-button {
    margin-top: 2%;
    justify-content: center;
  }
  .bank-box {
    display: flex;
    .bankclass {
      width: 100%;
      margin-left: 20px;
      /deep/ .el-form-item__label {
        width: 220px !important;
      }
      /deep/ .el-autocomplete {
        width: 93%;
      }
    }
  }

  .company {
    display: flex;
    /deep/ .el-select {
      flex: 2;
      margin-right: 20px;
    }
    /deep/ .el-input {
      flex: 9;
    }
  }
  /deep/ .el-range-separator {
    padding: 0;
  }
}
.license-img {
  /deep/ .el-upload {
    width: 98px;
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
