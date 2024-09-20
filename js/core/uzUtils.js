/**
 * @file 工具类
 */

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
   * 根据正则表达式获取字符串
   * @param {*} pattern
   * @param {string} str
   * @returns {string}
   */
  static getStrByRegexDefault(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
      if (matcher.length >= 1) {
        if (matcher.length >= 1) return matcher[1];
      }
    }
    return str;
  }

  /**
   * 用于在 uz 扩展调试模式中展示 log 信息
   */
  static debugLog() {
    sendMessage("debugLog", JSON.stringify([...arguments]));
  }
}

//MARK: - 网络请求返回数据
/**
 * req 返回的数据
 */
class ProData {
  constructor() {
    this.error = "";
    this.data;
    /**
     * @type {object} 响应头
     */
    this.headers;
    /**
     * @type {number} 状态码
     */
    this.code;
  }
}

/**
 * 请求响应类型
 */
const ReqResponseType = {
  json: "json",
  arraybuffer: "arraybuffer",
  bytes: "bytes",
  plain: "plain",
  stream: "stream",
};

//MARK: - 网络请求
/**
 * 网络请求
 * @param {string} url 请求的URL
 * @param {object} options 请求参数 {headers:{},method:"POST",data:{},responseType:ReqResponseType}
 * @returns {Promise<ProData>}
 */
async function req(url, options) {
  let pro = await sendMessage(
    "req",
    JSON.stringify({ url: url, options: options })
  );
  return pro;
}

// /**
//  * 展示 toast
//  */
// function toast() {
//   sendMessage("toast", JSON.stringify([...arguments]));
// }
//
// /**
//  * 读取环境变量
//  */
// async function getEnv(key) {
//   let res = await sendMessage("getEnv", JSON.stringify([key]));
//   return JSON.parse(res);
// }
//
// /**
//  * 写入环境变量
//  */
// async function setEnv(key, value) {
//   let res = await sendMessage("setEnv", JSON.stringify([key, value]));
//   return JSON.parse(res);
// }
