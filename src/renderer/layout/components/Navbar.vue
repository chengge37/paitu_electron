<template>
	<el-menu class="navbar-header-fixed" mode="horizontal">
		<div class="top-right">
			<div class="hb-bd">
				<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
				<breadcrumb></breadcrumb>
			</div>

			<div class="top-select">
				<div class="myProduct" v-if="userProduct">
					<el-dropdown trigger="click" class="cursor">
						<div v-if="user_data">
							<div class="el-dropdown-link word-hover">
								我的产品
								<i class="el-icon-arrow-down el-icon--right"></i>
							</div>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item class="menu">
								<div class="item-logo">
									<img :src="$qiniuHost+'images/productEdition_'+userProduct.pid+'.png'" width="23" height="23" />
									<span class="editionName">{{userProduct.name}}</span>
								</div>
								<span class="remindDay">剩余天数：{{userProduct.remindDay}}天</span>
								<el-button class="renew" @click="renew">续费/升级</el-button>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				
				<div class="message">
					<el-tooltip class="notice" effect="light" content="消息" placement="bottom">
						<i class="el-icon-chat-line-round" @click="toMessage"></i>
					</el-tooltip>
					<span class="tips" v-if="msgInfo && msgInfo.unread>0">{{msgInfo.unread}}</span>
				</div>

				<div class="go-index" v-if="showupdate">
					<el-badge :value="1">
						<el-button size="small" @click="update">有新更新</el-button>
					</el-badge>
				</div>
				<div class="go-index">{{time}}</div>
				<div class="select-right userInfo">
					<el-dropdown trigger="click" class="cursor">
						<div v-if="user_data">
							<img :src="$qiniuHost+user_data.avatar" class="avatar" v-if="user_data.avatar !== null" />
							<img :src="defaultImg" class="avatar" v-else />

							<div class="el-dropdown-link word-hover">
								尊敬的： {{user_data.cname||user_data.nick}}
								<i class="el-icon-arrow-down el-icon--right"></i>
							</div>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="logout">
								<span>切换账号</span>
							</el-dropdown-item>
							<el-dropdown-item @click.native="logout">
								<span>退出登录</span>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
			
		</div>
	</el-menu>
</template>

<script>
	import { format, differenceInHours } from "date-fns";
	import { mapGetters } from "vuex";
	import Breadcrumb from "@/components/Breadcrumb";
	import Hamburger from "@/components/Hamburger";
	import DataSwitch from "@/components/switch";
	import pcmsg from "@/tools/notification";
	import TimeOutMsg from "@/components/timeout";
	import MainIpc from "@/utils/ipcRenderer";
	import { remote } from "electron";
	export default {
		components: {
			Breadcrumb,
			Hamburger,
			DataSwitch
		},
		data() {
			return {
				time: "",  
				defaultImg: this.config.male_pic,
				value: 1,
				timeout: false,
				userProduct: null, //用户已经购买的产品信息
				showupdate: false,
				msgInfo:null, //获取最新消息
				noticeTimer:null,  //消息计时器
			};
		},
		created() {
			this.$store.dispatch("GetProductDetail").then(res => {
				this.showUpdate(res.version);
			});
		},
		computed: {
			...mapGetters(["user_data", "sidebar", "use_time", "NewRouters", "version"])
		},
		beforeDestroy() {
			console.log("销毁计时器------------");
			clearInterval(this.timer);
			clearInterval(this.noticeTimer);
			this.timer = null;
		},
		mounted() {
			this.set_time();
			this.timer = setInterval(() => {
				this.set_time();
			}, 60000);
			
			this.noticeTimer=setInterval(()=>{
				this.getMsgList();
			},5000);
			
			//获取用户开通的功能
			this.getNowProduct();
			//获取最新消息
			this.getMsgList();
		},
		methods: {
			//跳到消息列表
			toMessage(){
				let path = "/serve/message/index";
				this.$router.push({
					path: path
				});
			},
			//获取站内信消息
			getMsgList(){
				let params={
					is_sys:0,
					page:1,
					page_size:1000000
				}
				this.util.getMsgList(params).then(res=>{
					//添加一个未读消息字段
					res.unread=parseInt(res.total_count-res.un_read_count);
					this.msgInfo=res;
				})
			},
			//跳转到续费或升级页面
			renew() {
				let path = "/serve/product_set/product_set";
				this.$router.push({
					path: path
				});
			},
			//获取用户开通的功能
			getNowProduct() {
				this.util.getNowProduct().then(res => {
					res=this.util.productInfo(res);
					console.error('getNowProduct-----',res);
					this.userProduct = res;
				});
			},
			toggleSideBar() {
				this.$store.dispatch("ToggleSideBar");
			},
			async logout() {
				await this.$store.dispatch("LogOut");
				this.$router.push("/login");
			},
			set_time() {
				this.time = format(new Date(), "YYYY/MM/DD HH:mm");
			},
			update() {
				this.$confirm(
						"此操作将会联网下载服务器中最新版本的软件，是否继续?",
						"提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						}
					)
					.then(() => {
						TimeOutMsg({
							title: "正在更新",
							showProgress: true,
							primaryButton: "下载中"
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消下载"
						});
					});
			},
			showUpdate(data) {
				let a = data.replace(/\"/g, "").split(".");
				// 0是从左到右第一位，1第二位，2第三位
				if(Number(a[2]) !== 0) this.showupdate = true;
				if(!(Number(a[0]) <= 1 && Number(a[1]) <= 3)) {
					pcmsg.DesktopMsg({
						title: "警告",
						body: "您当前软件版本已经远低于服务器版本，请升级软件获取最佳体验"
					});
					TimeOutMsg({
						title: "您的软件版本过低",
						message: "享用更多服务请您更新版本",
						primaryButton: "立刻升级"
					});
				}
			}
		},
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.navbar-header-fixed {
		transition: width 0.28s;
		width: calc(100% - 210px);
		display: flex;
		align-items: center;
		position: fixed;
		right: 0;
		z-index: 1002;
		height: 62px;
		.hamburger-container {
			line-height: 58px;
			height: 50px;
			float: left;
			padding: 0 10px;
		}
		.logo {
			width: 199px;
			height: 62px;
		}
		.top-right {
			display: flex;
			width: 100%;
			height: 100%;
			background-color: #ffffff;
			justify-content: space-between;
			padding: 0 19px;
			.hb-bd {
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.avatar {
				width: 30px;
				height: 30px;
				margin-right: 10px;
				border-radius: 50%;
				object-fit: scale-down;
			}
			.top-select {
				display: flex;
				align-items: center;
				.go-index {
					color: #333333;
					font-weight: 400;
					margin-right: 20px;
					padding-right: 20px;
					border-right: 1px solid #cccccc;
				}
				.select-right /deep/ .el-dropdown>span {
					font-size: 6px;
				}
				.select-right {
					.el-dropdown-link {
						color: #333333;
						font-weight: 400;
					}
					/deep/ .el-dropdown-selfdefine {
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
	
	.myProduct {
		cursor: pointer;
		margin-right: 20px;
	}
	
	li.menu {
		display: flex;
		flex-direction: column;
		padding: 10px 15px;
		cursor: default;
		&:hover {
			background: none;
		}
		.item-logo {
			display: flex;
			align-items: center;
			img {
				margin-right: 5px;
			}
		}
		.editionName {
			font-size: 16px;
			color: #333;
			font-weight: 600;
		}
		.remindDay {
			color: #999;
			padding-left: 5px;
		}
		.renew {
			color: #e41b1b;
			padding-left: 30px;
			cursor: pointer;
			&:hover {
				background: #ffdddc;
			}
		}
	}
	
	.userInfo {
		cursor: pointer;
	}
	
	.message{
		position:relative;
		margin: 0px 15px;
		.notice{
		    font-size: 20px;
		    cursor:pointer;
		}
		.tips{
			position:absolute;
			left:12px;
			top:-10px;
			height:18px;
			padding:0px 6px;
			line-height:18px;
			text-align: center;
			white-space:nowrap;
			border-radius:10px;
			background:red;
			color:#fff;
			font-size:12px;
		}
	}
	
</style>