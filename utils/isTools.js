// 判断的工具
const { juhe_holiday } = require('../api/juhe_api');
/**
 * 判断是否是节假日
 */
exports.is_holiday = async function (dataObj) {
  try {
    let isHoliday = await juhe_holiday(dataObj);
    let ruleArr = ['周末', '节假日'];
    if (ruleArr.indexOf(isHoliday.statusDesc) !== -1) {
      return true;
    }
    return false;
  } catch (error) { console.log('is_holiday error===', error); }
}

/**
 * 判断是否以某个字符串开头
 */
exports.is_string_start = function (string, rule) {
  try {
    if (string.substr(0, rule.length) == rule) {
      return true;
    }
    return false;
  } catch (error) { console.log('is_string_start error===', error); }
}

/**
 * 判断是否以某个字符串结尾
 */
exports.is_string_end = function (string, rule) {
  try {
    if (string.substr(-rule.length) == rule) {
      return true;
    }
    return false;
  } catch (error) { console.log('is_string_end error===', error); }
}
