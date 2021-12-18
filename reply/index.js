const config = require('../config/index');
const ruleArr = require('./rule');
exports.replyMsg = async function (wechaty, msg) {
    try {
        const contact = msg.talker(); // 发消息人
        // const sendAlias = await contact.alias(); // 发消息人备注名
        // const sendName = await contact.name(); // 发消息人名字
        var content = msg.text().trim(); // 聊天内容
        const room = msg.room(); // 群消息
        const isText = msg.type() === wechaty.Message.Type.Text;
        if (isText) { //暂时只处理文字消息
            if (room) { // 如果是群组的话！就必须要有召唤才会回应
                const topic = await room.topic();
                console.log(`群名: ${topic} 发消息人: ${contact.payload.name} 内容: ${content}`);
                if (content == config.summonName) return msg.say('没事不要叫老子！！！'); // 只叫了名字，啥也没说
                if (content == '@' + config.summonName) return msg.say('没事不要@老子！！！'); // 只@了名字，啥也没说
                // 如果没有叫你，就不用理他！
                if (content.indexOf(config.summonName) === -1) return;
                content = content.replace(RegExp(config.summonName, "g"), " "); // 把叫你的名字去掉，减少匹配错误
            } else { // 个人消息
                console.log(`发消息人: ${contact.payload.alias}(${contact.payload.name}) 消息内容: ${content}`);
            }
            // 开始匹配关键字规则
            replyRuleMatch(content);
        }
    } catch (error) {
        console.log('replyMsg error===', error);
    }

    // replyRule匹配
    function replyRuleMatch(content) {
        try {
            // 开始处理指令
            let keywordsArr = Object.keys(ruleArr);// 关键字
            let funcArr = Object.values(ruleArr);// 关键字对应的功能
            if (content.indexOf('【功能菜单】') !== -1) {
                let msgStr = '【功能菜单】\n' + keywordsArr.join('\n');
                return msg.say(msgStr); // 回复菜单功能
            }
            // 匹配一下关键字，确认好要操作哪一个功能，可能匹配到多个关键字
            // 这样有一个bug，接收到的消息如果是匹配多个的关键字，就会发送多次消息、后面在解决
            keywordsArr.forEach((keywords, index) => {
                if (content.indexOf(keywords) !== -1) {
                    content = content.replace(RegExp(keywords, "g"), " "); // 把匹配到的关键字去掉，减少匹配错误
                    let ruleObj = funcArr[index]; // 获取关键字对应的方法
                    for (const key in ruleObj) {
                        ruleObj[key](wechaty, msg, content);
                    }
                }
            });
        } catch (error) {
            console.log('replyRuleMatch error===', error);
        }
    }
}
