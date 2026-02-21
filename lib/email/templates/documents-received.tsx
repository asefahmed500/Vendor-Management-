interface DocumentsReceivedEmailProps {
  companyName: string;
  contactPerson: string;
  vendorEmail: string;
  documentCount: number;
  vendorDashboardUrl: string;
}

export function DocumentsReceivedEmail({
  companyName,
  contactPerson,
  vendorEmail,
  documentCount,
  vendorDashboardUrl = 'http://localhost:3000/admin/vendors'
}: DocumentsReceivedEmailProps) {
  return {
    subject: `New Documents Submitted - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Documents Submitted</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .alert-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .alert-box strong { color: #92400e; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-table td:first-child { font-weight: 600; color: #64748b; width: 140px; }
    .button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Documents Submitted</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <p style="margin: 0;"><strong>Action Required:</strong> A vendor has submitted documents for review.</p>
      </div>
      <table class="info-table">
        <tr>
          <td>Company:</td>
          <td>${companyName}</td>
        </tr>
        <tr>
          <td>Contact:</td>
          <td>${contactPerson}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>${vendorEmail}</td>
        </tr>
        <tr>
          <td>Documents:</td>
          <td><strong>${documentCount}</strong> document(s) submitted</td>
        </tr>
      </table>
      <p>Please review the submitted documents at your earliest convenience.</p>
      <a href="${vendorDashboardUrl}" class="button">Review Documents</a>
    </div>
    <div class="footer">
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} Vendor Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
