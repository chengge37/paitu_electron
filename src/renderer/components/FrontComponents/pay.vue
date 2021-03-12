<template>
	<div class="wrap">
		<el-dialog :visible.sync="isShow" class="dialog" @closed="closed">
			<div class="text">
				支付方式：
				<button class="buttonpay" v-for="(item, index) in pays" :key="index" :class="{ 'focuspay':index==currentpay}" @click="payevent(index,$event)">
	                <ali-svg-icon :icon-class="item.icon" class-name="iconpay"></ali-svg-icon>
	                <span class="paytext">{{item.text}}</span>
	            </button>
			</div>
			<div class="text">
				支付金额：￥
				<span class="money red">{{payOption.price}}</span>
			</div>
			<div class="code">
				<canvas class="codepay" id="canvas"></canvas>
				<p class="codetext">{{codetext}}</p>
				<div id="aliForm"></div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {sms} from "@/config/api.js";
	import QRCode from "qrcode";
	import { mapGetters } from "vuex";
	export default {
		props:{
			openPay: {
		      type: Boolean,
		      default: false
		    },
		    payOption:{
		    	type:Object,
		    	default:null
		    }
		},
		data() {
			return {
				currentpay: 0,
				codetext: '',
				paymoney: 0,
				isShow: this.openPay,
				params:this.payOption,
				pays: [{
		                text: "微信",
		                icon: "weixinPay"
		            },
		            {
		                text: "支付宝",
		                icon: "aliApy_round"
		            }
		        ],
			}
		},
		watch: {
		    openPay(to) {
		    	console.log('openPay------------',to);
		      this.isShow = to;
		    },
		    payOption(to){
		    	console.log('payOption--------',to);
		    	this.params=to;
		    }
	    },
	    destroyed() {
			//清除定支付轮询定时器
		  this.clearPayInterval();
		},
	    mounted(){
	    	console.log('pay------------------',this.params);
	    	this.payevent(this.currentpay);
	    },
		methods: {
			payevent: function (index) {
	            this.currentpay = index;
	            this.payOrder();
	        },
			//关闭窗口方法
			closed() {
				this.$emit('closed');
			},
			//支付生成二维码方法
			payOrder() {
				console.log('payOrder---------',this.params);
				if(this.currentpay === 0) {
					this.params.pay_way=1;
					this.codetext = "正在生成微信二维码";
				} else if(this.currentpay === 1) {
					this.params.pay_way=2;
					this.codetext = "正在创建支付宝订单";
				}
				
				console.log('this.codetext--',this.codetext);
				this.util.productPay(this.params).then(res => {
						console.log("payOrder", res, this.currentpay);
						if(this.currentpay == 0) {
							//微信
							this.codetext =
								"请用微信扫描支付,支付完成后请点击余额后面的刷新按钮查看余额,网络可能有少许延时,如支付成功后1小时余额仍未增加,请联系我们";
							let canvas = document.getElementById("canvas");
							QRCode.toCanvas(
								canvas,
								res, {
									errorCorrectionLevel: "H"
								},
								error => {
									if(error) {
										this.$message({
											type: "info",
											message: "微信支付码生成失败"
										});
									}
								}
							);
						} else {
							this.codetext = "创建支付宝订单成功,跳转支付宝支付";
							//支付宝
							let aliForm = document.getElementById("aliForm");
							aliForm.innerHTML = res;
							document.forms["alipay_submit"].submit();
						}
						this.getPayStatus();
					}).catch(err => {});
			},
			//清楚定时器方法
			clearPayInterval(){
				clearInterval(this.payInterval);
			},
			//支付轮询获取支付状态是否成功方法
			getPayStatus(){
				console.log('getPayStatus---------',)
				this.payInterval=setInterval(()=>{
					this.util.getProductStatus(this.params.order_id).then(res=>{
						//支付成功
						if(res.is_pay==1){
							this.$message.success('支付成功！');
							this.closed();
						}else{
							this.$message.error('支付失败！');
						}
					})
				},1000);
			},
			
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.wrap{
	background: red;
}
.box-card {
    .text {
        margin-top: 26px;
        margin-left: 44px;
        font-size: 15px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .money {
            font-size: 18px;
            font-weight: 600;
        }

        .red {
            color: #e92020;
        }

        .tip {
            color: #e92020;
            margin-top: 20px;
            margin-left: 80px;
            display:none;
        }
    }
}

.code {
    margin-top: 10px;
    margin-left: 44px;
    font-size: 15px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 174px;
    margin-left: 120px;

    .codepay {
        width: 174px;
    }

    .codetext {
        text-align: center;
        font-size: 10px;
    }
}

button,
input[type="text"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    border: none;
    height: 32px;
    outline: none;
    background: #fff;
    color: rgba(51, 51, 51, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 2px;
    cursor: pointer;
    margin-right: 9px;
}

.button {
    width: 60px;
}

.buttonpay {
    width: 90px;
}

input[type="text"] {
    width: 97px;
    padding: 0 8px;
}


.focuspay {
    border: 1px solid rgba(58, 127, 159, 1);
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
}

.iconpay {
    margin-right: 5px;
    width: 22px;
    height: 22px;
    vertical-align: middle;
}

.paytext {
    vertical-align: middle;
}

</style>