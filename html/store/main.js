import { URL_SCHEMES, MESSAGES, RESOURCE_CONFIGS } from './config.js';

// URL验证函数
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// 显示错误信息
function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  setTimeout(() => {
    errorEl.textContent = '';
  }, 3000);
}

// 安装资源
function installResource(isSpecial, configUrl = null) {
  const urlInput = document.getElementById('customUrl');
  let url = configUrl || urlInput.value.trim();

  if (!url) {
    showError(MESSAGES.EMPTY_URL);
    return;
  }

  if (!validateUrl(url)) {
    showError(MESSAGES.INVALID_URL);
    return;
  }

  const encodedUrl = encodeURIComponent(url);
  const finalUrl = isSpecial
    ? `${URL_SCHEMES.INTENT}${encodedUrl}#Intent;scheme=uzVideo;end`
    : `${URL_SCHEMES.BASE}${encodedUrl}`;

  window.location.href = finalUrl;
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('复制失败:', err);
        throw err;
      } finally {
        document.body.removeChild(textArea);
      }
    }

    alert(MESSAGES.COPY_SUCCESS + '\n' + MESSAGES.USAGE_PATH);
  } catch (err) {
    console.error('复制操作失败:', err);
    alert(MESSAGES.COPY_FAIL + text);
  }
}

// 创建资源卡片
function createResourceCard(config) {
  const resourceGroup = document.createElement('div');
  resourceGroup.className = 'resource-group';
  resourceGroup.innerHTML = `
    <div class="resource-header">
      <div class="resource-title">${config.title}</div>
      ${config.description ? `<div class="resource-description">${config.description}</div>` : ''}
    </div>
    <div class="button-row">
      <div class="dropdown">
        <button class="dropdown-btn">操作</button>
        <div class="dropdown-content">
          <a href="#" data-action="copy" data-url="${config.resourceUrl}">复制</a>
          <a href="#" data-action="install" data-url="${config.resourceUrl}">添加</a>
          <a href="#" data-action="help">教程</a>
          <a href="#" data-action="special-install" data-url="${config.resourceUrl}">特殊添加</a>
      </div>
      </div>
    </div>
  `;
  return resourceGroup;
}

// 初始化页面
window.onload = function () {
  const container = document.getElementById('resourcesContainer');
  container.style.marginTop = '20px';

  RESOURCE_CONFIGS.forEach(config => {
    const resourceCard = createResourceCard(config);
    container.appendChild(resourceCard);
  });
};

// 初始化事件监听器
function initializeEventListeners() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-action]');
    if (!link) return;

    event.preventDefault();
    const action = link.getAttribute('data-action');
    const url = link.getAttribute('data-url');

    switch (action) {
      case 'copy':
        copyToClipboard(url);
        break;
      case 'install':
        installResource(false, url);
        break;
      case 'help':
        window.open('https://uz-video-five.vercel.app/help.html');
        break;
      case 'special-install':
        installResource(true, url);
        break;
    }
  });
}

// 导出函数供HTML使用
window.installResource = installResource;
window.copyToClipboard = copyToClipboard;

// 在页面加载完成后初始化事件监听器
window.addEventListener('load', initializeEventListeners);