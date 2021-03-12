<!--  -->
<template>
  <div>
    <div class="page" v-if="!simplify">
      <el-pagination
        background
        layout="prev, pager, next, total, jumper"
        :total="total"
        :page-size="pagesize"
        :current-page="page"
        prev-text="< 上一页"
        next-text="下一页 >"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <div class="rigth-button">
        <el-button type="primary">确定</el-button>
      </div>
    </div>
    <div class="grpage" v-else>
      <el-pagination
        background
        :total="total"
        layout="prev, pager, next"
        :page-size="pagesize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/*                          使用说明
 *   需要传入的为总条数total,和每页条数pagesize,第几页：page,需要number类型
    当调用的时候加上simplify就可以启用精简版,精简版背景色为紫色上下页没有文字
 *                接受第几页数据是@getPageNum来接受
 */
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pagesize: {
      type: Number,
      default: 10
    },
    page:{
    	type:Number,
    	default:1
    },
    simplify: Boolean
  },

	watch:{

	},
	data() {
    return {
    	
    };
  },
  components: {},

  mounted() {
  	
  },

  methods: {
    handleCurrentChange(val) {
      this.$emit("getPageNum", val);
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import "@/styles/color.scss";
.page {
  display: flex;
  align-items: center;

  /deep/ .el-pagination span:not([class*="suffix"]),
  .el-pagination button {
    padding: 0 10px;
  }

  /deep/ .el-pagination__jump {
    margin-left: 0;
  }

  /deep/ .el-pagination__total {
    margin-right: 0;
  }

  /deep/ .el-pagination.is-background .btn-prev:disabled {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #ffffff;
    border-radius: 0px;
  }

  /deep/ .el-pagination.is-background .btn-next:disabled {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #ffffff;
    border-radius: 0px;
  }

  /deep/ .el-pager li {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #f0f0f0;
    border-radius: 0px;
  }

  /deep/ .el-pagination.is-background .btn-prev {
    border-radius: 0px;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  /deep/ .el-pagination.is-background .btn-next {
    border-radius: 0px;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #fafafa !important;
    color: #d4282d;
    border: none;
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #d4282d;
  }

  .rigth-button {
    /deep/ .el-button--primary {
      background-color: #f0f0f0;
      color: #333;
      width: 78px;
      padding: 8px 20px;
      border-radius: 0px;
      border: 1px solid rgba(217, 217, 217, 1) !important;
    }
  }
}
.grpage {
  display: flex;
  align-items: center;

  /deep/ .el-pagination span:not([class*="suffix"]),
  .el-pagination button {
    padding: 0 10px;
  }

  /deep/ .el-pagination__jump {
    margin-left: 0;
  }

  /deep/ .el-pagination__total {
    margin-right: 0;
  }

  /deep/ .el-pagination.is-background .btn-prev:disabled {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #ffffff;
    border-radius: 0px;
  }

  /deep/ .el-pagination.is-background .btn-next:disabled {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #ffffff;
    border-radius: 0px;
  }

  /deep/ .el-pager li {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: #ffffff;
    border-radius: 0px;
  }

  /deep/ .el-pagination.is-background .btn-prev {
    border-radius: 0px;
    background-color: #ffffff;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  /deep/ .el-pagination.is-background .btn-next {
    border-radius: 0px;
    background-color: #ffffff;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: $Theme-color !important;
    border: none;
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: $Theme-color;
    border: 1px solid $Theme-color;
    background-color: #ffffff;
  }

  .rigth-button {
    /deep/ .el-button--primary {
      background-color: #f0f0f0;
      color: #333;
      width: 78px;
      padding: 8px 20px;
      border-radius: 0px;
      border: 1px solid rgba(217, 217, 217, 1) !important;
    }
  }
}
</style>