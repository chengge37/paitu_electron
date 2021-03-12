<template>
	<div class="newServe">
		<div class="main">

			<!--推广模块-->
			<div class="card" v-for="(item,index) in list" :key="index">
				<div class="grid-content bg-msm">
					<div class="main_title">{{item.title}}</div>
					<div class="main_content">
						<div class="main_pic">
							<img class="message" :src="$qiniuHost + 'images/'+ item.pic" />
						</div>
						<div class="main_info">
							<p>{{item.content}}</p>
							<!--<router-link :to="item.to">-->
								<button class="main_enter" @click="toPage(index)">
                  <i class="el-icon-caret-right enter_pic"></i>立即进入
                </button>
							<!--</router-link>-->
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					title: '短信营销',
					pic: 'sms_marketing.png?v',
					content: '商家可以通过短信模板，快速编辑群发短信推广',
					to: 'MsmMessage'
				}, {
					title: '小程序',
					pic: 'sms_routine.png?v',
					content: '商家可以通过小程序发布产品，多平台展示快速编辑',
					to: 'smallProIndex'
				}, {
					title: '优惠券',
					pic: 'sms_coupon.png?v',
					content: '商家优惠券,多多优惠，快来领取吧',
					to: 'coupon_set'
				}]
			};
		},
		methods: {
			onSubmit() {
				console.log("submit!");
			},
			
			//跳转到相关页面
			toPage(index){
				//如果是小程序，判断是否有权限
				if(index==1){
					this.util.checkFuns().then(res=>{
						if(res){
							this.util.toRoute(this.list[index].to);
						}
					})
				}else{
					this.util.toRoute(this.list[index].to);
				}
				
			},
			
			
			gowarring() {
				this.$message({
					type: "warning",
					message: "建设中"
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.bg-msm,
	.bg-smallpro {
		background: #fff;
	}
	
	.grid-content {
		border-radius: 0px;
		padding: 25px 0px 0px 35px;
		max-width: 492px;
		height: 274px;
	}
	
	.newServe {
		.title {
			.icon {
				display: inline-block;
				height: 24px;
				border: 3.5px solid $Theme-color;
				border-radius: 4px;
				margin-right: 10px;
				vertical-align: middle;
				margin-bottom: 3px;
			}
			text-align: left;
			font-size: 24px;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
		.main {
			margin-top: 30px;
			display: flex;
			justify-content: flex-start;
			.card {
				flex: 1;
			}
			.main_title {
				font-size: 24px;
				font-weight: bold;
				color: #000;
			}
			.main_pic {
				width: 120px;
				padding-top: 60px;
				.message {
					color: #fff;
					width: 100px;
					height: 100px;
				}
			}
			.main_content {
				display: flex;
				.main_info {
					padding: 42px 34px 0 41px;
					font-size: 16px;
					letter-spacing: 2px;
					font-weight: 400;
					color: #000;
					p {
						min-height: 42px;
					}
					.main_enter {
						margin-top: 40px;
						margin-bottom: 57px;
						border: 1px solid transparent;
						outline: none;
						width: 94px;
						height: 32px;
						border-radius: 16px;
						font-size: 12px;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
						cursor: pointer;
						background: transparent;
						.enter_pic {
							font-size: 13px;
						}
					}
					.main_enter:hover {
						background: rgba(241, 241, 241, 1);
					}
				}
			}
		}
		.hide {
			visibility: hidden;
		}
		.card {
			margin: 0 23px 0 23px;
		}
	}
</style>