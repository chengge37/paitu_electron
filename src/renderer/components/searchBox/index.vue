<template>
	<div class="search-box">
		<div class="search">
			<input type="text" v-model="val" @change="search" :placeholder="placeholder" class="search-input input-focus">
		</div>
		<div class="search-button color-area">
			<ali-svg-icon icon-class="ic_search__white" class="bg-mirror"></ali-svg-icon>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			placeholder:{
				type:String,
				default:'输入您想查询的内容'
			},
			value:{
				type:String,
				default:''
			}
		},
		watch:{
			value(to,from){
				this.val=value;
			}
		},
		data() {
			return {
				val:this.value
			}
		},
		
		mounted() {
			
		},
		
		methods: {
			search(){
				this.$emit('change',this.val);
			}
		},

	}
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
.search-box {
		display: flex;
		width: 225px;
		.bg-mirror {
			width: 18px;
			height: 18px;
		}
		.search {
			display: flex;
			flex:1;
			.search-input {
				border: none;
				outline: medium;
				background-color: #ffffff;
				height: 100%;
				font-size: 14px;
				text-indent: 12px;
				width: 100%;
				border: 1px solid #D9D9D9;
				&::-webkit-input-placeholder {
					color: #D9D9D9;
					font-size: 14px;
				}
			}
		}
		.search-button {
			width: 34px;
			height: 34px;
			line-height: 34px;
			background-color: $Theme-color;
			text-align: center;
			color: #fff;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.ali-svg-icon {
			width: 18px;
			height: 19px;
			vertical-align: -0.15em;
			fill: currentColor;
			overflow: hidden;
		}
	}
</style>