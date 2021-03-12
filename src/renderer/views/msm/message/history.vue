<template>
  <div class="newServe">
    <div class="top-nav">
      <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
        <!--短信管理-->
        <el-tab-pane label="短信管理" name="0"></el-tab-pane>
      </el-tabs>
      <div @click="back" class="back word-hover">
        <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
        <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
        <span>返回</span>
      </div>
    </div>
    <div class="line"></div>

    <el-card class="box-card">
      <div class="card_title">发送历史</div>
      <div class="collapse" v-loading="loading" v-for="(item,index) in recordArray" :key="index">
        <div class="collapse_title">
          <el-checkbox
            v-model="item.checked"
            :label="item.text"
            @change="handleCheckedHistoryChange"
            class="collapse_checkbox"
          >{{item.text}}</el-checkbox>
          <span class="text">
            （共发送
            <strong class="color bold">{{item.total_count}}</strong> 条，成功发送
            <span class="color">{{item.succ_num}}</span> 条）
          </span>
          <!--<el-button type="primary"  @click="deleteRecord(index)">删除</el-button>-->
        </div>
        <div class="collapse_content">
          <el-collapse accordion class="collapse_content_text" @change="handleChange(index)">
            <el-collapse-item>
              <template slot="title">
                <div class="title_text msm" v-html="item.content"></div>
                <p class="data title_text">
                  {{item.time}}
                  <span class="show">{{item.status}}</span>
                </p>
              </template>
              <div class="hide_content">
                <div class="outer">
                  <div class="header">发送记录{{item.total_count}}人</div>
                  <div class="content">
                    <div v-for="(o,index) in item.detailArray" :key="index" class="item">
                      <p class="phone">{{o.mobile}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <el-checkbox
        style="display:none"
        class="allchecked"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
    </el-card>
    <el-pagination
      background
      layout="prev, pager, next"
      class="pagination"
      @current-change="handleCurrentChange"
      :page-size="page_size"
      :total="total_count"
    ></el-pagination>
  </div>
</template>

<script>
import { sms } from "@config/api.js";
import { format } from "date-fns";
export default {
  data: () => ({
    tabIndex: 0,
    isIndeterminate: false,
    checkAll: false,
    recordArray: [],
    total_count: 0,
    page_size: 1,
    page: 1,
    loading: false
  }),

  components: {},
  mounted() {
    this.loadHistory();
  },

  methods: {
    deleteRecord(index) {
      this.$message.info("暂时还不支持删除记录");
    },
    back() {
      this.$router.go(-1);
    },
    tabClick(val) {
      this.showReplyList = false;
      //清空回复框输入的内容
      this.inputReply = "";
    },
    //右侧收起展开
    handleChange(index) {
      if (this.recordArray[index].status === "展开") {
        console.log("handleChange = ");
        if (this.recordArray[index].detailArray.length == 0) {
          this.loadDetailArray(index);
        }
        this.recordArray[index].status = "收起";
      } else {
        this.recordArray[index].status = "展开";
      }
    },
    // 全选
    handleCheckAllChange(val) {
      if (val) {
        for (let i = 0; i < this.recordArray.length; i++) {
          this.recordArray[i].checked = true;
        }
      } else {
        for (let i = 0; i < this.recordArray.length; i++) {
          this.recordArray[i].checked = false;
        }
      }
      this.isIndeterminate = false;
    },
    //单选事件
    handleCheckedHistoryChange() {
      let tempCount = 0;
      for (let i = 0; i < this.recordArray.length; i++) {
        if (this.recordArray[i].checked === true) {
          tempCount++;
          this.checkAll = tempCount === this.recordArray.length;
          this.isIndeterminate =
            tempCount > 0 && tempCount < this.recordArray.length;
        }
      }
      if (tempCount === 0) {
        this.isIndeterminate = false;
      }
    },
    loadDetailArray(index) {
      let selectRecord = this.recordArray[index];
      this.getRequest(sms.getHistoryDetail, { id: selectRecord.id })
        .then(res => {
          this.recordArray[index].detailArray = res;
        })
        .catch(err => {});
    },
    loadHistory() {
      let p = {
        page: this.page,
        page_size: this.page_size
      };
      this.loading = true;
      this.getRequest(sms.getHistory, p)
        .then(res => {
          this.loading = false;
          this.total_count = parseInt(res.total_count);
          this.page = parseInt(res.page);
          this.recordArray = [];
          res.rows.forEach((item, index) => {
            this.recordArray.push({
              id: item.id,
              text: item.text,
              succ_num: item.succ_num,
              total_count: item.total_count,
              checked: false,
              create_time: format(
                new Date(item.create_time * 1000),
                "YYYY-MM-DD HH:mm:ss"
              ),
              status: "展开",
              detailArray: []
            });
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.loadHistory();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  min-width: 800px;
}

.top-nav {
  height: auto;
  /*padding-top: 50px;*/
  display: flex;
  justify-content: space-between;

  .back {
    cursor: pointer;

    .back-one {
      margin-right: -26px;
    }

    .back-two {
      margin-right: 2px;
    }
  }
}

.box-card {
  margin-top: 29px;
  width: 100%;
  margin-bottom:20px;

  .allchecked {
    padding-left: 62px;
  }

  .card_title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    border-left: 8px solid #7C6AFF;
    border-radius: 4px;
    margin-left: 23px;
    padding-left: 12px;
  }
}

.color {
  color: #7C6AFF;
}

.line {
  margin-top: -16px;
  margin-bottom: 5px;
}

.text {
  text-align: left;
}

.collapse {
  margin: 23px 43px 21px;
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 10px;

  .collapse_title {
    background: rgba(245, 248, 254, 1);
    border-radius: 10px 10px 0 0;
    height: 54px;
    line-height: 54px;
    padding-left: 20px;

    .collapse_checkbox {
      margin-right: 0;
      color: rgba(51, 51, 51, 1);
      font-weight: 600;
    }
  }

  .collapse_content {
    border-radius: 10px;

    .collapse_content_text {
      padding: 21px 50px 20px 20px;

      .title_text {
        line-height: 20px;
      }

      .msm {
        width: 700px;
      }

      .data {
        width: calc(100% - 700px);
        text-align: center;
        color: rgba(153, 153, 153, 1);

        .show {
          float: right;
          color: #e9b53b;
        }
      }

      .hide_content {
        margin-top: 20px;
        .outer {
          height: 270px;
          overflow-y: scroll;
          border: 1px solid rgba(204, 204, 204, 0.5);
          border-radius: 8px;
          text-align: center;
          .header {
            height: 49px;
            line-height: 49px;
            font-size: 14px;
            font-weight: bold;
            color: #909399;
            background: rgba(245, 248, 254, 1);
          }
          .content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            .item {
              width: 20%;
              height: 32px;
              line-height: 32px;
              font-size: 14px;
              color: #606266;
              border-bottom: 1px solid #ebeef5;
              border-right: 1px solid #ebeef5;
              transition: background-color 0.25s ease;
              display: flex;
              justify-content: center;
              align-items: center;
              .name {
                margin-right: 10px;
              }
            }
            .item:nth-child(5n + 5) {
              border-right: none;
            }
          }
        }
      }
    }
  }
}

.pagination {
  text-align: right;
}

/deep/ tr th {
  border-right: 0;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}

/deep/ .el-collapse-item__header focusing is-active,
/deep/ .el-collapse-item__header {
  border-radius: 10px;
  border: none;
}

/deep/ .el-collapse-item__wrap {
  border: none;
}

/deep/ .el-collapse-item__heade {
  height: auto;
  white-space: pre-line;
}

.btn_cancel {
  -webkit-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  appearance: none;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  margin-right: 9px;
  margin-top: 10px;
  width: 62px;
  height: 33px;
  background: rgba(58, 127, 159, 1);
  border-radius: 17px;
  float: right;
}

/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner,
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #7C6AFF;
  border-color: #7C6AFF;
}

/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: rgba(51, 51, 51, 1);
}

/deep/ .el-collapse-item__header {
  height: auto;
}

/deep/ .el-icon-arrow-right {
  color: #e9b53b;
}

.el-tabs--card /deep/ .el-tabs__header .el-tabs__item.is-active {
  background: #7C6AFF;
  border-radius: 5px 5px 0px 0px;
  color: #fff;
}
</style>
