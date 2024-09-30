// ignore
import {} from "../core/uzVideo.js";
import {} from "../core/uzHome.js";
import {} from "../core/uz3lib.js";
import {} from "../core/uzUtils.js";
// ignore

// 类名要特殊
class Wogg20240929 extends WebApiBase {
  constructor() {
    super();
    this.webSite = "https://www.wogg.net/";
  }
  /**
   * 异步获取分类列表的方法。
   * @param {UZArgs} args
   * @returns {Promise<RepVideoClassList>}
   */
  async getClassList(args) {
    var backData = new RepVideoClassList();
    return JSON.stringify(backData);
  }

  /**
   * 获取分类视频列表
   * @param {UZArgs} args
   * @returns {Promise<RepVideoList>}
   */
  async getVideoList(args) {
    var backData = new RepVideoList();
    return JSON.stringify(backData);
  }

  /**
   * 获取视频详情
   * @param {UZArgs} args
   * @returns {Promise<RepVideoDetail>}
   */
  async getVideoDetail(args) {
    var backData = new RepVideoDetail();
    try {
      let webUrl = UZUtils.removeTrailingSlash(this.webSite) + args.url;
      let pro = await req(webUrl);

      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        const $ = cheerio.load(proData);
        let vodDetail = new VideoDetail();
        vodDetail.vod_name = $(".page-title")[0].children[0].data;
        vodDetail.vod_pic = $($(".mobile-play")).find(".lazyload")[0].attribs[
          "data-src"
        ];

        let video_items = $(".video-info-itemtitle");

        for (const item of video_items) {
          let key = $(item).text();

          let vItems = $(item).next().find("a");
          let value = vItems
            .map((i, el) => {
              let text = $(el).text().trim(); // 获取并去除空白字符
              return text ? text : null; // 只有非空的文本才返回
            })
            .get() // 将 jQuery 对象转换为普通数组
            .filter(Boolean) // 过滤掉 null 和空字符串
            .join(", "); // 用逗号和空格分割

          if (key.includes("年代")) {
            vodDetail.vod_year = value.trim();
          } else if (key.includes("导演")) {
            vodDetail.vod_director = value.trim();
          } else if (key.includes("主演")) {
            vodDetail.vod_actor = value.trim();
          }
        }

        const panUrls = [];
        let items = $(".module-row-info");
        for (const item of items) {
          let shareUrl = $(item).find("p")[0].children[0].data;
          panUrls.push(shareUrl);
        }
        vodDetail.panUrls = panUrls;
        console.log(panUrls);

        backData.data = vodDetail;
      }
    } catch (error) {
      backData.error = "获取视频详情失败" + error;
    }

    return JSON.stringify(backData);
  }

  /**
   * 获取视频的播放地址
   * @param {UZArgs} args
   * @returns {Promise<RepVideoPlayUrl>}
   */
  async getVideoPlayUrl(args) {
    var backData = new RepVideoPlayUrl();
    return JSON.stringify(backData);
  }

  /**
   * 搜索视频
   * @param {UZArgs} args
   * @returns {Promise<RepVideoList>}
   */
  async searchVideo(args) {
    var backData = new RepVideoList();
    try {
      let searchUrl = this.combineUrl(
        this.webSite +
          "vodsearch/" +
          args.searchWord +
          "----------" +
          args.page +
          "---.html"
      );
      let repData = await req(searchUrl);
      const $ = cheerio.load(repData.data);
      let items = $(".module-search-item");

      for (const item of items) {
        let video = new VideoDetail();
        video.vod_id = $(item).find(".video-serial")[0].attribs.href;
        video.vod_name = $(item).find(".video-serial")[0].attribs.title;
        video.vod_pic = $(item).find(".module-item-pic > img")[0].attribs[
          "data-src"
        ];
        video.vod_remarks = $($(item).find(".video-serial")[0]).text();
        backData.data.push(video);
      }
    } catch (error) {
      backData.error = error;
    }
    return JSON.stringify(backData);
  }

  combineUrl(url) {
    if (url === undefined) {
      return "";
    }
    if (url.indexOf(this.webSite) !== -1) {
      return url;
    }
    if (url.startsWith("/")) {
      return this.webSite + url;
    }
    return this.webSite + "/" + url;
  }
}

// json 中 instance 的值，这个名称一定要特殊
var wogg20240929 = new Wogg20240929();
