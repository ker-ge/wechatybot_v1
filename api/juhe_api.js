// 聚合数据集合 https://www.juhe.cn/docs/

const { http_browser } = require('../utils/http');
const config = require('../config/index');
const { formatDate } = require('../utils/common');

/** 生日书：https://www.juhe.cn/docs/api/id/619
 * @param {*} dataObj = { date: '2021-10-10' }
 */
module.exports.juhe_birthdaybook = async function (dataObj) {
    let resData;
    try {
        let url = 'http://apis.juhe.cn/fapig/birthdayBook/query';
        let keyword = (dataObj && dataObj.date) ? dataObj.date : formatDate(new Date(), 'YYYY-MM-DD');
        let params = { key: config.juheApiKey.birthdaybookKey, keyword };
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0) resData = resultObj.result;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('生日书 error ==', error);
    } finally {
        return resData;
    }
}

/** 笑话大全：https://www.juhe.cn/docs/api/id/95
 * @param {*} dataObj = { type: 'new', page: '1', pagesize: '10' }
 */
module.exports.juhe_joke = async function (dataObj) {
    let resData;
    try {
        let url = 'http://v.juhe.cn/joke/randJoke.php'; // 默认随机
        let params = { key: config.juheApiKey.jokeKey };
        switch (dataObj.type) {
            case '新':
                params.pagesize = 10;
                url = 'http://v.juhe.cn/joke/content/text.php';
                break;
            default: break;
        }
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0 && resultObj.reason == 'success' && (resultObj.result).length > 0) resData = resultObj.result;
        else if (resultObj.error_code == 0 && resultObj.reason == 'Success' && (resultObj.result.data).length > 0) resData = resultObj.result.data;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('笑话大全 error ==', error);
    } finally {
        return resData;
    }
}

/** 天气预报：https://www.juhe.cn/docs/api/id/73
 * @param {*} dataObj = { city: '' }
 */
module.exports.juhe_tianqi = async function (dataObj) {
    let resData;
    try {
        if (!dataObj || !dataObj.city) return 'city cannot be empty';
        let url = 'http://apis.juhe.cn/simpleWeather/query';
        let params = { key: config.juheApiKey.tianqiKey, city: dataObj.city };
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0) resData = resultObj.result;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('天气预报 error ==', error);
    } finally {
        return resData;
    }
}

/** 新闻头条：https://www.juhe.cn/docs/api/id/235
 * @param {*} dataObj = { type: 'top', page: '1', page_size: '10' }
 */
module.exports.juhe_toutiao = async function (dataObj) {
    let resData;
    try {
        let url = 'http://v.juhe.cn/toutiao/index';
        let params = { key: config.juheApiKey.toutiaoKey, type: 'top', page: 1, page_size: 5 };
        if (dataObj && dataObj.type) params.type = dataObj.type;
        if (dataObj && dataObj.page) params.page = dataObj.page;
        if (dataObj && dataObj.page_size) params.page_size = dataObj.page_size;
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0) resData = resultObj.result.data;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('新闻头条 error ==', error);
    } finally {
        return resData;
    }
}

/** 节假日信息查询：https://www.juhe.cn/docs/api/id/606
 * @param {*} dataObj = { date: '2021-05-01' }
 */
module.exports.juhe_holiday = async function (dataObj) {
    let resData;
    try {
        let url = 'http://apis.juhe.cn/fapig/calendar/day.php';
        let params = { key: config.juheApiKey.holidayKey, date: '' };
        params.date = (dataObj && dataObj.date) ? dataObj.date : formatDate(new Date(), 'YYYY-MM-DD');
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0) resData = resultObj.result;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('节假日信息查询 error ==', error);
    } finally {
        return resData;
    }
}


/** 手机归属地查询：https://www.juhe.cn/docs/api/id/11
 * @param {*} dataObj = { phone: '13800000000' }
 */
module.exports.juhe_phoneLocation = async function (dataObj) {
    let resData;
    try {
        if (!dataObj || !dataObj.phone) return 'phone cannot be empty';
        let url = 'http://apis.juhe.cn/mobile/get';
        let params = { key: config.juheApiKey.phoneLocationKey, phone: dataObj.phone };
        let resultObj = await http_browser({ method: 'get', url, params });
        if (resultObj.error_code == 0) resData = resultObj.result;
        else resData = resultObj.reason;
    } catch (error) {
        console.log('手机归属地查询 error ==', error);
    } finally {
        return resData;
    }
}