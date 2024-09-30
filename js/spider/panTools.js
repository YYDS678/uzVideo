// ignore
import {} from "../core/uzVideo.js";
import {} from "../core/uzHome.js";
import {} from "../core/uz3lib.js";
import {} from "../core/uzUtils.js";
// ignore

/**
 * 网盘类型
 * 环境变量 key 为 PanType.xx + "Cookie",请在 json 文件中添加
 */
const PanType = {
  /**
   * 夸克
   **/
  Quark: "夸克",

  /**
   * UC
   **/
  UC: "UC",
};

/**
 * 播放信息
 **/
class PanPlayInfo {
  constructor(url = "", error = "", playHeaders = {}) {
    this.url = url;
    this.error = error;
    this.playHeaders = playHeaders;
  }
}

/**
 * 网盘视频项
 */
class PanVideoItem {
  constructor() {
    /**
     * 展示名称 例如 老友记
     */
    this.name = "";

    /**
     * 分组名称 例如 原画 、 普画  非必须
     */
    this.fromName = "";

    /**
     * 网盘类型 用于获取播放信息时
     * @type {PanType}
     **/
    this.panType = PanType.UC;

    /**
     * 关键数据 用于获取播放信息时
     * @type {Object}
     */
    this.data;
  }
}

/**
 * 网盘播放列表
 */
class PanListDetail {
  constructor() {
    /**
     * @type {PanVideoItem[]}
     * 视频列表
     */
    this.videos = [];
    this.error = "";
  }
}

//MARK: - 夸克 UC 相关实现
// 抄自 https://github.com/jadehh/TVSpider
// prettier-ignore
class QuarkUCVideoItem { constructor() { this.fileId = ""; this.shareId = ""; this.shareToken = ""; this.shareFileToken = ""; this.seriesId = ""; this.name = ""; this.type = ""; this.formatType = ""; this.size = ""; this.parent = ""; this.shareData = null; this.lastUpdateAt = 0; this.subtitle = null; } static objectFrom(itemJson, shareId) { const item = new QuarkUCVideoItem(); item.fileId = itemJson.fid || ""; item.shareId = shareId; item.shareToken = itemJson.stoken || ""; item.shareFileToken = itemJson.share_fid_token || ""; item.seriesId = itemJson.series_id || ""; item.name = itemJson.file_name || ""; item.type = itemJson.obj_category || ""; item.formatType = itemJson.format_type || ""; item.size = (itemJson.size || "").toString(); item.parent = itemJson.pdir_fid || ""; item.lastUpdateAt = itemJson.last_update_at || 0; return item; } }
// prettier-ignore
class QuarkClient { static apiUrl = "https://drive-pc.quark.cn/1/clouddrive/"; static pr = "pr=ucpro&fr=pc"; static httpHeaders = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch", Referer: "https://pan.quark.cn/", "Content-Type": "application/json", }; }
// prettier-ignore
class UCClient { static apiUrl = "https://pc-api.uc.cn/1/clouddrive/"; static pr = "pr=UCBrowser&fr=pc"; static httpHeaders = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) uc-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch", referer: "https://drive.uc.cn", "Content-Type": "application/json", }; }
// prettier-ignore
class QuarkUC { constructor(isQuark = false) { this.isQuark = isQuark; this.cookie = ""; this.shareTokenCache = {}; this.saveFileIdCaches = {}; this.saveDirId = null; this.saveDirName = "uz影视"; this.isVip = false; this.updateCookie = () => {}; } get panName() { if (this.isQuark) { return PanType.Quark; } else { return PanType.UC; } } get apiUrl() { if (this.isQuark) { return QuarkClient.apiUrl; } else { return UCClient.apiUrl; } } get pr() { if (this.isQuark) { return QuarkClient.pr; } else { return UCClient.pr; } } get headers() { const headers = this.isQuark ? QuarkClient.httpHeaders : UCClient.httpHeaders; headers["Cookie"] = this.cookie; return headers; } /** * 获取文件列表 * @param {string} shareUrl * @returns {@Promise<PanListDetail>} **/ async getFilesByShareUrl( shareUrl ) { const data = new PanListDetail(); await this.getVip(); const shareData = this.getShareData(shareUrl); if (shareData == null) { data.error = "分享链接无效"; return data; } await this.getShareToken(shareData); const videos = []; const subtitles = []; if (!this.shareTokenCache.hasOwnProperty(shareData.shareId)) { data.error = "资源获取失败"; return data; } await this.listFile( shareData, videos, subtitles, shareData.shareId, shareData.folderId ); if (subtitles.length > 0) { for (const item of videos) { const matchSubtitle = this.findBestLCS(item, subtitles); if (matchSubtitle.bestMatch != null) { item.subtitle = matchSubtitle.bestMatch.target; } } } const playForm = this.getPlayForm(); for (let index = 0; index < playForm.length; index++) { const flag = playForm[index]; for (let index = 0; index < videos.length; index++) { const element = videos[index]; element.flag = flag; const videoItem = new PanVideoItem(); videoItem.data = element; videoItem.panType = this.panName; videoItem.name = element.name; videoItem.fromName = flag; data.videos.push(videoItem); } } return data; } /** * 获取播放信息 * @param {{flag:string,shareId:string,shareToken:string,fileId:string,shareFileToken:string }} data * @returns {@Promise<PanPlayInfo>} */ async getPlayUrl( data ) { if (this.cookie.length === 0) { return new PanPlayInfo( "", "请在 设置 -> 数据管理 -> 环境变量 中为" + this.panName + "Cookie" + " 添加值" ); } await this.getVip(); let playData; try { const { flag, shareId, shareToken, fileId, shareFileToken } = data; if (flag.includes("原画")) { playData = await this.getDownload( shareId, shareToken, fileId, shareFileToken, true ); } else { playData = await this.getLiveTranscoding( shareId, shareToken, fileId, shareFileToken, flag ); } } catch (error) { playData = new PanPlayInfo("", error.toString()); } playData.playHeaders = { cookie: this.cookie }; return playData; } async api(url, data = null, retry = 3, method = "post") { let leftRetry = retry; while (leftRetry > 0) { try { const response = await req(this.apiUrl + url, { method: method, headers: this.headers, data: JSON.stringify(data), }); if (response.code === 401) { this.cookie = ""; return {}; } const resp = response.data; if (response.headers["set-cookie"]) { const puus = [response.headers["set-cookie"]] .join(";;;") .match(/__puus=([^;]+)/); if (puus) { if (this.cookie.match(/__puus=([^;]+)/)[1] != puus[1]) { this.cookie = this.cookie.replace( /__puus=[^;]+/, `__puus=${puus[1]}` ); this.updateCookie(); } } } return resp; } catch (e) {} leftRetry--; await new Promise((resolve) => setTimeout(resolve, 1000)); } return resp; } /** * 根据链接获取分享ID和文件夹ID * @param {string} url * @returns {null|{shareId: string, folderId: string}} */ getShareData( url ) { let regex = /https:\/\/pan\.quark\.cn\/s\/([^\\|#/]+)/; if (!this.isQuark) { regex = /https:\/\/drive\.uc\.cn\/s\/([^\\|#/]+)/; } const matches = regex.exec(url); if (matches != null) { return { shareId: matches[1], folderId: "0" }; } return null; } /** * 获取分享token * @param {{shareId: string, sharePwd: string}} shareData */ async getShareToken( shareData ) { if (!this.shareTokenCache.hasOwnProperty(shareData.shareId)) { delete this.shareTokenCache[shareData.shareId]; const shareToken = await this.api(`share/sharepage/token?${this.pr}`, { pwd_id: shareData.shareId, passcode: shareData.sharePwd || "", }); if (shareToken.data != null && shareToken.data.stoken != null) { this.shareTokenCache[shareData.shareId] = shareToken.data; } } } async getVip() { if (this.cookie == "") { this.isVip = false; return; } const listData = await this.api( `member?${this.pr}&uc_param_str=&fetch_subscribe=true&_ch=home&fetch_identity=true`, null, 3, "get" ); this.isVip = listData.data?.member_type === "EXP_SVIP"; } getPlayFormatList() { return this.isVip ? ["4K", "超清", "高清", "普画"] : ["普画"]; } getPlayFormtQuarkList() { return this.isVip ? ["4k", "2k", "super", "high", "normal", "low"] : ["low"]; } async listFile(shareData, videos, subtitles, shareId, folderId, page = 1) { const prePage = 200; const listData = await this.api( `share/sharepage/detail?${ this.pr }&pwd_id=${shareId}&stoken=${encodeURIComponent( this.shareTokenCache[shareId].stoken )}&pdir_fid=${folderId}&force=0&_page=${page}&_size=${prePage}&_sort=file_type:asc,file_name:asc`, null, 3, "get" ); if (listData.data == null) return []; const items = listData.data.list || []; if (items.length === 0) return []; const subDir = []; for (const item of items) { if (item.dir === true) { subDir.push(item); } else if (item.file === true && item.obj_category === "video") { if (parseInt(item.size.toString()) < 1024 * 1024 * 5) continue; item.stoken = this.shareTokenCache[shareData.shareId].stoken; videos.push(QuarkUCVideoItem.objectFrom(item, shareData.shareId)); } else if ( item.type === "file" && this.subtitleExts.some((x) => item.file_name.endsWith(x)) ) { subtitles.push(QuarkUCVideoItem.objectFrom(item, shareData.shareId)); } } if (page < Math.ceil(listData.metadata._total / prePage)) { const nextItems = await this.listFile( shareData, videos, subtitles, shareId, folderId, page + 1 ); items.push(...nextItems); } for (const dir of subDir) { const subItems = await this.listFile( shareData, videos, subtitles, shareId, dir.fid ); items.push(...subItems); } return items; } findBestLCS(mainItem, targetItems) { const results = []; let bestMatchIndex = 0; for (let i = 0; i < targetItems.length; i++) { const currentLCS = UZUtils.lcs(mainItem.name, targetItems[i].name); results.push({ target: targetItems[i], lcs: currentLCS }); if (currentLCS.length > results[bestMatchIndex].lcs.length) { bestMatchIndex = i; } } const bestMatch = results[bestMatchIndex]; return { allLCS: results, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex, }; } clean() { this.saveFileIdCaches = {}; } async clearSaveDir() { const listData = await this.api( `file/sort?${this.pr}&pdir_fid=${this.saveDirId}&_page=1&_size=200&_sort=file_type:asc,updated_at:desc`, null, 3, "get" ); if ( listData.data != null && listData.data.list != null && listData.data.list.length > 0 ) { await this.api(`file/delete?${this.pr}`, { action_type: 2, filelist: listData.data.list.map((v) => v.fid), exclude_fids: [], }); } } async createSaveDir(clean = false) { await this.clearSaveDir(); const listData = await this.api( `file/sort?${this.pr}&pdir_fid=0&_page=1&_size=200&_sort=file_type:asc,updated_at:desc`, null, 3, "get" ); if (listData.data != null && listData.data.list != null) { for (const item of listData.data.list) { if (item.file_name === this.saveDirName) { this.saveDirId = item.fid; await this.clearSaveDir(); break; } } } if (this.saveDirId == null) { const create = await this.api(`file?${this.pr}`, { pdir_fid: "0", file_name: this.saveDirName, dir_path: "", dir_init_lock: false, }); if (create.data != null && create.data.fid != null) { this.saveDirId = create.data.fid; } } } async save(shareId, stoken, fileId, fileToken, clean = false) { await this.createSaveDir(clean); if (clean) { this.clean(); } if (this.saveDirId == null) return null; if (stoken == null) { await this.getShareToken({ shareId }); if (!this.shareTokenCache.hasOwnProperty(shareId)) return null; } const saveResult = await this.api(`share/sharepage/save?${this.pr}`, { fid_list: [fileId], fid_token_list: [fileToken], to_pdir_fid: this.saveDirId, pwd_id: shareId, stoken: stoken || this.shareTokenCache[shareId].stoken, pdir_fid: "0", scene: "link", }); if (saveResult.data != null && saveResult.data.task_id != null) { let retry = 0; while (true) { const taskResult = await this.api( `task?${this.pr}&task_id=${saveResult.data.task_id}&retry_index=${retry}`, null, 3, "get" ); if ( taskResult.data != null && taskResult.data.save_as != null && taskResult.data.save_as.save_as_top_fids != null && taskResult.data.save_as.save_as_top_fids.length > 0 ) { return taskResult.data.save_as.save_as_top_fids[0]; } retry++; if (retry > 2) break; await new Promise((resolve) => setTimeout(resolve, 1000)); } } return null; } async getLiveTranscoding(shareId, stoken, fileId, fileToken, flag) { if (!this.saveFileIdCaches.hasOwnProperty(fileId)) { const saveFileId = await this.save( shareId, stoken, fileId, fileToken, true ); if (saveFileId == null) return new PanPlayInfo("", "Live 转存失败～"); this.saveFileIdCaches[fileId] = saveFileId; } const transcoding = await this.api(`file/v2/play?${this.pr}`, { fid: this.saveFileIdCaches[fileId], resolutions: "normal,low,high,super,2k,4k", supports: "fmp4", }); if (transcoding.data != null && transcoding.data.video_list != null) { const flagId = flag; const index = UZUtils.findIndex(this.getPlayFormatList(), flagId); const quarkFormat = this.getPlayFormtQuarkList()[index]; for (const video of transcoding.data.video_list) { if (video.resolution === quarkFormat) { return new PanPlayInfo(video.video_info.url, "", { Cookie: this.cookie, }); } } if (transcoding.data.video_list[index].video_info.url != null) { return new PanPlayInfo( transcoding.data.video_list[index].video_info.url, "", { Cookie: this.cookie } ); } } return new PanPlayInfo("", "获取播放链接失败~1"); } async getDownload(shareId, shareToken, fileId, fileToken, clean = false) { try { if (!this.saveFileIdCaches.hasOwnProperty(fileId)) { const saveFileId = await this.save( shareId, shareToken, fileId, fileToken, clean ); if (saveFileId == null) { return new PanPlayInfo("", "Download 转存失败～"); } this.saveFileIdCaches[fileId] = saveFileId; } const down = await this.api(`file/download?${this.pr}&uc_param_str=`, { fids: [this.saveFileIdCaches[fileId]], }); if ( down.data != null && down.data.length > 0 && down.data[0].download_url != null ) { return new PanPlayInfo(down.data[0].download_url, ""); } } catch (error) { return new PanPlayInfo("", error.toString()); } return new PanPlayInfo("", "获取播放链接失败~2"); } /** * 获取播放格式 * @return {string[]} **/ getPlayForm() { return this.isVip ? [`原画`, `4K`] : [`原画`]; } }

//MARK: 网盘扩展统一入口
/**
 * 网盘工具
 */
class PanTools {
  constructor() {
    //MARK: 在这里初始化 对应网盘的具体实现对象

    this.quark = new QuarkUC(true);
    this.uc = new QuarkUC(false);

    /**
     * 扩展运行标识 ** uzApp 运行时自动赋值，请勿修改 **
     */
    this.uzTag = "";
  }

  /**
   * 获取 cookie  ** 无法在 PanTools 外部操作**
   * 环境变量 key 为 PanType.xx + "Cookie",请在 json 文件中添加
   * @param {PanType} panType
   * @returns {@Promise<string>}
   */
  async getCookie(panType) {
    const cookie = await getEnv(this.uzTag, panType + "Cookie");
    return cookie;
  }

  /**
   * 更新 cookie ** 无法在 PanTools 外部操作**
   * @param {PanType} panType
   * @param {string} cookie
   */
  async updateCookie(panType, cookie) {
    await setEnv(this.uzTag, panType + "Cookie", cookie);
  }

  /**
   * 获取网盘资源列表
   * @param {string} shareUrl
   * @returns {@Promise<PanListDetail>}
   */
  async getShareVideos(shareUrl) {
    if (shareUrl.includes("https://pan.quark.cn")) {
      /// 如果需要 cookie 请在这里获取
      // this.quark.cookie = await this.getCookie(PanType.Quark);
      const data = await this.quark.getFilesByShareUrl(shareUrl);
      return data;
    } else if (shareUrl.includes("https://drive.uc.cn")) {
      shareUrl = shareUrl.split("?")[0];
      /// 如果需要 cookie 请在这里获取
      // this.uc.cookie = await this.getCookie(PanType.UC);
      const data = await this.uc.getFilesByShareUrl(shareUrl);
      return data;
    }
    const data = new PanListDetail();
    data.error = "";
    return data;
  }

  /**
   * 获取播放信息
   * @param {PanVideoItem} item
   * @returns {@Promise<PanPlayInfo>}
   */
  async getPlayInfo(item) {
    if (item.panType === PanType.Quark) {
      /// 如果需要 cookie 请在这里获取
      this.quark.cookie = await this.getCookie(PanType.Quark);
      /// 更新 Quark cookie
      this.quark.updateCookie = () => {
        this.updateCookie(PanType.Quark, this.quark.cookie);
      };
      if (this.quark.cookie === "") {
        return new PanPlayInfo("", "获取 " + PanType.Quark + " cookie 失败~");
      }
      const data = await this.quark.getPlayUrl(item.data);
      return data;
    } else if (item.panType === PanType.UC) {
      /// 如果需要 cookie 请在这里获取
      this.uc.cookie = await this.getCookie(PanType.UC);
      /// 更新 UC cookie
      this.uc.updateCookie = () => {
        this.updateCookie(PanType.UC, this.uc.cookie);
      };
      if (this.uc.cookie === "") {
        return new PanPlayInfo("", "获取 " + PanType.UC + " cookie 失败~");
      }
      const data = await this.uc.getPlayUrl(item.data);
      return data;
    }

    return new PanPlayInfo("", "暂不支持该网盘类型");
  }
}

// 固定实例名称
const uzPanToolsInstance = new PanTools();
