# uz 影视

**追剧、直播、无广、投屏、免费**

**iOS & Android & Win & Mac**

- 频道 [t.me/uzvideoplay](https://t.me/uzvideoplay)
- 群组 [t.me/uzVideoApp](https://t.me/uzVideoApp)
- 下载 [123 云盘](https://www.123865.com/s/J0HtVv-QUUxA)

### 扩展仓库

https://github.com/YYDS678/uzVideo-extensions

### 视频源扩展

> 添加方式

uz 影视 -> 设置 -> 数据管理 -> 视频源 -> 小齿轮 -> 添加源列表 -> 输入链接 -> 确定

[大佬扩展源](https://ghp.ci/https://raw.githubusercontent.com/Yswag/uzVideo/main/js/spider_sources.json)

[视频源](https://ghp.ci/https://raw.githubusercontent.com/YYDS678/uzVideo/main/video_sources_default.json)

[色色源](https://ghp.ci/https://raw.githubusercontent.com/YYDS678/uzVideo/main/video_sources_sese.json)

### 直播

[IPTV 大佬 YanG-1989](https://github.com/YanG-1989/m3u)
⚠️ 请注意需要设置 user-agent

[IPTV 大佬 YueChan](https://github.com/YueChan/Live)

### 编写 uz 可执行的扩展

https://github.com/YYDS678/uzVideo-extensions

### 如有任何相关问题联系：[机器人](https://t.me/uzVideoAppbot)

### 采集站源格式

```
{
    "api": "采集地址",
    "name": "名称",
    "remark": "备注",
    "noHistory": false, // *不开启*历史记录 默认false(即开启历史记录)，用户可自行在 app 内修改
    "userAgent": "", // 设置播放ua，用户可自行在 app 内修改
    "isLock": false, // 是否上锁 默认false(即不上锁)，用户可自行在 app 内修改
    "blockClassList": ["短剧"] // 屏蔽分类，用户可自行在 app 内修改
  }
```
