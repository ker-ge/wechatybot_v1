const superagent = require('superagent');
const axios = require('axios');

/**
 * http方法-浏览器访问
 * @param method 请求方法
 * @param url 请求地址
 * @param params 请求参数
 * @param data 请求body
 * @param cookie cookie
 * @param spider 是否是爬取数据
 * @param platform 平台选择 默认: jh 聚合数据
 */
function http_browser({ method, url, params, data, cookie, spider = false, platform = 'jh' }) {
  return new Promise((resolve, reject) => {
    superagent(method, url)
      .query(params)
      .send(data)
      .set('Content-Type', 'applicaiton/x-www-form-urlencoded')
      .end((err, res) => {
        if (err) reject(err);
        if (spider) { // 如果是爬取内容，直接返回页面html
          resolve(res.text);
        } else {
          switch (platform) {
            case 'jh': // 聚合api相关
              if (res.status === 200) resolve(JSON.parse(res.text));
              break;
            default: // 其他
              resolve(JSON.parse(res.text))
              break;
          }
        }
      });
  });
}

/**
 * 处理请求
 * @param {*} [{}, {}] 
 */
async function http_axios(dataObj) {
  if ((dataObj.method).toLowerCase() == 'post') {
    let resObj = await axios.post(dataObj.url, dataObj.data, dataObj.config).catch(err => { return err; });
    return resObj.data;
  } else if ((dataObj.method).toLowerCase() == 'get') {
    let resObj = await axios.get(dataObj.url, dataObj.config).catch(err => { return err; });
    return resObj.data;
  }
}

/**
 * 处理并发请求
 * @param {*} [{method, url, data, config}, {method, url, config}]
 */
async function http_axios_all(dataArr = []) {
  let reqArr = [];
  dataArr.forEach(dataObj => {
    if ((dataObj.method).toLowerCase() == 'post') {
      reqArr.push(axios.post(dataObj.url, dataObj.data, dataObj.config));
    } else if ((dataObj.method).toLowerCase() == 'get') {
      reqArr.push(axios.get(dataObj.url, dataObj.config));
    }
  });
  if (reqArr.length == 0) return dataArr;
  let resArr = await axios.all(reqArr).catch(err => { return err; });
  let resData = [];
  if (resArr && resArr.length > 0) {
    resArr.forEach(result => {
      resData.push(result.data);
    })
  }
  return resData;
}

module.exports = {
  http_browser,
  http_axios,
  http_axios_all
}