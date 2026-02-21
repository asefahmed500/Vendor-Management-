import resend, { RESEND_FROM_EMAIL } from './resend';
import connectDB from '@/lib/db/connect';
import EmailLog from '@/lib/db/models/EmailLog';

// Email templates
export { RegistrationConfirmationEmail } from './templates/registration-confirmation';
export { RegistrationApprovedEmail } from './templates/registration-approved';
export { RegistrationRejectedEmail } from './templates/registration-rejected';
export { DocumentsConfirmationEmail } from './templates/documents-confirmation';
export { DocumentsReceivedEmail } from './templates/documents-received';
export { DocumentVerifiedEmail } from './templates/document-verified';
export { RevisionRequestedEmail } from './templates/revision-requested';
export { FinalApprovalEmail } from './templates/final-approval';
export { FinalRejectionEmail } from './templates/final-rejection';
export { NewRegistrationEmail } from './templates/new-registration';
export { PasswordResetEmail } from './templates/password-reset';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend and log the result
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  await connectDB();

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: recipients,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    // Log successful email
    await EmailLog.create({
      recipient: recipients.join(', '),
      template: options.subject,
      subject: options.subject,
      status: 'sent',
      resendId: result?.data?.id,
      metadata: {
        to: options.to,
        hasAttachments: !!options.attachments,
        attachmentCount: options.attachments?.length || 0,
      },
    });

    return {
      success: true,
      messageId: result?.data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed email
    await EmailLog.create({
      recipient: recipients.join(', '),
      template: options.subject,
      subject: options.subject,
      status: 'failed',
      error: errorMessage,
      metadata: {
        to: options.to,
      },
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get admin email for notifications
 */
export async function getAdminEmail(): Promise<string> {
  await connectDB();
  const User = (await import('@/lib/db/models/User')).default;
  const admin = await User.findOne({ role: 'ADMIN' });
  return admin?.email || process.env.ADMIN_EMAIL || 'admin@vms.com';
}
