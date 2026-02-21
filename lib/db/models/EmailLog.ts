import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IEmailLog {
  _id: string;
  recipient: string;
  template: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  metadata?: Record<string, unknown>;
  resendId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailLogDocument extends Omit<IEmailLog, '_id'>, Document {}

const EmailLogSchema = new Schema<IEmailLogDocument>(
  {
    recipient: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    template: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'] as const,
      default: 'pending',
      required: true,
      index: true,
    },
    error: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    resendId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EmailLogSchema.index({ recipient: 1, createdAt: -1 });
EmailLogSchema.index({ template: 1, createdAt: -1 });
EmailLogSchema.index({ status: 1, createdAt: -1 });
EmailLogSchema.index({ createdAt: -1 });

const EmailLog: Model<IEmailLogDocument> =
  mongoose.models.EmailLog || mongoose.model<IEmailLogDocument>('EmailLog', EmailLogSchema);

export default EmailLog;
