<!--  -->
<template>
  <div class="switch-box">
    <el-switch
      v-model="value"
      width="45"
      active-color="#13ce66"
      inactive-color="#7C6AFF"
      :active-text="value?`数据已保密`:`数据保密`"
      :inactive-text="value?`数据同步`:`数据已同步`"
    ></el-switch>
    <ali-svg-icon icon-class="Vupload" :class-name="value?`miss-svg`:`upload-postion`"></ali-svg-icon>
    <ali-svg-icon icon-class="Glock" :class-name="value?`lock-postion`:`miss-svg`"></ali-svg-icon>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: false
  }),

  components: {},

  mounted() {},

  methods: {},
  watch: {
    value(e) {
      this.emit("getvalue", e);
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.switch-box {
  position: relative;
  /deep/ .el-switch__label--right.is-active {
    color: #13ce66 !important;
  }
  /deep/ .el-switch__label--left.is-active {
    color: #7C6AFF !important;
  }
  .upload-postion {
    position: absolute;
    top: 5px;
    left: 84px;
    width: 11px;
    height: 11px;
    pointer-events: none;
    transform: all 0.3s;
    opacity: 1;
  }
  .lock-postion {
    position: absolute;
    top: 4px;
    left: 96px;
    width: 11px;
    height: 11px;
    pointer-events: none;
    transform: all 0.3s;
    opacity: 1;
  }
  .miss-svg {
    opacity: 0;
  }
}
</style>