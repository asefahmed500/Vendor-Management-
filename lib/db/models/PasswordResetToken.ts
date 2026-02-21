import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPasswordResetToken {
  _id: string;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordResetTokenDocument extends Omit<IPasswordResetToken, '_id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Note: token already has unique index defined in the schema
PasswordResetTokenSchema.index({ userId: 1, createdAt: -1 });

const PasswordResetToken: Model<IPasswordResetTokenDocument> =
  mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetTokenDocument>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;
