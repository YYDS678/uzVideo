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
