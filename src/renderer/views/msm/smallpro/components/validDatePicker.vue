<template>
  <el-row>
    <el-col :span="10">
      <el-date-picker
        size="mini"
        :clearable="false"
        v-model="dateStart"
        type="date"
        placeholder="选择开始日期"
      ></el-date-picker>
    </el-col>
    <el-col :span="10">
      <el-date-picker
        size="mini"
        :clearable="false"
        :disabled="selfIsLong"
        v-model="dateEnd"
        type="date"
        placeholder="选择结束日期"
      ></el-date-picker>
    </el-col>
    <el-col :span="2">
      <el-checkbox v-model="selfIsLong" @change="handleLongChange">长期</el-checkbox>
    </el-col>
  </el-row>
</template>

<script>
import { format } from "date-fns";
export default {
  name: "validDatePicker",
  model: {
    prop: "dateArrayStr",
    event: "dateArraychange"
  },
  props: ["dateArrayStr"],
  watch: {
    dateArrayStr(val) {
      this.str2Arr(val);
    },

    dateStart(val) {
      console.log("dateStart 改变了", val);
      if (val) {
        this.selfDateArray[0] = format(val, "YYYY-MM-DD");
        if (!this.selfIsLong && this.dateEnd == null) {
          this.dateEnd = val;
          this.selfDateArray[1] = format(val, "YYYY-MM-DD");
        }
      } else {
        this.dateEnd = null;
        this.selfIsLong = false;
        this.selfDateArray = [];
      }
      if (this.selfIsLong) {
        if (this.selfDateArray.length >= 1) {
          this.selfDateArray[1] = "长期";
        }
      }
      this.change();
    },
    dateEnd(val) {
      console.log("dateEnd 改变了", val);
      if (val) {
        if ((this.selfDateArray.length = 2)) {
          this.selfDateArray[1] = format(val, "YYYY-MM-DD");
        } else {
          this.selfDateArray[0] = format(val, "YYYY-MM-DD");
          this.selfDateArray[1] = format(val, "YYYY-MM-DD");
        }
      } else {
        if (this.selfDateArray.length > 1) {
          this.selfDateArray.splice(1, 1);
        }
        if (this.selfIsLong) {
          if (this.selfDateArray.length >= 1) {
            this.selfDateArray[1] = "长期";
          }
        }
      }
      this.change();
    }
  },
  created() {
    console.log("dateArrayStr = " + this.dateArrayStr);
    this.str2Arr(this.dateArrayStr);
  },
  filters: {},
  data() {
    return {
      selfDateArray: [],
      selfIsLong: false,
      dateStart: null,
      dateEnd: null
    };
  },
  computed: {},
  methods: {
    str2Arr(val) {
      console.log("dateArray", val);
      if (!this.util.isEmpty(val) && val.length > 0) {
        let arr = JSON.parse(val);
        if (arr.length == 2) {
          let dateStart = arr[0];
          let dateEnd = arr[1];
          this.dateStart = new Date(dateStart);
          this.selfDateArray[0] = dateStart;
          if (dateEnd == "长期") {
            this.selfDateArray[1] = dateStart;
          } else {
            this.dateEnd = new Date(dateEnd);
            this.selfDateArray[1] = dateEnd;
          }
        }
      }
    },
    handleLongChange(val) {
      console.log("是否长期 " + val);
      this.selfIsLong = val;

      if (this.dateStart != null && !val) {
        this.dateEnd = this.dateStart;
      } else {
        this.dateEnd = null;
      }
      if (this.selfIsLong) {
        if (this.selfDateArray.length >= 1) {
          this.selfDateArray[1] = "长期";
        }
      }
      this.change();
    },
    change() {
      console.log("触发发送数据");
      if (this.selfDateArray.length == 2) {
        this.$emit("dateArraychange", JSON.stringify(this.selfDateArray));
      } else {
        this.$emit("dateArraychange", "");
      }
    }
  }
};
</script>

<style>
</style>
