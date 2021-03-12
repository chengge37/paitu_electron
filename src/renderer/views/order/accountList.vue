<template>
  <div class="accountList">
    <div class="tab-box head">
      <div
        class="item tab-hover"
        v-for="(item,index) in tabs"
        :key="index"
        :class="{activeItem:index == active}"
        @click="changeTab(index)"
      >
        <span :class="{activeitem:index == active}">{{item.slice(0,2)}}</span>
        <span>{{item.slice(2)}}</span>
      </div>
      <div class="printBtn">
        <ali-svg-icon icon-class="dayin"></ali-svg-icon>
        <el-button type="text" @click="printCheck">打印核验单</el-button>
      </div>
    </div>

    <!--<div class="tab-box">
			<div class="title">运单号</div>
			<div class="trackNum">
				<el-input placeholder="请输入运单号"></el-input>
				<el-button icon="el-icon-edit">修改</el-button>
				<el-button class="save">保存</el-button>
				<el-button type="text" class="checkNum">查看运单号</el-button>
			</div>
    </div>-->

    <div class="tab-box">
      <div class="agreeHead">
        <div class="agreeTitle">协议模板</div>
        <el-select
          :disabled="!canEdit"
          v-model="selectAgree"
          placeholder="请选择"
          @change="changeAgree"
        >
          <el-option
            v-for="item in templateList"
            :key="item.tpl_id"
            :label="item.title"
            :value="item.content"
          ></el-option>
        </el-select>
        <el-button type="text" @click="operateTemplate" style="margin-left:10px;">管理模板</el-button>
      </div>

      <div class="agreeMent">
        <p>协议内容：</p>
        <tinymce v-model="content" :height="300" v-if="canEdit" />
        <div class="info" v-html="content" :height="300" v-else></div>
      </div>
    </div>

    <div ref="print" class="printInfo">
      <div class="fenye">
        <!--影棚设备列表信息-->
        <div class="tab-box" v-for="(item,index) in dataList" :key="index" v-show="showList">
          <div class="title">{{item.name}}</div>
          <ul :class="{'notEdit':!canEdit}">
            <li v-for="(subItem,index2) in item.imgInfo" :key="index2">
              <div class="img no-print">
                <!-- 上传图片 -->
                <div
                  v-if="canEdit"
                  class="pictures"
                  :class="{'showImg':subItem.pic2}"
                  @click.stop="changeImg(index,index2)"
                >
                  <el-upload
                    :show-file-list="false"
                    action="https://up-z2.qiniup.com/"
                    :data="picPostData"
                    list-type="picture-card"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                  >
                    <img :src="subItem.pic2" class="avatar" />
                    <i v-if="!subItem.pic2" class="el-icon-plus avatar-uploader-icon"></i>

                    <div class="operate" v-if="subItem.pic2">
											<el-button type="text" class="color-area" @click.stop="preview(subItem)">预览</el-button>
											<el-button type="text" class="color-area">更换</el-button>
										</div>
										
                  </el-upload>

                  <span v-if="!subItem.pic2" class="no-print">上传图片</span>
                </div>
                <img v-else :src="subItem.pic2" class="avatar" width="100%" height="100%" />
              </div>

              <!--打印区域-->
              <div class="printArea">
                <img
                  :src="subItem.pic2"
                  class="avatar"
                  width="225"
                  height="225"
                  style="margin:20px 20px 20px 0px;"
                />
                <span>{{subItem.content}}</span>
              </div>

              <div class="content no-print">
                <el-input
                  :disabled="!canEdit"
                  placeholder="请输入描述"
                  :class="{'canEdit':canEdit}"
                  type="textarea"
                  v-model="subItem.content"
                  class="no-print"
                ></el-input>
                <i
                  v-if="canEdit"
                  class="el-icon-delete delete no-print"
                  @click="delOption(index,index2)"
                ></i>
              </div>
            </li>
          </ul>
          <div class="addOption no-print" v-if="canEdit">
            <div class="cursor" @click="addOption(index)">
              <i class="el-icon-plus"></i>
              <el-button type="text">添加子项</el-button>
            </div>
          </div>
        </div>
      </div>

      <!--打印协议模块-->
      <div class="fenye" v-html="content" style="position:absolute;z-index:-10000;"></div>
    </div>

    <div class="saveOption">
      <el-button v-if="canEdit" @click="serveOptCheck">{{hasImgInfo?'修改核验单':'保存核验单'}}</el-button>
      <el-tooltip v-else class="item" effect="dark" content="用户已经同意，不能修改" placement="top">
        <el-button class="notEditBtn" v-permission>修改核验单</el-button>
      </el-tooltip>
    </div>

    <div class="tab-box">
      <div class="title">添加备注</div>
      <div class="remark">
        <span>输入备注：</span>
        <el-input :disabled="!canEdit" placeholder="请输入描述" type="textarea" v-model="remark"></el-input>
      </div>
    </div>

    <div class="tab-box" v-if="checkInfo">
      <div class="title">操作结果</div>
      <div class="options">
        <div class="option">
          <span>核验单状态：</span>
          <span class="result" v-if="checkInfo.status==1">客户已同意</span>
          <span class="result" v-if="checkInfo.status==2">客户已拒绝</span>
          <span class="result" v-if="checkInfo.status==0">客户没操作</span>
        </div>
        <div class="option" v-if="checkInfo.status==2">
          <span>拒绝理由：</span>
          <span class="result">核验单描述不符</span>
        </div>
        <div class="option" v-if="checkInfo.status==2">
          <span>理由：</span>
          <el-input type="textarea" disabled v-model="checkInfo.reject_msg"></el-input>
        </div>
        <div class="option">
          <span>操作时间：</span>
          <span class="result">{{checkInfo.create_time | time2Date}}</span>
        </div>
      </div>
    </div>

		<!--图片预览模块-->
		<el-dialog :visible.sync="showImagePreview">
			<el-carousel indicator-position="outside" height="600px" :autoplay="false" arrow="never">
				<el-carousel-item v-for="(item,index) in previewImgList" :key="index">
					<img :src="config.qiniuHost+item.pic" :onerror="util.errorPic" style="max-width: 100%;max-height: auto;display: block; margin: 0 auto;" />
				</el-carousel-item>
			</el-carousel>
		</el-dialog>

    <!--协议模板管理模块-->
    <agree-template
      v-if="showTemplate"
      :openDialog.sync="showTemplate"
      @closeTemplate="closeTemplate"
      @addTemplateSuccess="addTemplateSuccess"
    ></agree-template>
  </div>
</template>

<script>
import { checkPic } from "@util/picUtil.js";
import Tinymce from "ServeComponents/Tinymce";
import AgreeTemplate from "../../components/agreeTamplate/index";
  import ipcApi from "../../../renderer/utils/ipcRenderer";
  import { ipcRenderer } from "electron";
export default {
  name: "accountList",
  data() {
    return {
      webviewUr:
      process.env.NODE_ENV === "development"
        ? `http://localhost:9080/static/printCheck.html`
        : `file://${__static}/printCheck.html`,
      canEdit: true, //是否可以修改核验单 ,默认可以
      selectAgree: "",
      remark: "", //备注
      showTemplate: false, //是否显示模板对话框
      templateList: [],
      content: "", //协议内容
      active: "0",
      //				tabs: ["订单详情", "核验单详情"],
      tabs: ["核验单详情"],
      dataList: [],
      checkInfo: null, //核验单信息
      orderId: "",
      picPostData: {},
      index: "",
      index2: "",
      studioInfo: [],
      hasStudio: false,
      hasEquipment: false,
      orderDetail: {},
      hasImgInfo: false, //是否添加过图片信息，默认为false
      showList: true,
      showImagePreview:false,  //是否显示预览弹框
			previewImgList:[],  //预览图片列表
    };
  },
  async created() {
    if (this.$route.query.id) {
      this.orderId = this.$route.query.id;
      await this.serveGetCheck(this.orderId);
      this.getOrderDetail(this.orderId);
    }
  },
  components: {
    Tinymce,
    AgreeTemplate
  },
  mounted() {
    //获取协议模板列表
    this.getCheckTplList();
  },
  methods: {
  	//预览方法
			preview(item){
				console.log('preview--------',item);
				this.previewImgList=[];
				this.previewImgList.push(item);
				this.showImagePreview=true;
			},
  	
    //打印核验单
    printCheck() {
        let data = {
          url: this.webviewUr,
          sendData:{}
        };
      this.getRequest('order/serveGetCheck',{order_id:this.orderId}).then(res=>{
        res.detail_array.forEach(item=>{
          item.pic=this.$qiniuHost + item.pic;
        })
        data.sendData={
          content:res.content,
          list:res.detail_array
        };
        console.log(data.sendData);
        ipcRenderer.send("open-win", data);
      })
      
    },
    //获取协议模板列表
    getCheckTplList() {
      this.util.serveGetCheckTplList().then(res => {
        console.log("serveGetCheckTplList------", res);
        this.templateList = res.rows;
      });
    },

    //获取订单信息
    getOrderDetail(orderId) {
      this.util.getOrderDetail(orderId).then(res => {
        console.log("getOrderDetail-----", res);
        this.orderDetail = res;
        if (this.hasImgInfo) return;

        if (res.has_studio == "1" && res.has_equipment == "1") {
          this.hasStudio = true;
          this.hasEquipment = true;
          let studioDetail = res.studio_order.studio_detail;
          let studioObj = {
            id: studioDetail.id,
            name: studioDetail.name,
            imgInfo: [
              {
                pic: "",
                content: ""
              }
            ]
          };
          this.dataList.push(studioObj);
          let dataList = res.studio_order.equip_order_array;
          dataList.forEach((item, index) => {
            let obj = {
              id: item.equip.id,
              name: item.equip.static.name,
              imgInfo: [
                {
                  pic: "",
                  content: ""
                }
              ]
            };
            this.dataList.push(obj);
          });
          console.log("dataList-------", this.dataList);
        } else if (res.has_studio == "1") {
          this.hasStudio = true;
          let studioDetail = res.studio_order.studio_detail;
          let studioObj = {
            id: studioDetail.id,
            name: studioDetail.name,
            imgInfo: [
              {
                pic: "",
                content: ""
              }
            ]
          };
          this.dataList.push(studioObj);
        } else if (res.has_equipment == "1") {
          this.hasEquipment = true;
          let dataList = res.equip_order;
          dataList.forEach((item, index) => {
            let obj = {
              id: item.equip.id,
              name: item.equip.static.name,
              imgInfo: [
                {
                  pic: "",
                  content: ""
                }
              ]
            };
            this.dataList.push(obj);
          });
        }
        console.log("dataList-------", this.dataList);
      });
    },
    //商家查询核验单
    serveGetCheck(orderId) {
      return new Promise((resolve, reject) => {
        this.util.serveGetCheck(orderId).then(res => {
          console.log("serveGetCheck---------", res);
          //判断是否已经添加过核验单图片信息
          if (res) {
            this.hasImgInfo = true;
            this.content = res.content;
            this.remark = res.remark;
            this.status = res.status;
            this.checkInfo = res;
            if (res.status == 1) {
              this.canEdit = false;
            }
            res.detail_array.forEach((item, index) => {
              if (item.type == "1") {
                this.hasStudio = true;
              }
              if (item.type == "2") {
                this.hasEquipment = true;
              }
              item.pic2 = this.$qiniuHost + item.pic;
            });
            let list = this.util.changeArr(res.detail_array);
            this.dataList = list;
            console.log("serveGetCheck+++++++++++++", list);
          }
          resolve(true);
        });
      });
    },

    //商家添加，修改核验单方法
    serveOptCheck() {
      console.log("serveOptCheck---------", this.dataList);
      let params = {
        order_id: this.orderId,
        content: this.content,
        remark: this.remark
      };
      let tempArr = this.dataList;
      for (let i = 0; i < tempArr.length; i++) {
        for (let item in tempArr[i]) {
          if (item == "imgInfo") {
            for (let j = 0; j < tempArr[i][item].length; j++) {
              if (!tempArr[i][item][j].content || !tempArr[i][item][j].pic) {
                this.$message.warning("图片和描述不能为空!");
                return;
              }
            }
          }
        }
      }
      if (this.hasStudio) {
        params.studio_check = {
          studio_id: this.dataList[0].id,
          detail_array: this.dataList[0].imgInfo
        };
      }
      if (this.hasEquipment) {
        let list = [];
        if (this.hasStudio) {
          list = this.util.deepcopy(this.dataList).splice(1);
        } else {
          list = this.dataList;
        }
        params.equip_check_array = [];
        list.forEach((item, index) => {
          item.imgInfo.forEach((subItem, index2) => {
            let obj = {
              equip_id: item.id,
              pic: subItem.pic,
              content: subItem.content
            };
            params.equip_check_array.push(obj);
          });
        });
      }

      if (this.hasImgInfo) {
        params.order_check_id = this.checkInfo.id;
        this.util.serveEditCheck(params).then(res => {
          console.log("serveEditCheck--------", res);
          this.$message.success("修改核验单成功！");
          this.back();
        });
      } else {
        this.util.serveAddCheck(params).then(res => {
          console.log("serveOptCheck--------", res);
          this.$message.success("添加核验单成功！");
          this.back();
        });
      }

      console.log("params-------", params);
    },

    //返回上一个路由
    back() {
      this.util.back(this);
    },

    //打印协议模板方法
    print() {
      this.$print(this.$refs.print);
    },
    //切换协议方法
    changeAgree(val) {
      console.log("changeAgree----", val);
      this.content = val;
    },
    //添加模板方法
    operateTemplate() {
      console.log("addTemplate-------");
      this.showTemplate = true;
    },
    //添加协议模板成功回调方法
		addTemplateSuccess(){
			this.getCheckTplList();
		},
    //关闭协议模板方法
    closeTemplate(val) {
      this.showTemplate = false;
    },
    //选择图片方法
    changeImg(index, index2) {
      console.log("changeImage-----", index, index2);
      this.index = index;
      this.index2 = index2;
    },
    //添加子项方法
    addOption(index) {
      console.log("addOption------", index);
      let obj = {
        pic: "",
        content: ""
      };
      this.dataList[index].imgInfo.push(obj);
    },
    //删除选项
    delOption(index, index2) {
      console.log("index---", index, index2);
      console.log("this.dataList------", this.dataList);
      if (this.dataList[index].imgInfo.length <= 1) {
        this.$message.warning("每个影棚或设备至少需要1个描述，不能删除!");
        return;
      }
      this.util
        .confirm(this)
        .then(res => {
          if (res) {
            console.log("delOption----", index, index2);
            this.dataList[index].imgInfo.splice(index2, 1);
          }
        })
        .catch(err => {});
    },
    //上传图片前方法
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let picKey = checkPic(file, 1, 2);
            if (!picKey) return;
            let token = await this.getRequest(
              "/qiniu/userGetQiniuUpToken?key=" + picKey
            );
            this.picPostData = token;
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };
        Sync();
      });
    },
    //上传图片成功
    handleSuccess(response, file) {
      let imageUrl = this.$qiniuHost + response.key;
      console.log("imgInfo------", imageUrl, this.index, this.index2);
      this.$set(
        this.dataList[this.index].imgInfo[this.index2],
        "pic2",
        imageUrl
      );
      this.$set(
        this.dataList[this.index].imgInfo[this.index2],
        "pic",
        response.key
      );
      this.showList = false;
      this.$nextTick(() => {
        this.showList = true;
      });
      //				this.$nextTick(()=>{
      //					this.dataList[this.index].imgInfo[this.index2].pic2=imageUrl;
      //					this.dataList[this.index].imgInfo[this.index2].pic=response.key;
      //				})
      console.log("this.dataList-------", this.dataList);
    },
    changeTab(data) {
      console.log(data);
      this.active = data;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
@media print {
  .printArea {
    display: flex !important;
    align-items: center;
  }
}
.printArea {
  display: none;
  align-items: center;
}
.fenye {
  page-break-after: always;
}
/deep/ {
  .el-textarea {
    height: 100%;
    padding-right: 40px;
  }
  .el-textarea__inner {
    background: #fafafa;
    border-radius: 0px;
    height: 100%;
    resize: none;
  }
}
.agreeHead {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0px 20px 40px;
  margin-bottom: 40px;
  .agreeTitle {
    font-size: 20px;
    color: #333;
    margin-right: 20px;
  }
}
.saveOption {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
  button {
    color: #fff;
    padding: 20px 90px;
    font-size: 18px;
    background: rgba(101, 31, 255, 1);
    box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.04);
    border-radius: 34px;
  }
}
/*协议样式*/
.agreeMent {
  padding: 0px 40px 20px 40px;
  p {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
  .info {
    border: 1px solid #ddd;
    padding: 20px;
  }
}
.accountList {
  .head {
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .head {
    padding: 0px 40px;
    display: flex;
    justify-content: space-between;
  }
  .tab-box {
    color: #33333381;
    background: #fff;
    margin-bottom: 10px;
    .options {
      padding-left: 40px;
      padding-bottom: 10px;
      margin-bottom: 35px;
      .option {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        & > span:first-child {
          width: 90px;
          display: inline-block;
        }
        .result {
          color: #333333;
          font-weight: 600;
        }
      }
    }
    .remark {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      padding-bottom: 20px;
      span {
        padding-left: 40px;
        width: 120px;
      }
    }
    .addOption {
      display: flex;
      justify-content: flex-end;
      padding-right: 40px;
      padding-bottom: 20px;
      button {
        padding: 0px;
      }

      & > div {
        border: 1px solid #7c6aff;
        padding: 10px 10px;
      }
      i {
        color: #7c6aff;
        margin-right: 10px;
      }
    }
    ul {
      &.notEdit {
        padding-bottom: 30px;
      }
      padding-left: 40px;
      li {
        display: flex;
        margin-left: 0px;
        margin-bottom: 10px;

        .content {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding-right: 40px;
          .delete {
            position: absolute;
            bottom: 2px;
            right: 39px;
            z-index: 100;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            padding: 14px 5px 2px 15px;
          }
        }
        .el-textarea {
          height: 225px;
          padding-right: 0px !important;
          overflow: hidden;
          &.canEdit:after {
            cursor: pointer;
            content: "";
            position: absolute;
            right: 0;
            bottom: -60px;
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            transform: translate(50%, -50%) rotateZ(45deg);
            font-size: 14px;
            color: #243041;
            font-weight: 600;
            padding-bottom: 10px;
            box-sizing: border-box;
            background: #d4282d;
          }
        }
        p {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        .img {
          width: 225px;
          height: 225px;
          background: #fff;
          border: 1px solid #f0f0f0;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          .pictures {
            text-align: center;
            /deep/ .el-upload--picture-card {
              width: 100px;
              height: 100px;
              line-height: 110px;
              border: 1px solid #f0f0f0;
              border-radius: 0px;
              background: #fafafa;
              margin-bottom: 10px;
            }
            &.showImg {
              /deep/ .el-upload--picture-card {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 225px;
                height: 225px;
                background: none;
                border: none;
                margin: 0px;
                img {
                  max-width:  calc(100% - 2px);
                  max-height: calc(100% - 2px);
                }
              }
            }
            &:hover{
							.operate{
								display:flex;
							}
						}
          }
         
         .operate{
							position: absolute;
							display:none;
							flex-direction:column;
						    left: 50%;
						    top: 50%;
						    -webkit-transform: translate(-50%, -50%);
						    transform: translate(-50%, -50%);
						    color: #fff;
						    /deep/{
						    	.el-button{
						    		width: 80px;
								    height: 34px;
								    background: rgba(0,0,0,.5);
								    color: #fff;
								    margin-bottom:10px;
								    &:last-child{
								    	margin-bottom:0px;
								    }
						    	}
						    	.el-button+.el-button{
						    		margin-left:0px;
						    	}
						    }
						}
						
						&:hover {
							.operate{
								display: flex;
							}
						}
         
        }
      }
    }
    .save {
      background: #7c6aff;
      color: #fff;
    }
    .trackNum {
      display: flex;
      padding-left: 40px;
      align-items: center;
      padding-bottom: 20px;

      button {
        border: 1px solid #f0f0f0;
      }
      .el-input {
        width: 210px;
      }
      /deep/ .el-input__inner {
        border-radius: 0px;
        height: 40px;
        background: #fafafa;
      }
      .el-button {
        border-radius: 0px;
        margin-left: 0px;
      }
      .checkNum {
        color: #7c6aff;
        font-size: 14px;
        margin-left: 15px;
        border: none;
      }
    }
    .title {
      padding-top: 20px;
      font-size: 20px;
      color: #333333;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
      text-align: left;
      padding-left: 40px;
      margin-bottom: 40px;
    }
    .item {
      display: flex;
      margin-right: 20px;
      cursor: pointer;
      font-size: 20px;
      color: #4e475c;
      span {
        padding: 8px 0;
        box-sizing: border-box;
      }
    }
    .activebox {
      color: #333333;
    }
    .activeitem {
      border-bottom: 2px solid #7c6aff;
    }
  }
}
</style>