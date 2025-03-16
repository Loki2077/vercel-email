# Vercel 邮件代发 API

这是一个基于 Vercel Serverless Functions 构建的邮件代发 API 服务，可以接收客户端数据并通过邮件转发。

## 功能特点

- 基于 Vercel Serverless Functions，无需维护服务器
- 使用 Nodemailer 发送邮件
- 内置 CORS 安全验证
- 请求速率限制保护
- 自动格式化邮件内容

## 部署步骤

1. 克隆此仓库到本地

```bash
git clone <仓库地址>
cd vercel-email-api
```

2. 安装依赖

```bash
npm install
```

3. 在 Vercel 上设置环境变量

在 Vercel 控制台中，为项目添加以下环境变量：

- `MAIL_USER`: 发送邮件的邮箱地址
- `MAIL_PASS`: 邮箱的授权码（不是登录密码）

4. 部署到 Vercel

```bash
npm run deploy
```

## 本地开发

1. 创建 `.env` 文件并添加以下内容：

```
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password-or-app-password
```

2. 启动本地开发服务器

```bash
npm run dev
```

## API 使用说明

### 发送邮件

**请求方式**：POST

**接口地址**：`https://your-vercel-domain.vercel.app/api/send-info`

**请求头**：
```
Content-Type: application/json
Origin: arol.top 或 www.arol.top
```

**请求体**：
```json
{
  "name": "测试用户",
  "email": "user@example.com",
  "message": "这是一条测试消息",
  // 其他任意字段...
}
```

**成功响应**：
```json
{
  "success": true,
  "message": "邮件发送成功"
}
```

**错误响应**：
```json
{
  "error": "错误类型",
  "message": "错误详情"
}
```

## 安全说明

- API 仅接受来自允许的域名的请求
- 实现了基本的速率限制（每IP每分钟最多5个请求）
- 仅支持 POST 请求方法

## 自定义配置

如需修改允许的域名、邮件模板或其他配置，请编辑 `api/send-info.js` 文件。