<!-- 没有的 -->
<template>
  <el-dialog
    title="添加模板库中没有的"
    width="40%"
    class="innerDialog"
    :visible.sync="selfShow"
    append-to-body
    @close="close"
  >
    <el-form :label-position="labelPosition" label-width="80px" :model="newTplform">
      <el-form-item
        label="提示"
      >提交审核可能管理员会针对您提交得模板做一些修改以方便电信运营商通过,一些诸如"大奖"之类的敏感词是无法通过电信审核的.模板中的变量用#号包围起来</el-form-item>
      <el-form-item label="样例">尊敬的客户,7月1日#影棚名称#将举行#活动名称#,欢迎您报名参加.</el-form-item>
      <el-form-item label="短信内容">
        <el-input v-model="newTplform.template"></el-input>
      </el-form-item>
      <el-form-item class="dialog-footer">
        <el-button @click="selfShow = false" class="buttom_cancel">取 消</el-button>
        <el-button type="primary" @click="save" :loading="loading" class="buttom_sure">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { sms } from "@config/api.js";

export default {
  name: "addTplNewDialog",
  props: ["show"],
  watch: {
    show(val) {
      this.selfShow = val;
    }
  },
  data() {
    return {
      loading: false,
      newTplform: {
        template: null
      },
      labelPosition: "80",
      selfShow: this.show
    };
  },
  methods: {
    close() {
      this.loading = false;
      this.$emit("addTplNewDialogCloseMsg");
    },
    save() {
      if (
        this.newTplform.template == null ||
        this.newTplform.template.length < 6 ||
        this.newTplform.template.length > 256
      ) {
        this.$message.error("模板长度限制6-256");
        return;
      }
      this.loading = true;
      this.postRequest(sms.applyNewTpl, this.newTplform)
        .then(res => {
          this.loading = false;
          if (res) {
            this.$alert(
              "添加成功,请在审查历史中查看审核情况,审核结果也会通过短信通知您",
              "提示",
              {
                confirmButtonText: "确定"
              }
            );
            return;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.dialog-footer {
  text-align: right;

  .buttom_cancel {
    border: 1px solid #7C6AFF;
    border-radius: 2px;
    color: #7C6AFF;
  }

  .buttom_sure {
    border: 1px solid #7C6AFF;
    background: #7C6AFF;
    border-radius: 2px;
    color: #fff;
  }

  .buttom_sure:hover {
    background: rgba(58, 127, 159, 0.8);
  }
}
.el-form-item__content {
  line-height: 20px;
}
</style>
