/**
 * 视频分类
 */
class VideoClass {
  constructor() {
    // 当前分类的链接
    this.type_id = "";
    // 分类名称
    this.type_name = "";
  }
}

/**
 * 视频详情
 */
class VideoDetail {
  constructor() {
    // 当前视频详情链接
    this.vod_id = "";
    // 视频名称
    this.vod_name = "";
    /**
     * 所有剧集
     * 第一集$第一集的视频详情链接#第二集$第二集的视频详情链接
     */
    this.vod_play_url = "";
    // 封面
    this.vod_pic = "";
    // 视频分类
    this.type_name = "";
    // 更新到
    this.vod_remarks = "";
    // 豆瓣
    this.vod_douban_score = "";
    // 语言
    this.vod_lang = "";
    // 年份
    this.vod_year = "";
    // 演员
    this.vod_actor = "";
    // 导演
    this.vod_director = "";
    // 描述
    this.vod_content = "";
    // 地区
    this.vod_area = "";
  }
}

/**
 * 返回分类列表
 */
class RepVideoClassList {
  constructor() {
    /**
     * @type {VideoClass[]}
     */
    this.data = [];
    this.error = "";
  }
}

/**
 * 视频列表
 */
class VideoList {
  constructor() {
    /**
     * @type {VideoDetail[]}
     */
    this.data = [];
    this.total = 0;
  }
}

/**
 * 返回视频列表
 */
class RepVideoList {
  constructor() {
    /**
     * @type {VideoList}
     */
    this.data = null;
    this.error = "";
  }
}

/**
 * 返回视频详情
 */
class RepVideoDetail {
  constructor() {
    /**
     * @type {VideoDetail}
     */
    this.data = null;
    this.error = "";
  }
}

/**
 * 返回播放地址
 */
class RepVideoPlayUrl {
  constructor() {
    this.data = "";
    this.error = "";
  }
}

/**
 * UZArgs 封装一组参数，用于构建请求URL或进行数据查询。
 */
class UZArgs {
  constructor() {
    // 请求的URL
    this.url = "";
    // 当前页码
    this.page = 1;
    //搜索关键词
    this.searchWord = "";
  }
}
/**
 * 脚本基类
 */
class WebApiBase {
  /**
   * 异步获取分类列表的方法。
   * @param {UZArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoClassList())>}
   */
  async getClassList(args) {
    return JSON.stringify(new RepVideoClassList());
  }

  /**
   * 获取分类视频列表
   * @param {UZArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoList())>}
   */
  async getVideoList(args) {
    return JSON.stringify(new RepVideoList());
  }

  /**
   * 获取视频详情
   * @param {UZArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoDetail())>}
   */
  async getVideoDetail(args) {
    return JSON.stringify(new RepVideoDetail());
  }
  /**
   * 获取视频的播放地址
   * @param {UZArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoPlayUrl())>}
   */
  async getVideoPlayUrl(args) {
    return JSON.stringify(new RepVideoPlayUrl());
  }
  /**
   * 搜索视频
   * @param {UZArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoList())>}
   */
  async searchVideo(args) {
    return JSON.stringify(new RepVideoList());
  }
}

/**
 * req 返回的数据
 */
class ProData {
  constructor() {
    this.error = "";
    this.data;
  }
}

/**
 * 网络请求，也可以使用 fetch
 * @param {UZArgs} args
 * @returns {Promise<ProData>}
 */
async function req(url, options) {
  let pro = await sendMessage(
    "req",
    JSON.stringify({ url: url, options: options })
  );
  return pro;
}

class UZUtils {
  /**
   * 从链接中获取域名
   * @param {string} url
   * @returns
   */
  static getHostFromURL(url) {
    const protocolEndIndex = url.indexOf("://");
    if (protocolEndIndex === -1) {
      return null;
    }
    const hostStartIndex = protocolEndIndex + 3;
    const hostEndIndex = url.indexOf("/", hostStartIndex);
    const host =
      hostEndIndex === -1
        ? url.slice(hostStartIndex)
        : url.slice(hostStartIndex, hostEndIndex);

    return `${url.slice(0, protocolEndIndex + 3)}${host}`;
  }

  /**
   * 去除尾部的斜杠
   * @param {string} str
   * @returns
   */
  static removeTrailingSlash(str) {
    if (str.endsWith("/")) {
      return str.slice(0, -1);
    }
    return str;
  }

  /**
   * 用于在 uz 脚本调试模式中展示 log 信息
   */
  static debugLog() {
    sendMessage("debugLog", JSON.stringify([...arguments]));
  }
}
