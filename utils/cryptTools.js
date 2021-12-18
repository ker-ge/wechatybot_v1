const crypto = require('crypto');

/**
 * base64加解密
 * @param {*} str 加解密的字符串
 * @param {*} func e：加密，d：解密
 */
module.exports.base64_func = (str, func) => {
  if (func == 'e') {
    let a = new Buffer.from(str);
    return a.toString('base64');
  } else if (func == 'd') {
    let a = new Buffer.from(str, 'base64');
    return a.toString();
  }
}

/**
 * md5加解密
 * @param {*} str 加解密的字符串
 * @param {*} func e：加密，d：解密
 */
module.exports.md5_func = (str, salt='') => {
  let md5 = crypto.createHash("md5");
  let md5Sum = md5.update(str + salt);
  return md5Sum.digest("hex");
}
