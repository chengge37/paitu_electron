<!--  -->
<template>
  <div class="newServe" ref="container">
    <!-- 头部 -->
    <header class="header">
      <el-button type="default" @click="back">返回</el-button>
    </header>

    <!-- 全部表单信息 -->
    <el-form ref="studioForm" :model="studioForm" class="studio-form">
      <!-- 图片展示 -->
      <div class="picture-show card">
        <!-- 标题 -->
        <Title titleName="图片展示（至少上传一张）"></Title>
        <!-- 当设备详情页为可编辑的时候，显示上传图片框 -->
        <!-- <div class="pictures">
          <el-upload
            :disabled="!editable"
            :limit="8"
            :on-exceed="handleExceed"
            :multiple="true"
            :file-list="imgList"
            :show-file-list="true"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :data="picPostData"
            action="https://up-z2.qiniup.com/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleImgChange"
            :before-remove="beforeRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" class="el-img" :src="dialogImageUrl" alt />
          </el-dialog>
        </div> -->
        <!-- 影棚图片裁剪，最多上传8张，裁剪宽高比例为16/9 -->
        <clipper :resultWidth="600" :editable="editable" :imgList="imgList" @delSuccess="delSuccess" @uploadSuccess="uploadSuccess" :uploadWidth="148" :uploadHeight="148" :uploadNum="uploadNum" :ratio="16/9"></clipper>

      </div>

      <!-- 影棚信息 -->
      <div class="studio-info card">
        <!-- 标题 -->
        <Title titleName="影棚信息"></Title>
        <!-- 影棚信息表单 -->
        <div class="basic-table">
          <el-row :gutter="100">
            <el-col :span="8">
              <el-form-item label="影棚名称" :required="true">
                <el-input :disabled="!editable" placeholder="请输入名称,不少于4个字符" v-model="studioForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在楼层" :required="true">
                <el-input :disabled="!editable" placeholder="请输入楼层" v-model="studioForm.floor"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="100">
            <el-col :span="8">
              <el-form-item label="影棚面积" :required="true">
                <el-input :disabled="!editable" placeholder="请输入影棚面积，值为正整数" v-model="studioForm.square"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="影棚类型" :required="true">
                <el-select :disabled="!editable" v-model="studioForm.typeClassify" placeholder="请选择">
                  <el-option
                    v-for="item in studioTypeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 服务设施 -->
      <div class="studio-facility card">
        <!-- 标题 -->
        <Title titleName="服务设施"></Title>

        <!-- 设施项目多选 -->
        <el-row class="box-wrap" v-if="editable">
          <el-checkbox
            class="all"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAll"
            ref="allCheck"
          >全选</el-checkbox>
          <el-checkbox-group v-model="checkedConditon" @change="selectCondition">
            <el-checkbox
              v-for="(condition,index) in conditionArr"
              :label="condition.name"
              :key="index"
            >{{condition.name}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
        <!-- 设施项目展示 -->
        <el-row v-else class="box-wrap">
          <div class="condition-item" v-for="(condition,index) in conditionModel" :key="index">
            <i :class="condition.icon"></i>
            <span>{{condition.name}}</span>
          </div>
        </el-row>
      </div>

      <!-- 具体收费 -->
      <div class="charge card">
        <!-- 标题 -->
        <Title titleName="具体收费"></Title>
        <!-- 按时收费 -->
        <div class="charge-title">
          <div>
            <span class="red-color">*</span>
            <span>按时收费</span>
          </div>
          <!-- <div v-if="editable" class="add-more" @click="addHourChargeRow">继续添加</div> -->
        </div>
        <div class="charge-table">
          <div class="table-head">
            <span>使用时长</span>
            <div class="center">
              <span>工作日工作时间</span>
              <span>工作日非工作时间</span>
              <span>周末工作时间</span>
              <span>周末非工作时间</span>
              <span>节假日工作时间</span>
              <span>节假日非工作时间</span>
            </div>
            <!-- <span v-if="editable">操作</span> -->
          </div>
          <div class="charge-item">
            <div class="using-time">
              <el-col class="day">1 小时</el-col>
            </div>
            <div class="charge-row">
              <div class="row-item">
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceWorkDayWorkTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceWorkDayOverTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceWeekEndWorkTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceWeekEndOverTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceHolidayWorkTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    maxlength="6"
                    v-model="studioForm.priceHolidayOverTimePerHour"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- <div class="operation" v-if="editable">
              <el-button class="del-btn" @click="delHourChargeRow(index)">删除</el-button>
            </div>-->
          </div>
          <!-- <div class="no-item" v-if="!studioForm.charge.hourCharge.length">暂无数据</div> -->
        </div>

        <!-- 按天收费 -->
        <div class="charge-title">
          <div>
            <span class="red-color">*</span>
            <span>按天收费</span>
          </div>
          <!-- <div v-if="editable" class="add-more" @click="addDayChargeRow">继续添加</div> -->
        </div>
        <div class="charge-table">
          <div class="table-head">
            <span>使用天数</span>
            <div class="center">
              <span>工作日</span>
              <span>周末</span>
              <span>节假日</span>
            </div>
            <!-- <span v-if="editable">操作</span> -->
          </div>
          <div class="charge-item">
            <div class="using-time">
              <el-col class="day">1 天</el-col>
              <!-- <el-select
                :disabled="!editable"
                placeholder="1天"
                v-model="item.usingDay"
                style="width:90px"
              >
                <el-option label="1小时" value="1"></el-option>
                <el-option label="2小时" value="2"></el-option>
              </el-select>-->
            </div>
            <div class="charge-row">
              <div class="row-item">
                <div>
                  <el-input
                    class="day-input"
                    v-model="studioForm.priceWorkDayAllDay"
                    maxlength="6"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    class="day-input"
                    v-model="studioForm.priceWeekEndAllDay"
                    maxlength="6"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
                <div>
                  <el-input
                    class="day-input"
                    v-model="studioForm.priceHolidayAllDay"
                    maxlength="6"
                    :disabled="!editable"
                  >
                    <div slot="suffix">￥</div>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- <div class="operation" v-if="editable">
              <el-button class="del-btn" @click="delDayChargeRow()">删除</el-button>
            </div>-->
          </div>
          <!-- <div class="no-item" v-if="!studioForm.charge.dayCharge.length">暂无数据</div> -->
        </div>
      </div>

      <!-- 视频展示 -->
      <div class="videograph-wrap card">
        <!-- 标题 -->
        <Title titleName="视频"></Title>
        <!-- 视频展示 -->
        <div class="video-wrap">
          <!-- 视频 -->
          <!-- 视频展示 -->
          <!-- <div class="video" v-if="!editable">
            <video width="572" height="327" controls>
              <source src="movie.mp4" type="video/mp4">
              <source src="movie.ogg" type="video/ogg">您的浏览器不支持 video 标签。
            </video>
          </div>-->

          <!-- 添加视频 -->
          <el-upload
            :disabled="!editable"
            class="avatar-uploader"
            action="https://up-z2.qiniup.com/"
            accept=".mp4, .qlv, .qsv, .ogg, .flv, .avi, .wmv, .rmvb"
            :data="videoData"
            :show-file-list="false"
            :before-upload="beforeUploadVideo"
            :on-success="handleVideoSuccess"
            :on-change="getFile"
            :on-progress="uploadVideoProcess"
          >
            <div class="add-video" v-if="editable&&!videoURL">
              <div class="center">
                <i class="el-icon-video-play"></i>
                <span>点击添加视频</span>
              </div>
            </div>
            <video
              class="show-video"
              v-if="videoURL"
              :src="videoURL"
              width="572"
              height="327"
              controls="controls"
            >您的浏览器不支持视频播放</video>
          </el-upload>
          <div v-if="editable&&videoURL" class="tip">点击视频框区域可更换上传视频 ! ! !</div>
          <el-button v-if="editable&&videoURL" class="del-video" @click="delVideo">删除视频</el-button>
        </div>
      </div>

      <!-- 全景图 -->
      <div class="panorama-wrap card">
        <!-- 标题 -->
        <Title titleName="全景图"></Title>
        <!-- 全景主体 -->
        <div class="main">
          <div class="pannel" id="pan">
            <!-- <div>全景图展示区</div> -->
            <!-- <div class="pannel-controls"> -->
            <div class="pannel-controls" v-if="pannelArr.length">
              <!-- <div class="control-show" id="pan-up" v-show="!showList" @click="toggleList">&#9650;</div> -->
              <div class="control-show" id="pan-up" v-show="!showList" @click="toggleList">
                <i class="el-icon-arrow-up"></i>
              </div>
              <!-- <div class="control-show" id="pan-down" v-show="showList" @click="toggleList">&#9660;</div> -->
              <div class="control-show" id="pan-down" v-show="showList" @click="toggleList">
                <i class="el-icon-arrow-down"></i>
              </div>
              <div class="list-wrap" v-show="showList">
                <div class="left" id="pan-left" @click="pageUp">
                  <i class="el-icon-arrow-left"></i>
                </div>

                <div class="img-list">
                  <div
                    class="small-img"
                    :class="{select:item.checked}"
                    v-for="(item,index) in pannelList.slice((this.pageNo-1)*5,(this.pageNo-1)*5+5)"
                    :key="index"
                    @click="changePannel(item,index)"
                  >
                    <img :src="item.url" :title="item.title" />
                    <div class="title">
                      <span v-text="item.title"></span>
                      <div @click.stop="remove(item,index)" v-if="editable">
                        <i class="el-icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="right" id="pan-right" @click="pageDown">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>

            <!-- <div class="before-display">全景图片展示区</div> -->
            <div class="before-display" v-else>全景图片展示区</div>
          </div>
          <div class="pannel-right" v-if="editable">
            <div class="add-title" @click="showAdd">添加全景图</div>
            <div class="add-pannel" v-show="addShow">
              <!-- <el-form-item label="全景图id （必须唯一）">
                <el-input v-model="inputID"></el-input>
              </el-form-item>-->

              <el-form-item label="全景图标题">
                <el-input v-model="inputTitle"></el-input>
              </el-form-item>

              <el-upload
                :show-file-list="false"
                :on-remove="vrRemove"
                :on-success="vrSuccess"
                :before-upload="beforeVrUpload"
                :data="vrPostData"
                action="https://up-z2.qiniup.com/"
                list-type="picture-card"
                :on-change="getPannel"
                v-model="vr"
              >
                <img v-if="vrURL" :src="vrURL" class="avatar" />
                <i v-else class="el-icon-plus"></i>
                <!-- <i class="el-icon-delete"></i> -->
                <!-- <div class="add-area">
                  <div v-show="!vrURL">上传全景图</div>
                  <img v-show="vrURL" :src="vrURL" alt ref="img">
                </div>-->
              </el-upload>

              <!-- <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :data="paramsdata"
                :show-file-list="false"
                :auto-upload="false"
                :on-success="handleVideoSuccess"
                :on-change="getPannel"
                :on-progress="uploadVideoProcess"
              >
                <div class="add-area">
                  <div v-show="!vrURL">上传全景图</div>
                  <img v-show="vrURL" :src="vrURL" alt ref="img">
                </div>
              </el-upload>-->

              <div class="bottomBtn">
                <el-button type="primary" class="color-area" @click="addToArea">确 定</el-button>
                <el-button type="default" class="color-area" @click="hiddenAdd">取 消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 影棚介绍 -->
      <div class="studio-intro card">
        <Title titleName="影棚介绍 ( 必填 )"></Title>
        <div class="textare" v-if="editable">
          <tinymce v-model="studioForm.intro" :height="300" />
        </div>
        <div v-else class="text-show">
          <div v-html="studioForm.intro"></div>
        </div>
      </div>

      <!-- 修改按钮 -->
      <div class="bottomBtn">
      	<el-button class="color-area" type="primary" v-text="btnText" @click="toStudioList(studioForm)" v-permission></el-button>
        <el-button class="color-area" type="default" v-if="editable" @click="cancel">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "ServeComponents/Tinymce";
import Title from "ServeComponents/Title/index";
import { checkPic } from "@util/picUtil.js";
import { checkVideo } from "@util/videoCheck.js";
import { deepcopy } from "@/common/function/util.js";
import { conditionArray } from "@config/config.js";
import { checkPannel } from "@util/checkPannel.js";
import { studioApi } from "@config/api.js";
import { storage } from "@util/storage.js";
import clipper from 'ServeComponents/photoClipper'
import { studioType } from "@config/config.js";
export default {
  data() {
    return {
      vr: null,
      studioTypeArr: studioType,
      conditionArr: conditionArray,
      pic_update: {
        removeArray: [],
        uploadArray: [
          {
            uid: "",
            key: ""
          }
        ]
      },
      listObj: {},
      imgList: [],
      picPostData: {},
      // 图片预览
      dialogImageUrl: "",
      dialogVisible: false,
      videoObj: {},
      videoURL: "",
      videoFlag: false, //刚开始的时候显示为flase
      videoUploadPercent: "0%", //进度条刚开始的时候为0%
      videoData: {
        //添加其他参数
      },
      // 表单信息
      studioForm: {
        name: "",
        floor: "",
        square: "",
        service_condition_array: [],
        priceWorkDayWorkTimePerHour: 0,
        priceWorkDayOverTimePerHour: 0,
        priceWeekEndWorkTimePerHour: 0,
        priceWeekEndOverTimePerHour: 0,
        priceHolidayWorkTimePerHour: 0,
        priceHolidayOverTimePerHour: 0,
        priceWorkDayAllDay: 0,
        priceWeekEndAllDay: 0,
        priceHolidayAllDay: 0,
        upload_array: [],
        video: "",
        vr_array: [],
        intro: ""
      },
      selectedStudio: {},
      pic_update: {
        removeArray: [],
        uploadArray: [
          {
            uid: "",
            key: ""
          }
        ]
      },
      vr_model: [],
      vrPostData: {},
      //服务设施
      checkAll: false,
      conditionModel: [],
      checkedConditon: [],
      isIndeterminate: true,
      // 视频相关
      videoURL: "",
      videoFlag: false, //刚开始的时候显示为flase
      videoUploadPercent: "0%", //进度条刚开始的时候为0%
      paramsdata: {
        //添加其他参数
      },
      // 用户添加全景图时输入的标题以及全景图url
      userAdd: {
        id: "",
        title: "",
        url: ""
      },

      // 全景图数组
      pannelArr: [],
      // 描述
      intro: {
        active_place: "",
        content: ""
      },
      introduction: "",
      // 该字段区分设备详情页面是否可编辑
      editable: true,
      // 图片预览
      dialogImageUrl: "",
      dialogVisible: false,

      // 添加新设备弹框
      dialogTableVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      // 底部按钮文字
      btnText: "",
      // 用户添加全景图区域的显示隐藏
      addShow: true,
      // 用户添加全景图后控制全景图添加板块为图片预览板块
      afterAdd: true,
      viewer: null,
      showList: true,
      inputID: "",
      inputTitle: "",
      vrURL: "",
      pageNo: 1,
      pannelList: [],
      vrObj: {},
      uploadNum:8
    };
  },

  components: {
    Tinymce,
    Title,
    clipper
  },
  created() {
    this.editable = storage.get("studioEdit");
    this.btnText = this.editable ? "保 存" : "修 改";
    this.studioTypeArr = this.studioTypeArr.filter(item=>{
      return item.id != 0;
    });
  },

  mounted() {
    // 根据传过来的id获取影棚详情
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    } else {
      this.init();
      this.imgList.push({key:''})
    }
    // this.init();
  },

  methods: {
    // 用图片裁剪后上传七牛成功
    uploadSuccess(data){
      this.studioForm.upload_array.push({key:data});
      this.pic_update.uploadArray = [...this.studioForm.upload_array];
      console.warn(this.studioForm.upload_array,'上传的图片数组')
    },
    // 用图片裁剪组件删除图片
    delSuccess(data){
      console.warn(data,'oooo')
      this.pic_update.uploadArray=[...data.uploadArray]
      this.pic_update.removeArray=[...data.removeArray]
      console.warn(this.pic_update,'update')
    },
    // 根据传过来的影棚id获取影棚详情
    getDetail(id) {
      this.getRequest(studioApi.studioServeGet, {
        id
      })
        .then(res => {
          console.warn(res,'影棚详情')
          // this.studioForm=res[0]
          if (res.pic.length != 0) {
            if(res.pic.indexOf(',')!=-1){
              res.pic.split(",").forEach(item => {
                if (!item.length) {
                  return;
                }
                this.imgList.push({
                  key: item
                });
              });
            }else{
              this.imgList.push({key:res.pic})
            }
          }
          this.studioForm.name = res.name;
          this.studioForm.floor = res.floor;
          this.studioForm.square = res.square;

          if (!this.editable) {
            let arr = [];
            if (
              res.serviceConditionArray.length != 0 &&
              res.serviceConditionArray.indexOf(",") != -1
            ) {
              res.serviceConditionArray.split(",").forEach(item => {
                conditionArray.forEach(each => {
                  if (item == each.id) {
                    arr.push(each);
                  }
                });
              });
              this.conditionModel = [...arr];
              // this.checkAll = this.conditionModel.length === this.conditionArr.length;
              // this.studioForm.service_condition_array = this.studioForm.serviceConditionArray;
            }
          } else {
            // 这里给图片裁剪组件传递图片数组，判断是否需要新增一个上传框
            let hasNull=this.imgList.some(item=>{
              return item.key==''
            })
            !hasNull&&this.imgList.length<this.uploadNum&&this.imgList.push({key:''}) 
            this.checkedConditon = [];
            res.serviceConditionArray.split(",").forEach(item => {
              conditionArray.forEach(ele => {
                if (item == ele.id) {
                  this.checkedConditon.push(ele.name);
                  this.conditionModel.push(ele);
                }
              });
            });
          }

          this.studioForm.priceWorkDayWorkTimePerHour =
            res.priceWorkDayWorkTimePerHour;
          this.studioForm.priceWorkDayOverTimePerHour =
            res.priceWorkDayOverTimePerHour;
          this.studioForm.priceWeekEndWorkTimePerHour =
            res.priceWeekEndWorkTimePerHour;
          this.studioForm.priceWeekEndOverTimePerHour =
            res.priceWeekEndOverTimePerHour;
          this.studioForm.priceHolidayWorkTimePerHour =
            res.priceHolidayWorkTimePerHour;
          this.studioForm.priceHolidayOverTimePerHour =
            res.priceHolidayOverTimePerHour;
          this.studioForm.priceWorkDayAllDay = res.priceWorkDayAllDay;
          this.studioForm.priceWeekEndAllDay = res.priceWeekEndAllDay;
          this.studioForm.priceHolidayAllDay = res.priceHolidayAllDay;
          this.videoURL = this.$qiniuHost + res.video;
          this.studioForm.intro = res.intro;
          this.studioForm.video = res.video;
          this.studioForm.vr_array = JSON.parse(res.vr_array);
          JSON.parse(res.vr_array).forEach((item, index) => {
            this.vr_model.push(item.url);
            let inputObj = {
              id: new Date().valueOf() + index,
              title: item.title,
              url: this.$qiniuHost + item.url,
              checked: false
            };
            if (index == 0) {
              inputObj.checked = true;
            }
            this.pannelArr.push(inputObj);
          });
          this.pannelList = this.pannelArr;
          this.init(); //初始化全景图
        })
        .catch(err => {});
    },
    // 全选服务设施
    handleCheckAll(val) {
      let arr = [];
      this.conditionArr.forEach(item => {
        arr.push(item.name);
      });
      this.checkedConditon = val ? arr : [];
      if (val) {
        this.conditionArr.forEach(item => {
          this.studioForm.service_condition_array.push(item.id);
        });
      } else {
        this.studioForm.service_condition_array = [];
      }
      this.isIndeterminate = false;
    },
    // 选中某一个服务设施
    selectCondition(value) {
      this.studioForm.service_condition_array = [];
      this.conditionArr.forEach(item => {
        this.checkedConditon.forEach(ele => {
          if (item.name == ele) {
            this.studioForm.service_condition_array.push(item.id);
          }
        });
      });
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.conditionArr.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.conditionArr.length;
    },
    // 点击返回
    back() {
      history.back();
    },
    // 图片相关
    // checkAllSuccess() {
    //   return Object.keys(this.listObj).every(
    //     item => this.listObj[item].hasSuccess
    //   );
    // },
    // handleSubmit() {
    //   const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
    //   if (!this.checkAllSuccess()) {
    //     this.$message(
    //       "请等待所有图片上传完成，如果存在网络问题请刷新当前页重新上传"
    //     );
    //     return;
    //   }
    //   this.$emit("successCBK", arr);
    //   this.listObj = {};
    //   this.imgList = [];
    //   this.dialogVisible = false;
    // },
    // handleSuccess(response, file) {
    //   console.warn(this.picPostData,'picPostData')
    //   this.studioForm.upload_array.push(this.picPostData);
    //   this.pic_update.uploadArray = [...this.studioForm.upload_array];
    //   const uid = file.uid;
    //   const objKeyArr = Object.keys(this.listObj);
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       this.listObj[objKeyArr[i]].url = this.$qiniuHost + response.key;
    //       this.listObj[objKeyArr[i]].hasSuccess = true;
    //       return;
    //     }
    //   }
    // },
    // beforeRemove(file,fileList){
    //   this.imgList=fileList
    // },
    // handleRemove(file) {
    //   this.imgList=this.imgList.filter(item=>{
    //     return item.uid!=file.uid
    //   })
    //   let includeNew=this.pic_update.uploadArray.some(item=>{
    //     return item.uid==file.uid
    //   })
    //   if(includeNew){
    //     this.pic_update.uploadArray.forEach((item,index)=>{
    //       if(item.uid==file.uid){
    //         this.pic_update.uploadArray.splice(index,1)
    //       }
    //     })
    //   }else{
    //     this.pic_update.removeArray.push(
    //       file.url.slice(file.url.lastIndexOf("/") + 1)
    //     );
    //   }
    //   console.warn(includeNew,this.pic_update.removeArray,'删除的数组',this.pic_update.uploadArray,'增加的数组')
    //   // const uid = file.uid;
    //   // const objKeyArr = Object.keys(this.listObj);
    //   // for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //   //   if (this.listObj[objKeyArr[i]].uid === uid) {
    //   //     delete this.listObj[objKeyArr[i]];
    //   //     return;
    //   //   }
    //   // }
    // },
    // 上传图片超过限制
    // handleExceed() {
    //   this.$message.error("最多上传8张图片");
    // },
    // beforeUpload(file) {
    //   const _self = this;
    //   const _URL = window.URL || window.webkitURL;
    //   const fileName = file.uid;
    //   this.listObj[fileName] = {};
    //   return new Promise((resolve, reject) => {
    //     let Sync = async () => {
    //       try {
    //         let picKey = await checkPic(file, this.imgList.length, 8);
    //         if (picKey) {
    //           let token = await this.getRequest(
    //             "/qiniu/userGetQiniuUpToken?key=" + picKey
    //           );
    //           this.picPostData = token;
    //           this.picPostData.uid = file.uid;
    //           const img = new Image();
    //           img.src = _URL.createObjectURL(file);
    //           img.onload = function() {
    //             _self.listObj[fileName] = {
    //               hasSuccess: false,
    //               uid: file.uid,
    //               width: this.width,
    //               height: this.height
    //             };
    //           };
    //           resolve(true);
    //         } else {
    //           delete this.listObj[file.uid];
    //           reject(false);
    //           // this.listObj={}
    //         }
    //       } catch (error) {
    //         reject(false);
    //       }
    //     };
    //     Sync();
    //   });
    // },
    // 图片发生改变
    // handleImgChange(file, fileList) {
    // },
    // 图片预览
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    // 上传视频
    //视频上传之前判断他的大小
    beforeUploadVideo(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.videoObj[fileName] = {};
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let videoKey = await checkVideo(file);
            if (videoKey) {
              let token = await this.getRequest(
                "/qiniu/userGetQiniuUpToken?key=" + videoKey
              );
              this.videoData = token;
              resolve(true);
            } else {
              reject(false);
              this.videoObj = {};
            }
          } catch (error) {
            reject(false);
          }
        };
        Sync();
      });
    },
    // 获取预览视频信息
    getFile(file, fileList) {
      this.videoFlag = !this.videoFlag;
      this.videoURL = window.URL.createObjectURL(file.raw);
    },
    //视频上传的时候获取上传进度传给进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = parseInt(file.percentage);
    },
    //视频上传成功之后返回视频地址
    handleVideoSuccess(res, file) {
      this.videoFlag = true;
      this.videoUploadPercent = 0;
      this.videoURL = window.URL.createObjectURL(file.raw);
      this.studioForm.video = res.key;
    },
    // 添加视频后删除视频重选
    delVideo() {
      this.videoFlag = !this.videoFlag;
      this.videoURL = "";
    },
    // 点击添加全景图按钮的时候
    showAdd() {
      // this.addShow = true;
      // this.addAfter = true;
    },
    // 添加全景的时候点击取消
    hiddenAdd() {
      this.inputTitle = "";
      this.vrURL = "";
      this.userAdd.url = "";
      // this.addShow = false;
    },

    // 全景图相关
    beforeVrUpload(file) {
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let picKey = checkPannel(file);
            if (!picKey) return;
            let token = await this.getRequest(
              "/qiniu/userGetQiniuUpToken?key=" + picKey
            );
            this.vrPostData = token;
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };
        Sync();
      });
    },
    vrSuccess(response, file) {
      this.vrURL = this.$qiniuHost + response.key;
      this.vr_model.push(response.key);
      this.vrObj.url = response.key;
      this.$emit("handleSuccess", response.key);
    },
    vrRemove(file) {
      this.vrURL = "";
    },
    //清空头像图片
    clearImg() {
      this.vrURL = "";
    },

    // 获取用户上传的全景图片的url
    getPannel(file) {
      this.vrURL = window.URL.createObjectURL(file.raw);
      if (this.vrURL) {
        this.addAfter = false;
      }
    },
    // 添加全景的时候点击确定
    addToArea() {
      // return
      if (!this.inputTitle) {
        this.$message.error("请为全景图输入一个标题以便区分");
        return;
      }
      if (!this.vrURL) {
        this.$message.error("图片不能为空");
        return;
      }
      this.vrObj.title = this.inputTitle;
      // this.studioForm.vr_array = this.vr_model.join();
      this.studioForm.vr_array.push({
        ...this.vrObj
      });
      this.vrObj.url = "";
      this.vrObj.title = "";
      if (
        // this.inputID !== "" &&
        this.inputTitle !== "" &&
        this.vrURL !== ""
      ) {
        let inputObj = {
          id: new Date().valueOf(),
          title: this.inputTitle,
          url: this.vrURL,
          checked: false
        };
        let id = inputObj.id;
        this.pannelArr.push(inputObj);
        this.pannelList = this.pannelArr;
        this.viewer.getConfig().scenes[id] = {
          title: this.inputTitle,
          panorama: this.vrURL
        };
        if (this.pannelArr.length === 1) {
          this.viewer.loadScene(this.pannelArr[0].id);
          this.pannelArr[0].checked = true;
        }
        // this.inputID = "";
        this.inputTitle = "";
        this.vrURL = "";
      }
    },
    // 删除全景图
    remove(item, index) {
      this.viewer.removeScene(item.id);
      let num = (this.pageNo - 1) * 5 + index;
      this.pannelList.splice(num, 1);
      this.vr_model.splice(num, 1);
      // this.studioForm.vr_array = this.vr_model.join();
      this.studioForm.vr_array.splice(num, 1);
      this.pageNo = 1;
      if (this.pannelList.length === 0) {
        document.exitFullscreen();
        document.webkitExitFullscreen();
        return;
      }

      this.pannelList.forEach((each, j) => {
        each.checked = false;
      });
      this.pannelList[0].checked = true;
      this.viewer.loadScene(this.pannelList[0].id);
    },
    // 全景图初始化
    init() {
      if (this.pannelList.length === 0) {
        this.viewer = pannellum.viewer("pan", {
          default: {
            // 默认总体设置
            firstScene: "first", // 设置全景图群的首张全景展示，值为全景图id
            author: "派图租赁科技", // 设置作者
            sceneFadeDuration: 1000 // 全景图切换过渡时间
          },
          scenes: {
            // 所有全景图都放置在这里面
            first: {
              // 全景图id
              title: "", // 全景图标题
              hfov: 120, // 数值越小，视野越近，数值越大，视野越远
              pitch: 0, // 数值越大，视野越向上，数值越小视野越向下。0为水平视野
              yaw: 0, // 数值越大，视野越往右
              type: "equirectangular", // 指定了全景类型。可能是equirectangular，cubemap或 multires。默认为equirectangular。
              panorama: this.$qiniuHost + "images/pannel_basic.jpg", // 全景图url路径
              autoLoad: true, // 一进入页面就自动加载全景图
              autoRotate: 0 // 全景图自动旋转，数值为正代表逆时针，数值为负代表顺时针。数值代表每秒旋转的角度
            }
          }
        });
        return;
      }
      this.viewer = pannellum.viewer("pan", {
        default: {
          // 默认总体设置
          firstScene: this.pannelList[0].id, // 设置全景图群的首张全景展示，值为全景图id
          author: "派图租赁科技", // 设置作者
          sceneFadeDuration: 1000 // 全景图切换过渡时间
        },

        scenes: {
          // 所有全景图都放置在这里面
          [this.pannelList[0].id]: {
            // 全景图id
            title: this.pannelList[0].title, // 全景图标题
            hfov: 120, // 数值越小，视野越近，数值越大，视野越远
            pitch: 0, // 数值越大，视野越向上，数值越小视野越向下。0为水平视野
            yaw: 0, // 数值越大，视野越往右
            type: "equirectangular", // 指定了全景类型。可能是equirectangular，cubemap或 multires。默认为equirectangular。
            panorama: this.pannelList[0].url, // 全景图url路径
            autoLoad: true, // 一进入页面就自动加载全景图
            autoRotate: 0 // 全景图自动旋转，数值为正代表逆时针，数值为负代表顺时针。数值代表每秒旋转的角度
            // "preview": '',                   // 设置全景图预览，值为url路径
            // "hotSpots": [                    // 这指定了一个热点阵列，可以链接到其他场景，信息或外部链接
            //     {
            //         "pitch": 0,           // 以全景图中心点为原点，相当于y轴的坐标，数值越大在y轴上的位置越高
            //         "yaw": 57,              //以全景图中心点为原点，相当于x轴的坐标。数值越大在x轴上的位置越往右
            //         "type": "scene",         // 指定热点的类型。可scene用于场景链接或info 信息热点。scene 热点需要巡视配置文件。
            //         "text": "去看公司",       // 鼠标悬停在热点标记上时显示的文本
            //         "sceneId": "house"       // 点击热点切换到另一个全景，根据目标全景图的id跳转
            //     }
            // ]
          }
        }
      });
      this.pannelList.forEach(item => {
        this.viewer.getConfig().scenes[item.id] = {
          title: item.title,
          panorama: item.url
        };
      });
    },
    // 切换全景图
    changePannel(item, index) {
      this.pannelList.forEach((each, j) => {
        each.checked = false;
      });
      let num = (this.pageNo - 1) * 5 + index;
      this.pannelList[num].checked = true;
      this.viewer.loadScene(item.id);
    },
    // 全景图下方控制条的显示隐藏
    toggleList() {
      this.showList = !this.showList;
    },
    // 点击左右箭头切换全景图预览列表的上下页
    pageUp() {
      if (this.pageNo === 1) {
        return;
      }
      this.pageNo--;
    },
    pageDown() {
      if (this.pageNo === Math.ceil(this.pannelArr.length / 5)) {
        return;
      }
      this.pageNo++;
    },
    // 添加影棚完成后点击保存或者修改影棚完成后点击保存
    toStudioList(studioForm) {
      // 修改影棚信息
      if (!this.editable) {
        storage.set("studioEdit", !this.editable);
        this.editable = storage.get("studioEdit");
        this.btnText = "保 存";
        // 这里给图片裁剪组件传递图片数组，判断是否需要新增一个上传框
        let hasNull=this.imgList.some(item=>{
          return item.key==''
        })
        !hasNull&&this.imgList.length<this.uploadNum&&this.imgList.push({key:''})       
        this.checkedConditon = [];
        this.conditionModel.forEach(item => {
          this.checkedConditon.push(item.name);
        });
        return;
      }
      if (this.$route.query.id) {
        console.warn(this.pic_update,'更新的图片数据')
        this.studioForm.service_condition_array = [];
        this.conditionArr.forEach(item => {
          this.checkedConditon.forEach(ele => {
            if (item.name == ele) {
              this.studioForm.service_condition_array.push(item.id);
            }
          });
        });
        this.postRequest(studioApi.studioServeEdit, {
          name: this.studioForm.name,
          intro: this.studioForm.intro,
          floor: this.studioForm.floor,
          square: this.studioForm.square,
          priceWorkDayWorkTimePerHour: this.studioForm
            .priceWorkDayWorkTimePerHour,
          priceWorkDayOverTimePerHour: this.studioForm
            .priceWorkDayOverTimePerHour,
          priceWeekEndWorkTimePerHour: this.studioForm
            .priceWeekEndWorkTimePerHour,
          priceWeekEndOverTimePerHour: this.studioForm
            .priceWeekEndOverTimePerHour,
          priceHolidayWorkTimePerHour: this.studioForm
            .priceHolidayWorkTimePerHour,
          priceHolidayOverTimePerHour: this.studioForm
            .priceHolidayOverTimePerHour,
          priceWorkDayAllDay: this.studioForm.priceWorkDayAllDay,
          priceWeekEndAllDay: this.studioForm.priceWeekEndAllDay,
          priceHolidayAllDay: this.studioForm.priceHolidayAllDay,
          pic_update: this.pic_update,
          vr_array:
            this.studioForm.vr_array.length != 0
              ? this.studioForm.vr_array
              : "",
          video: this.studioForm.video,
          service_condition_array:
            this.studioForm.service_condition_array.length != 0
              ? this.studioForm.service_condition_array
              : "",
          id: this.$route.query.id
        })
          .then(res => {
            this.$message.success("修改影棚成功");
            if (res.serviceConditionArray) {
              let arr = [];
              res.serviceConditionArray.split(",").forEach(item => {
                conditionArray.forEach(each => {
                  if (item == each.id) {
                    arr.push(each);
                  }
                });
              });
              this.conditionModel = [...arr];
            }
            storage.set("studioEdit", false);
            this.editable = storage.get("studioEdit");
            this.btnText = "修 改";
            // 这里给图片裁剪组件传递图片数组，判断是否需要删除一个上传框
            let hasNull=this.imgList.some(item=>{
              return item.key==''
            })
            hasNull&&this.imgList.pop()
          })
          .catch(err => {
            return;
          });
      } else {
        //添加影棚
        this.postRequest(studioApi.studioServeAdd, this.studioForm)
          .then(res => {
            if (res.id > 0) {
              this.$message.success("添加影棚成功");
              this.$router.push({
                path: "/serve/control_center/Studio_set"
              });
            } else {
              this.$message.error("添加影棚失败");
            }
          })
          .catch(err => {});
      }
    },
    // 点击取消
    cancel() {
      if (this.$route.query.id) {
        this.editable = !this.editable;
        this.btnText = "修 改";
        // 这里给图片裁剪组件传递图片数组，判断是否需要删除一个上传框
        let hasNull=this.imgList.some(item=>{
            return item.key==''
        })
        hasNull&&this.imgList.pop()
      } else {
        this.$router.push("/serve/control_center/Studio_set");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.red-color{
  color: red;
}
// 头部
.header {
	display:flex;
	justify-content: flex-end;
 	button{
 		margin:10px 0px;
 	}   
}

// 表单
.studio-form {
  // 图片展示
  .picture-show {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    margin-bottom: 31px;
    padding-bottom: 20px;

  }

  // 基本信息
  .studio-info {
    margin-bottom: 31px;

    .basic-table {
      padding-left: 20px;
      padding-top: 18px;

      .sn {
        margin-bottom: 10px;
      }
    }
  }

  .basic-table /deep/ .el-form-item__content {
    display: flex;
  }

  .basic-table /deep/ .el-input__inner {
    border: 1px solid #eee;
    width: 215px;
  }

  // 服务设施
  .studio-facility {
    margin-bottom: 31px;

    .title {
      margin-bottom: 18px;
    }

    .box-wrap {
      display: flex;
      padding-left: 20px;
      box-sizing: border-box;

      .condition-item {
        margin-right: 30px;
      }

      .all {
        margin-right: 30px;
      }
    }

    .box-wrap /deep/ .el-checkbox__inner {
      border-color: #ccc;
    }

    .box-wrap /deep/ .el-checkbox__inner {
      background-color: #ccc;
    }

    .box-wrap /deep/ .el-checkbox__inner:hover {
      border-color: #ccc;
    }

    .box-wrap /deep/ .el-checkbox__label {
      color: #333;
    }

    .box-wrap /deep/ .is-checked /deep/ .el-checkbox__inner {
      border-color: #7C6AFF;
      background-color: #7C6AFF;
    }
  }

  // 具体收费
  .charge {
    margin-bottom: 31px;

    .title {
      margin-bottom: 18px;
    }

    .add-more:active {
      background-color: #255368;
      border-color: #255368;
    }

    .charge-title {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-bottom: 10px;

      div:last-child {
        // color: #3a7f9f;
        color: #7C6AFF;
        cursor: pointer;
      }
    }

    .charge-table {
      margin: 0 20px;
      margin-bottom: 30px;
      border: 1px solid rgb(204, 204, 204);
      border-radius: 2px;
      color: #333;

      .table-head {
        height: 38px;
        background: rgb(245, 248, 254);
        display: flex;
        align-items: center;

        .center {
          flex: 6;
          display: flex;

          span {
            flex: 1;
            text-align: center;
          }
        }

        span:first-child,
        span:last-child {
          text-align: center;
          // width: 160px;
          flex: 1;
        }
      }

      .charge-item {
        // height: 118px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;

        // border-bottom: 1px solid rgb(204, 204, 204);
        .using-time {
          // width: 160px;
          flex: 1;
          text-align: center;
        }

        .charge-row {
          height: 100%;
          flex: 6;
          text-align: center;

          .row-item {
            height: 50%;
            display: flex;
            align-items: center;

            div {
              flex: 1;
              padding: 5px 10px;
              box-sizing: border-box;

              .el-input {
                width: 100%;
                height: 100%;
                line-height: 50px;
              }

              .day-input {
                width: 50%;
                height: 50%;
              }
            }
          }
        }

        .operation {
          width: 160px;
          text-align: center;

          .del-btn {
            background: #e9b53b;
            color: #fff;
            cursor: pointer;
          }
        }
      }

      .charge-item:last-child {
        border-bottom: none;
      }

      .no-item {
        height: 60px;
        color: #909399;
        text-align: center;
        line-height: 60px;
      }
    }
  }

  // 视频
  .videograph-wrap {
    margin-bottom: 31px;

    // 视频及图片全景外层
    .video-wrap {
      margin-top: 18px;
      padding-left: 20px;
      padding-right: 20px;

      // 视频
      .video {
        margin-bottom: 20px;
        border-radius: 2px;
      }

      // 添加视频
      .add-video {
        margin-bottom: 20px;
        width: 672px;
        height: 384px;
        background: rgb(238, 238, 238);
        border: 1px solid rgb(204, 204, 204);
        border-radius: 2px;
        color: #666;
        cursor: pointer;

        .center {
          width: 90px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
          justify-content: center;

          .el-icon-video-play {
            font-size: 68px;
            margin-bottom: 22px;
          }
        }
      }

      // 添加视频成功后
      .show-video {
        margin-bottom: 20px;
        outline: none;
      }

      // 提示
      .tip {
        margin-bottom: 20px;
        color: rgb(58, 127, 159);
      }

      // 删除视频按钮
      .del-video {
        margin-bottom: 20px;
        background: rgb(58, 127, 159);
        border-radius: 4px;
        color: #fff;
        border: none;
      }

      .del-video:active {
        background-color: #255368;
        border-color: #255368;
      }

      // 添加描述
      .add-dec {
        width: 100%;
        height: 135px;
        padding: 20px 19px 0 22px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        outline: none;
        resize: none;
      }

      // 显示描述
      .show-dec {
        width: 100%;
        height: 135px;
        background: rgb(238, 238, 238);
        border-radius: 2px;
      }
    }
  }

  // 全景图
  .panorama-wrap {
    margin-bottom: 31px;

    // 主体
    .main {
      padding-left: 20px;
      margin-top: 18px;
      height: 600px;
      display: flex;
      margin-bottom: 30px;

      .pannel {
        // width: 1000px;
        width: 75%;
        background: rgb(238, 238, 238);
        border: 1px solid rgb(204, 204, 204);
        border-radius: 2px;
        text-align: center;
        margin-right: 30px;

        .before-display {
          text-align: center;
          font-size: 50px;
          line-height: 600px;
        }

        .pannel-controls {
          // background-color: rgba(200, 200, 200, 0.6);
          // background-color: rgba(50, 50, 50, 0.2);
          // height: 150px;
          background: rgba(0, 0, 0, 0.5);
          position: absolute;
          bottom: 0;
          z-index: 2;
          width: 100%;
          display: flex;
          flex-direction: column;

          .control-show {
            height: 30px;
            line-height: 30px;
            // background-color: #fff;
            // opacity: 0.6;
            // background:rgba(0,0,0,.5);
            cursor: pointer;
            font-size: 20px;
            color: #fff;
          }

          .list-wrap {
            flex: 1;
            display: flex;

            .left,
            .right {
              width: 40px;
              height: 120px;
              line-height: 120px;
              cursor: pointer;
              z-index: 9999;
              font-size: 20px;
              color: #fff;
            }

            .left:hover,
            .right:hover {
              transform: scale(1.5);
            }

            .img-list {
              flex: 1;
              overflow: hidden;
              display: flex;
              height: 120px;
              // background: pink;
              align-items: flex-end;

              // justify-content: space-around;
              .small-img {
                // padding: 8px 8px 0;
                margin-right: 20px;
                // margin-right: auto;
                width: 180px;
                height: 100px;
                // box-sizing: border-box;
                cursor: pointer;
                position: relative;
                z-index: 9999;
                opacity: 0.6;

                .title {
                  // width:164px;
                  width: 100%;
                  padding-left: 10px;
                  box-sizing: border-box;
                  position: absolute;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.5);
                  color: #fff;
                  height: 38px;
                  font-size: 14px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  span:last-child {
                    cursor: pointer;
                  }

                  div {
                    width: 41px;
                    height: 100%;
                    background: rgb(0, 0, 0);
                    display: flex;

                    .el-icon-delete {
                      margin: auto;
                    }
                  }
                }

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .small-img:nth-child(5n) {
                margin-right: 0;
              }

              .small-img:hover {
                // background: rgba(230, 230, 230, 1);
                // transform: scale(1.1,1.1)
                width: 190px;
                height: 120px;
                opacity: 1;
                // padding: 5px;
              }

              .select {
                // background: rgba(230, 230, 230, 1);
                // transform: scale(1.1,1.1)
                width: 190px;
                height: 120px;
                opacity: 1;
              }
            }
          }
        }
      }

      .pannel /deep/ .pnlm-panorama-info {
        // background-color: pink;
        // height: 60px;
        top: 5px;
        left: 0;
        height: 60px;
        background: rgba(0, 0, 0, 0.2);
        padding: 5px;
        box-sizing: border-box;
        text-align: center;

        .pnlm-title-box {
          padding-left: 0;
          font-size: 18px;
          position: static;
          display: block;
        }

        .pnlm-author-box {
          padding-left: 0;
          position: static;
          display: block;
        }
      }

      .pannel /deep/ .pnlm-controls-container {
        left: initial;
        right: 13px;
        top: 13px;
      }

      .pannel-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: 10px;
        box-sizing: border-box;

        .add-title {
          text-align: center;
          font-size: 25px;
          font-weight: bold;
          color: #333;
        }

        .add-pannel {
          flex: 1;
          margin-top: 23px;
          border: 1px solid rgb(204, 204, 204);
          border-radius: 2px;
          padding: 20px;
          box-sizing: border-box;
          background: rgb(240, 247, 253);

          .el-form-item {
            margin-bottom: 33px;

            /deep/ .el-form-item__label {
              color: #333;
            }
          }

          /deep/ .el-upload--picture-card {
            width: 100%;
            height: 200px;
            margin-bottom: 38px;
            position: relative;

            img {
              width: 100%;
              height: 100%;
            }

            .el-icon-plus {
              line-height: 200px;
            }
          }

          .btn {
            display: flex;
            flex-direction: column;

            .el-button:first-child {
              cursor: pointer;
              background: $Theme-color;
              border-radius: 4px;
              color: #fff;
              border: none;
              margin-bottom: 25px;
            }

            .el-button:last-child {
              cursor: pointer;
              border: 1px solid $Theme-color;
              border-radius: 4px;
              color: $Theme-color;
              margin: 0;
            }
          }
        }
      }
    }
  }

  // 影棚描述
  .studio-intro {
    min-height: 200px;
    margin-bottom: 31px;

    .title {
      margin-bottom: 18px;
    }

    .text-show {
      padding-left: 20px;
      padding-top: 10px;
      background: rgb(238, 238, 238);
      border-radius: 2px;
      min-height: 120px;
    }
  }
}

.card{
	padding:20px 30px;
	background:#fff;
	margin-bottom:20px;
	.headTitle{
		font-size:20px;
		color:#333;
		padding-bottom:20px;
		border-bottom:1px solid #F0F0F0;
	}
}
/deep/{
 .el-input__suffix{
  right:20px;
 }
}
</style>
