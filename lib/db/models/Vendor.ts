import mongoose, { Schema, Model, Document } from 'mongoose';
import { IVendor, VendorStatus } from '@/lib/types/vendor';

export interface IVendorDocument extends Omit<IVendor, '_id' | 'userId' | 'id'>, Document {
  userId: mongoose.Types.ObjectId;
}

const VendorSchema = new Schema<IVendorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number'],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    companyType: {
      type: String,
      trim: true,
      enum: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other', ''],
    },
    taxId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED_LOGIN', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const,
      default: 'APPROVED_LOGIN',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    approvalDate: {
      type: Date,
    },
    certificateNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Note: userId and certificateNumber already have unique indexes defined in the schema
VendorSchema.index({ status: 1 });
VendorSchema.index({ companyName: 1 });
VendorSchema.index({ createdAt: -1 });

VendorSchema.virtual('documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'vendorId',
});

VendorSchema.virtual('activityLogs', {
  ref: 'ActivityLog',
  localField: '_id',
  foreignField: 'vendorId',
  options: { sort: { createdAt: -1 } },
});

const Vendor: Model<IVendorDocument> =
  mongoose.models.Vendor || mongoose.model<IVendorDocument>('Vendor', VendorSchema);

export default Vendor;
