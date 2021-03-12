<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain"
};
</script>
<style lang="scss" scoped>
@import '@/styles/color.scss';
@import '@/styles/serve.scss';
  .app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 62px);
  position: relative;
  // overflow: scroll;
  margin:20px;
      min-width: 1500px;
}
</style>

