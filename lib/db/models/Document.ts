import mongoose, { Schema, Model, Document as MongooseDocument } from 'mongoose';
import { IDocument } from '@/lib/types/document';

export interface IDocumentDocument extends Omit<IDocument, '_id' | 'vendorId' | 'uploadedBy' | 'documentTypeId' | 'verification'>, MongooseDocument {
  vendorId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  documentTypeId: mongoose.Types.ObjectId;
  verification?: mongoose.Types.ObjectId;
}

const DocumentSchema = new Schema<IDocumentDocument>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    documentTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentType',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'] as const,
      default: 'PENDING',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verification: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentVerification',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DocumentSchema.index({ vendorId: 1, status: 1 });
DocumentSchema.index({ documentTypeId: 1 });
DocumentSchema.index({ uploadedAt: -1 });

DocumentSchema.virtual('documentType', {
  ref: 'DocumentType',
  localField: 'documentTypeId',
  foreignField: '_id',
  justOne: true,
});

const DocumentModel: Model<IDocumentDocument> =
  mongoose.models.Document || mongoose.model<IDocumentDocument>('Document', DocumentSchema);

export default DocumentModel;
