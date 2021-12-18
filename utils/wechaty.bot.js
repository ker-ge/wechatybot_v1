// wechaty 工具包
const crontabs = require('../crontabs');
const { replyMsg } = require('../reply/index');

/**
 * 监听是否扫码
 * @param {*} qrcode 登录的链接
 * @param {*} status 登录的状态
 */
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true });
}

/**
 * 监听登录
 * @param {*} user 登出的用户
 */
function onLogin(user) {
  console.log(`login success===${user}`);

  //执行登录成功后的定时任务
  for (const key in crontabs) {
    crontabs[key](this);
  }
}

/**
 * 监听登出
 * @param {*} user 登出的用户
 */
function onLogout(user) {
  console.log(`logout success===${user}`);
  // this.stop(); //登出就停止机器人
  // 其他通知处理
}

/**
 * 监听消息
 * @param {*} msg 发送消息的对象
 * @returns 
 */
function onMessage(msg) {
  if (msg.self()) return; // 自身消息不处理
  replyMsg(this, msg);
}

module.exports = {
  onScan,
  onLogin,
  onLogout,
  onMessage
}