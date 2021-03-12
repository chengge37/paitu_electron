<template>
  <!-- 标题 -->
  <div class="info-set">
    <span class="info-icon"></span>
    <span class="info-title">{{titleName}}</span>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: ["titleName"]
};
</script>
