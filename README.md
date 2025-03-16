# Vercel Email API

这是一个基于Vercel Serverless Functions的邮件发送API服务。

## 功能特点

- 使用Nodemailer发送邮件
- 支持纯文本和HTML格式邮件
- 支持跨域请求(CORS)
- 部署在Vercel平台，无需维护服务器

## 使用方法

### API端点

```
POST /api
```

### 请求参数

```json
{
  "to": "收件人邮箱地址",
  "subject": "邮件主题",
  "text": "纯文本内容（可选，如果提供html则可不提供）",
  "html": "HTML格式内容（可选，如果提供text则可不提供）"
}
```

### 响应格式

成功：
```json
{
  "success": true,
  "messageId": "邮件ID"
}
```

失败：
```json
{
  "error": "错误信息",
  "details": "详细错误信息"
}
```

## 本地开发

1. 克隆仓库
2. 安装依赖：`npm install`
3. 创建`.env`文件并设置以下环境变量：
   ```
   MAIL_USER=你的邮箱地址
   MAIL_PASS=你的邮箱密码或授权码
   ```
4. 使用Vercel CLI进行本地开发：`vercel dev`

## 部署到Vercel

1. 安装Vercel CLI：`npm i -g vercel`
2. 登录Vercel：`vercel login`
3. 部署项目：`vercel`
4. 在Vercel控制台中设置环境变量`MAIL_USER`和`MAIL_PASS`

## 注意事项

- 确保邮箱服务提供商允许SMTP访问
- 对于QQ邮箱，需要在邮箱设置中开启SMTP服务并获取授权码
- 保护好你的邮箱凭据，不要将`.env`文件提交到版本控制系统中