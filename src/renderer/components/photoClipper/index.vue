<template>
  <div class="clipper-wrap">
    <!-- 用于外部展示的上传框 -->
    <clipper-upload
      ref="uploadDom1" 
      :style="`width:${uploadWidth}px;height:${uploadHeight}px;borderColor:${borderColor};backgroundColor:${bgColor};color:${textColor}`" 
      @input="openClip($event,index)" 
      class="upload" 
      v-for="(item,index) in imgList" 
      :key="index">
      <img ref="img" :src="$qiniuHost+item.key" alt="" v-if="item.key">
      <i v-else class="el-icon-plus"></i>
      <div class="layer" v-if="item.key">
        <div class="layer-left" @click.stop="stopBubble"></div>
        <div class="layer-center">
          <i class="el-icon-view" @click.stop="preview(index)"></i>
          <i class="el-icon-edit" @click="changeImg(index)" v-if="editable&&showPen"></i>
          <i class="el-icon-delete" @click.stop="del(index)" v-if="editable"></i>
        </div>
        <div class="layer-right" @click.stop="stopBubble"></div>
      </div>
    </clipper-upload>
    <!-- 图片预览主体 -->
    <el-dialog class="preview" :visible.sync="showResultPreview">
      <img  :src="previewUrl" alt />
    </el-dialog>
    <!-- 裁剪图片主体 -->
    <div class="clipper-main" v-if="showClip">
      <div class="top">
        <!-- 上传裁剪图片 -->
        <clipper-upload ref="uploadDom2" class="upload-btn color-area" @input="selectImg">更换图片</clipper-upload>
        <span class="upload-btn color-area confirm-btn" @click="getResult">确定裁剪</span>
        <span class="upload-btn color-area cancel-btn" @click="cancel">取消返回</span>
      </div>
      <div class="middle">
        <!-- 方案一 -->
        <clipper-fixed ref="clipper" class="basic clipper-fixed" :area="60" :zoom-rate="0.03" :src="initUrl" :ratio="ratio" :bg-color="fixBgColor" :border="1" border-color="#fff" :round="false" preview="my-preview" shadow="rgba(0,0,0,0.5)" :rotate="rotation"></clipper-fixed>
        <!-- 方案二 -->
        <!-- <clipper-basic class="basic" ref="clipper" :initWidth="initWidth" :mode="mode" :scale="scale" :ratio="ratio" :rotate="rotation" :src="initUrl" preview="my-preview">
        </clipper-basic> -->
        <clipper-preview class="preview" name="my-preview">
        </clipper-preview>
      </div>
      <div class="foot">
        <div class="rotate-part">
          <p>旋转角度：</p>
          <h5>{{rotation}}</h5>
            <!-- 控制裁剪图片旋转角度的拖拽条 -->
          <clipper-range v-model="rotation" style="max-width:300px" :min="0" :max="360"></clipper-range>
        </div>
        <div class="color-part">
          <div>
            <span>截图的背景颜色：</span>
            <span class="color-block white" @click="selectColor(1)"></span>
            <span class="color-block black" @click="selectColor(2)"></span>
            <span ref="colorDom" class="color-btn" @click="selectColor">自定义颜色</span>
            <!--  取色器 -->
            <photoshop-picker @ok="confirmSelect" @reset="resetSelect" @cancel="cancelSelect" v-if="showColorPicker" v-model="colors" />
          </div>
          <p>使用说明：当裁剪图片效果不理想，左右或者上下有多余部分时，可根据被裁剪图片四周的<br>边缘色设置一个自定义背景颜色以改善最终裁剪图片效果</p>
          <!-- <material-picker v-model="colors" /> -->
          <!-- <compact-picker v-model="colors" /> -->
          <!-- <swatches-picker v-model="colors" /> -->
          <!-- <slider-picker v-model="colors" /> -->
          <!-- <sketch-picker v-model="colors" /> -->
          <!-- <chrome-picker v-model="colors" /> -->
        </div>
        <!-- <div class="scale-part"> -->
          <!-- 控制原图片放大缩小的拖拽条 -->
          <!-- <p>底图放大缩小倍数：</p> -->
          <!-- <h5>{{scale}}</h5> -->
          <!-- <div class="controll-wrap">
            <clipper-range v-model="scale" style="width:300px" :min="0.1"></clipper-range>
            <div class="controll">
              <i class="el-icon-minus" @click="handleScale(1)"></i>
              <i class="el-icon-plus" @click="handleScale(2)"></i>
            </div>
          </div> -->
        </div>
      </div>
    </div>
</template>

<script>
import { Photoshop } from 'vue-color'

  export default {
    data(){
      return{
        src: [
          "https://timtnleeproject.github.io/vuejs-clipper/ex2.jpg",
          "https://timtnleeproject.github.io/vuejs-clipper/dawn.jpg"
        ],
        rotation: 0,
        showClip:false,
        resultUrl:'',
        showResultPreview:false,
        // uploadArr:[''],
        handleIndex:1,
        scale:1,
        previewUrl:'',
        addArr:[],
        delArr:[],
        colors:'',
        showColorPicker:false,
        fixBgColor:'#fff'
      }
    },
    props:{
      // 可上传图片数量
      uploadNum:{
        type:Number,
        default:1
      },
      // 图片上传框的宽
      uploadWidth:{
        type:Number,
        default:120
      },
      // 图片上传框的宽
      uploadHeight:{
        type:Number,
        default:120
      },
      // 图片上传框的背景颜色
      bgColor:{
        type:String,
        default:'#eee'
      },
      // 图片上传框的边框颜色
      borderColor:{
        type:String,
        default:'#ccc'
      },
      // 图片上传框里面的符号字体颜色
      textColor:{
        type:String,
        defaulte:'#ccc'
      },
      wrapRatio:{
        type:Number,
        default:1
      },
      initWidth:{
        type:Number,
        default:50
      },
      initHeight:{
        type:Number,
        default:50
      },
      // 裁剪框的宽高比例，如1/2,只要等比例图片显示就不会被拉伸或压缩,如果输入的是具体像素比，如500/260，则裁切框不能再变大或变小
      ratio:{
        type:Number,
        default:1
      },
      resultWidth:{
        type:Number,
        default:500
      },
      mode:{
        type:String,
        default:'normal'
      },
      // 图片数组
      imgList:{
        type:Array,
        default:[]
      },
      // 是否可编辑
      editable:{
        type:Boolean,
        default:true
      },
      // 是否显示上传框小笔
      showPen:{
        type:Boolean,
        default:false
      }
      // 放大缩小
      // scale:{
      //   type:Number,
      //   default:1
      // }
    },
    components: {
      // 'material-picker': Material,
      // 'compact-picker': compact,
      // 'swatches-picker': swatches,
      // 'slider-picker': slider,
      // 'sketch-picker': Sketch,
      // 'chrome-picker': chrome,
      'photoshop-picker': Photoshop
    },
    created(){
      this.imgList=[...this.imgList]
    },
    mounted(){
      console.warn(this.rotation,'旋转角度')
      // this.$refs.clipper.setTL$.next({"top":25,"left":25})
      // this.$refs.clipper.setWH$.next({"width":80,"height":50})
    },

    methods:{     
      // 控制放大缩小倍数，加或减0.01每次
      // handleScale(val){
      //   if(val==1){
      //     if(this.scale<=0.1){
      //       return
      //     }
      //     this.scale-=0.01
      //   }else{
      //     if(this.scale>=10){
      //       return
      //     }
      //     this.scale+=0.01
      //   }
      // },
      //点击颜色块按钮，打开取色器选择裁剪背景颜色
      selectColor(num){
        if(num==1){
          this.fixBgColor='#fff'
          this.$refs.colorDom.style.background=this.fixBgColor
          this.$refs.colorDom.style.color="#000"
        }else if(num==2){
          this.fixBgColor="#000"
          this.$refs.colorDom.style.background=this.fixBgColor
          this.$refs.colorDom.style.color="#fff"
        }else{
          this.showColorPicker=!this.showColorPicker
        }
      },
      // 点击确定ok选择颜色
      confirmSelect(){
        this.showColorPicker=false
        this.fixBgColor=this.colors.hex
        console.warn(this.colors,'选择的颜色')
        this.$refs.colorDom.style.background=this.fixBgColor
        if(this.fixBgColor!='#fff'){
          this.$refs.colorDom.style.color="#fff"
        }
      },
      // 点击取消cancel
      cancelSelect(){
        this.showColorPicker=false
      },
      // 点击reset重置
      resetSelect(){

      },
      // 打开截图界面
      openClip(file,i){
        this.fixBgColor="#fff"
        console.warn(i,'7887987798798798798')
        let fileObj=this.$refs.uploadDom1[i].file
        let isJPG = fileObj.type == "image/jpeg";
        let isPNG = fileObj.type == "image/png";
        let isLt2M = fileObj.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
            this.$message.error("上传图片只能是 JPG/PNG 格式!");
            return false;
        }
        if (!isLt2M) {
            this.$message.error("上传图片大小不能超过 2MB!");
            return false;
        }
        // let files = new window.File([file], 'img', {type: 'image/jpg'})
        this.handleIndex=i
        this.initUrl=file
        // document.getElementsByTagName('html')[0].style.overflow="hidden"
        this.showClip=true
        this.rotation=0
      },
      // 选择需要裁剪的图片
      selectImg(file){
        let fileObj=this.$refs.uploadDom2.file
        let isJPG = fileObj.type == "image/jpeg";
        let isPNG = fileObj.type == "image/png";
        let isLt2M = fileObj.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
            this.$message.error("上传图片只能是 JPG/PNG 格式!");
            return false;
        }
        if (!isLt2M) {
            this.$message.error("上传图片大小不能超过 2MB!");
            return false;
        }
        this.$refs.clipper.src=file
        this.initUrl=file
        this.scale=1
      },
      // 取消裁剪
      cancel(){
        this.showClip=false
        this.showColorPicker=false
      },
      // 图片base64转file
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      },
      // 获取截图结果并上传到七牛
      async getResult() {
        console.warn(this.resultWidth,'裁剪后图片宽度')
        const canvas = this.$refs.clipper.clip({ wPixel: this.resultWidth });//里面设置的参数为裁剪后图片的px宽，还可以设置最大宽度
        this.resultUrl = canvas.toDataURL("image/jpeg", 1);//canvas->image
        let picKey = new Date().valueOf()+'.jpg'
        let keyToken = await this.getRequest(
          "/qiniu/userGetQiniuUpToken?key=" + picKey
        );
        let file=this.dataURLtoFile(this.resultUrl,keyToken.key)
        let putExtra = {
          fname: '',
          params: {},
          mimeType: ['image/png', 'image/jpeg', 'image/gif'],
        };
        let config = {
          useCdnDomain: true, //使用cdn加速
        };

        const observable = this.$qiniu.upload(file, keyToken.key, keyToken.token, putExtra, config);

        observable.subscribe({
          next: (result) => {
            // 主要用来展示进度
          },
          error: () => {
            this.$message.error('上传图片失败');
            this.showColorPicker=false
          },
          complete: (res) => {
            console.warn(res,'上传成功');
            this.$emit('uploadSuccess',res.key)
            // this.resultUrl=this.$qiniuHost+res.key
            // let obj={url:this.$qiniuHost+res.key}
            // this.imgList.push(obj)
            this.imgList[this.handleIndex].key=res.key
            this.addArr.push(this.imgList[this.handleIndex])
            this.initUrl=''
            // 需要上传多张图片
            if(this.uploadNum>1&&this.handleIndex==this.imgList.length-1&&this.imgList.length<this.uploadNum){
              this.imgList.push({key:''})
            }
            this.showClip=false
            this.showColorPicker=false
          },
        });

      },
      stopBubble(){

      },
      changeImg(i){
        this.handleIndex=i
      },
      del(i){
        this.$confirm("确定要删除该图片吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let canPush=this.addArr.some(item=>{
            return item.key==this.imgList[i].key
          })
          if(canPush){
            this.addArr.forEach((item,j)=>{
              if(item.key==this.imgList[i].key){
                this.addArr.splice(j,1)
              }
            })
          }else{
            this.delArr.push(this.imgList[i].key)
          }
          console.warn(this.addArr,'+++++++')
          console.warn(this.delArr,'-------')
          if(i==this.imgList.length-1){
            this.imgList.splice(i,1)
            this.imgList.push({key:''})
            this.$emit('delSuccess',{uploadArray:this.addArr,removeArray:this.delArr})
            this.$message.success('图片删除成功')
            return
          }
          let hasNull=this.imgList.some(item=>{
            return item.key==''
          })
          if(hasNull){
            this.imgList.splice(i,1)
            this.$emit('delSuccess',{uploadArray:this.addArr,removeArray:this.delArr})
            this.$message.success('图片删除成功')
          }else{
            this.imgList.splice(i,1)
            this.$emit('delSuccess',{uploadArray:this.addArr,removeArray:this.delArr})
            this.imgList.push({key:''})
            this.$message.success('图片删除成功')
          }
          }).catch(() => {});
      },
      preview(i){
        this.previewUrl=this.$qiniuHost+this.imgList[i].key
        this.handleIndex=i
        this.showResultPreview=true
      },
      closePreview(){
        this.showResultPreview=false
      }
    },
  }
</script>

<style lang="scss" scoped>
.clipper-wrap{
  display: flex;
  .upload+.upload{
    margin-left: 20px;
  }
  .upload{
    width: 120px;
    height: 120px;
    // border: 1px solid #ebebeb;
    // border: 1px solid gold;
    border: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    i{
      font-size: 26px;
      color: #999;
    }
    img{
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
    .layer {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999;
      border-radius: 8px;
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
    &:hover{
      .layer{
        visibility: visible;
      }
    }
  }
  .preview{
    overflow: hidden;
    display: flex;
    align-items: center;
    // border: 1px solid #000;
    /deep/ {
      .el-dialog{
        margin-top: 0!important;
        height: 90%;
        padding: 0 0 30px 0;
        box-sizing: border-box;
        .el-dialog__header{
          padding: 0;
          height: 38px;
          position: relative;
          .el-dialog__headerbtn{
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .el-dialog__body{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 0;
          padding-bottom: 30px;
          box-sizing: border-box;
          img{
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }
  .clipper-main{
    padding-top: 30px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 1010;
    overflow: auto;
    .top{
      display: flex;
      margin-bottom: 2%;
      height: 40px;
      .upload-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #7C6AFF;
        color: #fff;
        width: 100px;
        border-radius: 4px;
        margin: 0 auto;
        cursor: pointer;
        z-index: 1000;
      }
    }
    .middle{
      width: 100%;
      height: 600px;
      display: flex;
      justify-content: center;
      margin-bottom: 3%;
      .basic,.preview{
        background: #000;
        height: 100%;
        width: 600px;
        margin-right: 5%;
        display: flex;
        align-items: center;
        box-shadow: 0 0 8px #aaa;
      }
      .basic{
        /deep/{
          .wrap{
            position: relative!important;
            overflow: hidden!important;
            width: 100%!important;
            height: 100%!important;
            cursor: -webkit-grab;
            cursor: grab;
            .stem-outer{
              position: relative!important;
              top: 0!important;
              left: 0!important;
              width: 100%!important;
            }
            .img-center{
              width: 100%!important;
              position: absolute!important;
              top: 50%!important;
              left: 50%!important;
              -webkit-transform: translate(-50%,-50%)!important;
              transform: translate(-50%,-50%)!important;
              .stem-bg{
                position: relative!important;
                top: 0!important;
                left: 0!important;
                width: 100%!important;
              }
              .img-scale{
                position: absolute!important;
                top: 0!important;
                left: 0!important;
                width: 100%!important;
                height: 100%!important;
                .img-translate{
                  position: absolute!important;
                  top: 0!important;
                  left: 0!important;
                  width: 100%!important;
                  height: 100%!important;
                  .img{
                    position: absolute!important;
                    top: 0!important;
                    left: 0!important;
                    width: 100%!important;
                  }
                }
              }
            }
            .cover{
              pointer-events: none!important;
              height: 100%!important;
              overflow: hidden!important;
              .area{
                color: rgba(0, 0, 0, 0.5);
                border-width: 1px !important;
                border-color: rgb(255, 255, 255) !important;
                width: 60% !important;
                box-shadow: 0px 0px 0px 100.156vw !important;
                position: absolute!important;
                top: 50%!important;
                left: 50%!important;
                -webkit-transform: translate(-50%,-50%)!important;
                transform: translate(-50%,-50%)!important;
                border-style: solid;
                .stem-area{
                  width: 100% !important;
                  display: block!important;
                  position: relative!important;
                }
              }
            }
          }
        }
      }
      .preview{
        margin-right: 0;
        /deep/{
          .wrap{
            width: 100%;
            position: relative;
            overflow: hidden;
            .shim{
              display: block;
              width: 100%;
              position: relative;
              top: 0;
              left: 0;
            }
            .img-pos{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              -webkit-transform-origin: 0 0;
              transform-origin: 0 0;
              .img-rotate{
                transform: rotate(0deg);
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
                .img{
                  left: 0;
                  top: 0;
                  position: relative;
                  width: 100%;
                  display: block;
                }
              }
            }
          }
        }
      }
    }
    .foot{
      display: flex;
      padding-bottom: 50px;
      .rotate-part{
        width: 500px;
        text-align: center;
        padding-left: 12%;
        box-sizing: border-box;
        margin-right: 200px;
        p{
          text-align: left;
          margin-bottom: 20px;
        }
        h5{
          font-size: 18px;
        }
        .clipper-range{
          /deep/{
            .wrap{
              width: 300px;
              box-sizing: border-box;
              padding: 10px;
              position: relative;
              .stick{
                position: absolute;
                width: 100%;
                height: 2px;
                background-color: grey;
                top: 50%;
                left: 0;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
              }
              .bar{
                position: absolute;
                cursor: pointer;
                width: 12px;
                height: 100%;
                background-color: #fff;
                -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,.5);
                box-shadow: 1px 1px 4px rgba(0,0,0,.5);
                top: 0;
                left: 0;
              }
            }
          }
        }
      }
      .color-part{
        width: 100%;
        div{
          margin-right: 50px;
          display: flex;
          // position: relative;
          .color-block{
            width: 30px;
            height: 20px;
            background: #fff;
            border-radius: 5px;
            border: 1px solid #aaa;
            margin-right: 10px;
            cursor: pointer;
          }
          .white{
            background: #fff;
          }
          .black{
            background: #000;
          }
          span.color-btn{
            border: 1px solid #aaa;
            height: fit-content;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            color: #000;
          }
          .vc-photoshop{
            width: fit-content;
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 999999;
            box-shadow: 0 0 20px #666;
          }
        }
        p{
          color: #7C6AFF;
          margin-top: 20px;
          line-height: 28px;
        }
      }
      // .scale-part{
      //   width: 600px;
      //   text-align: center;
      //   padding-left: 12%;
      //   box-sizing: border-box;
      //   margin-right: 200px;
      //   p{
      //     text-align: left;
      //     margin-bottom: 40px;
      //   }
      //   // h5{
      //   //   font-size: 18px;
      //   // }
      //   .controll-wrap{
      //     display: flex;
      //     .clipper-range{
      //       margin-right: 20px;
      //       // margin: 0 auto;
      //     }
      //     .controll{
      //       display: flex;
      //       align-items: center;
      //       i{
      //         border: 1px solid #aaa;
      //         font-size: 20px;
      //         cursor: pointer;
      //         padding: 2px;
      //         height: fit-content;
      //         &:hover{
      //           background: rgb(144,98,235);
      //           color: #fff;
      //         }
      //         &:first-child{
      //           margin-right: 10px;
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
}
</style>