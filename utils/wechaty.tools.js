// wechaty 工具包
const config = require('../config');

/**
 * 发送消息到联系人
 * @param {*} wechaty 微信包
 * @param {*} msg 发送的消息
 * @param {*} toConf 发送查询的配置
 */
async function msgToContact(wechaty, msg, toConf) {
  try {
    let contactObj = await wechaty.Contact.find(toConf); // 查询联系人
    await contactObj.say(msg); // 发送消息
  } catch (error) { console.log('msgToContact error===', error); }
}

/**
 * 发送消息到群聊
 * @param {*} wechaty 微信包
 * @param {*} msg 发送的消息
 * @param {*} toConf 发送查询的配置
 */
async function msgToRoom(wechaty, msg, toConf) {
  try {
    let rootObj = await wechaty.Room.find(toConf); // 查询群聊
    if (!rootObj) return msgToContact(wechaty, `查找Room【${JSON.stringify(toConf)}】为空`, { name: config.selfName }); // 查询不到东西就发送通知给个人
    await rootObj.say(msg); // 发送消息
  } catch (error) { console.log('msgToRoom error===', error); }
}


module.exports = {
  msgToContact,
  msgToRoom
}