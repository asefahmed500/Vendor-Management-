export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type VerificationStatus = 'VERIFIED' | 'REJECTED';

export type DocumentCategory =
  | 'BUSINESS_REGISTRATION'
  | 'TAX'
  | 'BANKING'
  | 'CERTIFICATES_LICENCES'
  | 'INSURANCE'
  | 'CUSTOM';

export interface IDocumentType {
  _id: string;
  name: string;
  category: DocumentCategory;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  allowedFormats: string[];
  maxSizeMB: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: string;
  vendorId: string;
  documentTypeId: string;
  documentType?: IDocumentType;
  fileName: string;
  originalName: string;
  fileUrl: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  status: DocumentStatus;
  isRequired: boolean;
  uploadedAt: Date;
  verification?: IDocumentVerification;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentVerification {
  _id: string;
  documentId: string;
  verifiedBy: string;
  status: VerificationStatus;
  comments?: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentUploadInput {
  documentTypeId: string;
  file: File;
}

export interface IVerifyDocumentInput {
  status: VerificationStatus;
  comments?: string;
}

export interface IDocumentWithVerification extends IDocument {
  verification: IDocumentVerification;
  documentType: IDocumentType;
}
