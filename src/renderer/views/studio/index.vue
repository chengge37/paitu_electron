<!--  -->
<template>
  <div class="newServe">
    <div class="mainInfo">
      <!-- 头部 -->
      <header>
        <div class="time-range">
          <span>按日期筛选：</span>
          <el-date-picker
            @change="changeDate"
            v-model="timeRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <!-- 影棚搜索框 -->
        <search-box @change="search" placeholder="输入影棚名称"></search-box>
        <el-button type="primary" @click="operate('up')" v-permission>批量上架</el-button>
        <el-button @click="operate('down')" v-permission>批量下架</el-button>
        <!-- 添加影棚按钮 -->
        <el-button type="primary" @click="toStudioDetails" v-permission>
          <i class="el-icon-plus"></i>
          <span class="word">新增影棚</span>
        </el-button>
        <!--<span class="group-del">批量删除</span>-->
      </header>

      <!-- 影棚列表 -->
      <el-table
        ref="multipleTable"
        :row-key="getRowKey"
        :data="studioList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="tblLoading"
      >
        <el-table-column type="selection" :reserve-selection="true" width="45"></el-table-column>

        <el-table-column label="添加时间" sortable align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.create_time | time2Date }}</template>
        </el-table-column>

        <el-table-column label="影棚名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column label="评分" align="center">
          <template slot-scope="scope">{{ scope.row.score }}</template>
        </el-table-column>

        <el-table-column label="所在楼层" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.floor }}</template>
        </el-table-column>

        <el-table-column label="影棚面积（平方）" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.square }}</template>
        </el-table-column>

        <el-table-column label="服务设施" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.serviceConditionArray|toServiceStr }}</template>
        </el-table-column>

        <el-table-column label="是否上架" align="center">
          <template slot-scope="scope">{{ scope.row.del==0?'已上架':'已下架'}}</template>
        </el-table-column>

        <el-table-column class="operation" label="操作" show-overflow-tooltip width="250">
          <template class="operation-list" slot-scope="scope">
            <el-button
              v-if="scope.row.is_valid!=0"
              @click="toStudioDetail(scope.row.id)"
              type="text"
            >详情</el-button>
            <el-button
              v-if="scope.row.is_valid!=0"
              @click="toStudioEdit(scope.row.id)"
              type="text"
              v-permission
            >修改</el-button>
            <el-button
              v-if="scope.row.is_valid!=0"
              @click="operate(scope.row.del==0?'1':'0',row)"
              type="text"
               v-permission
            >{{scope.row.del==0?'下架':'上架'}}</el-button>

            <el-button v-if="scope.row.is_valid!=0" @click="toSetFAQ(scope.row.id)" type="text" v-permission>设置问题</el-button>
            <!--<span v-if="scope.row.is_valid==0">审核中</span>-->
            <el-button type="text" v-if="scope.row.is_valid==0" style="color:#333;cursor:text;">审核中</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--设置问题组件模块-->
    <set-faq
      v-if="showFAQlist"
      :openDialog.sync="showFAQlist"
      type="1"
      :id="selectId"
      @closeFAQtable="closeFAQtable"
    ></set-faq>

    <!--分页模块-->
    <pagination
      :total="parseInt(total)"
      :page="parseInt(page)"
      :pagesize="parseInt(pageSize)"
      @getPageNum="changePage"
      class="pagination"
    ></pagination>
  </div>
</template>

<script>
import { studioApi } from "@config/api.js";
import { conditionArray } from "@config/config.js";
import { storage } from "@util/storage.js";
import setFaq from "ServeComponents/SetFAQ";
import searchBox from "ServeComponents/searchBox";
import pagination from "ServeComponents/FrontComponents/pagination";
export default {
  data() {
    return {
      studioList: [],
      showFAQlist: false, //是否显示设置问题对话框
      selectId: "", //选择关联的id
      timeRange: "",
      searchText: "", //搜索的内容
      page: 1,
      pageSize: 10,
      total: 0,
      ids: []
    };
  },

  components: {
    setFaq,
    searchBox,
    pagination
  },

  created() {
    console.log(conditionArray, "服务设施静态库");
    this.getStudioList();
  },

  mounted() {
    // this.searchList = this.studioList;
  },

  filters: {
    toServiceStr: val => {
      if (val.length != 0) {
        let serviceArr = [];
        val.split(",").forEach(item => {
          conditionArray.forEach(ele => {
            if (item == ele.id) {
              serviceArr.push(ele.name);
            }
          });
        });
        return serviceArr.join(" / ");
      } else {
        return "暂无";
      }
    }
  },

  methods: {
    //切换页码方法
    changePage(val) {
      console.log("changePage----------", val);
      this.page = val;
      this.getStudioList();
    },

    //关闭常见问题对话框方法
    closeFAQtable() {
      this.showFAQlist = false;
    },
    //跳转到设置常见问题对话框
    toSetFAQ(id) {
      console.log("setFAQ---------", id);
      this.selectId = id;
      this.showFAQlist = true;
    },
    // 获取影棚列表
    getStudioList() {
      this.tblLoading = true;
      let _this = this;
      let params = {
        page: this.page,
        page_size: this.pageSize,
        search: this.searchText
      };
      if (this.timeRange) {
        params.st_time = this.timeRange[0];
        params.et_time = this.timeRange[1];
      }
      console.log("getStudioList-----------", params);
      this.getRequest(studioApi.studioServeGet, params)
        .then(res => {
          this.tblLoading = false;
          console.log(res, "所有影棚信息");
          this.studioList = res.rows;
          this.total = res.total_count;
        })
        .catch(err => {
          this.tblLoading = false;
        });
    },
    //批量操作方法，0/上架 ，1/下架
    operate(type, item) {
      let ids = "";
      let is_up;
      let title = "";
      if (type == 0) {
        is_up = 0;
        title = "上架";
      } else {
        is_up = 1;
        title = "下架";
      }
      if (!item) {
        if (this.ids.length == 0) {
          this.$message.warning("请选择影棚对象");
          return;
        }
        ids = this.ids.join(",");
      } else {
        ids = item.id;
      }

      let params = {
        ids: ids,
        is_up: is_up
      };
      this.util
        .confirm(this, "确定" + title + "影棚吗?")
        .then(res => {
          if (res) {
            this.util.studioShelfIsUp(params).then(res => {
              this.$message.success("操作成功!");
              this.getStudioList();
              console.log("studioShelfIsUp-------", res);
            });
          }
        })
        .catch(error => {});
    },

    //批量操作方法
    operate(type) {
      console.warn(this.ids, "jhajajja");
      if (this.ids.length == 0) {
        this.$message.warning("请选择影棚对象");
        return;
      }
      let ids = this.ids.join(",");
      let is_up;
      //批量上架
      if (type == "up") {
        is_up = 0;
      } else {
        is_up = 1;
      }
      let params = {
        ids: ids,
        is_up: is_up
      };
      this.util.studioShelfIsUp(params).then(res => {
        this.$message.success("操作成功!");
        this.getStudioList();
        console.log("studioShelfIsUp-------", res);
      });
    },

    // 指定一个key标识这一行的数据,分页记住勾选
    getRowKey(row) {
      return row.id;
    },

    //选择选项方法
    handleSelectionChange(val) {
      this.ids = [];
      val.forEach(item => {
        this.ids.push(item.id);
      });
      console.log("this.ids---", this.ids);
    },

    //选择时间方法
    changeDate() {
      this.getStudioList();
    },
    //搜索方法
    search(val) {
      this.searchText = val;
      this.getStudioList();
    },
    // 点击添加按钮跳转到影棚详情页面，状态为可添加
    toStudioDetails() {
      storage.set("studioEdit", true);
      this.$router.push({
        path: "/serve/control_center/Studio_details",
        query: {
          canEdit: true
        }
      });
    },
    // 跳转到影棚详情页，状态为不可编辑
    toStudioDetail(id) {
      storage.set("studioEdit", false);
      this.$router.push({
        path: "/serve/control_center/Studio_details",
        query: {
          id,
          canEdit: false
        }
      });
    },
    // 跳转到设备详情页，状态为可编辑
    toStudioEdit(id) {
      storage.set("studioEdit", true);
      this.$router.push({
        path: "/serve/control_center/Studio_details",
        query: {
          id,
          canEdit: true
        }
        // query: { item: item, canEdit: false }
      });
    },
    // 删除设备
    delStudio(id) {
      this.$confirm("此操作将永久删除该影棚, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest(studioApi.studioServeDel, {
            id
          })
            .then(res => {
              console.log(res);
              this.getStudioList();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    filterHandle(value, row) {
      return row.tag === value;
    }
  }
};
</script>
<style lang='scss' scoped>
// 头部
header {
  height: 73px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 30px;
  .time-range {
    margin-right: auto;
    .el-date-editor {
      width: 250px;
      /deep/ {
        .el-range-separator {
          margin-right: 10px;
        }
      }
    }
  }
  // 添加按钮
  .add-button {
    width: 117px;
    height: 34px;
    background-color: $Theme-color;
    border-radius: 2px;
    color: #fff;
    margin-right: 20px;
    .el-icon-plus {
      width: 14px;
      height: 14px;
    }
    .word {
      font-size: 14px;
      margin-left: 0px;
    }
  }
  .search-box {
    margin-right: 20px;
  }
  // 搜索输入框
  .search {
    border: 1px solid #ccc;
    display: flex;
    height: 34px;
    border-radius: 2px;
    margin-right: 20px;
    input {
      height: 100%;
      outline: none;
      border: none;
      text-indent: 1em;
    }
    .el-icon-search {
      background: #fff;
      display: flex;
      align-items: center;
      padding: 5px;
      box-sizing: border-box;
    }
    .search-button {
      background-color: $Theme-color;
      border-radius: 0;
      color: #fff;
      border: none;
    }
  }
  .up-put {
    width: 76px;
    height: 34px;
    background: #7c6aff;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
  }
  .down-put {
    width: 76px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border: 1px solid #d9d9d9;
    color: #999;
    cursor: pointer;
  }
  .group-del {
    width: 76px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border: 1px solid #d9d9d9;
    color: #999;
    cursor: pointer;
  }
}

// 影棚列表
.studio-table {
  background: #fff;
  padding: 10px;
  border: 1px solid #eee;
  border: none;
  /*min-height: 700px;*/
  .el-table {
    border: none;
    border-radius: 0;
    /deep/ {
      .el-table__row {
        height: 50px;
        .cell {
          padding: 0 7px;
        }
      }
      .el-table__header {
        thead {
          tr {
            th {
              background: #f0faff !important;
            }
          }
        }
      }
    }
  }
}

// 分页
.page {
  display: flex;
  justify-content: flex-end;
  .el-pagination {
    padding-right: 0;
  }
}
</style>