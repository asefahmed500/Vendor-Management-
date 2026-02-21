interface RegistrationRejectedEmailProps {
  companyName: string;
  contactPerson: string;
  rejectionReason?: string;
}

export function RegistrationRejectedEmail({
  companyName,
  contactPerson,
  rejectionReason = 'Your application did not meet our requirements.'
}: RegistrationRejectedEmailProps) {
  return {
    subject: `Registration Update - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .reject-box { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .reject-box strong { color: #991b1b; }
    .reason-box { background-color: #f1f5f9; padding: 16px; border-radius: 4px; margin: 20px 0; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Update</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="reject-box">
        <p style="margin: 0;"><strong>We regret to inform you</strong> that your registration for <strong>${companyName}</strong> could not be approved at this time.</p>
      </div>
      ${rejectionReason ? `
      <div class="reason-box">
        <p><strong>Reason:</strong></p>
        <p>${rejectionReason}</p>
      </div>
      ` : ''}
      <p>If you believe this decision was made in error, or if you would like to provide additional information for reconsideration, please contact our support team.</p>
      <p>We appreciate your interest in partnering with us and encourage you to apply again in the future if circumstances change.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team.</p>
      <p>&copy; ${new Date().getFullYear()} Vendor Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
