<template>
	<div class="newServe">
		<div class="content">
			<p>当前使用：</p>
			<div class='template current'>
				<img :src="$qiniuHost+'images/'+curTemplate.pic" />
				<div class="operate">
						<span class="color-area" @click="preview(item)">预览</span>
					</div>
			</div>

			<ul class="templateList">
				<li class="template cursor" v-for="(item,index) in templateList" :key="index">
					<img :src="$qiniuHost+'images/'+item.pic" />
					<div class="operate">
						<span class="color-area" @click="preview(item,index)">预览</span>
						<!--<span class="color-area" @click="use(item.id)">使用</span>-->
						<el-button type="text" class="color-area" @click="use(item.id)">使用</el-button>
					</div>
				</li>
			</ul>
			
			<!--图片预览模块-->
			<el-dialog :visible.sync="showImagePreview">
				<el-carousel indicator-position="outside" height="600px" :autoplay="false" arrow="never">
					<el-carousel-item v-for="(item,index) in previewImgList" :key="index">
						<img :src="config.qiniuHost+'images/'+item.pic" :onerror="util.errorPic" style="max-width: 100%;max-height: auto;display: block; margin: 0 auto;" />
					</el-carousel-item>
				</el-carousel>
			</el-dialog>
			
		</div>

	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				showImagePreview:false,  //是否显示图片预览
				curTemplate: {}, //当前使用的模板
				templateList: [],
				shopInfo: null, //商家基本信息
				previewImgList:[],  //图片预览列表
			}
		},

		created() {
			this.loadData();
			console.log('this.user_data--------', this.user_data);
		},

		computed: {
			...mapGetters(["user_data"])
		},

		methods: {

			loadData() {
				this.getShopInfo(this.user_data.id).then(res => {
					//获取店铺模板列表方法
					this.getTplList();
				})
			},

			//获取商家基本信息
			getShopInfo(id) {
				return new Promise((resolve, reject) => {
					this.util.getShopById(id).then(res => {
						console.log('getShopById----', res);
						this.shopInfo = res;
						resolve(true);
					})
				})

			},

			//获取店铺模板列表方法
			getTplList() {
				this.util.getAllShopTpl().then(res => {
					console.log('getAllShopTpl------', res);
					this.templateList = res.rows;
					res.rows.forEach((item, index) => {
						if(item.id == this.shopInfo.select_tpl) {
							this.curTemplate = item;
						}
					})
					console.log('this.curTemplate------', this.curTemplate);
				})
			},

			//图片预览功能
			preview(item,index) {
				this.previewImgList=[];
				this.previewImgList.push(item);
				this.showImagePreview=true;
				
			},

			//使用功能,设置店铺模板方法
			use(id) {
				this.util.confirm(this,'确定使用该模板？').then(res=>{
					this.util.setShopTpl(id).then(res => {
						console.log('setShopTpl-----', res);
						this.$message.success('使用模板成功！');
						this.loadData();
					})
				})
			},

		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 20px 20px 0;
		box-sizing: border-box;
		header {
			margin-bottom: 30px;
			span:first-child {
				color: #999;
			}
			span:last-child {
				color: #4E475C;
			}
		}
	}
	
	.content {
		background: #fff;
		padding: 40px;
		p {
			font-size: 20px;
			margin-bottom: 20px;
		}
		.current {
			margin-bottom: 40px;
			img {
				width: 100%;
			}
		}
		.templateList {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding-top:20px;
				border-top:1px solid #eee;
			.template {
				margin-right: 20px;
				margin-bottom: 20px;
				position: relative;
				border-radius: 4px;
				
				&:hover {
					.operate {
						display: flex;
					}
				}
				img {
					width: 100%;
					/*height: 100%;*/
				}
				.operate {
					position: absolute;
					left: 50%;
					top: 50%;
					-webkit-transform: translate(-50%, -50%);
					transform: translate(-50%, -50%);
					color: #fff;
					display: none;
					span{
						margin-right:10px;
					}
					span,button {
						display: inline-block;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 5px;
						width: 66px;
						height: 66px;
						text-align: center;
						line-height: 66px;
						/*margin-right: 10px;*/
						cursor: pointer;
						color:#fff;
					}
					button{
						line-height:0px;
					}
				}
			}
		}
		.template {
			background: #D8D8D8;
			border-radius: 4px;
			width: 270px;
			height: 435px;
			border: 1px solid #eee;
			overflow:hidden;
		}
	}
	/deep/ .el-carousel__item{
		overflow-y:scroll;
		&::-webkit-scrollbar{
      // 设置滚动条宽度
      width:6px;
    }
    &::-webkit-scrollbar-track{
      // 设置滚动槽样式
      background: #fff;
      border-radius:3px;
    }
    &::-webkit-scrollbar-thumb{
      // 设置滚动条背景颜色和圆角
      background: #F0F0F0;
      border-radius:3px;
    }
    &::-webkit-scrollbar-thumb:hover{
      // 滚动条hover样式
      // background: #333;
    }
	}
</style>