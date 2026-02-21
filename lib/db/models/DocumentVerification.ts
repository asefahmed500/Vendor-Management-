import mongoose, { Schema, Model, Document } from 'mongoose';
import { IDocumentVerification, VerificationStatus } from '@/lib/types/document';

export interface IDocumentVerificationDocument extends Omit<IDocumentVerification, '_id' | 'documentId' | 'verifiedBy'>, Document {
  documentId: mongoose.Types.ObjectId;
  verifiedBy: mongoose.Types.ObjectId;
}

const DocumentVerificationSchema = new Schema<IDocumentVerificationDocument>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      unique: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'REJECTED'] as const,
      required: true,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Comments cannot exceed 500 characters'],
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Note: documentId already has unique index defined in the schema
DocumentVerificationSchema.index({ verifiedBy: 1 });
DocumentVerificationSchema.index({ verifiedAt: -1 });

const DocumentVerification: Model<IDocumentVerificationDocument> =
  mongoose.models.DocumentVerification ||
  mongoose.model<IDocumentVerificationDocument>('DocumentVerification', DocumentVerificationSchema);

export default DocumentVerification;
