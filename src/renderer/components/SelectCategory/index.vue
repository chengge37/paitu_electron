<template>
  <div>
    <el-row>
      <el-col :span="5">
        <span class="select-label">选择类别</span>
          <el-cascader
            @change="changeCategory"
            placeholder="全部类别"
            class="cascader-border"
            :options.sync="equipCategoryArray"
            :show-all-levels="false"
            :props="{value:'id',label:'name'}"
            v-model="selectedCategory"
          ></el-cascader>
      </el-col>

      <el-col :span="5">
        <span class="select-label">设备品牌</span>
          <el-cascader
            @change="changeBrand"
            placeholder="全部品牌"
            class="cascader-border"
            :options.sync="brandArray"
            :show-all-levels="false"
            :disabled="selectedCategory.length===0"
            :props="{value:'id',label:'name'}"
            v-model="selectedBrand"
          ></el-cascader>
      </el-col>

      <el-col :span="5">
        <span class="select-label">设备型号</span>
          <el-cascader
            @change="changeEquip"
            placeholder="全部型号"
            class="cascader-border"
            :options.sync="equipArray"
            :show-all-levels="false"
            :disabled="selectedBrand.length===0"
            :props="{value:'id',label:'name'}"
            v-model="selectedEquip"
          ></el-cascader>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { staticEquipCatArray } from "@config/config.js";
import { staticBrandArray } from "@config/config.js";
import { staticEquipArray } from "@config/config.js";

  export default {
    data(){
      return{
        selectedCategory:[],//选择的类别
        selectedBrand:[],//选择的品牌
        selectedEquip:[],//选择的设备
        equipCategoryArray: staticEquipCatArray,//从静态库获取的所有类别数据
        brandArray:[],//品牌选择框中相应的选项
        equipArray:[],//设备选择框中相应的选项
      }
    },
    methods:{
       // 数组去重
      unique(arr){
        var x = new Set(arr);
        return [...x];
      },
      // 选择类别
      changeCategory(value){
        this.$emit('getCategory',value)//父组件触发getCategory事件获取选择的类别id
        let category_sameid_array=[];
        staticEquipArray.forEach((item,index)=>{
          if(item.category_id===value[value.length-1]){
            category_sameid_array.push(item.brand_id)
          }
        })
        this.brandArray=[]
        staticBrandArray.forEach((each,j)=>{
          this.unique(category_sameid_array).forEach((brand,k)=>{
            if(each.id===brand){
              this.brandArray.push(each)
            }
          })
        })
        this.selectedBrand=[]
        this.selectedEquip=[]
      },
      // 选择品牌
      changeBrand(value){
        this.$emit('getBrand',value)//父组件触发getBrand事件获取选择的品牌id
        this.equipArray=[];
        staticEquipArray.forEach((item,index)=>{
          if(item.category_id===this.selectedCategory[this.selectedCategory.length-1]&&item.brand_id===this.selectedBrand[0]){
            this.equipArray.push(item)
          }
        })
      },
      // 选择设备
      changeEquip(value){
        this.$emit('getEquip',value)//父组件触发getEquip事件获取选择的设备id
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>