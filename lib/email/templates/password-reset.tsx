interface PasswordResetEmailProps {
  recipientName: string;
  resetUrl: string;
  expiryHours?: number;
}

export function PasswordResetEmail({
  recipientName,
  resetUrl,
  expiryHours = 1
}: PasswordResetEmailProps) {
  return {
    subject: 'Reset Your Password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .alert-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .alert-box strong { color: #92400e; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
    .info-box { background-color: #f1f5f9; padding: 16px; border-radius: 4px; margin: 20px 0; }
    .info-box p { margin: 5px 0; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
      <div class="alert-box">
        <p style="margin: 0;"><strong>This link will expire in ${expiryHours} hour(s).</strong></p>
      </div>
      <p>To reset your password, click the button below:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2563eb; font-size: 12px;">${resetUrl}</p>
      <div class="info-box">
        <p><strong>For your security:</strong></p>
        <p>• This link can only be used once</p>
        <p>• It expires after ${expiryHours} hour(s)</p>
        <p>• Your current password will remain active until you reset it</p>
      </div>
      <p>If you have any issues resetting your password, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} Vendor Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
