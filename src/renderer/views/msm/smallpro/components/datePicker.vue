<!--  -->
<template>
  <div>
    <el-date-picker
      v-model="startTime"
      @change="startValue"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择开始时间"
    ></el-date-picker>
    <el-date-picker
      v-model="endTime"
      @change="endValue"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择结束时间"
      :disabled="IsLong"
    ></el-date-picker>
    <el-checkbox v-model="IsLong">是否长期</el-checkbox>
  </div>
</template>

<script>
export default {
  data: () => ({
    startTime: "",
    endTime: "",
    IsLong: false,
    Maindata: []
  }),
  props: {
    Timedata: {
      type: Array,
      default: []
    },
    Stype:{
      type:String,
      default:""
    }
  },

  components: {},
  created() {
    console.log(this.Timedata)
    if (this.Timedata) {
      this.startTime = this.Timedata[0];
      if (this.Timedata[1] == "长期") {
        this.IsLong = true;
      } else {
        this.endTime = this.Timedata[1];
      }
    }
  },
  mounted() {},

  methods: {
    checkData() {
      if (this.Maindata.length === 2) {
        this.$emit("GetTime", this.Maindata);
      }
    },
    startValue(value) {
      this.$set(this.Maindata, 0, value);
    },
    endValue(value) {
      this.$set(this.Maindata, 1, value);
    }
  },
  watch: {
    IsLong(value) {
      if (value) {
        this.$set(this.Maindata, 1, "长期");
      }
    },
    Maindata() {
      this.checkData();
    },
    Timedata(value) {
      console.log(value,this.Stype)
      this.startTime = value[0];
      if (value[1] == "长期") {
        this.IsLong = true;
      } else {
        this.endTime = value[1];
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>