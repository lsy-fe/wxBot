/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { Wechaty } = require('wechaty');
const schedule = require('./schedule/index');
const config = require('./config/index');
const untils = require('./utils/index');
const superagent = require('./superagent/index');

// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 二维码生成
function onScan (qrcode) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin (user) {
  console.log(`贴心小助理${user}登录了`);
  const date = new Date()
  console.log(`当前容器时间:${date}`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }

  // 创建定时天气任务
  await initWeatherDay();
  // 创建定时提醒任务
  await initRemind();
  // 创建纪念日提醒任务
  await initMemorialDay();
}

// 登出
function onLogout (user) {
  console.log(`小助手${user} 已经登出`);
}

// 监听对话
async function onMessage (msg) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text;
  if (msg.self()) {
    return;
  }

  if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${content}`);
    if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
      let contactContent = content.replace('?', '').replace('？', '');
      if (contactContent) {
        let res = await superagent.getRubbishType(contactContent);
        await delay(2000);
        await contact.say(res);
      }
    } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
      // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
      if (content) {
        let reply;
        if (config.DEFAULTBOT == '0') {
          // 天行聊天机器人逻辑
          reply = await superagent.getReply(content);
          console.log('天行机器人回复：', reply);
        }
        try {
          await delay(2000);
          await contact.say(reply);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}

// 创建微信每日说定时任务
async function initWeatherDay () {
  console.log(`已经设定每日说任务`);

  schedule.setSchedule(config.SENDDATE_WEATHER, async () => {
    console.log('你的贴心小助理开始工作啦！');
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let one = await superagent.getOne(); //获取每日一句
    let weather = await superagent.getNewWeather(); //获取天气信息
    let today = await untils.formatDate(new Date()); //获取今天的日期
    let week = new Date().getDay();
    let str = '';

    const birthday = untils.getBirthday();
    // 1,3,6,
    const hugDay = untils.getDiffDay('HUG_DAY');
    const handsDay = untils.getDiffDay('HANDS_DAY');
    const kissDay = untils.getDiffDay('KISS_DAY');

    // 2,4
    const movieDay = untils.getDiffDay('MOVIE_DAY');
    const tourDay = untils.getDiffDay('TOUR_DAY');
    const skyWheelDay = untils.getDiffDay('SKY_WHEEL_DAY');

    // 5,7
    const confessionDay = untils.getDiffDay('CONFESSION_DAY');
    const willingDay = untils.getDiffDay('WILLING_DAY');
    const husbandDay = untils.getDiffDay('HUSBAND_DAY');

    let word = '';
    switch (week) {
      case 1:
      case 3:
      case 6:
        word = `第一次抱抱的第${hugDay}天\n第一次牵手的第${handsDay}天\n第一次亲亲的第${kissDay}天`;
        break;
      case 2:
      case 4:
        word = `第一次看电影的第${movieDay}天\n第一次旅行的第${tourDay}天\n第一次坐摩天轮的第${skyWheelDay}天`;
        break;
      case 5:
      case 7:
        word = `第一次表白的第${confessionDay}天\n第一次说“我也爱你，我愿意”的第${willingDay}天\n第一次喊老公的第${husbandDay}天`;
        break;
    }
    // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
    str = `${today}\n\n今天是我们\n${word}\n距离宝贝老婆的生日还有${birthday}天\n\n${weather}\n每日一句\n${one}\n\n今天也是超级爱宝贝老婆的一天~💕`;

    try {
      logMsg = str;
      await delay(2000);
      await contact.say(str); // 发送消息
    } catch (e) {
      logMsg = e.message;
    }
    console.log(logMsg);
  });
}

async function initRemind () {
  console.log(`已经设定定时提醒任务`);

  schedule.setSchedule(config.SENDDATE_REMIND, async () => {
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let now = await untils.formatDate(new Date(), 'mins');
    let sweetWord = await superagent.getSweetWord();
    let str = `${now}\n\n我的晨晨小宝贝，到了休息时间啦！起来走走，活动一下，喝口水，休息一下再继续~\n\n${sweetWord}\n\n————我真的好爱好爱你呀~❤️`;

    try {
      logMsg = str;
      await delay(2000);
      await contact.say(str); // 发送消息
    } catch (e) {
      logMsg = e.message;
    }
    console.log(logMsg);
  });
}

async function initMemorialDay () {
  console.log(`已经设定纪念日提醒任务`);

  schedule.setSchedule(config.SENDDATE_MEMORIAL, async () => {
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let today = await untils.formatDate(new Date()); //获取今天的日期
    const birthday = untils.getBirthday();
    let str = '';

    const diffArray = ['HUG_DAY', 'HANDS_DAY', 'KISS_DAY', 'MOVIE_DAY', 'TOUR_DAY', 'SKY_WHEEL_DAY', 'CONFESSION_DAY', 'WILLING_DAY', 'HUSBAND_DAY'];
    const resultArray = diffArray.map(item => untils.getSameDay(item));
    const theSame = resultArray.filter(item => item.result);
    // if (theSame.length) {
    //   getDiffYear(theSame[0].type);
    //   str = `${today}\n\n`;
    // } else
    if (!birthday) {
      str = `${today}\n\n今天是我的小仙女老婆人生当中第${untils.getBirthYear()}个生日！全世界最可爱的小仙女，祝你生日快乐呀~天呐？！我的小仙女终于上高中了！我终于可以光明正大名正言顺地和我的仙女老婆谈恋爱啦！想成为你开心时第一个想分享的人，难过时想要依靠的人；想成为你生命里无法缺少的那一部分，想成为你坚定地牵手走到最后的人！想让与你在一起的每一天都充满新鲜感、仪式感，让你都难以忘记！希望今天能够成为我的仙女老婆这一年到目前为止最开心的一天~💞`
    }

    if (str) {
      try {
        logMsg = str;
        await delay(2000);
        await contact.say(str); // 发送消息
      } catch (e) {
        logMsg = e.message;
      }
      console.log(logMsg);
    }
  });
}

const bot = new Wechaty({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat', // 如果有token，记得更换对应的puppet
  // puppetOptions: {
  //   token: '如果有token，填入wechaty获取的token，并把注释放开'
  // }
});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));
