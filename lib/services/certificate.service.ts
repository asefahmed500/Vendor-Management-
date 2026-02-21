import jsPDF from 'jspdf';
import { IVendor } from '@/lib/types/vendor';

export function generateCertificatePDF(vendor: IVendor): Blob {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setFillColor(37, 99, 235);
  doc.rect(10, 10, pageWidth - 20, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF APPROVAL', pageWidth / 2, 22, { align: 'center' });

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Vendor Management System', pageWidth / 2, 35, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(30, 45, pageWidth - 30, 45);

  doc.setFontSize(12);
  doc.text('This is to certify that', pageWidth / 2, 55, { align: 'center' });

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(vendor.companyName, pageWidth / 2, 70, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('has been approved as an authorized vendor', pageWidth / 2, 80, { align: 'center' });

  doc.setFillColor(243, 244, 246);
  doc.roundedRect(pageWidth / 2 - 80, 90, 160, 40, 3, 3, 'F');

  doc.setFontSize(10);
  doc.text('Certificate Details', pageWidth / 2, 98, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Certificate Number: ${vendor.certificateNumber || 'N/A'}`, pageWidth / 2, 108, { align: 'center' });
  doc.text(`Registration Date: ${new Date(vendor.registrationDate).toLocaleDateString()}`, pageWidth / 2, 116, { align: 'center' });

  if (vendor.approvalDate) {
    doc.text(`Approval Date: ${new Date(vendor.approvalDate).toLocaleDateString()}`, pageWidth / 2, 124, { align: 'center' });
  }

  doc.text(`Contact Person: ${vendor.contactPerson}`, pageWidth / 2, 132, { align: 'center' });
  doc.text(`Phone: ${vendor.phone}`, pageWidth / 2, 140, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.line(30, pageHeight - 40, pageWidth - 30, pageHeight - 40);

  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(
    'This certificate is issued by the Vendor Management System as proof of vendor approval.',
    pageWidth / 2,
    pageHeight - 30,
    { align: 'center' }
  );
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    pageWidth / 2,
    pageHeight - 25,
    { align: 'center' }
  );

  return doc.output('blob');
}

export function validateCertificateNumber(number: string): boolean {
  const regex = /^VND-[A-Z0-9]+-[A-Z0-9]{6}$/;
  return regex.test(number);
}
