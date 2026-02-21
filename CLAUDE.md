# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vendor Management System (VMS)** - a desktop web application for streamlining vendor onboarding, document management, and approval workflows. The system enables companies to register, submit business documents, and receive approval from administrators.

**Current Status**: Fully implemented with authentication, email notifications (Resend), document management, and certificate generation.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui # Run E2E tests with UI

# Database Seeding
npm run seed:admin   # Create initial admin user (email: admin@vms.com, password: Admin@123)
npm run reset:admin  # Reset admin password
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1 with App Router and Turbopack
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Database**: MongoDB with Mongoose ODM (not Supabase)
- **File Storage**: Cloudinary for document uploads
- **Authentication**: Custom JWT with httpOnly cookies
- **PDF Generation**: jsPDF for certificates
- **Email Service**: Resend (API key in .env.local)
- **Forms**: React Hook Form + Zod validation

### Database Models (MongoDB/Mongoose)

**Core Models:**
- `User` - Authentication (email, password, role: ADMIN/VENDOR, account lockout)
- `Vendor` - Company profile with status flow (userId reference to User)
- `Document` - Uploaded files (vendorId, documentTypeId, Cloudinary URLs)
- `DocumentType` - Document categories (BUSINESS_REGISTRATION, TAX, BANKING, etc.)
- `DocumentVerification` - Admin verification records with comments
- `ActivityLog` - Audit trail for vendor activities
- `EmailLog` - Email delivery tracking
- `PasswordResetToken` - Password reset tokens (1hr expiry)
- `Proposal` / `ProposalSubmission` / `ProposalRanking` - RFP/proposal management

**Key Relationships:**
- User → Vendor (1:1 via vendorProfile ObjectId)
- Vendor → Documents (1:Many)
- Document → DocumentVerification (1:1)
- Document → DocumentType (Many:1)

### Authentication & Authorization

**JWT Token System:**
- Access token: 15min expiry, stored in httpOnly cookie
- Refresh token: 7 days expiry, stored in httpOnly cookie
- Tokens extracted from cookie OR Authorization header

**Guards** (`lib/auth/guards.ts`):
```typescript
import { adminGuard, vendorGuard } from '@/lib/auth/guards';

// In API routes:
const { authorized, user } = await adminGuard(request); // For admin-only endpoints
const { authorized, user } = await vendorGuard(request); // For vendor-only endpoints
```

**Account Lockout:** 5 failed login attempts = 30-minute lock

### Vendor Status Flow

```
PENDING → APPROVED_LOGIN → DOCUMENTS_SUBMITTED → UNDER_REVIEW → APPROVED
                                                              ↓
                                                         REJECTED
```

- **PENDING**: Initial registration, awaiting admin approval (cannot login)
- **APPROVED_LOGIN**: Can login, must submit documents
- **DOCUMENTS_SUBMITTED**: All documents uploaded, awaiting review
- **UNDER_REVIEW**: Admin is actively reviewing
- **APPROVED**: Final approval, certificate generated
- **REJECTED**: Application rejected (can happen at any stage)

### Email Service

**Resend Integration** (`lib/email/`):
- Templates in `lib/email/templates/*.tsx` return `{ subject, html }`
- All emails logged to EmailLog collection
- Use `sendEmail()` helper which handles logging automatically

**Email Triggers:**
- Vendor registers → confirmation email to vendor + notification to admin
- Admin approves registration → approval email to vendor
- Admin rejects → rejection email with reason
- Vendor submits documents → confirmation to vendor + notification to admin
- Admin verifies document → notification to vendor
- Admin requests revisions → details to vendor
- Final approval → email with certificate PDF attachment
- Password reset → reset link with token

**Certificate Email Attachment:**
```typescript
const pdfBuffer = Buffer.from(await generateCertificatePDF(vendor).arrayBuffer());
await sendEmail({
  to: vendorUser.email,
  subject: '...',
  html: '...',
  attachments: [{ filename: 'certificate.pdf', content: pdfBuffer }],
});
```

### Path Aliases
- `@/*` → `./` (root directory)

## API Structure

### Authentication
- `POST /api/auth/register` - Vendor self-registration (public, sends emails)
- `POST /api/auth/login` - Login with rate limiting, account lockout
- `POST /api/auth/logout` - Clear cookies
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-reset-token` - Verify reset token validity

### Vendor (Protected, requires VENDOR role)
- `GET /api/vendor/profile` - Get vendor profile
- `PUT /api/vendor/profile` - Update vendor profile
- `GET /api/vendor/documents` - List vendor's documents
- `POST /api/vendor/documents` - Upload document to Cloudinary
- `DELETE /api/vendor/documents/:id` - Delete document
- `PUT /api/vendor/documents` - Submit all documents for review
- `GET /api/vendor/certificate` - Download certificate PDF
- `GET /api/vendor/proposals` - Browse available proposals
- `GET /api/vendor/proposals/:id` - Get proposal details
- `GET /api/vendor/proposals/submissions` - View own submissions

### Admin (Protected, requires ADMIN role)
- `GET /api/admin/vendors` - List vendors with pagination/filtering
- `POST /api/admin/vendors` - Create vendor manually
- `GET /api/admin/vendors/:id` - Get vendor details
- `PUT /api/admin/vendors/:id/approve-registration` - Approve vendor to login
- `PUT /api/admin/vendors/:id/reject-registration` - Reject vendor
- `PUT /api/admin/vendors/:id/request-revisions` - Request document revisions
- `PUT /api/admin/vendors/:id/final-approve` - Final approval + generate certificate
- `GET /api/admin/documents` - List all documents
- `PUT /api/admin/documents/:id/verify` - Verify/reject document with comments
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/audit-logs` - Activity logs
- `GET /api/admin/proposals` - List proposals
- `POST /api/admin/proposals` - Create proposal
- `GET /api/admin/proposals/:id` - Get proposal details
- `PUT /api/admin/proposals/:id` - Update proposal
- `DELETE /api/admin/proposals/:id` - Delete proposal
- `GET /api/admin/proposals/:id/submissions` - Get proposal submissions

## Page Routes

### Public
- `/` - Landing page
- `/register` - Vendor registration (public, sends confirmation emails)
- `/login` - Login for both admin and vendor
- `/forgot-password` - Password reset request

### Admin (ADMIN role required)
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/vendors` - Vendor management list
- `/admin/vendors/:id` - Vendor details with action buttons
- `/admin/documents` - Document verification interface
- `/admin/proposals` - Proposal management
- `/admin/proposals/create` - Create new proposal
- `/admin/proposals/:id` - Proposal details
- `/admin/proposals/:id/submissions` - View submissions
- `/admin/audit-logs` - Activity logs
- `/admin/create-vendor` - Manual vendor creation

### Vendor (VENDOR role required)
- `/vendor/dashboard` - Status overview and quick actions
- `/vendor/profile` - Company profile management
- `/vendor/documents` - Document upload and management
- `/vendor/certificate` - View/download certificate
- `/vendor/proposals` - Browse and respond to proposals

## Document Types

Categories (from `DocumentType` model):
- **BUSINESS_REGISTRATION**: Certificate of Incorporation, Business Registration, Articles/Memorandum
- **TAX**: TIN, VAT Certificate, Tax Compliance, Tax Returns
- **BANKING**: Bank Account Details, Cancelled Cheque, Bank Letter
- **CERTIFICATES_LICENCES**: Trade License, Professional Licenses, ISO Certifications
- **INSURANCE**: General Liability, Professional Indemnity, Workers Compensation
- **CUSTOM**: Admin can add additional types

**File Constraints**: PDF, JPG, PNG, DOCX only. Max 10MB per file. Stored on Cloudinary.

## Important Context

1. **MongoDB not Supabase**: The project uses MongoDB with Mongoose ODM (not PostgreSQL/Supabase as mentioned in older docs). Connection string in `MONGODB_URI` env var.

2. **Single Admin**: v1.0 supports only one admin account. Seed with `npm run seed:admin` (admin@vms.com / Admin@123).

3. **Vendor Cannot Login Initially**: New registrations start with `PENDING` status. Vendor can only login after admin approves registration → status becomes `APPROVED_LOGIN`.

4. **Certificate Number Format**: `VND-{YYYYMMDD}-{XXXXXX}` where date is registration date and XXXXXX is random alphanumeric.

5. **Email via Resend**: All email notifications use Resend service. API key in `RESEND_API_KEY` env var. From email in `RESEND_FROM_EMAIL`.

6. **Cloudinary Storage**: Documents uploaded to Cloudinary under folder structure `vms-documents/{vendorId}/`. Use `uploadBuffer()` from `lib/cloudinary/config`.

7. **Proposal System**: Additional RFP/proposal management beyond basic vendor onboarding.

8. **Password Reset Flow**: Tokens expire in 1 hour, stored in `PasswordResetToken` collection.

## Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT Secrets
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Vendor Management System

# Email (Resend - primary)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@resend.dev

# File Upload
MAX_FILE_SIZE=10485760

# Admin Seed
ADMIN_EMAIL=admin@vms.com
ADMIN_PASSWORD=Admin@123

# Cloudinary
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...
```

## Common Patterns

### Creating a Protected API Route
```typescript
import { adminGuard } from '@/lib/auth/guards';

export async function GET(request: NextRequest) {
  const { authorized, user } = await adminGuard(request);
  if (!authorized || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of handler
}
```

### Sending an Email
```typescript
import { sendEmail, RegistrationApprovedEmail } from '@/lib/email';

const emailContent = RegistrationApprovedEmail({
  companyName: vendor.companyName,
  contactPerson: vendor.contactPerson,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
});

await sendEmail({
  to: user.email,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### Activity Logging
```typescript
const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
await ActivityLog.create({
  vendorId: vendor._id,
  performedBy: user.userId,
  activityType: 'DOCUMENT_VERIFIED',
  description: 'Document verified successfully',
  metadata: { documentId: doc._id },
});
```
