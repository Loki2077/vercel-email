import { createTransport } from 'nodemailer';


export default async (req, res) => {
  try {
    // 只允许POST请求
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '方法不允许', message: '只支持POST请求' });
    }

    // 验证请求数据
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: '无效请求', message: '请求体不能为空' });
    }

    // 验证必要参数
    const { to, subject, content, html } = req.body;
    if (!to) {
      return res.status(400).json({ error: '参数错误', message: '收件人邮箱(to)不能为空' });
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
      from: `${req.body.from_name || '邮件服务'} <${process.env.MAIL_USER}>`,
      to: to,
      subject: subject || '无主题',
      text: content || '',
      html: html || ''
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '邮件发送成功' });
  } catch (error) {
    console.error('邮件发送失败:', error);
    res.status(500).json({ error: '服务器错误', message: '邮件发送失败' });
  }
};



export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb'
    }
  }
};