<!-- 审核历史 -->
<template>
  <el-dialog
    width="70%"
    title="申请历史"
    class="innerDialog"
    :visible.sync="selfShow"
    append-to-body
    @close="close"
  >
    <el-table :data="historyArray">
      <el-table-column label="编号" prop="id" width="50"></el-table-column>
      <el-table-column label="模板" prop="template"></el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template slot-scope="scope">{{scope.row.status|status2Str}}</template>
      </el-table-column>
      <el-table-column label="拒绝原因" prop="msg" width="200"></el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="loadAddTplHistory"
      :current-page.sync="loadParameter.page"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { sms } from "@config/api.js";

export default {
  name: "addTplHistoryDialog",
  props: ["show"],
  watch: {
    show(val) {
      this.selfShow = val;
    }
  },
  data() {
    return {
      selfShow: this.show,
      historyArray: [],
      loadParameter: {
        page: 1,
        page_size: 10
      },
      totalCount: 0
    };
  },
  filters: {
    status2Str(status) {
      if (status == 0) {
        return "审核中";
      } else if (status == 1) {
        return "批准";
      } else if (status == 2) {
        return "拒绝";
      }
    }
  },
  mounted() {
    this.loadAddTplHistory();
  },
  methods: {
    close() {
      this.$emit("addTplHistoryDialogCloseMsg");
    },
    loadAddTplHistory() {
      this.getRequest(sms.getAddTplHistory)
        .then(res => {
          this.historyArray = res.rows;
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss">
.innerDialog /deep/ {
  .el-dialog__body {
    padding: 0px 20px 20px 20px;
  }
  .notice {
    font-size: 0.5rem;
    padding-right: 10px;
    padding-left: 5px;
  }
}
</style>
