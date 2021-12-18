/** 微信通知打卡 - 定闹钟它不香嘛
 *  参数 wechaty
 *  配置 dakaConf
 *  {
 *      'topic': '通知的配置',
 *      'sbanDate': '00 00 09 * * *',//上班时间规则
 *      'xbanDate': '00 00 18 * * *',//上班时间规则
 *  }
 */
const schedule = require('../utils/schedule');
const config = require('../config/index');
const { is_holiday } = require('../utils/isTools');
const { delay } = require('../utils/common');
const weT = require('../utils/wechaty.tools');

module.exports = function(wechaty) {
    // 定时任务： 定时打上班卡通知
    schedule.setSchedule(config.dakaConf.sbanDate, async function() {
        let is_holiday_res = await is_holiday(); // 判断是否是节假日
        if (is_holiday_res) return;
        
        // 遍历发送给对应的群数组
        for (const toConf of config.dakaConf.toConfArr) {
            await delay(2000); // 睡两秒，防止被检测出机器人
            let msg = '9点咯，上班了，记得检查一下是否打完上班卡。';
            await weT.msgToRoom(wechaty, msg, toConf); // 发送通知到群
        }
    })

    // 定时任务2： 定时打下班卡通知
    schedule.setSchedule(config.dakaConf.xbanDate, async function() {
        let is_holiday_res = await is_holiday(); // 判断是否是节假日
        if (is_holiday_res) return;

        // 遍历发送给对应的群数组
        for (const toConf of config.dakaConf.toConfArr) {
            await delay(2000); // 睡两秒，防止被检测出机器人
            let msg = '6点咯，下班了，记得检查一下是否打完下班卡。';
            await weT.msgToRoom(wechaty, msg, toConf); // 发送通知到群
        }
    })
}