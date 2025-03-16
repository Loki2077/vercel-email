import { createTransport } from 'nodemailer';
import cors from 'cors';

// 配置CORS中间件
const corsMiddleware = cors({
  origin: ['arol.top', 'www.arol.top'],
  methods: ['POST'],
  optionsSuccessStatus: 200
});

// CORS中间件处理函数
const runCorsMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// 速率限制 - 简单实现
const rateLimits = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟窗口
const MAX_REQUESTS = 12; // 每个IP每分钟最多12个请求

const checkRateLimit = (ip) => {
  const now = Date.now();
  if (!rateLimits[ip]) {
    rateLimits[ip] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
    return true;
  }

  if (now > rateLimits[ip].resetAt) {
    rateLimits[ip] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
    return true;
  }

  if (rateLimits[ip].count >= MAX_REQUESTS) {
    return false;
  }

  rateLimits[ip].count += 1;
  return true;
};

export default async (req, res) => {
  try {
    // 处理CORS
    await runCorsMiddleware(req, res);

    // 只允许POST请求
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '方法不允许', message: '只支持POST请求' });
    }

    // 速率限制检查
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: '请求过多', message: '请稍后再试' });
    }

    // 验证请求数据
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: '无效请求', message: '请求体不能为空' });
    }

    // 配置邮件服务
    const transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // 构造邮件内容
    const mailOptions = {
      from: `数据收集服务 <${process.env.MAIL_USER}>`,
      to: 'zalicearol@outlook.com',
      subject: '新访客数据报告',
      html: buildEmailHtml(req.body)
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '邮件发送成功' });
  } catch (error) {
    console.error('邮件发送失败:', error);
    res.status(500).json({ error: '服务器错误', message: '邮件发送失败' });
  }
};

// 生成HTML邮件模板
function buildEmailHtml(data) {
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">访客信息报告</h2>
      <p style="color: #666;">收集时间: ${timestamp}</p>
      <table style="border-collapse: collapse; width: 100%;">
        ${Object.entries(data).map(([key, val]) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${key}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${typeof val === 'object' ? JSON.stringify(val) : val}</td>
          </tr>
        `).join('')}
      </table>
      <p style="margin-top: 20px; color: #666;">
        此邮件由系统自动发送，请勿直接回复
      </p>
    </div>
  `;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb'
    }
  }
};