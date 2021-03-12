<!--  -->
<template>
  <div class="mask-box">
    <div class="title-box">
      <div class="title">
        <ali-svg-icon :icon-class="icon_name" class-name="cuowu"></ali-svg-icon>
        <div class="text">{{title}}</div>
      </div>
      <div class="content" v-if="!showProgress">{{message}}</div>
      <div class="download-progress" v-else>
        <el-progress :percentage="percentage" :color="colors" :status="progressStaus"></el-progress>
      </div>
      <div class="progress-content" v-if="showProgress&&winOS">注：当提示您安全警告时，请点击“运行(R)”，或者点击“更多信息”，选择仍要运行</div>
      <div class="bom-box">
        <el-button type="text" @click="openfile" v-if="progressStaus == 'success'">查看文件位置</el-button>
        <el-button type="primary" @click="primarybtn" :loading="Bloading">{{primaryButton}}</el-button>
        <el-button @click="killSys">{{killButton}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ipcApi from "@/utils/ipcRenderer";
import Sysdialog from "@/tools/dialog";
import os from "os";
import { remote, shell } from "electron";
export default {
  data: () => ({
    show: true,
    title: "您的账号已经到期",
    message: "请续费或购买产品",
    primaryButton: "立即开通",
    killButton: "退出程序",
    info: os.userInfo(),
    showProgress: false,
    percentage: 0,
    progressStaus: null,
    winOS:os.platform().includes('win32'),
    colors: [
      { color: "#f56c6c", percentage: 20 },
      { color: "#e6a23c", percentage: 40 },
      { color: "#6f7ad3", percentage: 60 },
      { color: "#1989fa", percentage: 80 },
      { color: "#5cb87a", percentage: 100 }
    ],
    Bloading: false,
    icon_name: "cuowu",
    filePath: ""
  }),

  components: {},
  created() {
    if (this.showProgress) {
      this.start_update();
    }
  },
  mounted() {},

  methods: {
    openfile() {
      shell.showItemInFolder(this.filePath);
    },
    killSys() {
      ipcApi.send("window-close");
    },
    primarybtn() {
      const dialog = this.$electron.remote.dialog;
      console.log(this.primaryButton);
      switch (this.primaryButton) {
        case "立即开通":
          this.$electron.shell.openExternal(
            "https://www.paitume.com/publicity/index?area=buyProduct"
          );
          break;
        case "前往官网":
          this.$electron.shell.openExternal(
            "https://www.paitume.com/publicity/index"
          );
          break;
        case "重启":
          ipcApi.send("window-reload");
          break;
        case "立刻更新":
          remote.shell.openItem(this.filePath);
          break;
        case "立刻升级":
          this.showProgress = true;
          break;
        case "退出登录":
          localStorage.removeItem('user')
          location.reload()
          break;
        default:
          break;
      }
    },
    start_update() {
      this.Bloading = true;
      ipcApi.send("satrt-download");
      ipcApi.on("download-progress", (event, arg) => {
        this.title = "正在下载更新";
        this.percentage = Number(arg);
      });
      ipcApi.on("download-error", (event, arg) => {
        if (arg) {
          this.icon_name = "cuowu1";
          this.title = "更新出错";
          this.Bloading = false;
          this.primaryButton = "前往官网";
          this.progressStaus = "exception";
          this.percentage = 40;
          this.colors = "#d81e06";
        }
      });
      ipcApi.on("download-done", (event, age) => {
        this.filePath = age.filePath;
        this.primaryButton = "立刻更新";
        this.progressStaus = "success";
        this.icon_name = "chenggong";
        this.Bloading = false;
        this.title = "下载完成";
      });
    }
  },
  watch: {
    showProgress(value) {
      if (value) {
        this.start_update();
      }
    }
  },
  destroyed(){
    ipcApi.remove("download-progress")
    ipcApi.remove("download-error")
    ipcApi.remove("download-done")
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.mask-box {
  height: 100%;
  width: 100%;
  z-index: 99999;
  backdrop-filter: saturate(180%) blur(20px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  .title-box {
    position: relative;
    margin: 0 auto 50px;
    background-color: #ffffff;
    width: 50%;
    margin-top: 20vh;
    color: #333;
    border-radius: 2px;
    padding: 48px 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    .title {
      display: flex;
      line-height: 25px;
      justify-content: center;
      .cuowu {
        color: #999999;
        width: 25px;
        height: 25px;
        margin-right: 16px;
      }
      .text {
        font-size: 30px;
      }
    }
    .content {
      padding: 37px 30px;
    }
    .bom-box {
      /deep/ .el-button {
        padding: 10px 35px;
      }
    }
    .download-progress {
      width: 100%;
      padding: 50px;
    }
    .progress-content {
      color: red;
      padding: 10px;
    }
  }
}
</style>