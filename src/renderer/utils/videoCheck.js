import { Message } from 'element-ui'

const checkVideo = (file) => {

    var isMP4 = file.type == "video/mp4";
    var isWebM = file.type == "video/webm";
    var isOgg = file.type == "video/ogg";
    let isLt2G = file.size / 1024 / 1024 < 2000;

    console.log("isMP4 " + isMP4);
    console.log("isWebM " + isWebM);
    console.log("isOgg " + isOgg);
    console.log("isLt2G" + isLt2G)

    if (!isMP4 && !isWebM && !isOgg) {
        Message.error("目前只支持上传mp4,webm,ogg视频格式!");
        return false;
    }
    if (!isLt2G) {
        Message.error("上传视频大小不能超过 2G!");
        return false;
    }
    var isVid = (isMP4 || isWebM || isOgg) && isLt2G;
    console.log("是否为符合要求的视频？ " + isVid);
    if (!isVid) return false;
    var timestamp = new Date().valueOf();
    var ext = "";
    if (isMP4) {
      ext = ".mp4";
    }
    if (isWebM) {
      ext = ".webm";
    }
    if (isOgg) {
      ext = ".ogg";
    }
    return timestamp + ext;
}
export {checkVideo}