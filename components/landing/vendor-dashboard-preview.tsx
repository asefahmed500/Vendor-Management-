'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Briefcase, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data for vendor preview
const mockDocuments = [
  { name: 'Business Registration', status: 'VERIFIED', type: 'PDF' },
  { name: 'Tax Compliance Certificate', status: 'VERIFIED', type: 'PDF' },
  { name: 'Insurance Certificate', status: 'UNDER_REVIEW', type: 'PDF' },
  { name: 'Bank Account Details', status: 'PENDING', type: 'DOCX' },
];

const mockProposals = [
  { title: 'Office Supplies Contract 2024', value: '$50,000', deadline: '5 days', status: 'OPEN' },
  { title: 'IT Infrastructure Upgrade', value: '$120,000', deadline: '12 days', status: 'OPEN' },
  { title: 'Facility Management Services', value: '$75,000', deadline: 'Closed', status: 'CLOSED' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'default' | 'danger'> = {
  VERIFIED: 'success',
  UNDER_REVIEW: 'warning',
  PENDING: 'default',
  OPEN: 'success',
  CLOSED: 'danger',
};

export function VendorDashboardPreview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'proposals'>('overview');
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const intervals = [0, 1, 2, 3].map((i) =>
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [i]: true }));
      }, 100 + i * 150)
    );
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <Card className="overflow-hidden border-2 shadow-2xl rounded-3xl bg-background">
      {/* Simulated Header */}
      <header className="bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Vendor Portal</div>
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">PARTNER DASHBOARD</div>
          </div>
        </div>
        <Badge variant="success" className="text-[10px] px-2 py-1">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      </header>

      {/* Simulated Tabs */}
      <div className="flex border-b bg-muted/30 px-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'documents'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'proposals'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Opportunities
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Progress */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="p-6">
            <h3 className="font-bold text-sm mb-4">Onboarding Progress</h3>
            <div className="space-y-3">
              {[
                { label: 'Registration Complete', done: true },
                { label: 'Documents Submitted', done: true },
                { label: 'Verification Pending', done: false },
                { label: 'Access Approved', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    step.done ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.done ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Documents List */}
        {activeTab === 'overview' && (
          <Card className="bg-muted/20">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-sm">My Documents</h3>
              <Badge variant="secondary" className="text-[10px]">3/4 Uploaded</Badge>
            </div>
            <div className="divide-y">
              {mockDocuments.map((doc, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doc.type} • 2.4 MB</div>
                    </div>
                  </div>
                  <Badge variant={statusVariant[doc.status]} className="text-[10px] px-2 py-0.5">
                    {doc.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
              <div className="p-4">
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-all">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Proposals */}
        {activeTab === 'documents' && (
          <Card className="bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-bold text-sm">Required Documents</h3>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: 'Certificate of Incorporation', required: true },
                { name: 'Tax Clearance Certificate', required: true },
                { name: 'Professional License', required: true },
                { name: 'Insurance Certificate', required: true },
                { name: 'Bank Reference Letter', required: false },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    {doc.required && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <Badge variant={doc.required ? 'secondary' : 'success'} className="text-[10px]">
                    {doc.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Opportunities */}
        {activeTab === 'proposals' && (
          <Card className="bg-muted/20">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-sm">Open Opportunities</h3>
              <Badge variant="success" className="text-[10px]">3 Active</Badge>
            </div>
            <div className="divide-y">
              {mockProposals.map((proposal, i) => (
                <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{proposal.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{proposal.value}</span>
                        <span>•</span>
                        <span>{proposal.deadline}</span>
                      </div>
                    </div>
                    <Badge variant={statusVariant[proposal.status]} className="text-[10px] px-2 py-0.5">
                      {proposal.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}
