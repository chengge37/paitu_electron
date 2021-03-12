<!-- 商家添加(选择)模板 -->
<template>
  <el-dialog
    title="新增模板"
    :visible.sync="selfShow"
    id="addTplDialog"
    width="70%"
    @close="closeDialog"
  >
    <el-row class="search-row">
      <el-col :span="6">
        <el-input v-model="loadTplParamter.search" size="mini" placeholder="输入关键字搜索" />
      </el-col>
      <el-col :span="3" class="btn-col">
        <el-button type="primary" size="mini" :loading="tplLoading" @click="loadYunPianTpl()">搜索</el-button>
      </el-col>
      <el-col :span="9" class="notice">必须从系统现有的模板中选择,如果没有点击右边的加号提交新模板,审核通过后才可使用</el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          circle
          @click="addTplNewDialogVisable = true"
        ></el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="showAddTplNewDialog()" size="mini">查看审核历史</el-button>
      </el-col>
    </el-row>
    <el-table
      size="mini"
      :data="tplArray"
      v-loading="tplLoading"
      highlight-current-row
      @current-change="selectTplRow"
    >
      <el-table-column property="name" label="名称" width="100"></el-table-column>
      <el-table-column property="tpl_content" label="模板内容"></el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="loadYunPianTpl"
      :current-page.sync="loadTplParamter.page"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <el-form :label-position="labelPosition" label-width="80px">
      <el-form-item class="dialog-footer">
        <el-button @click="selfShow = false" class="buttom_cancel">取 消</el-button>
        <el-button type="primary" @click="save" class="buttom_sure" :loading="saveLoading">选 择</el-button>
      </el-form-item>
    </el-form>
    <addTplHistoryDialog
      ref="addTplHistoryDialog"
      :show="addTplHistoryDialogVisable"
      v-on:addTplHistoryDialogCloseMsg="addTplHistoryDialogVisable = false"
    ></addTplHistoryDialog>
    <addTplNewDialog
      :show="addTplNewDialogVisable"
      v-on:addTplNewDialogCloseMsg="addTplNewDialogVisable = false"
    ></addTplNewDialog>
  </el-dialog>
</template>

<script>
import { sms } from "@config/api.js";
import addTplHistoryDialog from "./addTplHistoryDialog";
import addTplNewDialog from "./addTplNewDialog";
export default {
  name: "addTplDialog",
  props: ["show"],
  components: {
    addTplHistoryDialog,
    addTplNewDialog
  },
  watch: {
    show(val) {
      this.selfShow = val;
    }
  },
  data() {
    return {
      addTplHistoryDialogVisable: false,
      addTplNewDialogVisable: false,
      selfShow: this.show,
      labelPosition: "80",
      tplArray: [],
      tplLoading: false,
      saveLoading: false,
      loadTplParamter: {
        page: 1,
        page_size: 10,
        search: null
      },
      totalCount: 0,
      selectTplRowId: -1
    };
  },
  methods: {
    showAddTplNewDialog() {
      this.addTplHistoryDialogVisable = true;
      this.$refs.addTplHistoryDialog.loadAddTplHistory();
    },
    closeDialog() {
      this.$emit("closeAddTplDialogMsg");
    },
    loadYunPianTpl() {
      this.selectTplRowId = -1;
      this.tplLoading = true;
      this.getRequest(sms.getYunpian, this.loadTplParamter)
        .then(res => {
          this.tplLoading = false;
          this.loadTplParamter.page = parseInt(res.page);
          this.totalCount = parseInt(res.total_count);
          this.tplArray = res.rows;
        })
        .catch(err => {
          this.tplLoading = false;
        });
    },
    selectTplRow(row) {
      console.log(row);
      this.selectTplRowId = row.id;
    },
    save() {
      if (this.selectTplRowId == -1) {
        this.$message.error("没有选择模板");
        return;
      }
      this.saveLoading = true;
      this.postRequest(sms.addTpl, { id: this.selectTplRowId })
        .then(res => {
          this.saveLoading = false;
          if (res) {
            //刷新上级页面的数据
            this.$message.info("添加成功");
            this.$emit("refreshTplMsg");
          }
        })
        .catch(err => {
          this.saveLoading = false;
        });
    }
  },
  mounted() {
    this.loadYunPianTpl();
  }
};
</script>

<style lang="scss" scoped>
.search-row {
  padding: 0px 0px 15px;

  .btn-col {
    padding: 0px 10px;
  }
}

#addTplDialog /deep/ {
  .el-dialog__body {
    padding: 0px 20px;

    tr.current-row > td {
      background: $Theme-color !important;
      color: #fff;
    }
  }

  .notice {
    font-size: 12px;
    padding-right: 10px;
    padding-left: 5px;
  }
}

.dialog-footer {
  text-align: right;
  padding-bottom: 20px;

  .buttom_cancel {
    border: 1px solid #7C6AFF;
    border-radius: 2px;
    color: #7C6AFF;
  }

  .buttom_sure {
    border: 1px solid #7C6AFF;
    background:#7C6AFF;
    border-radius: 2px;
    color: #fff;
  }

  .buttom_sure:hover {
    background: rgba(58, 127, 159, 0.8);
  }
}
/deep/{
	.el-table tr{
		cursor:pointer;
	}
}

</style>
