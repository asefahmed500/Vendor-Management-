'use client';

import { useEffect, useState } from 'react';
import { 
  Award, 
  Download, 
  Calendar, 
  ShieldCheck,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { IVendor } from '@/lib/types/vendor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CertificatePage() {
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch('/api/vendor/profile');
        if (response.ok) {
          const result = await response.json();
          setVendor(result.data.vendor);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendor();
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/vendor/certificate');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${vendor?.certificateNumber || 'verified'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (vendor?.status !== 'APPROVED') {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <Badge variant="secondary" className="mb-3 font-medium">Certificate</Badge>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              Vendor Certificate
            </h1>
          </div>
        </div>
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">Not Eligible</h3>
            <p className="text-muted-foreground">
              Complete the verification process to receive your vendor certificate.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-3 font-medium">Certificate</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Vendor Certificate
          </h1>
          <p className="text-muted-foreground mt-1">
            Download your verified vendor certificate
          </p>
        </div>
      </div>

      {/* Certificate Card */}
      <Card className="border-border/50">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-success" />
            </div>
            
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Verified Vendor</h2>
              <p className="text-muted-foreground">
                {vendor?.companyName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 w-full max-w-md">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Certificate ID</p>
                <p className="font-mono font-medium">{vendor?.certificateNumber || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Issue Date</p>
                <p className="font-medium">
                  {vendor?.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Verified & Active</span>
            </div>

            <Button onClick={handleDownload} disabled={isDownloading} size="lg">
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading…
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}