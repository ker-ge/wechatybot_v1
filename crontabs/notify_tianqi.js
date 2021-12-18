/** 微信通知天气
 *      https://www.juhe.cn/docs/api/id/73
 *  参数 wechaty
 *  配置 tianqiConf
 *  {
 *      'topic': '通知的配置',
 *      'dayDate': '00 00 09 * * *',//通知时间
 *  }
 */
const schedule = require('../utils/schedule');
const config = require('../config/index');
const { formatDate } = require('../utils/common');
const { juhe_tianqi } = require('../api/juhe_api');
const { delay } = require('../utils/common');
const weT = require('../utils/wechaty.tools');

module.exports = function(wechaty) {
    // 定时任务： 每日天气预报
    schedule.setSchedule(config.tianqiConf.dayDate, async function() {
        let resObj = await juhe_tianqi({city: config.tianqiConf.defaultCity});
        if (!resObj) {
            for (const toConf of config.noticeArr) {
                await delay(1000); // 睡1秒，防止被检测出机器人
                await weT.msgToContact(wechaty, '查询天气为空', toConf); // 查不到东西！发送通知到个人
            }
            return;
        }
        let str = '';
        str += formatDate(new Date()) + '\n';
        str += config.tianqiConf.defaultCity + '\n';
        str += '天气：' + resObj.realtime.info + '\n';
        if (resObj.realtime.temperature) str += '温度：' + resObj.realtime.temperature + '\n';
        if (resObj.realtime.humidity) str += '湿度：' + resObj.realtime.humidity + '\n';
        if (resObj.realtime.direct) str += '风向：' + resObj.realtime.direct + '\n';
        if (resObj.realtime.power) str += '风力：' + resObj.realtime.power + '\n';
        if (resObj.realtime.aqi) str += '空气质量指数：' + resObj.realtime.aqi;

        // 遍历发送给对应的群数组
        for (const toConf of config.tianqiConf.toConfArr) {
            await delay(2000); // 睡两秒，防止被检测出机器人
            await weT.msgToRoom(wechaty, str, toConf); // 发送通知到群
        }
    })
}