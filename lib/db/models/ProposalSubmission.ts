import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProposalSubmission {
  _id: string;
  proposalId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  proposedAmount: number;
  timeline: string;
  description: string;
  approach: string;
  teamSize?: number;
  attachments?: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  adminComments?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposalSubmissionDocument extends Omit<IProposalSubmission, '_id' | 'proposalId' | 'vendorId'>, Document {
  proposalId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
}

const ProposalSubmissionSchema = new Schema<IProposalSubmissionDocument>(
  {
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
      index: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    proposedAmount: {
      type: Number,
      required: [true, 'Proposed amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    approach: {
      type: String,
      required: [true, 'Approach is required'],
      trim: true,
    },
    teamSize: {
      type: Number,
      min: [1, 'Team size must be at least 1'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'] as const,
      default: 'DRAFT',
    },
    adminComments: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
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

ProposalSubmissionSchema.index({ proposalId: 1, vendorId: 1 }, { unique: true });
ProposalSubmissionSchema.index({ status: 1 });
ProposalSubmissionSchema.index({ submittedAt: -1 });

ProposalSubmissionSchema.virtual('proposal', {
  ref: 'Proposal',
  localField: 'proposalId',
  foreignField: '_id',
  justOne: true,
});

ProposalSubmissionSchema.virtual('vendor', {
  ref: 'Vendor',
  localField: 'vendorId',
  foreignField: '_id',
  justOne: true,
});

ProposalSubmissionSchema.virtual('ranking', {
  ref: 'ProposalRanking',
  localField: '_id',
  foreignField: 'submissionId',
  justOne: true,
});

const ProposalSubmission: Model<IProposalSubmissionDocument> =
  mongoose.models.ProposalSubmission ||
  mongoose.model<IProposalSubmissionDocument>('ProposalSubmission', ProposalSubmissionSchema);

export default ProposalSubmission;
