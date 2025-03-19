# Vercel Email API

[中文](#chinese) | [English](#english)

<a name="chinese"></a>
## 中文

这是一个基于Vercel Serverless Functions的邮件发送API服务，可以轻松集成到任何前端应用中，实现邮件发送功能。

### 功能特点

- 使用Nodemailer发送邮件，稳定可靠
- 支持纯文本和HTML格式邮件
- 支持跨域请求(CORS)，可配置允许访问的域名
- 部署在Vercel平台，无需维护服务器
- 内置安全特性，包括速率限制、请求验证等
- 完整的错误处理和日志记录

### 使用方法

#### API端点

```
POST /api
```

#### 请求参数

```json
{
  "to": "收件人邮箱地址",
  "subject": "邮件主题",
  "text": "纯文本内容（可选，html 和 text 必须提供一个）",
  "html": "HTML格式内容（可选，html 和 text 必须提供一个）",
  "from_name": "发送者名称（可选）"
}
```

#### 响应格式

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

### 本地开发

#### 准备工作

1. 确保已安装Node.js（推荐v14或更高版本）
2. 安装Vercel CLI：`npm i -g vercel`

#### 安装步骤

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

### 部署到Vercel

#### 使用Vercel CLI部署

1. 安装Vercel CLI（如果尚未安装）：
   ```bash
   npm i -g vercel
   ```
   > 提示：如果vercel提示无法识别为命令，请使用 `npx vercel` 替代

2. 登录Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```

#### 配置环境变量

1. 登录[Vercel控制台](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击「Settings」→「Environment Variables」
4. 添加以下环境变量：
   - `MAIL_USER`：你的邮箱地址
   - `MAIL_PASS`：你的邮箱密码或授权码
   - 其他可选变量（参考`.env.example`）

### 最佳实践

1. **错误处理**
   - 始终在代码中实现适当的错误处理
   - 检查API错误和网络故障
   - 对临时性故障实现重试逻辑

2. **速率限制**
   - 注意速率限制（默认每IP每小时10次请求）
   - 对批量操作实现客户端限流
   - 考虑使用队列系统处理大量发送

3. **安全性**
   - 永远不要在客户端代码中暴露敏感信息
   - 使用环境变量进行配置
   - 实现适当的输入验证

### 故障排除

1. **邮件发送失败**
   - 验证邮箱配置是否正确
   - 确保SMTP服务已启用
   - 检查收件人邮箱格式是否有效

2. **速率限制触发**
   - 检查是否有异常请求模式
   - 根据需要调整`RATE_LIMIT_MAX_REQUESTS`
   - 实现请求队列

3. **CORS错误**
   - 确认前端域名是否已添加到`ALLOWED_ORIGINS`
   - 检查请求头是否正确
   - 确保协议（http/https）匹配

### 贡献指南

欢迎贡献！如果你想提交改进，请随时提交Pull Request。对于重大更改，请先开issue讨论你想要改变的内容。

1. Fork本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

### 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

---

<a name="english"></a>
## English

A reliable email sending API service based on Vercel Serverless Functions that can be easily integrated into any frontend application.

### Features

- Stable and reliable email sending using Nodemailer
- Support for both plain text and HTML format emails
- Cross-Origin Resource Sharing (CORS) support with configurable domain allowlist
- Deployed on Vercel platform, no server maintenance required
- Built-in security features including rate limiting and request validation
- Comprehensive error handling and logging

### Quick Start

#### API Endpoint

```
POST /api
```

#### Request Parameters

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content (optional, either html or text must be provided)",
  "html": "HTML format content (optional, either html or text must be provided)",
  "from_name": "Sender Name (optional)"
}
```

#### Response Format

Success:
```json
{
  "success": true,
  "messageId": "email-id"
}
```

Failure:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Local Development

#### Prerequisites

1. Node.js (v14 or higher recommended)
2. Vercel CLI: `npm i -g vercel`

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Loki2077/vercel-email.git
   cd vercel-email
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - For private repositories: Create a `.env` file following the `.env.example` template
   - For public repositories: Use Vercel's environment variables settings

   Basic configuration example:
   ```
   # Required
   MAIL_USER=your-email@example.com
   MAIL_PASS=your-email-password-or-app-specific-password
   
   # Optional (defaults will be used if not set)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_SECURE=true
   ```

4. Start the development server:
   ```bash
   vercel dev
   ```
   Server will start at `http://localhost:3000`

### Deployment

#### Using Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
   > Note: If you encounter the error "vercel is not recognized as a cmdlet", use `npx vercel` instead

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

#### Environment Variables Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add the following variables:
   - `MAIL_USER`: Your email address
   - `MAIL_PASS`: Your email password or app-specific password
   - Other optional variables (refer to `.env.example`)

### Usage Examples

#### Using fetch API

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
        subject: 'Test Email',
        text: 'This is a test email',
        // Or use HTML format
        // html: '<h1>This is a test email</h1><p>Hello World!</p>'
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Email sent successfully:', data.messageId);
    } else {
      console.error('Failed to send email:', data.error);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
}
```

#### Using axios

```javascript
async function sendEmail() {
  try {
    const response = await axios.post('https://your-vercel-app.vercel.app/api', {
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    });
    
    console.log('Email sent successfully:', response.data.messageId);
  } catch (error) {
    console.error('Failed to send email:', error.response?.data?.error || error.message);
  }
}
```

### Best Practices

1. **Error Handling**
   - Always implement proper error handling in your code
   - Check for both API errors and network failures
   - Implement retry logic for transient failures

2. **Rate Limiting**
   - Be mindful of the rate limits (10 requests per hour per IP by default)
   - Implement client-side throttling for bulk operations
   - Consider using a queue system for high-volume sending

3. **Security**
   - Never expose sensitive information in client-side code
   - Use environment variables for configuration
   - Implement proper input validation

### Troubleshooting

1. **Email Sending Fails**
   - Verify email configuration is correct
   - Ensure SMTP service is enabled
   - Check for valid recipient email format

2. **Rate Limit Exceeded**
   - Check for unusual request patterns
   - Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
   - Implement request queuing

3. **CORS Errors**
   - Verify frontend domain is added to `ALLOWED_ORIGINS`
   - Check for proper request headers
   - Ensure protocol (http/https) matches

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.