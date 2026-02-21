interface RevisionRequestedEmailProps {
  companyName: string;
  contactPerson: string;
  rejectedDocuments: Array<{ documentName: string; reason: string }>;
  dashboardUrl: string;
}

export function RevisionRequestedEmail({
  companyName,
  contactPerson,
  rejectedDocuments,
  dashboardUrl = 'http://localhost:3000/vendor/documents'
}: RevisionRequestedEmailProps) {
  const rejectedDocsList = rejectedDocuments
    .map(doc => `<li><strong>${doc.documentName}</strong>: ${doc.reason}</li>`)
    .join('');

  return {
    subject: `Action Required: Document Revisions Needed - ${companyName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revision Requested</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { margin-bottom: 30px; }
    .content p { margin-bottom: 16px; }
    .alert-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .alert-box strong { color: #92400e; }
    .revision-list { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .revision-list ul { margin: 10px 0 0 0; padding-left: 20px; }
    .revision-list li { margin-bottom: 10px; }
    .button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Action Required: Document Revisions</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson}</strong>,</p>
      <div class="alert-box">
        <p style="margin: 0;"><strong>Please review the following feedback</strong> from our administration team regarding your documents for <strong>${companyName}</strong>.</p>
      </div>
      <p>The following documents require revisions before your application can proceed:</p>
      <div class="revision-list">
        <p style="margin: 0 0 10px 0;"><strong>Documents Requiring Revision:</strong></p>
        <ul>
          ${rejectedDocsList}
        </ul>
      </div>
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Login to your account</li>
        <li>Review the feedback for each document</li>
        <li>Upload revised versions of the rejected documents</li>
        <li>Resubmit your documents for review</li>
      </ol>
      <a href="${dashboardUrl}" class="button">Update Documents</a>
    </div>
    <div class="footer">
      <p>If you have any questions about the feedback, please contact our support team.</p>
      <p>&copy; ${new Date().getFullYear()} Vendor Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
