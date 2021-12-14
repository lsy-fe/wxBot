const moment = require('moment');
const config = require('../config/index');
function getDay (date) {
  var date2 = new Date();
  var date1 = new Date(date);
  var iDays = parseInt(
    Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24
  );
  return iDays;
}

function formatDate (date) {
  var tempDate = new Date(date);
  var year = tempDate.getFullYear();
  var month = tempDate.getMonth() + 1;
  var day = tempDate.getDate();
  // var hour = tempDate.getHours();
  // var min = tempDate.getMinutes();
  // var second = tempDate.getSeconds();
  var week = tempDate.getDay();
  var str = '';
  if (week === 0) {
    str = '星期日';
  } else if (week === 1) {
    str = '星期一';
  } else if (week === 2) {
    str = '星期二';
  } else if (week === 3) {
    str = '星期三';
  } else if (week === 4) {
    str = '星期四';
  } else if (week === 5) {
    str = '星期五';
  } else if (week === 6) {
    str = '星期六';
  }
  // if (hour < 10) {
  //   hour = '0' + hour;
  // }
  // if (min < 10) {
  //   min = '0' + min;
  // }
  // if (second < 10) {
  //   second = '0' + second;
  // }
  return year + '-' + month + '-' + day + ' ' + str;
}

// 获取距离 下次拥抱纪念日还有多少天
function getHugDay () {
  const time = config.HUG_DAY;
  // 获取当前时间戳
  const now = moment(moment().format('YYYY-MM-DD')).valueOf();
  // 获取纪念日 月-日
  const mmdd = moment(time).format('-MM-DD');
  // 获取当年
  const y = moment().year();
  // 获取今年拥抱纪念日时间戳
  const nowTimeNumber = moment(y + mmdd).valueOf();
  // 判断 今天的纪念日 有没有过，如果已经过去（now>nowTimeNumber），resultHug日期为明年的纪念日
  // 如果还没到，则 结束日期为今年的拥抱纪念日
  let resultHug = nowTimeNumber;
  if (now > nowTimeNumber) {
    // 获取明年纪念日
    resultHug = moment((y + 1) + mmdd).valueOf();
  }
  return moment(moment(resultHug).format()).diff(moment(now).format(), 'day');
}
// 获取 距离 下次生日还有多少天
function getBirthday () {
  const time = config.BIRTHDAY;
  const birthday = time[moment().year()];
  // 获取当前时间戳
  const now = moment(moment().format('YYYY-MM-DD')).valueOf();
  // 获取纪念日 月-日
  const mmdd = moment(birthday).format('-MM-DD');
  // 获取当年
  const y = moment().year();
  // 获取今年生日 时间戳
  const nowTimeNumber = moment(y + mmdd).valueOf();
  // 判断 生日 有没有过，如果已经过去（now>nowTimeNumber），resultBirthday日期为明年的生日 日期
  // 如果还没到，则 结束日期为今年的目标日期
  let resultBirthday = nowTimeNumber;
  if (now > nowTimeNumber) {
    // 获取明年目标日期
    resultBirthday = moment(time[y + 1]).valueOf();
  }
  return moment(moment(resultBirthday).format()).diff(moment(now).format(), 'day');
}
function getDiffDay (type) {
  const time = config[type]
  return moment(moment().format('YYYY-MM-DD')).diff(time, 'day');
}
// 获取 拥抱几年了
function getHugYear () {
  const time = config.HUG_DAY;
  return moment().year() - moment(time).year();
}
// 获取是第几个生日
function getBirthYear () {
  const birthYear = config.time.birthYear;
  return moment().year() - birthYear;
}

module.exports = {
  getDay,
  getHugDay,
  getBirthday,
  getDiffDay,
  getHugYear,
  getBirthYear,
  formatDate,
};
