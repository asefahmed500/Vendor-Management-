interface NewRegistrationEmailProps {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  companyType?: string;
  taxId?: string;
  adminDashboardUrl: string;
}

export function NewRegistrationEmail({
  companyName,
  contactPerson,
  email,
  phone,
  companyType,
  taxId,
  adminDashboardUrl = 'http://localhost:3000/admin/vendors'
}: NewRegistrationEmailProps) {
  return {
    subject: `New Vendor Registration - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Vendor Registration</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .alert-box { background-color: #f3e8ff; border-left: 4px solid #8b5cf6; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .alert-box strong { color: #6b21a8; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .info-table tr:last-child td { border-bottom: none; }
    .info-table td:first-child { font-weight: 600; color: #64748b; width: 150px; }
    .info-table td:last-child { color: #1e293b; }
    .button { display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Vendor Registration</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <p style="margin: 0;"><strong>Action Required:</strong> A new vendor has registered and is awaiting your review.</p>
      </div>
      <p>A new vendor application has been submitted. Please review the details below and decide whether to approve or reject the registration.</p>
      <table class="info-table">
        <tr>
          <td>Company Name</td>
          <td><strong>${companyName}</strong></td>
        </tr>
        <tr>
          <td>Contact Person</td>
          <td>${contactPerson}</td>
        </tr>
        <tr>
          <td>Email Address</td>
          <td><a href="mailto:${email}" style="color: #8b5cf6;">${email}</a></td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td>${phone}</td>
        </tr>
        ${companyType ? `
        <tr>
          <td>Company Type</td>
          <td>${companyType}</td>
        </tr>
        ` : ''}
        ${taxId ? `
        <tr>
          <td>Tax ID</td>
          <td>${taxId}</td>
        </tr>
        ` : ''}
        <tr>
          <td>Status</td>
          <td><span style="background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">PENDING</span></td>
        </tr>
      </table>
      <p>Please log in to the admin dashboard to review this application and make your decision.</p>
      <a href="${adminDashboardUrl}" class="button">Review Application</a>
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
