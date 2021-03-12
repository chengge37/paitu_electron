<template>
  <div class="wrap">
    <!-- 递归组件 -->
    <div class="message-row" :class="{level1:item.flag.toString().indexOf('-')==-1,level2:item.flag.toString().split('-').length==2,level3:item.flag.toString().split('-').length==3}" v-for="(item,index) in list" :key="index">
        <div class="avatar" v-if="item.flag.toString().indexOf('-')==-1">
          <img :onerror="util.maleAvatar" :src="$qiniuHost+item.op_name.avatar" alt />
        </div>
        <div class="right-part">
          <div class="main-msg">
            <div class="reply-person">
              <span class="a-line" v-if="item.flag.toString().indexOf('-')!=-1">———</span>
              <p class="name">{{item.op_name.name}}</p>
              <span v-if="item.flag.toString().split('-').length>2">回复</span>
              <span v-if="item.flag.toString().split('-').length>2">{{parent}}</span>
              <p class="time">{{timeFormat(item.create_time)}}</p>
            </div>
            <p class="content">{{item.con}}</p>
            <div class="msg-btn">
              <span class="default-hover" @click="handleReply(item.flag)">{{curIndex==item.flag?'取消':'回复'}}</span>
              <span class="default-hover" @click="delMsg(item.id,item.j_id)" v-if="item.cid==user_data.cid">删除</span>
            </div>
          </div>
          <div v-if="curIndex==item.flag" class="reply-input" :key="item.flag" :id="item.flag">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="replyContent"></el-input>
            <span class="send-btn default-hover" @click="confirmReply(item.j_id,item.id,replyContent,item.flag)">确定</span>
          </div>
        </div>
        <!-- 递归组件不能用普通的$emit进行通信，使用vuex -->
        <tree-menus v-if="item.children" :list="item.children" :parent="item.op_name.name"></tree-menus>
    </div>
  </div>
</template>

<script>
import { worklist } from "@config/api.js";
import { mapGetters } from "vuex";

  export default {
    name:'treeMenus',
    props:{
      list:{
        type:Array,
        defaulte:[]
      },
      loop:{
        default:1
      },
      parent:{
        type:String
      }
    },
    data(){
      return{
        // loop:1
        curIndex:0,
        replyContent:''
      }
    },
    methods:{
      //点击回复显示输入框
      handleReply(i){
        console.warn(i,this.curIndex)
        if(this.curIndex==i){
          this.curIndex=0
          return
        }
        this.curIndex=i
        console.warn(i,this.curIndex)
      },
      // 获取工作的所有留言
      getMsg(j_id) {
        this.getRequest(worklist.getMsg, {
          j_id
        })
          .then(res => {
            console.warn(res,'获取所有留言')
            this.$store.commit(
              "SET_MSG_ARR",
              res
            );
          })
          .catch(err => {
            console.error(err);
          });
      },
      //输入回复后确定
      confirmReply(j_id, pid, con,flag){
        console.warn(flag,'uuuuuuuuuuuuuuuuuu')
        if (!con) {
          this.$message.warning("内容不能为空");
          return;
        }
        this.postRequest(worklist.addMsg, {
          j_id,
          pid,
          con
        })
          .then(res => {
            this.$message.success("添加留言成功");
            this.replyContent = "";
            this.curIndex=0
            this.getMsg(j_id)
          })
          .catch(err => {
            console.error(err);
          });
      },
      // 把时间戳转化为标准时间
      timeFormat(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        var m =
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":";
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      },
      // 删除留言
      delMsg(id,j_id) {
        this.$confirm("确定要删除该留言吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getRequest(worklist.delMsg, {
              id
            })
              .then(res => {
                this.$message.success("删除成功");
                this.getMsg(j_id);
              })
              .catch(err => {
                console.error(err);
              });
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    computed: {
      ...mapGetters(["user_data"])
    },
  }
</script>

<style lang="scss" scoped>
.wrap{
  // padding-left:20px;
  .message-row {
    display: flex;
    flex-wrap: wrap;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: tomato;
      margin-right: 20px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .right-part {
      width: calc(100% - 70px);
      // flex: 1;
      // width: 100%;
      padding-top: 4px;
      .main-msg {
        padding-bottom: 11px;
        border-bottom: 1px solid #f0f0f0;
        .name {
          color: #333;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .time {
          color: #999;
          margin-bottom: 14px;
        }
        .content {
          margin-bottom: 12px;
          font-size: 13px;
          color: #666;
          line-height: 22px;
          max-height: 150px;
          overflow-y: auto;
        }
        .msg-btn {
          color: #999;
          font-size: 12px;
          span {
            cursor: pointer;
          }
          span:first-child {
            margin-right: 10px;
          }
        }
      }
      .reply-input {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        margin-bottom: 10px;
        .el-textarea {
          margin-right: 10px;
        }
        .send-btn {
          width: 86px;
          height: 33px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #f0f0f0;
          color: #999;
          cursor: pointer;
        }
      }
      .reply-content {
        color: #666;
        background: #f7fbfc;
        padding: 20px;
        .first-reply {
          .content {
            line-height: 20px;
            margin-bottom: 10px;
            max-height: 150px;
            overflow-y: auto;
          }
          .who-time {
            margin-bottom: 10px;
            .a-line {
              color: #999;
            }
            span:nth-child(2),
            span:nth-child(4) {
              color: #333;
              font-weight: 600;
              margin-right: 5px;
            }
            span:last-child {
              color: #999;
            }
          }
          .reply-btn {
            font-size: 12px;
            color: #999;
            cursor: pointer;
            margin-bottom: 10px;
          }
          .reply-input {
            .send-btn {
              background: #fff;
            }
          }
          .second-reply {
            padding: 20px;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            .content {
              line-height: 20px;
              margin-bottom: 10px;
              max-height: 150px;
              overflow-y: auto;
            }
            .who-time {
              margin-bottom: 10px;
              .a-line {
                color: #999;
              }
              span:nth-child(2) {
                color: #333;
                font-weight: 600;
                margin-right: 5px;
              }
              span:last-child {
                color: #999;
              }
            }
            .reply-btn {
              font-size: 12px;
              color: #999;
              cursor: pointer;
            }
            .reply-input {
              .send-btn {
                background: #fff;
              }
            }
          }
          .second-reply:last-child {
            border-bottom: 1px solid #ddd;
          }
        }
        .first-reply + .first-reply {
          margin-top: 20px;
        }
      }
    }
  }
  .level1{
    padding-bottom: 10px;
    border-bottom:1px solid #F0F0F0;
    margin-bottom: 10px;
  }
  .level2{
    margin-left:70px;
    background: #F7FBFC;
    padding: 20px 0 20px 20px;
    .right-part{
      width: 100%;
      .main-msg{
        display: flex;
        flex-direction: column;
        .reply-person{
          display: flex;
          align-items: center;
          order:2;
          margin-bottom: 10px;
          .a-line{
            margin-right: 5px;
          }
          .name{
            margin-bottom: 0;
            margin-right: 8px;
          }
          .time{
            margin-bottom: 0;
          }
        }
        .content{
          order:1;
        }
        .msg-btn{
          order:3;
        }
      }
    }
  }
  .level3{
    margin-left: 20px;
    .right-part{
      .main-msg{
        .reply-person{
          flex-wrap: wrap;
          line-height: 22px;
          .a-line{
            margin-right: 5px;
          }
          .name{
            margin-bottom: 0;
            margin-right: 8px;
          }
          .name+span{
            margin-right: 8px;
          }
          .time{
            margin-bottom: 0;
          }
        }
        .content{
          order:1;
        }
        .msg-btn{
          order:3;
        }
      }
    }
  }
}
</style>