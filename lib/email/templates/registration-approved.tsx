interface RegistrationApprovedEmailProps {
  companyName: string;
  contactPerson: string;
  loginUrl: string;
}

export function RegistrationApprovedEmail({
  companyName,
  contactPerson,
  loginUrl = 'http://localhost:3000/login'
}: RegistrationApprovedEmailProps) {
  return {
    subject: `Registration Approved - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Approved</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .success-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .success-box strong { color: #166534; }
    .button { display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .steps { background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin-bottom: 10px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Approved!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="success-box">
        <p style="margin: 0;"><strong>Great news!</strong> Your registration for <strong>${companyName}</strong> has been approved.</p>
      </div>
      <p>You can now access the vendor portal and complete your onboarding process by submitting the required documents.</p>
      <div class="steps">
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Login to your account using your registered email and password</li>
          <li>Navigate to the Documents section</li>
          <li>Upload all required business documents</li>
          <li>Submit your documents for verification</li>
        </ol>
      </div>
      <a href="${loginUrl}" class="button">Login to Your Account</a>
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
