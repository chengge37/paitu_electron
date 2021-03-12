<template>
  <div>
    <div class="content">
      <div class="topAdd">
        <div>
          <el-button type="primary" class="color-area" @click="openAdd" v-permission>
            <i class="el-icon-plus"></i>添加待办
          </el-button>
        </div>
        <div>
          <el-button type="text" @click="toWork">
            待办列表
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
      <div class="middle">
        <!--  v-if="user_data" -->
        <!-- {{user_data}} -->
        <el-radio v-model="radio" label="1" @change="isSelf">自己</el-radio>
        <el-radio v-model="radio" label="2" @change="isSelf">全部</el-radio>
      </div>
      <el-divider></el-divider>
      <div class="bottom new-scroll" v-if="todoList.length>0">
        <div
          class="wrap"
          v-for="item in todoList"
          :key="item.name+item.remark"
          @click="toDetail(item.id)"
        >
          <div class="todo-item">
            <div class="left">
              <div class="circle" @click.stop="open(item.status,item.id)">
                <i class="el-icon-check" v-if="item.status==3"></i>
              </div>
            </div>
            <div class="right">
              <div class="top">
                <div class="title">{{item.name}}</div>
                <div class="tag">
                  <el-tag size="mini" type="warning" v-if="outTime(item.end_time)">已逾期，请尽快处理</el-tag>
                  <el-tag size="mini" v-if="item.employee_array.length>1">多人</el-tag>
                  <el-tag size="mini" v-if="item.type==1">一般</el-tag>
                  <el-tag size="mini" v-if="item.type==2" type="warning">重要</el-tag>
                  <el-tag size="mini" v-if="item.type==3" type="danger">紧急</el-tag>
                  <!-- <el-tag size="mini">自己</el-tag> -->
                </div>
              </div>
              <div class="bot">
                <div
                  class="people"
                >{{handlePeople(item.employee_name_array)}}{{item.employee_array.length>1?`等${item.employee_array.length}人参与`:""}}</div>
                <div class="time">创建于：{{formatTime(item.create_time)}}</div>
              </div>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
      <div v-else class="empty">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { day } from "@/config/api";
import { format, max } from "date-fns";
// import { mapGetters } from "vuex";
export default {
  props: ["time_whole"],
  data() {
    return {
      radio: "1",
      params: {
        // page_size:8,
        start_time: "",
        end_time: ""
      },
      todoList: [],
      time: "",
      //防抖节流标识
      flag: true
    };
  },
  methods: {
    //状态变更提示
    open(status, id) {
      if (this.flag) {
        //一开始为true
        this.flag = false;
        switch (status) {
          case "1":
            this.postRequest("job/serveEdit", {
              id,
              status: 3,
              notice_way: 1
            }).then(res => {
              this.$message({
                message: "状态已变更为结办",
                type: "success"
              });
              this.getTodoList(this.time);
            });
            break;
          case "3":
            this.postRequest("job/serveEdit", {
              id,
              status: 1,
              notice_way: 1
            }).then(res => {
              this.$message({
                message: "状态已变更为待办",
                type: "success"
              });
              this.getTodoList(this.time);
            });
            break;
        }
      }
    },
    //判断是否超时
    outTime(endTime) {
      return new Date(endTime).getTime() < new Date().getTime();
    },
    toWork() {
      this.$router.push({
        path: "/serve/work/worklist"
      });
    },
    toDetail(id) {
      this.$router.push({
        path: "/serve/work/worklist",
        query: { id }
      });
    },
    //处理参与人员数组，最多展示4个人名
    handlePeople(nameStr) {
      let people = nameStr.split(",");
      people.length > 4 ? (people.length = 4) : "";
      return people.join("、");
    },
    formatTime(time) {
      return format(time * 1000, "YYYY-MM-DD HH:mm");
    },
    dateFormat(time, flag) {
      //用于产生当天0点或者24点
      //0是0点，24是23：59分
      if (flag) {
        return format(time, "YYYY-MM-DD") + " 23:59:59";
      } else {
        return format(time, "YYYY-MM-DD") + " 00:00:00";
      }
    },
    openAdd() {
      this.$emit("openAdd", 2);
    },
    isSelf() {
      this.getTodoList(this.time);
    },
    getTodoList(newVal) {
      this.params.start_time = this.dateFormat(newVal, 0);
      this.params.end_time = this.dateFormat(newVal, 24);
      this.params.is_all = this.radio == "1" ? 1 : 0;
      this.getRequest(day.serve_get_job, this.params)
        .then(res => {
          if (res) {
            this.todoList = res.rows;
            console.log(this.todoList, "这里是todo组件");
          }
          this.flag = true;
        })
        .catch(err => {
          console.log("请求待办列表失败", err);
        });
    }
  },
  watch: {
    time_whole(newVal) {
      this.time = newVal;
      // console.log(newVal, "这里是todo组件");
      this.getTodoList(newVal);
    }
  },
  computed: {
    // ...mapGetters(["user_data"])
  }
};
</script>
<style lang="scss" scoped>
// @import "@/styles/color.scss";
.content {
  .topAdd {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;
  }
  .middle {
    margin-top: 10px;
    padding: 0 10px;
    margin-bottom: 20px;
  }
  .bottom {
    height: 666px;
    overflow-y: scroll;
    padding-right: 15px;
    .wrap {
      cursor: pointer;
      .todo-item {
        height: 70px;
        display: flex;
        padding: 10px 0px;
        padding-left: 10px;
        .left {
          width: 30px;
          height: 100%;
          margin-right: 10px;
          .circle {
            font-size: 15px;
            width: 23px;
            height: 23px;
            border: 1px solid rgb(235, 235, 235);
            border-radius: 50%;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $Theme-color;
          }
        }
        .right {
          flex: 8;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          .top {
            color: rgba(51, 51, 51, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .bot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: rgba(153, 153, 153, 1);
            padding-top: 10px;
          }
        }
      }
    }
  }
  .empty {
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
  }
}
/deep/ .el-divider--horizontal {
  margin: 8px;
}
/deep/ .el-button--primary {
  background-color: $Theme-color;
}
</style>