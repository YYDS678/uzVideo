# uz影视

**追剧、直播、无广、投屏、免费**

**iOS & Android**

- 频道 [t.me/uzvideoplay](https://t.me/uzvideoplay)
- 群组 [t.me/uzVideoApp](https://t.me/uzVideoApp)

#### 视频源扩展
> 添加方式
 
uz影视 -> 设置 -> 数据管理 -> 视频源 -> 小齿轮 -> 添加源列表 -> 输入链接 -> 确定

[大佬扩展源](https://mirror.ghproxy.com/https://raw.githubusercontent.com/Yswag/uzVideo/main/js/spider_sources.json)

[视频源](https://mirror.ghproxy.com/https://raw.githubusercontent.com/YYDS678/uzVideo/main/video_sources_default.json)

[IPTV 大佬 YanG-1989，已经内置](https://github.com/YanG-1989/m3u)

[IPTV 大佬 YueChan，已经内置](https://github.com/YueChan/Live)

[色色源](https://mirror.ghproxy.com/https://raw.githubusercontent.com/YYDS678/uzVideo/main/video_sources_sese.json)

#### 首页推荐扩展
> 添加方式
 
uz影视 -> 设置 -> 数据管理 -> 推荐扩展 -> 小齿轮 -> 添加 -> 输入链接 -> 确定

[豆瓣推荐首页](https://mirror.ghproxy.com/https://raw.githubusercontent.com/YYDS678/uzVideo/refs/heads/main/js/recommendHome.json)

# 编写 uz 可执行的扩展

<https://github.com/YYDS678/uzVideo/tree/main/js>

# 如有任何相关问题联系：[机器人](https://t.me/uzVideoAppbot)

# 数据源格式说明

## 采集站源格式
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
