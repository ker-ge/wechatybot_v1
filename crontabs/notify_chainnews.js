/** 微信通知 链闻-区块链快讯 - 链闻已经没了
 *      https://www.chainnews.com/news/

 *  参数 wechaty
 *  配置 
 *  {
 *      'topic': '',//通知的配置
 *      'dayDate': '00 00 09 * * *',//通知时间
 *  }
 */
const schedule = require('../utils/schedule');
const config = require('../config/index');
const dbConf = require('../config/database');
const { delay, formatDate } = require('../utils/common');
const mysqlDB = require("../utils/mysqlDB"); //引入数据库封装模块
const weT = require('../utils/wechaty.tools');

module.exports = function (wechaty) {
    // 定时任务： 链闻-区块链快讯
    schedule.setSchedule(config.chainnewsConf.dayDate, async function () {
        let str = await getData();
        if (!str) return;
        if (str) {
            str = formatDate(new Date()) + '\n' + str;
            str = str.substring(0, str.length - 2); //删除后面两个空格
        }

        // 遍历发送给对应的群数组
        for (const toConf of config.chainnewsConf.toConfArr) {
            await delay(2000); // 睡两秒，防止被检测出机器人
            await weT.msgToRoom(wechaty, str, toConf); // 发送通知到群
        }
    })

    // 链闻-区块链快讯
    async function getData() {
        let str = '';
        try {
            // 使用案例
            const connection = await mysqlDB.connect(dbConf.newsDbConf); // 开启连接
            try {
                let idArr = [];
                let sql = 'SELECT id, hot_title, hot_url FROM hot_chainnews where is_read = 0 order by id asc;';
                let queryRes = await connection.query(sql);
                if (queryRes && queryRes.length > 0) {
                    queryRes.forEach((res, inx) => {
                        str += inx + ', ' + res.hot_title + '\n';
                        str += res.hot_url + '\n\n';
                        idArr.push(res.id);
                    });
                    let sql2 = "UPDATE hot_chainnews SET is_read = 1 WHERE id in (" + idArr.join() + ");";
                    connection.query(sql2);
                }
            } catch (error) {
                console.log(error);
            } finally {
                connection.end(); // 关闭连接
            }
        } catch (error) {
            console.log(' error ==', error);
        } finally {
            return str;
        }
    }
}