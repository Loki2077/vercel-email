const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 设置CORS头，允许跨域请求
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { to, subject, text, html } = req.body;

    // 验证必要的字段
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: '缺少必要的字段：to, subject, 和 text/html' });
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 设置邮件选项
    const mailOptions = {
      from: `"Vercel Email API" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('发送邮件时出错:', error);
    return res.status(500).json({
      error: '发送邮件失败',
      details: error.message,
    });
  }
};