<!--  -->
<template>
  <div class="actde-container newServe">
    <div class="top-nav">
      <div class="top-title">{{title}}</div>
      <div @click="goBack" class="back word-hover">
        <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
        <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
        <span>返回</span>
      </div>
    </div>

    <div class="form-box">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="labelWidth"
        label-position="left"
      >
        <!-- <div class="info-set">
            <div class="info-icon"></div>
            <div class="info-title">活动信息</div>
        </div>-->

        <el-row>
          <el-col :span="10">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="form.name" placeholder="输入活动名称(不少于6个字)" v-if="!isEdit"></el-input>
              <p class="text-right" v-else>{{form.name}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="活动简介" class="people" prop="brief">
              <el-input
                v-model="form.brief"
                v-if="!isEdit"
                type="textarea"
                :autosize="{ minRows: 2}"
                show-word-limit
                maxlength="256"
                placeholder="此处的内容用于简略描述您的活动内容(不少于6个字)"
                prop="brief"
              ></el-input>
              <p class="text-right" style="position:relative;left:-10px" v-else>{{form.brief}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="short-input twoCol">
          <div class="col">
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" v-if="!isEdit">
                <el-option
                  v-for="item in active_type_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <p class="text-right" v-else>
                <span v-if="form.type=='1'">线上活动</span>
                <span v-else>线下活动</span>
              </p>
            </el-form-item>
          </div>
        </el-row>
        <el-row class="short-input twoCol">
          <div class="col">
            <el-form-item label="是否免费" prop="type">
              <el-select v-model="isFree" placeholder="请选择" v-if="!isEdit">
                <el-option
                  v-for="item in freeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <p class="text-right" v-else>
                <span v-if="form.fee!=0||form.fee!='0'">否</span>
                <span v-else>是</span>
              </p>
            </el-form-item>
          </div>
          <div class="col" v-if="!isFree">
            <el-form-item label="报名费用" prop="fee">
              <el-input
                v-model="form.fee"
                placeholder="请输入"
                prefix-icon="el-icon-ptmqian"
                v-if="!isEdit"
              ></el-input>
            </el-form-item>
          </div>
        </el-row>
        <el-row class="short-input twoCol">
          <div class="col">
            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="form.start_time"
                type="datetime"
                placeholder="选择日期"
                v-if="!isEdit"
              ></el-date-picker>
              <p class="text-right" v-else>{{form.start_time}}</p>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="form.end_time"
                type="datetime"
                placeholder="选择日期"
                v-if="!isEdit"
              ></el-date-picker>
              <p class="text-right" v-else>{{form.end_time}}</p>
            </el-form-item>
          </div>
        </el-row>
        <!-- <el-form ref="address" :model="address" :rules="addressRules" :label-width="labelWidth">
            <el-row class="short-input twoCol">
                <div class="col">
                  <el-form-item label="活动地址"   prop="selectAddress" class="selectAddress">
                      <el-cascader size="large" :options="cityOptions" v-model="address.selectAddress" @change="cityChange" placeholder="请选择省份/城市/地区">
                      </el-cascader>
                  </el-form-item>
                </div>
                <div class="col">
                  <el-form-item label=""   prop="addressDetail" class="selectAddress">
                      <el-input style="margin-left:-90px" v-model="address.addressDetail" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </div>
            </el-row>
        </el-form>-->
        <el-row class="short-input">
          <el-col :span="10">
            <el-form-item label="人数限制" class="people" prop="max_person">
              <el-input
                v-model="form.max_person"
                type="number"
                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-if="!isEdit"
              ></el-input>
              <p class="text-right" v-else>{{form.max_person}}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="活动封面" class="people" prop="pic">
              <clipper
                bordercolor="#DCDFE6"
                bgcolor="#fff"
                :showPen="true"
                :resultWidth="285"
                :editable="!isEdit"
                :imgList="[{key:form.pic}]"
                @delSuccess="delSuccess"
                @uploadSuccess="uploadSuccess"
                :uploadWidth="148"
                :uploadHeight="148"
                :ratio="4/3"
              ></clipper>
              <!-- <Uploadimg class="text-right" :imageUrl="form.pic" :editable="!isEdit" @handleSuccess="handleSuccess" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="活动地址" class="address" prop="address_ditu">
              <el-input
                id="tipinput"
                v-model="form.address_ditu"
                placeholder="请输入地址"
                v-if="!isEdit"
                style="width:100%;"
                class="text-right activityAddress"
              ></el-input>
              <!-- <el-autocomplete
                  id="tipinput"
                  v-model="form.address"
                  :fetch-suggestions="autoComplete"
                  placeholder="请输入内容"
                  @select="changeTip"
                  v-if="!isEdit"
                  style="width:100%;"
                  class="text-right activityAddress"
              ></el-autocomplete>-->
              <p class="text-right" v-else>{{form.address_ditu}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="楼层门牌" class="address" required>
              <el-input
                v-model="addressPOI"
                placeholder="请输入具体楼层门牌号"
                v-if="!isEdit"
                style="width:100%;"
                class="text-right activityAddress"
              ></el-input>
              <p
                class="text-right"
                v-else-if="this.form.address_ditu"
              >{{this.form.address.slice(this.form.address_ditu.length)}}</p>
              <p v-else></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <div id="container" style="width:calc(100% + 300px);height: 288px;padding-left: 10px;"></div>
          </el-col>
        </el-row>

        <!-- 富文本部分 -->
        <div class="info-html">
          <div class="info-set" style="display:flex;align-items:baseline;">
            <div class="info-icon"></div>
            <div class="info-title">活动正文</div>
            <span style="margin-left:10px;">(必填，不少于16个字的描述)</span>
          </div>
          <div class="textare" v-if="!isEdit">
            <el-form-item prop="info">
              <tinymce v-model="form.info" :height="300" />
            </el-form-item>
          </div>
          <div v-else class="textare">
            <div v-html="form.info"></div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="bottomBtn">
    	<el-button class="color-area" type="primary" v-if="isEdit" @click="cancel" v-permission>修改</el-button>
      <div v-if="!isEdit">
        <el-button class="color-area" type="primary" @click="confirm">确定</el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData } from "element-china-area-data";
import { lazyAMapApiLoaderInstance } from "vue-amap";
import Tinymce from "ServeComponents/Tinymce";
import { storage } from "@/utils/storage";
import {
  validatesixlength,
  validateSixteenlength,
  validateInteger,
  validateTime,
  isEmptyForm
} from "@/utils/validate.js";
import { activity } from "@/config/api";
import { mapState } from "vuex";
import Uploadimg from "ServeComponents/untilsupload";
import clipper from "ServeComponents/photoClipper";

export default {
  data: () => ({
    labelWidth: "120px",
    title: "初始化",
    isEdit: Boolean,
    cityOptions: regionData,
    addressPOI: "",
    active_type_options: [
      {
        value: "1",
        label: "线上活动"
      },
      {
        value: "2",
        label: "线下活动"
      }
    ],
    freeArr: [
      {
        value: 1,
        label: "免费"
      },
      {
        value: 0,
        label: "付费"
      }
    ],
    isFree: 1,
    address: {
      selectAddress: "",
      addressDetail: ""
    },
    form: {
      name: "",
      address: "",
      city_code: "",
      start_time: "",
      end_time: "",
      max_person: "",
      fee: 0,
      info: "",
      type: "",
      lat: "",
      lng: "",
      brief: "",
      pic: ""
    },
    map: null,
    markerList: [],
    placeSearch: null,
    placeSearch2: null,
    loaded: null,
    UseMap: true,
    state: 0,
    addressRules: {
      selectAddress: [
        {
          required: true,
          trigger: "change",
          message: "请选择地址"
        }
      ],
      addressDetail: [
        {
          required: true,
          trigger: "blur",
          message: "详细地址不能为空"
        }
      ]
    },
    rules: {
      name: [
        {
          required: true,
          trigger: "blur",
          validator: validatesixlength
        }
      ],
      address: [
        {
          required: true,
          trigger: "blur"
          // validator: validatesixlength
        }
      ],
      address_ditu: [
        {
          required: true,
          trigger: "blur"
          // validator: validatesixlength
        }
      ],
      start_time: [
        {
          required: true,
          trigger: "blur",
          validator: validateTime
        }
      ],
      end_time: [
        {
          required: true,
          trigger: "blur",
          validator: validateTime
        }
      ],
      max_person: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      fee: [
        {
          required: true,
          trigger: "blur",
          validator: validateInteger
        }
      ],
      info: [
        {
          required: true,
          trigger: "blur",
          validator: validateSixteenlength
        }
      ],
      type: [
        {
          required: true,
          trigger: "blur",
          validator: isEmptyForm
        }
      ],
      // brief: [
      //   {
      //     required: true,
      //     trigger: "blur",
      //     validator: validatesixlength
      //   }
      // ],
      pic: [
        {
          required: true,
          trigger: "blur"
        }
      ]
    }
  }),
  watch: {
    isFree() {
      if (this.isFree) {
        this.form.fee = 0;
      }
    },
    addressPOI(val) {
      this.form.address = this.form.address_ditu + this.addressPOI;
    },
    "form.address_ditu"(val) {
      this.form.address = this.form.address_ditu + this.addressPOI;
      this.changeMap();
    }
  },
  components: { Tinymce, Uploadimg, clipper },

  created() {
    if (this.$route.query.id) {
      let params = {
        id: this.$route.query.id
      };
      this.getRequest(activity.serve_activity_list, params).then(res => {
        this.form = res.rows[0];
        if (this.form.address_ditu) {
          this.addressPOI = this.form.address.slice(
            this.form.address_ditu.length
          );
        }
      });
    } else {
      // 0为查看详情，1为修改，2为添加
      this.state = this.$store.state.active.active_page_data.state;
      switch (this.state) {
        case 0:
          this.isEdit = true;
          this.UseMap = false;
          this.title = "活动详情";
          this.form = JSON.parse(
            decodeURIComponent(this.$store.state.active.active_page_data.data)
          );
          console.warn(this.form, "传回来的表单");
          if (this.form.address_ditu) {
            this.addressPOI = this.form.address.slice(
              this.form.address_ditu.length
            );
          }
          break;
        case 1:
          this.isEdit = false;
          this.title = "修改活动";
          this.form = JSON.parse(
            decodeURIComponent(this.$store.state.active.active_page_data.data)
          );
          if (this.form.address_ditu) {
            this.addressPOI = this.form.address.slice(
              this.form.address_ditu.length
            );
          }
          break;
        case 2:
          this.isEdit = false;
          this.title = "新增活动";
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    let _loadApiPromise = lazyAMapApiLoaderInstance.load();
    _loadApiPromise.then(() => {
      this.loaded = true;
      this.mapinit();
    });
    console.log("this.form---", this.form);
  },
  computed: {
    _autoComplete() {
      if (!this.loaded) return;
      return new AMap.Autocomplete({});
    },
    _placeSearch() {
      if (!this.loaded) return;
      return new AMap.PlaceSearch({});
    }
  },
  methods: {
    // 用图片裁剪后上传七牛成功
    uploadSuccess(data) {
      console.warn(data, "上传的活动");
      this.form.pic = data;
      // this.studioForm.upload_array.push({key:data});
      // this.pic_update.uploadArray = [...this.studioForm.upload_array];
      // console.warn(this.studioForm.upload_array,'上传的图片数组')
    },
    // 用图片裁剪组件删除图片
    delSuccess(data) {
      console.warn(data, "oooo");
      this.form.pic = "";
      // this.pic_update.uploadArray=[...data.uploadArray]
      // this.pic_update.removeArray=[...data.removeArray]
      // console.warn(this.pic_update,'update')
    },
    handleSuccess(e) {
      this.form.pic = e;
      console.log("e--", e);
    },
    cancel() {
      switch (this.state) {
        case 0:
          this.isEdit = !this.isEdit;
          this.UseMap = !this.UseMap;
          this.mapinit();
          break;
        case 1:
          this.isEdit = !this.isEdit;
          this.UseMap = !this.UseMap;
          this.mapinit();
          break;
        case 2:
          this.$router.go(-1);
          break;
        default:
          break;
      }
    },
    addressForm() {
      this.$refs["address"].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cityChange(e) {
      console.log("cityChange--", e);
    },
    confirm() {
      // console.log(this.isEdit);
      let form = {
        id: this.form.id,
        name: this.form.name,
        address: this.form.address,
        address_ditu: this.form.address_ditu,
        city_code: this.form.city_code,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        max_person: this.form.max_person,
        fee: this.form.fee,
        info: this.form.info,
        type: this.form.type,
        lat: this.form.lat,
        lng: this.form.lng,
        brief: this.form.brief,
        pic: this.form.pic
      };
      this.form = Object.assign({}, form);
      this.$refs.form.validate(valid => {
        if (valid) {
          console.warn(this.form.city_code, "城市编码");
          if (this.form.city_code.length > 0) {
            switch (this.state) {
              case 0:
                this.edit_activity();
                break;
              case 1:
                this.edit_activity();
                break;
              case 2:
                this.add_activity();
                break;
              default:
                console.log(this.state);
                break;
            }
          } else {
            this.$notify.error({
              title: "发生错误",
              message: "城市编码为空"
            });
          }
        }
      });
    },
    edit_activity() {
      this.postRequest(activity.serve_edit_activity, this.form).then(res => {
        if (res) {
          this.$alert("活动修改成功！", "提示", {
            type: "success",
            callback: action => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$notify.error({
            title: "发生错误",
            message: "请您检查是否有数据没有填充，若确认无误请联系管理员！"
          });
        }
      });
    },
    add_activity() {
      this.postRequest(activity.serve_add_activity, this.form).then(res => {
        if (res) {
          this.$alert("活动添加成功！", "提示", {
            type: "success",
            callback: action => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$notify.error({
            title: "发生错误",
            message: "请您检查是否有数据没有填充，若确认无误请联系管理员！"
          });
        }
      });
    },
    mapinit() {
      //定位到指定经纬度位置,初始化地图
      let lat, lng;
      let params = {
        resizeEnable: true,
        zoom: 15 //初始地图级别
      };
      if (this.form.lat && this.form.lng) {
        lat = this.form.lat;
        lng = this.form.lng;
        params.center = [lng, lat];
      }
      this.map = new AMap.Map("container", params);
      this.showMarker();
      this.placeSearch = new AMap.PlaceSearch({
        map: this.map
      });
      //异步同时加载多个插件
      AMap.plugin(["AMap.ToolBar", "AMap.MapType"], () => {
        let toolbar = new AMap.ToolBar();
        let maptype = new AMap.MapType();
        this.map.addControl(toolbar);
        this.map.addControl(maptype);
      });
      // if (this.UseMap) {
      //   // 拖拽地图进行地址选择
      //   AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
      //     let positionPicker = new PositionPicker({
      //       mode: "dragMap",
      //       map: this.map
      //     });
      //     positionPicker.on("success", positionResult => {
      //       console.log(positionResult);
      //       this.form.lat = positionResult.position.lat;
      //       this.form.lng = positionResult.position.lng;
      //       this.form.address = positionResult.address;
      //       this.form.city_code =
      //         positionResult.regeocode.addressComponent.citycode;
      //     });
      //     positionPicker.start();
      //   });
      // }
      this.changeMap();
    },
    changeMap() {
      // 输入地址自动定位
      var autoOptions = {
        // city:city,//在规定城市搜索、默认全国
        input: "tipinput"
      };
      var auto = new AMap.Autocomplete(autoOptions);
      this.placeSearch2 = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        children: 0, //不展示子节点数据
        // city: city, // 兴趣点城市
        citylimit: true, //是否强制限制在设置的城市内搜索
        panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        extensions: "base", //返回基本地址信息  */
        map: this.map // 展现结果的地图实例
      }); //构造地点查询类
      AMap.event.addListener(auto, "select", this.selectSearch); //注册监听，当选中某条记录时会触发
    },
    //生成标记
    showMarker() {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(this.form.lng, this.form.lat),
        icon: new AMap.Icon({
          image:
            "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          size: new AMap.Size(52, 52), //文字大小
          imageSize: new AMap.Size(20, 26) //图标大小
        }),
        label: {
          offset: new AMap.Pixel(-50, -40), //修改label相对于maker的位置
          content: `<div class='markerTip'>${this.form.address}</div>` //显示标记内容
        }
      });
      this.markerList.push(marker);
      if (this.markerList.length > 1) {
        //删除上一个点标记
        this.map.remove(this.markerList[0]);
        //删除第一个元素
        this.markerList.shift();
      }
      this.map.add(this.markerList);
    },
    // 如果发生更改了就执行定位信息
    changeTip(tip) {
      this.form.address = tip.address;
      console.log(tip);
      // 当有重复地点时，adcode用于标识唯一地点
      this.placeSearch.setCity(tip.code);
      //关键字查询查询
      this.placeSearch.search(tip.address);
    },
    // 监听搜索选中某一匹配项
    selectSearch(e) {
      console.warn(e, "选中的匹配项");
      this.placeSearch2.setCity(e.poi.adcode);
      this.placeSearch2.search(e.poi.name);
      this.form.lng = e.poi.location.lng + "";
      this.form.lat = e.poi.location.lat + "";
      this.form.address_ditu = e.poi.name;
      //设置搜索位置定点标注
      if (e.poi && e.poi.location) {
        this.map.setZoom(15);
        this.map.setCenter(e.poi.location);
        var id = e.poi.id;
        //详情查询
        this.placeSearch2.getDetails(id, (status, result) => {
          if (status === "complete" && result.info === "OK") {
            console.warn(result, "所有城市信息");
            this.form.city_code = result.poiList.pois[0].citycode;
            this.placeSearch_CallBack(result);
          }
        });
      }
    },
    //回调函数
    placeSearch_CallBack(data) {
      var infoWindow = new AMap.InfoWindow({
        autoMove: true,
        offset: { x: 0, y: -30 }
      });

      var poiArr = data.poiList.pois;
      //添加marker
      var marker = new AMap.Marker({
        map: this.map,
        position: poiArr[0].location
      });
      this.map.setCenter(marker.getPosition());
      infoWindow.setContent(this.createContent(poiArr[0]));
      infoWindow.open(this.map, marker.getPosition());
    },
    createContent(poi) {
      //信息窗体内容
      var s = [];
      s.push("<b>名称：" + poi.name + "</b>");
      s.push("地址：" + poi.address);
      s.push("电话：" + poi.tel);
      s.push("类型：" + poi.type);
      return s.join("<br>");
    },
    // 执行搜索并将结果返回给下拉栏
    autoComplete(queryString, cb) {
      console.warn(queryString, "执行搜索并将结果返回给下拉栏");
      if (!queryString || !this._autoComplete) return;
      this._autoComplete.search(queryString, (status, result) => {
        if (status === "complete") {
          let results = queryString
            ? result.tips.filter(this.createFilter(queryString))
            : restaurants;
          console.log(results);
          let endresults = [];
          results.forEach(item => {
            endresults.push({
              value: item.district + "  " + item.name,
              address: item.name,
              code: item.adcode
            });
          });
          cb(endresults);
        }
      });
    },
    // 筛选出选择的
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    goBack() {
      this.$store.dispatch("ActiveOutPage").then(() => {
        this.$router.go(-1);
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.actde-container {
  background-color: #ffffff;
  padding: 30px;
}
.info-html {
  margin: 30px 0;

  .info-title {
    margin-bottom: 20px;
  }
}
.card-set {
  margin-bottom: 14px;
}
.top-nav {
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  .top-title {
    padding-bottom: 20px;
    padding-top: 35px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .back {
    cursor: pointer;
    .back-one {
      margin-right: -26px;
    }
    .back-two {
      margin-right: 2px;
    }
  }
}
.line {
  margin-bottom: 15px;
  margin-top: 10px;
}
.textare {
}
.textare /deep/ .el-form-item__content {
  margin-left: 0px !important;
}
.activityAddress /deep/ {
  .el-input {
    width: 100% !important;
  }
}
.form-box {
  margin-top: 30px;

  .short-input /deep/ .el-input {
    width: 220px;
  }
  .twoCol {
    display: flex;
    .col {
      margin-right: 20px;
    }
  }
  .people /deep/ .el-input {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
}
</style>