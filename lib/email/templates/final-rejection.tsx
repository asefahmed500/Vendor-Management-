interface FinalRejectionEmailProps {
  companyName: string;
  contactPerson: string;
  rejectionReason: string;
}

export function FinalRejectionEmail({
  companyName,
  contactPerson,
  rejectionReason
}: FinalRejectionEmailProps) {
  return {
    subject: `Application Status Update - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Status Update</title>
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
    .reason-box p { margin: 0; white-space: pre-wrap; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Application Status Update</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="reject-box">
        <p style="margin: 0;"><strong>Regretfully, we are unable to approve</strong> the application for <strong>${companyName}</strong> at this time.</p>
      </div>
      <p>After careful review of your submitted documents, our administration team has decided not to proceed with the vendor application.</p>
      <div class="reason-box">
        <p><strong>Reason for Decision:</strong></p>
        <p>${rejectionReason}</p>
      </div>
      <p>We understand this may be disappointing. If you believe this decision was made in error, or if circumstances change and you wish to provide additional information, please contact our support team.</p>
      <p>Thank you for your interest in partnering with us. We wish you success in your future endeavors.</p>
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
