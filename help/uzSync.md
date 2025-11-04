# uzSync 公共服务

[uzSync 帮助与说明](https://uzsync.616222.xyz/help)

# 自行部署指南

> 代码使用 AI 生成，可能存在漏洞。请自行斟酌是否部署。

## 🐳 镜像信息

- **镜像名称**: `uzvideoapp/uz_video_sync_server`
- **Docker Hub**: https://hub.docker.com/r/uzvideoapp/uz_video_sync_server
- **标签**: `latest` (最新版本)

## 📋 部署要求

### 系统要求

- CPU: 0.1 Core
- 可用内存: 推荐 64MB
- 磁盘空间: 视数据量决定 100MB

## 🚀 快速部署

### 方法一: Docker 直接运行

```bash
# 拉取最新镜像
docker pull uzvideoapp/uz_video_sync_server:latest

# 创建数据目录
mkdir -p ./data

# 运行容器
docker run -d \
  --name uz_sync_server \
  -p 8011:8011 \
  -v $(pwd)/data:/app/data \
  -e GIN_MODE=release \                      # 运行模式 - 生产环境建议设为 release
  -e PORT=8011 \                             # 服务监听端口
  -e TOKEN_TTL_DAYS=30 \                     # 令牌有效期（天）
  -e MAX_USER_TOKENS=10 \                    # 每用户最大令牌数
  -e MAX_FAVORITES=100 \                     # 收藏记录上限
  -e MAX_HISTORIES=100 \                     # 历史记录上限
  -e MAX_PROGRESSES=100 \                    # 进度记录上限
  -e MAX_SKIPS=50 \                          # 片头片尾记录上限
  -e MAX_NAME_LENGTH=120 \                   # 名称字段最大长度
  -e MAX_URL_LENGTH=400 \                    # URL字段最大长度
  -e MAX_DEFAULT_LENGTH=100 \                # 其他字段默认长度
  -e INACTIVE_USER_CLEANUP_DAYS=60 \         # 不活跃用户清理天数
  -e LOG_ENABLED=true \                      # 是否启用日志
  --restart unless-stopped \
  uzvideoapp/uz_video_sync_server:latest
```

### 方法二: Docker Compose (推荐)

创建 `docker-compose.yml` 文件:

```yaml
version: "3.8"

services:
  uz_sync_server:
    image: uzvideoapp/uz_video_sync_server:latest
    container_name: uz_sync_server
    ports:
      - "8011:8011"
    volumes:
      - ./data:/app/data
    environment:
      # 运行模式 - 生产环境建议设为 release
      - GIN_MODE=release
      # 服务监听端口
      - PORT=8011

      # 授权相关配置
      # 令牌有效期（天）
      - TOKEN_TTL_DAYS=30
      # 每用户最大令牌数
      - MAX_USER_TOKENS=10

      # 数据限制配置
      # 收藏记录上限
      - MAX_FAVORITES=100
      # 历史记录上限
      - MAX_HISTORIES=100
      # 进度记录上限
      - MAX_PROGRESSES=100
      # 片头片尾记录上限
      - MAX_SKIPS=50

      # 验证配置
      # 名称字段最大长度
      - MAX_NAME_LENGTH=120
      # URL字段最大长度
      - MAX_URL_LENGTH=400
      # 其他字段默认长度
      - MAX_DEFAULT_LENGTH=100

      # 系统配置
      # 不活跃用户清理天数
      - INACTIVE_USER_CLEANUP_DAYS=60
      # 是否启用日志
      - LOG_ENABLED=true
    restart: unless-stopped
```

启动服务:

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## ⚙️ 环境变量配置

### 必需配置

| 变量名     | 默认值 | 说明                       |
| ---------- | ------ | -------------------------- |
| `GIN_MODE` | -      | 生产环境建议设为 `release` |
| `PORT`     | 8011   | 服务监听端口               |

### 可选配置

#### 授权相关

| 变量名            | 默认值 | 说明             |
| ----------------- | ------ | ---------------- |
| `TOKEN_TTL_DAYS`  | 30     | 令牌有效期（天） |
| `MAX_USER_TOKENS` | 10     | 每用户最大令牌数 |

#### 数据限制

| 变量名           | 默认值 | 说明             |
| ---------------- | ------ | ---------------- |
| `MAX_FAVORITES`  | 100    | 收藏记录上限     |
| `MAX_HISTORIES`  | 100    | 历史记录上限     |
| `MAX_PROGRESSES` | 100    | 进度记录上限     |
| `MAX_SKIPS`      | 50     | 片头片尾记录上限 |

#### 验证配置

| 变量名               | 默认值 | 说明             |
| -------------------- | ------ | ---------------- |
| `MAX_NAME_LENGTH`    | 120    | 名称字段最大长度 |
| `MAX_URL_LENGTH`     | 400    | URL 字段最大长度 |
| `MAX_DEFAULT_LENGTH` | 100    | 其他字段默认长度 |

#### 系统配置

| 变量名                       | 默认值 | 说明               |
| ---------------------------- | ------ | ------------------ |
| `INACTIVE_USER_CLEANUP_DAYS` | 60     | 不活跃用户清理天数 |
| `LOG_ENABLED`                | true   | 是否启用日志       |
