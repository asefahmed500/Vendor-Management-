import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProposalRanking {
  _id: string;
  proposalId: mongoose.Types.ObjectId;
  submissionId: mongoose.Types.ObjectId;
  rankedBy: mongoose.Types.ObjectId;
  rank: number;
  score: number;
  technicalScore: number;
  financialScore: number;
  experienceScore: number;
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposalRankingDocument extends Omit<IProposalRanking, '_id' | 'proposalId' | 'submissionId' | 'rankedBy'>, Document {
  proposalId: mongoose.Types.ObjectId;
  submissionId: mongoose.Types.ObjectId;
  rankedBy: mongoose.Types.ObjectId;
}

const ProposalRankingSchema = new Schema<IProposalRankingDocument>(
  {
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
      index: true,
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'ProposalSubmission',
      required: true,
      unique: true,
      index: true,
    },
    rankedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rank: {
      type: Number,
      required: [true, 'Rank is required'],
      min: [1, 'Rank must be at least 1'],
    },
    score: {
      type: Number,
      required: [true, 'Overall score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    technicalScore: {
      type: Number,
      required: [true, 'Technical score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    financialScore: {
      type: Number,
      required: [true, 'Financial score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    experienceScore: {
      type: Number,
      required: [true, 'Experience score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ProposalRankingSchema.index({ proposalId: 1, rank: 1 });
ProposalRankingSchema.index({ rankedBy: 1 });
ProposalRankingSchema.index({ score: -1 });

const ProposalRanking: Model<IProposalRankingDocument> =
  mongoose.models.ProposalRanking ||
  mongoose.model<IProposalRankingDocument>('ProposalRanking', ProposalRankingSchema);

export default ProposalRanking;
