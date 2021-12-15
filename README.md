
weBot 是 [《微信每日说》](https://github.com/gengchen528/wechatBot) 基础上的二次开发，个人定制

## 最新通知 喜大普奔

由于wechaty的升级，现已支持所有微信登录，就算你的微信之前不能登录web版，现在也可以用了，赶快来体验吧。

### 主要功能

- [x] 定时给女朋友发送每日天气提醒，定时提醒，纪念日提醒
- [x] 天行机器人自动陪女朋友聊天（需要自己申请[天行机器人](https://www.tianapi.com/signup.html?source=474284281)api，不过目前开源的机器人 api 都不要抱太大希望，因为很傻的，如果你有发现好的机器人可以来推荐）
- [x] 垃圾分类功能，使用方法：？垃圾名称

### 可选聊天机器人

- 天行机器人: 默认设置为天行机器人(智能化程度一般)，还是建议大家自行注册自己账号 [天行数据官网](https://www.tianapi.com/signup.html?source=474284281)
- 图灵机器人: 目前比较智能的机器人，但是需要注册后进行身份认证，才可调用，且每天只可免费调用 100 次（收费标准 99 元/月，每天 1000 次）[图灵官网](http://www.tuling123.com)

## 天行数据需要申请的api （重要）

如遇到获取不到天气数据，或者机器人无法自动回复等问题，请登录天行数据个人中心查看是否申请了对应的接口权限，以下链接为快速申请链接：

* 天行机器人： [https://www.tianapi.com/apiview/47](https://www.tianapi.com/apiview/47)
* 天气查询：[https://www.tianapi.com/apiview/72](https://www.tianapi.com/apiview/72)
* 垃圾分类： [https://www.tianapi.com/apiview/97](https://www.tianapi.com/apiview/97)
* 土味情话： [https://www.tianapi.com/apiview/80](https://www.tianapi.com/apiview/80)
* 天行图灵机器人: [https://www.tianapi.com/apiview/98](https://www.tianapi.com/apiview/98)

## 环境

- `node.js` ( 16 ≤ version)
- `Mac / Linux / Windows`

## 安装配置

视频教程： <a href="https://www.bilibili.com/video/av56077628?pop_share=1" target="_blank">《三步教你用 Node 做一个微信哄女友神器》</a>

### 下载安装 node

访问 node 官网：[http://nodejs.cn/download/](http://nodejs.cn/download/)，下载系统对应版本的 node 安装包，并执行安装。

> 1. windows 下安装步骤详细参考 [NodeJs 安装 Windwos 篇](https://www.cnblogs.com/liuqiyun/p/8133904.html)
> 2. Mac 下安装详细步骤参考 [NodeJs 安装 Mac 篇](https://blog.csdn.net/qq_32407233/article/details/83758899)
> 3. Linux 下安装详细步骤参考 [NodeJs 安装 Linux 篇](https://www.cnblogs.com/liuqi/p/6483317.html)

### 配置 npm 源

配置 `npm` 源为淘宝源（重要，因为需要安装 `chromium`，不配置的话下载会失败或者速度很慢，因为这个玩意 140M 左右）

```bash
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```

### 下载代码

![download-project](https://user-gold-cdn.xitu.io/2019/6/16/16b5fcb3ea7ee507?w=1917&h=937&f=png&s=180655)

```bash
# 如果没有安装 git，也可直接下载项目zip包
git clone https://github.com/gengchen528/wechatBot.git
cd wechatBot
npm install
```

### 项目配置

所有配置项均在 `config/index.js` 文件中

### 执行

当以上步骤都完成后，在命令行界面输入 `node index.js`，第一次执行会下载 puppeteer，所以会比较慢，稍等一下，出现二维码后即可拿出微信扫描

![](https://user-gold-cdn.xitu.io/2019/6/16/16b5fa4678361c14?w=969&h=724&f=png&s=51158)

执行成功后可看到

![](https://user-gold-cdn.xitu.io/2019/6/16/16b5fa9bc1f5c76e?w=977&h=322&f=png&s=25797)

## 常见问题处理 (FAQ)

问题解决基本方案:

- 先检查 node 版本是否大于 12, 且不能超过 14
- 确认 npm 或 yarn 已经配置好淘宝源
- 存在 package-lock.json 文件先删除
- 删除`node_modules`后重新执行`npm install` 或`cnpm install`

1. 类似 Failed to download Chromium rxxx 的问题
    `ERROR: Failed to download Chromium r515411! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.{ Error: read ETIMEDOUT at _errnoException (util.js:1041:11) at TLSWrap.onread (net.js:606:25) code: 'ETIMEDOUT', errno: 'ETIMEDOUT', syscall: 'read' }`

    解决方案：[https://github.com/GoogleChrome/puppeteer/issues/1597](https://github.com/GoogleChrome/puppeteer/issues/1597)

    `npm config set puppeteer_download_host=https://npm.taobao.org/mirrors`

    `sudo npm install puppeteer --unsafe-perm=true --allow-root`

2. 执行 `npm run start` 时无法安装 puppet-puppeteer&&Chromium

    - Centos7 下部署出现以下问题
      ![](http://image.bloggeng.com/14481551970095_.pic_hd.jpg)
      问题原因:[https://segmentfault.com/a/1190000011382062](https://segmentfault.com/a/1190000011382062)
      解决方案:
            #依赖库
            yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

            #字体
            yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
    - ubuntu 下，下载 puppeteer 失败  
       问题原因：[https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
      解决方案：

           sudo apt-get  gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

    - windows 下，下载 puppeteer 失败

      链接：https://pan.baidu.com/s/1YF09nELpO-4KZh3D2nAOhA
      提取码：0mrz

      把下载的文件放到如下图路径，并解压到当前文件夹中即可
      ![](http://image.bloggeng.com/14241551970542_.pic_hd.jpg)

    - 下载 puppeteer 失败,Linux 和 Mac 执行以下命令
      `PUPPETEER_DOWNLOAD_HOST = https://npm.taobao.org/mirrors npm install wechaty-puppet-wechat`

    - 下载 puppeteer 失败,Windows 执行以下命令

      `SET PUPPETEER_DOWNLOAD_HOST = https://npm.taobao.org/mirrors npm install wechaty-puppet-wechat`

3. 如图所示问题解决办法，关闭 win / mac 防火墙；如果公司网络有限制的话也可能引起无法启动问题
    ![](http://image.bloggeng.com/WechatIMG7619.png)

4. 更多关于 wechaty 功能相关接口

    [参考 wechaty 官网文档](https://wechaty.js.org/docs/)
    
5. 希望输出运行日志相关 DEBUG 信息, 并保存到本地
   - 在运行前, 系统里输入 `export WECHATY_LOG=verbose` 就能将默认日志输出改为详细 (其他等级参考[官方文档](https://www.npmjs.com/package/brolog#loglevelnewlevel)) 
   - 保存到本地, 在支持 `bash` 环境的命令行中, 可以用这样的方式启动程序: `node index.js 2>&1 | tee bot.log`, 这样控制台和后台会同时显示/存储日志信息.

6 .CentOS 安装 better-sqlite3 报错的问题

* 首先执行 `sudo yum install centos-release-scl-rh`，`sudo yum install devtoolset-8-build `这两个方法

* 安装相应的gdb，`sudo yum install devtoolset-8-gdb`
  
* 同样，也可以安装相应版本的 gcc 和 g++，`sudo yum install devtoolset-8-gcc devtoolset-8-gcc-c++`

* yum安装完后，原来的gcc不覆盖，所以需要执行enable脚本更新环境变量，`sudo source /opt/rh/devtoolset-8/enable`

* 可以通过加入到profile里面开机自动`source, vim /etc/profile`, 跳到最后一行加入以下内容，`source /opt/rh/devtoolset-8/enable`

## 注意

本项目属于个人定制二次开发