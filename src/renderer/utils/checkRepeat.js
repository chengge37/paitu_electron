const checkRepeat=(array)=>{
  var x = new Set(array);
  if([...x].length!==array.length){
    alert('输入的内容不能重复')
    return true
  }
}
export { checkRepeat }