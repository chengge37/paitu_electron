<!--  -->
<template>
	<div class="newServe" ref="container">
		<!-- 头部 -->
		<header class="header">
			<el-button type="default" @click="back">返回</el-button>
		</header>

		<!-- 全部表单信息 -->
		<el-form ref="deviceForm" :model="deviceForm" class="device-form">
			<!-- 图片展示 -->
			<div class="picture-show card">
				<!-- 标题 -->
				<div class="headTitle">图片展示</div>

				<clipper :editable="editable" :imgList="imgList" @delSuccess="delSuccess" @uploadSuccess="uploadSuccess" :uploadWidth="148" :uploadHeight="148" :uploadNum="uploadNum" :ratio="1"></clipper>
			</div>

			<!-- 基本信息 -->
			<div class="basic-info card">
				<!-- 标题 -->
				<Title titleName="基本信息"></Title>
				<!-- 基本信息表单 -->
				<div class="basic-table">
					<el-row :gutter="100">
						<el-col :span="8">
							<el-form-item label="选择类别" :required="true">
								<el-cascader :disabled="Boolean(returnCategory.length)" @change="changeCategory" placeholder="全部类别" class="cascader-border" :options.sync="equipCategoryArray" :show-all-levels="false" :props="{value:'id',label:'name'}" v-model="selectedCategory" ref="sel"></el-cascader>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="设备品牌" :required="true">
								<el-cascader ref="brand" @change="changeBrand" placeholder="全部品牌" class="cascader-border" :options.sync="brandArray" :show-all-levels="false" :disabled="selectedCategory.length===0||Boolean(returnCategory.length)" :props="{value:'id',label:'name'}" v-model="selectedBrand"></el-cascader>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="100" :class="{'has-nodevice':editable&&!selectedDevice}">
						<el-col :span="8">
							<el-form-item label="设备型号" class="sn" :required="true">
								<el-cascader @change="changeEquip" placeholder="全部型号可输入搜索" class="cascader-border" :options.sync="equipArray" :show-all-levels="false" :disabled="selectedBrand.length===0||Boolean(returnCategory.length)" :props="{value:'id',label:'name'}" v-model="selectedEquip" filterable></el-cascader>
							</el-form-item>
							<div class="nodevice-tip" v-if="editable&&!$route.query.id" @click="dialogFormVisible = true">设备列表中没有您想要的设备型号？即刻反馈</div>
						</el-col>
						<el-col :span="8">
							<el-form-item label="是否耗材">
								<el-select :disabled="Boolean($route.query.id)" placeholder="请选择是否耗材" v-model="deviceForm.consumptive">
									<el-option v-for="(item,index) in doorArray" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="100">
						<!-- <el-col :span="8">
                        <el-form-item label="设备成色" label-width>
                            <el-select :disabled="!editable" placeholder="请选择设备成色" v-model="deviceForm.product_new">
                                <el-option :label="item.label" :value="item.value" v-for="(item,index) in conditionArr" :key="index"></el-option>
                            </el-select>

                        </el-form-item>
            </el-col>-->
						<el-col :span="8">
							<el-form-item label="具体仓位">
								<el-input :disabled="!editable" v-model="deviceForm.location"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="100">
						<el-col :span="16">
							<el-form-item label="自定义描述" label-width>
								<el-input :disabled="!editable" v-model="deviceForm.custom_desc" style="width:100%"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="100">
						<el-col :span="8">
							<el-form-item label="设备数量">
								<el-input-number @change="changeNum" class="num-control" :disabled="!editable" v-model="deviceForm.count" controls-position="right" :min="1" :max="100"></el-input-number>
								<!-- <el-button @click="changeNum">确定</el-button> -->
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="租赁方式">
								<el-select :disabled="!editable" placeholder="请选择租赁方式" v-model="deviceForm.only_rent_day" @change="rentMethod">
									<el-option v-for="(item,index) in rentArray" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="100" class="sn-condition" v-if="deviceForm.consumptive == 0">
						<!-- <div v-if="deviceForm.consumptive == 0"> -->
						<el-col :span="16" class="device-sn" :class="{'device-show-table':$route.query.id}">
							<div class="start-label">
								<span class="red-start">*</span>
								<span>设备编号</span>
							</div>
							<div class="input-list">
								<div class="sn-input" v-if="$route.query.snEdit==1">
									<div class="inputNum" v-for="(item,index) in inputSN" :key="index">
										<el-input class="input-sn" :disabled="!editable" @blur="checkInputSN(item.sn,index)" placeholder="请输入设备编号" v-model="item.sn"></el-input>
										<el-button type="text" @click="createNum(index)">随机生成</el-button>
									</div>
								</div>
								<div class="sn-table" v-else>
									<div class="table-head">
										<span>编号</span>
										<span>成色</span>
										<span>订单</span>
										<span v-if="editable">操作</span>
									</div>
									<div class="table-content">
										<div class="sn-row" v-for="(item,index) in inputSN" :key="index">
											<!-- <span v-if="!editable"con class="sn">{{item.sn}}</span> -->
											<el-input class="sn" :disabled="!editable" @blur="checkInputSN(item.sn,index)" placeholder="请输入设备编号" v-model="item.sn"></el-input>
											<el-select class="condition" :disabled="!editable" placeholder="请选择设备成色" v-model="item.product_new">
												<el-option :label="each.label" :value="each.value" v-for="(each,j) in conditionArr" :key="j"></el-option>
											</el-select>
											<div class="detail" v-if="item.order_array!==undefined && item.order_array.length!=0">
												<div class="order-row" v-for="(each,j) in item.order_array" :key="j">
													<p>
														<span>买家：</span>
														<span>{{each.user.nick}}</span>
													</p>
													<p>
														<span>下单时间：</span>
														<span>{{each.create_time|time2Date}}</span>
													</p>
													<p class="use-time">
														<span>使用时间：</span>
														<span>{{each.start_time}}</span>
														<span>至</span>
														<span>{{each.end_time}}</span>
													</p>
													<p>
														<span @click="$router.push({path:'/serve/order/details',query:{id:each.id}})">订单详情</span>
													</p>
												</div>
											</div>
											<div v-else class="detail">
												<div class="no-order">暂无订单</div>
											</div>
											<div v-if="editable" class="sn-del word-hover" @click="delSN(index)">删除</div>
										</div>
									</div>
								</div>
							</div>
						</el-col>
						<!-- 每个设备都有设备成色 -->
						<el-col :span="16" class="device-condition" v-if="$route.query.snEdit==1">
							<div class="start-label">
								<span class="red-start">*</span>
								<span>设备成色</span>
							</div>
							<div class="condition-group">
								<el-select v-for="(item,index) in inputSN" :key="index" :disabled="!editable" placeholder="请选择设备成色" v-model="item.product_new">
									<el-option :label="each.label" :value="each.value" v-for="(each,j) in conditionArr" :key="j"></el-option>
								</el-select>
							</div>
						</el-col>
						<!-- </div> -->
					</el-row>

					<el-row :gutter="100">
						<el-col :span="8">
							<el-form-item label="使用场地">
								<el-select :disabled="!editable" placeholder="请选择使用场地" v-model="deviceForm.borrow_type" @change="changeBorrow">
									<el-option v-for="(item,index) in borrowArray" :key="index" :label="item.borrowText" :value="item.borrowValue"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="送货上门">
								<!-- <el-input :disabled="editable" v-model="device.door_to_door"></el-input> -->
								<el-select :disabled="!editable" placeholder="请选择是否送货上门" v-model="deviceForm.door_to_door">
									<el-option v-for="(item,index) in doorArray" :key="index" :label="item.label" :value="item.value"></el-option>
									<!-- <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>-->
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</div>

			<!-- 具体收费 -->
			<div class="charge card">
				<!-- 标题 -->
				<p class="headTitle">具体收费</p>

				<!-- 按时收费 -->
				<div class="charge-title" v-if="deviceForm.only_rent_day!=1">
					<div>
						<span class="red-start">*</span>
						<span>按时收费</span>
					</div>
					<div v-if="editable" class="add-more" @click="addHourChargeRow">继续添加</div>
				</div>
				<div class="charge-table" v-if="deviceForm.only_rent_day!=1">
					<div class="table-head">
						<span>使用时长</span>
						<div class="center">
							<span>使用场地</span>
							<span>工作日工作时间</span>
							<span>工作日非工作时间</span>
							<span>周末工作时间</span>
							<span>周末非工作时间</span>
							<span>节假日工作时间</span>
							<span>节假日非工作时间</span>
						</div>
						<span v-if="editable">操作</span>
					</div>
					<div class="charge-item" v-for="(item,index) in deviceForm.price_table" :key="index">
						<div class="using-time">
							<el-select class="selectHour" :disabled="!editable" placeholder="请选择使用时长" v-model="item.hour" style="width:90px" @change="selectHour">
								<el-option v-for="(item,index) in hourArray" :disabled="item.alreadyChoose" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
						<div class="charge-row">
							<div class="row-item" v-if="deviceForm.borrow_type==0||deviceForm.borrow_type==1">
								<div>影棚内</div>
								<div>
									<el-input ref="inp" require @input="inputNum(item.price1_in,index)" maxlength="8" v-model="item.price1_in" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price2_in" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price3_in" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price4_in" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price5_in" :disabled="!editable">
										<div slot="suffix">￥</div>
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price6_in" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
							</div>

							<div class="row-item" v-if="deviceForm.borrow_type==0||deviceForm.borrow_type==2">
								<div>外借</div>
								<div>
									<el-input maxlength="6" v-model="item.price1_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price2_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price3_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price4_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price5_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input maxlength="6" v-model="item.price6_out" :disabled="!editable">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
							</div>
						</div>
						<div class="operation" v-if="editable">
							<el-button class="del-btn" @click="delHourChargeRow(index)">删除</el-button>
						</div>
					</div>
					<div class="no-item" v-if="!deviceForm.price_table.length">暂无数据</div>
				</div>

				<!-- 按天收费 -->
				<div class="charge-title">
					<div>
						<span class="red-start">*</span>
						<span>按天收费</span>
					</div>
					<!-- <div v-if="editable" class="add-more" @click="addDayChargeRow">继续添加</div> -->
				</div>
				<div class="charge-table">
					<div class="table-head">
						<span>使用天数</span>
						<div class="center">
							<span>使用场地</span>
							<span>工作日</span>
							<span>周末</span>
							<span>节假日</span>
						</div>
						<!-- <span v-if="editable">操作</span> -->
					</div>
					<div class="charge-item">
						<div class="using-time">
							<el-col class="day">1 天</el-col>
						</div>
						<div class="charge-row">
							<div class="row-item" v-if="deviceForm.borrow_type==0||deviceForm.borrow_type==1">
								<div>影棚内</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_workday_in" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_weekend_in" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_holiday_in" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
							</div>

							<div class="row-item" v-if="deviceForm.borrow_type==0||deviceForm.borrow_type==2">
								<div>外借</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_workday_out" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_weekend_out" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
								<div>
									<el-input class="day-input" v-model="deviceForm.price_day_holiday_out" :disabled="!editable" maxlength="6">
										<div slot="suffix">￥</div>
									</el-input>
								</div>
							</div>
						</div>
					</div>
					<!-- <div class="no-item" v-if="!deviceForm.charge.dayCharge.length">暂无数据</div> -->
				</div>
			</div>

			<!-- 视频 -->
			<div class="video-dec card">
				<!-- 标题 -->
				<Title titleName="视频"></Title>

				<!-- 视频及描述 -->
				<div class="video-wrap">
					<!-- 添加视频 -->
					<el-upload :disabled="!editable" class="avatar-uploader" action="https://up-z2.qiniup.com/" accept=".mp4, .qlv, .qsv, .ogg, .flv, .avi, .wmv, .rmvb" :data="videoData" :show-file-list="false" :before-upload="beforeUploadVideo" :on-success="handleVideoSuccess" :on-change="getFile" :on-progress="uploadVideoProcess">
						<div class="add-video" v-if="editable&&!videoURL">
							<div class="center">
								<i class="el-icon-video-play"></i>
								<span>点击添加视频</span>
							</div>
						</div>
						<video class="show-video" v-if="videoURL" :src="videoURL" width="572" height="327" controls="controls">您的浏览器不支持视频播放</video>
					</el-upload>
					<div v-if="editable&&videoURL" class="tip">点击视频框区域可更换上传视频 ! ! !</div>
					<el-button v-if="editable&&videoURL" class="del-video" @click="delVideo">删除视频</el-button>

					<!--<div class="textare" v-if="editable">
						<tinymce v-model="deviceForm.intro" :height="300" />
					</div>
					<div v-else class="text-show">
						<div v-html="deviceForm.intro"></div>
					</div>-->
				</div>
			</div>
			
			<!-- 描述 -->
			<div class="video-dec card">
				<!-- 标题 -->
				<Title titleName="产品描述（必填）"></Title>

				<!-- 产品描述 -->
				<div class="video-wrap">
					<div class="textare" v-if="editable">
						<tinymce v-model="deviceForm.intro" :height="300" />
					</div>
					<div v-else class="text-show">
						<div v-html="deviceForm.intro"></div>
					</div>
				</div>
			</div>

			<!-- 修改按钮 -->
			<div class="bottomBtn">
				<el-button class="color-area" :loading="saveLoading" type="primary" @click="toDeviceList(deviceForm)" v-permission v-text="btnText"></el-button>
				<el-button class="color-area" v-if="editable" type="default" @click="cancel">取 消</el-button>
			</div>
		</el-form>

		<!-- 反馈添加新设备弹框 -->
		<el-dialog class="box" title="感谢您提交我们没有收录的设备" :close-on-click-modal="modal" :visible.sync="dialogFormVisible">
			<el-form :model="newDevice" class="box-form">
				<el-row class="first-line">
					<el-form-item label="设备品牌" label-width>
						<el-input v-model="newDevice.brand" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称" label-width>
						<el-input v-model="newDevice.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-row>
				<el-form-item label="设备信息" label-width>
					<el-input v-model="newDevice.detail" type="textarea" resize="none" autocomplete="off" placeholder="可以填写设备的网址，或者文字描述"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" label-width>
					<el-input v-model="newDevice.contact" autocomplete="off" placeholder="您可以留下联系方式，我们将在第一时间和您联系" ref="phone" maxlength="11"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="bottomBtn">
				<el-button type="primary" @click="submitNew">提 交</el-button>
				<el-button @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { setTimeout } from "timers";
	import { deepcopy } from "@/common/function/util.js";
	import { qiniuHost } from "@config/config.js";
	import EditorImage from "ServeComponents/Tinymce/components/EditorImage";
	import { checkPic } from "@util/picUtil.js";
	import { checkRepeat } from "@util/checkRepeat.js";
	import { checkVideo } from "@util/videoCheck.js";
	import Title from "ServeComponents/Title/index";
	import Tinymce from "ServeComponents/Tinymce";
	import { equip } from "@config/api.js";
	import { storage } from "@util/storage.js";
	import clipper from "ServeComponents/photoClipper";

	export default {
		data() {
			return {
				saveLoading: false,
				modal: false,
				allDevice: {},
				editable: true, //该字段区分设备详情页面是否可编辑
				selectedDevice: {},
				deviceSN: [],
				inputSN: [],
				editSN: [],
				eachDevice: {
					sn: "",
					product_new: "10",
					order_array: []
				},
				// 添加表单信息
				deviceForm: {
					consumptive: 0,
					static_equip_id: 0,
					category_id: 0,
					equip_category_array_str: "",
					count: 1,
					borrow_type: 0,
					only_rent_day: 0,
					price_day_workday_in: 0,
					price_day_weekend_in: 0,
					price_day_holiday_in: 0,
					price_day_workday_out: 0,
					price_day_weekend_out: 0,
					price_day_holiday_out: 0,
					door_to_door: 1,
					intro: "",
					price_table: [{
						hour: 1,
						price1_in: 0,
						price1_out: 0,
						price2_in: 0,
						price2_out: 0,
						price3_in: 0,
						price3_out: 0,
						price4_in: 0,
						price4_out: 0,
						price5_in: 0,
						price5_out: 0,
						price6_in: 0,
						price6_out: 0
					}],
					upload_array: [],
					location: "",
					video: "",
					sn_array: [],
					product_new: "10",
					custom_desc: ""
				},
				// 修改表单信息
				alterForm: {
					d: 0,
					count: 1,
					borrow_type: 0,
					only_rent_day: 0,
					price_day_workday_in: 0,
					price_day_weekend_in: 0,
					price_day_holiday_in: 0,
					price_day_workday_out: 0,
					price_day_weekend_out: 0,
					price_day_holiday_out: 0,
					door_to_door: 1,
					intro: "",
					price_table: [{
						hour: 1,
						price1_in: 0,
						price1_out: 0,
						price2_in: 0,
						price2_out: 0,
						price3_in: 0,
						price3_out: 0,
						price4_in: 0,
						price4_out: 0,
						price5_in: 0,
						price5_out: 0,
						price6_in: 0,
						price6_out: 0
					}],
					pic_update: {
						removeArray: [],
						uploadArray: [{
							uid: "",
							key: ""
						}]
					},
					location: "",
					video: ""
				},
				pic_update: {
					removeArray: [],
					uploadArray: []
				},
				// 视频相关
				videoURL: "",
				videoFlag: false, //刚开始的时候显示为flase
				videoUploadPercent: "0%", //进度条刚开始的时候为0%
				videoData: {
					//添加其他参数
				},
				borrowArray: [{
						borrowText: "可外借可影棚内使用",
						borrowValue: 0
					},
					{
						borrowText: "仅在影棚内使用",
						borrowValue: 1
					},
					{
						borrowText: "仅外借",
						borrowValue: 2
					}
				],
				rentArray: [{
						label: "按小时/按天",
						value: 0
					},
					{
						label: "按天",
						value: 1
					}
				],
				doorArray: [{
						label: "是",
						value: 1
					},
					{
						label: "否",
						value: 0
					}
				],
				hourArray: [{
						label: "1 小时",
						value: 1,
						alreadyChoose: false
					},
					{
						label: "2 小时",
						value: 2,
						alreadyChoose: false
					},
					{
						label: "3 小时",
						value: 3,
						alreadyChoose: false
					},
					{
						label: "4 小时",
						value: 4,
						alreadyChoose: false
					}
				],
				selectedCategory: [],
				selectedBrand: [],
				selectedEquip: [],
				// equipCategoryArray: staticEquipCatArray,
				equipCategoryArray: [],
				brandOption: [],
				brandArray: [],
				equipArray: [],
				returnCategory: [],

				// 按时收费行
				hourChargeRow: {
					hour: 1,
					price1_in: 0,
					price1_out: 0,
					price2_in: 0,
					price2_out: 0,
					price3_in: 0,
					price3_out: 0,
					price4_in: 0,
					price4_out: 0,
					price5_in: 0,
					price5_out: 0,
					price6_in: 0,
					price6_out: 0
				},
				listObj: {},
				imgList: [],
				picPostData: {},
				// 图片预览
				dialogImageUrl: "",
				dialogVisible: false,
				// 视频相关
				videoObj: {},
				host: qiniuHost,

				// 添加新设备弹框
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {
					name: "",
					region: "",
					date1: "",
					date2: "",
					delivery: false,
					type: [],
					resource: "",
					desc: ""
				},
				// formLabelWidth: '120px',
				// 添加新设备信息
				newDevice: {
					name: "",
					detail: "",
					contact: "",
					brand: ""
				},
				// 底部按钮文字
				btnText: "",
				conditionArr: [{
						label: "全新",
						value: "10"
					},
					{
						label: "9 成新",
						value: "9"
					},
					{
						label: "8 成新",
						value: "8"
					},
					{
						label: "7 成新",
						value: "7"
					},
					{
						label: "6 成新",
						value: "6"
					},
					{
						label: "5 成新",
						value: "5"
					}
				],
				uploadNum: 8
			};
		},

		components: {
			Title,
			Tinymce,
			clipper
		},
		created() {
			this.editable = storage.get("editable");

			this.equipCategoryArray = this.$staticCategoryTree;
			this.staticBrandArray = this.$staticBrandArray;
			this.staticEquipArray = this.$staticEquipArray;

			if(!this.editable && this.selectedDevice) {
				this.btnText = "修改";
			}
			if(this.editable) {
				this.btnText = "保存";
			}
		},

		mounted() {
			// 根据传过来的id获取设备详情
			if(this.$route.query.id) {
				this.getDetail(this.$route.query.id);
			} else {
				this.imgList.push({
					key: ""
				});
			}
			this.changeNum();
		},

		methods: {
			//随机生成纯数字，默认为8位
			createNum(index) {
				console.log("this.createNum--------", this.inputSN);
				// 添加查重
				let num = this.util.getRandomNum();
				this.getRequest(equip.checkSn, {
					sn: num
				}).then(res => {
					if(res == 0) {
						this.inputSN[index].sn = num;
						console.log("num----------", num);
					} else {
						this.$message.error("已存在该设备编号，请更换");
					}
				});
			},

			// 用图片裁剪后上传七牛成功
			uploadSuccess(data) {
				this.deviceForm.upload_array.push({
					key: data
				});
				this.pic_update.uploadArray = [...this.deviceForm.upload_array];
				console.warn(this.deviceForm.upload_array, "上传的图片数组");
			},
			// 用图片裁剪组件删除图片
			delSuccess(data) {
				console.warn(data, "oooo");
				this.pic_update.uploadArray = [...data.uploadArray];
				this.pic_update.removeArray = [...data.removeArray];
				console.warn(this.pic_update, "update");
			},
			// 获取设备详情
			getDetail(id) {
				this.getRequest(equip.get, {
						id
					})
					.then(res => {
						if(res) {
							this.deviceForm.price_table = [];
							this.selectedCategory = res.rows[0].equip_category_array_str.split(
								","
							);
							this.returnCategory = res.rows[0].equip_category_array_str.split(
								","
							);
							this.changeCategory(this.selectedCategory);
							this.selectedBrand.push(res.rows[0].brand_id);
							this.changeBrand(this.selectedBrand);
							this.selectedEquip.push(res.rows[0].static_equip_id);
							if(res.rows[0].pic) {
								if(res.rows[0].pic.indexOf(",") != -1) {
									// 过滤静态图片
									let picArr = res.rows[0].pic.split(",").filter(item => {
										return item.indexOf("static/") == -1;
									});
									picArr.forEach((item, index) => {
										if(!item.length) {
											return;
										}
										this.imgList.push({
											key: item
										});
									});
								} else {
									this.imgList.push({
										key: res.rows[0].pic
									});
								}
								if(this.editable) {
									// 这里给图片裁剪组件传递图片数组，判断是否需要新增一个上传框
									let hasNull = this.imgList.some(item => {
										return item.key == "";
									});
									!hasNull &&
										this.imgList.length < this.uploadNum &&
										this.imgList.push({
											key: ""
										});
								}
							}
							this.deviceForm.location = res.rows[0].location;
							this.deviceForm.count = res.rows[0].count;

							this.inputSN = res.rows[0].sn_array;
							this.deviceForm.product_new = res.rows[0].product_new;
							this.deviceForm.custom_desc = res.rows[0].custom_desc;

							this.deviceForm.only_rent_day = parseInt(res.rows[0].only_rent_day);
							this.deviceForm.borrow_type = parseInt(res.rows[0].borrow_type);
							this.deviceForm.door_to_door = parseInt(res.rows[0].door_to_door);
							this.deviceForm.price_day_workday_in =
								res.rows[0].price_day_workday_in;
							this.deviceForm.price_day_workday_out =
								res.rows[0].price_day_workday_out;
							this.deviceForm.price_day_weekend_in =
								res.rows[0].price_day_weekend_in;
							this.deviceForm.price_day_weekend_out =
								res.rows[0].price_day_weekend_out;
							this.deviceForm.price_day_holiday_in =
								res.rows[0].price_day_holiday_in;
							this.deviceForm.price_day_holiday_out =
								res.rows[0].price_day_holiday_out;
							this.deviceForm.intro = res.rows[0].intro;
							this.videoURL = this.host + res.rows[0].video;

							if(res.rows[0].only_rent_day == 0) {
								let modelArr = res.price_hour_array[this.$route.query.id];

								let hourArr = [];
								res.price_hour_array[this.$route.query.id].forEach(
									(item, index) => {
										hourArr.push(item.custom_hour);
									}
								);
								let uniqueHourArr = this.unique(hourArr);
								let beforeArr = [];
								uniqueHourArr.forEach((ele, j) => {
									this.hourChargeRow.hour = parseInt(ele);
									res.price_hour_array[this.$route.query.id].forEach(
										(item, index) => {
											if(ele == item.custom_hour) {
												beforeArr.push(item);
											}
										}
									);
									modelArr = [];
									beforeArr.forEach((each, j) => {
										if(each.is_out == 0 && each.type == 1) {
											this.hourChargeRow.price1_in = each.price;
										}
										if(each.is_out == 1 && each.type == 1) {
											this.hourChargeRow.price1_out = each.price;
										}
										if(each.is_out == 0 && each.type == 2) {
											this.hourChargeRow.price2_in = each.price;
										}
										if(each.is_out == 1 && each.type == 2) {
											this.hourChargeRow.price2_out = each.price;
										}
										if(each.is_out == 0 && each.type == 3) {
											this.hourChargeRow.price3_in = each.price;
										}
										if(each.is_out == 1 && each.type == 3) {
											this.hourChargeRow.price3_out = each.price;
										}
										if(each.is_out == 0 && each.type == 4) {
											this.hourChargeRow.price4_in = each.price;
										}
										if(each.is_out == 1 && each.type == 4) {
											this.hourChargeRow.price4_out = each.price;
										}
										if(each.is_out == 0 && each.type == 5) {
											this.hourChargeRow.price5_in = each.price;
										}
										if(each.is_out == 1 && each.type == 5) {
											this.hourChargeRow.price5_out = each.price;
										}
										if(each.is_out == 0 && each.type == 6) {
											this.hourChargeRow.price6_in = each.price;
										}
										if(each.is_out == 1 && each.type == 6) {
											this.hourChargeRow.price6_out = each.price;
										}
									});

									this.hourArray.forEach((o, index) => {
										if(this.hourChargeRow.hour == o.value) {
											o.alreadyChoose = true;
										}
									});

									this.deviceForm.price_table.push(this.hourChargeRow);
									this.hourChargeRow = {
										hour: 1,
										price1_in: 0,
										price1_out: 0,
										price2_in: 0,
										price2_out: 0,
										price3_in: 0,
										price3_out: 0,
										price4_in: 0,
										price4_out: 0,
										price5_in: 0,
										price5_out: 0,
										price6_in: 0,
										price6_out: 0
									};
								});
							}
						}
					})
					.catch(err => {});
			},
			checkPhone(val) {
				if(!/^1[3456789]\d{9}$/.test(val)) {
					this.$message.error("手机号码有误，请重填");
					this.newDevice.contact = "";
					this.$refs.phone.focus();
					return false;
				} else {
					return true;
				}
			},
			inputNum(val, i) {
				{
					let reg = /[^\d.]/;
					if(reg.test(this.deviceForm.price_table[i].price1_in)) {
						this.$message.error("请勿输入数字和小数点以外的字符");
						this.deviceForm.price_table[i].price1_in = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					}
				}
				if(
					this.deviceForm.price_table[i].price1_in.indexOf(".") < 0 &&
					this.deviceForm.price_table[i].price1_in[0] == 0 &&
					this.deviceForm.price_table[i].price1_in[1] == 0
				) {
					this.$message.error("不能把一个以上的0作为开头");
					this.deviceForm.price_table[i].price1_in = parseFloat(
						this.deviceForm.price_table[i].price1_in
					);
				} {
					let reg = /./;
					if(this.deviceForm.price_table[i].price1_in.match(reg).length == 2) {
						this.$message.error("只能存在一个小数点");
						this.deviceForm.price_table[
								i
							].price1_in = this.deviceForm.price_table[i].price1_in
							.replace(".", "$#$")
							.replace(/\./g, "")
							.replace("$#$", "."); //只保留第一个小数点, 清除多余的
					}
				} {
					if(
						this.deviceForm.price_table[i].price1_in.indexOf(".") > 0 &&
						this.deviceForm.price_table[i].price1_in.split(".").length > 2
					) {
						this.deviceForm.price_table[
							i
						].price1_in = this.deviceForm.price_table[i].price1_in.replace(
							/^(\-)*(\d+)\.(\d).*$/,
							"$1$2.$3"
						); //
						this.$message.error("最多输入一位小数");
					}
				}
			},
			checkInputSN(val, index) {
				if(!val) {
					this.$message.warning("设备编号不能为空");
				} else {
					if(this.inputSN.length > 1) {
						this.getRequest(equip.checkSn, {
							sn: val
						}).then(res => {
							if(res == 0) {
								let arr = this.inputSN.filter((item, i) => {
									return i != index;
								});
								let hasSame = arr.some(item => {
									return item.sn == val;
								});
								if(hasSame) {
									this.$message.error("设备编号不能重复");
									this.inputSN[index].sn = "";
								}
							} else {
								this.$message.error("已存在该设备编号，请更换");
							}
						});
					}
				}
			},
			priceType() {},
			rentMethod() {
				this.deviceForm.price_table = [{
					hour: 1,
					price1_in: 0,
					price1_out: 0,
					price2_in: 0,
					price2_out: 0,
					price3_in: 0,
					price3_out: 0,
					price4_in: 0,
					price4_out: 0,
					price5_in: 0,
					price5_out: 0,
					price6_in: 0,
					price6_out: 0
				}];
			},
			changeNum() {
				if(this.deviceForm.count > this.inputSN.length) {
					for(let i = 0; i < this.deviceForm.count - this.inputSN.length; i++) {
						this.deviceSN.push(deepcopy(this.eachDevice));
					}
					this.inputSN.push(...this.deviceSN);
					this.deviceSN = [];
				} else if(this.deviceForm.count < this.inputSN.length) {
					let num = this.inputSN.length;
					for(let i = 0; i < num - this.deviceForm.count; i++) {
						this.inputSN.splice(this.inputSN.length - 1, 1);
					}
				}
			},

			changeBorrow(val) {
				this.deviceForm.borrow_type = parseInt(val);
				this.deviceForm.price_table = [{
					hour: 1,
					price1_in: 0,
					price1_out: 0,
					price2_in: 0,
					price2_out: 0,
					price3_in: 0,
					price3_out: 0,
					price4_in: 0,
					price4_out: 0,
					price5_in: 0,
					price5_out: 0,
					price6_in: 0,
					price6_out: 0
				}];
			},
			changeCategory(value) {
				this.deviceForm.category_id =
					this.selectedCategory[this.selectedCategory.length - 1] + "";
				this.deviceForm.equip_category_array_str = this.selectedCategory.join();
				let category_sameid_array = [];
				this.staticEquipArray.forEach((item, index) => {
					if(item.category_id === value[value.length - 1]) {
						category_sameid_array.push(item.brand_id);
					}
				});
				this.brandArray = [];
				this.staticBrandArray.forEach((each, j) => {
					this.unique(category_sameid_array).forEach((brand, k) => {
						if(each.id === brand) {
							this.brandArray.push(each);
						}
					});
				});
				this.selectedBrand = [];
				this.selectedEquip = [];
			},
			changeBrand(value) {
				this.equipArray = [];
				this.staticEquipArray.forEach((item, index) => {
					if(
						item.category_id ===
						this.selectedCategory[this.selectedCategory.length - 1] &&
						item.brand_id === this.selectedBrand[0]
					) {
						this.equipArray.push(item);
					}
				});
			},
			changeEquip(value) {
				this.deviceForm.static_equip_id = this.selectedEquip[0];
			},
			// 数组去重
			unique(arr) {
				var x = new Set(arr);
				return [...x];
			},
			// 点击返回
			back() {
				history.back();
			},

			//视频上传之前判断他的大小
			beforeUploadVideo(file) {
				const _self = this;
				const _URL = window.URL || window.webkitURL;
				const fileName = file.uid;
				this.videoObj[fileName] = {};
				return new Promise((resolve, reject) => {
					let Sync = async() => {
						try {
							let videoKey = await checkVideo(file);
							if(videoKey) {
								let token = await this.getRequest(
									"/qiniu/userGetQiniuUpToken?key=" + videoKey
								);
								this.videoData = token;
								resolve(true);
							} else {
								reject(false);
								this.videoObj = {};
							}
						} catch(error) {
							reject(false);
						}
					};
					Sync();
				});
			},
			// 获取预览视频信息
			getFile(file, fileList) {
				this.videoFlag = !this.videoFlag;
				this.videoURL = window.URL.createObjectURL(file.raw);
			},
			//视频上传的时候获取上传进度传给进度条
			uploadVideoProcess(event, file, fileList) {
				this.videoFlag = true;
				this.videoUploadPercent = parseInt(file.percentage);
			},
			//视频上传成功之后返回视频地址
			handleVideoSuccess(res, file) {
				this.videoFlag = true;
				this.videoUploadPercent = 0;
				this.videoURL = window.URL.createObjectURL(file.raw);
				this.deviceForm.video = res.key;
			},
			// 添加视频后删除视频重选
			delVideo() {
				this.videoFlag = !this.videoFlag;
				this.videoURL = "";
			},

			// 选择自定义小时
			selectHour() {
				this.hourArray = [{
						label: "1 小时",
						value: 1,
						alreadyChoose: false
					},
					{
						label: "2 小时",
						value: 2,
						alreadyChoose: false
					},
					{
						label: "3 小时",
						value: 3,
						alreadyChoose: false
					},
					{
						label: "4 小时",
						value: 4,
						alreadyChoose: false
					}
				];
				this.deviceForm.price_table.forEach(item => {
					this.hourArray.forEach((ele, index) => {
						if(item.hour == ele.value) {
							// this.hourArray.splice(index,1)
							ele.alreadyChoose = true;
						}
					});
				});
				this.hourArray.forEach((item, index) => {
					if(!item.alreadyChoose) {
						this.hourChargeRow.hour = this.hourArray[index].hour;
					}
				});
			},

			// 添加按时收费行
			addHourChargeRow() {
				this.deviceForm.price_table.forEach(item => {
					this.hourArray.forEach((ele, index) => {
						if(item.hour == ele.value) {
							ele.alreadyChoose = true;
							// this.hourArray.splice(index,1)
						}
					});
				});
				let arr = [];
				this.hourArray.forEach((item, index) => {
					if(!item.alreadyChoose) {
						arr.push(item);
						this.hourChargeRow.hour = arr[0].value;
					}
				});
				this.deviceForm.price_table.push(deepcopy(this.hourChargeRow));
			},
			// 删除按时收费行
			delHourChargeRow(index) {
				this.deviceForm.price_table.splice(index, 1);
				this.hourArray = [{
						label: "1 小时",
						value: 1,
						alreadyChoose: false
					},
					{
						label: "2 小时",
						value: 2,
						alreadyChoose: false
					},
					{
						label: "3 小时",
						value: 3,
						alreadyChoose: false
					},
					{
						label: "4 小时",
						value: 4,
						alreadyChoose: false
					}
				];
				this.deviceForm.price_table.forEach(item => {
					this.hourArray.forEach((ele, index) => {
						if(item.hour == ele.value) {
							ele.alreadyChoose = true;
							// this.hourArray.splice(index,1)
						}
					});
				});
				this.hourArray.forEach((item, index) => {
					if(!item.alreadyChoose) {
						this.hourChargeRow.hour = this.hourArray[index].hour;
					}
				});
			},
			// 添加按天收费行
			// addDayChargeRow() {
			//   this.deviceForm.charge.dayCharge.push(deepcopy(this.hourChargeRow));
			// },
			// 删除按天收费行
			// delDayChargeRow(index) {
			//   this.deviceForm.charge.dayCharge.splice(index, 1);
			// },
			// 打开新增设备弹框
			openBox() {},
			// 关闭新增设备弹框前
			submitNew() {
				if(!this.checkPhone(this.newDevice.contact)) {
					return;
				}
				this.saveLoading = true;
				this.postRequest(equip.addNew, this.newDevice)
					.then(res => {
						this.saveLoading = false;
						this.newDevice.name = "";
						this.newDevice.detail = "";
						this.newDevice.contact = "";
						this.newDevice.brand = "";
						// this.$confirm('设备信息已提交，请等待审核通过').then(()=>{
						// }).catch(()=>{})
						this.dialogFormVisible = false;
					})
					.catch(err => {
						this.saveLoading = false;
					});
			},
			// 添加设备或者修改设备完成后
			toDeviceList(deviceForm) {
				console.log(
					"-----------------------------------------------------------------"
				);
				if(!this.editable) {
					storage.set("editable", true);
					this.editable = storage.get("editable");
					this.btnText = "保存";
					// 这里给图片裁剪组件传递图片数组，判断是否需要新增一个上传框
					let hasNull = this.imgList.some(item => {
						return item.key == "";
					});
					!hasNull &&
						this.imgList.length < this.uploadNum &&
						this.imgList.push({
							key: ""
						});
					return;
				}
				if(this.$route.query.id) {
					this.editSN = [];
					this.inputSN.slice().forEach(item => {
						this.editSN.push(item);
					});
					this.saveLoading = true;

					this.postRequest(equip.edit, {
							id: this.$route.query.id,
							count: this.deviceForm.count,
							borrow_type: this.deviceForm.borrow_type,
							only_rent_day: this.deviceForm.only_rent_day,
							price_day_workday_in: this.deviceForm.price_day_workday_in,
							price_day_weekend_in: this.deviceForm.price_day_weekend_in,
							price_day_holiday_in: this.deviceForm.price_day_holiday_in,
							price_day_workday_out: this.deviceForm.price_day_workday_out,
							price_day_weekend_out: this.deviceForm.price_day_weekend_out,
							price_day_holiday_out: this.deviceForm.price_day_holiday_out,
							door_to_door: this.deviceForm.door_to_door,
							intro: this.deviceForm.intro,
							price_table: this.deviceForm.price_table,
							pic_update: this.pic_update,
							video: this.deviceForm.video,
							location: this.deviceForm.location,
							sn_array: this.editSN,
							consumptive: this.deviceForm.consumptive,
							product_new: this.deviceForm.product_new,
							custom_desc: this.deviceForm.custom_desc
						})
						.then(res => {
							this.$message.success("修改设备成功");
							this.saveLoading = false;
							storage.set("editable", false);
							this.editable = storage.get("editable");
							this.btnText = "修改";
							// 这里给图片裁剪组件传递图片数组，判断是否需要删除一个上传框
							let hasNull = this.imgList.some(item => {
								return item.key == "";
							});
							hasNull && this.imgList.pop();
						})
						.catch(err => {
							this.saveLoading = false;

							return;
						});
				} else {
					// let hasNull=this.inputSN.some(item=>{
					//     return item.sn.length==0
					// })
					// if(hasNull){
					//     this.$message.warning('存在某些设备尚未设置编号，请填写完整')
					//     return
					// }
					this.editSN = [];
					this.inputSN.slice().forEach(item => {
						this.editSN.push(item);
					});
					this.deviceForm.sn_array = [...this.editSN];

					this.postRequest(equip.add, this.deviceForm)
						.then(res => {
							this.$message.success("添加设备成功");
							this.$router.push({
								path: "/serve/control_center/Device_set"
								// query: { deviceForm: deviceForm }
							});
						})
						.catch(err => {});
				}
			},
			cancel() {
				if(!this.$route.query.id) {
					history.back();
				} else {
					this.editable = !this.editable;
					this.btnText = "修 改";
					// 这里给图片裁剪组件传递图片数组，判断是否需要删除一个上传框
					let hasNull = this.imgList.some(item => {
						return item.key == "";
					});
					hasNull && this.imgList.pop();
				}
			},
			delSN(i) {
				if(this.inputSN.length == 1) {
					this.$message.error("至少要有一个设备");
					return;
				}
				this.inputSN.splice(i, 1);
				this.deviceForm.count = this.inputSN.length;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.red-start {
		color: red;
	}
	
	// 头部
	.header {
		display: flex;
		justify-content: flex-end;
		button {
			margin: 10px 0px;
		}
	}
	
	// 表单
	.device-form {
		// 图片展示
		.picture-show {
			background-color: #fff;
			display: flex;
			flex-direction: column;
			margin-bottom: 31px;
			padding-bottom: 10px;
			.pictures {
				flex: 1;
				padding-top: 18px;
				padding-left: 20px;
				box-sizing: border-box;
				// 不可编辑时的图片展示区
				.display-img {
					width: 120px;
					height: 107px;
					margin-right: 10px;
					border-radius: 2px;
				}
			}
			// 可编辑时的图片添加区域
			.pictures /deep/ .el-upload--picture-card {
				border: 1px solid #ccc;
				background-color: #eee;
			}
		}
		// 基本信息
		.basic-info {
			min-height: 323px;
			margin-bottom: 31px;
			.basic-table {
				padding-left: 20px;
				padding-top: 18px;
				.sn {
					margin-bottom: 10px;
				}
				.num-rent {
					display: flex;
					.device-sn {
						display: flex;
						.start-label {
							width: 80px;
							.red-start {
								margin-right: 0;
								&+span {
									margin-right: 0;
								}
							}
						}
						.input-list {
							width: 100%;
							.sn-table {
								background: #f5f7fa;
								border: 1px solid #ddd;
								border-radius: 5px;
								color: #c0c4cc;
								span {
									margin-right: 0;
								}
								.table-head {
									width: 100%;
									display: flex;
									align-items: center;
									margin-bottom: 0;
									span+span {
										border-left: 1px solid #ddd;
									}
									span {
										flex: 1;
										display: flex;
										justify-content: center;
									}
									span:nth-child(2) {
										flex: 4;
									}
								}
								.table-content {
									width: 100%;
									margin-bottom: 0;
									border-top: 1px solid #ddd;
									.sn-row {
										display: flex;
										margin-bottom: 0;
										.sn {
											flex: 1;
											// background: tomato;
											align-self: center;
											display: flex;
											justify-content: center;
											margin-bottom: 0;
											/deep/ .el-input__inner {
												border: none;
												width: 100%;
												text-align: center;
											}
										}
										.detail {
											flex: 4;
											border-left: 1px solid #ddd;
											// background: #789987;
											margin-bottom: 0;
											.no-order {
												height: 100%;
												display: flex;
												justify-content: center;
												align-items: center;
											}
											.order-row {
												display: flex;
												margin-bottom: 0;
												border-bottom: 1px solid #ddd;
												p {
													flex: 1;
													display: flex;
													align-items: center;
													justify-content: center;
													border-right: 1px solid #ddd;
												}
												p:last-child {
													border: none;
													flex: 0.5;
													color: rgb(58, 127, 159);
													cursor: pointer;
												}
												.use-time {
													flex: 1.8;
													span:nth-child(3) {
														text-align: center;
													}
												}
											}
											.order-row:last-child {
												border-bottom: none;
											}
										}
										.sn-del {
											border-left: 1px solid #ddd;
											flex: 1;
											margin-bottom: 0;
											display: flex;
											justify-content: center;
											align-items: center;
											cursor: pointer;
											background: #fff;
											color: #606266;
										}
									}
									.sn-row+.sn-row {
										border-top: 1px solid #ddd;
									}
								}
							}
						}
						span {
							min-width: 57px;
							height: 38px;
							line-height: 38px;
							margin-right: 10px;
						}
						div {
							margin-bottom: 20px;
							.input-sn {
								margin-bottom: 3px;
							}
						}
					}
				}
				.sn-condition {
					display: flex;
					align-items: center;
					margin-bottom: 20px;
					.device-sn {
						display: flex;
						// width: fit-content;
						// min-width: 800px;
						// width: 80%;
						width: 600px;
						.start-label {
							// width: 80px;
							text-align: right;
							width: 120px;
							margin-right: 10px;
							.red-start {
								margin-right: 0;
								&+span {
									margin-right: 0;
								}
							}
						}
						.input-list {
							width: 100%;
							.sn-table {
								background: #f5f7fa;
								border: 1px solid #ddd;
								border-radius: 5px;
								color: #c0c4cc;
								span {
									margin-right: 0;
								}
								.table-head {
									width: 100%;
									display: flex;
									align-items: center;
									margin-bottom: 0;
									span+span {
										border-left: 1px solid #ddd;
									}
									span {
										flex: 1;
										display: flex;
										justify-content: center;
									}
									span:first-child {
										flex: 1.5;
									}
									span:nth-child(3) {
										flex: 4;
									}
								}
								.table-content {
									width: 100%;
									margin-bottom: 0;
									border-top: 1px solid #ddd;
									.sn-row {
										display: flex;
										margin-bottom: 0;
										.sn {
											flex: 1.5;
											// background: tomato;
											align-self: center;
											display: flex;
											justify-content: center;
											margin-bottom: 0;
											/deep/ .el-input__inner {
												border: none;
												width: 100%;
												text-align: center;
											}
										}
										.condition {
											flex: 1;
											height: 46px;
											border-left: 1px solid #ddd;
											align-self: center;
											display: flex;
											justify-content: center;
											align-items: center;
											margin-bottom: 0;
											/deep/ {
												.el-input {
													width: 100%;
													.el-input__inner {
														border: none;
													}
												}
											}
										}
										.detail {
											flex: 4;
											border-left: 1px solid #ddd;
											// background: #789987;
											margin-bottom: 0;
											.no-order {
												height: 100%;
												display: flex;
												justify-content: center;
												align-items: center;
											}
											.order-row {
												display: flex;
												margin-bottom: 0;
												border-bottom: 1px solid #ddd;
												p {
													flex: 1;
													display: flex;
													align-items: center;
													justify-content: center;
													border-right: 1px solid #ddd;
												}
												p:last-child {
													border: none;
													flex: 0.5;
													color: rgb(58, 127, 159);
													cursor: pointer;
												}
												.use-time {
													flex: 1.8;
													span:nth-child(3) {
														text-align: center;
													}
												}
											}
											.order-row:last-child {
												border-bottom: none;
											}
										}
										.sn-del {
											border-left: 1px solid #ddd;
											flex: 1;
											margin-bottom: 0;
											display: flex;
											justify-content: center;
											align-items: center;
											cursor: pointer;
											background: #fff;
											color: #606266;
										}
									}
									.sn-row+.sn-row {
										border-top: 1px solid #ddd;
									}
								}
							}
						}
						span {
							min-width: 57px;
							height: 38px;
							line-height: 38px;
							margin-right: 10px;
						}
						div {
							.input-sn {
								margin-bottom: 3px;
							}
						}
					}
					.device-show-table {
						width: 80%;
					}
					.device-condition {
						display: flex;
						align-items: center;
						.start-label {
							align-self: flex-start;
							width: 80px;
							padding-top: 8px;
							.red-start {
								margin-right: 0;
								&+span {
									margin-right: 0;
								}
							}
						}
						.condition-group {
							display: flex;
							flex-direction: column;
							.el-select+.el-select {
								margin-top: 3px;
							}
						}
					}
				}
			}
		}
		.num-rent /deep/ .el-col-8 {
			width: 100%;
		}
		.basic-table /deep/ .has-nodevice {
			margin-bottom: 30px;
		}
		.basic-table /deep/ .el-row:nth-child(2) .nodevice-tip {
			// color: #e9b53b;
			color: #7c6aff;
			padding-left: 65px;
			cursor: pointer;
			margin-bottom: 30px;
		}
		.basic-table /deep/ .el-form-item__content {
			display: flex;
		}
		.basic-table /deep/ .num-control .el-input__inner {
			width: 180px;
		}
		// 具体收费
		.charge {
			margin-bottom: 31px;
			.title {
				margin-bottom: 18px;
			}
			.charge-title {
				display: flex;
				justify-content: space-between;
				padding: 0 20px;
				margin-bottom: 10px;
				.add-more {
					color: #7c6aff;
					cursor: pointer;
				}
				.add-more:active {
					background-color: #7c6aff;
					border-color: #7c6aff;
					color: #fff;
				}
			}
			.charge-table {
				margin: 0 20px;
				margin-bottom: 30px;
				border: 1px solid rgb(204, 204, 204);
				border-radius: 2px;
				color: #333;
				.table-head {
					height: 38px;
					background: rgb(245, 248, 254);
					display: flex;
					align-items: center;
					.center {
						flex: 7;
						display: flex;
						span {
							flex: 1;
							text-align: center;
						}
					}
					span:first-child,
					span:last-child {
						text-align: center;
						// width: 160px;
						flex: 1;
					}
				}
				.charge-item {
					// height: 118px;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #eee;
					.using-time {
						// width: 160px;
						flex: 1;
						text-align: center;
						display: flex;
						justify-content: center;
						.day {
							width: 90px;
							height: 40px;
							line-height: 40px;
							border: 1px solid #eee;
							border-radius: 4px;
						}
					}
					.charge-row {
						height: 100%;
						flex: 7;
						text-align: center;
						.row-item {
							height: 50%;
							display: flex;
							align-items: center;
							border-bottom: 1px solid #eee;
							div {
								flex: 1;
								padding: 5px 10px;
								box-sizing: border-box;
								.el-input {
									width: 100%;
									// background: pink;
									height: 100%;
									line-height: 50px;
									div {
										// margin-right:10px;
									}
								}
								.day-input {
									// background: gold;
									width: 50%;
									height: 50%;
								}
							}
						}
						.row-item:last-child {
							border-bottom: none;
						}
					}
					.operation {
						// width: 160px;
						flex: 1;
						text-align: center;
						.del-btn {
							background: #7c6aff;
							color: #fff;
							cursor: pointer;
						}
					}
				}
				.charge-item:last-child {
					border-bottom: none;
				}
				.no-item {
					height: 60px;
					color: #909399;
					text-align: center;
					line-height: 60px;
				}
			}
		}
		// 视频及描述
		.video-dec {
			margin-bottom: 21px;
			// 标题
			// 视频及描述外层
			.video-wrap {
				margin-top: 18px;
				padding-left: 20px;
				// 视频
				.video {
					margin-bottom: 20px;
					border-radius: 2px;
				}
				// 添加视频
				.add-video {
					margin-bottom: 20px;
					width: 604px;
					height: 302px;
					background: rgb(238, 238, 238);
					border: 1px solid rgb(204, 204, 204);
					border-radius: 2px;
					color: #666;
					cursor: pointer;
					.center {
						width: 90px;
						margin: 0 auto;
						height: 100%;
						display: flex;
						flex-direction: column;
						text-align: center;
						justify-content: center;
						.el-icon-video-play {
							font-size: 68px;
							margin-bottom: 22px;
						}
					}
				}
				// 添加视频成功后
				.show-video {
					margin-bottom: 20px;
					outline: none;
				}
				// 提示
				.tip {
					margin-bottom: 20px;
					color: #7c6aff;
				}
				// 删除视频按钮
				.del-video {
					margin-bottom: 20px;
					background: #7c6aff;
					border-radius: 4px;
					color: #fff;
					border: none;
				}
				.del-video:active {
					background-color: #255368;
					border-color: #255368;
				}
				// 显示描述
				.text-show {
					padding-left: 20px;
					padding-top: 10px;
					background: rgb(238, 238, 238);
					border-radius: 2px;
					min-height: 120px;
				}
			}
		}
	}
	
	//反馈新增设备弹框
	.box /deep/ .el-dialog__body {
		padding: 30px 60px;
	}
	
	.box /deep/ .el-dialog__footer {
		padding: 30px 60px;
		border-top: 1px solid rgb(238, 238, 238);
	}
	
	.box /deep/ .el-dialog /deep/ .el-form-item {
		display: flex;
	}
	
	.box /deep/ .el-dialog /deep/ .first-line {
		display: flex;
	}
	
	.box /deep/ .first-line /deep/ .el-form-item {
		margin-right: 50px;
		width: 50%;
		display: flex;
	}
	
	.box /deep/ .el-form-item /deep/ .el-input__inner:focus {
		border: 1px solid #dcdfe6;
	}
	
	.box /deep/ .el-form-item /deep/ .el-textarea__inner:focus {
		border: 1px solid #dcdfe6;
	}
	
	.box /deep/ .el-form-item /deep/ .el-textarea__inner {
		height: 90px;
	}
	
	.box /deep/ .el-form-item /deep/ .el-form-item__content {
		width: 100%;
	}
	
	.box /deep/ .el-form-item /deep/ .el-input__inner {
		width: 100%;
	}
	
	.box /deep/ .el-form-item /deep/ .el-form-item__label {
		width: 80px;
	}
	
	.box /deep/ .first-line /deep/ .el-form-item:first-child {
		padding-left: 5px;
	}
	
	.box /deep/ .first-line /deep/ .el-form-item:last-child {
		margin-right: 0;
	}
	
	@media screen and (max-width: 1615px) {
		/deep/ .el-card__body {
			// background-color:lightblue;
			// .table-head{
			//   span:first-child,span:last-child{
			//   }
			//   .center{
			//   }
			// }
			.charge-item {
				.using-time {
					// background: pink;
					flex: 0.5;
				}
				.charge-row {
					.row-item {
						div {
							// min-width: 120px!important;
							padding: 5px 5px !important;
							/deep/ {
								.el-input__inner {
									padding-left: 5px;
								}
							}
						}
					}
				}
				.operation {
					flex: 0.5;
				}
			}
		}
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
			margin-bottom: 35px;
		}
	}
	
	.sn-input {
		display: flex;
		flex-direction: column;
	}
	
	/deep/ {
		.selectHour {
			.el-input {
				width: 90px !important;
			}
		}
	}
	
	/deep/.el-form-item__label {
		width: 105px;
	}
</style>