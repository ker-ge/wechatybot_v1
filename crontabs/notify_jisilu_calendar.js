/** 微信通知 集思录投资日历
 *      
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=divhk&start=1632672000&end=1636300800 // 港股分红
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=diva&start=1632672000&end=1636300800 // A股分红
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=newstock_onlist&start=1632672000&end=1636300800 // 上市股票列表
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=newstock_apply&start=1632672000&end=1636300800 // 申购股票列表
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=CNV&start=1632672000&end=1636300800 // 可转债信息
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=OTHER&start=1632672000&end=1636300800 // 股市休市
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=newbond_apply&start=1632672000&end=1636300800 // 债券申购
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=newbond_onlist&start=1632672000&end=1636300800 // 债券上市
// 已废弃
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=FUND&start=1632672000&end=1636300800&_=1634007295216
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=BOND&start=1632672000&end=1636300800&_=1634007295217
// https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=STOCK&start=1632672000&end=1636300800&_=1634007295218


 *  参数 wechaty
 *  配置 jisiluConf
 *  {
 *      'topic': '通知的配置',
 *      'dayDate': '00 00 09 * * *',//通知时间
 *  }
 */
const schedule = require('../utils/schedule');
const config = require('../config/index');
const { delay, formatDate, getStartEndTime } = require('../utils/common');
const { is_holiday } = require('../utils/isTools');
const { http_browser } = require('../utils/http');
const weT = require('../utils/wechaty.tools');

module.exports = function (wechaty) {
    // 定时任务： 集思录投资日历
    schedule.setSchedule(config.jisiluConf.dayDate, async function () {
        let is_holiday_res = await is_holiday(); // 判断是否是节假日
        if (is_holiday_res) return;
        let str = await getAllcalendar();
        if (!str) {
            for (const toConf of config.noticeArr) {
                await delay(1000); // 睡1秒，防止被检测出机器人
                await weT.msgToContact(wechaty, '获取集思录投资日历为空', toConf); // 查不到东西！发送通知到个人
            }
            return;
        }
        if (str) {
            str = formatDate(new Date()) + '\n' + str;
            // 遍历发送给对应的群数组
            for (const toConf of config.jisiluConf.toConfArr) {
                await delay(2000); // 睡两秒，防止被检测出机器人
                await weT.msgToRoom(wechaty, str, toConf); // 发送通知到群
            }
        }
    })

    // 获取集思录投资日历
    async function getAllcalendar() {
        let str = '';
        try {
            let baseUrl = 'https://www.jisilu.cn/data/calendar/get_calendar_data/';
            let requestArr = [];
            let qtypeArr = [
                { key: "newstock_onlist", info: "今日上市" },
                { key: "newstock_apply", info: "今日申购" },
                { key: "CNV", info: "可转债消息" },
                { key: "OTHER", info: "休市情况" },
            ];
            let timeArr = getStartEndTime();
            qtypeArr.forEach(qtype => {
                let req = http_browser({
                    method: 'get',
                    url: baseUrl,
                    params: { qtype: qtype.key, start: timeArr[0], end: timeArr[1] },
                    spider: false
                });
                requestArr.push(req);
            })
            // 并发请求
            let resArr = await Promise.all(requestArr);
            resArr.forEach((val, key) => {
                qtypeArr.forEach((qtype, index) => {
                    if (key == index && val.length > 0) {
                        str += qtype.info + '\n';
                        val.forEach(v => {
                            str += '--' + v.title + '\n';
                        });
                    }
                });
            });
        } catch (error) {
            console.log(' error ==', error);
        } finally {
            return str;
        }
    }
}