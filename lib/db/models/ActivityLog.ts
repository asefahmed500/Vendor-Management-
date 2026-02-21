import mongoose, { Schema, Model, Document } from 'mongoose';
import { IActivityLog, ActivityType } from '@/lib/types/vendor';

export interface IActivityLogDocument extends Omit<IActivityLog, '_id' | 'vendorId' | 'performedBy'>, Document {
  vendorId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      enum: [
        'VENDOR_CREATED',
        'REGISTRATION_APPROVED',
        'REGISTRATION_REJECTED',
        'DOCUMENTS_SUBMITTED',
        'DOCUMENT_UPLOADED',
        'DOCUMENT_VERIFIED',
        'DOCUMENT_REJECTED',
        'UNDER_REVIEW',
        'FINAL_APPROVAL',
        'FINAL_REJECTION',
        'REVISION_REQUESTED',
        'PROFILE_UPDATED',
        'LOGIN',
      ] as const,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ vendorId: 1, createdAt: -1 });
ActivityLogSchema.index({ performedBy: 1, createdAt: -1 });
ActivityLogSchema.index({ activityType: 1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog: Model<IActivityLogDocument> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
