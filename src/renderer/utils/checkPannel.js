const checkPannel=(file)=>{
  var ext = '';
  var isJPG = file.type == "image/jpeg";
  var isPNG = file.type == "image/png";
  if (isJPG) {
    ext = ".jpg";
  }
  if (isPNG) {
    ext = ".png";
  }
  var timestamp = new Date().valueOf();
  return timestamp + ext;
}
export {checkPannel}