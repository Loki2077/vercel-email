const nodemailer = require('nodemailer');

// 从环境变量获取速率限制配置
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '3600000');

// 简单的内存存储，用于速率限制
// 在生产环境中，应考虑使用Redis等分布式存储
const rateLimit = {
  // 存储IP地址及其请求次数和时间戳
  ipRequests: {},
  
  // 检查IP是否超过限制
  check: function(ip, limit = RATE_LIMIT_MAX_REQUESTS, timeWindow = RATE_LIMIT_WINDOW) { // 使用环境变量配置
    const now = Date.now();
    
    // 初始化IP记录
    if (!this.ipRequests[ip]) {
      this.ipRequests[ip] = {
        count: 0,
        firstRequest: now
      };
    }
    
    const record = this.ipRequests[ip];
    
    // 检查时间窗口是否已过期，如果过期则重置
    if (now - record.firstRequest > timeWindow) {
      record.count = 0;
      record.firstRequest = now;
    }
    
    // 增加请求计数
    record.count++;
    
    // 如果超过限制，返回false
    return record.count <= limit;
  }
};

// 验证环境变量
function validateEnvVars() {
  const requiredVars = ['MAIL_USER', 'MAIL_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
    return false;
  }
  return true;
}

// 验证邮箱格式
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// 记录请求日志
function logRequest(req, status, message) {
  const timestamp = new Date().toISOString();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[${timestamp}] IP: ${ip}, Status: ${status}, Message: ${message}`);
}

module.exports = async (req, res) => {
  // 获取客户端IP
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // 设置CORS头，限制特定域名访问
  // 从环境变量获取允许的域名列表
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  } else {
    // 对于不在白名单中的域名，可以选择拒绝或使用默认策略
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    logRequest(req, 405, '不支持的请求方法');
    return res.status(405).json({ error: '只支持POST请求' });
  }
  
  // 验证环境变量
  if (!validateEnvVars()) {
    logRequest(req, 500, '服务器配置错误：缺少环境变量');
    return res.status(500).json({ error: '服务器配置错误' });
  }

  // 检查速率限制
  if (!rateLimit.check(clientIp)) {
    logRequest(req, 429, '请求频率过高');
    return res.status(429).json({ error: '请求频率过高，请稍后再试' });
  }

  try {
    // 检查请求体大小
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxRequestSize = parseInt(process.env.MAX_REQUEST_SIZE || '1048576'); // 默认1MB
    if (contentLength > maxRequestSize) {
      logRequest(req, 413, '请求体过大');
      return res.status(413).json({ error: '请求体过大' });
    }
    
    const { to,from_name, subject, text, html } = req.body;

    // 验证必要的字段
    if (!to || !subject || (!text && !html)) {
      logRequest(req, 400, '缺少必要字段');
      return res.status(400).json({ error: '缺少必要的字段：to, subject, 和 text/html' });
    }
    
    // 验证邮箱格式
    if (!isValidEmail(to)) {
      logRequest(req, 400, '无效的邮箱地址');
      return res.status(400).json({ error: '无效的邮箱地址' });
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.qq.com',
      port: parseInt(process.env.MAIL_PORT || '465'),
      secure: process.env.MAIL_SECURE === 'false' ? false : true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 检查邮件内容大小
    const contentSize = (text ? text.length : 0) + (html ? html.length : 0);
    const maxEmailContentSize = parseInt(process.env.MAX_EMAIL_CONTENT_SIZE || '102400'); // 默认100KB
    if (contentSize > maxEmailContentSize) {
      logRequest(req, 413, '邮件内容过大');
      return res.status(413).json({ error: '邮件内容过大' });
    }
    
    // 设置邮件选项
    const mailOptions = {
      from: from_name != null ? from_name : "Vercel Email API" + ` <${process.env.MAIL_USER}>`,
      to,
      subject, 
      text,
      html,
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    
    // 记录成功日志
    logRequest(req, 200, `邮件发送成功: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    // 记录错误日志
    console.error('发送邮件时出错:', error);
    logRequest(req, 500, `发送邮件失败: ${error.message}`);
    
    // 返回友好的错误信息，不暴露敏感的错误详情
    return res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Email delivery failed',
    data: process.env.NODE_ENV === 'production' ? null : {
        errorDetails: error.message
    }
    });
  }
};