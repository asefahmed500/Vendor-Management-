import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProposal {
  _id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
  requirements: string[];
  attachments?: string[];
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'AWARDED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposalDocument extends Omit<IProposal, '_id' | 'createdBy'>, Document {
  createdBy: mongoose.Types.ObjectId;
}

const ProposalSchema = new Schema<IProposalDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    budgetMin: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    budgetMax: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'OPEN', 'CLOSED', 'AWARDED'] as const,
      default: 'DRAFT',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

ProposalSchema.index({ status: 1 });
ProposalSchema.index({ deadline: 1 });
ProposalSchema.index({ category: 1 });
ProposalSchema.index({ createdBy: 1 });

ProposalSchema.virtual('submissions', {
  ref: 'ProposalSubmission',
  localField: '_id',
  foreignField: 'proposalId',
});

ProposalSchema.virtual('rankings', {
  ref: 'ProposalRanking',
  localField: '_id',
  foreignField: 'proposalId',
});

const Proposal: Model<IProposalDocument> =
  mongoose.models.Proposal || mongoose.model<IProposalDocument>('Proposal', ProposalSchema);

export default Proposal;
