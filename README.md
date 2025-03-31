# uz 影视

**追剧、直播、无广、投屏、免费**

**iOS & Android & Win & Mac**

- 频道 [t.me/uzvideoplay](https://t.me/uzvideoplay)
- 群组 [t.me/uzVideoApp](https://t.me/uzVideoApp)

### 扩展仓库，编写扩展

https://github.com/YYDS678/uzVideo-extensions

### 将资源内置包内

1. 将 `.ipa` `.apk` `.msix` 后缀改为 `.zip` 使用加压软件解压
2. 找到 `uzAio.zip`

   1. iOS `/Payload/Runner.app/Frameworks/App.framework/flutter_assets/uzAio/uzAio.zip`
   2. Android `/assets/flutter_assets/uzAio/uzAio.zip`
   3. Win `/data/flutter_assets/uzAio/uzAio.zip`

3. 准备自己的源文件可在 `env.json` 直接将环境变量填写完整
4. 将自己的源文件命名为 `uzAio.zip` 替换第二部找到的 `uzAio.zip`
5. 将 第一步 解压后的文件重新压缩，并改为之前的后缀
6. 安装后，打开 app 设置 -> 数据管理 -> + -> 读取应用内文件


### 如有任何相关问题联系：[机器人](https://t.me/uzVideoAppbot)
