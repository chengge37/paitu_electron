<template>
	<div class="newServe">
		<div class="top-nav">
			<div class="nav menu-hover" :class="{'nav-active':item.isActive}" v-for="(item,index) in navArr" :key="index" @click="selectNav(index)">
				<span v-text="item.word.slice(0,2)"></span>
				<span v-text="item.word.slice(2)"></span>
			</div>
		</div>

		<div class="comment" v-if='tabIndex==0'>
			<!--评论表格-->
			<el-table :data="commentList" element-loading-text="Loading" fit>
				<!--<el-table-column type="selection" width="55"></el-table-column>-->
				<el-table-column align="center" type="index" label="序号" width="50"></el-table-column>

				<el-table-column align="center" prop="create_time" label="评论日期" sortable>
					<template slot-scope="scope">
						<span>{{scope.row.create_time | time2Date}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="order.type" label="订单编号"></el-table-column>
				<el-table-column align="center" prop="score" label="评分">
				</el-table-column>
				<el-table-column align="center" prop="order.name" label="产品名称"></el-table-column>
				<el-table-column align="center" prop="content" label="评论内容"></el-table-column>
				<el-table-column align="center" prop="content" label="图片">
					<template slot-scope="scope">
						<ul style="display:flex;justify-content: center;">
							<li v-for="(item,index2) in scope.row.pic.split(',')" :key="index2" style="margin-right:5px;">
								<img :src="$qiniuHost+item" width="30" height="30" />
							</li>
						</ul>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="created_at" width="180" label="操作">
					<template slot-scope="scope">
						<!--<el-button type="text" @click="detail('3',scope.row)">修改</el-button>-->
						<!--<el-button type="text" @click="delFinance(scope.row.id)">删除</el-button>-->
						<el-button type="text" @click="toOrderDetail(scope.row)">查看订单</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页模块-->
			<pagination :total="parseInt(commentParams.total)" :page="parseInt(commentParams.page)" :pagesize="parseInt(commentParams.pageSize)" @getPageNum="changePage" class="pagination">
			</pagination>

		</div>

		<!--Q&A模块 -->
		<!--<transition>-->
		<div v-show="tabIndex==1&&!showReplyList">
			<div class="tableList questionList">
				<div class="list-item" v-for="(item,index) in questionList" :key="index">
					<div class="list-head">
						<div class="info">
							<span class="date">{{item.create_time | time2Date}}</span>
							<span class="number">客户ID：{{item.id}}</span>
							<span>客户名称：{{item.nick}}</span>
						</div>

						<div class="merge">
							<div class="comment">问题描述</div>
							<div class="myReply" v-if="item.children.length>0">回复内容</div>

						</div>
						<div class="valid">审核状态</div>
						<div class="operate">操作</div>
					</div>

					<div class="list-body">
						<div class="info">
							<div class="img">
								<!--<img :src="util.qiniuAddress+item.avatar.split(',')[0]" alt width="100%" height="100%" />-->
								<el-image style="width:100%;height:100%;" fit="contain"  :src="util.picExplode(item.avatar,config.male_pic)"
								:onerror="util.errorPic"/>
							</div>
							<div class="detail">
								<ul>
									<li>
										提问产品：
										<span>{{item.id}}</span>
									</li>
									<li class="address">
										<p>地址：</p>
										<span>{{item.id}}</span>
									</li>
								</ul>
							</div>
						</div>

						<div class="merge">
							<div class="comment">
								<div>
									<p>{{item.content}}</p>
									<span>{{item.create_time | time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
								</div>
							</div>

							<div class="myReply" v-if="item.children.length>0" :class="item.children.length>=3?'over':''">
								<div v-for="(subItem,index2) in item.children" :key="index2" v-if="index2<=3">
									<p>
										{{subItem.content}}
										<i class="el-icon-edit" @click="updateContent(subItem)"></i>
										<el-button type="text" @click="vertify(subItem.qid,subItem.id)" v-permission>审核</el-button>
										<span v-if="subItem.is_valid=='0'">（未通过）</span>
										<span v-else>（已通过）</span>
									</p>
									<span>{{subItem.create_time | time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
								</div>
								<div class="replyDetail" v-if="item.children.length>=3">
									<div v-for="(subItem,index2) in item.children" :key="index2">
										<p>
											{{subItem.content}}
											<i class="el-icon-edit" @click="updateContent(subItem)"></i>
											<el-button type="text" @click="vertify(subItem.qid,subItem.id)" v-permission>审核</el-button>
											<span v-if="subItem.is_valid=='0'">（未通过）</span>
											<span v-else>（已通过）</span>
										</p>
										<span>{{subItem.create_time | time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="valid">
							<span v-if="item.is_valid=='0'">未通过</span>
							<span v-else>已通过</span>
						</div>
						<div class="operate">
							<el-button type="text" @click="vertify(item.id)" v-permission>审核</el-button>
							<!--<el-button type="text" v-permission>删除</el-button>-->
							<el-button type="text" v-if="!item.children.length" @click="reply(item)" v-permission>回复</el-button>
							<el-button type="text" v-if="item.children.length" @click="reply(item)" v-permission>再次回复</el-button>
						</div>
					</div>
				</div>

				<!--分页模块-->
				<pagination v-if="questionList.length>0" :total="parseInt(questionParams.total)" :page="parseInt(questionParams.page)" :pagesize="parseInt(questionParams.pageSize)" @getPageNum="changePage" class="pagination">
				</pagination>

				<div class="noData" v-if="questionList.length==0">
					暂无数据
				</div>

			</div>
		</div>

		<!--常见问题 -->
		<div v-show="tabIndex==2" class="FAQ">
			<div class="faqList" v-if="showFAQlist">
				<el-button icon="el-icon-plus" @click="toAddFAQ" class="toAddFAQ" v-permission>添加常见问题</el-button>

				<el-table :data="FAQlist" fit :header-cell-style="{}" class="FAQtable">
					<el-table-column align="center" label="序号" width="95">
						<template slot-scope="scope">
							<span>{{(faqParams.page-1)*faqParams.pageSize+scope.$index+1}}</span>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" width="150">
						<template slot-scope="scope">
							<span>{{scope.row.create_time|time2Date}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="content" label="问题" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="relpy" label="回答" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.is_valid==1">已上架</span>
							<span v-else class="noValid">未上架</span>
						</template>
					</el-table-column>

					<el-table-column align="center" prop="created_at" width="300" label="操作">
						<template slot-scope="scope">
							<el-button v-if="scope.row.is_valid==0" type="text" @click="changeFAQvalid(scope.row,'1')" v-permission>上架</el-button>
							<el-button v-else type="text" @click="changeFAQvalid(scope.row,'0')" v-permission>下架</el-button>
							<el-button type="text" @click="toUpdateFAQ(scope.row)" v-permission>修改</el-button>
							<el-button type="text" @click="delFAQ(scope.row)" v-permission>删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--分页模块-->
				<pagination :total="parseInt(faqParams.total)" :page="parseInt(faqParams.page)" :pagesize="parseInt(faqParams.pageSize)" @getPageNum="changePage" class="pagination">
				</pagination>
			</div>

			<div class="faqDetail" v-if="!showFAQlist">
				<p class="title">配置常见问题</p>

				<el-form ref="form" :model="form" label-width="60px" :rules="questionRules" :inline="false">
					<el-row :gutter="0">
						<el-col :span="24" class="short-input">
							<el-form-item label="问题" prop="content">
								<el-input v-model="form.content"></el-input>
							</el-form-item>
							<el-form-item label="回答" prop="reply">
								<el-input v-model="form.reply"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item class='bottomBtn'>
						<el-button v-if="selectFaq" class="color-area" type="primary" @click="updateFAQ" v-permission>修改</el-button>
						<el-button v-else class="color-area" type="primary" @click="addFAQ" v-permission>保存</el-button>
						<el-button type="default" @click="toFAQlist" v-permission>取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<!--修改回复内容对话框-->
		<el-dialog title="修改内容" :visible.sync="contentDialog" width="30%">
			<el-form label-width="100px" :inline="false">
				<el-row :gutter="0">
					<el-col :span="20" class="short-input">
						<el-form-item label="回复内容：">
							<el-input v-model="updateItem.content" placeholder="请输入修改内容"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<span slot="footer" class="dialog-footer">
        <div class="layout">
          <div class="bottom-button">
            <el-button @click="contentDialog=false" v-permission>取 消</el-button>
            <el-button type="primary" @click="updateReply" v-permission>修 改</el-button>
          </div>
        </div>
      </span>
		</el-dialog>

		<!-- 回复列表表格-->
		<transition name="fade">
			<div class="tableList replyList" v-show="tabIndex==1&&showReplyList">
				<div class="list-item">
					<div class="list-head">
						<div class="info">
							<el-checkbox @change></el-checkbox>
							<span class="date">{{replyItem.create_time | time2Date}}</span>
							<span class="number">客户ID：{{replyItem.uid}}</span>
						</div>

						<div class="merge">
							<div class="comment">问题描述</div>
						</div>
					</div>

					<div class="list-body">
						<div class="info">
							<!--<div class="img"></div>-->
							<el-image style="width:70px;height:70px;" fit="contain"  :src="util.picExplode(replyItem.avatar,config.male_pic)"
							:onerror="util.errorPic"/>
							<div class="detail">
								<ul>
									<li>
										提问产品：
										<span>{{replyItem.id}}</span>
									</li>
									<li class="address">
										<p>地址：</p>
										<span>{{replyItem.id}}</span>
									</li>
								</ul>
							</div>
						</div>

						<div class="merge">
							<div class="comment">
								<div>
									<p>{{replyItem.content}}</p>
									<span>{{replyItem.create_time | time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<el-input type="textarea" resize="none" :rows="4" placeholder="请输入内容222" v-model="replyContent" class="replyTextarea"></el-input>

				<div class="bottom-button">
					<el-button @click="confirmReply(false)" v-permission>取消回复</el-button>
					<el-button type="primary" @click="confirmReply(true)" v-permission>确认回复</el-button>
				</div>
			</div>
		</transition>

		<!-- 回复评论表格-->
		<transition name="fade">
			<div class="tableList" v-if="showReplyComment">
				<div class="list-item">
					<div class="list-head">
						<div class="info">
							<el-checkbox @change></el-checkbox>
							<span class="date">{{commentItem.create_time | time2Date}}</span>
							<span class="number">订单编号：{{commentItem.order.show_id}}</span>
							<el-rate v-model="commentItem.score" show-score disabled text-color="#ff9900" score-template="{value}"></el-rate>
						</div>

						<div class="merge">
							<div class="comment">评论内容</div>
						</div>
					</div>

					<div class="list-body">
						<div class="info">
							<div class="img">
							</div>
							<div class="detail">
								<ul>
									<li>
										订单类型：
										<span>{{commentItem.order.type}}</span>
									</li>
									<li>
										订单总价：
										<span>{{commentItem.order.price}}</span>
									</li>
									<li>
										客户名称：
										<span>{{commentItem.order.name}}</span>
									</li>
									<li>
										联系电话：
										<span>{{commentItem.order.type}}</span>
									</li>
									<li>
										产品名称：
										<span>{{commentItem.order.name}}</span>
									</li>
								</ul>
							</div>
						</div>

						<div class="merge">
							<div class="comment">
								<div>
									<p>{{commentItem.content}}</p>
									<span>{{commentItem.create_time | time2Date('YYYY-MM-DD HH:mm:ss')}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="commentContent" class="replyTextarea"></el-input>

				<div class="bottom-button">
					<el-button @click="replyComment()" v-permission>取消回复</el-button>
					<el-button type="primary" @click="replyComment(commentItem.id)" v-permission>确认回复</el-button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import { question, comment } from "@config/api.js";
	import pagination from "ServeComponents/FrontComponents/pagination";
	import { mapGetters } from "vuex";
	export default {
		data: () => ({
			navArr: [{
					word: '评论列表',
					isActive: true
				},
				{
					word: 'Q&A列表',
					isActive: false
				},
				{
					word: '常见问题',
					isActive: false
				}
			],
			select_index: 1,
			comment_index: 1,
			question_index: 1,
			tabIndex: "0",
			commentCheck: [],
			showReplyList: false,
			showReplyComment: false,
			replyContent: "", //回复的内容
			commentContent: "", //回复评论的内容
			replyItem: {}, //需要回复的问题信息
			commentItem: {}, //需要回复评论的信息
			updateConten: "", //修改回复内容
			updateItem: "", //修改回复的数据
			contentDialog: false, //修改回复对话框
			commentList: [], //评论列表
			questionList: [],
			replyList: [],
			FAQlist: [], //常见问题列表
			form: {
				content: "",
				reply: ""
			},
			questionRules: {
		        content: [
		          { required: true, message: "请输入问题", trigger: "blur" },
		          { min: 6, max: 1024, message: "长度在 6 到 1024个字符", trigger: "blur" }
		        ],
		        reply: [
		          { required: true, message: "请输入回复内容", trigger: "blur" },
		         	{ min: 6, max: 1024, message: "长度在 6 到 1024个字符", trigger: "blur" }
		        ],
		      },
		      questionParams:{
		      	page: 1,
				pageSize: 10,
				total: 0
		      },
			faqParams: {
				page: 1,
				pageSize: 10,
				total: 0
			},
			showFAQlist: true,
			selectFaq: null,
			commentParams: {
				page: 1,
				pageSize: 10,
				total:0,
			},
		}),

		created() {
			this.getQuestionList();
		},

		computed: {
			...mapGetters(["user_data"])
		},
		components: {
			pagination
		},

		mounted() {
			this.getCommentList();
			//获取常见问题列表
			this.getFAQlist();
		},

		methods: {
			//切换页数方法
			changePage(val) {
				switch(parseInt(this.tabIndex)){
					case 0:
						this.commentParams.page=val;
						this.getCommentList();
						break;
					case 1:
						this.questionParams.page=val;
						this.getQuestionList();
						break;
					case 2:
						this.faqParams.page=val;
						this.getFAQlist();
						break;
				}
			},

			//菜单切换方法
			selectNav(val) {
				console.log('selectNav-------', val);
				this.tabIndex = val;
				this.navArr.forEach((item, index) => {
					item.isActive = false;
				})
				this.navArr[val].isActive = true;
			},

			//返回常见问题列表
			toFAQlist() {
				this.form.content = "";
				this.form.reply = "";
				this.showFAQlist = true;
			},
			//跳转到修改常见问题FAQ页面
			toUpdateFAQ(item) {
				this.showFAQlist = false;
				this.form.content = item.content;
				this.form.reply = item.relpy;
				this.selectFaq = item;
			},
			//跳转到添加常见问题FAQ页面
			toAddFAQ() {
				this.showFAQlist = false;
			},
			//修改常见问题FAQ
			updateFAQ() {
				let item = this.selectFaq;
				let params = {
					qid: item.id,
					sort: "1",
					is_valid: item.is_valid,
					content: this.form.content,
					relpy: this.form.reply
				};
				console.log("updateFAQ---------", params);
				this.util.checkForm(this).then(res=>{
					if(res){
						this.util.updateFAQ(params).then(res => {
					    this.$message.success("修改问答成功");
					    this.showFAQlist = true;
					    this.getFAQlist();
				    });
					}
				}).catch((error)=>{});
				
			},
			//删除常见问题FAQ
			delFAQ(item) {
				this.util
					.confirm(this)
					.then(() => {
						this.util.delFAQ(item.id).then(res => {
							this.$message.success("删除问答成功");
							this.faqParams.page = 1;
							this.getFAQlist();
						});
					})
					.catch(err => {});
			},
			//切换常见问题列表页
			changeFAQpage(val) {
				this.faqParams.page = val;
				this.getFAQlist();
			},
			//修改常见问题FAQ状态
			changeFAQvalid(item, type) {
				let params = {
					qid: item.id,
					sort: "1",
					is_valid: type,
					content: item.content,
					relpy: item.relpy
				};
				console.log("params-----------", params);
				this.util.updateFAQ(params).then(res => {
					console.log("updateFAQ--------", res);
					let message = "";
					if(type == 0) {
						message = "下架问答成功！";
					} else if(type == 1) {
						message = "上架问答成功！";
					}
					this.$message.success(message);
					//重新刷新列表
					this.getFAQlist();
				});
			},
			//获取常见问题FAQ列表数据
			getFAQlist() {
				let params = {
					page: this.faqParams.page,
					page_size: this.faqParams.pageSize,
					uid: this.user_data.id
				};
				console.log("params------------", params);
				this.util.getFAQlist(params).then(res => {
					console.log("getFAQlist--------", res);
					this.FAQlist = res.rows;
					this.faqParams.total = res.total_count;
				});
			},
			//添加常见问题FAQ
			addFAQ() {
				console.log("addFAQ---------", this.form);
				this.util.checkForm(this).then(res=>{
					if(res){
						this.util.addFAQ(this.form.content, this.form.reply).then(res => {
							this.$message.success("添加常见问题成功！");
							this.showFAQlist = true;
							this.getFAQlist();
						});
					}
				}).catch((error)=>{});
				
			},
			//查看订单
			toOrderDetail(item) {
				console.log("toOrderDetail----------", item);
				this.$router.push({
					path: "/serve/order/details",
					query: {
						id: item.order.id
					}
				});
			},
			//商家获取问答/问题列表方法
			getQuestionList() {
				let params = {
					page: this.questionParams.page,
					page_size: this.questionParams.pageSize,
				};
				this.getRequest(question.getAll,params)
					.then(res => {
						console.log("getQuestionList---", res);
						this.questionList = res.rows;
						this.questionParams.total=res.total_count;
						//测试代码，递归处理回复的内容
						this.questionList.forEach((item, index) => {
							this.tempList = [];
							if(item.children) {
								this.getContent(item.children);
								item.children = this.tempList;
							}
						});
						console.log("this.questionList---after---", this.questionList);
					})
					.catch(err => {});
			},
			//获取评论列表
			getCommentList() {
				let params = {
					page: this.commentParams.page,
					page_size: this.commentParams.pageSize,
				};
				this.getRequest(comment.getAll,params)
					.then(res => {
						//将评分字段从字符串转为number数字类型
						let list = res.rows;
						this.commentList = list.map((item, index) => {
							item.score = parseFloat(item.score);
							return item;
						});
						this.commentParams.total=res.total_count;
						console.log("this.commentList----", this.commentList);
					})
					.catch(err => {});
			},
			//回复评论按钮点击方法
			toReplyComment(item) {
				this.showReplyComment = true;
				this.commentItem = item;
			},
			//回复评论方法
			replyComment(id) {
				if(id) {
					let params = {
						comment_id: id,
						reply: this.commentContent
					};
					this.postRequest(comment.reply, params)
						.then(res => {
							console.log("commentReply-----", res);
							this.$message.success("回复评论成功！");
						})
						.catch(err => {});
				}
				this.showReplyComment = false;
				this.commentContent = "";
			},

			//递归获取回复内容
			getContent(list) {
				for(let i = 0; i < list.length; i++) {
					this.tempList.push(list[i]);
					if(list[i].children) {
						this.getContent(list[i].children);
					}
				}
			},
			//回复方法
			reply(item) {
				this.replyItem = item;
				this.showReplyList = true;
				console.log("reply----", this.replyItem);
			},
			//回复内容方法
			confirmReply(flag) {
				if(flag) {
					let params = {
						qid: this.replyItem.id,
						content: this.replyContent
					};
					console.log("params----", params);
					this.postRequest(question.reply, params)
						.then(res => {
							this.$message.success("回复成功！");
							this.showReplyList = false;
							this.getQuestionList();
						})
						.catch(err => {});
				}else{
					this.showReplyList=false;
				}
			},
			//审核问题方法,审核问题，回复审核
			vertify(qid, rid) {
				let title = "是否审核通过该问题";
				if(rid) {
					title = "是否审核通过该回复";
				}
				new Promise((resolve, reject) => {
					this.$confirm(title, "提示", {
							confirmButtonText: "通过",
							cancelButtonText: "不通过",
							type: "warning",
							distinguishCancelAndClose: true,
							center: true
						})
						.then(() => {
							resolve("1");
						})
						.catch(action => {
							if(action === "cancel") {
								resolve("0");
							}
						});
				}).then(res => {
					let params = {
						qid: qid,
						is_valid: res
					};
					if(rid) {
						params.rid = rid;
					}

					console.log("params---", params);
					this.postRequest(question.vertify, params)
						.then(res => {
							this.$message.success("操作成功！");
							this.getQuestionList();
						})
						.catch(err => {});
				});
			},
			//商家修改自己发布的回复
			updateContent(item) {
				this.contentDialog = true;
				this.updateItem = this.util.deepcopy(item);
			},
			//确认修改发布的回复
			updateReply() {
				let params = {
					rid: this.updateItem.id,
					content: this.updateItem.content
				};
				this.postRequest(question.update, params)
					.then(res => {
						this.$message.success("修改成功！");
						this.getQuestionList();
						this.contentDialog = false;
					})
					.catch(err => {});
			},
			tabClick(val) {
				this.showReplyList = false;
				//清空回复框输入的内容
				this.replyContent = "";
			},
			checkList(index) {
				//console.log('checkList-----',index);
			}
		}
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	@import "./styles/index.scss";
	.mainInfo {
		padding-left: 30px;
	}
	
	.top-nav {
		box-sizing: border-box;
		background:#fff;
		padding-left:30px;
		.nav {
			font-size: 0;
			box-sizing: border-box;
			margin-right: 30px;
			cursor: pointer;
			span {
				font-size: 16px;
				padding: 8px 0;
				box-sizing: border-box;
			}
			&:last-child {
				margin-right: auto;
			}
		}
		.nav-active {
			color: #7C6AFF;
			span:first-child {
				border-bottom: 2px solid #7C6AFF;
			}
		}
	}
	
	.menu-hover {
		&:hover {
			color: #7C6AFF!important;
			span:first-child {
				border-bottom: 2px solid #734ae2;
			}
		}
	}
	.faqList{
		.toAddFAQ{
			background:#fff;
			border:1px solid $Theme-color;
			border-radius:0px;
			color:$Theme-color;
			margin:10px 0px;
		}
	}
	.faqDetail{
		background:#fff;
		padding:20px 30px;
		.title{
			font-size:18px;
			color:#666;
			padding-bottom:20px;
			border-bottom:1px solid #FAFAFA; 
			margin-bottom:20px;
		}
		/deep/{
			.el-form-item__label{
				text-align:left;
			}
			.el-input{
				width:100%!important;
			}
		}
	}
</style>