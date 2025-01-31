// api/send-info.js
import { createTransport } from 'nodemailer';

export default async (req, res) => {
  // 验证请求来源
  const allowedOrigins = ['arol.top'];
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: '访问被拒绝' });
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

  try {
    // 构造邮件内容
    const mailOptions = {
      from: '数据收集服务 <noreply@arol.top>',
      to: 'zalicearol@outlook.com',
      subject: '新访客数据报告',
      html: buildEmailHtml(req.body)
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('邮件发送失败:', error);
    res.status(500).json({ error: '发送失败' });
  }
};

// 生成HTML邮件模板
function buildEmailHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">访客信息报告</h2>
      <table style="border-collapse: collapse; width: 100%;">
        ${Object.entries(data).map(([key, val]) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${key}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${val}</td>
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