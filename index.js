/**
 * 微信机器人 V1
 */

const { Wechaty } = require('wechaty');
const bot = new Wechaty({ name: 'wechaty' });
const { onScan, onLogin, onLogout, onMessage } = require('./utils/wechaty.bot');

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot.start().then(() => console.log(`请先扫码登录`)).catch(e => console.log('bot catch error', e));