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
function onScan(qrcode) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  const date = new Date()
  console.log(`当前容器时间:${date}`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }

  // 登陆后创建定时任务
  await initDay();
}

// 登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}

// 监听对话
async function onMessage(msg) {
  // const contact = msg.talker(); // 发消息人
  // const content = msg.text().trim(); // 消息内容
  // const alias = await contact.alias() || await contact.name(); // 发消息人备注
  // const isText = msg.type() === bot.Message.Type.Text;
  // if (msg.self()) {
  //   return;
  // }
  
  // if (isText) {
  //   // 如果非群消息 目前只处理文字消息
  //   console.log(`发消息人: ${alias} 消息内容: ${content}`);
  //   if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
  //     let contactContent = content.replace('?', '').replace('？', '');
  //     if (contactContent) {
  //       let res = await superagent.getRubbishType(contactContent);
  //       await delay(2000);
  //       await contact.say(res);
  //     }
  //   } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
  //     // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
  //     if (content) {
  //       let reply;
  //       if (config.DEFAULTBOT == '0') {
  //         // 天行聊天机器人逻辑
  //         reply = await superagent.getReply(content);
  //         console.log('天行机器人回复：', reply);
  //       }
  //       try {
  //         await delay(2000);
  //         await contact.say(reply);
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   }
  // }
}

// 创建微信每日说定时任务
async function initDay() {
  console.log(`已经设定每日说任务`);
  
  schedule.setSchedule(config.SENDDATE, async () => {
    console.log('你的贴心小助理开始工作啦！');
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let one = await superagent.getOne(); //获取每日一句
    let weather = await superagent.getWeather(); //获取天气信息
    let today = await untils.formatDate(new Date()); //获取今天的日期
    const hugDay = untils.getHugDay();
    const handsDay = untils.getDiffDay('HANDS_DAY');
    const kissDay = untils.getDiffDay('KISS_DAY');
    const birthday = untils.getBirthday();
    // let sweetWord = await superagent.getSweetWord();
    console.log(hugDay, handsDay, kissDay, birthday, weather);
    // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
    let str = `${today}\n\n今天是我们\n第一次抱抱的第${hugDay}天\n第一次牵手的第${handsDay}天\n第一次亲亲的第${kissDay}天\n距离宝贝老婆的生日还有${birthday}天\n\n${weather}\n每日一句\n${one}\n\n—————今天也是超级爱宝贝老婆的一天~💕`;
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
