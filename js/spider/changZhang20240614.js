// ignore
import { WebApiBase, VideoClass } from "../core/uzCode.js";
import { parse } from "node-html-parser";
// ignore

// 类名要特殊
class ChangZhang20240614 extends WebApiBase {
  webSite = "https://www.czzy77.com";
  /**
   * 异步获取分类列表的方法。
   * @param {UZArgs} args
   * @returns {Promise<RepVideoClassList>}
   */
  async getClassList(args) {
    let webUrl = args.url;
    // 如果通过首页获取分类的话，可以将对象内部的首页更新
    this.webSite = UZUtils.removeTrailingSlash(webUrl);
    var backData = new RepVideoClassList();
    try {
      const pro = await req(webUrl);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var allClass = document.querySelectorAll("ul.submenu_mi > li > a");
        var list = [];
        for (let index = 0; index < allClass.length; index++) {
          const element = allClass[index];
          var isIgnore = this.isIgnoreClassName(element.text);
          if (isIgnore) {
            continue;
          }
          var type_name = element.text;
          var url = element.attributes["href"];
          url = this.combineUrl(url);

          if (url.length > 0 && type_name.length > 0) {
            var videoClass = new VideoClass();
            videoClass.type_id = url;
            videoClass.type_name = type_name;
            list.push(videoClass);
          }
        }
        backData.data = list;
      }
    } catch (error) {
      backData.error = "获取分类失败～";
    }
    return JSON.stringify(backData);
  }

  /**
   * 获取分类视频列表
   * @param {UZArgs} args
   * @returns {Promise<RepVideoList>}
   */
  async getVideoList(args) {
    var listUrl = UZUtils.removeTrailingSlash(args.url) + "/page/" + args.page;
    var backData = new RepVideoClassList();
    try {
      let pro = await req(listUrl, null);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var allVideo = document
          .querySelector(".bt_img.mi_ne_kd.mrb")
          .querySelectorAll("ul > li");
        var videos = [];
        for (let index = 0; index < allVideo.length; index++) {
          const element = allVideo[index];
          var vodUrl = element.querySelector("a")?.attributes["href"] ?? "";
          var vodPic =
            element.querySelector("a > img")?.attributes["data-original"] ?? "";
          var vodName =
            element.querySelector("a > img")?.attributes["alt"] ?? "";
          var vodDiJiJi = element.querySelector("div.jidi > span")?.text;
          var vodHD =
            element.querySelector("div.hdinfo > span.qb")?.text ??
            element.querySelector("div.hdinfo > span.furk")?.text;

          var vodDouBan = element.querySelector("div.rating")?.text ?? "";
          vodUrl = this.combineUrl(vodUrl);

          let videoDet = new VideoDetail();
          videoDet.vod_id = vodUrl;
          videoDet.vod_pic = vodPic;
          videoDet.vod_name = vodName;
          videoDet.vod_remarks = vodDiJiJi ?? vodHD;
          videoDet.vod_douban_score = vodDouBan;
          videos.push(videoDet);
        }
        backData.data = videos;
      }
    } catch (error) {
      backData.error = "获取列表失败～";
    }
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
      var webUrl = args.url;
      let pro = await req(webUrl, null);
      backData.error = pro.error;
      let proData = pro.data;
      if (proData) {
        var document = parse(proData);
        var vod_pic =
          document.querySelector(".dyimg.fl > img")?.attributes["src"] ?? "";
        var vod_name =
          document.querySelector("div.moviedteail_tt > h1")?.text ?? "";
        var detList =
          document.querySelector(".moviedteail_list")?.querySelectorAll("li") ??
          [];
        var vod_year = "";
        var vod_director = "";
        var vod_actor = "";
        var vod_area = "";
        var vod_lang = "";
        var vod_douban_score = "";
        var type_name = "";

        for (let index = 0; index < detList.length; index++) {
          const element = detList[index];
          if (element.text.includes("年份")) {
            vod_year = element.text.replace("年份：", "");
          } else if (element.text.includes("导演")) {
            vod_director = element.text.replace("导演：", "");
          } else if (element.text.includes("主演")) {
            vod_actor = element.text.replace("主演：", "");
          } else if (element.text.includes("地区")) {
            vod_area = element.text.replace("地区：", "");
          } else if (element.text.includes("语言")) {
            vod_lang = element.text.replace("语言：", "");
          } else if (element.text.includes("类型")) {
            type_name = element.text.replace("类型：", "");
          } else if (element.text.includes("豆瓣")) {
            vod_douban_score = element.text.replace("豆瓣：", "");
          }
        }

        var vod_content = "";
        var vodBlurbDocument = document.querySelector(".yp_context");

        if (vodBlurbDocument) {
          vod_content = vodBlurbDocument.text;

          var allP = vodBlurbDocument.querySelectorAll("p");

          for (let index = 0; index < allP.length; index++) {
            const element = allP[index];
            vod_content = vod_content + element.text;
          }
        }

        var juJiDocment =
          document.querySelector(".paly_list_btn")?.querySelectorAll("a") ?? [];

        var vod_play_url = "";
        for (let index = 0; index < juJiDocment.length; index++) {
          const element = juJiDocment[index];

          vod_play_url += element.text;
          vod_play_url += "$";
          vod_play_url += element.attributes["href"];
          vod_play_url += "#";
        }

        let detModel = new VideoDetail();
        detModel.vod_year = vod_year;
        detModel.type_name = type_name;
        detModel.vod_director = vod_director;
        detModel.vod_actor = vod_actor;
        detModel.vod_area = vod_area;
        detModel.vod_lang = vod_lang;
        detModel.vod_douban_score = vod_douban_score;
        detModel.vod_content = vod_content;
        detModel.vod_pic = vod_pic;
        detModel.vod_name = vod_name;
        detModel.vod_play_url = vod_play_url;
        detModel.vod_id = webUrl;
        backData.data = detModel;
      }
    } catch (error) {
      backData.error = "获取视频详情失败";
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
    try {
      const pro = await req(args.url);
      backData.error = pro.error;
      let proData = pro.data;

      if (proData) {
        var document = parse(proData);

        let jsUrl = document.querySelector("iframe")?.attributes["src"] ?? "";
        if (jsUrl.length > 0) {
          let pro2 = await req(jsUrl, {
            headers: {
              Referer: this.webSite,
              "Sec-Fetch-Dest": "iframe",
              "Sec-Fetch-Mode": "navigate",
            },
          });
          pro2.error += pro.error;
          if (pro2.data) {
            let root = parse(pro2.data);
            let scripts = root.querySelectorAll("script");
            var code1 = "";
            if (scripts.length - 2 > 0) {
              code1 = scripts[scripts.length - 2].text;
              // console.log(code1);
              if (code1.indexOf("var player") > -1) {
                let player = code1.match(/var player = "(.*?)"/);
                let rand = code1.match(/var rand = "(.*?)"/);
                // console.log(player[1]);
                // console.log(rand[1]);
                let content = JSON.parse(
                  this.cryptJs(player[1], "VFBTzdujpR9FWBhe", rand[1])
                );
                backData.data = content["url"];
              } else {
                // let path = scripts[scripts.length - 1].attributes["src"];
                // let host = UZUtils.getHostFromURL(jsUrl);
                // let pro = await req(host + path, {
                //   headers: {
                //     Referer: this.webSite,
                //     "Sec-Fetch-Dest": "iframe",
                //     "Sec-Fetch-Mode": "navigate",
                //   },
                // });

                // 浏览器里这样执行可以。。。
                // let c =
                //   'document[_0x2911("43", "EL@a")](_0x82e421)[_0x2911("44", "vU#R")] =';
                // var videoHtml = "";
                // let code2 = pro.data.replace(c, "videoHtml =");

                // console.log(code2);
                // var res = eval('var videoHtml = "";' + code1 + code2);
                // console.log(res);
                backData.data = "";
                backData.error = "这个加密不知道怎么解～";
              }
            }
          }
        }

        let x =
          document.querySelectorAll("script:contains(window.wp_nonce)") ?? [];
        if (x.length > 0) {
          let code = x[0].text;
          let group = code.match(/(var.*)eval\((\w*\(\w*\))\)/);
          const md5 = Crypto;
          const result = eval(group[1] + group[2]);
          let url = result.match(/url:.*?['"](.*?)['"]/)[1];
          backData.data = url;
        }
      }
    } catch (error) {
      backData.error = "获取视频播放地址失败";
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
    // let url =
    //   this.removeTrailingSlash(this.webSite) +
    //   "/daoyongjiekoshibushiyoubing?q=" +
    //   args.searchWord +
    //   "&f=_all&p=" +
    //   args.page;
    // let pro = await req(url, {
    //   headers: {
    //     "Cookie":
    //       "cf_clearance=FNTfIrcfhaIjgq31GXM.lheyLTqcDDdOmUG6ci8xZo0-1718372164-1.0.1.1-3Sd9Aat3W4QbdrO8l4t6UF2dCLFjuHFeRVeH6VIXDAsYpitprJkKkESjPbPpendwyIuQMfYHzTqj_EXPeDselw; Hm_lvt_07305e6f6305a01dd93218c7fe6bc9c3=1717259553; Hm_lvt_06341c948291d8e90aac72f9d64905b3=1717259553; Hm_lvt_0653ba1ead8a9aabff96252e70492497=1717259553; myannoun=1",
    //     "User-Agent":
    //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    //   },
    // });
    // backData.error = pro.error;
    // let proData = pro.data;
    // if (proData) {
    //   var document = parse(proData);

    //   let allVideo =
    //     document
    //       .querySelector(".bt_img.mi_ne_kd.search_list")
    //       ?.querySelectorAll("ul > li") ?? [];
    // }
    return JSON.stringify(backData);
  }

  ignoreClassName = ["关于", "公告", "官方", "备用", "群", "地址"];

  cryptJs(text, key, iv, type) {
    let key_value = Crypto.enc.Utf8.parse(key || "PBfAUnTdMjNDe6pL");
    let iv_value = Crypto.enc.Utf8.parse(iv || "sENS6bVbwSfvnXrj");
    let content;
    if (type) {
      content = Crypto.AES.encrypt(text, key_value, {
        iv: iv_value,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7,
      });
    } else {
      content = Crypto.AES.decrypt(text, key_value, {
        iv: iv_value,
        padding: Crypto.pad.Pkcs7,
      }).toString(Crypto.enc.Utf8);
    }
    return content;
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

  isIgnoreClassName(className) {
    for (let index = 0; index < this.ignoreClassName.length; index++) {
      const element = this.ignoreClassName[index];
      if (className.indexOf(element) !== -1) {
        return true;
      }
    }
    return false;
  }
}
// json 中 instance 的值，这个名称一定要特殊
var changZhang20240614 = new ChangZhang20240614();
