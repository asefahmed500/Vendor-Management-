interface FinalApprovalEmailProps {
  companyName: string;
  contactPerson: string;
  certificateNumber: string;
  approvalDate: string;
  dashboardUrl: string;
}

export function FinalApprovalEmail({
  companyName,
  contactPerson,
  certificateNumber,
  approvalDate,
  dashboardUrl = 'http://localhost:3000/vendor/certificate'
}: FinalApprovalEmailProps) {
  const formattedDate = new Date(approvalDate).toLocaleDateString();

  return {
    subject: `Final Approval Granted - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Final Approval Granted</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .success-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center; }
    .success-box strong { color: #166534; font-size: 18px; }
    .certificate-box { background-color: #f0fdf4; border: 2px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .certificate-box p { margin: 5px 0; }
    .certificate-box strong { color: #166534; }
    .button { display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
    .congrats { font-size: 32px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Congratulations!</h1>
    </div>
    <div class="content">
      <p style="text-align: center; font-size: 20px; margin-bottom: 30px;">🎉 <span class="congrats"></span> 🎉</p>
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="success-box">
        <p style="margin: 0;"><strong>Your company has been fully approved!</strong></p>
      </div>
      <p>We are pleased to inform you that <strong>${companyName}</strong> has completed the vendor onboarding process and is now an approved vendor.</p>
      <div class="certificate-box">
        <p style="font-size: 16px; font-weight: 600; color: #166534; margin-bottom: 15px;">📜 Certificate of Approval</p>
        <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
        <p><strong>Approval Date:</strong> ${formattedDate}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Contact:</strong> ${contactPerson}</p>
      </div>
      <p>Your approval certificate is attached to this email. You can also download it from your dashboard at any time.</p>
      <p><strong>What's Next?</strong></p>
      <ul>
        <li>Your vendor profile is now active</li>
        <li>You can browse and respond to proposals</li>
        <li>You can update your profile information</li>
        <li>Your certificate is available for download</li>
      </ul>
      <a href="${dashboardUrl}" class="button">View Your Certificate</a>
    </div>
    <div class="footer">
      <p>Welcome aboard! If you have any questions, please contact our support team.</p>
      <p>&copy; ${new Date().getFullYear()} Vendor Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
