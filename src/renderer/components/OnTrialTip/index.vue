<!--  -->
<template>
  <div class="mask-box" v-if="show">
    <div class="diolog-box">
      <div class="img">
        <el-image :src="img"></el-image>
      </div>
      <div class="ellipse"></div>
      <div class="title-box">
        <div class="gtitle">恭喜</div>
        <div class="wtitle">您已获得以下增值功能</div>
      </div>
      <div class="conten-box">
        <div class="content">
          <div>
            <svg-icon icon-class="duigou" class-name="icon-size"></svg-icon>
            <span>独立的小程序</span>
          </div>
          <div>
            <svg-icon icon-class="duigou" class-name="icon-size"></svg-icon>
            <span>数据保密</span>
          </div>
          <div>
            <svg-icon icon-class="duigou" class-name="icon-size"></svg-icon>
            <span>多账号权限</span>
          </div>
        </div>
        <div class="button-box">
          <el-button type="primary" round @click="close">好的</el-button>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    show: false,
    img: require("@/assets/icon/OnTrial.png")
  }),

  components: {},

  mounted() {
    if (this.user_data.mac === null) {
      this.show = true;
    }
  },

  methods: {
    close() {
      this.$store.dispatch("AddMac");
      this.$store.dispatch('VaildToken')
      this.show = false;
    }
  },
  computed: {
    ...mapGetters(["user_data"])
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
@import "@/styles/color.scss";
.mask-box {
  height: 100%;
  width: 100%;
  z-index: 99999;
  backdrop-filter: saturate(150%) blur(6px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background-color: #0000004b;
  display: flex;
  justify-content: center;
  align-items: center;
  .diolog-box {
    width: 400px;
    height: 149px;
    background-color: #814bf8;
    position: relative;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    bottom: 150px;
    .img {
      position: absolute;
      top: -106px;
      left: -82px;
      width: 138%;
      z-index: 3;
    }
    .ellipse {
      background-color: #814bf8;
      border-radius: 50%;
      width: 400px;
      position: absolute;
      bottom: -62px;
      height: 130px;
      z-index: 2;
    }
    .title-box {
      position: absolute;
      top: 45px;
      left: 88px;
      z-index: 3;
      .gtitle {
        color: #fef12f;
        font-size: 36px;
        font-weight: bold;
      }
      .wtitle {
        margin-top: 20px;
        color: #ffffff;
        font-size: 24px;
      }
    }
    .conten-box {
      position: absolute;
      background-color: #ffffff;
      width: 100%;
      top: 150px;
      padding-top: 120px;
      padding-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      .content {
        line-height: 48px;
        font-size: 20px;
        color: #333;
      }
    }
    .button-box {
      margin-top: 20px;
      /deep/ .el-button {
        width: 220px;
      }
    }
  }
}
</style>