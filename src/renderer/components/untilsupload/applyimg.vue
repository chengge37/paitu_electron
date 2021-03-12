<!--  -->
<template>
  <div class="img-main">
    <div class="upload-wrap">
      <el-upload
        class="avatar-uploader"
        :http-request="Upload"
        list-type="picture-card"
        :show-file-list="false"
        action="/wx/uploadPic4Apply"
        :on-success="UploadSucc"
      >
        <img v-if="previewimg" :src="$qiniuHost+previewimg+`?${new Date()}`" class="avatar" />
        <div class="layer" v-if="previewimg">
          <div class="layer-left" @click.stop="stopBubble"></div>
          <div class="layer-center">
            <i class="el-icon-view" @click.stop="previewclick"></i>
            <i class="el-icon-edit" @click="changeclick"></i>
            <i class="el-icon-delete" @click.stop="delclick"></i>
          </div>
          <div class="layer-right" @click.stop="stopBubble"></div>
        </div>
        <i v-if="!previewimg" class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-dialog :visible.sync="preview">
        <img width="100%" class="el-img" :src="$qiniuHost+previewimg" alt />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkPic } from "@util/picUtil.js";
import axios from "axios";
export default {
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    // 仅可以是id_card_copy（身份证人像面照片）; id_card_national（身份证国徽面照片）;
    // store_entrance_pic（门店门口照片）;indoor_pic（店内环境照片）;business_addition_pics（补充材料）
    fileName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    preview: false,
    previewimg: ""
  }),
  components: {},
  watch: {
    imageUrl(value) {
      this.previewimg = value;
    }
  },
  mounted() {
    console.log("传入图片", this.imageUrl);

    this.previewimg = this.imageUrl;
  },

  methods: {
    // 上传
    Upload(UploadData) {
      let picKey = checkPic(UploadData.file, 1, 2);
      if (!picKey) return;
      let data = new FormData();
      data.append("file_type", `${this.fileName}`);
      data.append("file", UploadData.file);
      axios({
        url: UploadData.action,
        method: "post",
        data,
        // 不清楚为什么进度条不生效
        onUploadProgress: progressEvent => {
          let percent = ((progressEvent.loaded / progressEvent.total) * 100);
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          UploadData.onProgress({ percent: percent });
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(res => {
          UploadData.onSuccess(res);
        })
        .catch(err => {
          UploadData.onError(err);
        });
    },
    // 预览
    previewclick() {
      this.preview = true;
    },
    // 更改
    changeclick() {},
    // 删除
    delclick() {
      this.Uploaddata = {};
      this.previewimg = "";
    },
    // 成功
    UploadSucc(succdata) {
      this.previewimg = succdata[`${this.fileName}` + "_qiniu"];
      let imgdata = {
        url: this.previewimg,
        fileName: this.fileName
      };
      this.$emit("UploadState", imgdata);
    },
    stopBubble() {
      console.log("不用上传图片");
      return;
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.img-main {
  .upload-wrap {
    margin-right: 10px;

    p {
      font-size: 8px;
      color: #999999;
    }
  }

  /deep/ {
    .el-upload--picture-card {
      width: 139px;
      height: 139px;
      width: 100%;
      height: 100%;
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(240, 240, 240, 1);
    }

    .avatar-uploader .el-upload {
      width: 139px;
      height: 139px;
      line-height: 139px;
      background: rgb(250, 250, 250);
      border: 1px solid rgb(240, 240, 240);
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .avatar {
        width: 139px;
        height: 139px;
        display: block;
        z-index: 998;
        object-fit: scale-down;
      }

      .layer {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.7;
        display: flex;
        visibility: hidden;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;

        .layer-left {
          flex: 1;
        }

        .layer-right {
          flex: 1;
        }

        .layer-center {
          flex: 1;
          display: flex;
          flex-direction: column;

          .el-icon-view,
          .el-icon-edit,
          .el-icon-delete {
            font-size: 20px;
            color: #fff;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .avatar-uploader .el-upload:hover {
      .layer {
        visibility: visible;
      }
    }

    .avatar-uploader + p {
      font-size: 14px;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 32px;
      height: 32px;
      text-align: center;
    }
  }
}
</style>