export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

const BRAND = 'Design Center';

export function otpEmail(code: string): EmailContent {
  const subject = `Your ${BRAND} verification code`;
  const text = `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#2b2b2b">
      <h2 style="margin:0 0 8px">Verify your email</h2>
      <p style="margin:0 0 16px;color:#666">Use the code below to finish creating your ${BRAND} account.</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f5f1ea;border-radius:12px;padding:16px;text-align:center">${code}</div>
      <p style="margin:16px 0 0;color:#888;font-size:13px">This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p>
    </div>`;
  return { subject, text, html };
}

export function followUpEmail(name: string): EmailContent {
  const greeting = name ? `Hi ${name},` : 'Hello,';
  const subject = `Following up from ${BRAND}`;
  const text = `${greeting}\n\nThank you for visiting ${BRAND}. We'd love to help you take the next step on your project. Reply to this email or get in touch and our team will assist you.\n\nWarm regards,\nThe ${BRAND} Team`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#2b2b2b">
      <p style="margin:0 0 16px">${greeting}</p>
      <p style="margin:0 0 16px;color:#444">Thank you for visiting <strong>${BRAND}</strong>. We'd love to help you take the next step on your project. Just reply to this email or get in touch and our team will assist you.</p>
      <p style="margin:24px 0 0;color:#444">Warm regards,<br/>The ${BRAND} Team</p>
    </div>`;
  return { subject, text, html };
}
