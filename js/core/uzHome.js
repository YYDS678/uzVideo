/**
 * @file 首页推荐扩展
 */

//MARK: - 列表展示 UI类型 如需添加更多 UI 类型请联系 https://t.me/uzVideoAppbot
const UIType = {
  /**
   * 轮播海报
   */
  banner: "banner",

  /**
   * 横滑小海报
   */
  smallCard: "smallCard",

  /**
   * 横滑大海报
   */
  largeCard: "largeCard",
};

//MARK: - 单个广告位展示数据
/**
 * UI 展示数据
 */
class RepAd {
  constructor() {
    /**
     * UI 类型
     * @type {UIType}
     */
    this.uiType = UIType.smallCard;

    /**
     * 海报宽高比
     */
    this.ratio = 10.0 / 16.0;

    /**
     * 标题 为空不展示标题
     * @type {string}
     */
    this.title = "";

    /**
     * 展示数据
     * @type {VideoDetail} 必要字段 vod_name、vod_pic,
     *  次要 vod_remarks(海报上的小标签)，
     *  后续用于提高匹配度的字段 vod_year vod_director type_name
     */
    this.data = [];
  }
}

//MARK: - tab 列表数据
/**
 * tab列表数据，data 与 filter 二选一
 *  当有 filter 时展示为筛选列表样式
 *  当有 data 时展示为普通列表样式
 */
class RepTabList {
  constructor() {
    /**
     * tab 列表数据
     * @type {Array <RepAd>}
     */
    this.data = [];

    /**
     * 筛选列表
     * @type {FilterTitle[]}
     */
    this.filter = [];

    this.error = "";
  }
}

class HomeTabModel {
  constructor() {
    /**
     * 当前分类的链接
     **/
    this.id = "";

    /**
     * 分类名称
     */
    this.name = "";

    /**
     * 是否是筛选列表
     */
    this.isFilter = false;

    /**
     * 扩展运行标识 ** uzApp 运行时自动赋值，请勿修改 **
     */
    this.uzTag = "";
  }
}

//MARK: - 首页数据
/**
 * 首页数据
 */
class RepHome {
  constructor() {
    /**
     * 各 tab 页面名称，用于 getTab() 入参
     * @type {Array <HomeTabModel>}
     */
    this.data = [];
    this.error = "";
  }
}

//MARK:- 首页扩展类
/**
 * 首页扩展，固定实例名称为 uzHomeJs,（例如 const uzHomeJs = new UZHomeJS();）
 */
class UZHome {
  /**
   * 获取首页
   * @returns {Promise<RepHome>}
   */
  async getHome() {
    let repData = new RepHome();
    return JSON.stringify(repData);
  }

  /**
   * 获取 tab
   * @param {UZArgs} args 主要参数 args.url  args.page
   * @returns {Promise<RepTabList>}
   */
  async getTab(args) {
    let repData = new RepTabList();
    return JSON.stringify(repData);
  }

  /**
   * 获取筛选列表数据
   * 当 getTab() 返回 RepTabList.filter 时调用
   * @param {UZSubclassVideoListArgs} args 主要参数 args.mainClassId（即 VideoClass.id） 、 args.filter( 按 getTab() 返回的 filter 顺序传入)
   * @returns {Promise<RepVideoList>}返回筛选列表
   */
  async getFilterList(args) {
    let repData = new RepVideoList();
    return JSON.stringify(repData);
  }
}
