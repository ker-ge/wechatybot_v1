

const fs = require('fs'); // 文件操作

// 延时函数
exports.delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 异步写入文件
 * @param {*} filePath 写入文件地址
 * @param {*} Data 写入文件数据
 * @param {*} flag 写入方式 a:追加，w:覆盖
 */
exports.writeFile = function (filePath, Data, flag = 'w') {
  try {
    fs.writeFile(filePath, Data, {
      flag: flag
    }, function (err) {
      if (err) throw new Error(err)
    });
  } catch (error) {
    console.log('writeFile error===', error);
  }
}

/**
 * 同步写入文件
 * @param {*} filePath 写入文件地址
 * @param {*} Data 写入文件数据
 * @param {*} flag 写入方式 a:追加，w:覆盖
 */
exports.writeFileSync = function (filePath, Data, flag = 'w') {
  try {
    fs.writeFileSync(filePath, Data, {
      flag: flag
    }, function (err) {
      if (err) throw err;
    });
  } catch (error) {
    console.log('writeFileSync error===', error);
  }
}

/**
 * 异步读取文件
 * @param {*} filePath 
 * @param {*} encode 
 */
exports.readFile = function (filePath, encode = 'utf-8') {
  try {
    return fs.readFile(filePath, encode);
  } catch (error) {
    console.log('readFile error===', error);
  }
}

/**
 * 同步读取文件
 * @param {*} filePath 
 * @param {*} encode 
 */
exports.readFileSync = function (filePath, encode = 'utf-8') {
  try {
    return fs.readFileSync(filePath, encode);
  } catch (error) {
    console.log('readFileSync error===', error);
  }
}

/**
 * formatDate 格式化时间
 * @param {*} date 
 * @param {*} format 
 * @returns 
 */
exports.formatDate = function (date, format = '') {
  try {
    var tempDate = new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    day = day > 9 ? day : `0${day}`;
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var second = tempDate.getSeconds();
    var week = tempDate.getDay();
    var weekstr = '';
    switch (week) {
      case 0: weekstr = '星期日'; break;
      case 1: weekstr = '星期一'; break;
      case 2: weekstr = '星期二'; break;
      case 3: weekstr = '星期三'; break;
      case 4: weekstr = '星期四'; break;
      case 5: weekstr = '星期五'; break;
      case 6: weekstr = '星期六'; break;
    }
    if (hour < 10) hour = '0' + hour;
    if (min < 10) min = '0' + min;
    if (second < 10) second = '0' + second;

    switch (format) {
      case 'E': return weekstr;
      case 'YYYY-MM-DD': return year + '-' + month + '-' + day;
      case 'YYYY-MM-DD HH:mm:ss': return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
      default: return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ' ' + weekstr;
    }
  } catch (error) {
    console.log('formatDate error===', error);
  }
}

/**
 * 获取当天开始和结束时间戳，以及当前时间戳
 */
exports.getStartEndTime = function () {
  try {
    // 今日开始时间戳
    const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime().toString();
    // 今日结束时间戳
    const todayEndTime = new Date(new Date().setHours(23, 59, 59, 999)).getTime().toString();
    // 当前时间时间戳
    const todayNowTime = new Date().getTime().toString();
    return [todayStartTime.substr(0, 10), todayEndTime.substr(0, 10), todayNowTime];
  } catch (error) {
    console.log('getStartEndTime error===', error);
    return '';
  }
}

/**
 * 找出两个字符串相同的最大子串，实现模糊查询
 * @param {*} s1 
 * @param {*} s2 
 * @returns 
 */
exports.fuzzyQuery = function (s1, s2) {
  try {
    var commonStr = '', L1 = s1.length, L2 = s2.length;
    // 比较s1,s2的长度，看谁长谁短
    var shortStr = L1 > L2 ? s2 : s1;
    var longStr = L1 > L2 ? s1 : s2;
    // 短的字符串的长度
    var strLen = shortStr.length;

    // 遍历短的字符串，从大到小递减
    for (let j = strLen; j > 0; j--) {
      // 不同的长度有总共有i个可能，从做到右遍历
      for (let i = 0; i <= strLen - j; i++) {
        // 截取出短字符串的部分字符串
        commonStr = shortStr.substr(i, j);
        // 为了便于观测运行的过程，打印看一下会直观很多
        // console.log('commonStr:', commonStr, 'i:', i, 'j:', j);
        // 放在长字符串里看看有没有匹配的，如果有直接返回
        if (longStr.indexOf(commonStr) >= 0) return commonStr;
      }
    }
    // 没有的话返回空字符串
    return '';
  } catch (error) {
    console.log('fuzzyQuery error===', error);
    return '';
  }
}

/**
 * 随机从数组中取出几个元素
 * @param {*} arr 
 * @param {*} count 
 * @returns 
 */
exports.getRandomArrayElements = function (arr, count) {
  try {
    switch (count) {
      case '一': count = 1; break;
      case '二': count = 2; break;
      case '三': count = 3; break;
      case '四': count = 4; break;
      case '五': count = 5; break;
      case '六': count = 6; break;
      case '七': count = 7; break;
      case '八': count = 8; break;
      case '九': count = 9; break;
      case '十': count = 10; break;
    }
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  } catch (error) {
    console.log('getRandomArrayElements error===', error);
  }
}

/**
 * 阿拉伯数字转中文数字
 * https://www.jb51.net/article/86391.htm
 */
exports.NumberToChinese = function (num) {
  try {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; // 单个数字转换用数组实现
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"]; // 节权位同样用数组实现
    var chnUnitChar = ["", "十", "百", "千"]; // 节内权位同样用数组实现
    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;
    if (num === 0) return chnNumChar[0];
    // 对“零”的第三个规则，把检测放在循环的最前面并默认为false，可以自然的丢弃最高小节的加零判断。
    while (num > 0) {
      var section = num % 10000;
      if (needZero) chnStr = chnNumChar[0] + chnStr;
      strIns = SectionToChinese(section);
      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = (section < 1000) && (section > 0);
      num = Math.floor(num / 10000);
      unitPos++;
    }
    return chnStr;
  } catch (error) {
    console.log('NumberToChinese error===', error);
    return '';
  }
  // 节内转换算法
  function SectionToChinese(section) {
    try {
      var strIns = '', chnStr = '';
      var unitPos = 0;
      var zero = true;
      while (section > 0) {
        var v = section % 10;
        if (v === 0) {
          if (!zero) {
            zero = true;
            chnStr = chnNumChar[v] + chnStr;
          }
        } else {
          zero = false;
          strIns = chnNumChar[v];
          strIns += chnUnitChar[unitPos];
          chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
      }
      return chnStr;
    } catch (error) {
      console.log('SectionToChinese error===', error);
      return '';
    }
  }
}

/**
* 中文数字转阿拉伯数字
* https://www.jb51.net/article/86391.htm
*/
exports.ChineseToNumber = function (chnStr) {
  try {
    if (!chnStr) return chnStr; // 如果不存在，直接返回
    if (!isNaN(chnStr)) return chnStr; // 如果已经是数字，直接返回
    var chnNumChar = { '零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    var chnNameValue = {
      '十': { value: 10, secUnit: false },
      '百': { value: 100, secUnit: false },
      '千': { value: 1000, secUnit: false },
      '万': { value: 10000, secUnit: true },
      '亿': { value: 100000000, secUnit: true }
    }
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    var str = chnStr.split('');
    for (var i = 0; i < str.length; i++) {
      var num = chnNumChar[str[i]];
      if (typeof num !== 'undefined') {
        number = num;
        if (i === str.length - 1) section += number;
      } else {
        var unit = chnNameValue[str[i]].value;
        secUnit = chnNameValue[str[i]].secUnit;
        if (secUnit) {
          section = (section + number) * unit;
          rtn += section;
          section = 0;
        } else section += (number * unit);
        number = 0;
      }
    }
    return rtn + section;
  } catch (error) {
    console.log('ChineseToNumber error===', error);
    return '';
  }
}