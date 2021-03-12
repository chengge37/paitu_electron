<template>
	<div class="app-container">
		<div class="left">
			<div class="number">
				<span class="todo-num">{{agencyArr.length}} 个待办</span>
			</div>

			<div class="search-time">
				<div class="search">
					<el-input v-model="searchText" placeholder="请输入工作名称"></el-input>
					<span class="search-btn" @click="searchAgency">搜索</span>
				</div>
				<div class="time">
					<span class="time-label">日期：</span>
					<el-date-picker @change="getTimeAgency" v-model="time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</div>
			</div>

			<div class="add">
				<el-button class="btn" @click="openAgency" v-permission>{{'+ 添加待办'}}</el-button>
				<el-radio-group v-model="radio" @change="selectOwnAll">
					<el-radio label="1">自己</el-radio>
					<el-radio label="0">全部</el-radio>
				</el-radio-group>

				<!-- 新增待办 -->
				<div class="agency-box-wrap" v-if="showAgency">
					<div class="agency-box">
						<el-input class="title-input" v-model="inputTitle" placeholder="请输入标题 ..."></el-input>
						<div class="creator-info">
							<div class="avatar">
								<img :onerror="util.maleAvatar" :src="$qiniuHost+user_data.avatar" alt />
							</div>
							<span class="name">{{user_data.nick}}</span>
						</div>
						<div class="system-set">
							<div class="first-row">
								<ali-svg-icon icon-class="youxianji" class-name="icon"></ali-svg-icon>

								<span>优先级</span>
								<el-select :class="{'status-important':addType==2,'status-urgent':addType==3}" class="default-hover" v-model="addType" placeholder="请选择">
									<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</div>
							<div class="second-row">
								<ali-svg-icon icon-class="strattime" class-name="icon"></ali-svg-icon>

								<span>开始时间</span>
								<el-date-picker v-model="addStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="changeAddStart"></el-date-picker>
							</div>
							<div class="second-row">
								<ali-svg-icon icon-class="endtime" class-name="icon"></ali-svg-icon>

								<span>截止时间</span>
								<el-date-picker v-model="addEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="changeAddEnd"></el-date-picker>
							</div>
							<div class="third-row">
								<ali-svg-icon icon-class="zhuangtai" class-name="icon"></ali-svg-icon>

								<span>状态</span>
								<el-select v-model="addStatus" placeholder="选择">
									<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</div>
							<div class="fouth-row">
								<ali-svg-icon icon-class="gerenziliao" class-name="icon"></ali-svg-icon>
								<span>执行人</span>
								<div class="select-box" v-if="showSelectBox1">
									<div class="box-title">
										<span>请选择员工</span>
										<i class="el-icon-close" @click="closeSelectBox(1)"></i>
									</div>
									<el-cascader :options="menberOptions" @change="selectMenbers" v-model="checkArr" :props="props" clearable></el-cascader>
									<div class="box-bottom">
										<span class="default-hover" @click="confirmSelect(1)">确定</span>
										<span class="default-hover" @click="closeSelectBox(1)">取消</span>
									</div>
								</div>
								<i class="el-icon-circle-plus-outline default-hover" @click="openSelectBox(1)"></i>
								<div class="menber-list">
									<span :title="item" class="menber" v-for="(item,index) in checkedNames" :key="index">{{item[0]}}</span>
								</div>
							</div>
						</div>
						<el-input class="dec" type="textarea" resize="none" :rows="2" placeholder="请输入内容" v-model="addDec"></el-input>
						<div class="warn-type">
							<p>通知方式</p>
							<div class="type">
								<el-checkbox-group v-model="warnType" @change="selectWarn">
									<el-checkbox label="1" value="1">短信</el-checkbox>
									<el-checkbox label="2" value="2">邮箱</el-checkbox>
									<!-- <el-checkbox label="3" value="3">站内信</el-checkbox> -->
								</el-checkbox-group>
							</div>
						</div>
						<div class="bottom-btn">
							<span class="default-hover" @click="confirmAdd">确 定</span>
							<span class="default-hover" @click="confirmAddContinue">确定并继续新增</span>
							<span class="default-hover" @click="closeAgency">取 消</span>
						</div>
					</div>
				</div>
			</div>

			<div class="todo-list new-scroll">
				<div class="todo-row" :class="{active:currentIndex==index}" v-for="(item,index) in agencyArr" :key="index" @click="selectAgency(item,index)">
					<i class="el-icon-circle-check" :class="{'tick':item.status==3}" @click.stop="fastChangeStatus(item)"></i>
					<div class="title-menber">
						<p class="title">{{item.name}}</p>
						<p class="menber">
							<span v-if="item.employee_array.length==1">{{item.employee_array[0].id==user_data.id?'自己':item.employee_name_array.split(',')[0]}}</span>
							<span v-else>{{item.employee_name_array.split(',')[0]+','+item.employee_name_array.split(',')[1]}}等{{item.employee_array.length}}人参与</span>
						</p>
					</div>
					<div class="status-time">
						<div class="status-row">
							<span class="time-out" v-if="Date.parse(new Date())>Date.parse(new Date(item.end_time))">已逾期，请尽快处理</span>
							<span class="pointer-menber" v-if="item.employee_array.length>1">多人</span>
							<span class="pointer-menber" v-if="item.employee_array.length>1&&item.includeOwn">自己</span>
							<span class="pointer-menber" v-if="item.employee_array.length==1&&item.employee_array[0].id==user_data.id">自己</span>
							<span class="status" :class="{'status-important':item.type==2,'status-urgent':item.type==3}">{{dealType(item.type)}}</span>
						</div>
						<div class="create-time">创建于：{{item.create_time | time2FullDate }}</div>
					</div>
				</div>
				<div class="no-data" v-if="showNoData&&agencyArr.length==0">暂无工作</div>
			</div>
		</div>
		<div class="right" v-if="agencyArr.length!=0">
			<div class="input-system">
				<div class="system-head">
					<div class="title-list">
						<el-input v-model="detail.name" :disabled="detail.cid!=user_data.cid||!hasRole"></el-input>
						<!-- <span class="main-title">{{detail.name}}</span> -->
						<span class="move-btn" @click="openMove">动态列表</span>
						<div class="move-list-wrap" v-if="showMove">
							<div class="move-list">
								<div class="list-title">
									<span>动态列表</span>
									<i class="el-icon-close" @click="closeMove"></i>
								</div>
								<div class="item-row-wrap new-scroll" ref="moveList">
									<div class="item-row" v-for="(item,index) in operationArr" :key="index">
										<div>{{item.con}}</div>
										<div class="thing-time">{{item.create_time | time2FullDate}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="who-create">
						<div class="avatar"></div>
						<span>{{detail.c_name}}</span>
						<span>创建于</span>
						<span>{{detail.create_time | time2FullDate}}</span>
					</div>
				</div>
				<div class="system-set">
					<div class="first-row">
						<span class="icon"></span>
						<span>优先级</span>
						<el-select class="default-hover" :disabled="detail.cid!=user_data.cid||!hasRole" :class="{'status-important':editType==2,'status-urgent':editType==3}" v-model="editType" placeholder="请选择">
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="second-row">
						<span class="icon"></span>
						<span>开始时间</span>
						<el-date-picker :disabled="detail.cid!=user_data.cid||!hasRole" v-model="editStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="changeEditStart"></el-date-picker>
					</div>
					<div class="second-row">
						<span class="icon"></span>
						<span>截止时间</span>
						<el-date-picker :disabled="detail.cid!=user_data.cid||!hasRole" v-model="editEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="changeEditEnd"></el-date-picker>
					</div>
					<div class="third-row">
						<span class="icon"></span>
						<span>状态</span>
						<el-select v-model="editStatus" placeholder="选择" :disabled="!canSelectStatus||!hasRole">
							<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="fouth-row">
						<span class="icon"></span>
						<span>执行人</span>
						<div class="select-box-wrap" v-if="showSelectBox2">
							<div class="select-box">
								<div class="box-title">
									<span>请选择员工</span>
									<i class="el-icon-close" @click="closeSelectBox(2)"></i>
								</div>
								<el-cascader :options="menberOptions" :props="props" v-model="editCheckArr" clearable></el-cascader>
								<div class="box-bottom">
									<span class="default-hover" @click="confirmSelect2()">确定</span>
									<span class="default-hover" @click="closeSelectBox2()">取消</span>
								</div>
							</div>
						</div>
						<i v-if="detail.cid==user_data.cid" class="el-icon-circle-plus-outline default-hover" @click="openSelectBox(2,checkedIds)"></i>
						<div class="menber-list">
							<span :title="item" class="menber" v-for="(item,index) in editCheckedNames" :key="index">{{item[0]}}</span>
						</div>
					</div>
				</div>
				<el-input :disabled="detail.cid!=user_data.cid||!hasRole" class="system-dec new-scroll" type="textarea" resize="none" :rows="2" placeholder="请输入内容" v-model="editDec"></el-input>
				<div class="warn-type">
					<p>通知方式</p>
					<div class="type">
						<el-checkbox-group v-model="editWarnType" :disabled="detail.cid!=user_data.cid||!hasRole">
							<el-checkbox label="1" value="1">短信</el-checkbox>
							<el-checkbox label="2" value="2">邮箱</el-checkbox>
							<!-- <el-checkbox label="3" value="3">站内信</el-checkbox> -->
						</el-checkbox-group>
					</div>
				</div>
				<div class="bottom-btn">
					<!-- v-if="!(detail.cid!=user_data.cid||!hasRole)" -->
					<span v-if="canSelectStatus&&hasRole" class="default-hover" @click="editAgency(detail.id,editStartTime,editEndTime,editDec,detail.name,checkedIds,editStatus,editType,editWarnType)">确 定</span>
					<span v-if="canSelectStatus&&hasRole" class="default-hover" @click="cancel">取 消</span>
					<span v-if="canSelectStatus&&hasRole" class="default-hover" @click="delAgency(detail.id)">删 除</span>
				</div>
			</div>
			<div class="message">
				<div class="message-head">留言</div>
				<div class="message-box-wrap new-scroll">
					<div class="message-box">
						<parent-tree :list="msgArr"></parent-tree>
					</div>
				</div>
				<div class="leave-msg">
					<el-input resize="none" type="textarea" :rows="2" placeholder="说点什么 ..." v-model="inputText"></el-input>
				</div>
				<div class="bottom-btn">
					<span class="default-hover" @click="replyMsg(detail.id,0,inputText)">确 定</span>
					<span class="default-hover" @click="cancelReply">取 消</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { worklist, employee } from "@config/api.js";
	import { mapGetters } from "vuex";
	import parentTree from "./msgTree";

	export default {
		data() {
			return {
				hasRole: "",
				agencyArr: [],
				agencyArrCopy: [],
				time: "",
				options1: [{
						value: "1",
						label: "一般"
					},
					{
						value: "2",
						label: "重要"
					},
					{
						value: "3",
						label: "紧急"
					}
				],
				options2: [{
						value: "1",
						label: "待办"
					},
					{
						value: "3",
						label: "结办"
					}
				],
				props: {
					multiple: true
				},
				menberOptions: [],
				showSelectBox1: false,
				showSelectBox2: false,
				warnList: [],
				inputText: "",
				reply: [],
				showMove: false,
				radio: "0",
				inputTitle: "",
				dec: "",
				showAgency: false,
				addType: "1",
				addStartTime: "",
				addEndTime: "",
				addStatus: "1",
				checkedMenbers: [],
				checkArr: [],
				checkArr2: [],
				addDec: "",
				//默认站内信
				warnType: [3],
				checkedNames: [],
				checkedIds: "",
				currentIndex: 0,
				detail: {
					cid: "",
					create_time: "",
					edit_time: null,
					employee_array: [],
					employee_name_array: "",
					end_time: "",
					id: "",
					name: "",
					notice_way: "",
					remark: "",
					start_time: "",
					status: "",
					type: ""
				},
				editType: "",
				editStartTime: "",
				editEndTime: "",
				editStatus: "",
				editDec: "",
				//默认站内信
				editWarnType: [3],
				editCheckedMenbers: [],
				editCheckArr: [],
				editCheckArr2: [],
				editCheckedNames: [],
				isAll: "0",
				st: "",
				et: "",
				canSelectStatus: true,
				operationArr: [],
				msgArr: [],
				replyIndex: -1,
				replyContent: "",
				newMsgArr: [],
				loopNum: 0,
				cArr: [],
				movePage: 1,
				searchText: "",
				showNoData: false,
				operationCount: 0
			};
		},
		components: {
			parentTree
		},
		created() {
			this.getAgency(1, 999, undefined, undefined, 0, undefined, 0);
			this.getMember();
		},
		mounted() {
			this.hasRole = this.myGetRole();
			console.log(this.hasRole, "有没有权限");
		},
		computed: {
			...mapGetters(["user_data", "msg_arr"])
		},
		watch: {
			msg_arr(val) {
				let arr = [];
				for(var key in val) {
					arr.push(val[key]);
				}
				this.msgArr = [...arr];
				this.msgArr.forEach((item, index) => {
					item.flag = index + 1;
					if(item.children) {
						this.loopArr(item.children, item.flag);
					} else {
						return;
					}
				});
			}
		},
		methods: {
			//判断是否有操作权限
			myGetRole() {
				return this.util.getRole(this);
			},
			// 新增待办时选择开始时间
			changeAddStart() {
				if(
					Date.parse(new Date(this.addStartTime)) >
					Date.parse(new Date(this.addEndTime))
				) {
					this.$message.error("结束时间不能在开始时间之前");
					this.addStartTime = "";
				}
			},
			// 新增待办时选择结束时间
			changeAddEnd() {
				if(
					Date.parse(new Date(this.addStartTime)) >
					Date.parse(new Date(this.addEndTime))
				) {
					this.$message.error("结束时间不能在开始时间之前");
					this.addEndTime = "";
				}
			},
			// 编辑待办时选择开始时间
			changeEditStart() {
				if(
					Date.parse(new Date(this.editStartTime)) >
					Date.parse(new Date(this.editEndTime))
				) {
					this.$message.error("结束时间不能在开始时间之前");
					this.editStartTime = "";
				}
			},
			// 编辑待办时选择结束时间
			changeEditEnd() {
				if(
					Date.parse(new Date(this.editStartTime)) >
					Date.parse(new Date(this.editEndTime))
				) {
					this.$message.error("结束时间不能在开始时间之前");
					this.editEndTime = "";
				}
			},
			// 查找待办
			searchAgency() {
				this.getAgency(1, 999, undefined, undefined, 0, this.searchText, 0);
			},
			// 动态list滚动到底部，加载更多
			listBottom() {
				if(
					this.$refs.moveList.scrollTop + this.$refs.moveList.offsetHeight ==
					this.$refs.moveList.scrollHeight
				) {
					console.log('???', this.operationCount, this.movePage);
					if(this.movePage > Math.ceil(this.operationCount / 9)) {
						return;
					}
					this.movePage++;
					this.getOperation(this.movePage, 9, this.detail.id, 1);
				}
			},
			// 打开选择员工的弹框
			openSelectBox(val, arr) {
				if(val == 2) {
					let newArr = arr.indexOf(",") == -1 ? [arr] : arr.split(",");
					newArr.forEach((agency, i) => {
						this.menberOptions.forEach((option, j) => {
							option.children.forEach((child, k) => {
								if(child.value == agency) {
									this.editCheckArr.push([option.value, child.value]);
								}
							});
						});
					});
				}
				this["showSelectBox" + val] = true;
			},

			// 选择员工
			selectMenbers(val) {

			},
			// 新增待办选择员工时候点击确定
			confirmSelect(i) {
				this["showSelectBox" + i] = false;
				this.checkedMenbers = [];
				this.checkedNames = [];
				let checkedIds = [];
				this.checkArr2 = [...this.checkArr];
				this.checkArr2.forEach(item => {
					this.checkedMenbers.push(item[1]);
					this.menberOptions.forEach(each => {
						if(each.value == item[0]) {
							each.children.forEach(every => {
								if(every.value == item[1]) {
									this.checkedNames.push(every.label);
									checkedIds.push(every.value);
								}
							});
							this.checkedIds =
								checkedIds.length > 1 ?
								checkedIds.join() :
								checkedIds[0];
							console.warn(
								this.checkedNames,
								"选择的员工名称",
								this.checkedMenbers,
								"初始员工数组"
							);
						}
					});
				});
			},
			// 右边编辑待办部分确定选择的员工
			confirmSelect2() {
				console.warn(this.editCheckArr, "已经选择的员工");
				this.showSelectBox2 = false;
				this.editCheckedMenbers = [];
				this.editCheckedNames = [];
				let checkedIds = [];
				this.editCheckArr2 = [...this.editCheckArr];
				if(this.editCheckArr2.length != 0) {
					this.editCheckArr2.forEach(item => {
						this.editCheckedMenbers.push(item[1]);
						this.menberOptions.forEach(each => {
							if(each.value == item[0]) {
								each.children.forEach(every => {
									if(every.value == item[1]) {
										this.editCheckedNames.push(every.label);
										checkedIds.push(every.value);
									}
								});
								this.checkedIds =
									checkedIds.length > 1 ? checkedIds.join() : checkedIds[0];
								console.warn(
									this.editCheckedNames,
									"123",
									this.menberOptions,
									"456"
								);
							}
						});
					});
				} else {
					this.checkedIds = "";
				}
				console.warn(this.checkedIds, ";;;;;;;;");
			},
			// 关闭选择员工的弹框
			closeSelectBox(val) {
				this["showSelectBox" + val] = false;
				if(this.checkedMenbers.length == 0) {
					this.checkArr = [];
				} else {
					this.checkArr = [...this.checkArr2];
				}
			},
			// 右侧关闭选择员工的弹框
			closeSelectBox2(val) {
				this.showSelectBox2 = false;
				if(this.editCheckedMenbers.length == 0) {
					this.editCheckArr = [];
				} else {
					this.editCheckArr = [...this.editCheckArr2];
				}
			},
			// 打开动态操作弹框
			openMove() {
				if(this.showMove) {
					return;
				}
				this.showMove = true;
				this.$nextTick(() => {
					this.$refs.moveList.addEventListener("scroll", this.listBottom);
				});
				this.getOperation(1, 9, this.detail.id, 0);
			},
			// 关闭动态操作弹框
			closeMove() {
				this.showMove = false;
				this.movePage = 1
			},
			// 获取所有待办
			getAgency(page, page_size, start_time, end_time, is_all, search, i) {
				this.getRequest(worklist.agency, {
						page,
						page_size,
						start_time,
						end_time,
						is_all,
						search
					})
					.then(res => {
						this.agencyArr = [...res.rows];
						this.showNoData = true;
						// 判断指派超过一人的工作里面的指派人员是否包含自己
						this.agencyArr.forEach(item => {
							item.includeOwn = item.employee_array.some(each => {
								return each.id == this.user_data.id;
							});
						});
						this.agencyArrCopy = [...this.agencyArr];
						this.selectAgency(this.agencyArr[i], i);
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 选择自己或全部
			selectOwnAll(val) {
				this.isAll = val;
				this.getAgency(1, 999, this.st, this.et, this.isAll, this.searchText, 0);
			},
			// 根据日期筛选待办
			getTimeAgency(val) {
				if(val) {
					this.st = val + " 00:00:00";
					this.et = val + " 23:59:59";
				} else {
					this.st = "";
					this.et = "";
				}
				this.getAgency(1, 999, this.st, this.et, this.isAll, this.searchText, 0);
			},
			// 选择某一个待办事项
			selectAgency(item, index) {
				console.warn(this.user_data, this.detail.uid, "haaaaaa");
				this.currentIndex = index;
				this.getDetail(item.id);
				this.getMsg(item.id);
			},
			// 根据待办事项id获取相应的工作详情
			getDetail(id) {
				this.getRequest(worklist.getDetail, {
						id
					})
					.then(res => {
						console.warn(res, "88", this.user_data.cid, "登陆人的id");
						this.detail = res;
						this.editType = this.detail.type;
						this.editStartTime = this.detail.start_time;
						this.editEndTime = this.detail.end_time;
						this.editStatus = this.detail.status;
						this.editDec = this.detail.remark;
						this.editWarnType =
							this.detail.notice_way.indexOf(",") != -1 ?
							this.detail.notice_way.split(",") : [this.detail.notice_way];
						this.checkedIds = this.detail.employee_array;
						this.editCheckArr = [];
						let arr =
							this.detail.employee_array.indexOf(",") != -1 ?
							this.detail.employee_array.split(",") : [this.detail.employee_array];
						this.editCheckArr = [...arr];
						if(res.employee_array) {
							this.editCheckedNames =
								res.employee_name_array.indexOf(",") == -1 ? [res.employee_name_array] :
								res.employee_name_array.split(",");
						} else {
							this.editCheckedNames = [];
						}
						//判断是否有权限可以操作状态待办结办的改变 ,只有创建者和执行者有权限
						let inArray = arr.some(item => {
							return item == this.user_data.cid;
						});
						this.canSelectStatus =
							this.detail.cid == this.user_data.cid || inArray;
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 打开待办
			openAgency() {
				// this.fillSelf()
				this.warnType = [3];
				this.addStatus = '1'
				this.showAgency = true;
			},
			// 关闭待办
			closeAgency() {
				this.showAgency = false;
			},
			//异步函数
			async getMember() {
				this.menberOptions = [];
				let groups = await this.getRequest(employee.getGroup);
				let promiseArr = [];
				for(let i = 0; i < groups.length; i++) {
					let obj = {
						value: groups[i].group_id,
						label: groups[i].group_name,
						children: []
					};
					this.menberOptions.push(obj);
					promiseArr.push(
						this.getRequest(employee.getAll, {
							page: 1,
							page_size: 9999,
							group_id: groups[i].group_id
						})
					);
				}
				Promise.all(promiseArr).then(res => {
					for(let j = 0; j < res.length; j++) {
						res[j].rows.forEach(item => {
							let obj = {
								value: item.id,
								label: item.nick,
								mobile: item.mobile
							};
							this.menberOptions[j].children.push(obj);
						});
					}
					this.fillSelf();
				});
			},
			//填充管理员
			fillSelf() {
				//之后填充管理员进去
				console.log("之后填充管理员进去", this.menberOptions[7]);
				this.menberOptions.forEach((item, index) => {
					if(item.children[0]) {
						// console.log(item.children[0],typeof item.children);
						console.log(item);
						if(item.children[0].mobile == this.user_data.mobile) {
							console.log(2);
							this.checkArr.push([item.value, item.children[0].value]);
							console.log(this.checkArr, "[]kkkk");
							this.confirmSelect(1);
						}
					}
				});
				console.log("哈哈哈");
			},
			// 获取员工分组
			getStaffGroup() {
				this.menberOptions = [];
				this.getRequest(employee.getGroup)
					.then(res => {
						res.forEach((item, index) => {
							let obj = {
								value: item.group_id,
								label: item.group_name,
								children: []
							};
							this.menberOptions.push(obj);
							this.getStaff(item.group_id, index);
						});
					})
					.catch(err => {
						console.error(err);
					});
				console.log(this.menberOptions, "看看数组");
			},
			// 根据员工分组获取员工
			getStaff(groupId, i) {
				this.getRequest(employee.getAll, {
						page: 1,
						page_size: 9999,
						group_id: groupId
					})
					.then(res => {
						// console.log(res, "------");
						res.rows.forEach((item, index) => {
							let obj = {
								value: item.id,
								label: item.nick,
								mobile: item.mobile
							};
							this.menberOptions[i].children.push(obj);
						});
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 选择通知方式
			selectWarn(val) {},
			// 新增待办点击确定按钮
			confirmAdd() {
				this.addAgency(
					this.addStartTime,
					this.addEndTime,
					this.addDec,
					this.inputTitle,
					this.checkedMenbers,
					this.addStatus,
					this.addType,
					this.warnType,
					0
				);
			},
			// 新增待办点击确定并继续添加按钮
			confirmAddContinue() {
				this.addAgency(
					this.addStartTime,
					this.addEndTime,
					this.addDec,
					this.inputTitle,
					this.checkedMenbers,
					this.addStatus,
					this.addType,
					this.warnType,
					1
				);
			},
			// 新增待办
			addAgency(
				start_time,
				end_time,
				remark,
				name,
				employee_id_array_str,
				status,
				type,
				notice_way,
				isContinue
			) {
				this.postRequest(worklist.add, {
						start_time,
						end_time,
						remark,
						name,
						employee_id_array_str: employee_id_array_str.join(),
						status,
						type,
						notice_way: notice_way.join()
					})
					.then(res => {
						this.$message.success("添加成功");
						this.addStartTime = "";
						this.addEndTime = "";
						this.addDec = "";
						this.inputTitle = "";
						this.checkedMenbers = [];
						this.addStatus = "";
						this.addType = "1";
						this.warnType = [];
						this.checkArr = [];
						this.checkedNames = [];
						if(isContinue == 0) {
							this.closeAgency();
						}
						this.getAgency(1, 999, undefined, undefined, 0, undefined, 0);
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 对优先级的处理
			dealType(val) {
				switch(val) {
					case "1":
						return "一般";
						break;
					case "2":
						return "重要";
						break;
					case "3":
						return "紧急";
						break;
				}
			},
			// 对待办事项状态的处理
			dealStatus(val) {
				switch(val) {
					// case '0':
					//   return '未开始'
					//   break
					case "1":
						return "待办";
						break;
						// case '2':
						//   return '处理'
						//   break
					case "3":
						return "结办";
						break;
				}
			},
			//快速更改待办结办状态
			fastChangeStatus(item) {
				let way =
					item.notice_way.indexOf(",") == -1 ? [item.notice_way] :
					item.notice_way.split(",");
				let arr = [];
				item.employee_array.forEach((item, index) => {
					arr.push(item.id);
				});
				if(item.status == 1) {
					this.editAgency(
						item.id,
						item.start_time,
						item.end_time,
						item.remark,
						item.name,
						arr,
						3,
						item.type,
						way
					);
				} else if(item.status == 3) {
					this.editAgency(
						item.id,
						item.start_time,
						item.end_time,
						item.remark,
						item.name,
						arr,
						1,
						item.type,
						way
					);
				}
			},
			// 编辑待办
			editAgency(
				id,
				start_time,
				end_time,
				remark,
				name,
				employee_id_array_str,
				status,
				type,
				notice_way
			) {
				if(!employee_id_array_str) {
					this.$message.error("请选择指派员工");
					return;
				}
				this.postRequest(worklist.editDetail, {
						id,
						start_time,
						end_time,
						remark,
						name,
						employee_id_array_str:employee_id_array_str.join(),
						status,
						type,
						notice_way: notice_way.length == 1 ? notice_way[0] : notice_way.join()
					})
					.then(res => {
						this.$message.success("修改成功");
						this.getAgency(
							1,
							999,
							this.st,
							this.et,
							this.isAll,
							undefined,
							this.currentIndex
						);
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 取消修改
			cancel() {
				if(!this.canSelectStatus) {
					this.$message.error("工作不属于你");
					return;
				}
				this.editType = this.detail.type;
				this.editStartTime = this.detail.start_time;
				this.editEndTime = this.detail.end_time;
				this.editStatus = this.detail.status;
				this.editDec = this.detail.remark;
				this.checkedIds = this.detail.employee_array;
				this.editWarnType =
					this.detail.notice_way.indexOf(",") != -1 ?
					this.detail.notice_way.split(",") : [this.detail.notice_way];
				this.editCheckArr = [];
				let arr =
					this.detail.employee_array.indexOf(",") != -1 ?
					this.detail.employee_array.split(",") : [this.detail.employee_array];
				arr.forEach((agency, i) => {
					this.menberOptions.forEach((option, j) => {
						option.children.forEach((child, k) => {
							if(child.value == agency) {
								this.editCheckArr.push([option.value, child.value]);
							}
						});
					});
				});
				this.confirmSelect2();
			},
			// 删除待办
			delAgency(id) {
				if(this.detail.cid != this.user_data.cid) {
					this.$message.error("工作不属于你");
					return;
				}
				this.$confirm("确定要删除该工作吗？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.postRequest(worklist.del, {
								id
							})
							.then(res => {
								this.$message.success("删除成功");
								this.getAgency(
									1,
									999,
									this.st,
									this.et,
									this.isAll,
									undefined,
									0
								);
							})
							.catch(err => {
								console.error(err);
							});
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 获取动态列表  flag=0与1
			getOperation(page, page_size, j_id, flag) {
				this.getRequest(worklist.getOperation, {
						page,
						page_size,
						j_id
					})
					.then(res => {
						console.warn(res, "lishi");
						if(!flag) {

							this.operationArr = [...res.rows];
						} else {

							this.operationArr = [...this.operationArr, ...res.rows];
						}
						this.operationCount = res.total_count;
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 获取工作的所有留言
			getMsg(j_id) {
				this.getRequest(worklist.getMsg, {
						j_id
					})
					.then(res => {
						this.$store.commit("SET_MSG_ARR", res);
						let arr = [];
						for(var key in res) {
							arr.push(res[key]);
						}
						this.msgArr = [...arr];
						this.msgArr.forEach((item, index) => {
							item.flag = index + 1;
							if(item.children) {
								this.loopArr(item.children, item.flag);
							} else {
								return;
							}
						});
						console.warn(this.msgArr, "新的数组");
						// this.findChildren(this.msgArr, this.newMsgArr);
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 递归留言数组
			loopArr(arr, parIndex) {
				arr.forEach((item, index) => {
					item.flag = parIndex + "-" + (index + 1);
					if(item.children) {
						this.loopArr(item.children, item.flag);
					} else {
						return;
					}
				});
			},
			// 添加或者回复留言
			replyMsg(j_id, pid, con) {
				if(!con) {
					this.$message.warning("内容不能为空");
					return;
				}
				this.postRequest(worklist.addMsg, {
						j_id,
						pid,
						con
					})
					.then(res => {
						this.$message.success("添加留言成功");
						if(pid == 0) {
							this.inputText = "";
						} else {
							this.replyContent = "";
						}
						this.getMsg(j_id);
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 点击回复出现回复框
			handleReply(i) {
				this.replyContent = "";
				console.log(i, "坐标");
				if(this.replyIndex == i) {
					this.replyIndex = -1;
					return;
				}
				this.replyIndex = i;
			},
			cancelReply() {
				this.inputText = "";
			},
			// 删除留言
			delMsg(id) {
				this.$confirm("确定要删除该留言吗？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.getRequest(worklist.delMsg, {
								id
							})
							.then(res => {
								this.$message.success("删除成功");
								this.getMsg(this.detail.id);
							})
							.catch(err => {
								console.error(err);
							});
					})
					.catch(err => {
						console.error(err);
					});
			}
		},
		filters: {}
	};
</script>

<style lang="scss" scoped>
	.app-container {
		padding: 0 0 20px;
		display: flex;
		height: 976px;
		.left {
			// width: 37%;
			flex: 1;
			margin-right: 10px;
			background: #fff;
			// padding: 0 20px;
			.number {
				height: 50px;
				display: flex;
				align-items: center;
				color: #333;
				padding: 0 20px;
				.todo-num {
					font-weight: 600;
					margin-right: auto;
				}
			}
			.search-time {
				padding: 0 20px;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20px;
				.search {
					width: 180px;
					display: flex;
					.search-btn {
						width: 60px;
						height: 100%;
						background: #7c6aff;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;
						cursor: pointer;
					}
					.search-btn:hover {
						box-shadow: 0px 2px 8px 0px rgba(124, 106, 255, 0.32);
					}
					.el-input {
						/deep/ {
							.el-input__inner {
								border-radius: 0;
								border-right: none;
							}
						}
					}
				}
				.time {
					.el-date-editor {
						width: 140px;
					}
				}
			}
			.add {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #f0f0f0;
				padding: 0 20px 20px;
				.btn {
					width: 95px;
					height: 34px;
					background: #7c6aff;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					margin-right: auto;
					cursor: pointer;
					padding: 0;
				}
				.btn:hover {
					box-shadow: 0px 2px 8px 0px rgba(124, 106, 255, 0.32);
				}
				.agency-box-wrap {
					position: fixed;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background: transparent;
					z-index: 999;
					.agency-box {
						position: absolute;
						top: 10%;
						left: 50%;
						transform: translateX(-50%);
						width: 1008px;
						height: 80%;
						background: #fff;
						box-shadow: 0 0 10px 5px #aaa;
						z-index: 999;
						padding: 20px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title-input {
							margin-bottom: 10px;
							/deep/ {
								.el-input__inner {
									border: none;
									padding: 0;
									color: #333;
									font-size: 18px;
									font-weight: 600;
									&::-webkit-input-placeholder {
										color: #333;
										font-size: 18px;
										font-weight: 600;
									}
								}
							}
						}
						.creator-info {
							display: flex;
							align-items: center;
							margin-bottom: 20px;
							.avatar {
								width: 20px;
								height: 20px;
								border-radius: 20px;
								margin-right: 10px;
								img {
									width: 20px;
									height: 20px;
									border-radius: 20px;
								}
							}
							.name {
								font-size: 12px;
								color: #999;
							}
						}
						.system-set {
							padding: 20px 0 10px;
							border: 1px solid #f0f0f0;
							border-left: none;
							border-right: none;
							color: #999;
							margin-bottom: 20px;
							.first-row,
							.second-row,
							.third-row,
							.fouth-row {
								display: flex;
								align-items: center;
								.icon {
									width: 20px;
									height: 20px;
									margin-right: 10px;
								}
								.icon+span {
									width: 60px;
									margin-right: 50px;
								}
							}
							.first-row {
								margin-bottom: 10px;
								.el-select {
									/deep/ {
										.el-input__suffix {
											display: none;
										}
										.el-input__inner {
											padding: 0;
											text-align: center;
											font-size: 11px;
											width: 42px;
											height: 22px;
											line-height: 18px;
											color: #fff;
											background: #17ce66;
											border: none;
											border-radius: 2px;
											&::-webkit-input-placeholder {
												color: #fff;
											}
										}
									}
								}
								.status-important {
									/deep/ {
										.el-input__inner {
											background: #ffba02;
										}
									}
								}
								.status-urgent {
									/deep/ {
										.el-input__inner {
											background: #ff6a6e;
										}
									}
								}
							}
							.second-row {
								margin-bottom: 10px;
								.el-date-editor {
									width: 170px;
									/deep/ {
										.el-input__prefix {
											display: none;
										}
										.el-input__inner {
											padding-left: 0;
											width: 170px;
											border: none;
											color: #666;
										}
									}
								}
							}
							.third-row {
								margin-bottom: 10px;
								.el-select {
									// width: 80px;
									/deep/ {
										.el-input__inner {
											width: 65px;
											padding-left: 0;
											border: none;
										}
										.el-icon-arrow-up,
										.el-icon-arrow-down {
											position: relative;
											top: 2px;
										}
									}
								}
							}
							.fouth-row {
								margin-bottom: 17px;
								.select-box {
									position: fixed;
									width: 500px;
									height: 500px;
									background: #fff;
									box-shadow: 0 0 10px 5px #aaa;
									display: flex;
									flex-direction: column;
									padding: 20px;
									padding-top: 0;
									color: #333;
									z-index: 1000;
									.box-title {
										width: 100%;
										height: 50px;
										display: flex;
										align-items: center;
										justify-content: space-between;
										font-size: 18px;
										margin-bottom: 30px;
										.el-icon-close {
											cursor: pointer;
										}
									}
									.box-bottom {
										text-align: right;
										margin-top: auto;
										span {
											padding: 5px 20px;
											background: #7c6aff;
											color: #fff;
											border-radius: 2px;
											cursor: pointer;
										}
										span:first-child {
											margin-right: 10px;
										}
									}
								}
								.el-icon-circle-plus-outline {
									font-size: 30px;
									cursor: pointer;
									margin-right: 10px;
								}
								.menber-list {
									display: flex;
									flex-wrap: wrap;
									.menber {
										width: 30px;
										height: 30px;
										border-radius: 50%;
										background: #7c6aff;
										color: #fff;
										display: flex;
										justify-content: center;
										align-items: center;
									}
									.menber+.menber {
										margin-left: 5px;
									}
								}
							}
							.fifth-row {
								font-size: 12px;
								text-align: right;
								span {
									cursor: pointer;
								}
								span:first-child {
									margin-right: 20px;
								}
							}
						}
						.dec {
							flex: 1;
							margin-bottom: 20px;
							/deep/ {
								.el-textarea__inner {
									height: 100%;
									border: none;
								}
							}
						}
						.warn-type {
							color: #999;
							padding-bottom: 10px;
							border-bottom: 1px solid #ebebeb;
							margin-bottom: 9px;
							&>p {
								margin-bottom: 15px;
							}
							.el-checkbox {
								/deep/ {
									.el-checkbox__inner {
										border-color: #00a4ff;
									}
									.el-checkbox__label {
										color: #999;
									}
								}
							}
						}
						.bottom-btn {
							display: flex;
							span {
								cursor: pointer;
								display: flex;
								justify-content: center;
								align-items: center;
							}
							span:first-child,
							span:nth-child(2) {
								width: 97px;
								height: 36px;
								background: #17ce66;
								color: #fff;
								font-weight: 500;
								margin-right: 10px;
							}
							span:nth-child(2) {
								width: 165px;
							}
							span:last-child {
								width: 60px;
								height: 36px;
								border: 1px solid #d9d9d9;
								color: #666;
							}
						}
					}
				}
			}
			.todo-list {
				overflow-y: auto;
				height: calc(100% - 163px);
				padding: 0 14px 0 20px;
				.todo-row {
					height: 70px;
					display: flex;
					// align-items: center;
					border-bottom: 1px solid #f0f0f0;
					padding: 10px 5px;
					cursor: pointer;
					.el-icon-circle-check {
						font-size: 28px;
						color: #ebebeb;
						margin-right: 10px;
					}
					.tick {
						color: #00a4ff;
					}
					.title-menber {
						display: flex;
						flex: 1;
						flex-direction: column;
						justify-content: space-between;
						// margin-right: auto;
						.title {
							font-size: 18px;
							color: #333;
						}
						.menber {
							flex: 1;
							padding-right: 5px;
							box-sizing: border-box;
							span {
								font-size: 12px;
								color: #999;
								display: inline-block;
								// width: 150px;
								// overflow: hidden;
								// white-space: nowrap;
								// text-overflow: ellipsis;
							}
						}
					}
					.status-time {
						display: flex;
						// width: 167px;
						flex-direction: column;
						justify-content: space-between;
						.status-row {
							text-align: right;
							.time-out {
								color: #ff6a6e;
								border: 1px solid #ff6a6e;
								padding: 2px 8px;
								font-size: 10px;
								border-radius: 2px;
								margin-right: 4px;
							}
							.pointer-menber {
								padding: 1px 7px;
								color: #7c6aff;
								border: 1px solid #7c6aff;
								font-size: 11px;
								border-radius: 2px;
								margin-right: 4px;
							}
							.status {
								padding: 1px 7px;
								color: #fff;
								font-size: 11px;
								background: #17ce66;
								border-radius: 2px;
							}
							.status-important {
								background: #ffba02;
							}
							.status-urgent {
								background: #ff6a6e;
							}
						}
						.create-time {
							font-size: 12px;
							color: #999;
							align-self: flex-end;
						}
					}
				}
				.active {
					background: #f0faff;
				}
				.no-data {
					margin-top: 200px;
					font-size: 30px;
					font-weight: bold;
					color: #999;
					text-align: center;
				}
			}
		}
		.right {
			// flex: 1;
			width: 63%;
			background: #fff;
			display: flex;
			.bottom-btn {
				display: flex;
				span {
					cursor: pointer;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				span:first-child {
					width: 97px;
					height: 36px;
					background: #17ce66;
					color: #fff;
					font-weight: 500;
					margin-right: 10px;
				}
				span:nth-child(2),
				span:nth-child(3) {
					width: 60px;
					height: 36px;
					border: 1px solid #d9d9d9;
					color: #666;
				}
				span:nth-child(2) {
					margin-right: auto;
				}
			}
			.input-system {
				width: 59.3%;
				height: 100%;
				border-right: 1px solid #ebebeb;
				padding: 0 20px 42px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.system-head {
					height: 95px;
					border-bottom: 1px solid #f0f0f0;
					padding: 20px 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.title-list {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.main-title {
							font-size: 18px;
							color: #333;
							font-weight: 600;
						}
						.move-btn {
							background: #7c6aff;
							color: #fff;
							padding: 2px 7px;
							border-radius: 2px;
							cursor: pointer;
						}
						.move-btn:hover {
							box-shadow: 0px 2px 8px 0px rgba(124, 106, 255, 0.32);
						}
						.move-list-wrap {
							position: fixed;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							background: transparent;
							z-index: 999;
							.move-list {
								width: 642px;
								height: 559px;
								background: #fff;
								position: absolute;
								top: 20%;
								left: 50%;
								padding: 20px 0;
								z-index: 999;
								box-shadow: 0 0 10px 5px #aaa;
								display: flex;
								flex-direction: column;
								.list-title {
									height: 30px;
									font-size: 18px;
									color: #333;
									font-weight: 600;
									margin-bottom: 20px;
									display: flex;
									justify-content: space-between;
									padding: 0 20px;
									i {
										cursor: pointer;
									}
								}
								.item-row-wrap {
									flex: 1;
									overflow-y: auto;
									width: calc(100% - 6px);
									padding: 0 14px 0 20px;
									.item-row {
										padding-bottom: 10px;
										border-bottom: 1px solid #f0f0f0;
										.thing1 {
											margin-bottom: 10px;
										}
										.thing-time {
											font-size: 10px;
										}
									}
									.item-row+.item-row {
										margin-top: 20px;
									}
								}
							}
						}
					}
					.title-list /deep/ .el-input {
						width: 60%;
					}
					.who-create {
						font-size: 12px;
						color: #999;
						margin-top: 7px;
					}
				}
				.system-set {
					padding: 20px 0 10px;
					border-bottom: 1px solid #f0f0f0;
					color: #999;
					.first-row,
					.second-row,
					.third-row,
					.fouth-row {
						display: flex;
						align-items: center;
						.icon {
							width: 20px;
							height: 20px;
							margin-right: 10px;
						}
						.icon+span {
							width: 60px;
							margin-right: 50px;
						}
					}
					.first-row {
						margin-bottom: 10px;
						.el-select {
							/deep/ {
								.el-input__suffix {
									display: none;
								}
								.el-input__inner {
									padding: 0;
									text-align: center;
									font-size: 11px;
									width: 42px;
									height: 22px;
									line-height: 18px;
									color: #fff;
									background: #17ce66;
									border: none;
									border-radius: 2px;
									&::-webkit-input-placeholder {
										color: #fff;
									}
								}
							}
						}
						.status-important {
							/deep/ {
								.el-input__inner {
									background: #ffba02;
								}
							}
						}
						.status-urgent {
							/deep/ {
								.el-input__inner {
									background: #ff6a6e;
								}
							}
						}
					}
					.second-row {
						margin-bottom: 10px;
						.el-date-editor {
							width: 170px;
							/deep/ {
								.el-input__prefix {
									display: none;
								}
								.el-input__inner {
									padding-left: 0;
									width: 170px;
									border: none;
									color: #666;
								}
								.el-input__inner:disabled {
									text-indent: 10px;
								}
							}
						}
					}
					.third-row {
						margin-bottom: 10px;
						.el-select {
							// width: 80px;
							/deep/ {
								.el-input__inner {
									width: 75px;
									padding-left: 0;
									border: none;
								}
								.el-input__inner:disabled {
									text-indent: 10px;
								}
								.el-icon-arrow-up,
								.el-icon-arrow-down {
									position: relative;
									top: 2px;
								}
							}
						}
					}
					.fouth-row {
						margin-bottom: 17px;
						.select-box-wrap {
							position: fixed;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							background: transparent;
							z-index: 999;
							.select-box {
								position: absolute;
								top: 20%;
								left: 50%;
								transform: translate(-50%, 0);
								width: 500px;
								height: 500px;
								background: #fff;
								box-shadow: 0 0 10px 5px #aaa;
								display: flex;
								flex-direction: column;
								padding: 20px;
								padding-top: 0;
								color: #333;
								z-index: 1000;
								.box-title {
									width: 100%;
									height: 50px;
									display: flex;
									align-items: center;
									justify-content: space-between;
									font-size: 18px;
									margin-bottom: 30px;
									.el-icon-close {
										cursor: pointer;
									}
								}
								.box-bottom {
									text-align: right;
									margin-top: auto;
									span {
										padding: 5px 20px;
										background: #7c6aff;
										color: #fff;
										border-radius: 2px;
										cursor: pointer;
									}
									span:first-child {
										margin-right: 10px;
									}
								}
							}
						}
						.el-icon-circle-plus-outline {
							font-size: 30px;
							cursor: pointer;
							margin-right: 10px;
						}
						.menber-list {
							display: flex;
							flex-wrap: wrap;
							.menber {
								width: 30px;
								height: 30px;
								border-radius: 50%;
								background: #7c6aff;
								color: #fff;
								display: flex;
								justify-content: center;
								align-items: center;
							}
							.menber+.menber {
								margin-left: 5px;
							}
						}
					}
					.fifth-row {
						font-size: 12px;
						text-align: right;
						span {
							cursor: pointer;
						}
						span:first-child {
							margin-right: 20px;
						}
					}
				}
				.system-dec {
					color: #666;
					padding: 20px 0;
					overflow-y: auto;
					margin-bottom: 20px;
					line-height: 26px;
					flex: 1;
					/deep/ {
						.el-textarea__inner {
							border: none;
						}
					}
				}
				.warn-type {
					color: #999;
					padding-bottom: 10px;
					border-bottom: 1px solid #ebebeb;
					margin-bottom: 9px;
					&>p {
						margin-bottom: 15px;
					}
					.el-checkbox {
						/deep/ {
							.el-checkbox__inner {
								border-color: #00a4ff;
							}
							.el-checkbox__label {
								color: #999;
							}
						}
					}
				}
			}
			.message {
				flex: 1;
				height: 100%;
				padding: 0 0 42px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.message-head {
					width: 100%;
					height: 95px;
					border-bottom: 1px solid #f0f0f0;
					font-size: 18px;
					color: #333;
					font-weight: 600;
					padding-top: 20px;
					width: calc(100% - 40px);
					align-self: center;
				}
				.message-box-wrap {
					width: calc(100% - 6px);
					flex: 1;
					overflow-y: auto;
					padding: 0 8px 0 20px;
					.message-box {
						padding: 20px 0;
						.message-row {
							display: flex;
							.avatar {
								width: 50px;
								height: 50px;
								border-radius: 50%;
								background: tomato;
								margin-right: 20px;
								img {
									width: 50px;
									height: 50px;
									border-radius: 50%;
								}
							}
							.right-part {
								flex: 1;
								width: 100%;
								padding-top: 4px;
								.main-msg {
									padding-bottom: 11px;
									border-bottom: 1px solid #f0f0f0;
									.name {
										color: #333;
										font-weight: 600;
										margin-bottom: 2px;
									}
									.time {
										color: #999;
										margin-bottom: 14px;
									}
									.content {
										margin-bottom: 12px;
										font-size: 13px;
										color: #666;
										line-height: 22px;
									}
									.msg-btn {
										color: #999;
										font-size: 12px;
										span {
											cursor: pointer;
										}
										span:first-child {
											margin-right: 10px;
										}
									}
								}
								.reply-input {
									display: flex;
									justify-content: space-between;
									margin-top: 10px;
									margin-bottom: 10px;
									.el-textarea {
										margin-right: 10px;
									}
									.send-btn {
										width: 86px;
										height: 33px;
										display: flex;
										justify-content: center;
										align-items: center;
										border: 1px solid #f0f0f0;
										color: #999;
										cursor: pointer;
									}
								}
								.reply-content {
									color: #666;
									background: #f7fbfc;
									padding: 20px;
									.first-reply {
										.content {
											line-height: 20px;
											margin-bottom: 10px;
											max-height: 150px;
											overflow-y: auto;
										}
										.who-time {
											margin-bottom: 10px;
											.a-line {
												color: #999;
											}
											span:nth-child(2),
											span:nth-child(4) {
												color: #333;
												font-weight: 600;
												margin-right: 5px;
											}
											span:last-child {
												color: #999;
											}
										}
										.reply-btn {
											font-size: 12px;
											color: #999;
											cursor: pointer;
											margin-bottom: 10px;
										}
										.reply-input {
											.send-btn {
												background: #fff;
											}
										}
										.second-reply {
											padding: 20px;
											border-left: 1px solid #ddd;
											border-right: 1px solid #ddd;
											.content {
												line-height: 20px;
												margin-bottom: 10px;
												max-height: 150px;
												overflow-y: auto;
											}
											.who-time {
												margin-bottom: 10px;
												.a-line {
													color: #999;
												}
												span:nth-child(2) {
													color: #333;
													font-weight: 600;
													margin-right: 5px;
												}
												span:last-child {
													color: #999;
												}
											}
											.reply-btn {
												font-size: 12px;
												color: #999;
												cursor: pointer;
											}
											.reply-input {
												.send-btn {
													background: #fff;
												}
											}
										}
										.second-reply:last-child {
											border-bottom: 1px solid #ddd;
										}
									}
									.first-reply+.first-reply {
										margin-top: 20px;
									}
								}
							}
						}
						.message-row+.message-row {
							margin-top: 20px;
						}
					}
				}
				.leave-msg {
					width: calc(100% - 40px);
					align-self: center;
					height: 168px;
					padding-top: 20px;
					border-top: 1px solid #f0f0f0;
					margin-bottom: 10px;
					.el-textarea {
						/deep/ {
							.el-textarea__inner {
								height: 148px;
								border-color: #f0f0f0;
								&:focus {
									border-color: #f0f0f0;
								}
							}
						}
					}
				}
				.bottom-btn {
					padding: 0 20px;
				}
			}
		}
	}
</style>