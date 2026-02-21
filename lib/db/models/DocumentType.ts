import mongoose, { Schema, Model, Document } from 'mongoose';
import { IDocumentType } from '@/lib/types/document';

export interface IDocumentTypeDocument extends Omit<IDocumentType, '_id'>, Document {}

const DocumentTypeSchema = new Schema<IDocumentTypeDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['BUSINESS_REGISTRATION', 'TAX', 'BANKING', 'CERTIFICATES_LICENCES', 'INSURANCE', 'CUSTOM'],
    },
    description: {
      type: String,
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowedFormats: {
      type: [String],
      default: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
    maxSizeMB: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

DocumentTypeSchema.index({ category: 1 });
DocumentTypeSchema.index({ isActive: 1 });

const DocumentType: Model<IDocumentTypeDocument> =
  mongoose.models.DocumentType || mongoose.model<IDocumentTypeDocument>('DocumentType', DocumentTypeSchema);

export default DocumentType;
