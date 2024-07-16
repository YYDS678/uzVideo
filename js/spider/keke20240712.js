// ignore
import { WebApiBase, VideoClass } from "../core/uzCode.js";
import { parse } from "node-html-parser";
// ignore

// 类名要特殊
class Keke20240712 extends WebApiBase {
  webSite = "https://www.keke12.com:51111";
  /**
   * 异步获取分类列表的方法。
   * @param {UZArgs} args
   * @returns {Promise<RepVideoClassList>}
   */
  async getClassList(args) {
    let webUrl = args.url;
    var backData = new RepVideoClassList();
    backData.data = [];
    try {
      const pro = await req(webUrl);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var ulList = document.querySelectorAll("div.main > ul") ?? [];

        if (ulList.length >= 1) {
          var li = ulList[1].querySelectorAll("li") ?? [];
          for (let i = 0; i < li.length; i++) {
            const element = li[i];
            const title = element.querySelector(".menu-item-label").text;
            const path = element.querySelector("a").attributes["href"];
            const id = UZUtils.getStrByRegexDefault(/\/(\d+)\.html/, path);
            var videoClass = new VideoClass();
            videoClass.hasSubclass = true;
            videoClass.type_id = id;
            videoClass.type_name = title;
            backData.data.push(videoClass);
          }
        }
      }
    } catch (error) {
      backData.error = "获取分类失败～";
    }
    return JSON.stringify(backData);
  }

  async getSubclassList(args) {
    var backData = new RepVideoSubclassList();
    backData.data = new VideoSubclass();
    const id = args.url;
    try {
      var url =
        UZUtils.removeTrailingSlash(this.webSite) +
        "/show/" +
        id +
        "------1.html";
      const pro = await req(url);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var filterTitleList = document.querySelectorAll("div.filter-row") ?? [];
        for (let i = 0; i < filterTitleList.length; i++) {
          const element = filterTitleList[i];
          const title = element.querySelector(".filter-row-side > strong").text;
          const items = element.querySelectorAll(".filter-item") ?? [];
          // 2-惊悚-中国香港-英语-2022-1-1
          // 分类-类型-地区-语言-年代-排序-页码
          var filterTitle = new FilterTitle();
          filterTitle.name = title.replace(":", "");
          filterTitle.list = [];
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            const name = item.text;
            const path = item.attributes["href"] ?? "";
            const regex = /\/show\/(.*?)\.html/;
            const match = path.match(regex);
            const parsStr = match ? match[1] : null;
            if (parsStr) {
              const parList = parsStr.split("-");
              const id = parList[i + 1];
              var filterLab = new FilterLabel();
              filterLab.name = name;
              filterLab.id = id;
              filterTitle.list.push(filterLab);
            }
          }

          backData.data.filter.push(filterTitle);
        }
        if (id === 6 || id === "6") {
          // 短剧
          if (backData.data.filter.length > 0) {
            const list = backData.data.filter[0].list;
            var classList = [];
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              var subclass = new VideoClass();
              subclass.type_id = element.id;
              subclass.type_name = element.name;
              classList.push(subclass);
            }
            backData.data.filter = [];
            backData.data.class = classList;
          }
        }
      }
    } catch (error) {
      backData.error = "获取分类失败～ " + error;
    }
    return JSON.stringify(backData);
  }
  /**
   * 获取二级分类视频列表 或 筛选视频列表
   * @param {UZSubclassVideoListArgs} args
   * @returns {@Promise<JSON.stringify(new RepVideoList())>}
   */
  async getSubclassVideoList(args) {
    var backData = new RepVideoList();
    backData.data = [];
    try {
      var pList = [args.mainClassId];
      if (args.filter.length > 0) {
        // 筛选
        for (let index = 0; index < args.filter.length; index++) {
          const element = args.filter[index];
          pList.push(element.id);
        }
      } else {
        pList.push(args.subclassId);
        for (let index = 0; index < 4; index++) {
          pList.push("");
        }
      }
      pList.push(args.page);
      var path = pList.join("-");
      const url =
        UZUtils.removeTrailingSlash(this.webSite) + "/show/" + path + ".html";

      const pro = await req(url);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var allVideo = document.querySelectorAll("div.module-item") ?? [];
        var videos = [];
        for (let index = 0; index < allVideo.length; index++) {
          const element = allVideo[index];
          var vodUrl = element.querySelector("a")?.attributes["href"] ?? "";
          var avaImg =
            document.querySelector("img.user-avatar-img")?.attributes["src"] ??
            "";
          var path =
            element.querySelector("img")?.attributes["data-original"] ?? "";
          var vodPic = UZUtils.getHostFromURL(avaImg) + path;
          var vodName = element.querySelector("img")?.attributes["title"] ?? "";
          var vod_remarks =
            element.querySelector("div.v-item-bottom > span")?.text ??
            element.querySelector("div.v-item-top-left > span")?.text;
          if (vodUrl && vodPic && vodName) {
            var video = new VideoDetail();
            video.vod_id = vodUrl;
            video.vod_pic = vodPic;
            video.vod_name = vodName;
            video.vod_remarks = vod_remarks;
            videos.push(video);
          }
        }
        backData.data = videos;
      }
    } catch (error) {
      backData.error = "获取视频列表失败～ " + error;
    }

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
      var webUrl = UZUtils.removeTrailingSlash(this.webSite) + args.url;
      let pro = await req(webUrl, null);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);

        var detList = document.querySelectorAll("div.detail-info-row") ?? [];
        var vod_year = "";
        var vod_director = "";
        var vod_actor = "";

        for (let index = 0; index < detList.length; index++) {
          const element = detList[index];
          var title =
            element.querySelector("div.detail-info-row-side")?.text ?? "";
          var contentE = element.querySelector("div.detail-info-row-main");
          if (title.includes("首映")) {
            vod_year = contentE.text ?? "";
          } else if (title.includes("导演")) {
            vod_director = contentE?.querySelector("a")?.text ?? "";
          } else if (title.includes("演员")) {
            contentE.querySelectorAll("a").forEach((element) => {
              vod_actor += element.text + "、";
            });
          }
        }
        var vod_content =
          document.querySelector("div.detail-desc > p").text?.trim() ?? "";

        var fromListE =
          document.querySelectorAll("span.source-item-label") ?? [];
        var fromListStr = [];
        for (let index = 0; index < fromListE.length; index++) {
          fromListStr.push(fromListE[index].text);
        }
        var vod_play_from = fromListStr.join("$$$");

        var playListE = document.querySelectorAll("div.episode-list") ?? [];
        var vod_play_url = "";
        for (let index = 0; index < playListE.length; index++) {
          const epList = playListE[index].querySelectorAll("a") ?? [];

          for (let index = 0; index < epList.length; index++) {
            const element = epList[index];
            vod_play_url += element.text;
            vod_play_url += "$";
            vod_play_url += element.attributes["href"];
            vod_play_url += "#";
          }
          vod_play_url += "$$$";
        }

        let detModel = new VideoDetail();
        detModel.vod_year = vod_year;
        detModel.vod_director = vod_director;
        detModel.vod_actor = vod_actor;
        detModel.vod_content = vod_content;
        detModel.vod_play_url = vod_play_url;
        detModel.vod_play_from = vod_play_from;
        detModel.vod_id = args.url;
        backData.data = detModel;
      }
    } catch (error) {
      backData.error = "获取视频详情失败 ~ " + error;
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
    backData.error = "获取播放链接失败～";
    try {
      const pro = await req(
        UZUtils.removeTrailingSlash(this.webSite) + args.url
      );
      backData.error = pro.error;
      let proData = pro.data;
      const regex = /playSource\s*=\s*{[^}]*src:\s*"([^"]*)"/;
      const match = proData.match(regex);
      const result = match ? match[1] : "";
      backData.data = result;
    } catch (error) {
      backData.error = "获取视频播放地址失败～ " + error;
    }
    return JSON.stringify(backData);
  }

  /**
   * 搜索视频
   * @param {UZArgs} args
   * @returns {Promise<RepVideoList>}
   */
  async searchVideo(args) {
    var backData = new RepVideoList();
    backData.data = [];
    try {
      const rep = await req(
        UZUtils.removeTrailingSlash(this.webSite) +
          "/search?k=" +
          args.searchWord +
          "&page=" +
          args.page
      );
      backData.error = rep.error;
      let repData = rep.data;
      var document = parse(repData);
      var count = document.querySelectorAll("span.highlight-text") ?? [];
      if (count.length > 1) {
        backData.total = count[1].text.trim();
      }
      const allVideoE = document.querySelectorAll("a.search-result-item") ?? [];

      for (let index = 0; index < allVideoE.length; index++) {
        const element = allVideoE[index];
        var video = new VideoDetail();
        video.vod_id = element.attributes["href"];

        var avaImg =
          document.querySelector("img.user-avatar-img")?.attributes["src"] ??
          "";
        var path =
          element.querySelector("img")?.attributes["data-original"] ?? "";
        var vodPic = UZUtils.getHostFromURL(avaImg) + path;
        video.vod_pic = vodPic;

        video.vod_name = element.querySelector("div.title")?.text ?? "";
        video.vod_remarks =
          element.querySelector("div.search-result-item-header > div")?.text ??
          "";

        backData.data.push(video);
      }
    } catch (error) {
      backData.error = "搜索视频失败 ~ " + error;
    }
    return JSON.stringify(backData);
  }
}
// json 中 instance 的值，这个名称一定要特殊
var keke20240712 = new Keke20240712();
