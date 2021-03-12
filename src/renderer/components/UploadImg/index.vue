<template>
  <!-- 上传图片 -->
  <div class="pictures">
    <el-upload
      :disabled="!canUse"
      :show-file-list="false"
      action="https://up-z2.qiniup.com/"
      :data="picPostData"
      list-type="picture-card"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
    >
      <img  :src="imageUrl2?imageUrl2:util.defaultAvatar" class="avatar" v-if="!noShowImg&&type=='user'"/>
       <img  :src="imageUrl2?imageUrl2:config.defaultStorePic" class="avatar" v-if="!noShowImg&&type=='store'"/>
       <img  :src="imageUrl2" class="avatar" v-if="type=='finance'&&imageUrl2"/>
      <i v-if="imageUrl2==''&&showPlus" class="el-icon-plus avatar-uploader-icon"></i>
      <span class="btn-text" v-if="showText">{{btnText}}</span>
      <div v-if="imageUrl2!=''&&canUse&&!noShowImg" class="bottom">
        <span>更换</span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { checkPic } from "@util/picUtil.js";
export default {
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    editable: {
      type: Boolean,
      default: true
    },
    noShowImg:{
    	type:Boolean,
    	default:false
    },
    showPlus:{
    	type:Boolean,
    	default:false,
    },
    showText:{
    	type:Boolean,
    	default:false,
    },
    btnText:{
    	type:String,
    	default:'',
    },
    //类型，默认是用户头像，可设置成店铺，store
    type:{
    	type:String,
    	default:"user"
    }
  },

  data() {
    return {
      picPostData: {},
      imageUrl2: "",
      canUse:this.editable
    };
  },
  watch: {
    imageUrl2: function(to, from) {
      if (this.imageUrl2 == "") {
        this.$emit("handleSuccess", "");
      }
    },
    editable(val){
      this.canUse=val
    }
  },
  created() {
  	
  },
  mounted(){
  	if(this.imageUrl && this.imageUrl.length>30){
  		this.imageUrl2 = this.imageUrl;
  	}
  	console.log('this.imageUrl2-------------',this.imageUrl2);
  	console.log('this.util.defaultAvatar',this.util.defaultAvatar);
    
  },
  methods: {
    beforeUpload(file) {
      console.log("beforeUpload----", file);
      return new Promise((resolve, reject) => {
        let Sync = async () => {
          try {
            let picKey = checkPic(file, 1, 2);
            console.log('picKey---------------',picKey);
            if (!picKey) return;
            let token = await this.getRequest(
              "/qiniu/userGetQiniuUpToken?key=" + picKey
            );
            this.picPostData = token;
            console.log("token-----", token);
            console.log("token-----123");
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };
        Sync();
      });
    },
    handleSuccess(response, file,fileList) {
      console.log('----handleSuccess---')
      this.imageUrl2 = this.config.qiniuHost + response.key;
      
      this.$emit("handleSuccess", response.key);
    },
    handleRemove(file) {
      console.log("handleRemove-----");
      this.imageUrl2 = "";
    },
    beforeRemove(file) {
      console.log("beforeRemove----");
    },
    //清空头像图片
    clearImg() {
      this.imageUrl2 = "";
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-upload {
    position: relative;
  }
  .bottom {
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 28px;
    line-height: 28px;
    // background: rgba(58, 127, 159, 0.5);
    background: rgba(101, 31, 255, 0.7);
    color: #fff;
    font-size: 12px;
    width: 100%;
  }
  i.close {
    position: absolute;
    top: 0px;
    right: 0px;
    color: #f5f8fe;
    font-size: 24px;
  }
  .btn-text{
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;justify-content: center;
    font-size: 15px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload--picture-card {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  /*.avatar {
    width: 146px;
    height: 146px;
    display: block;
  }*/
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>