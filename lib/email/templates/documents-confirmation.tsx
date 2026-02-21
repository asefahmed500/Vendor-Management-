interface DocumentsConfirmationEmailProps {
  companyName: string;
  contactPerson: string;
  documentCount: number;
  dashboardUrl: string;
}

export function DocumentsConfirmationEmail({
  companyName,
  contactPerson,
  documentCount,
  dashboardUrl = 'http://localhost:3000/vendor/dashboard'
}: DocumentsConfirmationEmailProps) {
  return {
    subject: `Documents Submitted Successfully - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documents Submitted</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .info-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .info-box strong { color: #166534; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Documents Submitted Successfully</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="info-box">
        <p style="margin: 0;"><strong>${documentCount} document(s)</strong> have been submitted for <strong>${companyName}</strong>.</p>
      </div>
      <p>Your documents have been received and are now under review by our administration team.</p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will review each document carefully</li>
        <li>You will receive notifications as documents are verified</li>
        <li>If any document requires changes, you will be notified</li>
        <li>Once all documents are verified, you will receive final approval</li>
      </ul>
      <p style="margin-top: 24px;">You can track the status of your documents in your dashboard:</p>
      <a href="${dashboardUrl}" class="button">View Dashboard</a>
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
