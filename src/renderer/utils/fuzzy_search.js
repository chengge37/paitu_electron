/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export const fuzzyQuery = (list, keyWord) => {
  let reg = new RegExp(keyWord);
  let arr = list.filter(item => reg.test(item))
  return arr
}