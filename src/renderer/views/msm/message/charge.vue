<template>
   <div class="newServe">
    <div class="top-nav">
        <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
            <el-tab-pane label="短信管理" name="0"></el-tab-pane>
        </el-tabs>
        <div @click="back" class="back word-hover">
            <ali-svg-icon icon-class="back" class-name="back-one"></ali-svg-icon>
            <ali-svg-icon icon-class="back" class-name="back-two"></ali-svg-icon>
            <span>返回</span>
        </div>
    </div>
    <div class="line"></div>
    <el-card class="box-card">
        <div class="card_title">购买</div>
        <el-row :gutter="20" class="box_detail">
            <el-col :span="9">
                <div class="left_box">
                    <div class="text">
                        剩余条数：
                        <span class="money">{{leftCount}}条</span>
                        <el-button :loading="refreshBalanceLoading" class="refresh" @click="refreshBalance()" type="primary" size="mini">刷新</el-button>
                    </div>
                    <div class="text chargMoney">
                        购买条数：
                        <button class="button" v-for="(item, index) in smsList" :key="index" :class="{ 'focus':index==moneyIndex}" @click="focusevent(index,item)">{{item.num}}</button>
                        <!--<input type="text"  v-only-number="{min:0,precision:2}" placeholder="其它金额" v-model="enternums" @blur="inputBlur" @focus="inputFocus"/>元-->
                        <!--<p class="tip">请输入1.00~99999范围内的数字，小数点后最多两位</p>-->
                    </div>
                    <div class="text">
                        支付方式：
                        <button class="buttonpay" v-for="(item, index) in pays" :key="index" :class="{ 'focuspay':index==currentpay}" @click="payevent(index,$event)">
                            <ali-svg-icon :icon-class="item.icon" class-name="iconpay"></ali-svg-icon>
                            <span class="paytext">{{item.text}}</span>
                        </button>
                    </div>
                    <div class="text">
                        支付金额：￥
                        <span class="money red">{{paymoney}}</span>
                    </div>
                    <div class="code">
                        <canvas class="codepay" id="canvas"></canvas>
                        <p class="codetext">{{codetext}}</p>
                        <div id="aliForm"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="right_box">
                    <div class="line1">
                        <p class="left">价格一览：</p>
                        <p class="right">购买越多优惠力度越大噢</p>
                    </div>
                    <div class="line2">
                        <div class="line2_item" v-for="(item,index) in smsList" :key="index">
                            <p class="tiao">{{item.num}}条</p><p>¥{{item.one}}元/条</p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="card_title">购买历史</div>
        <el-table :data="chargeHistoryArray" border :v-loading="chargeHistoryLoading" style="width: 100%">
            <el-table-column prop="create_time" label="日期">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.create_time|time2Date('YYYY-MM-DD hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pay_way" label="支付方式">
                <template slot-scope="scope">
                    {{ scope.row.pay_way|payWayFilter }}
                </template>
            </el-table-column>
            <el-table-column prop="show_id" label="订单号">
            </el-table-column>
            <el-table-column prop="money" label="金额">
            </el-table-column>
        </el-table>
        <el-pagination @current-change="loadChargeHistory()" :current-page.sync="loadChargeHistoryParameters.page" :page-size="loadChargeHistoryParameters.page_size" layout="total, prev, pager, next" :total="chargeHistoryTotalCount"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { sms } from "@/config/api.js";
import QRCode from "qrcode";
import { format } from "date-fns";
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    webviewUr:
      process.env.NODE_ENV === "development"
        ? `http://localhost:9080/static/alipay.html`
        : `file://${__static}/alipay.html`,
    timer: null,
    tabIndex: 0,
    moneyIndex: 0,
    currentpay: 0,
    enternums: null,
    leftCount: "0", //剩余短信条数
    paymoney: "0",
    showtip: false,
    codetext: "",
    nums:[],
    pays: [
      {
        text: "微信",
        icon: "weixinPay"
      },
      {
        text: "支付宝",
        icon: "aliApy_round"
      }
    ],
    refreshBalanceLoading: false,
    chargeHistoryArray: [],
    loadChargeHistoryParameters: {
      page: 1,
      page_size: 10
    },
    chargeHistoryTotalCount: 0,
    chargeHistoryLoading: false,
    smsList:[],   //短信信息
  }),
  components: {},
  filters: {
    payWayFilter(payWay) {
      return payWay == 1 ? "微信" : "支付宝";
    }
  },
  created(){
  	this.getSmsNum();
  },
  async mounted() {
    this.loadChargeHistory();
    await this.getSmsPrice();
    console.log('this.smsList-------',this.smsList);
    this.paymoney = this.smsList[this.moneyIndex].money;
    this.payOrder();
    this.autoRefreshBalance();
    this.getSmsPrice();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
  	//获取商家短信条数
  	getSmsNum(){
  		this.util.getSmsNum().then(res=>{
  			console.log('getSmsNum---------',res);
  			this.leftCount=res;
  		})
  	},
  	
  	//获取短信价格
  	getSmsPrice(){
  		return new Promise((resolve,reject)=>{
  			this.util.getSmsPrice().then(res=>{
	  			console.log('getSmsPrice-------',res);
	  			this.smsList=res;
	  			this.nums=res.map((item,index)=>{
	  				return item.num;
	  			})
	  			resolve(true);
	  		})
  		})
  		
  	},
  	
    //自动刷新金额
    autoRefreshBalance() {
      this.timer = setInterval(() => {
        this.util.getSmsNum().then(
          res => {
						if(this.leftCount!==res){
							clearInterval(this.timer);
							this.leftCount = res;
							this.$alert("充值成功", "成功", {
              confirmButtonText: "确定",
              type: "success",
              callback: action => {
								this.$router.go(-1);
							}
            });
						}
          },
          err => {
            clearInterval(this.timer);
          }
        );
      }, 2000);
    },
    inputFocus(val) {
      console.log("inputFocus------", val);
      if (this.enternums) {
        this.paymoney = this.enternums;
      }
      this.moneyIndex = -1;
    },
    inputBlur() {
      if (!this.enternums) {
        this.enternums = "1.00";
      }
    },
    //返回上一级路由
    back() {
      this.$router.go(-1);
    },
    tabClick(val) {
      this.showReplyList = false;
      //清空回复框输入的内容
      this.inputReply = "";
    },
    focusevent: function(index, num) {
      console.log("index-----", index);
      this.moneyIndex = index;
      this.paymoney=this.smsList[index].money;
      this.showtip = false;
    },

    payevent: function(index, event) {
      this.currentpay = index;
      this.payOrder();
    },
    refreshBalance() {
      this.getSmsNum();
    },
    payOrder() {
      if (this.currentpay === 0) {
        this.codetext = "正在生成微信二维码";
      } else if (this.currentpay === 1) {
        this.codetext = "正在创建支付宝订单";
      }
      this.postRequest(sms.pay, {
        pay_way: this.currentpay + 1,
        money: this.paymoney
      })
        .then(res => {
          console.log("payOrder", res, this.currentpay);
          if (this.currentpay == 0) {
            //微信
            this.codetext =
              "请用微信扫描支付,支付完成后请点击余额后面的刷新按钮查看余额,网络可能有少许延时,如支付成功后1小时余额仍未增加,请联系我们";
            let canvas = document.getElementById("canvas");
            QRCode.toCanvas(
              canvas,
              res,
              {
                errorCorrectionLevel: "H"
              },
              error => {
                if (error) {
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
            let data = {
              url: this.webviewUr,
              sendData: res,
              IsPay: true
            };
            ipcRenderer.send("open-win", data);
          }
        })
        .catch(err => {});
    },
    //充值历史
    loadChargeHistory() {
      this.chargeHistoryLoading = true;
      this.getRequest(sms.getChargeHistory, this.loadChargeHistoryParameters)
        .then(res => {
          this.chargeHistoryLoading = false;
          this.chargeHistoryTotalCount = parseInt(res.total_count);
          this.loadChargeHistoryParameters.page = parseInt(res.page);
          this.loadChargeHistoryParameters.page_size = parseInt(res.page_size);
          this.chargeHistoryArray = res.rows;
        })
        .catch(err => {
          this.chargeHistoryLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  min-width: 800px;
}

.box_detail {
  .right_box {
    margin-top: 50px;
    border: 1px solid #bd10e0;
    border-radius: 4px;
    background-color: #f7f7f7;
    padding: 10px;
    .line1 {
      display: flex;
      justify-content: space-between;
      .right {
        font-size: 12px;
        color: #696673;
      }
    }
    .line2 {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      text-align: center;
      .tiao {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}

.top-nav {
  height: auto;
  display: flex;
  justify-content: space-between;
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
  margin-top: -16px;
  margin-bottom: 5px;
}

.box-card {
  margin-top: 29px;
  width: 100%;
  .card_title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    border-left: 8px solid $Theme-color;
    border-radius: 4px;
    margin-left: 23px;
    padding-left: 12px;
  }
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
    .refresh {
      color: #fff;
    }
    .red {
      color: #e92020;
    }
    .tip {
      color: #e92020;
      margin-top: 20px;
      margin-left: 80px;
      display: none;
    }
  }
  .chargMoney {
    input:focus {
      & + p {
        display: block;
      }
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

.focus {
  // background: rgba(58, 127, 159, 1);
  border: 1px solid #bd10e0;
  color: #bd10e0;
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

.el-tabs--card /deep/ .el-tabs__header .el-tabs__item.is-active {
  background: $Theme-color;
  border-radius: 5px 5px 0px 0px;
  color: #fff;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>