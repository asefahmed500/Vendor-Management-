# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vendor Management System (VMS)** - a desktop web application for vendor onboarding, document management, and approval workflows.

**Current Status**: Production-ready with authentication, email notifications (Resend), document management, certificate generation, and comprehensive test suite.

## Development Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing (Jest - Unit/Integration)
npm test             # Run all Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm test -- path/to/test.test.ts # Run specific test file

# Testing (Playwright - E2E)
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui # Run E2E tests with UI

# Database
npm run seed:admin   # Create initial admin user (admin@vms.com / Admin@123)
npm run reset:admin  # Reset admin password
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Auth**: Better Auth with MongoDB adapter (database sessions, scrypt hashing, 7-day expiry)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Forms**: React Hook Form + Zod
- **Email**: Resend
- **PDF**: jsPDF
- **Real-time**: Server-Sent Events (SSE) for notifications
- **Testing**: Jest + Playwright
- **UI Components**: shadcn/ui (Button, Card, Input, Badge, etc.)

### Authentication Architecture

**Better Auth Session Structure:**
- Session user object has `id` property (MongoDB `_id`), NOT `userId`
- When querying Vendor by userId, use `user.id` not `user.userId`
- Access/refresh tokens stored in httpOnly cookies

**Auth Guards** (`lib/auth/guards.ts`):
```typescript
import { adminGuard, vendorGuard, authGuard } from '@/lib/auth/guards';

// In API routes:
const { authorized, user } = await adminGuard(request);
// Returns: { authorized: boolean, user: SessionUser | null, error: string | null }

// SessionUser interface:
// { id: string, email: string, name: string, role: 'ADMIN' | 'VENDOR', ... }
```

**Account Lockout:** 5 failed login attempts = 30-minute lock

### Database Models (MongoDB/Mongoose)

**Core Models:**
- `User` - Auth (email, password, role: ADMIN/VENDOR, vendorProfile ObjectId, isActive)
- `Vendor` - Company profile (userId reference to User._id, status flow, certificateNumber)
- `Document` - Uploaded files (vendorId, documentTypeId, Cloudinary URLs)
- `DocumentType` - Document categories
- `DocumentVerification` - Admin verification records with comments
- `Notification` - Real-time notifications (userId, type, title, message, link, read, metadata)
- `Proposal` / `ProposalSubmission` / `ProposalRanking` - RFP management
- `ActivityLog` - Audit trail
- `EmailLog` - Email delivery tracking
- `PasswordResetToken` - Password reset (1hr expiry)

**Relationships:**
- User → Vendor (1:1 via User.vendorProfile ObjectId)
- Vendor → Documents (1:Many)
- Document → DocumentVerification (1:1)
- Document → DocumentType (Many:1)

### Vendor Status Flow

```
PENDING → APPROVED_LOGIN → DOCUMENTS_SUBMITTED → UNDER_REVIEW → APPROVED
                                                              ↓
                                                         REJECTED
```

- **PENDING**: New registration, cannot login
- **APPROVED_LOGIN**: Can login, must submit documents
- **DOCUMENTS_SUBMITTED**: All documents uploaded
- **UNDER_REVIEW**: Admin actively reviewing
- **APPROVED**: Certificate generated
- **REJECTED**: Application rejected

### Middleware & Edge Runtime

**IMPORTANT:** Better Auth requires Node.js runtime (incompatible with Edge).

**Solution:** Uses `proxy.ts` pattern instead of `middleware.ts` - handles route protection at build time, defers full auth checks to API route guards.

**CSS Configuration:** Tailwind CSS v4 uses `@import "tailwindcss"` instead of `@tailwind` directives. PostCSS config: `plugins: ["@tailwindcss/postcss"]`

**Security:** CSP headers configured in `next.config.ts`

### Admin User Management

**Creating Admin User:**
Better Auth uses scrypt hashing. To create admin user, use the sign-up endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vms.com","password":"Admin@123","name":"Admin User"}'
```

Then update role to ADMIN via MongoDB or use scripts in `scripts/` directory.

**Admin Scripts:**
- `npm run seed:admin` - Uses bcrypt hashing (NOT compatible with Better Auth sign-in)
- `scripts/createBetterAuthAdmin.ts` - Uses Better Auth scrypt hashing
- `scripts/setAdminRole.ts` - Updates user to ADMIN role
- `scripts/cleanupAdminUsers.ts` - Cleans duplicate users

### Notification System (SSE)

**Server Endpoint:** `/api/notifications/stream`
- Polls every 10 seconds for unread count
- Client connects via EventSource

**Client Hook:** `hooks/use-notifications.ts`
```typescript
const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
```

**Notification Service:** `lib/notifications/service.ts`
- `createNotification()` - Create single notification
- `notifyDocumentVerified()` - Document verified/rejected
- `notifyProposalUpdate()` - Proposal status change
- `notifyVendorStatusChanged()` - Vendor status update

### Email Service (Resend)

**Templates:** `lib/email/templates/*.tsx`
- Each template returns `{ subject, html }`

**Helper:** `sendEmail()` automatically logs to EmailLog collection

**Triggers:**
- Vendor registers → confirmation to vendor + notification to admin
- Admin approves registration → approval email
- Admin rejects → rejection email with reason
- Document verified → notification to vendor
- Final approval → email with certificate PDF attachment

### Certificate Generation

**Service:** `lib/services/certificate.service.ts`
- `generateCertificatePDF(vendor)` - Returns PDF Blob
- Uses jsPDF with landscape orientation

**Number Format:** `VND-{YYYYMMDD}-{XXXXXX}`
- Generated in `lib/utils/certificate.ts`

### API Route Structure

**Authentication:**
- `POST /api/auth/register` - Vendor registration (public)
- `POST /api/auth/login` - Login (rate-limited, account lockout)
- `POST /api/auth/logout` - Clear cookies
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset with token

**Vendor (VENDOR role):**
- `GET/PUT /api/vendor/profile` - Profile management
- `GET /api/vendor/documents` - List documents
- `POST /api/vendor/documents` - Upload to Cloudinary
- `DELETE /api/vendor/documents/:id` - Delete document
- `PUT /api/vendor/documents` - Submit for review
- `GET /api/vendor/certificate` - Download PDF
- `GET /api/vendor/proposals` - Browse proposals
- `GET /api/vendor/proposals/:id` - Get details
- `GET /api/vendor/proposals/submissions` - My submissions

**Admin (ADMIN role):**
- `GET /api/admin/vendors` - List vendors (paginated, filtered)
- `POST /api/admin/vendors` - Create vendor manually
- `GET /api/admin/vendors/:id` - Vendor details
- `PUT /api/admin/vendors/:id/approve-registration` - Approve to login
- `PUT /api/admin/vendors/:id/reject-registration` - Reject
- `PUT /api/admin/vendors/:id/request-revisions` - Request revisions
- `PUT /api/admin/vendors/:id/final-approve` - Final approve + certificate
- `GET /api/admin/documents` - List all documents
- `PUT /api/admin/documents/:id/verify` - Verify with comments
- `GET /api/admin/dashboard/stats` - Statistics
- `GET /api/admin/audit-logs` - Activity logs
- `GET/POST/PUT/DELETE /api/admin/proposals` - Proposal management
- `GET /api/admin/proposals/:id/submissions` - Get submissions

### Page Routes

**Public:**
- `/` - Landing page
- `/register` - Vendor registration
- `/login` - Login (admin/vendor)
- `/forgot-password` - Password reset

**Admin:**
- `/admin/dashboard` - Statistics dashboard
- `/admin/vendors` - Vendor list
- `/admin/vendors/:id` - Vendor details
- `/admin/documents` - Document verification
- `/admin/proposals` - Proposal management
- `/admin/proposals/create` - Create proposal
- `/admin/audit-logs` - Activity logs

**Vendor:**
- `/vendor/dashboard` - Status overview
- `/vendor/profile` - Profile management
- `/vendor/documents` - Document upload
- `/vendor/certificate` - View/download certificate
- `/vendor/proposals` - Browse proposals

### Document Types

**Categories:** BUSINESS_REGISTRATION, TAX, BANKING, CERTIFICATES_LICENCES, INSURANCE, CUSTOM

**Constraints:** PDF, JPG, PNG, DOCX only. Max 10MB. Stored on Cloudinary.

## Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Vendor Management System

# Email (Resend)
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

## Important Patterns

### Protected API Route
```typescript
import { adminGuard } from '@/lib/auth/guards';
import { handleApiError } from '@/lib/middleware/errorHandler';

export async function GET(request: NextRequest) {
  const { authorized, user } = await adminGuard(request);
  if (!authorized || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // ... logic
  } catch (error) {
    return handleApiError(error, 'OperationName');
  }
}
```

### Send Email
```typescript
import { sendEmail, DocumentVerifiedEmail } from '@/lib/email';

const emailContent = DocumentVerifiedEmail({
  companyName: vendor.companyName,
  documentName: docType.name,
  verifiedAt: new Date().toISOString(),
  dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/documents`,
});

await sendEmail({
  to: user.email,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### Create Notification
```typescript
import { notifyDocumentVerified } from '@/lib/notifications/service';

await notifyDocumentVerified(
  vendorUser.id,  // Use user.id for Better Auth
  'tax_certificate.pdf',
  true,  // verified
  'Document looks good'
);
```

### Activity Logging
```typescript
const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
await ActivityLog.create({
  vendorId: vendor._id,
  performedBy: user.id,  // Better Auth uses 'id'
  activityType: 'DOCUMENT_VERIFIED',
  description: 'Document verified successfully',
  metadata: { documentId: doc._id },
});
```

### Cloudinary Upload
```typescript
import { uploadBuffer } from '@/lib/cloudinary/config';

const result = await uploadBuffer(
  fileBuffer,
  `vms-documents/${vendorId}/${filename}`
);
```

## Testing Notes

**Jest Configuration:**
- Uses next-jest preset
- transformIgnorePatterns includes: bson, mongodb, mongoose, cloudinary, better-auth
- Tests in `__tests__` directories or `*.test.ts` files
- Setup file: `jest.setup.js`

**E2E Configuration:**
- Playwright with dev server startup
- Tests in `e2e/` directory
- Global setup: `e2e/global-setup.ts`

**Test Credentials:**
- Admin: admin@vms.com / Admin@123

**Known Issues:**
- E2E tests may require middleware adjustments due to edge runtime limitations
- Better Auth uses Node.js 'stream' module which is edge-incompatible
- Next.js 16 auto-converts middleware to proxy to handle this

## Path Aliases
- `@/*` → Root directory

## UI Components (shadcn/ui)

**Components Location:** `components/ui/`

**Available Components:**
- Button - Standard variants (default, destructive, outline, secondary, ghost, link)
- Card - Standard shadcn/ui structure
- Input - With label, error, helperText support
- Badge - Variants (default, secondary, destructive, outline)
- Form, FormField, FormItem, FormLabel, FormMessage
- Alert, AlertDescription
- And other shadcn/ui components

**Design Tokens (globals.css):**
```css
--primary: 263 83% 58% (Purple #7C3AED)
--accent: 24 95% 53% (Orange #F97316)
--background: 0 0% 100%
--foreground: 240 10% 3.9%
--radius: 0.5rem
```

**CSS Important Notes:**
- Tailwind v4 uses `@import "tailwindcss"` NOT `@tailwind` directives
- Do NOT use `@apply` with CSS variables like `@apply border-border`
- Use direct CSS properties or Tailwind utilities instead
- Base styles defined in `@layer base` without @apply for custom variables
