'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Award,
  Loader2,
} from 'lucide-react';
import { IVendor, VendorStatus } from '@/lib/types/vendor';
import { IDocument } from '@/lib/types/document';
import { IProposalSubmission } from '@/lib/types/proposal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AdminVendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [submissions, setSubmissions] = useState<IProposalSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'submissions' | 'activity'>('overview');

  const fetchVendorData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [vendorRes, docsRes, submissionsRes] = await Promise.all([
        fetch(`/api/admin/vendors/${vendorId}`),
        fetch(`/api/vendor/documents`),
        fetch(`/api/vendor/proposals/submissions`),
      ]);

      const vendorData = await vendorRes.json();
      const docsData = await docsRes.json();
      const submissionsData = await submissionsRes.json();

      if (vendorData.success) {
        setVendor(vendorData.data.vendor);
      }
      if (docsData.success) {
        setDocuments(docsData.data.documents || []);
      }
      if (submissionsData.success) {
        setSubmissions(submissionsData.data.submissions || []);
      }
    } catch (error) {
      console.error('Fetch vendor error:', error);
      toast.error('Failed to fetch vendor data');
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const handleApproveRegistration = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/approve-registration`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Vendor registration approved');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Failed to approve vendor');
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve vendor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalApprove = async () => {
    if (!confirm('Are you sure you want to final approve this vendor? A certificate will be generated.')) {
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/final-approve`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Vendor approved and certificate generated');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Failed to approve vendor');
      }
    } catch (error) {
      console.error('Final approve error:', error);
      toast.error('Failed to approve vendor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestRevisions = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide reason for revision request');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/request-revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Revision request sent');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Failed to send revision request');
      }
    } catch (error) {
      console.error('Request revisions error:', error);
      toast.error('Failed to send revision request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRegistration = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/vendors/${vendorId}/reject-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Vendor registration rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Failed to reject vendor');
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject vendor');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusVariant = (status: VendorStatus | string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED_LOGIN':
        return 'info';
      case 'DOCUMENTS_SUBMITTED':
        return 'default';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'APPROVED':
      case 'VERIFIED':
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const steps = [
    { key: 'PENDING' as const, label: 'Pending Registration' },
    { key: 'APPROVED_LOGIN' as const, label: 'Access Approved' },
    { key: 'DOCUMENTS_SUBMITTED' as const, label: 'Documents Submitted' },
    { key: 'UNDER_REVIEW' as const, label: 'Under Review' },
    { key: 'APPROVED' as const, label: 'Approved' },
  ];

  const currentStepIndex = vendor ? steps.findIndex((s) => s.key === vendor.status) : -1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.companyName}</h1>
            <p className="text-muted-foreground mt-1">Vendor Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(vendor.status)} className="px-3 py-1 text-sm bg-muted/20 border-border">
            {vendor.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Application Progress</CardTitle>
              {vendor.status === 'APPROVED' && vendor.certificateNumber && (
                <div className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4" />
                  <span>Certified</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-4">
                {steps.map((step, index) => {
                  const isComplete = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 ${isComplete
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted bg-background text-muted-foreground'
                          }`}
                      >
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-medium ${isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                        >
                          {step.label}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t flex flex-wrap gap-3">
                {vendor.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={handleApproveRegistration}
                      disabled={isProcessing}
                      variant="default"
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isProcessing ? 'Approving...' : 'Approve Registration'}
                    </Button>
                    <Button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isProcessing}
                      variant="destructive"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      {isProcessing ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </>
                )}

                {vendor.status === 'DOCUMENTS_SUBMITTED' && (
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    variant="outline"
                    className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {isProcessing ? 'Sending...' : 'Request Revisions'}
                  </Button>
                )}

                {vendor.status === 'UNDER_REVIEW' && (
                  <Button
                    onClick={handleFinalApprove}
                    disabled={isProcessing}
                    variant="default"
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isProcessing ? 'Approving...' : 'Final Approve'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="border-b px-4">
              <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
                {(['overview', 'documents', 'submissions', 'activity'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 border-b-2 font-medium transition-colors capitalize whitespace-nowrap px-2 ${activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <CardContent className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Company Name</p>
                        <p className="font-medium">{vendor.companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Contact Person</p>
                        <p className="font-medium">{vendor.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Phone</p>
                        <p className="font-medium">{vendor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Location</p>
                        <p className="font-medium">
                          {vendor.address?.city && vendor.address?.country
                            ? `${vendor.address.city}, ${vendor.address.country}`
                            : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc._id} className="flex items-center justify-between p-4 bg-muted/30 border rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-background rounded-lg shadow-sm border">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.originalName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  {submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No proposal submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((submission) => (
                        <div key={submission._id} className="p-4 bg-muted/30 border rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">
                              Proposal: {submission.proposalId || 'Unknown'}
                            </p>
                            <Badge variant={getStatusVariant(submission.status)}>
                              {submission.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex flex-col">
                              <span className="text-xs uppercase font-medium tracking-wider mb-1">Amount</span>
                              <span className="font-medium text-foreground">{submission.proposedAmount?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs uppercase font-medium tracking-wider mb-1">Submitted</span>
                              <span className="font-medium text-foreground">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Activity log will be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm font-medium text-muted-foreground">Documents</span>
                <span className="font-bold text-lg">{documents.length}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm font-medium text-muted-foreground">Verified</span>
                <span className="font-bold text-lg text-primary">
                  {documents.filter((d) => d.status === 'VERIFIED').length}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm font-medium text-muted-foreground">Submissions</span>
                <span className="font-bold text-lg">{submissions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Accepted</span>
                <span className="font-bold text-lg text-primary">
                  {submissions.filter((s) => s.status === 'ACCEPTED').length}
                </span>
              </div>
            </CardContent>
          </Card>

          {vendor.certificateNumber && (
            <Card className="bg-primary border-primary text-primary-foreground shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-primary-foreground">Certificate</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/80 font-medium">Certificate Number</span>
                  <span className="font-bold tracking-wider">{vendor.certificateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/80 font-medium">Approval Date</span>
                  <span className="font-bold">
                    {vendor.approvalDate
                      ? new Date(vendor.approvalDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>
                {vendor.status === 'PENDING' ? 'Reject Vendor' : 'Request Revisions'}
              </CardTitle>
              <CardDescription>
                {vendor.status === 'PENDING'
                  ? 'Are you sure you want to reject this vendor registration?'
                  : 'Are you sure you want to request document revisions?'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Reason <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Provide a detailed description of why you are taking this action..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={vendor.status === 'PENDING' ? 'destructive' : 'default'}
                  onClick={
                    vendor.status === 'PENDING'
                      ? handleRejectRegistration
                      : handleRequestRevisions
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : vendor.status === 'PENDING' ? 'Reject Vendor' : 'Request Revisions'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
