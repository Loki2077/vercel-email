# Vercel Email API

这是一个基于Vercel Serverless Functions的邮件发送API服务，可以轻松集成到任何前端应用中，实现邮件发送功能。

## 功能特点

- 使用Nodemailer发送邮件，稳定可靠
- 支持纯文本和HTML格式邮件
- 支持跨域请求(CORS)，可配置允许访问的域名
- 部署在Vercel平台，无需维护服务器
- 内置安全特性，包括速率限制、请求验证等
- 完整的错误处理和日志记录

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

### 准备工作

1. 确保已安装Node.js（推荐v14或更高版本）
2. 安装Vercel CLI：`npm i -g vercel`

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/Loki2077/vercel-email.git
   cd vercel-email
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   - **私有仓库**：可以直接创建`.env`文件，按照`.env.example`中的示例进行配置
   - **公共仓库**：建议不要创建`.env`文件（避免意外提交敏感信息），而是使用Vercel的环境变量设置功能

   最基本的配置示例：
   ```
   # 必需的配置
   MAIL_USER=你的邮箱地址
   MAIL_PASS=你的邮箱密码或授权码
   
   # 可选配置（如果不设置将使用默认值）
   MAIL_HOST=smtp.qq.com
   MAIL_PORT=465
   MAIL_SECURE=true
   ```

4. 启动本地开发服务器：
   ```bash
   vercel dev
   ```
   服务器将在`http://localhost:3000`启动

## 部署到Vercel

### 使用Vercel CLI部署

1. 安装Vercel CLI（如果尚未安装）：
   ```bash
   npm i -g vercel
   ```

2. 登录Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```
   按照提示完成部署配置。

### 配置环境变量

部署后，需要在Vercel控制台中设置环境变量：

1. 登录[Vercel控制台](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击「Settings」→「Environment Variables」
4. 添加以下环境变量：
   - `MAIL_USER`：你的邮箱地址
   - `MAIL_PASS`：你的邮箱密码或授权码
   - 其他可选变量（参考`.env.example`）

> **安全提示**：在Vercel控制台设置的环境变量会被加密存储，比直接在代码中或`.env`文件中设置更安全。对于公共仓库，强烈建议使用此方法配置敏感信息。

## 注意事项

### 邮箱配置

- 确保邮箱服务提供商允许SMTP访问，某些免费邮箱可能限制第三方访问
- **QQ邮箱配置**：
  1. 登录QQ邮箱网页版
  2. 点击「设置」→「账户」
  3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」并开启
  4. 获取授权码（而非QQ密码）作为`MAIL_PASS`的值
- **Gmail配置**：
  1. 开启「两步验证」
  2. 生成「应用专用密码」作为`MAIL_PASS`的值

### 安全建议

- **环境变量保护**：
  - 私有仓库：确保`.env`文件已添加到`.gitignore`中
  - 公共仓库：不要创建`.env`文件，使用Vercel环境变量设置
- **速率限制**：默认限制每IP每小时10次请求，可通过环境变量调整
  - 生产环境建议使用Redis等分布式存储实现更可靠的速率限制
- **监控与维护**：
  - 定期检查Vercel日志，监控API使用情况
  - 关注可疑的访问模式，及时调整安全策略

### 常见问题

- **邮件发送失败**：检查邮箱配置是否正确，SMTP服务是否开启
- **速率限制触发**：检查是否有异常请求，或调整`RATE_LIMIT_MAX_REQUESTS`值
- **CORS错误**：确认前端域名是否已添加到`ALLOWED_ORIGINS`环境变量中

## 安全特性

- **速率限制**: 防止API被滥用，默认限制每个IP每小时10次请求
  - 可通过`RATE_LIMIT_MAX_REQUESTS`和`RATE_LIMIT_WINDOW`环境变量自定义
- **CORS保护**: 限制特定域名访问API，防止未授权的跨域请求
  - 通过`ALLOWED_ORIGINS`环境变量配置允许的域名列表
- **请求体大小限制**: 防止大量数据攻击，限制请求体大小为1MB
  - 可通过`MAX_REQUEST_SIZE`环境变量自定义
- **邮件内容大小限制**: 限制邮件内容大小为100KB
  - 可通过`MAX_EMAIL_CONTENT_SIZE`环境变量自定义
- **环境变量验证**: 在启动时检查必要的环境变量，确保服务正常运行
- **日志记录**: 记录所有请求，包括时间戳、IP地址、状态和消息，便于追踪潜在的滥用行为
- **邮箱格式验证**: 验证收件人邮箱格式的有效性，防止无效邮件发送

## 使用示例

### 使用fetch API发送请求

```javascript
async function sendEmail() {
  try {
    const response = await fetch('https://your-vercel-app.vercel.app/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'recipient@example.com',
        subject: '测试邮件',
        text: '这是一封测试邮件',
        // 或者使用HTML格式
        // html: '<h1>这是一封测试邮件</h1><p>Hello World!</p>'
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('邮件发送成功:', data.messageId);
    } else {
      console.error('邮件发送失败:', data.error);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
}
```

### 使用axios发送请求

```javascript
async function sendEmail() {
  try {
    const response = await axios.post('https://your-vercel-app.vercel.app/api', {
      to: 'recipient@example.com',
      subject: '测试邮件',
      text: '这是一封测试邮件'
    });
    
    console.log('邮件发送成功:', response.data.messageId);
  } catch (error) {
    console.error('邮件发送失败:', error.response?.data?.error || error.message);
  }
}
```

## 自定义与扩展

你可以根据需要扩展此API的功能：

- 添加更多邮件选项，如抄送(cc)、密送(bcc)、附件等
- 集成邮件模板系统，如使用Handlebars或EJS
- 添加更多安全特性，如API密钥验证
- 实现邮件队列系统，处理大量邮件发送请求