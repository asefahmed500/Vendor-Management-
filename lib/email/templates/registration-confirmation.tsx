interface RegistrationConfirmationEmailProps {
  companyName: string;
  contactPerson: string;
  email: string;
  applicationUrl?: string;
}

export function RegistrationConfirmationEmail({
  companyName,
  contactPerson,
  email,
  applicationUrl = 'http://localhost:3000/login'
}: RegistrationConfirmationEmailProps) {
  return {
    subject: `Registration Received - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .info-box { background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .info-box strong { color: #1e293b; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Received</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <p>Thank you for registering <strong>${companyName}</strong> with our Vendor Management System.</p>
      <div class="info-box">
        <p><strong>Registration Details:</strong></p>
        <p>Email: ${email}</p>
        <p>Company: ${companyName}</p>
        <p>Status: <span style="color: #eab308; font-weight: 500;">Pending Review</span></p>
      </div>
      <p>Your application is currently being reviewed by our administration team. You will receive a notification email once your registration has been processed.</p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will review your application</li>
        <li>You will receive an email notification of the decision</li>
        <li>If approved, you will be able to login using your registered email</li>
      </ul>
      <p style="margin-top: 24px;">You can check your application status by logging into your account:</p>
      <a href="${applicationUrl}" class="button">Go to Login</a>
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
