<template>
	<div>
		<div v-if="user_data.role&'2'||user_data.role&'4'">
			<!-- <div v-if="false"> -->

			<!--<div class="top-nav">
			<div class="top-title">基本设置</div>
		   </div>
      <div class="line"></div>-->

			<!--form表单开始-->
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<!--店铺信息-->
				<div class="card">
					<p class="headTitle">店铺信息</p>
					<!--<el-form-item label="店铺名称：" prop="address">
					<el-input v-model="form.addressPOI" placeholder="请输入店铺的名称"></el-input>
          </el-form-item>-->
					<!-- 客户照片上传模块 -->
					<el-form-item label="店铺Logo：" class="logoImg">
						<upload-img @handleSuccess="handleSuccess" type="store" :imageUrl="util.qiniuAddress+form.logo" v-if="loadImage"></upload-img>
						<span class="tips">(建议上传800*800px尺寸图(或正方形)的图片)</span>
					</el-form-item>
					<!--<el-form-item label="店铺二级域名："  prop="address">
					<el-input v-model="form.test" placeholder="请输入二级域名">
						<template slot="prepend">http://</template>
						<template slot="append">/paitume.com</template>
					</el-input>
          </el-form-item>-->
					<div class="line"></div>
					<el-form-item class="order-taking" label="接单设置：">
						<el-checkbox-group v-model="orderSetting">
							<el-checkbox label="0" key="0">周末可接单 （自然日周六和周日）</el-checkbox>
							<el-checkbox label="1" key="1">节假日接单（每年法定节假日）</el-checkbox>
						</el-checkbox-group>
					</el-form-item>

					<el-form-item label="店铺客服号码：" prop="address" v-if="false">
						<el-input v-model="form.addressPOI" placeholder="请输入电话号码"></el-input>
					</el-form-item>
				</div>

				<!--数据同步信息-->
				<div class="card">
					<div class="dataContent">
						<p class="headTitle">数据同步(保密)</p>
						<el-popover placement="bottom" title="数据同步" width="200" trigger="hover" content="数据同步就是同步服务器上的数据。">
							<ali-svg-icon icon-class="wenti" class="cursor" slot="reference"></ali-svg-icon>
						</el-popover>
						<span>什么是数据同步</span>
						<el-popover placement="bottom" title="数据保密" width="200" trigger="hover" content="数据保密就是数据不在平台上显示。">
							<ali-svg-icon icon-class="wenti" class="cursor" slot="reference"></ali-svg-icon>
						</el-popover>
						<span>什么是数据保密</span>
					</div>

					<div class="dataStatus">
						<div class="status">
							<div class="curStatus">
								<span>当前状态：</span>
								<span v-if="form.role==0" class="status0">您还不是商家，暂无此功能</span>
								<span v-if="form.data_lock!=2" class="status1">数据同步</span>
								<span v-if="form.data_lock==2" class="status2">数据保密</span>
							</div>
							<div class="tips" v-if="form.role==0">
								温馨提示：请去
								<span class="cursor" @click="toLogin">paitume.com</span> 官网，成为租赁商
							</div>
							<div class="switch-box" v-if="form.role==2">
								<el-switch :disabled="!editDataSync" v-model="dataValue" :width="45" active-color="#13ce66" inactive-color="#7C6AFF" :active-text="dataValue?`数据已保密`:`数据保密`" :inactive-text="dataValue?`数据同步`:`数据已同步`"></el-switch>
								<ali-svg-icon icon-class="Vupload" :class-name="dataValue?`miss-svg`:`upload-postion`"></ali-svg-icon>
								<ali-svg-icon icon-class="Glock" :class-name="dataValue?`lock-postion`:`miss-svg`"></ali-svg-icon>
							</div>
						</div>
						
					</div>
				</div>

				<!--添加轮播banner模块-->
				<div class="addBanner">
					<!-- <div>
					添加轮播banner图
					<span>（最多6张，建议上传1920*610px的尺寸）</span>
          </div>-->
					<div class="addbanner-head">
						<span>轮播图设置</span>
						<span>（最多6张，建议上传1920*610px的尺寸）</span>
						<div class="uploadImg">
							<upload-img :noShowImg="noShowImg" :showPlus="noShowImg" :showText="true" btnText="+ 添加轮播图" @handleSuccess="handleSuccess2" v-if="showUpload"></upload-img>
							<!-- <div class="mask cursor pictures" v-if='!showUpload' @click="overImgNum">
							<i class="el-icon-plus avatar-uploader-icon"></i>
              </div>-->
						</div>
					</div>
					<div class="banner-wrap">
						<span v-if="form.banner_array.length>0">店铺banner：</span>
						<ul class="bannerList">
							<span v-if="form.banner_array.length==0">您还没有添加轮播图</span>
							<li v-for="(item,index) in form.banner_array" :key="index">
								<div class="top">
									<el-input v-model="item.url" placeholder="请输入链接" clearable></el-input>
								</div>
								<div class="body" @click="changeImage(item,index)">
									<!--<img :src="config.qiniuHost+item.avatar" width="368" height="100%">-->
									<upload-img @handleSuccess="handleSuccess3" :imageUrl="config.qiniuHost+item.key" v-if="showImageList"></upload-img>
								</div>
								<div class="foot">
									<el-button type="text" @click="previewImage(index)">预览</el-button>
									<el-button type="text" @click="delBanner(index)">删除</el-button>
									<el-button type="text" @click="moveBanner(index,'prev')" :disabled="index==0">前移</el-button>
									<el-button type="text" @click="moveBanner(index,'next')" :disabled="index==(form.banner_array.length-1)">后移</el-button>
								</div>
							</li>
						</ul>
					</div>
				</div>

				<!--banner图片预览模块-->
				<!-- <el-dialog :visible.sync="showImagePreview" v-if="showImagePreview"> -->
				<el-dialog :visible.sync="showImagePreview">
					<el-carousel indicator-position="outside" :initial-index="imageIndex" height="600px" :autoplay="false">
						<el-carousel-item v-for="(item,index) in form.banner_array" :key="index">
							<img :src="config.qiniuHost+item.key" :onerror="util.errorPic" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;" />
						</el-carousel-item>
					</el-carousel>
				</el-dialog>

				<!--工作时间模块-->
				<div class="time-wrap">
					<div class="time-wrap-title">时间定义</div>
					<el-form-item label="工作时间" class="bold_title"></el-form-item>

					<el-form-item class="no_right">
						<div class="tableList">
							<div class="table">
								<div class="top">
									<div>工作日</div>
									<div>开始工作时间</div>
									<div>结束工作时间</div>
								</div>

								<div class="body">
									<div>工作日</div>
									<div>
										<el-select v-model="form.normalWorkStartTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
									<div>
										<el-select v-model="form.normalWorkEndTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
								</div>
							</div>

							<div class="table">
								<div class="top">
									<div>节假日</div>
									<div>开始工作时间</div>
									<div>结束工作时间</div>
								</div>

								<div class="body">
									<div>节假日</div>
									<div>
										<el-select v-model="form.holidayWorkStartTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
									<div>
										<el-select v-model="form.holidayWorkEndTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
								</div>
							</div>
						</div>
					</el-form-item>

					<p class="oterTime">
						可接单时间
						<span>(除去工作时间就是加班时间)</span>
					</p>

					<el-form-item class="no_right">
						<div class="tableList">
							<div class="table">
								<div class="top">
									<div>工作日</div>
									<div>开始工作时间</div>
									<div>结束工作时间</div>
								</div>

								<div class="body">
									<div>工作日</div>
									<div>
										<el-select v-model="form.normalOpenStartTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
									<div>
										<el-select v-model="form.normalOpenEndTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
								</div>
							</div>

							<div class="table">
								<div class="top">
									<div>节假日</div>
									<div>开始工作时间</div>
									<div>结束工作时间</div>
								</div>

								<div class="body">
									<div>节假日</div>
									<div>
										<el-select v-model="form.holidayOpenStartTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
									<div>
										<el-select v-model="form.holidayOpenEndTime" placeholder="请选择" size="mini">
											<el-option v-for="(item,index) in timeOption" :key="index" :label="item" :value="item"></el-option>
										</el-select>
									</div>
								</div>
							</div>
						</div>
					</el-form-item>
				</div>

				<!--外借区域模块-->
				<div class="borrow-area">
					<div class="borrow-area-title">外借区域</div>
					<!-- <el-form-item label="外借区域" class='bold_title'>
          </el-form-item>-->

					<el-form-item class="no_right">
						<div>
							<el-transfer filterable filter-placeholder="请输入城市搜索" v-model="form.borrow_city" :titles="['城市列表', '已选城市']" :data="data"></el-transfer>
						</div>
					</el-form-item>
				</div>

				<!--短链接设置-->
				<div class="short-link">
					<div class="info-set">
						<div class="info-title">短链接设置</div>
					</div>
					<el-row>
						<el-form-item label="链接地址" style="width:75%">
							<el-input v-model="form.short_url" placeholder="请输入店铺短链接"></el-input>
						</el-form-item>
					</el-row>
				</div>

				<!--地址设置模块-->
				<div class="address-set">
					<div class="info-set">
						<div class="info-title">地址设置</div>
					</div>
					<el-row :gutter="0" style="padding-top:20px;">
						<el-col :span="10" class="short-input">
							<el-form-item label="所在省份" prop="province">
								<el-select v-model="form.province" @change="changeProvince" placeholder="请选择">
									<el-option v-for="(item,index) in provinceList" :key="item.code" :label="item.label" :value="index"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="10" class="short-input" prop="city">
							<el-form-item label="所在城市">
								<!--<el-select v-model="form.city" :disabled="form.province===''" placeholder="请选择">-->
								<el-select v-model="form.city" placeholder="请选择" @change="changeCity">
									<el-option v-for="item in cityList" :key="item.code" :label="item.label" :value="item.label"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-form-item label="具体地址" style="width:75%" prop="address_ditu">
							<el-input id="searchInput" v-model="form.address_ditu" placeholder="可直接点击地图选择或手动填写"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="楼层门牌" style="width:75%" prop="addressPOI">
							<el-input v-model="form.addressPOI"></el-input>
						</el-form-item>
					</el-row>
				</div>

				<!--<el-row>
				<el-form-item label="全部地址" style="width:75%">
					<el-autocomplete v-model="form.address"  placeholder="可直接点击地图选择"  style="width:100%"></el-autocomplete>
				</el-form-item>
        </el-row>-->
			</el-form>
			<!--form表单结束-->

			<!--地图显示位置-->
			<!--<div id="container" style="width:100%;height:500px;padding-left: 10px;"></div>-->
			<!-- <p class="mapTips">(提示：所在省份和城市必须要在地图上选择！)</p> -->
			<div class="map">
				<my-map :lat="form.lat" :setCode="form.city" :lng="form.lng" :searchAdd="form.address_ditu" :address="form.address" v-if="loadImage" :editable="true" @select="selectArea" @selectSearch="selectSearch"></my-map>
			</div>

			<div class="bottom-button">
				<el-button class="color-area" type="default">取消</el-button>
				<el-button class="color-area" type="primary" @click="saveSetting">保存</el-button>
			</div>
		</div>
		<!-- <tab-model v-else-if="user_data.role&128"></tab-model>
    <tab-company v-else-if="user_data.role&8||user_data.role&16||user_data.role&32"></tab-company>
    <tab-photographer v-else-if="user_data.role&64"></tab-photographer>-->
	</div>
</template>

<script>
	import { lazyAMapApiLoaderInstance } from "vue-amap";
	import { setting, other } from "@config/api.js";
	import { checkPic } from "@util/picUtil.js";
	import uploadImg from "ServeComponents/UploadImg";
	import mySwitch from "ServeComponents/switch";
	import myMap from "ServeComponents/Amap";
	import { mapGetters } from "vuex";
	// import tabModel from "./components/tab-model";
	// import tabCompany from "./components/tab-company";
	// import tabPhotographer from "./components/tab-photographer";
	export default {
		data: () => ({
			floor: "",
			noShowImg: true,
			lat: "",
			lng: "",
			address: "",
			imageUrl: "",
			loadImage: false,
			map: null,
			placeSearch: null,
			provinceList: [],
			cityList: [],
			data: [],
			provinceId: "",
			orderSetting: [],
			timeOption: [
				"00:00",
				"01:00",
				"02:00",
				"03:00",
				"04:00",
				"05:00",
				"06:00",
				"07:00",
				"08:00",
				"09:00",
				"10:00",
				"11:00",
				"12:00",
				"14:00",
				"15:00",
				"16:00",
				"17:00",
				"18:00",
				"19:00",
				"20:00",
				"21:00",
				"22:00",
				"23:00",
				"23:59"
			],
			form: {
				lat: "",
				lng: "",
				borrow_city: [],
				city: "",
				city_code: "",
				province: "",
				province_code: "",
				role: "",
				total: "",
				address: "",
				houseNumber: "",
				weekendAcceptType: "",
				holidayAcceptType: "",
				normalOpenStartTime: "",
				normalOpenEndTime: "",
				holidayOpenStartTime: "",
				holidayOpenEndTime: "",
				normalWorkStartTime: "",
				normalWorkEndTime: "",
				holidayWorkStartTime: "",
				holidayWorkEndTime: "",
				banner_array: [],
				short_url: "",
				logo: "",
				address: "",
				addressPOI: "",
				address_ditu: "",
				avatar: "",
				brief: "",
				data_lock: ""
			},
			ModelForm: {},
			rules: {
				province: [{
					required: true,
					message: "请选择省份",
					trigger: "blur"
				}],
				city: [{
					required: true,
					message: "请选择城市",
					trigger: "blur"
				}],
				address_ditu: [{
					required: true,
					message: "请选择具体地址",
					trigger: "blur"
				}],
				addressPOI: [{
					required: true,
					message: "请填写具体楼层门牌号",
					trigger: "blur"
				}]
			},
			showUpload: true,
			showImageList: true,
			showImagePreview: false, //是否显示图片预览框
			imageIndex: 0,
			editImage: {},
			dataValue: false, //数据同步数据
			editDataSync:false, //是否有权限设置数据同步
		}),
		watch: {
			"form.addressPOI" (val) {}
			// "form.addressPOI":function(to,from){
			// 	let address;
			// 	if(this.form.city==this.form.province){
			// 		address=this.form.city+this.form.addressPOI;
			// 	}else{
			// 		address=this.form.province+this.form.city+this.form.addressPOI;
			// 	}
			// 	console.log('address----',address,this.form);
			// 	this.form.address=address;
			// 	console.log('this.form----',this.form);
			// }
		},
		components: {
			uploadImg,
			myMap,
			mySwitch
			// tabModel,
			// tabCompany,
			// tabPhotographer
		},

		computed: {
			...mapGetters(["user_data", "city_code"])
		},

		mounted() {
			this.saveSetting = this.util.throttle(this.saveSetting, 1000);
			let _loadApiPromise = lazyAMapApiLoaderInstance.load();
			_loadApiPromise.then(() => {
				this.loaded = true;
			});
			this.loadData();
			this.data = this.getAllCity();

			this.getFuns().then(res=>{
				if(res){
					this.editDataSync=true;
				}
			})
		},

		methods: {
			//获取该账号是否有权限设置数据同步功能
			getFuns(){
				return new Promise((resolve,reject)=>{
					if(this.user_data.role!=2){
						resolve(false);
					};
					this.util.checkFuns().then(res=>{
						if(res){
							resolve(true);
						}else{
							resolve(false);
						}
					})
				})
			},
			// 输入查找地址选择匹配项
			selectSearch(obj) {
				console.warn(obj, "匹配项");
				this.form.address_ditu = obj.poi.name;
				this.form.lng = obj.poi.location.lng + "";
				this.form.lat = obj.poi.location.lat + "";
			},
			//跳到官网登录
			toLogin() {
				this.util.openNewPage("/login");
			},
			overImgNum() {
				this.$message.warning("已经添加了6张图片，不能再添加！");
			},
			loadData() {
				this.getRequest(setting.oldGet)
					.then(res => {
						console.log("setting=================", res);
						if(res) {
							console.warn(res, "res");
							//如果外借城市为空，默认添加上定位到的地址code
							if(res.borrow_city.length == 0) {
								res.borrow_city.push(this.city_code);
							}
							for(let i in this.form) {
								for(let j in res) {
									if(i == j) {
										this.form[i] = res[j];
									}
								}
							}
							//						this.form = res;
							console.warn("this.form----", this.form);
							if(res.role == "2" && res.data_lock == 2) {
								this.dataValue = true;
							}
							if(res.weekendAcceptType == "1") {
								this.orderSetting.push("0");
							}
							if(res.holidayAcceptType == "1") {
								this.orderSetting.push("1");
							}
							setTimeout(() => {
								this.loadImage = true;
							}, 500);
						}

						console.log("this.provinceList----", this.provinceList);
						this.changeProvince(this.getIdByProvince(this.form.province), true);
					})
					.catch(err => {});
				this.provinceList = this.config.cityArray2Tree(this.config.allCityCode);
			},
			//保存设置方法
			saveSetting(data) {
				console.log(data);
				switch(data.type) {
					default:
						//判断是否填写了工作时间和可接单时间
						if(!this.form.normalOpenEndTime ||
							!this.form.normalOpenStartTime ||
							!this.form.normalWorkEndTime ||
							!this.form.normalWorkStartTime ||
							!this.form.holidayOpenEndTime ||
							!this.form.holidayOpenStartTime ||
							!this.form.holidayWorkEndTime ||
							!this.form.holidayWorkStartTime
						) {
							this.$message.warning("请选择工作时间和可接单时间");
							return;
						}

						if(this.form.role == 2) {
							if(this.dataValue) {
								this.form.data_lock = "2";
							} else {
								this.form.data_lock = "1";
							}
						}

						if(!this.form.lat || !this.form.lng) {
							this.$message.warning("请选择所在省份和城市!");
							return;
						}

						if(!this.form.address_ditu) {
							this.$message.warning("请填写具体地址!");
							return;
						}

						if(this.orderSetting.indexOf("0") >= 0) {
							this.form.weekendAcceptType = "1";
						} else {
							this.form.weekendAcceptType = "0";
						}
						if(this.orderSetting.indexOf("1") >= 0) {
							this.form.holidayAcceptType = "1";
						} else {
							this.form.holidayAcceptType = "0";
						}
						this.getProvinceAndCity();
						let form = this.util.deepcopy(this.form);
						form.banner_array = this.form.banner_array;
						form.borrow_city = this.form.borrow_city;

						let address;
						if(form.city == form.province) {
							address = form.city + form.address_ditu + form.addressPOI;
						} else {
							address =
								form.province + form.city + form.address_ditu + form.addressPOI;
						}
						console.log(form.addressPOI, "--------------------hshhshdhs-----");
						form.address = address;

						this.postRequest(setting.oldUpdate, form)
							.then(res => {
								this.$message.success("修改设置成功！");
								console.log("this.user_data,res--------", this.user_data, res);
								let data = res;
								if(data.avatar != this.form.avatar) {
									data.avatar = this.form.avatar;
								}
								console.log("after---data-----------", data);
								// this.$store.commit("update_user_data", data);
								this.$store.dispatch("VaildToken").then(res => {
									//重新加载地图
									this.reloadImg("loadImage");
								});
							})
							.catch(err => {});
						break;
				}
			},
			//获取所有城市方法，包括直辖市
			getAllCity() {
				let list = [];
				this.config.allCityCode.forEach((item, index) => {
					let obj = {
						key: item.code,
						label: item.city
					};
					list.push(obj);
				});
				return list;
			},
			//根据省份获取省份id
			getIdByProvince(province) {
				let id = "";
				this.provinceList.forEach((item, index) => {
					if(province == item.label) {
						id = index;
					}
				});
				return id;
			},

			//获取相关转换后的省份，和城市编号
			getProvinceAndCity() {
				console.log(
					"getProvinceAndCity-----this.form-----",
					this.form,
					this.provinceIndex
				);
				//				let id = this.getIdByProvince(this.form.province);
				if(this.provinceIndex != "") {
					let id = this.provinceIndex;
					console.log("provinceIndex------", this.provinceIndex, this.form.city);
					console.log("this.provinceList[id].children", this.provinceList);
					this.provinceList[id].children.forEach((item, index) => {
						if(item.label == this.form.city) {
							this.form.city_code = item.code;
						}
					});
					this.form.province = this.provinceList[id].label;
				}
			},

			//图片上传成功后回调方法
			handleSuccess(key) {
				this.form.logo = key;
			},

			handleSuccess2(key) {
				console.log("handleSuccess2", key);
				this.addBanner(key);
				this.reloadImg("showUpload");
			},

			handleSuccess3(key) {
				console.log("handleSuccess3", key);
				//删除之前的图片
				this.delImage(this.form.banner_array[this.editImage.index].key);
				//替换图片
				this.form.banner_array[this.editImage.index].key = key;
			},

			//获取选中地图地址回调方法
			selectArea(data, address_ditu, lat, lng) {
				console.log("selectArea-----------", data, lat, lng);
				this.form.lat = lat;
				this.form.lng = lng;
				this.form.address_ditu = address_ditu;
				this.form.address = data.formattedAddress;
				let city = data.addressComponent.city;
				let province = data.addressComponent.province;
				if(city) {
					this.form.city = city;
				} else {
					this.form.city = province;
				}

				this.form.province = province;
				console.log("province.-------", province, this.form);
				this.provinceList.forEach((item, index) => {
					if(province == item.label) {
						this.provinceIndex = index;
					}
				});
			},

			//需要从七牛删除图片方法
			delImage(key) {
				let params = {
					key: key,
					type: "banner"
				};
				console.log("key----", key, params);
				this.postRequest(other.delPic, params)
					.then(res => {
						console.log("从七牛删除图片成功---", res);
					})
					.catch(err => {});
			},

			//选择省份方法
			changeProvince(index, first = false) {
				console.warn("index----", index, this.form);
				this.provinceIndex = index;
				if(!first) {
					// 这里是手动选择省份的时候，默认选中第一个城市
					this.$set(
						this.form,
						"city",
						this.provinceList[index].children[0].label
					);
				} else {
					// 这里是获取到后台已经有的city
					this.changeCity(this.form.city);
				}
				this.cityList = this.provinceList[index].children; // //选择第一个城市
				// this.changeCity(this.cityList[0].label);
			},

			//选择城市方法
			changeCity(val) {},

			//返回方法
			back() {
				this.$router.go(-1);
			},
			//替换图片之前保留信息,保留index下标
			changeImage(item, index) {
				this.editImage = item;
				this.editImage.index = index;
			},
			//预览图片方法
			previewImage(index) {
				this.imageIndex = index;
				this.showImagePreview = true;
				this.reloadImg("showImagePreview");
			},
			//bannerList图片添加方法
			addBanner(avatar) {
				let params = {
					key: avatar,
					url: ""
				};
				this.form.banner_array.push(params);
			},
			//bannerList 删除图片方法
			delBanner(index) {
				//从七牛删除图片
				this.delImage(this.form.banner_array[index].key);
				this.form.banner_array.splice(index, 1);
				this.reloadImg("showUpload");
			},
			//banner  前移/后移方法
			moveBanner(index, type) {
				let tempItem = this.form.banner_array[index];
				this.form.banner_array.splice(index, 1);
				let location = 0;
				if(type == "prev") {
					location = index - 1;
				} else if(type == "next") {
					location = index + 1;
				}
				this.form.banner_array.splice(location, 0, tempItem);
				this.reloadImg("showImageList");
			},
			//重新渲染图片方法
			reloadImg(val) {
				this[val] = false;
				this.$nextTick(() => {
					this[val] = true;
					if(val == "showUpload") {
						if(this.form.banner_array.length == 6) {
							this[val] = false;
						} else {
							this[val] = true;
						}
					}
				});
			}
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	@import "@/styles/color.scss";
	.short-input /deep/ .el-input {
		width: 220px;
	}
	
	.long-input /deep/ .el-input {
		width: 100%;
	}
	
	.card {
		padding: 20px 30px;
		background: #fff;
		margin-bottom: 20px;
		.headTitle {
			font-size: 20px;
			color: #333;
			padding-bottom: 20px;
			border-bottom: 1px solid #f0f0f0;
		}
		.dataSync {
			margin: 25px;
		}
		.dataContent {
			display: flex;
			align-items: baseline;
			padding-bottom: 20px;
			border-bottom: 1px solid #f0f0f0;
			.headTitle {
				padding: 0px;
				border: none;
			}
			svg {
				color: #7c6aff;
				margin: 0px 5px;
			}
			span {
				color: #7c6aff;
			}
		}
		.line {
			background: tomato;
			border-top: 1px solid #f0f0f0;
			margin-top: 30px;
		}
		.order-taking {
			display: inline-block;
			position: relative;
		}
		.el-form-item {
			margin: 20px 0px;
			/deep/ {
				.el-form-item__label {
					width: 120px !important;
					text-align: left;
				}
				.el-form-item__content {
					margin-left: 120px !important;
				}
				.el-checkbox-group {
					display: flex;
					flex-direction: column;
					.el-checkbox {
						margin-right: 0;
					}
				}
			}
			&.logoImg {
				/deep/ {
					.el-form-item__content {
						display: flex;
						.tips {
							color: #999;
							font-size: 12px;
							margin-left: 30px;
						}
					}
				}
			}
		}
	}
	
	.top-nav {
		justify-content: space-between;
		.top-title {
			padding-bottom: 20px;
			padding-top: 35px;
			font-size: 20px;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			border-bottom: 4px solid $Theme-color;
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
	
	.bottom-button {
		margin-top: 30px;
		margin-bottom: 80px;
		flex-direction: row-reverse;
		.el-button {
			width: 114px;
			height: 40px;
			font-size: 14px;
			border-radius: 0;
		}
		.el-button--primary {
			background: rgb(101, 31, 255);
			color: #fff;
			margin: 0 20px 0 0;
		}
		.el-button--default {
			background: rgb(255, 255, 255);
			border: 1px solid rgb(217, 217, 217);
			color: #999;
		}
	}
	
	.no_right /deep/ .el-form-item__content {
		margin-left: 13px !important;
		margin-top: -13px !important;
	}
	
	/deep/ .w_100 .el-form-item__label {
		width: 100px !important;
	}
	
	/deep/ .w_300 .el-form-item__label {
		width: 300px !important;
	}
	
	.addBanner {
		background: #fff;
		font-size: 16px;
		font-weight: bold;
		color: #333333;
		padding: 0 30px;
		box-sizing: border-box;
		margin-bottom: 20px;
		.addbanner-head {
			height: 68px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&>span {
				color: #333;
				font-size: 20px;
				font-weight: normal;
			}
			span+span {
				font-size: 16px;
			}
			.uploadImg {
				display: flex;
				/*justify-content:center;*/
				align-items: center;
				color: #fff;
				/deep/ {
					.el-upload--picture-card {
						// width: 100px;
						height: 40px;
						background: rgba(101, 31, 255, 1);
						border: 1px solid rgba(101, 31, 255, 1);
						.avatar-uploader-icon {
							display: none;
						}
					}
				}
			}
		}
		.pictures {
			margin: 20px 0px;
		}
		/deep/ {
			.el-upload--picture-card {
				width: 118px;
				height: 105px;
				border: 1px solid #ccc;
				border-radius: 2px;
				background: #eee;
			}
			i.close {
				display: none;
			}
		}
		.banner-wrap {
			border-top: 1px solid #f0f0f0;
			display: flex;
			padding: 20px 0;
			box-sizing: border-box;
			&>span {
				width: 122px;
				font-size: 14px;
			}
			.bannerList {
				flex: 1;
				text-align: center;
				overflow: hidden;
				li {
					// width: 370px;
					width: calc((100% - 66px) / 3);
					float: left;
					// margin-right: 2.5vw;
					margin-right: 33px;
					margin-bottom: 3vh;
					border: 1px solid #f9f9f9;
					&:nth-child(3n) {
						margin-right: 0;
					}
					&:nth-last-of-type(3),
					&:nth-last-of-type(3)~li {
						margin-bottom: 0;
					}
					/deep/ {
						.el-upload--picture-card {
							.avatar {
								width: 100%;
							}
						}
					}
				}
				.top {
					height: 30px;
					// background: #3A7F9F;
					background: #7c6aff;
					border-radius: 3px 3px 0px 0px;
					/deep/ .el-input__inner {
						border: none;
						background: none;
					}
				}
				.body {
					height: 120px;
				}
				.foot {
					background: #eee;
				}
			}
		}
	}
	
	.time-wrap {
		background: #fff;
		padding: 0 30px 40px;
		box-sizing: border-box;
		margin-bottom: 20px;
		.time-wrap-title {
			height: 50px;
			line-height: 50px;
			font-size: 20px;
			color: #333;
			border-bottom: 1px solid #f0f0f0;
			margin-bottom: 30px;
		}
	}
	
	.borrow-area {
		background: #fff;
		padding: 0 30px 30px;
		box-sizing: border-box;
		margin-bottom: 20px;
		.borrow-area-title {
			height: 50px;
			line-height: 50px;
			border-bottom: 1px solid #f0f0f0;
			font-size: 20px;
			color: #333;
		}
		.no_right {
			padding-top: 60px;
			box-sizing: border-box;
			/deep/ {
				.el-form-item__content {
					margin-top: 0 !important;
				}
			}
		}
	}
	
	.short-link {
		background: #fff;
		padding: 0 30px 30px;
		box-sizing: border-box;
		margin-bottom: 20px;
		.info-set {
			height: 50px;
			line-height: 50px;
			border-bottom: 1px solid #f0f0f0;
			.info-title {
				font-size: 20px;
				color: #333;
				font-weight: normal;
			}
		}
		.el-row {
			padding-top: 20px;
			box-sizing: border-box;
		}
	}
	
	.address-set {
		background: #fff;
		padding: 0 30px 30px;
		box-sizing: border-box;
		.info-set {
			height: 50px;
			line-height: 50px;
			border-bottom: 1px solid #f0f0f0;
			.info-title {
				font-size: 20px;
				color: #333;
				font-weight: normal;
			}
		}
	}
	
	.tableList {
		display: flex;
		.table {
			width: 370px;
			border: 1px solid #ccc;
			border-radius: 2px;
			margin-right: 2vw;
			&>div {
				display: flex;
				justify-content: space-around;
				align-items: center;
				text-align: center;
				&>div {
					flex: 2;
				}
				&>div:first-child {
					flex: 1;
				}
			}
			.top {
				background: #f5f8fe;
				justify-content: flex-end;
				&>div:first-child {
					color: transparent;
				}
			}
			.body {
				&>div:first-child {
					background: #eee;
				}
				&>div {
					padding: 10px 0px;
				}
			}
			/deep/ {
				.el-input--mini .el-input__inner {
					padding-right: 0px;
					width: 85px;
				}
				.el-input__suffix {
					right: 13px;
					top: -2px;
				}
			}
		}
	}
	
	/deep/ {
		.orderSetting .el-checkbox__input.is-checked .el-checkbox__inner {
			background: #e9b53b;
			border-color: #e9b53b;
		}
		.el-checkbox__input.is-checked+.el-checkbox__label {
			color: #333;
		}
		.bold_title .el-form-item__label {
			font-size: 16px;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
	}
	
	.el-row {
		width: 75%;
	}
	
	.el-select {
		width: 75.5%;
	}
	
	/deep/ .el-transfer-panel__item {
		float: left;
		margin-right: 20px;
	}
	
	/deep/ {
		.headImg {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.el-form-item__content {
				margin-left: 5px !important;
				line-height: 0px;
			}
			.bottom {
				position: absolute;
				left: 0px;
				bottom: 0px;
				height: 28px;
				line-height: 28px;
				// background: rgba(58, 127, 159, 0.5);
				background: rgba(101, 31, 255, 0.5);
				color: #fff;
				font-size: 12px;
				width: 100%;
			}
		}
	}
	
	.bannerList {
		/deep/ {
			.el-input__inner {
				text-align: center;
				height: 31px;
				color: #fff;
				&::placeholder {
					color: #fff;
				}
				&::-webkit-input-placeholder {
					color: #fff;
				}
				&:-moz-placeholder {
					color: #fff;
				}
				&::-moz-placeholder {
					color: #fff;
				}
				&:-ms-input-placeholder {
					color: #fff;
				}
			}
			.pictures {
				margin: 0px;
			}
			.el-upload--picture-card {
				width: 100%;
				height: 120px;
				border: none;
			}
			.avatar {
				width: 368px;
				height: 100%;
			}
			.bottom {
				width: 100%;
			}
			.close {
				display: none;
			}
		}
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		text-align: center;
	}
	
	.mask {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.oterTime {
		margin-bottom: 30px;
		font-size: 18px;
		font-weight: 600;
		span {
			font-size: 14px;
			color: #666;
		}
	}
	
	.mapTips {
		color: #e55b15;
		// margin-bottom:10px;
		background: #fff;
		padding-left: 30px;
		box-sizing: border-box;
	}
	
	.map {
		padding: 10px 30px 30px;
		box-sizing: border-box;
		background: #fff;
	}
	
	.imgList {
		.head {
			width: 100%;
			display: flex;
			justify-content: space-between;
			span {
				padding: 10px 60px 10px 20px;
				border: 1px solid #d9d9d9;
			}
		}
		li {
			display: flex;
			align-items: center;
			height: 120px;
			/*border:1px solid #D9D9D9;*/
			text-align: center;
			line-height: 120px;
			.img {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			div {
				display: block;
				width: 25%;
				height: 100%;
				border: 1px solid #d9d9d9;
			}
		}
	}
	
	.dataStatus {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		/*align-items:center;*/
		margin-top: 15px;
		font-size: 20px;
		.status {
			display: flex;
			align-items: center;
			margin-bottom: 20px;
		}
		.tips {
			font-size: 13px;
			span {
				color: #7c6aff;
			}
		}
		.curStatus {
			padding: 15px 34px;
			background: #fafafa;
			margin-right: 30px;
		}
		.status0 {
			color: #999999;
		}
		.status1 {
			color: #7842ed;
		}
		.status2 {
			color: #2b9f32;
		}
	}
	
	.switch-box {
		position: relative;
		/deep/ .el-switch__label--right.is-active {
			color: #13ce66 !important;
		}
		/deep/ .el-switch__label--left.is-active {
			color: #7c6aff !important;
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