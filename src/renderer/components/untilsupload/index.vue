<!--  -->
<template>
  <div class="img-main">
    <div class="upload-wrap">
      <el-upload
        v-bind:id="randomId"
        ref="myUpload"
        v-bind:style="cssStyle"
        class="avatar-uploader"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :data="Uploaddata"
        action="https://up-z2.qiniup.com/"
        list-type="picture-card"
        :show-file-list="false"
      >
        <img v-if="previewImg" :src="this.$qiniuHost + previewImg" class="avatar" />
        <div class="layer" v-if="previewImg">
          <div class="layer-left" @click.stop="stopBubble"></div>
          <div class="layer-center">
            <i class="el-icon-view" @click.stop="previewclick"></i>
            <i class="el-icon-edit" @click="changeclick"></i>
            <i class="el-icon-delete" @click.stop="delclick"></i>
          </div>
          <div class="layer-right" @click.stop="stopBubble"></div>
        </div>
        <i v-if="!previewImg" class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-dialog :visible.sync="preview">
        <img width="100%" class="el-img" :src="this.$qiniuHost + previewImg" alt />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkPic } from "@util/picUtil.js";

export default {
  name: "OneImgUpload",
  props: ["imageUrl", "delFromQiniu", "width_ratio"],
  // imageUrl: {
  //     type: String,
  //     default: ''
  // },
  // delFromQiniu: {
  //     type: Boolean,
  //     default: true
  // }

  model: {
    prop: "imageUrl",
    event: "imageUrlChange"
  },
  data: () => ({
    Uploaddata: {},
    preview: false,
    previewImg: "",
    oldImageKey: null,
    selfDelFromQiniu: true,
    selfWidthRatio: 1,
    cssStyle: {
      height: "100px"
    },
    selfId: null,
    selfWidth: null
  }),
  components: {},
  created() {
    this.selfDelFromQiniu =
      this.delFromQiniu == undefined ? true : this.delFromQiniu;
    this.selfWidthRatio = this.width_ratio == undefined ? 1 : this.width_ratio;
  },
  mounted() {
    this.$nextTick(() => {
      let nodeList = document.querySelectorAll("div[id='" + this.selfId + "']");
      let curDiv = nodeList[0];
      this.selfWidth = curDiv.clientWidth;
    });
  },
  watch: {
    imageUrl(value) {
      this.previewImg = value;
      this.oldImageKey = this.imageUrl;
    },
    delFromQiniu(value) {
      this.selfDelFromQiniu = value;
    },
    selfWidth(val) {
      if (val) {
        this.cssStyle = {
          height: val * this.selfWidthRatio + "px"
        };
      }
    }
  },
  methods: {
    //   成功
    handleSuccess(file) {
      console.log("文件地址", file);
      if (!this.util.isEmpty(this.previewImg)) {
        this.oldImageKey = this.previewImg;
        console.log("上传成功");
      }
      this.previewImg = file.key;
      this.$emit("handleSuccess", file.key);
      this.$emit("imageUrlChange", file.key);
    },
    // 上传前
    beforeUpload(file) {
      this.$emit("imageUrlChange", "");
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let picKey = checkPic(file, 1, 2);
            console.log("picKey---------------", picKey);
            if (!picKey) return;
            let token = await this.getRequest(
              "/qiniu/userGetQiniuUpToken?key=" + picKey
            );
            this.Uploaddata = token;
            console.log("token123-----", token);
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };
        Sync();
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
      this.previewImg = "";
      if (!this.util.isEmpty(this.oldImageKey)) {
        console.log("删除 " + this.oldImageKey);
        if (this.selfDelFromQiniu) {
          this.postRequest("/pic/del", {
            key: this.oldImageKey
          })
            .then(res => {
              console.log(res);
            })
            .catch(err => {});
        } else {
          console.log("不发送删除请求");
        }
      }
      this.$emit("imageUrlChange", "");
    },
    stopBubble() {
      console.log("不用上传图片");
      return;
    }
  },
  computed: {
    randomId() {
      let id = this.util.getUUID();
      this.selfId = id;
      return id;
    }
  }
};
</script>

<style lang="scss" scoped>
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
      width: 100%;
      height: 100%;
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(240, 240, 240, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-uploader .el-upload {
      width: 100%;
      height: 100%;
      line-height: 1;
      background: rgb(250, 250, 250);
      border: 1px solid rgb(240, 240, 240);
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .avatar {
        width: 100%;
        height: 100%;
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
