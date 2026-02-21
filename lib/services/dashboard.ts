import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import Document from '@/lib/db/models/Document';
import Proposal from '@/lib/db/models/Proposal';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { IVendorStats } from '@/lib/types/vendor';

export async function getAdminDashboardStats() {
    await connectDB();

    const [
        total,
        pending,
        approvedLogin,
        documentsSubmitted,
        underReview,
        approved,
        rejected,
    ] = await Promise.all([
        Vendor.countDocuments(),
        Vendor.countDocuments({ status: 'PENDING' }),
        Vendor.countDocuments({ status: 'APPROVED_LOGIN' }),
        Vendor.countDocuments({ status: 'DOCUMENTS_SUBMITTED' }),
        Vendor.countDocuments({ status: 'UNDER_REVIEW' }),
        Vendor.countDocuments({ status: 'APPROVED' }),
        Vendor.countDocuments({ status: 'REJECTED' }),
    ]);

    const pendingDocuments = await Document.countDocuments({ status: 'PENDING' });

    const [proposalTotal, proposalOpen, proposalClosed, proposalAwarded, proposalSubmissions] = await Promise.all([
        Proposal.countDocuments(),
        Proposal.countDocuments({ status: 'OPEN' }),
        Proposal.countDocuments({ status: 'CLOSED' }),
        Proposal.countDocuments({ status: 'AWARDED' }),
        ProposalSubmission.countDocuments({ status: 'SUBMITTED' }),
    ]);

    return {
        stats: {
            total,
            pending,
            approvedLogin,
            documentsSubmitted,
            underReview,
            approved,
            rejected,
        } as IVendorStats,
        pendingDocuments,
        proposalStats: {
            total: proposalTotal,
            open: proposalOpen,
            closed: proposalClosed,
            awarded: proposalAwarded,
            submissions: proposalSubmissions,
        },
    };
}

export async function getVendorDashboardData(userId: string) {
    await connectDB();

    const vendor = await Vendor.findOne({ userId }).lean();
    if (!vendor) return null;

    const documents = await Document.find({ vendorId: vendor._id }).lean();

    // Fetch proposal stats
    const submissions = await ProposalSubmission.find({ vendorId: vendor._id }).lean();
    const openProposalsCount = await Proposal.countDocuments({ status: 'OPEN' });

    const stats = {
        total: submissions.length,
        draft: submissions.filter(s => s.status === 'DRAFT').length,
        submitted: submissions.filter(s => s.status === 'SUBMITTED').length,
        underReview: submissions.filter(s => s.status === 'UNDER_REVIEW').length,
        accepted: submissions.filter(s => s.status === 'ACCEPTED').length,
        rejected: submissions.filter(s => s.status === 'REJECTED').length,
        averageScore: submissions.length > 0
            ? submissions.reduce((acc, s) => acc + ((s as any).score || 0), 0) / submissions.length
            : 0,
        openProposals: openProposalsCount,
    };

    return {
        vendor: JSON.parse(JSON.stringify(vendor)),
        documents: JSON.parse(JSON.stringify(documents)),
        proposalStats: stats,
    };
}
