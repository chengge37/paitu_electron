<template>
  <div class="newServe">
    <div class="top-nav">
      <div class="top-active">
        <el-button type="primary" @click="printCode">打印条码</el-button>
      </div>
    </div>

    <!--优惠券列表表格-->
    <el-table :data="list" v-loading="listLoading">
      <el-table-column  align="center" type="index" label="序号" width="55"></el-table-column>
      <!--<el-table-column align="center" label="序号" width="95">
	        <template slot-scope="scope">
	          <span>{{(listParams.page-1)*listParams.pageSize+scope.$index+1}}</span>
	        </template>
      </el-table-column>-->
      <el-table-column align="center" prop="category_name" label="设备分类"></el-table-column>
      <el-table-column align="center" prop="name" label="设备名称"></el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="{row}">
          <el-image :src="$qiniuHost+row.pic.split(',')[0]" fit="contain" style="width:50px; height: 50px"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sn" label="sn码"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{row}">
          <span v-if="row.type==0">无</span>
          <span v-if="row.type==1">出库</span>
          <span v-if="row.type==2">入库</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="operate" type="text">出库</el-button>
          <el-button @click="operate" type="text">入库</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页模块-->
    <pagination
      :total="parseInt(listParams.total_count)"
      :page="parseInt(listParams.page)"
      :pagesize="parseInt(listParams.pageSize)"
      @getPageNum="changePage"
      class="pagination"
    ></pagination>

    <el-dialog :visible.sync="selectCode" class="dialog" @closed="closed" title="选择条码" center>
      <div class="login-box">
        <div class="block">
          <span class="demonstration">多选可搜索</span>
          <el-cascader
            placeholder="试试搜索：设备"
            v-model="selectCodeList"
            @change="changeCode"
            :options="equitList"
            :props="{ multiple: true,value: 'label', }"
            filterable
          ></el-cascader>
        </div>

        <div class="bottomBtn">
          <el-button type="primary" @click="confirmPrint('0')">打印条码</el-button>
          <el-button type="primary" @click="confirmPrint('1')">打印二维码</el-button>
          <el-button type="default" @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <div ref="print" class="printInfo">
      <div class="printArea">
        <ul class="barList">
          <li v-for="(item,index) in printList" :key="index">
            <img :id="'barcode'+index" />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div ref="print2" class="printInfo">
      <div class="printArea">
        <ul class="barList">
          <li v-for="(item,index) in printList" :key="index">
            <div :id="'qrcode'+index" :ref="'qrcode'+index"></div>
            <span style="margin:15px 0px;">{{item.code}}</span>
            <p class="overTip">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pagination from "ServeComponents/FrontComponents/pagination";
import JsBarcode from "jsbarcode";
import QRCode from "qrcodejs2";
import ipcApi from "../../../renderer/utils/ipcRenderer";
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    webviewUr:
      process.env.NODE_ENV === "development"
        ? `http://localhost:9080/static/printCode.html`
        : `file://${__static}/printCode.html`,
    listLoading: true,
    listParams: {
      page: 1,
      pageSize: 10,
      total_count: 0
    },

    equitList: [], //设备列表
    allEquitList: [], //全部设备列表
    list: [],
    selectCode: false, //是否显示选择条码弹窗
    selectCodeList: "", //选择的码列表
    printList: [], //打印的列表
    printType: "", //打印模式，0/条码,1/二维码
    showQr: false,
    oldList: [] //保存数据
  }),

  computed: {
    ...mapGetters(["user_data"])
  },
  components: {
    pagination
  },

  careted() {
    //			this.getEquipCodeList();
  },
  mounted() {
    this.getEquipCodeList();
  },

  methods: {
    //获取code列表，显示列表使用
    getEquipCodeList(type) {
      this.listLoading = true;
      let params = {
        page: this.listParams.page
      };
      if (type) {
        params.page_size = 9999999;
      }
      this.util
        .getEquipCodeList(params)
        .then(res => {
          console.log("getEquipCodeList-------", res);
          this.listLoading = false;
          this.list = res.rows;
          this.listParams.page = parseInt(res.page);
          this.listParams.page_size = parseInt(res.page_size);
          this.listParams.total_count = parseInt(res.total_count);
          if (type) {
            this.allEquitList = res.rows;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },

    //获取所有设备和sn码
    getEquipList() {
      let params = {
        page: 1,
        page_size: 100000000
      };
      this.util.getEquip(params).then(res => {
        console.log("getEquip---------", res);
        let list = [];
        res.rows.forEach((item, index) => {
          if (!this.util.isEmpty(item.sn_array)) {
            let children = [];
            let obj;
            item.sn_array.forEach((subItem, index2) => {
              obj = {
                value: subItem.id,
                label: subItem.sn
              };
              children.push(obj);
            });
            let obj2 = {
              value: item.id,
              label: item.custom_desc,
              children: children
            };
            list.push(obj2);
          }
        });
        this.equitList = list;
        console.log("list----------", list);
      });
    },

	//出入库方法
	operate(){
		//获取权限方法
		this.util.checkFuns(1).then(res=>{
			console.error('operate----',res);
			if(res){
				this.$message.warning('功能建设中！');
			}else{
				
			}
		});
		
	},

    //页面切换方法
    changePage(val) {
      this.listParams.page = val;
      this.getEquipCodeList();
    },

    //选择条码方法
    changeCode(val) {
      //清空二维码
      this.printList.forEach((item, index) => {
        document.getElementById("qrcode" + index).innerHTML = ""; //置空
      });

      //生成条码,二维码
      this.printList = [];
      this.selectCodeList.forEach((item, index) => {
        let obj = {};
        obj.name = item[0];
        obj.code = item[1];
        this.printList.push(obj);
      });

      this.$nextTick(() => {
        //生成条码
        this.printList.forEach((item, index) => {
          this.createBarCode("barcode" + index, item.code + "");
        });
        //生成二维码
        this.printList.forEach((item, index) => {
          this.qrcode(index, item.code + "");
        });
      });
    },

    //显示选择条码方法
    printCode() {
      this.selectCode = true;
      this.getEquipList("all");
    },
    // ipcRenderer.send("open-win", data);

    //确认打印条码，二维码，0/条码,1/二维码
    confirmPrint(type) {
			this.printType = type;
			let data;
      if (type == 0) {
        //打印条码
        data = {
          url: this.webviewUr,
          sendData: {
          list: this.printList,
          type: 0
          },
        };
      } else if (type == 1) {
        data = {
          url: this.webviewUr,
          sendData: {
          list: this.printList,
          type: 1
          },
        };
			}
			console.log(data,"--------------------skdjk-------------");
      ipcRenderer.send("open-win", data);
    },

    //关闭对话框方法
    closed() {
      this.selectCode = false;
    },

    //取消方法
    cancel() {
      this.selectCode = false;
      console.log("cancel---------");
    },

    //生成条形码
    createBarCode(id, text) {
      JsBarcode("#" + id, text, {
        format: "CODE128", //选择要使用的条形码类型 比较长
        //					format:'CODE39',   //很长
        //					format:'pharmacode',
        text: text, //显示文本
        displayValue: true, //是否在条形码下方显示文字
        textPosition: "bottom", //设置文本的垂直位置
        //				fontOptions: "bold italic", //使文字加粗体或变斜体
        background: "#fff", //设置条形码的背景
        fontSize: 10, //设置文本的大小
        width: 1,
        height: 30,
        //				font: "fantasy", //设置文本的字体
        lineColor: "#000", //设置条和文本的颜色。
        margin: 15 //设置条形码周围的空白边距
      });
    },

    //生成二维码
    qrcode(id, text) {
      // 和div的id相同 必须是id  class类名会报错
      this.qrCode = new QRCode("qrcode" + id, {
        width: 150,
        height: 150,
        text: text,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel : QRCode.CorrectLevel.L //由低到高 .L M Q H
      });
    }
  }
};
</script>
<style lang='scss' scoped>
@media print {
  .printArea {
    display: block !important;
  }
}

/deep/ {
  .el-cascader {
    width: 330px;
  }
}
.printArea {
  display: none;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      text-align: center;
      span {
        width: 120px;
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
      }
    }
  }
  .overTip {
    width: 120px;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
  }
  .barList {
    li {
      margin-right: 20px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
    }
  }
  #qrcode {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
    }
  }
}
</style>