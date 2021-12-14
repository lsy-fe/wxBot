const superagent = require('./superagent');
const config = require('../config/index');
const { machineIdSync } = require('node-machine-id');
const crypto = require('crypto');
let md5 = crypto.createHash('md5');
let uniqueId = md5.update(machineIdSync()).digest('hex'); // 获取机器唯一识别码并MD5，方便机器人上下文关联
const ONE = 'https://v1.hitokoto.cn'; // 每日一句
const TXHOST = 'http://api.tianapi.com/txapi/'; // 天行host

async function getOne () {
    // 获取每日一句
    try {
        let res = await superagent.req({ url: ONE, method: 'GET' });
        return res.hitokoto;
    } catch (err) {
        console.log('获取每日一句出错', err);
        return '今日只有我爱你！';
    }
}

// 获取天气
async function getWeather () {
    const { appid, appsecret, cityid } = config.WEATHER;
    const url = `https://tianqiapi.com/api?unescape=1&version=v1&appid=${appid}&appsecret=${appsecret}&cityid=${cityid}`;
    try {
        let res = await superagent.req({
            url,
            method: 'GET',
        });
        let todayInfo = res.data[0];
        let tomorrowInfo = res.data[1];
        let hour = new Date().getHours();
        let dataInfo = hour < 12 ? todayInfo : tomorrowInfo;
        const { wea, tem, tem1, tem2, air_level, hours, alarm } = dataInfo;
        let _wea = '';
        // 雨，雪，冰雹，沙尘，雷，雾，阴，晴，云
        if (wea.includes('雷')) {
            _wea = `${wea} ☔️`
        } else if (wea.includes('雨')) {
            _wea = `${wea} ☔️`
        } else if (wea.includes('雪')) {
            _wea = `${wea} ☃️`
        } else if (wea.includes('冰雹')) {
            _wea = `${wea} ☔️`
        } else if (wea.includes('沙') || wea.includes('尘')) {
            _wea = `${wea} 💨`
        } else if (wea.includes('雾') || wea.includes('霾')) {
            _wea = `${wea} 🌫`
        } else if (wea.includes('云')) {
            _wea = `${wea} 🌤`
        } else if (wea.includes('阴')) {
            _wea = `${wea} ☁️`
        } else if (wea.includes('晴')) {
            _wea = `${wea} 🌞`
        }
        let data = `${hour < 12 ? '今' : '明'}日天气 ${_wea}\n平均温度 ${tem}\n最高温度 ${tem1}\n最低温度 ${tem2}\n空气质量 ${air_level}\n`;

        // 如果是第二天hours[0] 为8时 hours[10] 为18时
        const rains = ['雨', '雪', '冰雹', '雷'];
        if (rains.some(item => hours[0].wea.includes(item) || hours[10].wea.includes(item))) {
            data += `\n温馨小贴士\n亲爱的老婆大人，注意啦注意啦！${hour < 12 ? '今' : '明'}天上下班路上有降雨🌧，要记得带伞☂️喔~\n`
        }

        if (alarm.type || alarm.level || alarm.content) {
            data += `\n气象灾害预警\n${alarm.content}\n`;
        }
        console.info('获取天行天气成功', data);
        return data;
    } catch (err) {
        console.log('请求天气失败', err);
        return '请求天气失败';
    }
}

// 天行聊天机器人
async function getReply (word) {
    let url = TXHOST + 'robot/';
    let content = await superagent.req({
        url, method: 'GET', params: {
            key: config.TXAPIKEY,
            question: word,
            mode: 1,
            datatype: 0,
            userid: uniqueId
        }
    });

    if (content.code === 200) {
        let res = content.newslist[0]
        let response = '';
        if (res.datatype === 'text') {
            response = res.reply
        } else if (res.datatype === 'view') {
            response = `虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>《${content.newslist[0].title}》${content.newslist[0].url}`
        } else {
            response = '你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题';
        }
        return response;
    } else {
        return '我好像迷失在无边的网络中了，你能找回我么';
    }
}

async function getSweetWord () {
    // 获取土味情话
    let url = TXHOST + 'saylove/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '你很像一款游戏。我的世界'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

/**
 * 获取垃圾分类结果
 * @param {String} word 垃圾名称
 */

async function getRubbishType (word) {
    let url = TXHOST + 'lajifenlei/';
    let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY, word: word } });

    if (content.code === 200) {
        let type;
        if (content.newslist[0].type == 0) {
            type = '是可回收垃圾';
        } else if (content.newslist[0].type == 1) {
            type = '是有害垃圾';
        } else if (content.newslist[0].type == 2) {
            type = '是厨余(湿)垃圾';
        } else if (content.newslist[0].type == 3) {
            type = '是其他(干)垃圾';
        }
        let response =
            content.newslist[0].name +
            type +
            '<br>解释：' +
            content.newslist[0].explain +
            '<br>主要包括：' +
            content.newslist[0].contain +
            '<br>投放提示：' +
            content.newslist[0].tip;
        return response;
    } else {
        return '暂时还没找到这个分类信息呢';
    }
}

module.exports = {
    getOne,
    getWeather,
    // getTXweather,
    // getReply,
    // getSweetWord,
    // getRubbishType
};
