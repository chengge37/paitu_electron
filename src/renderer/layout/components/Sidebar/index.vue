<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="activeMenu"
      background-color="#ffffff"
      text-color="#333333"
      :collapse="isCollapse"
      active-text-color="#ffffff"
    >
      <Logo :collapse="isCollapse" />
      <sidebar-item
        v-for="route in NewRouters"
        :key="route.name"
        :item="route"
        :base-path="route.path"
        :collapse="isCollapse"
      ></sidebar-item>
    </el-menu>
    <div id="postaion" class="postaion"></div>
  </scroll-bar>
</template>

<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";
import Logo from "./logo";

export default {
  data() {
    return {
      map: null
    };
  },
  components: { SidebarItem, ScrollBar, Logo },
  computed: {
    ...mapGetters(["sidebar", "NewRouters"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    activeMenu() {
      const { meta, path } = this.$route;
      return meta.activeMenu || path;
    }
  },
  created() {
    //获取用户已经购买的产品
       this.getNowProduct();
  },
  mounted() {
    //定位地址
    let _loadApiPromise = lazyAMapApiLoaderInstance.load();
    _loadApiPromise.then(() => {
      this.init();
    });
  },
  methods: {
    //获取用户开通的功能
    getNowProduct() {
      this.util.getNowProduct().then(res => {
      	console.error('getUserProduct---------------',res);
      	console.error('NewRouters---------------',this.NewRouters);
      	let id=Number(res.pid);
        //如果已经购买单机版相关产品，隐藏左侧增值服务菜单
        if (id!=0) {
          this.NewRouters.forEach((item, index) => {
            if (item.path == "/serve/product_set") {
              console.log("111", item);
              this.$set(item, "hidden", true);
            }
          });
        }
      });
    },
    init() {
      try {
        this.map = new AMap.Map("postaion", {
          resizeEnable: true
        });
        AMap.service("AMap.Geocoder", () => {
          let geocoder = new AMap.Geocoder();
          geocoder.getAddress(this.map.getCenter(), (status, result) => {
            if (status === "complete" && result.info === "OK") {
              console.log("定位成功----", result);
              this.$store.commit(
                "SET_CITY_CODE",
                result.regeocode.addressComponent.citycode
              );
            } else {
              console.log("哦吼，定位失败");
            }
          });
        });
      } catch {
        setTimeout(() => {
          this.init();
        }, 100);
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  text-align: center;
  line-height: 64px;
  height: 64px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  background-color: #ffffff;
  padding: 0 20px;
  .logo-set {
    width: 21px;
    height: 21px;
  }
}
.minititle {
  padding: 0 10px;
  transition: padding 0.28s;
  overflow: hidden;
  width: 180px;
}
.postaion {
  width: 0px;
  height: 0px;
}
</style>