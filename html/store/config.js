// URL Schemes
export const URL_SCHEMES = {
  BASE: 'uzVideo://uzVideo?action=addSub&url=',
  INTENT: 'intent://uzVideo?action=addSub&url='
};

// Messages
export const MESSAGES = {
  COPY_SUCCESS: '复制成功',
  COPY_FAIL: '复制失败，请手动复制：\n\n',
  USAGE_PATH: '使用路径：uz影视 -> 设置 -> 数据管理 -> 订阅 -> +',
  EMPTY_URL: '请输入资源链接',
  INVALID_URL: '请输入有效的URL'
};

// Resource Configs
export const RESOURCE_CONFIGS = [
  {
    title: 'uz影视 all in one 无代理',
    description: '整合大佬们开发的资源，感谢所有大佬. <a href="https://github.com/Yswag">Yswag</a>  <a href="https://github.com/wangdepeng100">wangdepeng100</a>',
    resourceUrl: 'https://raw.githubusercontent.com/YYDS678/uzVideo-extensions/refs/heads/main/uzAio.zip'
  },
  {
    title: 'uz影视 all in one',
    description: '整合大佬们开发的资源，感谢所有大佬. <a href="https://github.com/Yswag">Yswag</a>  <a href="https://github.com/wangdepeng100">wangdepeng100</a>',
    resourceUrl: 'https://github.moeyy.xyz/https://raw.githubusercontent.com/YYDS678/uzVideo-extensions/refs/heads/main/uzAio.zip'
  },
  {
    title: 'pv大佬 all in one',
    description: '<a href="https://github.com/proversion2024">proversion2024</a> 大佬 all in one，感谢大佬',
    resourceUrl: 'https://ghproxy.cn/https://raw.githubusercontent.com/proversion2024/uz-extensions/refs/heads/master/uzAio.json'
  },
  {
    title: '网盘源',
    description: '<a href="https://github.com/proversion2024">proversion2024</a>   大佬开发，感谢大佬',
    resourceUrl: 'https://ghproxy.cn/https://raw.githubusercontent.com/proversion2024/uz-extensions/refs/heads/master/vod/vod.json'
  },
  {
    title: '采集站',
    description: '采集站资源，不需要添加太多两个够用',
    resourceUrl: 'https://github.moeyy.xyz/https://raw.githubusercontent.com/YYDS678/uzVideo/main/video_sources_default.json'
  }
];