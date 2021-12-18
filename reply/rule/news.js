// 新闻的回复规则
const { juhe_toutiao } = require('../../api/juhe_api');
const { ChineseToNumber, delay } = require('../../utils/common');
// 匹配关键字
const pkArrk = ['推荐', '国内', '国际', '娱乐', '体育', '军事', '科技', '财经', '时尚', '游戏', '汽车', '健康'];
const pkArrv = ['top', 'guonei', 'guoji', 'yule', 'tiyu', 'junshi', 'keji', 'caijing', 'shishang', 'youxi', 'qiche', 'jiankang'];

/**
 * @param {*} wechaty 微信包
 * @param {*} weMsg 接收的对象
 * @param {*} content 接收的消息内容
 * @returns 
 */
exports.news = async function (wechaty, weMsg, content) {
    try {
        let keys = [];
        pkArrk.forEach((k, i) => {
            if (content.indexOf(k) !== -1) keys.push(pkArrv[i]); // 如果有匹配到，就获取对应的查询key
        });
        let replyMsg = '';
        if (keys.length == 0) { //未匹配到
            await weMsg.say('新闻类型有：'+pkArrk.join(',')); // 发送消息
            await delay(1000);
            keys[0] = pkArrv[0]; // 如果没找到匹配的，就用默认推荐的
            replyMsg += '为您送上推荐的新闻\n\n';
        } else if (keys.length > 1) { // 匹配到多条，默认用第一个
            replyMsg += '匹配到多种新闻类型，为您送上' + keys[0] + '类型的新闻\n';
            replyMsg += '(如需其他类型新闻请继续回复)\n\n';
        }
        // 判断是否有页或者条，然后在来判断多少条或者多少页，都没有就用默认
        let dataObj = { type: keys[0], page: 1 };
        let regexPage = /[第]+[(\u4e00-\u9fa5)(0-9)]+[页]+/g; // 匹配是否有第什么什么开头，有的话，可以开始匹配页
        let pageArr = content.match(regexPage); // 有可能匹配到多个，默认拿第一个
        if (pageArr && pageArr.length > 0) {
            let pageStr = pageArr[0].substr(1);
            pageStr = pageStr.substr(0, pageStr.length - 1);
            pageStr = ChineseToNumber(pageStr); // 将中文变成数字
            if (!isNaN(pageStr)) {
                dataObj.page = pageStr;
                replyMsg += pageArr[0] + '\n';
            }
        }
        let resObj = await juhe_toutiao(dataObj);
        resObj.forEach((res, index) => {
            replyMsg += index + '、' + (res.title).trim() + '(' + res.author_name + ')' + '\n';
        });
        await delay(3000); // 停止几秒钟，防止被检测出机器，即使我们就是机器
        await weMsg.say(replyMsg); // 发送消息
    } catch (error) {
        console.log('news rule error===', error);
    }
}
