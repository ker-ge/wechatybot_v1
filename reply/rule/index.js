const tianqi = require('./tianqi');
const joke = require('./joke');
const news = require('./news');
const phoneLocation = require('./phoneLocation');
/**
 * key：关键字
 * value：对应方法
 */
module.exports = {
    '天气': tianqi,
    '笑话': joke,
    '新闻': news,
    '手机归属地': phoneLocation
}