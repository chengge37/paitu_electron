<template>
  <div id="app">
    <c-header></c-header>
      <router-view />
  </div>
</template>

<script>
import CHeader from "./components/Systitle";
export default {
  components: { CHeader }
};
</script>

<style scoped>
/* CSS */
</style>
