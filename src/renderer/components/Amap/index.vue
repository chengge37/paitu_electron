<!--  -->
<template>
	<div>
		<!-- <div id="container" style="width:100%;height:500px;padding-left: 10px;"> -->
		<div id="container" :style="`width:100%;height:${height};padding-left: 10px;`">
			<div id="panel"></div>
		</div>
	</div>
</template>

<script>
	import { lazyAMapApiLoaderInstance } from "vue-amap";
	export default {
		data() {
			return {
				lnglatXY: [],
				map: null,
				placeSearch: null,
				myLat: this.lat,
				myLng: this.lng,
				myAddress: this.address,
				markerList: [], //地图标记
				allAddress: '',
				cityCode:this.setCode,
				placeSearch2:null
			};
		},
		props: {
			lat: {
				type: String,
				default: '',
			},
			lng: {
				type: String,
				default: '',
			},
			address: {
				type: String,
				default: '',
			},
			//是否可以选择地址，默认为不可选择，false
			editable:{
				type:Boolean,
				default:false
			},
			height:{
				type:String,
				default:'500px'
			},
			setCode:{
				type:String,
				default:'',
			},
			// 传过来的搜索地址
			searchAdd:{
				type:String,
				default:''
			}
		},
		watch: {
			setCode(to,from){
				console.warn('setCode----------------change--------------------城市改变了');
				this.setLocation(to);
			},
			searchAdd(val){
				this.aboutSearch()
			}
		},
		mounted() {
			let _loadApiPromise = lazyAMapApiLoaderInstance.load();
			_loadApiPromise.then(() => {
				this.loaded = true;
				setTimeout(()=>{
					this.mapinit();
				},100);
			});
			
		
		},
		computed: {
//			_autoComplete() {
//				if(!this.loaded) return;
//				return new AMap.Autocomplete({});
//			},
			//			_placeSearch() {
			//				if(!this.loaded) return;
			//				return new AMap.PlaceSearch({});
			//			}
		},
		methods: {
		    
		    //根据城市citycode设置位置
		    setLocation(code){
		    	 AMap.service(["AMap.PlaceSearch"],()=>{
			        //构造地点查询类
			        var placeSearch = new AMap.PlaceSearch({ 
			            city: code, // 兴趣点城市
			            map: this.map, // 展现结果的地图实例 Marker点都处于视口的可见范围
			        });
			        //关键字查询
			        placeSearch.search('');
			    });
		    },
			
			//初始化地图方法
			mapinit() {
				
				//定位到指定经纬度位置
				let lat, lng;
				let params={
					resizeEnable: true,
					zoom:15  //初始地图级别
				}
				if(this.lat && this.lng) {
					lat = this.lat;
					lng = this.lng;
					params.center=[lng,lat];
				}
				this.map = new AMap.Map("container",params);
				
				//				this.placeSearch = new AMap.PlaceSearch({
				//					map: this.map
				//				});
				//测试代码 估计用不上
//				AMap.service(["AMap.PlaceSearch"],()=>{
//					//构造地点查询类
//					this.placeSearch = new AMap.PlaceSearch({
//						pageSize: 5, // 单页显示结果条数
//						pageIndex: 1, // 页码
//						city: "0760", // 兴趣点城市
//						citylimit: true, //是否强制限制在设置的城市内搜索
//						map: this.map, // 展现结果的地图实例
//						panel: "panel", // 结果列表将在此容器中进行展示。
//						autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
//					});
//					//关键字查询
//					let lat=this.placeSearch.N.map.B.center.lat;
//					let lng=this.placeSearch.N.map.B.center.lng;
//					this.map.setCenter([lng,lat]);
//				});

				//异步同时加载多个插件
				AMap.plugin(["AMap.ToolBar", "AMap.MapType"], () => {
					let toolbar = new AMap.ToolBar();
					let maptype = new AMap.MapType();
					this.map.addControl(toolbar);
					this.map.addControl(maptype);
				});
				//判断是否一开始显示标记
				if(this.lat && this.lng && this.address) {
					this.myLat = this.lat;
					this.myLng = this.lng;
					this.allAddress = this.searchAdd;
					this.showMarker();
				}
				
				//判断是否可以选择地址
				if(!this.editable) return;
				// 监听地图点击并更改地址栏文字
				this.map.on("click", e => {
					console.warn(e,'ssssssssssssssssssssss')
					let lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
					this.myLat = lnglatXY[1] + '';
					this.myLng = lnglatXY[0] + '';

					AMap.service("AMap.Geocoder", () => {
						let geocoder = new AMap.Geocoder();
						geocoder.getAddress(lnglatXY, (status, result) => {
							if(status === "complete" && result.info === "OK") {
								console.warn('result.regeocode------', result.regeocode);
								let allAddress = result.regeocode.formattedAddress;
								this.allAddress = allAddress;
								console.warn('result.regeocode.addressComponent--------', result.regeocode.addressComponent);
								var province = result.regeocode.addressComponent.province;
								var city = result.regeocode.addressComponent.city;
								let index = allAddress.indexOf(city);
								let address = allAddress;
								if(index >= 0) {
									if(city){
										address = allAddress.slice(index + city.length);
									}else{
										address = allAddress.slice(index + province.length);
									}
								}
								this.myAddress = address;
								// this.form.address_ditu=allAddress
								this.$emit('select', result.regeocode, this.myAddress, this.myLat, this.myLng);
								//生成标记
								this.showMarker();
							} else {}
						});
					});
				});
			},

			//生成标记
			showMarker(){
				var marker = new AMap.Marker({
			     	position:new AMap.LngLat(this.myLng,this.myLat),
					icon: new AMap.Icon({            
			            image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
			            size: new AMap.Size(52, 52),  //文字大小
			            imageSize: new AMap.Size(20,26), //图标大小
			        }),
					label: {
			          offset: new AMap.Pixel(-50, -40), //修改label相对于maker的位置
			          content: `<div class='markerTip'>${this.allAddress}</div>`   //显示标记内容
			        }
			    });
			
				this.markerList.push(marker);
				if(this.markerList.length>1){
					//删除上一个点标记
					this.map.remove(this.markerList[0]);
					//删除第一个元素
					this.markerList.shift();
				}
				this.map.add(this.markerList);
			},

			// 如果发生更改了就执行定位信息
			// changeTip(tip) {
			// 	this.form.address = tip.address;
			// 	this.placeSearch.setCity(tip.code);
			// 	this.placeSearch.search(tip.address);
			// },

			// 输入搜索定位相关
			aboutSearch(){
				console.warn(this.setCode,'所在城市')
				//输入搜索点信息
				var autoOptions = {
					city:this.setCode,//在规定城市搜索、默认全国
					input: "searchInput"
				};
				var auto = new AMap.Autocomplete(autoOptions);
				this.placeSearch2 = new AMap.PlaceSearch({
						pageSize: 5, // 单页显示结果条数
						pageIndex: 1, // 页码
						children: 0, //不展示子节点数据
						city: this.setCode, // 兴趣点城市
						citylimit: true,  //是否强制限制在设置的城市内搜索
						panel: "panel", // 结果列表将在此容器中进行展示。
						autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
						extensions: 'base', //返回基本地址信息  */
						map: this.map// 展现结果的地图实例
				});  //构造地点查询类
				AMap.event.addListener(auto, "select", this.selectSearch);//注册监听，当选中某条记录时会触发
			},
			// 选择搜索匹配都某一项
			selectSearch(e,placeSearch){
				console.warn(e,'选择的匹配结果')
				this.placeSearch2.setCity(e.poi.adcode);
				this.placeSearch2.search(e.poi.name);  //关键字查询查询
				this.$emit('selectSearch',e)
				// this.form.address_ditu=e.poi.name
        //设置搜索位置定点标注
        if (e.poi && e.poi.location) {
            this.map.setZoom(15);
            this.map.setCenter(e.poi.location);
						this.allAddress=e.poi.name
						this.mgLat=e.poi.location.lat
						this.mgLng=e.poi.location.lng
						this.showMarker();
            var id = e.poi.id;
            //详情查询
            this.placeSearch2.getDetails(id, (status, result)=> {
							if (status === 'complete' && result.info === 'OK') {
									this.placeSearchCall(result);
									console.warn(result,'获取到具体地址咯')
                }
            });
        }      
			},
			//回调函数
			placeSearchCall(data) {
				var infoWindow = new AMap.InfoWindow({
					autoMove: true,
					offset: {x: 0, y: -30}
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
			createContent(poi) {  //信息窗体内容
					var s = [];
					s.push("<b>名称：" + poi.name+"</b>");
					s.push("地址：" + poi.address);
					s.push("电话：" + poi.tel);
					s.push("类型：" + poi.type);
					return s.join("<br>");
			},

			// 执行搜索并将结果返回给下拉栏
//			autoComplete(queryString, cb) {
//				console.log(queryString);
//				if(!queryString || !this._autoComplete) return;
//				this._autoComplete.search(queryString, (status, result) => {
//					if(status === "complete") {
//						let results = queryString ?
//							result.tips.filter(this.createFilter(queryString)) :
//							restaurants;
//						console.log(results);
//						let endresults = [];
//						results.forEach(item => {
//							endresults.push({
//								value: item.district + "  " + item.name,
//								address: item.name,
//								code: item.adcode
//							});
//						});
//						cb(endresults);
//					}
//				});
//			},

			// 筛选出选择的
//			createFilter(queryString) {
//				return restaurant => {
//					return(
//						restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
//					);
//				};
//			},
		}
	}
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	/deep/ {
		.amap-marker-label {
			border: none;
			background: transparent;
		}
		.markerTip {
			border-radius: 5px;
			border-width: 0;
			background-color: #fff;
			padding: 10px;
			box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
		}
	}
	#panel {
		position: absolute;
		background-color: white;
		max-height: 90%;
		overflow-y: auto;
		top: 10px;
		right: 10px;
		width: 280px;
	}
</style>