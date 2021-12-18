// 手机归属地的回复规则
const { juhe_phoneLocation } = require('../../api/juhe_api');
const { delay } = require('../../utils/common');

/**
 * @param {*} wechaty 微信包
 * @param {*} weMsg 接收的对象
 * @param {*} content 接收的消息内容
 * @returns 
 */
exports.phoneLocation = async function (wechaty, weMsg, content) {
    try {
        let phoneReg = /1[0-9]{10}/g;//匹配手机号
        let num = content.replace(/\s|[(]|[)]|[（]|[）]|[-]*/g, '');//去除字符串中所有空格、小括号和横杠
        let phoneArr = num.match(phoneReg);//识别手机号（在字符串内检索指定的值，或找到一个或多个正则表达式的匹配）
        console.log(phoneArr);
        if (!phoneArr || phoneArr.length == 0) return weMsg.say('没有检测到您要查询的手机号'); // 手机为空
        let msgStr = '检测到要查询的手机号是：';
        phoneArr.forEach(phone => {
            msgStr += '\n' + phone;
        });
        await delay(1000); // 停止几秒钟，防止被检测出机器，即使我们就是机器
        await weMsg.say(msgStr); // 先发送消息一
        msgStr = '查询结果：';
        phoneArr.forEach(async phone => {
            let resObj = await juhe_phoneLocation({ phone });
            if (typeof (resObj) == "object") {
                msgStr += '\n' + phone + '==' + resObj.province + resObj.city + '（' + resObj.company + '）';
            } else msgStr += '\n' + phone + '==' + resObj;
        });
        await delay(3000); // 停止几秒钟，防止被检测出机器，即使我们就是机器
        await weMsg.say(msgStr); // 发送消息二，查询结果
    } catch (error) {
        console.log('phoneLocation rule error===', error);
    }
}
