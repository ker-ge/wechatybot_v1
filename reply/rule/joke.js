// 笑话的回复规则
const { juhe_joke } = require('../../api/juhe_api');
const { fuzzyQuery, getRandomArrayElements } = require('../../utils/common');
// 匹配的关键字
const pkStr = '最新,随机';
const returnNumKeys = '一,二,两,俩,三,四,五,六,七,八,九,十,1,2,3,4,5,6,7,8,9,10'; // 返回多少条
const defaultNum = 5; // 默认返回条数

/**
 * @param {*} wechaty 微信包
 * @param {*} weMsg 接收的对象
 * @param {*} content 接收的消息内容
 * @returns 
 */
exports.joke = async function (wechaty, weMsg, content) {
    try {
        let keys = fuzzyQuery(pkStr, content);
        let resObj = await juhe_joke({ type: keys });
        let replyMsg = '';
        let resArr = resObj.map(joke => { return (joke.content).trim(); }).join(',').split(',');
        let count = fuzzyQuery(returnNumKeys, content) || defaultNum;
        let resData = getRandomArrayElements(resArr, count); // 随机从数组中取出指定条数
        resData.forEach((joke, index) => {
            replyMsg += index + '、' + joke + '\n\n';
        })
        await delay(3000); // 停止几秒钟，防止被检测出机器，即使我们就是机器
        await weMsg.say(replyMsg.trim()); // 发送消息
    } catch (error) {
        console.log('joke rule error===', error);
    }
}
