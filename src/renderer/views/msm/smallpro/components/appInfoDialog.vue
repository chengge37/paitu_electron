<template>
  <el-dialog
    title="小程序信息"
    :visible.sync="selfShow"
    id="appInfoDialog"
    width="70%"
    @close="closeDialog"
  >
    <el-row>
      <el-col :span="4">appId:{{selfAppInfo.appid}}</el-col>
      <el-col :span="8">主体名称:{{selfAppInfo.principal_name}}</el-col>
      <el-col :span="4">实名状态:{{selfAppInfo.realname_status|realnameStatusFilter}}</el-col>
      <el-col :span="4">是否资质:{{selfAppInfo.wx_verify_info.qualification_verify}}</el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="4">是否需要年审:{{selfAppInfo.wx_verify_info.annual_review}}</el-col>
      <el-col
        :span="8"
        v-if="selfAppInfo.wx_verify_info.qualification_verify"
      >年审开始:{{selfAppInfo.wx_verify_info.annual_review_begin_time|time2Date('YYYY-MM-DD HH:mm:ss')}}</el-col>
      <el-col
        :span="8"
        v-if="selfAppInfo.wx_verify_info.qualification_verify"
      >年审截止:{{selfAppInfo.wx_verify_info.annual_review_end_time|time2Date('YYYY-MM-DD HH:mm:ss')}}</el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="4">功能介绍:{{selfAppInfo.signature_info.annual_review}}</el-col>
      <el-col :span="8">功能介绍已使用修改次数（本月）:{{selfAppInfo.signature_info.modify_used_count}}</el-col>
      <el-col :span="8">功能介绍修改次数总额度（本月）:{{selfAppInfo.signature_info.modify_quota}}</el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="4">
        头像:
        <img :src="selfAppInfo.head_image_info.head_image_url" />
      </el-col>
      <el-col :span="8">头像已使用修改次数（本月）:{{selfAppInfo.head_image_info.modify_used_count}}</el-col>
      <el-col :span="8">头像修改次数总额度（本月）:{{selfAppInfo.head_image_info.modify_quota}}</el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: "appInfoDialog",
  props: ["show", "appInfo"],
  watch: {
    show(val) {
      console.log("Dialog show 变化" + val);
      this.selfShow = val;
    },
    appInfo(val) {
      this.selfAppInfo = val;
    }
  },
  filters: {
    realnameStatusFilter(val) {
      if (val == 1) {
        return "实名验证成功";
      } else if (val == 2) {
        return "实名验证中";
      } else if (val == 3) {
        return "实名验证失败";
      }
      return "";
    }
  },
  data() {
    return {
      selfShow: this.show,
      selfAppInfo: {
        errcode: -1,
        errmsg: "",
        appid: "",
        account_type: 3,
        principal_type: 1,
        principal_name: "",
        realname_status: 1,
        wx_verify_info: {
          qualification_verify: true,
          naming_verify: false,
          annual_review: false,
          annual_review_begin_time: 0,
          annual_review_end_time: 0
        },
        signature_info: {
          signature: "",
          modify_used_count: 0,
          modify_quota: 5
        },
        head_image_info: {
          head_image_url: "",
          modify_used_count: 0,
          modify_quota: 5
        },
        nickname: ""
      }
    };
  },
  methods: {
    closeDialog() {
      this.selfShow = false;
      this.$emit("appInfoDialogCloseMsg");
    }
  }
};
</script>
<style>
</style>
